from django.contrib.auth import update_session_auth_hash
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from config.cloudinary_utils import upload_file
from config.email_utils import send_portal_email
from config.response import api_response, format_validation_error

from .models import PasswordResetOTP, User
from .serializers import (
    ChangePasswordSerializer,
    DoctorRegisterSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    PatientRegisterSerializer,
    ResetPasswordSerializer,
    UpdateProfileSerializer,
    UserSerializer,
    VerifyOTPSerializer,
)


def set_auth_cookies(response, refresh):
    access_token = str(refresh.access_token)
    response.set_cookie("access_token", access_token, httponly=True, samesite="Lax", secure=False)
    response.set_cookie("refresh_token", str(refresh), httponly=True, samesite="Lax", secure=False)


class RegisterPatientView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = PatientRegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            send_portal_email(
                "Welcome to Doctor Portal",
                f"Hi {user.name}, your patient account has been created successfully.",
                [user.email],
            )
            return api_response(True, "Patient registered successfully", {"user": UserSerializer(user).data}, status.HTTP_201_CREATED)
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to register patient: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterDoctorView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            payload = request.data.copy()
            if request.FILES.get("profile_photo"):
                payload["profile_photo"] = upload_file(request.FILES["profile_photo"], "doctor-portal/doctors")
            serializer = DoctorRegisterSerializer(data=payload)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            send_portal_email(
                "Doctor registration received",
                f"Hi {user.name}, your doctor account is pending admin approval.",
                [user.email],
            )
            return api_response(
                True,
                "Doctor registered successfully and is pending approval",
                {"user": UserSerializer(user).data},
                status.HTTP_201_CREATED,
            )
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to register doctor: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            response = api_response(True, "Login successful", {"user": UserSerializer(user).data})
            set_auth_cookies(response, refresh)
            return response
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to login: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if refresh_token:
                RefreshToken(refresh_token).blacklist()
            response = api_response(True, "Logout successful")
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response
        except Exception as exc:
            return api_response(False, f"Unable to logout: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = ForgotPasswordSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            email = serializer.validated_data["email"]
            if not User.objects.filter(email=email).exists():
                return api_response(False, "No account found with this email", status_code=status.HTTP_404_NOT_FOUND)
            otp_record = PasswordResetOTP.generate_otp(email)
            send_portal_email("Doctor Portal OTP", f"Your password reset OTP is {otp_record.otp}", [email])
            return api_response(True, "OTP sent successfully")
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to send OTP: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = VerifyOTPSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            otp_record = PasswordResetOTP.objects.filter(
                email=serializer.validated_data["email"],
                otp=serializer.validated_data["otp"],
            ).first()
            if not otp_record or otp_record.is_expired():
                return api_response(False, "Invalid or expired OTP", status_code=status.HTTP_400_BAD_REQUEST)
            otp_record.is_verified = True
            otp_record.save(update_fields=["is_verified"])
            return api_response(True, "OTP verified successfully")
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to verify OTP: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = ResetPasswordSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            otp_record = PasswordResetOTP.objects.filter(email=serializer.validated_data["email"], is_verified=True).first()
            if not otp_record or otp_record.is_expired():
                return api_response(False, "OTP verification is required", status_code=status.HTTP_400_BAD_REQUEST)
            user = User.objects.get(email=serializer.validated_data["email"])
            user.set_password(serializer.validated_data["password"])
            user.save(update_fields=["password"])
            otp_record.delete()
            return api_response(True, "Password reset successful")
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to reset password: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @ensure_csrf_cookie
    def get(self, request):
        try:
            return api_response(True, "Profile fetched successfully", {"user": UserSerializer(request.user).data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch profile: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        try:
            payload = request.data.copy()
            if request.FILES.get("avatar"):
                payload["avatar"] = upload_file(request.FILES["avatar"], "doctor-portal/users")
            serializer = UpdateProfileSerializer(request.user, data=payload, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return api_response(True, "Profile updated successfully", {"user": UserSerializer(request.user).data})
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to update profile: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        try:
            serializer = ChangePasswordSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            if not request.user.check_password(serializer.validated_data["current_password"]):
                return api_response(False, "Current password is incorrect", status_code=status.HTTP_400_BAD_REQUEST)
            request.user.set_password(serializer.validated_data["new_password"])
            request.user.save(update_fields=["password"])
            update_session_auth_hash(request, request.user)
            return api_response(True, "Password changed successfully")
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to change password: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

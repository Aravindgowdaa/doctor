from django.contrib.auth import authenticate
from rest_framework import serializers

from config.cloudinary_utils import upload_file
from apps.doctors.models import DoctorProfile

from .models import PasswordResetOTP, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "email", "phone", "role", "gender", "dob", "avatar", "is_blocked", "created_at")


class PatientRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    dob = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ("name", "email", "phone", "password", "gender", "dob")

    def create(self, validated_data):
        return User.objects.create_user(role="patient", **validated_data)


class DoctorRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    dob = serializers.DateField(required=False, allow_null=True)
    specialization = serializers.CharField()
    qualification = serializers.CharField()
    experience = serializers.IntegerField(min_value=0)
    bio = serializers.CharField()
    clinic_name = serializers.CharField()
    clinic_address = serializers.CharField()
    city = serializers.CharField()
    consultation_fee = serializers.DecimalField(max_digits=10, decimal_places=2)
    profile_photo = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = (
            "name",
            "email",
            "phone",
            "password",
            "gender",
            "dob",
            "specialization",
            "qualification",
            "experience",
            "bio",
            "clinic_name",
            "clinic_address",
            "city",
            "consultation_fee",
            "profile_photo",
        )

    def create(self, validated_data):
        existing_user = User.objects.filter(email=validated_data["email"]).first()
        doctor_fields = {
            "specialization": validated_data.pop("specialization"),
            "qualification": validated_data.pop("qualification"),
            "experience": validated_data.pop("experience"),
            "bio": validated_data.pop("bio"),
            "clinic_name": validated_data.pop("clinic_name"),
            "clinic_address": validated_data.pop("clinic_address"),
            "city": validated_data.pop("city"),
            "consultation_fee": validated_data.pop("consultation_fee"),
            "email": validated_data["email"],
            "phone": validated_data["phone"],
        }
        profile_photo = validated_data.pop("profile_photo", "")
        if hasattr(profile_photo, "read"):
            profile_photo = upload_file(profile_photo, "doctor-portal/doctors")
        doctor_fields["profile_photo"] = profile_photo or ""

        if existing_user:
            if existing_user.role == "doctor":
                raise serializers.ValidationError({"email": "A doctor account with this email already exists."})
            if existing_user.role == "admin":
                raise serializers.ValidationError({"email": "An admin account with this email already exists."})

            existing_user.name = validated_data["name"]
            existing_user.phone = validated_data["phone"]
            existing_user.role = "doctor"
            existing_user.gender = validated_data.get("gender", "")
            existing_user.dob = validated_data.get("dob")
            existing_user.set_password(validated_data["password"])
            existing_user.save()
            user = existing_user
        else:
            user = User.objects.create_user(role="doctor", **validated_data)

        DoctorProfile.objects.create(user=user, **doctor_fields)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=False)

    def validate(self, attrs):
        email = (attrs.get("email") or "").strip()
        matched_user = User.objects.filter(email__iexact=email).first()
        if not matched_user:
            raise serializers.ValidationError("Invalid email or password")

        user = authenticate(email=matched_user.email, password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        selected_role = attrs.get("role")
        if selected_role and selected_role != user.role:
            raise serializers.ValidationError(
                f"This account is registered as {user.role}. Please choose the {user.role} login tab."
            )
        if user.is_blocked:
            raise serializers.ValidationError("This account has been blocked by admin")
        if user.role == "doctor":
            doctor_profile = getattr(user, "doctor_profile", None)
            if doctor_profile and not doctor_profile.is_approved:
                raise serializers.ValidationError("Doctor account is pending admin approval")
        attrs["role"] = user.role
        attrs["user"] = user
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class VerifyOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetOTP
        fields = ("email", "otp")


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("name", "phone", "gender", "dob", "avatar")

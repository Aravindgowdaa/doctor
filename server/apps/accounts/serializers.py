from django.contrib.auth import authenticate
from rest_framework import serializers

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
    profile_photo = serializers.URLField(required=False, allow_blank=True)

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
        doctor_fields = {
            "specialization": validated_data.pop("specialization"),
            "qualification": validated_data.pop("qualification"),
            "experience": validated_data.pop("experience"),
            "bio": validated_data.pop("bio"),
            "clinic_name": validated_data.pop("clinic_name"),
            "clinic_address": validated_data.pop("clinic_address"),
            "city": validated_data.pop("city"),
            "consultation_fee": validated_data.pop("consultation_fee"),
            "profile_photo": validated_data.pop("profile_photo", ""),
            "email": validated_data["email"],
            "phone": validated_data["phone"],
        }
        user = User.objects.create_user(role="doctor", **validated_data)
        DoctorProfile.objects.create(user=user, **doctor_fields)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    def validate(self, attrs):
        user = authenticate(email=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        if user.role != attrs["role"]:
            raise serializers.ValidationError("Role mismatch for this account")
        if user.is_blocked:
            raise serializers.ValidationError("This account has been blocked by admin")
        if user.role == "doctor":
            doctor_profile = getattr(user, "doctor_profile", None)
            if doctor_profile and not doctor_profile.is_approved:
                raise serializers.ValidationError("Doctor account is pending admin approval")
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

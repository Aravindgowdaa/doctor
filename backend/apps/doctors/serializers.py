from rest_framework import serializers

from apps.reviews.models import Review

from .models import BlockedDate, DoctorProfile, WeeklyAvailability


class WeeklyAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyAvailability
        fields = ("id", "day", "start_time", "end_time", "slot_duration")


class BlockedDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedDate
        fields = ("id", "date")


class DoctorProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    available_slots = WeeklyAvailabilitySerializer(many=True, read_only=True)
    blocked_dates = BlockedDateSerializer(many=True, read_only=True)

    class Meta:
        model = DoctorProfile
        fields = (
            "id",
            "user",
            "specialization",
            "qualification",
            "experience",
            "bio",
            "clinic_name",
            "clinic_address",
            "city",
            "consultation_fee",
            "phone",
            "email",
            "profile_photo",
            "available_slots",
            "blocked_dates",
            "is_approved",
            "is_rejected",
            "average_rating",
            "total_reviews",
            "total_bookings",
        )

    def get_user(self, obj):
        return {
            "id": obj.user_id,
            "name": obj.user.name,
            "email": obj.user.email,
            "phone": obj.user.phone,
            "gender": obj.user.gender,
            "dob": obj.user.dob,
            "avatar": obj.user.avatar,
            "is_blocked": obj.user.is_blocked,
            "created_at": obj.user.created_at,
        }


class DoctorListSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = (
            "id",
            "user",
            "specialization",
            "qualification",
            "experience",
            "city",
            "consultation_fee",
            "profile_photo",
            "average_rating",
            "total_reviews",
            "total_bookings",
        )

    def get_user(self, obj):
        return {"id": obj.user_id, "name": obj.user.name, "is_blocked": obj.user.is_blocked}


class DoctorProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = (
            "specialization",
            "qualification",
            "experience",
            "bio",
            "clinic_name",
            "clinic_address",
            "city",
            "consultation_fee",
            "phone",
            "email",
            "profile_photo",
        )


class AvailabilityBulkSerializer(serializers.Serializer):
    slots = WeeklyAvailabilitySerializer(many=True)


class BlockDateCreateSerializer(serializers.Serializer):
    date = serializers.DateField()

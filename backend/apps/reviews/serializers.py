from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    patient = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ("id", "doctor", "patient", "appointment", "rating", "comment", "created_at")

    def get_patient(self, obj):
        return {"id": obj.patient_id, "name": obj.patient.name, "avatar": obj.patient.avatar}


class CreateReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ("doctor", "appointment", "rating", "comment")

    def validate(self, attrs):
        patient = self.context["request"].user
        appointment = attrs["appointment"]
        if appointment.patient != patient:
            raise serializers.ValidationError("You can only review your own appointments")
        if appointment.status != "completed":
            raise serializers.ValidationError("Only completed appointments can be reviewed")
        if appointment.doctor_id != attrs["doctor"].id:
            raise serializers.ValidationError("Doctor does not match the appointment")
        return attrs

from datetime import datetime, timedelta

from rest_framework import serializers

from apps.doctors.models import DoctorProfile

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient = serializers.SerializerMethodField()
    doctor = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = (
            "id",
            "patient",
            "doctor",
            "date",
            "time_slot",
            "appointment_type",
            "status",
            "symptoms",
            "notes",
            "fee",
            "payment_status",
            "razorpay_order_id",
            "razorpay_payment_id",
            "created_at",
        )

    def get_patient(self, obj):
        return {
            "id": obj.patient_id,
            "name": obj.patient.name,
            "email": obj.patient.email,
            "phone": obj.patient.phone,
            "gender": obj.patient.gender,
            "dob": obj.patient.dob,
        }

    def get_doctor(self, obj):
        return {
            "id": obj.doctor_id,
            "name": obj.doctor.user.name,
            "specialization": obj.doctor.specialization,
            "city": obj.doctor.city,
            "phone": obj.doctor.phone,
            "email": obj.doctor.email,
            "profile_photo": obj.doctor.profile_photo,
        }


class BookAppointmentSerializer(serializers.Serializer):
    doctor_id = serializers.IntegerField()
    date = serializers.DateField()
    time_slot = serializers.CharField()
    appointment_type = serializers.ChoiceField(choices=Appointment.APPOINTMENT_TYPES)
    symptoms = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        doctor = DoctorProfile.objects.filter(id=attrs["doctor_id"], is_approved=True, user__is_blocked=False).first()
        if not doctor:
            raise serializers.ValidationError("Doctor not found")
        if doctor.blocked_dates.filter(date=attrs["date"]).exists():
            raise serializers.ValidationError("Doctor is unavailable on this date")
        if Appointment.objects.filter(doctor=doctor, date=attrs["date"], time_slot=attrs["time_slot"]).exclude(status="cancelled").exists():
            raise serializers.ValidationError("Selected slot is already booked")
        attrs["doctor"] = doctor
        return attrs


class VerifyPaymentSerializer(serializers.Serializer):
    appointment_id = serializers.IntegerField()
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()


class AppointmentStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Appointment.STATUS_CHOICES)


class SlotQuerySerializer(serializers.Serializer):
    date = serializers.DateField()


def build_slots(start_time, end_time, duration):
    slots = []
    start_dt = datetime.combine(datetime.today(), start_time)
    end_dt = datetime.combine(datetime.today(), end_time)
    while start_dt + timedelta(minutes=duration) <= end_dt:
        slots.append(start_dt.strftime("%H:%M"))
        start_dt += timedelta(minutes=duration)
    return slots

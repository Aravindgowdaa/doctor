from datetime import datetime, timedelta

from django.db import transaction
from django.db.models import Sum
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView

from django.conf import settings

from config.email_utils import send_portal_email
from config.permissions import IsDoctor, IsPatient
from config.razorpay_client import client as razorpay_client
from config.response import api_response

from apps.notifications.models import Notification

from .models import Appointment
from .serializers import (
    AppointmentSerializer,
    AppointmentStatusSerializer,
    BookAppointmentSerializer,
    SlotQuerySerializer,
    VerifyPaymentSerializer,
    build_slots,
)


class BookAppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]

    @transaction.atomic
    def post(self, request):
        try:
            serializer = BookAppointmentSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            doctor = serializer.validated_data["doctor"]
            appointment = Appointment.objects.create(
                patient=request.user,
                doctor=doctor,
                date=serializer.validated_data["date"],
                time_slot=serializer.validated_data["time_slot"],
                appointment_type=serializer.validated_data["appointment_type"],
                symptoms=serializer.validated_data.get("symptoms", ""),
                notes=serializer.validated_data.get("notes", ""),
                fee=doctor.consultation_fee,
                status="pending",
                payment_status="pending",
            )
            razorpay_order = razorpay_client.order.create(
                {
                    "amount": int(float(doctor.consultation_fee) * 100),
                    "currency": "INR",
                    "receipt": f"appt_{appointment.id}",
                    "payment_capture": 1,
                }
            )
            appointment.razorpay_order_id = razorpay_order["id"]
            appointment.save(update_fields=["razorpay_order_id"])
            Notification.objects.bulk_create(
                [
                    Notification(
                        user=request.user,
                        title="Appointment created",
                        message=f"Your appointment with Dr. {doctor.user.name} is awaiting payment confirmation.",
                        type="appointment",
                    ),
                    Notification(
                        user=doctor.user,
                        title="New booking request",
                        message=f"{request.user.name} initiated a booking for {appointment.date} at {appointment.time_slot}.",
                        type="appointment",
                    ),
                ]
            )
            return api_response(
                True,
                "Appointment created and Razorpay order generated",
                {
                    "appointment": AppointmentSerializer(appointment).data,
                    "order": razorpay_order,
                    "key": settings.RAZORPAY_KEY_ID,
                },
                status.HTTP_201_CREATED,
            )
        except ValidationError as exc:
            return api_response(False, str(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to book appointment: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]

    @transaction.atomic
    def post(self, request):
        try:
            serializer = VerifyPaymentSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            appointment = Appointment.objects.select_related("doctor__user", "patient").get(
                id=serializer.validated_data["appointment_id"], patient=request.user
            )
            razorpay_client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": serializer.validated_data["razorpay_order_id"],
                    "razorpay_payment_id": serializer.validated_data["razorpay_payment_id"],
                    "razorpay_signature": serializer.validated_data["razorpay_signature"],
                }
            )
            appointment.razorpay_payment_id = serializer.validated_data["razorpay_payment_id"]
            appointment.payment_status = "paid"
            appointment.status = "confirmed"
            appointment.save(update_fields=["razorpay_payment_id", "payment_status", "status"])
            appointment.doctor.total_bookings += 1
            appointment.doctor.save(update_fields=["total_bookings"])
            Notification.objects.bulk_create(
                [
                    Notification(
                        user=appointment.patient,
                        title="Appointment confirmed",
                        message=f"Your appointment with Dr. {appointment.doctor.user.name} is confirmed.",
                        type="appointment",
                    ),
                    Notification(
                        user=appointment.doctor.user,
                        title="Appointment paid",
                        message=f"{appointment.patient.name} completed payment for {appointment.date} at {appointment.time_slot}.",
                        type="appointment",
                    ),
                ]
            )
            send_portal_email(
                "Appointment Confirmed",
                f"Your appointment with Dr. {appointment.doctor.user.name} is confirmed for {appointment.date} at {appointment.time_slot}.",
                [appointment.patient.email],
            )
            return api_response(True, "Payment verified successfully", {"appointment": AppointmentSerializer(appointment).data})
        except ValidationError as exc:
            return api_response(False, str(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Appointment.DoesNotExist:
            return api_response(False, "Appointment not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return api_response(False, f"Unable to verify payment: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PatientAppointmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]

    def get(self, request):
        try:
            appointments = Appointment.objects.filter(patient=request.user).select_related("doctor__user")
            return api_response(True, "Appointments fetched successfully", {"appointments": AppointmentSerializer(appointments, many=True).data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch appointments: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DoctorAppointmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDoctor]

    def get(self, request):
        try:
            queryset = Appointment.objects.filter(doctor=request.user.doctor_profile).select_related("patient", "doctor__user")
            status_filter = request.query_params.get("status")
            date_filter = request.query_params.get("date")
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            if date_filter:
                queryset = queryset.filter(date=date_filter)
            return api_response(True, "Appointments fetched successfully", {"appointments": AppointmentSerializer(queryset, many=True).data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch doctor appointments: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AppointmentStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            serializer = AppointmentStatusSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            appointment = Appointment.objects.select_related("patient", "doctor__user").get(pk=pk)
            if request.user.role == "doctor" and appointment.doctor.user != request.user:
                return api_response(False, "You do not have access to this appointment", status_code=status.HTTP_403_FORBIDDEN)
            if request.user.role == "patient" and appointment.patient != request.user:
                return api_response(False, "You do not have access to this appointment", status_code=status.HTTP_403_FORBIDDEN)
            appointment.status = serializer.validated_data["status"]
            appointment.save(update_fields=["status"])
            Notification.objects.bulk_create(
                [
                    Notification(
                        user=appointment.patient,
                        title="Appointment updated",
                        message=f"Appointment status changed to {appointment.status}.",
                        type="appointment",
                    ),
                    Notification(
                        user=appointment.doctor.user,
                        title="Appointment updated",
                        message=f"Appointment status changed to {appointment.status}.",
                        type="appointment",
                    ),
                ]
            )
            return api_response(True, "Appointment status updated successfully", {"appointment": AppointmentSerializer(appointment).data})
        except ValidationError as exc:
            return api_response(False, str(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Appointment.DoesNotExist:
            return api_response(False, "Appointment not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return api_response(False, f"Unable to update appointment: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AppointmentCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]

    def delete(self, request, pk):
        try:
            appointment = Appointment.objects.select_related("doctor__user", "patient").get(pk=pk, patient=request.user)
            appointment_datetime = timezone.make_aware(datetime.combine(appointment.date, datetime.strptime(appointment.time_slot, "%H:%M").time()))
            if appointment_datetime - timezone.now() < timedelta(hours=24):
                return api_response(False, "Appointments can only be cancelled at least 24 hours in advance", status_code=status.HTTP_400_BAD_REQUEST)
            appointment.status = "cancelled"
            appointment.save(update_fields=["status"])
            Notification.objects.bulk_create(
                [
                    Notification(
                        user=request.user,
                        title="Appointment cancelled",
                        message=f"Appointment with Dr. {appointment.doctor.user.name} was cancelled.",
                        type="appointment",
                    ),
                    Notification(
                        user=appointment.doctor.user,
                        title="Appointment cancelled",
                        message=f"{request.user.name} cancelled the appointment on {appointment.date}.",
                        type="appointment",
                    ),
                ]
            )
            return api_response(True, "Appointment cancelled successfully")
        except Appointment.DoesNotExist:
            return api_response(False, "Appointment not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return api_response(False, f"Unable to cancel appointment: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AvailableSlotsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, doctor_id):
        try:
            serializer = SlotQuerySerializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)
            doctor = request.user.doctor_profile if False else None
            from apps.doctors.models import DoctorProfile

            doctor = DoctorProfile.objects.get(id=doctor_id, is_approved=True)
            date_value = serializer.validated_data["date"]
            if doctor.blocked_dates.filter(date=date_value).exists():
                return api_response(True, "Doctor is unavailable on this date", {"slots": []})
            weekday = date_value.strftime("%A")
            availabilities = doctor.available_slots.filter(day=weekday)
            slots = []
            for availability in availabilities:
                slots.extend(build_slots(availability.start_time, availability.end_time, availability.slot_duration))
            booked_slots = set(
                Appointment.objects.filter(doctor=doctor, date=date_value).exclude(status="cancelled").values_list("time_slot", flat=True)
            )
            available_slots = [slot for slot in slots if slot not in booked_slots]
            return api_response(True, "Available slots fetched successfully", {"slots": available_slots})
        except ValidationError as exc:
            return api_response(False, str(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to fetch slots: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.views import APIView

from config.email_utils import send_portal_email
from config.permissions import IsAdmin
from config.response import api_response

from apps.accounts.models import User
from apps.appointments.models import Appointment
from apps.doctors.models import DoctorProfile
from apps.notifications.models import Notification
from apps.appointments.serializers import AppointmentSerializer
from apps.doctors.serializers import DoctorProfileSerializer
from apps.accounts.serializers import UserSerializer


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        try:
            today = timezone.localdate()
            stats = {
                "totalPatients": User.objects.filter(role="patient").count(),
                "totalDoctors": DoctorProfile.objects.filter(is_approved=True).count(),
                "todayAppointments": Appointment.objects.filter(date=today).count(),
                "totalRevenue": float(
                    Appointment.objects.filter(payment_status="paid").aggregate(total=Sum("fee")).get("total") or 0
                ),
                "pendingApprovals": DoctorProfile.objects.filter(is_approved=False, is_rejected=False).count(),
                "topRatedDoctors": DoctorProfileSerializer(
                    DoctorProfile.objects.filter(is_approved=True).select_related("user").order_by("-average_rating", "-total_bookings")[:5],
                    many=True,
                ).data,
            }
            return api_response(True, "Admin stats fetched successfully", stats)
        except Exception as exc:
            return api_response(False, f"Unable to fetch stats: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminDoctorListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        try:
            doctors = DoctorProfile.objects.select_related("user").all().order_by("-user__created_at")
            return api_response(True, "Doctors fetched successfully", {"doctors": DoctorProfileSerializer(doctors, many=True).data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch doctors: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminDoctorApproveView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def put(self, request, pk):
        try:
            doctor = DoctorProfile.objects.select_related("user").get(pk=pk)
            doctor.is_approved = True
            doctor.is_rejected = False
            doctor.save(update_fields=["is_approved", "is_rejected"])
            Notification.objects.create(
                user=doctor.user,
                title="Doctor account approved",
                message="Your doctor account has been approved by admin.",
                type="approval",
            )
            send_portal_email("Doctor account approved", "Your doctor account is now live on Doctor Portal.", [doctor.user.email])
            return api_response(True, "Doctor approved successfully")
        except DoctorProfile.DoesNotExist:
            return api_response(False, "Doctor not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return api_response(False, f"Unable to approve doctor: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminDoctorRejectView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def put(self, request, pk):
        try:
            doctor = DoctorProfile.objects.select_related("user").get(pk=pk)
            doctor.is_approved = False
            doctor.is_rejected = True
            doctor.save(update_fields=["is_approved", "is_rejected"])
            Notification.objects.create(
                user=doctor.user,
                title="Doctor account rejected",
                message="Your doctor account registration was rejected by admin.",
                type="approval",
            )
            send_portal_email("Doctor account rejected", "Your doctor account request was rejected by admin.", [doctor.user.email])
            return api_response(True, "Doctor rejected successfully")
        except DoctorProfile.DoesNotExist:
            return api_response(False, "Doctor not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return api_response(False, f"Unable to reject doctor: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminPatientListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        try:
            patients = User.objects.filter(role="patient").order_by("-created_at")
            return api_response(True, "Patients fetched successfully", {"patients": UserSerializer(patients, many=True).data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch patients: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminUserBlockView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_blocked = not user.is_blocked
            user.save(update_fields=["is_blocked"])
            return api_response(True, "User block status updated successfully", {"is_blocked": user.is_blocked})
        except User.DoesNotExist:
            return api_response(False, "User not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return api_response(False, f"Unable to update user: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminAppointmentListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        try:
            appointments = Appointment.objects.select_related("patient", "doctor__user").all()
            return api_response(True, "Appointments fetched successfully", {"appointments": AppointmentSerializer(appointments, many=True).data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch appointments: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

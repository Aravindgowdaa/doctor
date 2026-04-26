from django.db.models import Q
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.views import APIView

from config.cloudinary_utils import upload_file
from config.permissions import IsDoctor
from config.response import api_response, format_validation_error

from .models import BlockedDate, DoctorProfile, WeeklyAvailability
from .serializers import (
    AvailabilityBulkSerializer,
    BlockDateCreateSerializer,
    DoctorListSerializer,
    DoctorProfileSerializer,
    DoctorProfileUpdateSerializer,
)


class DoctorListView(ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = DoctorListSerializer

    def get_queryset(self):
        return DoctorProfile.objects.filter(is_approved=True, user__is_blocked=False).select_related("user").order_by("-average_rating", "-total_bookings")

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return api_response(True, "Doctors fetched successfully", {"doctors": serializer.data})


class BestDoctorView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            doctors = DoctorProfile.objects.filter(is_approved=True, user__is_blocked=False).select_related("user").order_by("-average_rating", "-total_bookings")[:6]
            return api_response(True, "Best doctors fetched successfully", {"doctors": DoctorListSerializer(doctors, many=True).data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch best doctors: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DoctorSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            queryset = DoctorProfile.objects.filter(is_approved=True, user__is_blocked=False).select_related("user")
            q = request.query_params.get("q")
            city = request.query_params.get("city")
            spec = request.query_params.get("spec")
            min_fee = request.query_params.get("minFee")
            max_fee = request.query_params.get("maxFee")
            rating = request.query_params.get("rating")
            if q:
                queryset = queryset.filter(Q(user__name__icontains=q) | Q(specialization__icontains=q))
            if city:
                queryset = queryset.filter(city__icontains=city)
            if spec:
                queryset = queryset.filter(specialization__icontains=spec)
            if min_fee:
                queryset = queryset.filter(consultation_fee__gte=min_fee)
            if max_fee:
                queryset = queryset.filter(consultation_fee__lte=max_fee)
            if rating:
                queryset = queryset.filter(average_rating__gte=rating)
            queryset = queryset.order_by("-average_rating", "-total_bookings")
            return api_response(True, "Doctors fetched successfully", {"doctors": DoctorListSerializer(queryset, many=True).data})
        except Exception as exc:
            return api_response(False, f"Unable to search doctors: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DoctorDetailView(RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = DoctorProfileSerializer
    lookup_field = "id"

    def get_queryset(self):
        return DoctorProfile.objects.filter(is_approved=True).select_related("user").prefetch_related("available_slots", "blocked_dates")

    def retrieve(self, request, *args, **kwargs):
        try:
            doctor = self.get_object()
            data = self.get_serializer(doctor).data
            has_booking = False
            if request.user.is_authenticated and request.user.role == "patient":
                has_booking = doctor.appointments.filter(patient=request.user, status__in=["confirmed", "completed"]).exists()
            if not has_booking:
                data["phone"] = ""
                data["email"] = ""
            return api_response(True, "Doctor profile fetched successfully", {"doctor": data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch doctor profile: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DoctorProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDoctor]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            return api_response(True, "Doctor profile fetched successfully", {"doctor": DoctorProfileSerializer(request.user.doctor_profile).data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch doctor profile: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        try:
            doctor = request.user.doctor_profile
            payload = request.data.copy()
            if request.FILES.get("profile_photo"):
                payload["profile_photo"] = upload_file(request.FILES["profile_photo"], "doctor-portal/doctors")
            serializer = DoctorProfileUpdateSerializer(doctor, data=payload, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return api_response(True, "Doctor profile updated successfully", {"doctor": DoctorProfileSerializer(doctor).data})
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to update doctor profile: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DoctorSlotsUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDoctor]

    def put(self, request):
        try:
            serializer = AvailabilityBulkSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            doctor = request.user.doctor_profile
            WeeklyAvailability.objects.filter(doctor=doctor).delete()
            for slot in serializer.validated_data["slots"]:
                WeeklyAvailability.objects.create(doctor=doctor, **slot)
            return api_response(True, "Availability updated successfully", {"slots": DoctorProfileSerializer(doctor).data["available_slots"]})
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to update slots: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DoctorBlockDateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDoctor]

    def put(self, request):
        try:
            serializer = BlockDateCreateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            doctor = request.user.doctor_profile
            blocked_date, created = BlockedDate.objects.get_or_create(doctor=doctor, date=serializer.validated_data["date"])
            message = "Blocked date added successfully" if created else "Date was already blocked"
            return api_response(True, message, {"blocked_date": {"id": blocked_date.id, "date": blocked_date.date}})
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to block date: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

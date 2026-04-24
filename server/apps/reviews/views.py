from django.db.models import Avg, Count
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView

from config.permissions import IsPatient
from config.response import api_response, format_validation_error

from .models import Review
from .serializers import CreateReviewSerializer, ReviewSerializer


class ReviewCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]

    def post(self, request):
        try:
            serializer = CreateReviewSerializer(data=request.data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            review = serializer.save(patient=request.user)
            stats = Review.objects.filter(doctor=review.doctor).aggregate(avg=Avg("rating"), count=Count("id"))
            review.doctor.average_rating = round(stats["avg"] or 0, 2)
            review.doctor.total_reviews = stats["count"] or 0
            review.doctor.save(update_fields=["average_rating", "total_reviews"])
            return api_response(True, "Review added successfully", {"review": ReviewSerializer(review).data}, status.HTTP_201_CREATED)
        except ValidationError as exc:
            return api_response(False, format_validation_error(exc.detail), status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return api_response(False, f"Unable to add review: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DoctorReviewListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, doctor_id):
        try:
            reviews = Review.objects.filter(doctor_id=doctor_id).select_related("patient")
            return api_response(True, "Reviews fetched successfully", {"reviews": ReviewSerializer(reviews, many=True).data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch reviews: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

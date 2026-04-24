from django.urls import path

from .views import DoctorReviewListView, ReviewCreateView

urlpatterns = [
    path("", ReviewCreateView.as_view()),
    path("doctor/<int:doctor_id>", DoctorReviewListView.as_view()),
]

from django.urls import path

from .views import (
    BestDoctorView,
    DoctorBlockDateView,
    DoctorDetailView,
    DoctorListView,
    DoctorProfileUpdateView,
    DoctorSearchView,
    DoctorSlotsUpdateView,
)

urlpatterns = [
    path("", DoctorListView.as_view()),
    path("best", BestDoctorView.as_view()),
    path("search", DoctorSearchView.as_view()),
    path("profile", DoctorProfileUpdateView.as_view()),
    path("slots", DoctorSlotsUpdateView.as_view()),
    path("block-date", DoctorBlockDateView.as_view()),
    path("<int:id>", DoctorDetailView.as_view()),
]

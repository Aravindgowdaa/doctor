from django.urls import path

from .views import (
    AdminAppointmentListView,
    AdminDoctorApproveView,
    AdminDoctorListView,
    AdminDoctorRejectView,
    AdminPatientListView,
    AdminStatsView,
    AdminUserBlockView,
)

urlpatterns = [
    path("stats", AdminStatsView.as_view()),
    path("doctors", AdminDoctorListView.as_view()),
    path("doctors/<int:pk>/approve", AdminDoctorApproveView.as_view()),
    path("doctors/<int:pk>/reject", AdminDoctorRejectView.as_view()),
    path("patients", AdminPatientListView.as_view()),
    path("users/<int:pk>/block", AdminUserBlockView.as_view()),
    path("appointments", AdminAppointmentListView.as_view()),
]

from django.urls import path

from .views import (
    AppointmentCancelView,
    AppointmentStatusUpdateView,
    AvailableSlotsView,
    BookAppointmentView,
    DoctorAppointmentsView,
    PatientAppointmentsView,
    VerifyPaymentView,
)

urlpatterns = [
    path("book", BookAppointmentView.as_view()),
    path("verify-payment", VerifyPaymentView.as_view()),
    path("patient", PatientAppointmentsView.as_view()),
    path("doctor", DoctorAppointmentsView.as_view()),
    path("<int:pk>/status", AppointmentStatusUpdateView.as_view()),
    path("<int:pk>", AppointmentCancelView.as_view()),
    path("<int:doctor_id>/slots", AvailableSlotsView.as_view()),
]

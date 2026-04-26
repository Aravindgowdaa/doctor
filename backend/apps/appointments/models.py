from django.core.exceptions import ValidationError
from django.db import models


class Appointment(models.Model):
    APPOINTMENT_TYPES = (
        ("in-clinic", "In Clinic"),
        ("online", "Online"),
    )
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )
    PAYMENT_STATUS_CHOICES = (
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("refunded", "Refunded"),
    )

    patient = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="patient_appointments")
    doctor = models.ForeignKey("doctors.DoctorProfile", on_delete=models.CASCADE, related_name="appointments")
    date = models.DateField()
    time_slot = models.CharField(max_length=50)
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    symptoms = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")
    razorpay_order_id = models.CharField(max_length=255, blank=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-time_slot"]
        unique_together = ("doctor", "date", "time_slot")

    def clean(self):
        if Appointment.objects.exclude(pk=self.pk).filter(doctor=self.doctor, date=self.date, time_slot=self.time_slot).exists():
            raise ValidationError("This slot is already booked")

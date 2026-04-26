from django.db import models


class Review(models.Model):
    doctor = models.ForeignKey("doctors.DoctorProfile", on_delete=models.CASCADE, related_name="reviews")
    patient = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="reviews")
    appointment = models.OneToOneField("appointments.Appointment", on_delete=models.CASCADE, related_name="review")
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

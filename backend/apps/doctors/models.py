from django.db import models


class DoctorProfile(models.Model):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE, related_name="doctor_profile")
    specialization = models.CharField(max_length=255)
    qualification = models.CharField(max_length=255)
    experience = models.PositiveIntegerField(default=0)
    bio = models.TextField()
    clinic_name = models.CharField(max_length=255)
    clinic_address = models.TextField()
    city = models.CharField(max_length=255)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    profile_photo = models.URLField(blank=True)
    is_approved = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.PositiveIntegerField(default=0)
    total_bookings = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.name


class WeeklyAvailability(models.Model):
    DAY_CHOICES = (
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday"),
        ("Sunday", "Sunday"),
    )

    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name="available_slots")
    day = models.CharField(max_length=20, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_duration = models.PositiveIntegerField(default=30)

    class Meta:
        ordering = ["day", "start_time"]


class BlockedDate(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name="blocked_dates")
    date = models.DateField()

    class Meta:
        unique_together = ("doctor", "date")
        ordering = ["date"]

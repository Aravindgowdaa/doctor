import os

from django.db.models.signals import post_migrate
from django.dispatch import receiver

from apps.accounts.models import User

from .models import DoctorProfile


@receiver(post_migrate)
def create_seed_doctor(sender, **kwargs):
    if sender.name != "apps.doctors":
        return

    if DoctorProfile.objects.exists():
        return

    email = os.getenv("DEMO_DOCTOR_EMAIL", "doctor@docportal.com")
    password = os.getenv("DEMO_DOCTOR_PASSWORD", "Doctor@123")
    user, _ = User.objects.get_or_create(
        email=email,
        defaults={
            "name": "Demo Doctor",
            "phone": "8888888888",
            "role": "doctor",
            "gender": "male",
        },
    )

    if not user.has_usable_password():
        user.set_password(password)
    user.role = "doctor"
    user.is_active = True
    user.is_blocked = False
    user.save()

    DoctorProfile.objects.create(
        user=user,
        specialization="General Physician",
        qualification="MBBS",
        experience=8,
        bio="Demo doctor profile created automatically for local development.",
        clinic_name="DocPortal Care",
        clinic_address="Main Road, City Center",
        city="Bengaluru",
        consultation_fee=500,
        phone=user.phone,
        email=user.email,
        profile_photo="",
        is_approved=True,
        is_rejected=False,
        average_rating=4.8,
        total_reviews=24,
        total_bookings=56,
    )

import os

from django.conf import settings
from django.db.models.signals import post_migrate
from django.dispatch import receiver

from .models import User


@receiver(post_migrate)
def create_seed_admin(sender, **kwargs):
    if sender.name != "apps.accounts":
        return
    email = os.getenv("ADMIN_EMAIL", "admin@docportal.com")
    password = os.getenv("ADMIN_PASSWORD", "Admin@123")
    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(
            email=email,
            password=password,
            name="Portal Admin",
            phone="9999999999",
            is_staff=True,
            is_superuser=True,
        )

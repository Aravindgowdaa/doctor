from django.conf import settings
from django.core.mail import send_mail


def send_portal_email(subject, message, recipient_list):
    if not recipient_list:
        return

    sender = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER or "no-reply@doctorportal.local"
    send_mail(subject, message, sender, recipient_list, fail_silently=True)

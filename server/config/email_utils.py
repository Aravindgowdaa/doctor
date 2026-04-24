from django.core.mail import send_mail


def send_portal_email(subject, message, recipient_list):
    if not recipient_list:
        return
    send_mail(subject, message, None, recipient_list, fail_silently=True)

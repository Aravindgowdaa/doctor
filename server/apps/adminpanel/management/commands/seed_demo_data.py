from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.accounts.models import User
from apps.appointments.models import Appointment
from apps.doctors.models import DoctorProfile, WeeklyAvailability
from apps.notifications.models import Notification
from apps.reviews.models import Review


DEMO_DOCTORS = [
    {
        "email": "doctor.ahmed@docportal.com",
        "name": "Dr. Aisha Ahmed",
        "phone": "9000000001",
        "gender": "female",
        "specialization": "Cardiologist",
        "qualification": "MD, DM Cardiology",
        "experience": 12,
        "bio": "Helps patients manage heart health, blood pressure, and preventive care.",
        "clinic_name": "HeartCare Clinic",
        "clinic_address": "MG Road, Bengaluru",
        "city": "Bengaluru",
        "consultation_fee": 1200,
        "average_rating": 4.9,
        "total_reviews": 86,
        "total_bookings": 214,
        "profile_photo": "https://cdn.pixabay.com/photo/2020/06/20/15/30/woman-doctor-5321351_640.jpg",
    },
    {
        "email": "doctor.sharma@docportal.com",
        "name": "Dr. Rahul Sharma",
        "phone": "9000000002",
        "gender": "male",
        "specialization": "Dermatologist",
        "qualification": "MBBS, MD Dermatology",
        "experience": 9,
        "bio": "Treats acne, allergies, skin infections, and routine dermatology concerns.",
        "clinic_name": "SkinGlow Center",
        "clinic_address": "Connaught Place, Delhi",
        "city": "Delhi",
        "consultation_fee": 900,
        "average_rating": 4.7,
        "total_reviews": 64,
        "total_bookings": 181,
        "profile_photo": "https://cdn.pixabay.com/photo/2023/12/21/06/23/doctor-8461303_1280.jpg",
    },
    {
        "email": "doctor.khan@docportal.com",
        "name": "Dr. Farah Khan",
        "phone": "9000000003",
        "gender": "female",
        "specialization": "Pediatrician",
        "qualification": "MBBS, MD Pediatrics",
        "experience": 11,
        "bio": "Focuses on child health, vaccinations, growth tracking, and family guidance.",
        "clinic_name": "LittleCare Pediatric Clinic",
        "clinic_address": "Park Street, Kolkata",
        "city": "Kolkata",
        "consultation_fee": 800,
        "average_rating": 4.8,
        "total_reviews": 72,
        "total_bookings": 159,
        "profile_photo": "https://cdn.pixabay.com/photo/2021/07/27/17/43/doctor-6497498_640.jpg",
    },
    {
        "email": "doctor.patel@docportal.com",
        "name": "Dr. Nikhil Patel",
        "phone": "9000000004",
        "gender": "male",
        "specialization": "Orthopedic Surgeon",
        "qualification": "MS Orthopedics",
        "experience": 15,
        "bio": "Supports bone, joint, back pain, and sports injury treatment.",
        "clinic_name": "Bone & Joint Care",
        "clinic_address": "Satellite, Ahmedabad",
        "city": "Ahmedabad",
        "consultation_fee": 1500,
        "average_rating": 4.6,
        "total_reviews": 58,
        "total_bookings": 143,
        "profile_photo": "https://cdn.pixabay.com/photo/2016/11/08/05/29/operation-1807543_640.jpg",
    },
    {
        "email": "doctor.mehta@docportal.com",
        "name": "Dr. Priya Mehta",
        "phone": "9000000005",
        "gender": "female",
        "specialization": "Gynecologist",
        "qualification": "MBBS, DGO",
        "experience": 10,
        "bio": "Provides women's health consultation, pregnancy care, and routine checkups.",
        "clinic_name": "Women First Clinic",
        "clinic_address": "C Scheme, Jaipur",
        "city": "Jaipur",
        "consultation_fee": 1100,
        "average_rating": 4.8,
        "total_reviews": 79,
        "total_bookings": 198,
        "profile_photo": "https://cdn.pixabay.com/photo/2015/02/26/15/40/doctor-650534_1280.jpg",
    },
]

DEMO_PATIENTS = [
    {
        "email": "patient.arya@docportal.com",
        "name": "Arya Verma",
        "phone": "9111111111",
        "gender": "male",
    },
    {
        "email": "patient.sana@docportal.com",
        "name": "Sana Ali",
        "phone": "9222222222",
        "gender": "female",
    },
    {
        "email": "patient.rohan@docportal.com",
        "name": "Rohan Iyer",
        "phone": "9333333333",
        "gender": "male",
    },
    {
        "email": "patient.nisha@docportal.com",
        "name": "Nisha Kapoor",
        "phone": "9444444444",
        "gender": "female",
    },
]


class Command(BaseCommand):
    help = "Seed demo doctors, patients, appointments, and notifications."

    def add_arguments(self, parser):
        parser.add_argument("--password", default="Demo@12345", help="Password to assign to demo accounts")

    def handle(self, *args, **options):
        password = options["password"]
        created_counts = {"doctors": 0, "patients": 0, "appointments": 0, "notifications": 0}

        with transaction.atomic():
            doctors = [self.upsert_doctor(payload, password, created_counts) for payload in DEMO_DOCTORS]
            patients = [self.upsert_patient(payload, password, created_counts) for payload in DEMO_PATIENTS]
            self.seed_appointments(doctors, patients, created_counts)
            self.seed_availability(doctors)
            self.seed_reviews(doctors, patients)
            self.seed_notifications(doctors, patients, created_counts)

        self.stdout.write(
            self.style.SUCCESS(
                "Seed complete: "
                f"{created_counts['doctors']} doctors, "
                f"{created_counts['patients']} patients, "
                f"{created_counts['appointments']} appointments, "
                f"{created_counts['notifications']} notifications"
            )
        )
        self.stdout.write(self.style.WARNING(f"Demo password: {password}"))

    def upsert_doctor(self, payload, password, created_counts):
        user, user_created = User.objects.get_or_create(
            email=payload["email"],
            defaults={
                "name": payload["name"],
                "phone": payload["phone"],
                "role": "doctor",
                "gender": payload["gender"],
                "is_active": True,
                "is_blocked": False,
            },
        )
        if not user.has_usable_password():
            user.set_password(password)
        if not user_created:
            user.name = payload["name"]
            user.phone = payload["phone"]
            user.role = "doctor"
            user.gender = payload["gender"]
            user.is_active = True
            user.is_blocked = False
        user.save()

        doctor, doctor_created = DoctorProfile.objects.get_or_create(
            user=user,
            defaults=self.doctor_defaults(payload),
        )
        if not doctor_created:
            for field, value in self.doctor_defaults(payload).items():
                setattr(doctor, field, value)
            doctor.save()
        created_counts["doctors"] += int(user_created or doctor_created)
        return doctor

    def doctor_defaults(self, payload):
        return {
            "specialization": payload["specialization"],
            "qualification": payload["qualification"],
            "experience": payload["experience"],
            "bio": payload["bio"],
            "clinic_name": payload["clinic_name"],
            "clinic_address": payload["clinic_address"],
            "city": payload["city"],
            "consultation_fee": payload["consultation_fee"],
            "phone": payload["phone"],
            "email": payload["email"],
            "is_approved": True,
            "is_rejected": False,
            "average_rating": payload["average_rating"],
            "total_reviews": payload["total_reviews"],
            "total_bookings": payload["total_bookings"],
            "profile_photo": payload.get("profile_photo", ""),
        }

    def upsert_patient(self, payload, password, created_counts):
        user, user_created = User.objects.get_or_create(
            email=payload["email"],
            defaults={
                "name": payload["name"],
                "phone": payload["phone"],
                "role": "patient",
                "gender": payload["gender"],
                "is_active": True,
                "is_blocked": False,
            },
        )
        if not user.has_usable_password():
            user.set_password(password)
        if not user_created:
            user.name = payload["name"]
            user.phone = payload["phone"]
            user.role = "patient"
            user.gender = payload["gender"]
            user.is_active = True
            user.is_blocked = False
        user.save()
        created_counts["patients"] += int(user_created)
        return user

    def seed_appointments(self, doctors, patients, created_counts):
        seed_rows = [
            (patients[0], doctors[0], "confirmed", 0, "09:30 AM"),
            (patients[1], doctors[1], "pending", 1, "11:00 AM"),
            (patients[2], doctors[2], "completed", 2, "03:00 PM"),
            (patients[3], doctors[3], "confirmed", 3, "05:30 PM"),
        ]

        for patient, doctor, status, day_offset, time_slot in seed_rows:
            date = (timezone.now() + timedelta(days=day_offset + 1)).date()
            appointment, created = Appointment.objects.get_or_create(
                patient=patient,
                doctor=doctor,
                date=date,
                time_slot=time_slot,
                defaults={
                    "appointment_type": "in-clinic",
                    "status": status,
                    "symptoms": "General consultation",
                    "notes": "Demo appointment for portal preview",
                    "fee": doctor.consultation_fee,
                    "payment_status": "paid" if status == "completed" else "pending",
                },
            )
            if not created:
                appointment.status = status
                appointment.appointment_type = "in-clinic"
                appointment.symptoms = "General consultation"
                appointment.notes = "Demo appointment for portal preview"
                appointment.fee = doctor.consultation_fee
                appointment.payment_status = "paid" if status == "completed" else "pending"
                appointment.save()
            created_counts["appointments"] += int(created)

    def seed_availability(self, doctors):
        template = [
            {"day": "Monday", "start_time": "09:00", "end_time": "12:00", "slot_duration": 30},
            {"day": "Tuesday", "start_time": "10:00", "end_time": "13:00", "slot_duration": 30},
            {"day": "Wednesday", "start_time": "09:00", "end_time": "12:30", "slot_duration": 30},
            {"day": "Thursday", "start_time": "10:30", "end_time": "14:00", "slot_duration": 30},
            {"day": "Friday", "start_time": "09:30", "end_time": "12:30", "slot_duration": 30},
        ]
        for doctor in doctors:
            WeeklyAvailability.objects.filter(doctor=doctor).delete()
            for slot in template:
                WeeklyAvailability.objects.create(doctor=doctor, **slot)

    def seed_reviews(self, doctors, patients):
        review_rows = [
            (doctors[0], patients[1], 5, "Very reassuring consultation and clear explanation."),
            (doctors[1], patients[2], 4, "Helped with skin care treatment and follow-up advice."),
            (doctors[2], patients[0], 5, "Kind with kids and very patient during the visit."),
            (doctors[3], patients[3], 4, "Explained the recovery plan in simple terms."),
            (doctors[4], patients[1], 5, "Professional, calm, and very supportive throughout the visit."),
        ]

        for index, (doctor, patient, rating, comment) in enumerate(review_rows):
            appointment_date = (timezone.now() - timedelta(days=14 + index)).date()
            appointment, _ = Appointment.objects.get_or_create(
                patient=patient,
                doctor=doctor,
                date=appointment_date,
                time_slot=f"{9 + index:02d}:00",
                defaults={
                    "appointment_type": "in-clinic",
                    "status": "completed",
                    "symptoms": "Follow-up consultation",
                    "notes": "Demo review appointment",
                    "fee": doctor.consultation_fee,
                    "payment_status": "paid",
                },
            )
            Review.objects.update_or_create(
                appointment=appointment,
                defaults={
                    "doctor": doctor,
                    "patient": patient,
                    "rating": rating,
                    "comment": comment,
                },
            )

    def seed_notifications(self, doctors, patients, created_counts):
        demo_notifications = [
            (patients[0], "Appointment Confirmed", "Your appointment with Dr. Aisha Ahmed is confirmed for tomorrow."),
            (patients[1], "Reminder", "Please complete your profile before your next consultation."),
            (patients[2], "Review Request", "Share your feedback after your completed consultation."),
            (doctors[0].user, "New Booking", "A new patient has booked a visit for tomorrow morning."),
        ]

        for user, title, message in demo_notifications:
            notification, created = Notification.objects.get_or_create(
                user=user,
                title=title,
                defaults={
                    "message": message,
                    "is_read": False,
                    "type": "demo",
                },
            )
            if not created:
                notification.message = message
                notification.is_read = False
                notification.type = "demo"
                notification.save()
            created_counts["notifications"] += int(created)

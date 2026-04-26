from django.urls import path

from .views import (
    ChangePasswordView,
    ForgotPasswordView,
    LoginView,
    LogoutView,
    MeView,
    ProfileView,
    RegisterDoctorView,
    RegisterPatientView,
    ResetPasswordView,
    VerifyOTPView,
)

urlpatterns = [
    path("register-patient", RegisterPatientView.as_view()),
    path("register-doctor", RegisterDoctorView.as_view()),
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
    path("forgot-password", ForgotPasswordView.as_view()),
    path("verify-otp", VerifyOTPView.as_view()),
    path("reset-password", ResetPasswordView.as_view()),
    path("me", MeView.as_view()),
    path("profile", ProfileView.as_view()),
    path("change-password", ChangePasswordView.as_view()),
]

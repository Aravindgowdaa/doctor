from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import PasswordResetOTP, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("id", "email", "name", "role", "is_active", "is_blocked", "created_at")
    list_filter = ("role", "is_active", "is_blocked")
    ordering = ("-created_at",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal", {"fields": ("name", "phone", "gender", "dob", "avatar")}),
        ("Permissions", {"fields": ("role", "is_staff", "is_superuser", "is_active", "is_blocked")}),
        ("Important dates", {"fields": ("last_login", "created_at")}),
    )
    readonly_fields = ("created_at",)
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "name", "role", "password1", "password2"),
            },
        ),
    )
    search_fields = ("email", "name", "phone")


@admin.register(PasswordResetOTP)
class PasswordResetOTPAdmin(admin.ModelAdmin):
    list_display = ("email", "otp", "is_verified", "created_at", "expires_at")
    search_fields = ("email",)

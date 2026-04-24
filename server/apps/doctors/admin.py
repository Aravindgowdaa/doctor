from django.contrib import admin

from .models import BlockedDate, DoctorProfile, WeeklyAvailability

admin.site.register(DoctorProfile)
admin.site.register(WeeklyAvailability)
admin.site.register(BlockedDate)

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/doctors/", include("apps.doctors.urls")),
    path("api/appointments/", include("apps.appointments.urls")),
    path("api/reviews/", include("apps.reviews.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/admin/", include("apps.adminpanel.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

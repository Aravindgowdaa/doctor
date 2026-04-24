from rest_framework import permissions, status
from rest_framework.views import APIView

from config.response import api_response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            notifications = Notification.objects.filter(user=request.user)
            return api_response(True, "Notifications fetched successfully", {"notifications": NotificationSerializer(notifications, many=True).data})
        except Exception as exc:
            return api_response(False, f"Unable to fetch notifications: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
            notification.is_read = True
            notification.save(update_fields=["is_read"])
            return api_response(True, "Notification marked as read")
        except Notification.DoesNotExist:
            return api_response(False, "Notification not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return api_response(False, f"Unable to update notification: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NotificationReadAllView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        try:
            Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
            return api_response(True, "All notifications marked as read")
        except Exception as exc:
            return api_response(False, f"Unable to update notifications: {exc}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

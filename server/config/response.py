from rest_framework.response import Response


def api_response(success, message, data=None, status_code=200):
    return Response(
        {
            "success": success,
            "message": message,
            "data": data if data is not None else {},
        },
        status=status_code,
    )


def format_validation_error(detail):
    if isinstance(detail, dict):
        for value in detail.values():
            message = format_validation_error(value)
            if message:
                return message
        return "Invalid input"
    if isinstance(detail, list):
        if not detail:
            return "Invalid input"
        return format_validation_error(detail[0])
    return str(detail)

from django.utils.timezone import now

class UserRequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.user.is_authenticated:
            print(f"{now()}: {request.user.username} made a request to {request.path}")
        return response

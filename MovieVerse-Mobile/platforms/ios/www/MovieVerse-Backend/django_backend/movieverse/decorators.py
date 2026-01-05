from django.http import HttpResponseForbidden

from .service_clients import get_movie


def user_is_movie_creator(function):
    def wrap(request, *args, **kwargs):
        movie_id = kwargs.get("movie_id")
        if not movie_id or not request.user.is_authenticated:
            return HttpResponseForbidden("You need to be logged in to perform this action.")
        try:
            movie = get_movie(int(movie_id), request=request)
        except Exception:
            return HttpResponseForbidden("Unable to verify movie ownership.")

        owner_id = movie.get("created_by") or movie.get("owner_id") or movie.get("user_id")
        if owner_id is None and request.user.is_staff:
            return function(request, *args, **kwargs)
        if owner_id is None:
            return HttpResponseForbidden("Ownership data unavailable for this movie.")
        if str(owner_id) != str(request.user.id):
            return HttpResponseForbidden("You are not allowed to edit this movie.")
        return function(request, *args, **kwargs)

    return wrap

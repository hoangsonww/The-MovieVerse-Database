from django.http import HttpResponseForbidden
from .models import Movie

def user_is_movie_creator(function):
    def wrap(request, *args, **kwargs):
        if kwargs['movie_id'] and request.user.is_authenticated:
            movie = Movie.objects.get(pk=kwargs['movie_id'])
            if movie.creator != request.user:
                return HttpResponseForbidden("You are not allowed to edit this movie.")
            else:
                return function(request, *args, **kwargs)
        else:
            return HttpResponseForbidden("You need to be logged in to perform this action.")
    return wrap

from django.core.cache import cache
from .models import Movie

def get_top_movies():
    if 'top_movies' in cache:
        return cache.get('top_movies')
    else:
        top_movies = Movie.objects.order_by('-rating')[:10]
        cache.set('top_movies', top_movies, timeout=3600) # Cache for 1 hour
        return top_movies

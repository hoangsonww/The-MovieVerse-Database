from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Review, Movie


@receiver(post_save, sender=Review)
def update_movie_rating(sender, instance, **kwargs):
    movie = instance.movie
    reviews = Review.objects.filter(movie=movie)
    average_rating = reviews.aggregate(Avg('rating'))['rating__avg']
    movie.average_rating = average_rating
    movie.save()

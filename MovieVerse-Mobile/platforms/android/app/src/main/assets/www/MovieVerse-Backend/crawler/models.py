from django.db import models


class MovieDetail(models.Model):
    movie = models.OneToOneField('moviereviews.Movie', on_delete=models.CASCADE, related_name='details')
    description = models.TextField()
    poster_url = models.URLField()
    cast = models.TextField()
    director = models.CharField(max_length=255)
    genres = models.TextField()
    duration = models.CharField(max_length=255)
    rating = models.FloatField()
    release_date = models.DateField()
    trailer_url = models.URLField()
    imdb_url = models.URLField()
    rotten_tomatoes_url = models.URLField()
    metacritic_url = models.URLField()
    awards = models.TextField()
    box_office = models.CharField(max_length=255)
    budget = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    language = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    website = models.URLField()
    writers = models.TextField()
    year = models.IntegerField()
    id = models.CharField(max_length=255)
    imdb_rating = models.FloatField()
    imdb_votes = models.IntegerField()
    metascore = models.IntegerField()
    rotten_tomatoes_rating = models.IntegerField()
    rotten_tomatoes_reviews = models.IntegerField()
    rotten_tomatoes_fresh = models.IntegerField()

    def __str__(self):
        return self.movie.title + " Details"

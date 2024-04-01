from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=200)
    overview = models.TextField()
    poster_path = models.CharField(max_length=100)
    vote_average = models.FloatField()
    release_date = models.DateField()

    def __str__(self):
        return self.title

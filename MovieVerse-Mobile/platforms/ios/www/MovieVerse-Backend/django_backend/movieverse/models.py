from django.db import models


class Movie(models.Model):
    title = models.CharField(max_length=255)
    overview = models.TextField()
    poster_path = models.CharField(max_length=255)
    vote_average = models.FloatField()
    release_date = models.DateField()

    def __str__(self):
        return self.title


class Actor(models.Model):
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    profile_path = models.CharField(max_length=255)
    biography = models.TextField()

    def __str__(self):
        return self.name


class Director(models.Model):
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    profile_path = models.CharField(max_length=255)
    biography = models.TextField()

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Like(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.username} likes {self.movie.title}'


class Comment(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return f'{self.user.username} commented on {self.movie.title}'


class Review(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    text = models.TextField()
    rating = models.FloatField()

    def __str__(self):
        return f'{self.user.username} reviewed {self.movie.title}'

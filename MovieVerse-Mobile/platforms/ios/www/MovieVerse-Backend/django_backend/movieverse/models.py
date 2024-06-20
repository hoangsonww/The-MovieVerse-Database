from djongo import models
from django.db import models as mysql_models
from django.db import models as postgresql_models


class Genre(models.Model):
    _id = models.ObjectIdField()
    genreId = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'genres'

    def __str__(self):
        return self.name


class Movie(models.Model):
    _id = models.ObjectIdField()
    movieId = models.IntegerField(unique=True)
    title = models.CharField(max_length=255, db_column='title')
    overview = models.TextField(null=True, blank=True)
    releaseDate = models.DateField(null=True, blank=True)
    runtime = models.IntegerField(null=True, blank=True)
    genres = models.ArrayField(
        model_container=Genre
    )
    productionCountries = models.JSONField(null=True, blank=True)
    spokenLanguages = models.JSONField(null=True, blank=True)
    posterPath = models.CharField(max_length=255, null=True, blank=True)
    backdropPath = models.CharField(max_length=255, null=True, blank=True)
    voteAverage = models.FloatField(null=True, blank=True)
    voteCount = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "moviemetadatas"

    def __str__(self):
        return self.title


class Person(models.Model):
    _id = models.ObjectIdField()
    personId = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    biography = models.TextField(null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    deathday = models.DateField(null=True, blank=True)
    profilePath = models.CharField(max_length=255, null=True, blank=True)
    knownForDepartment = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'personmetadatas'

    def __str__(self):
        return self.name


class Review(mysql_models.Model):
    id = mysql_models.AutoField(primary_key=True)
    userId = mysql_models.IntegerField()
    movieId = mysql_models.IntegerField()
    rating = mysql_models.IntegerField()
    reviewText = mysql_models.TextField(null=True, blank=True)
    createdAt = mysql_models.DateTimeField(auto_now_add=True)
    updatedAt = mysql_models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'reviews'

    def __str__(self):
        return f"Review for Movie ID {self.movieId} by User ID {self.userId}"


class User(postgresql_models.Model):
    id = postgresql_models.AutoField(primary_key=True)
    username = postgresql_models.CharField(max_length=255, unique=True)
    email = postgresql_models.EmailField(unique=True)
    passwordHash = postgresql_models.CharField(max_length=255, db_column='passwordhash')
    firstName = postgresql_models.CharField(max_length=255, null=True, blank=True, db_column='firstname')
    lastName = postgresql_models.CharField(max_length=255, null=True, blank=True, db_column='lastname')
    profilePictureUrl = postgresql_models.TextField(null=True, blank=True, db_column='profilepictureurl')
    bio = postgresql_models.TextField(null=True, blank=True, db_column='bio')
    createdAt = postgresql_models.DateTimeField(auto_now_add=True, db_column='createdat')

    class Meta:
        managed = False
        db_table = 'users'

    def __str__(self):
        return self.username

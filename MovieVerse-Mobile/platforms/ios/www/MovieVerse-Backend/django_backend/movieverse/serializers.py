from rest_framework import serializers
from .models import Movie, Person, Genre, Review, User


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['_id', 'genreId', 'name']
        read_only_fields = fields


class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = ['_id', 'movieId', 'title', 'overview', 'posterPath', 'voteAverage', 'releaseDate', 'runtime',
                  'genres', 'productionCountries', 'spokenLanguages']
        read_only_fields = fields


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['_id', 'personId', 'name', 'biography', 'birthday', 'deathday', 'profilePath', 'knownForDepartment']
        read_only_fields = fields


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # Show user ID

    class Meta:
        model = Review
        fields = ['id', 'userId', 'movieId', 'rating', 'reviewText', 'createdAt', 'updatedAt']
        read_only_fields = fields


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'firstName', 'lastName', 'profilePictureUrl', 'bio', 'createdAt']
        read_only_fields = fields

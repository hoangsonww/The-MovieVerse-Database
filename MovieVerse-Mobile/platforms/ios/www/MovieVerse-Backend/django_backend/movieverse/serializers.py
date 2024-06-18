from rest_framework import serializers
from .models import Movie, Director, Actor


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['id', 'title', 'overview', 'poster_path', 'vote_average', 'release_date']


class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = ['id', 'name', 'date_of_birth', 'profile_path', 'biography']


class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = ['id', 'name', 'date_of_birth', 'profile_path', 'biography']
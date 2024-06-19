from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions, filters
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, Http404
from django.template.loader import render_to_string
from django.db import connection, connections
from .models import Movie, Genre, Person, Review, User
from .serializers import MovieSerializer, PersonSerializer, GenreSerializer, ReviewSerializer, UserSerializer


def index(request):
    return render(request, 'movieverse/index.html')


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.using('movies_db').all()
    serializer_class = MovieSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Allow read-only access to unauthenticated users
    search_fields = ['title', 'overview', 'releaseDate']
    ordering_fields = ['title', 'releaseDate', 'voteAverage']

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.using('movies_db').all()
    serializer_class = GenreSerializer


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.using('movies_db').all()
    serializer_class = PersonSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.using('reviews_db').all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Allow read-only access to unauthenticated users

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.using('users_db').all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Allow read-only access to unauthenticated users

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj


def search(request):
    query = request.GET.get('query')
    movies = Movie.objects.filter(title__icontains=query) if query else Movie.objects.none()
    return render(request, 'movieverse/search.html', {'movies': movies, 'query': query})


def movie_detail(request, movie_id):
    movie = Movie.objects.get(pk=movie_id)
    return render(request, 'movieverse/movie_detail.html', {'movie': movie})

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import api_view
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, Http404
from django.template.loader import render_to_string
from django.db import connection, connections
from .models import Movie, Genre, Person, Review, User
from .serializers import MovieSerializer, PersonSerializer, GenreSerializer, ReviewSerializer, UserSerializer
from .ai_agent import CinematicAssistant


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
    query = request.GET.get('search', '')
    print(query)
    movies = Movie.objects.filter(title__icontains=query.lower()) if query else []
    return render(request, 'movieverse/search.html', {'movies': movies, 'query': query})


def movie_detail(request, movie_id):
    movie = Movie.objects.get(pk=movie_id)
    return render(request, 'movieverse/movie_detail.html', {'movie': movie})


# AI Agent Endpoints

@api_view(['GET', 'POST'])
def agent_what_to_watch(request):
    """
    Endpoint for personalized movie suggestions based on time, mood, and user history
    
    Query params:
        - user_id: User ID (optional)
        - time_available: Time in minutes (optional)
        - mood: User's mood (optional)
        - limit: Number of recommendations (default: 5)
    """
    user_id = request.GET.get('user_id') or request.data.get('user_id')
    time_available = request.GET.get('time_available') or request.data.get('time_available')
    mood = request.GET.get('mood') or request.data.get('mood')
    limit = int(request.GET.get('limit', 5))
    
    if time_available:
        time_available = int(time_available)
    
    assistant = CinematicAssistant(user_id=user_id)
    recommendations = assistant.get_what_to_watch(
        time_available=time_available,
        mood=mood,
        limit=limit
    )
    
    return Response({
        'success': True,
        'recommendations': recommendations,
        'context': {
            'time_available': time_available,
            'mood': mood,
            'count': len(recommendations)
        }
    })


@api_view(['GET'])
def agent_trivia(request):
    """
    Endpoint for contextual movie trivia and facts
    
    Query params:
        - movie_id: Specific movie ID (optional)
        - context: 'general', 'historical', or 'on_this_day' (default: 'general')
    """
    movie_id = request.GET.get('movie_id')
    context = request.GET.get('context', 'general')
    
    if movie_id:
        movie_id = int(movie_id)
    
    assistant = CinematicAssistant()
    trivia = assistant.get_trivia(movie_id=movie_id, context=context)
    
    return Response({
        'success': True,
        'trivia': trivia
    })


@api_view(['GET'])
def agent_rewatch_reminder(request):
    """
    Endpoint for rewatch reminders and suggestions
    
    Query params:
        - user_id: User ID (required)
        - limit: Number of reminders (default: 5)
    """
    user_id = request.GET.get('user_id')
    limit = int(request.GET.get('limit', 5))
    
    if not user_id:
        return Response({
            'success': False,
            'error': 'user_id is required'
        }, status=400)
    
    assistant = CinematicAssistant(user_id=user_id)
    reminders = assistant.get_rewatch_reminders(limit=limit)
    
    return Response({
        'success': True,
        'reminders': reminders,
        'count': len(reminders)
    })


@api_view(['GET'])
def agent_weekly_watchlist(request):
    """
    Endpoint for weekly curated watchlist with themes
    
    Query params:
        - theme: Optional theme name
    """
    theme = request.GET.get('theme')
    
    assistant = CinematicAssistant()
    watchlist = assistant.get_weekly_watchlist(theme=theme)
    
    return Response({
        'success': True,
        'watchlist': watchlist
    })

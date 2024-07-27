from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import MovieSerializer, ActorSerializer, DirectorSerializer
from rest_framework import viewsets, permissions, filters
from django.shortcuts import render
from django.http import JsonResponse
from django.template.loader import render_to_string
from .models import Movie, Actor, Director, Like, Comment


class MovieListAPIView(APIView):
    """
    List all movies or create a new movie.
    """

    def get(self, request, format=None):
        movies = Movie.objects.all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk, format=None):
        movie = Movie.objects.get(pk=pk)
        serializer = MovieSerializer(movie, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk, format=None):
        movie = Movie.objects.get(pk=pk)
        movie.delete()
        return Response(status=204)

    def patch(self, request, pk, format=None):
        movie = Movie.objects.get(pk=pk)
        serializer = MovieSerializer(movie, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class MovieViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows movies to be viewed or edited.
    """
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'overview', 'release_date']
    ordering_fields = ['title', 'release_date']
    ordering = ['title']
    lookup_field = 'title'

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return Movie.objects.all()

    def get_object(self):
        return Movie.objects.get(pk=self.kwargs['pk'])

    def get_serializer(self):
        return MovieSerializer()

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


class ActorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows actors to be viewed or edited.
    """
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'date_of_birth']
    ordering_fields = ['name', 'date_of_birth']
    ordering = ['name']
    lookup_field = 'name'

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return Actor.objects.all()

    def get_object(self):
        return Actor.objects.get(pk=self.kwargs['pk'])

    def get_serializer(self):
        return ActorSerializer()

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


class DirectorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows directors to be viewed or edited.
    """
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'date_of_birth']
    ordering_fields = ['name', 'date_of_birth']
    ordering = ['name']
    lookup_field = 'name'

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return Director.objects.all()

    def get_object(self):
        return Director.objects.get(pk=self.kwargs['pk'])

    def get_serializer(self):
        return DirectorSerializer()

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


def index(request):
    return render(request, 'movieverse/index.html')


def search(request):
    query = request.GET.get('query')
    movies = Movie.objects.filter(title__icontains=query) if query else Movie.objects.none()
    return render(request, 'movieverse/search.html', {'movies': movies, 'query': query})


def movie_detail(request, movie_id):
    movie = Movie.objects.get(pk=movie_id)
    return render(request, 'movieverse/movie_detail.html', {'movie': movie})


def actor_detail(request, actor_id):
    actor = Actor.objects.get(pk=actor_id)
    return render(request, 'movieverse/actor_detail.html', {'actor': actor})


def director_detail(request, director_id):
    director = Director.objects.get(pk=director_id)
    return render(request, 'movieverse/director_detail.html', {'director': director})


def like_movie(request, movie_id):
    movie = Movie.objects.get(pk=movie_id)
    user = request.user

    if user.is_authenticated:
        like, created = Like.objects.get_or_create(user=user, movie=movie)
        if not created:
            like.delete()
            liked = False  # Indicate that the movie was unliked
        else:
            liked = True  # Indicate that the movie was liked
    else:
        liked = False  # For unauthenticated users

    return JsonResponse({'liked': liked, 'like_count': movie.like_set.count()})


def add_comment(request, movie_id):
    movie = Movie.objects.get(pk=movie_id)
    user = request.user

    comment_text = request.POST.get('comment_text')
    if comment_text:
        comment = Comment.objects.create(user=user, movie=movie, text=comment_text)

        # Render the new comment as HTML
        html = render_to_string('movieverse/comment_item.html', {'comment': comment})

        return JsonResponse({'html': html})
    else:
        return JsonResponse({'error': 'Comment text is required'}, status=400)

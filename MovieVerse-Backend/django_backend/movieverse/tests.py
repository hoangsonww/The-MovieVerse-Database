from django.test import TestCase, Client
from django.urls import reverse
from django.core.cache import cache
from models import Movie, Genre, Person, Review, User
from rest_framework.test import APIClient


class MovieVerseBackendTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.api_client = APIClient()

    # Django Model Tests
    def test_create_movie(self):
        movie = Movie.objects.create(title="Test Movie", releaseDate="2023-01-01")
        self.assertEqual(movie.title, "Test Movie")

    # Similar tests for Genre, Person, Review, User models

    # API Endpoint Tests (Using DRF APIClient)
    def test_get_all_movies(self):
        response = self.api_client.get(reverse("movie-list"))  # Use reverse for URL
        self.assertEqual(response.status_code, 200)

    def test_get_movie_detail(self):
        movie = Movie.objects.create(title="Test Movie", releaseDate="2023-01-01")
        response = self.api_client.get(reverse("movie-detail", args=[movie.id]))
        self.assertEqual(response.status_code, 200)

    # Similar tests for genres, people endpoints

    # Middleware Tests
    def test_logging_middleware(self):
        response = self.client.get(reverse("test_middleware"))  # Assuming you have this view
        # Check for log messages in your Django logs

    def test_cache_middleware(self):
        # Make a request that should be cached
        response1 = self.client.get(reverse("movie-list"))
        self.assertEqual(response1.status_code, 200)
        # Make the same request again; should be served from cache
        response2 = self.client.get(reverse("movie-list"))
        self.assertEqual(response2.status_code, 200)
        # Check Redis cache to verify it was used
        # ...

    # Similar tests for rate limiting and other middleware

    # Database Interaction Tests (Example)
    def test_movie_database_query(self):
        Movie.objects.create(title="Test Movie", releaseDate="2023-01-01")
        movie_count = Movie.objects.count()
        self.assertEqual(movie_count, 1)

    # Similar tests for querying and interacting with other databases

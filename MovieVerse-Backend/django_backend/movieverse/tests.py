import unittest
from django.test import TestCase, Client
from django.urls import reverse
from django.core.cache import cache
from django.http import HttpResponseForbidden
from models import Movie, Genre, Person, Review, User
from rest_framework.test import APIClient


class MovieVerseBackendTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.api_client = APIClient()

        # Sample test data
        self.genre = Genre.objects.create(name="Action")
        self.person = Person.objects.create(name="Test Actor", knownForDepartment="Acting")
        self.movie = Movie.objects.create(
            title="Test Movie", releaseDate="2023-01-01", genres=[self.genre]
        )
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.review = Review.objects.create(
            user=self.user, movie=self.movie, rating=5, review_text="Great movie!"
        )

    # Django Model Tests
    def test_movie_model(self):
        self.assertEqual(str(self.movie), "Test Movie")

    def test_genre_model(self):
        self.assertEqual(str(self.genre), "Action")

    def test_person_model(self):
        self.assertEqual(str(self.person), "Test Actor")

    def test_review_model(self):
        self.assertEqual(str(self.review), "Review for Test Movie by testuser")

    def test_user_model(self):
        self.assertEqual(str(self.user), "testuser")

    # API Endpoint Tests (Using DRF APIClient)
    def test_get_all_movies(self):
        response = self.api_client.get(reverse("movie-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_get_movie_detail(self):
        response = self.api_client.get(
            reverse("movie-detail", args=[self.movie.id])
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Test Movie")

    def test_get_all_genres(self):
        response = self.api_client.get(reverse("genre-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_get_all_people(self):
        response = self.api_client.get(reverse("person-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_get_all_reviews(self):
        response = self.api_client.get(reverse("review-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_get_all_users(self):
        response = self.api_client.get(reverse("user-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_review(self):
        self.api_client.force_authenticate(user=self.user)
        response = self.api_client.post(
            reverse("review-list"),
            {"movie": self.movie.id, "rating": 4, "review_text": "Good movie"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Review.objects.count(), 2)

    def test_unauthenticated_create_review(self):
        response = self.api_client.post(
            reverse("review-list"),
            {"movie": self.movie.id, "rating": 4, "review_text": "Good movie"},
            format="json",
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(Review.objects.count(), 1)


class AIAgentTests(TestCase):
    """Tests for AI Agent endpoints"""

    def setUp(self):
        self.client = Client()
        self.api_client = APIClient()

        # Create test data
        self.genre_action = Genre.objects.create(genreId=1, name="Action")
        self.genre_comedy = Genre.objects.create(genreId=2, name="Comedy")

        self.movie1 = Movie.objects.create(
            movieId=1,
            title="Action Movie",
            overview="An exciting action film",
            runtime=120,
            releaseDate="2023-01-01",
            voteAverage=8.5,
            genres=[self.genre_action]
        )

        self.movie2 = Movie.objects.create(
            movieId=2,
            title="Comedy Movie",
            overview="A hilarious comedy",
            runtime=95,
            releaseDate="2023-06-01",
            voteAverage=7.8,
            genres=[self.genre_comedy]
        )

        self.user = User.objects.create(
            username="testuser",
            email="test@example.com",
            passwordHash="hashed_password"
        )

        self.review = Review.objects.create(
            userId=self.user.id,
            movieId=self.movie1.movieId,
            rating=5,
            reviewText="Loved it!"
        )

    def test_what_to_watch_endpoint(self):
        """Test the what-to-watch endpoint"""
        response = self.api_client.get('/api/agent/what-to-watch/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('recommendations', data)
        self.assertIsInstance(data['recommendations'], list)

    def test_what_to_watch_with_mood(self):
        """Test what-to-watch with mood filter"""
        response = self.api_client.get('/api/agent/what-to-watch/?mood=action')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['context']['mood'], 'action')

    def test_what_to_watch_with_time(self):
        """Test what-to-watch with time constraint"""
        response = self.api_client.get('/api/agent/what-to-watch/?time_available=90')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['context']['time_available'], 90)

    def test_trivia_endpoint(self):
        """Test the trivia endpoint"""
        response = self.api_client.get('/api/agent/trivia/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('trivia', data)

    def test_trivia_on_this_day(self):
        """Test trivia with on_this_day context"""
        response = self.api_client.get('/api/agent/trivia/?context=on_this_day')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('trivia', data)

    def test_trivia_for_specific_movie(self):
        """Test trivia for a specific movie"""
        response = self.api_client.get(f'/api/agent/trivia/?movie_id={self.movie1.movieId}')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['trivia']['type'], 'movie_specific')

    def test_rewatch_reminder_requires_user(self):
        """Test that rewatch-reminder requires user_id"""
        response = self.api_client.get('/api/agent/rewatch-reminder/')
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertIn('error', data)

    def test_rewatch_reminder_with_user(self):
        """Test rewatch-reminder with user_id"""
        response = self.api_client.get(f'/api/agent/rewatch-reminder/?user_id={self.user.id}')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('reminders', data)
        self.assertIsInstance(data['reminders'], list)

    def test_weekly_watchlist_endpoint(self):
        """Test the weekly-watchlist endpoint"""
        response = self.api_client.get('/api/agent/weekly-watchlist/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('watchlist', data)
        self.assertIn('theme', data['watchlist'])
        self.assertIn('movies', data['watchlist'])


if __name__ == "__main__":
    unittest.main()

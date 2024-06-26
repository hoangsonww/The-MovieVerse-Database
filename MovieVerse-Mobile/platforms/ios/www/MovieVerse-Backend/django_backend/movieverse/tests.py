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


if __name__ == "__main__":
    unittest.main()

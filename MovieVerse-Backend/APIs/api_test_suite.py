import unittest
import requests


class MovieVerseApiTestSuite(unittest.TestCase):
    base_url = "http://127.0.0.1:8000/api"

    def test_get_all_movies(self):
        response = requests.get(f"{self.base_url}/movies/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list) # Expect a list of movies

    def test_get_specific_movie(self):
        movie_id = 929590  # Try getting the movie 'Civil War'
        response = requests.get(f"{self.base_url}/movies/{movie_id}/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), dict)  # Expect a movie dictionary

    def test_get_all_genres(self):
        response = requests.get(f"{self.base_url}/genres/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)  # Expect a list of genres

    def test_get_all_people(self):
        response = requests.get(f"{self.base_url}/people/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)  # Expect a list of people

    def test_get_all_reviews(self):
        response = requests.get(f"{self.base_url}/reviews/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_get_all_users(self):
        response = requests.get(f"{self.base_url}/users/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)


if __name__ == '__main__':
    unittest.main()

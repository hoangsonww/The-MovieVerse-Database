import os
import unittest

import requests


class MovieVerseApiTestSuite(unittest.TestCase):
    base_url = os.getenv("MOVIEVERSE_API_BASE_URL", "http://127.0.0.1:8080")

    def test_get_all_movies(self):
        response = requests.get(f"{self.base_url}/movies", timeout=10)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_get_all_genres(self):
        response = requests.get(f"{self.base_url}/genres", timeout=10)
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("items", payload)

    def test_search_movies(self):
        response = requests.post(
            f"{self.base_url}/search",
            json={"query": "action", "limit": 3},
            timeout=10,
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("results", response.json())

    def test_recommendations(self):
        response = requests.post(
            f"{self.base_url}/recommendations",
            json={"user_id": 1, "limit": 3},
            timeout=10,
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("items", response.json())


if __name__ == "__main__":
    unittest.main()

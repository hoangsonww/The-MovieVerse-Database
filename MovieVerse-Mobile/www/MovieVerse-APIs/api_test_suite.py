import requests

# Configuration
BASE_URL = "http://localhost:8000"
AUTH_TOKEN = "123xyz"

# Helper Functions
def get_headers(auth=False, json_content=True):
    headers = {}
    if auth:
        headers["Authorization"] = f"Bearer {AUTH_TOKEN}"
    if json_content:
        headers["Content-Type"] = "application/json"
    return headers

def login():
    url = f"{BASE_URL}/api/auth/login/"
    data = {"username": "user", "password": "password"}
    response = requests.post(url, json=data, headers=get_headers())
    return response.json().get("token")

# Test Cases
def test_list_movies():
    url = f"{BASE_URL}/api/movies/"
    response = requests.get(url, headers=get_headers())
    assert response.status_code == 200
    print("Test List Movies: Passed")

def test_get_movie_details():
    url = f"{BASE_URL}/api/movies/1/"
    response = requests.get(url, headers=get_headers())
    assert response.status_code == 200
    print("Test Get Movie Details: Passed")

def test_user_login():
    token = login()
    assert token is not None
    print("Test User Login: Passed")

def test_user_registration():
    url = f"{BASE_URL}/api/auth/register/"
    data = {
        "username": "new_user",
        "email": "new_user@movie-verse.com",
        "password": "new_password"
    }
    response = requests.post(url, json=data, headers=get_headers())
    assert response.status_code == 201
    print("Test User Registration: Passed")

def test_add_movie_review():
    url = f"{BASE_URL}/api/reviews/"
    data = {
        "movie_id": 1,
        "review": "Great movie!",
        "rating": 5
    }
    response = requests.post(url, json=data, headers=get_headers(auth=True))
    assert response.status_code == 201
    print("Test Add Movie Review: Passed")

def test_update_movie_review():
    url = f"{BASE_URL}/api/reviews/1/"
    data = {
        "review": "Updated review text",
        "rating": 4
    }
    response = requests.put(url, json=data, headers=get_headers(auth=True))
    assert response.status_code == 200
    print("Test Update Movie Review: Passed")

def test_delete_movie_review():
    url = f"{BASE_URL}/api/reviews/1/"
    response = requests.delete(url, headers=get_headers(auth=True))
    assert response.status_code == 204
    print("Test Delete Movie Review: Passed")

# Main Execution
if __name__ == "__main__":
    test_list_movies()
    test_get_movie_details()
    test_user_login()
    test_user_registration()
    test_add_movie_review()
    test_update_movie_review()
    test_delete_movie_review()

from flask import Flask, request, jsonify
import requests
from functools import lru_cache

app = Flask(__name__)
API_KEY = 'c5a20c861acf7bb8d9e987dcc7f1b558'
BASE_URL = 'https://api.themoviedb.org/3'

# Cache movie details to reduce API calls
@lru_cache(maxsize=100)
def get_movie_details(movie_id):
    try:
        url = f"{BASE_URL}/movie/{movie_id}?api_key={API_KEY}&append_to_response=credits,videos"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}

# Cache actor details to reduce API calls
@lru_cache(maxsize=100)
def get_actor_details(actor_id):
    try:
        url = f"{BASE_URL}/person/{actor_id}?api_key={API_KEY}&append_to_response=movie_credits"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}

@app.route('/movie/<int:movie_id>', methods=['GET'])
def movie_details(movie_id):
    movie = get_movie_details(movie_id)
    return jsonify(movie)

@app.route('/actor/<int:actor_id>', methods=['GET'])
def actor_details(actor_id):
    actor = get_actor_details(actor_id)
    return jsonify(actor)

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    return jsonify({"status": "success", "message": "User logged in"})

@app.route('/favorites', methods=['POST'])
def update_favorites():
    user_id = request.json.get('user_id')
    movie_id = request.json.get('movie_id')
    action = request.json.get('action') # 'add' or 'remove'

    remove = action == 'remove'

    return jsonify({"status": "success", "message": "Favorites updated"})

@app.route('/watchlist', methods=['POST'])
def update_watchlist():
    user_id = request.json.get('user_id')
    movie_id = request.json.get('movie_id')
    action = request.json.get('action')

    remove = action == 'remove'

    return jsonify({"status": "success", "message": "Watchlist updated"})

@app.route('/watched', methods=['POST'])
def update_watched():
    user_id = request.json.get('user_id')
    movie_id = request.json.get('movie_id')
    action = request.json.get('action')

    remove = action == 'remove'

    return jsonify({"status": "success", "message": "Watched updated"})

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    user_id = request.json.get('user_id')
    return jsonify({"status": "success", "message": "Recommendations retrieved"})

if __name__ == '__main__':
    app.run(debug=True)
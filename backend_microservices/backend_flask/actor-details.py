from flask import Flask, request, jsonify
import requests
from functools import lru_cache

app = Flask(__name__)
API_KEY = 'c5a20c861acf7bb8d9e987dcc7f1b558
BASE_URL = 'https://api.themoviedb.org/3'

# Cache actor details to reduce API calls
@lru_cache(maxsize=100)
def get_actor_details(actor_id):
    try:
        url = f"{BASE_URL}/person/{actor_id}?api_key={API_KEY}&append_to_response=movie_credits,external_ids"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}

# Fetch actor filmography
@lru_cache(maxsize=100)
def get_actor_filmography(actor_id):
    try:
        url = f"{BASE_URL}/person/{actor_id}/movie_credits?api_key={API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}

@app.route('/actor/<int:actor_id>', methods=['GET'])
def actor_details(actor_id):
    actor = get_actor_details(actor_id)
    if 'error' in actor:
        return jsonify({"error": "Actor details not found"}), 404
    return jsonify(actor)

@app.route('/actor/<int:actor_id>/filmography', methods=['GET'])
def actor_filmography(actor_id):
    filmography = get_actor_filmography(actor_id)
    if 'error' in filmography:
        return jsonify({"error": "Actor filmography not found"}), 404
    return jsonify(filmography)

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    return jsonify({"status": "success", "message": "User logged in"})

@app.route('/favorites', methods=['POST'])
def update_favorites():
    user_id = request.json.get('user_id')
    movie_id = request.json.get('movie_id')
    action = request.json.get('action')

    remove = action == 'remove'

    return jsonify({"status": "success", "message": "Favorites updated"})

if __name__ == '__main__':
    app.run(debug=True)

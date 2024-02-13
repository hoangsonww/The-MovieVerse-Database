from pymongo import MongoClient
import pytest

# MongoDB Configuration
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "movieDB"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Test Cases
def test_connection():
    assert db.name == DB_NAME, "Failed to connect to the correct database."

def test_movie_collection_exists():
    collections = db.list_collection_names()
    assert "movies" in collections, "Movies collection does not exist."

def test_can_insert_movie():
    movies_collection = db.movies
    movie = {
        "title": "Test Movie",
        "director": "Test Director",
        "year": 2024
    }
    result = movies_collection.insert_one(movie)
    assert result.inserted_id is not None, "Failed to insert movie into movies collection."
    # Cleanup
    movies_collection.delete_one({"_id": result.inserted_id})

if __name__ == "__main__":
    test_connection()
    test_movie_collection_exists()
    test_can_insert_movie()

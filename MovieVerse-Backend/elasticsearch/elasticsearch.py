"""
elasticsearch.py

This module integrates Elasticsearch with your Django application to index and search data
from both PostgreSQL and MongoDB. The goal is to improve query performance by offloading
search tasks to Elasticsearch.

Just a reminder: The code in this repository (including both frontend and backend) is not necessarily 
the exact code used in the live application, though it may be similar. The actual code for the live app 
is stored in a private repository for security reasons.

Features:
    - Establish connection to Elasticsearch.
    - Create indices with custom mappings for movies (from PostgreSQL) and reviews (from MongoDB).
    - Index individual documents and bulk-index entire datasets.
    - Perform full-text searches with pagination.
    - Update and delete indexed documents.
    - Synchronize data from both PostgreSQL and MongoDB with Elasticsearch.

Usage:
    Ensure your Elasticsearch instance is running (e.g., using Docker):
        docker run -d -p 9200:9200 -e "discovery.type=single-node" elasticsearch:7.17.9

    In your Django shell or management command, you can:
        from movieverse.elasticsearch import sync_all_data, search_movies
        sync_all_data()
        results = search_movies("Inception")
        print(results)
"""

import logging
from elasticsearch import Elasticsearch, helpers
from django.conf import settings
from .models import Movie, Genre, Person, Review, User

# Configure logging
logger = logging.getLogger(__name__)

# Elasticsearch settings from Django settings or defaults
ELASTICSEARCH_HOST = getattr(settings, 'ELASTICSEARCH_HOST', 'http://localhost:9200')
ELASTICSEARCH_MOVIES_INDEX = getattr(settings, 'ELASTICSEARCH_MOVIES_INDEX', 'movies_index')
ELASTICSEARCH_REVIEWS_INDEX = getattr(settings, 'ELASTICSEARCH_REVIEWS_INDEX', 'reviews_index')

# Initialize the Elasticsearch client
es = Elasticsearch([ELASTICSEARCH_HOST])

# =======================
# Index Mapping Definitions
# =======================

# Mapping for movies (indexed from PostgreSQL)
MOVIE_MAPPING = {
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0,
        "analysis": {
            "analyzer": {
                "default": {
                    "type": "standard"
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "id": {"type": "integer"},
            "title": {"type": "text", "analyzer": "standard"},
            "overview": {"type": "text", "analyzer": "standard"},
            "release_date": {"type": "date"},
            "vote_average": {"type": "float"},
            "genres": {"type": "keyword"},
            "cast": {"type": "text", "analyzer": "standard"},
            "director": {"type": "text", "analyzer": "standard"},
            "created_at": {"type": "date"},
            "updated_at": {"type": "date"}
        }
    }
}

# Mapping for reviews (indexed from MongoDB)
REVIEWS_MAPPING = {
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    },
    "mappings": {
        "properties": {
            "id": {"type": "integer"},
            "movie_id": {"type": "integer"},
            "user_id": {"type": "integer"},
            "review_text": {"type": "text", "analyzer": "standard"},
            "rating": {"type": "float"},
            "created_at": {"type": "date"},
            "updated_at": {"type": "date"}
        }
    }
}

# =======================
# Index Management Functions
# =======================

def create_index(index_name, mapping):
    """
    Creates an Elasticsearch index with the given mapping.
    If the index exists, it will not recreate it.
    """
    try:
        if not es.indices.exists(index=index_name):
            es.indices.create(index=index_name, body=mapping)
            logger.info(f"Created Elasticsearch index: {index_name}")
        else:
            logger.info(f"Index '{index_name}' already exists.")
    except Exception as e:
        logger.error(f"Error creating index '{index_name}': {e}")

def create_movies_index():
    """
    Creates the movies index using MOVIE_MAPPING.
    """
    create_index(ELASTICSEARCH_MOVIES_INDEX, MOVIE_MAPPING)

def create_reviews_index():
    """
    Creates the reviews index using REVIEWS_MAPPING.
    """
    create_index(ELASTICSEARCH_REVIEWS_INDEX, REVIEWS_MAPPING)

# =======================
# Indexing Functions for Movies (PostgreSQL)
# =======================

def index_movie(movie):
    """
    Indexes a single movie document in Elasticsearch.
    Assumes the movie instance comes from the PostgreSQL database.
    """
    try:
        doc = {
            "id": movie.id,
            "title": movie.title,
            "overview": movie.overview,
            "release_date": movie.releaseDate,
            "vote_average": movie.voteAverage,
            "genres": [genre.name for genre in movie.genres.all()],
            "cast": [person.name for person in movie.cast.all()],
            "director": movie.director.name if movie.director else None,
            "created_at": movie.created_at,
            "updated_at": movie.updated_at,
        }
        es.index(index=ELASTICSEARCH_MOVIES_INDEX, id=movie.id, body=doc)
        logger.info(f"Indexed movie: {movie.title}")
    except Exception as e:
        logger.error(f"Error indexing movie {movie.id}: {e}")

def bulk_index_movies():
    """
    Bulk indexes all movies from the PostgreSQL database.
    Adjusts the database alias (here assumed as 'postgres') as needed.
    """
    try:
        movies = Movie.objects.using('postgres').all()  # Adjust alias if necessary
        actions = [
            {
                "_index": ELASTICSEARCH_MOVIES_INDEX,
                "_id": movie.id,
                "_source": {
                    "id": movie.id,
                    "title": movie.title,
                    "overview": movie.overview,
                    "release_date": movie.releaseDate,
                    "vote_average": movie.voteAverage,
                    "genres": [genre.name for genre in movie.genres.all()],
                    "cast": [person.name for person in movie.cast.all()],
                    "director": movie.director.name if movie.director else None,
                    "created_at": movie.created_at,
                    "updated_at": movie.updated_at
                }
            }
            for movie in movies
        ]
        helpers.bulk(es, actions)
        logger.info("Bulk indexed movies from PostgreSQL.")
    except Exception as e:
        logger.error(f"Error during bulk indexing movies: {e}")

# =======================
# Indexing Functions for Reviews (MongoDB)
# =======================

def index_review(review):
    """
    Indexes a single review document from MongoDB.
    Adjust the attributes as needed if your Review model differs.
    """
    try:
        doc = {
            "id": review.id,
            "movie_id": review.movie_id,  # Assuming foreign key reference to a movie
            "user_id": review.user_id,    # Assuming foreign key reference to a user
            "review_text": review.review_text,
            "rating": review.rating,
            "created_at": review.created_at,
            "updated_at": review.updated_at
        }
        es.index(index=ELASTICSEARCH_REVIEWS_INDEX, id=review.id, body=doc)
        logger.info(f"Indexed review: {review.id}")
    except Exception as e:
        logger.error(f"Error indexing review {review.id}: {e}")

def bulk_index_reviews():
    """
    Bulk indexes all reviews from the MongoDB database.
    Adjust the database alias (here assumed as 'mongo') as needed.
    """
    try:
        reviews = Review.objects.using('mongo').all()  # Adjust alias for MongoDB
        actions = [
            {
                "_index": ELASTICSEARCH_REVIEWS_INDEX,
                "_id": review.id,
                "_source": {
                    "id": review.id,
                    "movie_id": review.movie_id,
                    "user_id": review.user_id,
                    "review_text": review.review_text,
                    "rating": review.rating,
                    "created_at": review.created_at,
                    "updated_at": review.updated_at
                }
            }
            for review in reviews
        ]
        helpers.bulk(es, actions)
        logger.info("Bulk indexed reviews from MongoDB.")
    except Exception as e:
        logger.error(f"Error during bulk indexing reviews: {e}")

# =======================
# Search Functions
# =======================

def search_movies(query, page=1, size=10):
    """
    Searches for movies in Elasticsearch from the movies index.
    
    :param query: The search string.
    :param page: Page number for pagination.
    :param size: Number of results per page.
    :return: List of movie documents matching the query.
    """
    try:
        search_body = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["title^2", "overview", "cast", "director"]
                }
            },
            "from": (page - 1) * size,
            "size": size
        }
        response = es.search(index=ELASTICSEARCH_MOVIES_INDEX, body=search_body)
        results = response.get("hits", {}).get("hits", [])
        movies = [
            {
                "id": hit["_source"]["id"],
                "title": hit["_source"]["title"],
                "overview": hit["_source"]["overview"],
                "release_date": hit["_source"]["release_date"],
                "vote_average": hit["_source"]["vote_average"],
                "genres": hit["_source"]["genres"],
                "cast": hit["_source"]["cast"],
                "director": hit["_source"]["director"]
            }
            for hit in results
        ]
        return movies
    except Exception as e:
        logger.error(f"Error searching movies: {e}")
        return []

def search_reviews(query, page=1, size=10):
    """
    Searches for reviews in Elasticsearch from the reviews index.
    
    :param query: The search string.
    :param page: Page number for pagination.
    :param size: Number of results per page.
    :return: List of review documents matching the query.
    """
    try:
        search_body = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["review_text"]
                }
            },
            "from": (page - 1) * size,
            "size": size
        }
        response = es.search(index=ELASTICSEARCH_REVIEWS_INDEX, body=search_body)
        results = response.get("hits", {}).get("hits", [])
        reviews = [
            {
                "id": hit["_source"]["id"],
                "movie_id": hit["_source"]["movie_id"],
                "user_id": hit["_source"]["user_id"],
                "review_text": hit["_source"]["review_text"],
                "rating": hit["_source"]["rating"],
                "created_at": hit["_source"]["created_at"],
                "updated_at": hit["_source"]["updated_at"]
            }
            for hit in results
        ]
        return reviews
    except Exception as e:
        logger.error(f"Error searching reviews: {e}")
        return []

# =======================
# Update and Delete Operations
# =======================

def update_movie(movie):
    """
    Updates (or reindexes) a movie document in Elasticsearch.
    """
    index_movie(movie)
    logger.info(f"Updated movie in Elasticsearch: {movie.title}")

def update_review(review):
    """
    Updates (or reindexes) a review document in Elasticsearch.
    """
    index_review(review)
    logger.info(f"Updated review in Elasticsearch: {review.id}")

def delete_movie(movie_id):
    """
    Deletes a movie document from Elasticsearch.
    """
    try:
        es.delete(index=ELASTICSEARCH_MOVIES_INDEX, id=movie_id)
        logger.info(f"Deleted movie with ID {movie_id} from Elasticsearch.")
    except Exception as e:
        logger.error(f"Error deleting movie {movie_id}: {e}")

def delete_review(review_id):
    """
    Deletes a review document from Elasticsearch.
    """
    try:
        es.delete(index=ELASTICSEARCH_REVIEWS_INDEX, id=review_id)
        logger.info(f"Deleted review with ID {review_id} from Elasticsearch.")
    except Exception as e:
        logger.error(f"Error deleting review {review_id}: {e}")

# =======================
# Full Data Synchronization
# =======================

def sync_all_data():
    """
    Synchronizes all data from PostgreSQL (movies) and MongoDB (reviews) with Elasticsearch.
    This performs a complete reindexing by:
      - Deleting existing indices,
      - Recreating indices with current mappings,
      - Bulk indexing movies and reviews.
    """
    logger.info("Starting full synchronization of PostgreSQL and MongoDB data with Elasticsearch...")
    
    # Delete existing indices for a fresh sync
    try:
        if es.indices.exists(index=ELASTICSEARCH_MOVIES_INDEX):
            es.indices.delete(index=ELASTICSEARCH_MOVIES_INDEX)
            logger.info(f"Deleted index '{ELASTICSEARCH_MOVIES_INDEX}'.")
        if es.indices.exists(index=ELASTICSEARCH_REVIEWS_INDEX):
            es.indices.delete(index=ELASTICSEARCH_REVIEWS_INDEX)
            logger.info(f"Deleted index '{ELASTICSEARCH_REVIEWS_INDEX}'.")
    except Exception as e:
        logger.error(f"Error deleting indices: {e}")
    
    # Recreate indices
    create_movies_index()
    create_reviews_index()

    # Bulk index data from each database
    bulk_index_movies()
    bulk_index_reviews()

    logger.info("Synchronization complete.")

# =======================
# Example Usage (for testing purposes)
# =======================
if __name__ == "__main__":
    # Create indices if not already present
    create_movies_index()
    create_reviews_index()

    # Perform a full sync
    sync_all_data()

    # Example: Search for movies containing the word "Inception"
    results = search_movies("Inception")
    for movie in results:
        print(movie)

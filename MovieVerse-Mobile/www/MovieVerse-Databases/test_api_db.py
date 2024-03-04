import psycopg2
import pytest

# Database Configuration
DB_CONFIG = {
    "host": "localhost",
    "database": "movie_db",
    "user": "postgres",
    "password": "your_password"
    # pw not published here
}

# Setup Connection
def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn

# Test Cases
def test_movies_table_exists():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT to_regclass('public.movies');")
    table_exists = cursor.fetchone()[0]
    conn.close()
    assert table_exists is not None, "Movies table does not exist."

def test_can_insert_movie():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO movies (title, director, year) VALUES (%s, %s, %s) RETURNING id;", ("Test Movie", "Test Director", 2024))
        movie_id = cursor.fetchone()[0]
        conn.commit()
        assert movie_id is not None, "Failed to insert movie."
    finally:
        cursor.execute("DELETE FROM movies WHERE id = %s;", (movie_id,))
        conn.commit()
        conn.close()

if __name__ == "__main__":
    test_movies_table_exists()
    test_can_insert_movie()

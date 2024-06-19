## The MovieVerse Database Backend

### Project Overview

The MovieVerse Database Backend is a robust and scalable solution for managing movie-related data, including:

* **Core Movie Information:** Titles, release dates, genres, etc.
* **People (Cast & Crew):** Actors, directors, writers, etc.
* **User Accounts:** Secure user registration and authentication.
* **Reviews and Ratings:**  User-generated movie reviews and ratings.
* **Movie Metadata:** Plot summaries, cast/crew details, awards, posters, etc.

### Database Design & Data Flow

The backend leverages multiple databases to optimize data storage and retrieval, each chosen for its strengths in handling specific types of data:

1. **MySQL (for movie reviews):**
    * **Storage:** User-generated movie reviews and ratings.
    * **Reasoning:** MySQL's relational structure is well-suited for storing structured data like reviews, ratings, and user information.

2. **MongoDB (for movies metadata, genres metadata, and people metadata):**
    * **Storage:** Movie metadata, people (cast & crew) details, and other unstructured data.
    * **Reasoning:** MongoDB's schema-less design is ideal for storing diverse movie metadata, including nested data like cast/crew lists and awards.

3. **PostgreSQL (handles user accounts):**
    * **Storage:** User accounts, authentication details, and other sensitive user data.
    * **Reasoning:** PostgreSQL's advanced security features and ACID compliance make it a good choice for storing user account information.

4. **Redis (for caching):**
    * **Storage:** Cached data for popular/trending movies and frequently accessed user data (e.g., recommendations).
    * **Reasoning:** Redis' in-memory data store provides extremely fast access, reducing the load on the primary databases for common queries.

5. **General Application Data** (MovieVerse) stored in MongoDB:
    * **Storage:** General application data like settings, configurations, etc.
    * **Reasoning:** MongoDB's flexibility allows for storing various application data in a single collection, simplifying data management.

6. **Profile Data** (MovieVerse) stored in Google Firebase:
    * **Storage:** User profile data, such as bio, profile picture, etc.
    * **Reasoning:** Firebase's real-time database capabilities are well-suited for storing user profile data that needs to be updated frequently.

### Data Flow Illustration

```
+----------+        +----------------+      +------------+       +---------+
|          |        |                |      |            |       |         |
| Frontend | <-->   | Django Backend | <--> |    MySQL   | <-->  | MongoDB |
|          |        |                |      |            |       |         |
+----------+        +----------------+      +------------+       +---------+
     |                            ^                                ^      ^
     |                           /                                /        \
     |                          /                                /          \
     v                         v                                /            \
+--------+                +------------+             +------------+        +------------+
|        |                |            |             |            |        |            |
| Redis  | <--------------| PostgreSQL | <---------- |  TMDB API  |        | User-Added |
|        |                |            |             | (external) |        |    Data    |
+--------+                +------------+             +------------+        +------------+
                                ^
                               /
                              /
                             v
                        +----------+
                        |          |
                        | Firebase |
                        |          |
                        +----------+
```

### Redis' Role in Load Reduction

Redis acts as a cache layer, storing frequently accessed data like:

* **Popular Movies:** The top-rated or trending movies, reducing the need to query the database repeatedly.
* **User Recommendations:** Personalized movie suggestions based on user preferences or viewing history.
* **Search Results:** Caching search results for common queries.
* **Other Frequently Accessed Data:** Any data that is repeatedly requested can be cached in Redis to improve performance.

### Project Setup and Usage

1. **Clone the Repository**
2. **Install Dependencies**
3. **Configure Databases:**
    * Create MySQL, MongoDB, PostgreSQL, and Redis databases as per your `config.js` file.
    * Update the connection details in `config.js` with your actual credentials.

4. **Seed the Databases:**
    * Run the provided `mongo-redis.js`, `mysql.js`, `postgresql.js` scripts (adjust as needed for your data sources) to populate the databases with initial data.
    * Consider using an external API like TMDB for rich movie metadata.
    * Be sure to replace the API key in `config.js` with your own.
    * Be sure to run these files only ONCE.

5. **Verify Seeded Data**: Verify that the data has been successfully seeded in the databases using GUI tools like MySQL Workbench, MongoDB Compass, Redis Insight, etc.

6. **Start the Django Backend:**
    ```bash
    python manage.py runserver
    ```

### Key Points

* **Scalability:** The use of multiple databases allows for horizontal scaling as your application grows.
* **Flexibility:** MongoDB's schema-less nature provides flexibility for future data expansion.
* **Performance:** Redis significantly improves response times for frequently accessed data.
* **Maintainability:** The modular design allows for easier maintenance and updates to individual components.

### Conclusion

The MovieVerse Database Backend is a robust and scalable solution for managing movie-related data, leveraging the strengths of MySQL, MongoDB, PostgreSQL, and Redis to optimize data storage, retrieval, and performance. By carefully selecting the right database for each data type and utilizing Redis for caching, the backend ensures a smooth user experience and efficient data management.

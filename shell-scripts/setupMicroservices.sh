#!/bin/bash

# Setup Script for MovieVerse Microservices Backend

# Initialize Microservices Environment
echo "Initializing Microservices Environment for MovieVerse..."

# Set Environment Variables (replace with your own values - mine is not published here)
export MOVIEVERSE_DB_URI="your_database_uri"
export MOVIEVERSE_AUTH_SERVICE_URL="your_auth_service_url"
export MOVIEVERSE_MOVIE_SERVICE_URL="your_movie_service_url"
export MOVIEVERSE_USER_SERVICE_URL="your_user_service_url"
export MOVIEVERSE_RECOMMENDATION_SERVICE_URL="your_recommendation_service_url"
export MOVIEVERSE_REVIEW_SERVICE_URL="your_review_service_url"
export MOVIEVERSE_NOTIFICATION_SERVICE_URL="your_notification_service_url"
export MOVIEVERSE_PORT=5000

docker-compose up -d

echo "Microservices Environment Setup Complete."
echo "You can now access the MovieVerse API at http://localhost:5000."

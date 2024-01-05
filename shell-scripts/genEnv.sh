#!/bin/bash

# MovieVerse Environment Variables Setup Script

# This script generates a .env file used by the MovieVerse application
# to set environment variables for different configurations like API keys,
# databases URIs, etc. This file is not published to GitHub for security reasons -
# so be sure to replace with your own values.

# Check if .env file already exists
if [ -f ".env" ]; then
    echo ".env file already exists. Overwriting with new values."
fi

# API keys and other sensitive data should be set as environment variables
# and not hard-coded into the application.

# The Movie Database (TMDb) API Key
TMDB_API_KEY='your_tmdb_api_key_here'

# Database Configuration (if applicable)
DB_HOST='your_database_host'
DB_USER='your_database_username'
DB_PASS='your_database_password'
DB_NAME='your_database_name'

# Other configuration variables
EXAMPLE_CONFIG='your_config_value'

# Write environment variables to .env file
echo "TMDB_API_KEY=$TMDB_API_KEY" > .env
echo "DB_HOST=$DB_HOST" >> .env
echo "DB_USER=$DB_USER" >> .env
echo "DB_PASS=$DB_PASS" >> .env
echo "DB_NAME=$DB_NAME" >> .env
echo "EXAMPLE_CONFIG=$EXAMPLE_CONFIG" >> .env

echo ".env file generated successfully."

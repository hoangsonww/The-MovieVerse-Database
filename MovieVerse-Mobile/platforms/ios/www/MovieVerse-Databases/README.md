# The MovieVerse - `MovieVerse-Databases` Directory

Welcome to the `MovieVerse-Database` directory of the MovieVerse App! This directory contains the SQL and JavaScript files essential for setting up and managing the databases used in the application, including Firebase, MySQL, and MongoDB. NOTE: These files are only placeholders and do not reflect what are actually used by us in production or development - you need to contact us for more details about using our databases if you would like to contribute and need database access!

---

## Overview

The `MovieVerse-Database` directory is critical for managing the data structures and schemas for the MovieVerse application. It includes files for setting up relational databases (MySQL) and NoSQL databases (MongoDB, Firebase).

### movie-user.sql

A SQL script file for creating and setting up user-related tables in a MySQL database. It defines the schema for storing user data, such as profiles, preferences, and authentication details.

### movieverse_chatbot.sql

This SQL file contains the schema and data for the chatbot feature in the application. It includes tables for storing chatbot responses, user queries, and interaction logs.

### movieverse_nosql_setup.js

A JavaScript file to set up and configure the NoSQL databases (Firebase, MongoDB). It contains scripts for initializing collections, defining documents, and setting up initial data or rules.

### movieverse_schema.sql

A comprehensive SQL script that defines the entire database schema for the MovieVerse application. It includes tables for movies, genres, reviews, ratings, and other related data.

### movieverse_user_management.sql

Contains SQL scripts related to user management features. This includes user roles, permissions, account settings, and other functionalities necessary for user account handling.

### firebase.json

A configuration file for Firebase, containing settings and rules for the Firebase Realtime Database. It defines the access rules, security settings, and other configurations for the Firebase database.

### firestore.indexes.json

A configuration file for Firestore, containing indexes and settings for the Firestore database. It defines the indexes, sorting, and other configurations for the Firestore database.

### firestore.rules

A configuration file for Firestore, containing access rules and settings for the Firestore database. It defines the access rules, security settings, and other configurations for the Firestore database.

### storage.rules

A configuration file for Firebase Storage, containing access rules and settings for the Firebase Storage service. It defines the access rules, security settings, and other configurations for the Firebase Storage.

### test_api_db.py

A Python script for testing the API and database connections. It includes sample queries, data retrieval, and other operations to test the database connections and API endpoints.

## Using these Files

These files are crucial for setting up the backend of the application. Ensure that you have the necessary database servers (MySQL, MongoDB, Firebase) running and accessible. Run these scripts to create and configure your databases according to the project's requirements.

## Customization and Adaptation

You may need to customize these scripts to fit the specific needs of your application. Be sure to regularly back up your databases before making any changes to these scripts.

## Contact

As mentioned, you'll need to contact us if you would like to access our databases or other back-end features. Feel free to reach out to us at [info@movie-verse.com](info@movie-verse.com). We look forward to collaborating with you!

---

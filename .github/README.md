# The MovieVerse App - Your Digital Compass to the Cinematic Universe 🎬🍿

<p align="center" style="cursor: pointer">
  <a href="https://movie-verse.com">
    <img src="../images/uwu.webp" alt="The MovieVerse Logo" style="border-radius: 10px" width="200"/>
  </a>
</p>

Welcome to **The MovieVerse** - your digital compass to the cinematic universe. Created by [Son Nguyen](https://github.com/hoangsonww) and currently serving more than **1 MILLION USERS** (with more than 350,000 active users per month), this application is completely **free-to-use**, designed to function as a bridge connecting movie enthusiasts with an extensive collection of films across various genres and periods. Dive into an ocean of narratives, where stories come to life, right at your fingertips with **MovieVerse** 🎬🍿!

**This app is currently available at [movie-verse.com](https://movie-verse.com).**

## Table of Contents

- [Introduction](#introduction)
  - [Disclaimer](#disclaimer)
- [User Interface](#user-interface)
- [Live URLs](#live-urls)
- [Features & Usage](#features--usage)
  - [Search & Discover](#search--discover)
  - [User Interaction](#user-interaction)
  - [Navigating the MovieVerse](#navigating-the-movieverse)
  - [Enhanced User Experience](#enhanced-user-experience)
  - [Additional Features](#additional-features)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [App Architecture](#architecture)
- [Getting Started](#getting-started)
- [Privacy Policy](#privacy-policy)
- [Terms of Service](#terms-of-service)
- [Contributing](#contributing)
- [License](#license)
- [Code of Conduct](#code-of-conduct)
- [Security Policy](#security-policy)
- [Contact](#contact)
- [Special Note](#special-note)

## Introduction

The MovieVerse is an open-source, full-stack, and mobile-friendly application created with the vision of creating a seamless and enriching experience for movie lovers. It's more than just a database; it's a portal to explore, discover, and immerse yourself in the art of cinema.

Through The MovieVerse, users can search for movies, view detailed information, rate, and review films, and interact with a community of like-minded movie enthusiasts. It's a platform that celebrates cinema in all its forms, from blockbuster hits to indie gems.

### Disclaimer

> [!IMPORTANT]
> **This open-source repository is not the official repository for The MovieVerse. The deployed repository is private for security reasons. This repository is only for educational purposes and to showcase the codebase of The MovieVerse, which may differ significantly from the official, private codebase. However, this codebase is still functional and actively maintained.**

## User Interface

<p align="center" style="cursor: pointer">
  <a href="https://movie-verse.com">
    <img src="../images/MovieVerse-UI.png" alt="The MovieVerse App Interface" style="border-radius: 10px" width="100%"/>
  </a>
</p>

## Live URLs

- **Official Website**: [https://movie-verse.com](https://movie-verse.com)
- **Backend API**: [https://api-movieverse.vercel.app/](https://api-movieverse.vercel.app/)
- **API Documentation**: [https://api-movieverse.vercel.app/docs](https://api-movieverse.vercel.app/docs)
- **ReDoc Documentation**: [https://api-movieverse.vercel.app/redoc](https://api-movieverse.vercel.app/redocs)

### Live Stasuses

![All Systems Operational](https://img.shields.io/badge/All_Systems-Operational-brightgreen)
![Website Status](https://img.shields.io/website?down_color=red&down_message=Offline&label=Website&up_color=brightgreen&up_message=Online&url=https%3A%2F%2Fmovie-verse.com)
![API Status](https://img.shields.io/website?down_color=red&down_message=Offline&label=API&up_color=brightgreen&up_message=Online&url=https%3A%2F%2Fapi-movieverse.vercel.app)
![Database Status](https://img.shields.io/website?down_color=red&down_message=Offline&label=Database&up_color=brightgreen&up_message=Online&url=https%3A%2F%2Fmovie-verse.com)
![Deployment Status](https://img.shields.io/badge/Deployment-Active-brightgreen)
![Active Users](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/hoangsonww/c79b2e8b60b4877748d05dbf0853e032/raw/active-users.json)

## Features & Usage

### Search & Discover
- **Search Functionality**: Find movies or TV shows by title, actor, director, or genre in our comprehensive database with ease.
- **Movie Details Page**: View detailed information, including synopses, cast, crew, ratings, and reviews.
- **Curated Lists**: Access collections of new releases, most popular, trending, genre-specific movies, and many more.
- **Cinematic Insights**: Explore movie trivia, behind-the-scenes facts, and other interesting tidbits about your favorite films.

### User Interaction
- **Interactive Database**: Rate movies, write reviews, and read opinions from other users.
- **Movie Watch Lists**: Create and manage watch lists for different genres, time periods, or preferences. The watchlists are saved to your account for easy access on any device.
- **Movie Matching**: Discover movies that align with your preferences and ratings.
- **Live Translation**: Translate movie information, reviews, and discussions into multiple languages for a global audience.

### Navigating the MovieVerse
- **MovieBot Chat**: Engage with our chatbot, MovieBot, for additional information about the application.
- **User Sign On**: Create an account for a personalized experience with additional features like saving watchlists.
- **Cinematic Timeline**: Explore cinema history by selecting specific time periods in the movie timeline.
- **User Profile**: Customize your profile, manage your watch lists, and view your stats/information.

### Enhanced User Experience
- **Responsive Design**: Enjoy a seamless experience on various devices and screen sizes. The MovieVerse is optimized for all platforms, including desktop, tablet, and mobile.
- **Movie Recommendations**: Receive suggestions based on your movie preferences and reviews with AI-powered recommendations.
- **Statistics and Insights**: Access dynamically updating, ML-powered statistics for a tailored experience on both desktop and mobile.
- **Community Engagement**: Connect with other users, create your profile, share your thoughts, rate movies, and engage in discussions about your favorite movies.
- **Chat Feature**: Chat with other users, share your thoughts, and discuss movies in real-time.

### Additional Features
- **Continuous Improvements**: The platform is ever-evolving with regular updates and new features.
- **Free to Use**: The MovieVerse is completely free to use, with absolutely no hidden costs or subscriptions.
- **Privacy & Security**: The MovieVerse is committed to protecting your privacy and ensuring a secure platform.
- **Accessibility**: The platform is designed to be accessible to all users, including those with disabilities.

**And So Much More!**

### Google Analytics Stats

As a result of all this hard work, our app is currently attracting more than **300,000** active users per month, with a total of over **1.5 million** users in the past 12 months!

<p align="center" style="cursor: pointer">
  <img src="../images/movieverse-analytics.png" alt="The MovieVerse Analytics" style="border-radius: 10px" width="100%"/>
</p>

## Project Structure

The MovieVerse is a full-stack application with a robust backend and a user-friendly frontend. The project is divided into the following **3 main** directories:

1. `MovieVerse-Backend`: The [backend directory](../MovieVerse-Backend) contains the server-side code, including the API, database, and server configuration. ([Read more](../MovieVerse-Backend/README.md))
2. `MovieVerse-Frontend`: The [frontend directory](../MovieVerse-Frontend) contains the client-side code, including the user interface, user experience, and client configuration. ([Read more](../MovieVerse-Frontend/README.md))
3. `MovieVerse-Mobile`: The [mobile app directory](../MovieVerse-Mobile) contains the mobile application code, built using Apache Cordova, including the mobile user interface, user experience, and mobile client configuration. ([Read more](../MovieVerse-Mobile/README.md))

There are also additional directories and files for project configuration, testing, and other utilities. The project is built using a variety of directories, including `.github`, `MovieVerse-Utilities`, `MovieVerse-Config`, `MovieVerse-Middleware`, `MovieVerse-Design`, `images`, and more. Each directory serves a specific purpose in the development, deployment, and maintenance of The MovieVerse application.

## Deployment

The current deployment and production branch is the [main-deployment-branch](https://github.com/hoangsonww/The-MovieVerse-Database/tree/main-deployment-branch) and is being deployed to the official website at [movie-verse.com](https://movie-verse.com). The deployment process involves building the frontend, backend, and mobile app, configuring the server, and deploying the application to the server. The deployment process is automated using CI/CD pipelines and scripts to ensure a seamless deployment experience.

The **official** app is currently using [Netlify](https://www.netlify.com/) for the frontend deployment and [Vercel](https://vercel.com) for the backend deployment. The deployment status is monitored regularly to ensure the application is up and running smoothly.

**Deployment Status:**

[![Netlify](https://img.shields.io/badge/Netlify-Deploy_successful-brightgreen?logo=netlify)](https://movie-verse.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy_successful-brightgreen?logo=vercel)](https://movie-verse.com/)
[![Django API](https://img.shields.io/badge/Django_API-Online-brightgreen?logo=django)](https://movie-verse.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Online-brightgreen?logo=mongodb)](https://movie-verse.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Online-brightgreen?logo=postgresql)](https://movie-verse.com)
[![Redis](https://img.shields.io/badge/Redis-Active-brightgreen?logo=redis)](https://movie-verse.com)
[![CI/CD](https://img.shields.io/badge/CI/CD-Automated-brightgreen?logo=githubactions)](https://movie-verse.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-brightgreen?logo=docker)](https://movie-verse.com)

## Technology Stack

| Frontend Technologies                                                                                                      | Backend Technologies                                            | Database Technologies                           | Mobile App Development                                            | Additional Technologies                                         |
|----------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|-------------------------------------------------|-------------------------------------------------------------------|-----------------------------------------------------------------|
| [VanillaJS](http://vanilla-js.com/)                                                                                              | [BeautifulSoup](https://pypi.org/project/beautifulsoup4/)                               | [MongoDB](https://www.mongodb.com/)             | [Apache Cordova](https://cordova.apache.org/)                     | [Webpack](https://webpack.js.org/)                              |
| [Multi-Page Application](https://medium.com/@NeotericEU/single-page-application-vs-multiple-page-application-2591588efe58) | [Transformers](https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture))                               | [MySQL](https://www.mysql.com/)                 | [React Native](https://reactnative.dev/)                          | [Babel](https://babeljs.io/)                                    |
| [HTML5](https://html.com/)                                                                                                 | [Django](https://www.djangoproject.com/)                        | [Google Firebase](https://firebase.google.com/) | [Swift (for iOS development)](https://developer.apple.com/swift/) | [Docker](https://www.docker.com/)                               |
| [CSS3](https://www.w3.org/Style/CSS/Overview.en.html)                                                                      | [Django REST Framework](https://www.django-rest-framework.org/) | [PostgreSQL](http://www.postgresql.org)         | [Kotlin (for Android)](https://kotlinlang.org/)                   | [ElasticSearch](https://www.elastic.co/elasticsearch)                           |
| [JavaScript](https://www.javascript.com/)                                                                                  | [Flask](https://flask.palletsprojects.com/en/1.1.x/)            | [Redis](https://redis.io/)                      | [Java (for Android)](https://www.java.com/en/)                    | [WebAssembly & Emscripten (with C)](https://webassembly.org/)                         |
| [TypeScript](https://www.typescriptlang.org/)                                                                              | [Python](https://www.python.org/)                               |                                                 | [Android Studio](https://developer.android.com/studio)            | [Google Analytics](https://analytics.google.com/analytics/web/) |
| [FontAwesome Icons](https://react-icons.github.io/react-icons/)                                                            | [PyTorch](https://pytorch.org/)                       |                                                 | [XCode](https://developer.apple.com/xcode/)                       | [ESLint & Prettier](https://eslint.org/)                                   |
| [Netlify](https://netlify.com)                                                                                             | [RabbitMQ](https://www.rabbitmq.com/)                           |                                                 |                                                                   | [Vercel](https://vercel.com)                                    |

## API Documentation

The MovieVerse API is fully documented and available for public use. You can access the API documentation at [https://api-movieverse.vercel.app/docs](https://api-movieverse.vercel.app/docs) or [https://api-movieverse.vercel.app/redoc](https://api-movieverse.vercel.app/redoc).

### Swagger Documentation

<p align="center" style="cursor: pointer">
  <a href="https://api-movieverse.vercel.app/docs">
    <img src="../images/MovieVerse-API-Swagger.png" alt="The MovieVerse API Swagger Documentation" style="border-radius: 10px" width="100%"/>
  </a>
</p>

### ReDoc Documentation

<p align="center" style="cursor: pointer">
  <a href="https://api-movieverse.vercel.app/redoc">
    <img src="../images/MovieVerse-API-ReDoc.png" alt="The MovieVerse API ReDoc Documentation" style="border-radius: 10px" width="100%"/>
  </a>
</p>

## Architecture

Here are the detailed flowcharts illustrating the high-level architecture of our app:

### Movie Data Flow Architecture

```
      +----------------+       +--------------------------+
      |                |       |                          |
      |    Various     |       |    Public API Sources    |
      |  Data Sources  |       |   (TMDB API, IMDB API)   |
      |                |       |                          |
      +--------+-------+       +-------------+------------+
               |                             |
               |                             |
               v                             v
      +------------------+       +--------------------------+       +-----------------------+
      |                  |       |                          |       |                       |
      | Custom Crawler   |       |    API Fetcher Service   |       |   Manual Data Entry   |
      | (Crawls on       |       |  (via Axios, Fetch API)  |       |  (Adminstrators &     |
      |  Wikipedia,      |       |                          |       |   Maintainers Only)   |
      | Rotten Tomatoes, |       +-------------+------------+       |                       |
      | and other URLs)  |                     |                    +-----------------------+
      |                  |                     |                                |
      +--------+---------+                     |                                |
               |                               |                                |
               +--------------+-------------------------------------------------+
                              |
                              v
                  +-----------------------+
                  |                       |
                  |   Data Processing     |
                  | (Cleaning, Filtering, |
                  |   Structuring, and    |
                  |    Storing Data)      |
                  |                       |
                  +-----------------------+
                              |
                              |
                              |
                +--------------------------------+
                |        AI/ML Processing        |
                |  - Sentiment Analysis          |
                |  - Anomaly Detection           |
                |  - Data Enrichment             |
                |  - Predictive Analytics        |
                |  - Clustering & Categorization |
                |  - and more...                 |
                +--------------------------------+
                              |
                              |
         +--------------------+------------------+
         |                                       |
         v                                       v
+----------------------------+       +----------------------------+
|    PostgreSQL / MySQL      |       |          MongoDB           |
|  (Structured Movie Data)   |       |  (Flexible Movie Metadata) |
|  - Titles, Ratings         |       |  - Reviews, Comments       |
|  - Cast & Crew             |       |  - Dynamic Movie Metadata  |
|  - Box Office, Budgets     |       |  - JSON-based Documents    |
|  - and more...             |       |  - and more...             |
+----------------------------+       +----------------------------+
                 \                        /
                  \                      /
                   \                    /
                    \                  /
                     \                /
                      v              v
           +----------------------------------+       +-------------------------+
           |        Django Backend API        |       |    Flask (For Testing)  |
           |   (Unified Movie Data Access)    |       |  - Sample API Endpoints |
           |  - Combines SQL & NoSQL Data     | <---> |  - Lightweight Testing  |
           |  - Provides REST/GraphQL API     |       |  - Quick Prototyping    |
           |  - Handles Authentication        |       +-------------------------+
           |  - Business Logic Processing     |
           +----------------------------------+
                            |
                            v
                  +---------------------+
                  |                     |
                  |      Frontend       |
                  |  (Consumer of API)  |
                  |                     |
                  +---------------------+
```

### User Data Flow Architecture

```
      +-----------------------+
      |     User Frontend     |
      |   (Sign Up, Login,    |
      |   Profile Updates,    |
      |   Game Scores, etc.)  |
      +-----------+-----------+
                  |
                  v
      +----------------------------+
      |  Firebase Authentication   |
      |  (User Sign-In, Sign-Up,   |
      |   Password Management,     |
      |   Token Generation)        |
      +-----------+----------------+
                  |
                  v
      +-----------------------------+
      |     Firebase Firestore      |
      |  (User Profiles, Game Data, |
      |   Leaderboards, Quiz Scores |
      |   Preferences, Settings)    |
      +-----------+-----------------+
                  |
                  v
      +----------------------------+
      |  Firebase Cloud Functions  |
      |  (Server-side Processing,  |
      |   Security Rules,          |
      |   Automated Tasks)         |
      +-----------+----------------+
                  |
                  |
                  v
      +----------------------------+
      |    Frontend (Dashboard)    |
      |  (Displays User Data,      |
      |   Scores, Leaderboards,    |
      |   Profile Info)            |
      +----------------------------+
```

### AI/ML Service for Recommending Movies

```
      +------------------------+
      |      User Frontend     |
      |   (User Interaction,   |
      |  Preferences, Ratings, |
      |    User Watchlists)    |
      +-----------+------------+
                  |
                  v
      +----------------------------+
      |     Django Backend API     |
      |    (Handles Requests,      |
      |   User Data Processing,    |
      |        API Layer)          |
      +-----------+----------------+
                  |
                  v
      +----------------------------+
      |       Data Pipeline        |
      |    (Extracts User Data,    |
      |   Prepares Feature Set)    |
      +-----------+----------------+
                  |
                  v
      +----------------------------+
      |   AI/ML Model Processing   |
      |  (Collaborative Filtering, |
      |   Content-Based Filtering, |
      |   Hybrid Approach)         |
      +-----------+----------------+
                  |
                  v
      +----------------------------+
      |    Recommendation Engine   |
      |  (Generates Personalized   |
      |   Movie Suggestions)       |
      +-----------+----------------+
                  |
                  v
      +----------------------------+
      |   Response to Django API   |
      |   (Returns Recommended     |
      |     Movies for User)       |
      +-----------+----------------+
                  |
                  v
      +----------------------------+
      |    Frontend UI Displays    |
      |  (Recommended Movies,      |
      |  Personalized Experience)  |
      +----------------------------+
```

## Getting Started

To get started with The MovieVerse, follow these _very simple_ steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Install Emscripten and compile the C code to WebAssembly (refer to the README.md file in the `utilities` directory [here](../MovieVerse-Utilities/README.md).)
4. Take a look at the project configuration directory (project-config) and make sure that the paths are correct.
5. Visit the root directory and install the dependencies (if any):
    ```bash
    npm install
    ```
6. Visit the backend directory and install the dependencies (if any):
    ```bash
    cd MovieVerse-Backend
    pip install -r requirements.txt
    ```
7. Start the backend servers and services (refer to the [README.md](../MovieVerse-Backend/README.md) file in the `MovieVerse-Backend` directory for more information).
Or, for your convenience, you may simply run the following command, provided that you already have MySQL, PostgreSQL, Redis, MongoDB, and RabbitMQ running on your system:
    ```bash
    npm run backend
    ```
8. Return to the **root** directory and start the development server:
    ```bash
    npm start
    ```
   This will start the deployment server, including the frontend, so you can start developing and testing your changes right away. If you make any changes, be sure to reload the web page to see the updates.
9. **If you would also like to develop the mobile app versions:** Visit the mobile app directory and install the dependencies (if any):
    ```bash
    cd MovieVerse-Mobile
    npm install
    cordova platform add ios
    cordova platform add android
    ```
10. Start the mobile app using Cordova (visit the `MovieVerse-Mobile` directory for more information):
    ```bash
    cordova build
    cordova emulate ios
    cordova emulate android
    ```
11. If you'd also like to dockerize the application, `cd` into the root directory and run the following command:
    ```bash
    npm run docker
    ```
    Or
    ```bash
    docker compose up
    ```
    This will create a Docker image of the application, which you can then deploy to a containerized environment. Ensure that Docker is up and running on your system before running this command.
12. If you'd like to lint and/or format the code (so that they look better and adhere to the project's coding standards), run the following commands:
    ```bash
    npm run lint
    npm run format
    ```
    This will check the code for any linting errors and format the code according to the project's coding standards. Make sure to fix any linting errors before committing your changes.
13. As you develop, be sure to save & commit your changes (and don't forget to create a branch for your new feature):
    ```bash
    git checkout -b 'feature/AmazingFeature'
    git commit -m 'Update: Add some AmazingFeature'
    ```
    Note the naming convention:
    - For branches: The names will have 2 parts: `feature/` or `fix/` followed by the feature or fix name.
    - For commits: The commit message will also have 2 parts: `Update:` or `Fix:` followed by the update or fix description.
14. Push to your branch:
    ```bash
    git push origin feature/AmazingFeature
    ```
15. Open a Pull Request (if you want to merge your changes to our official app) - we'll review your changes and merge them to this public repository first. If everything works well, we might ask you to also join our private official codebase and create another PR there so that your changes are fully live. Enjoy coding and [let me know](https://github.com/hoangsonww/The-MovieVerse-Database/discussions) if you have any questions!
16. If you'd also like to access full, advanced features of the app's development, please [contact me](https://github.com/hoangsonww/The-MovieVerse-Database/discussions) for the `.env` file and additional configurations, and we'll also decide if you need access to or can access our private official codebase.

> [!IMPORTANT]
> **Note:** Although the primary branch of this repo is `main`, the active deployment branch is `main-deployment-branch`. Therefore, refer to the `main-deployment-branch` for the latest updates and changes as we always merge code to the deployment branch first before merging it into the main branch.

## Privacy Policy

The MovieVerse is committed to protecting your privacy. Our Privacy Policy page explains how your personal information is collected, used, and disclosed by The MovieVerse.  Feel free to visit our [Privacy Policy](https://movie-verse.com/src/html/privacy-policy) page to learn more.

## Terms of Service

By accessing or using The MovieVerse, you agree to be bound by our [Terms of Service](https://movie-verse.com/src/html/terms-of-service).

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag `enhancement`.

## License

Distributed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**. See [LICENSE.md](LICENSE.md) for more information.

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-red.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

## Code of Conduct

The MovieVerse is committed to fostering a welcoming community. Please refer to our [Code of Conduct](CODE_OF_CONDUCT.md) for more information.

## Security Policy

The MovieVerse is committed to ensuring the security of the platform. Please refer to our [Security Policy](SECURITY.md) for more information.

## Contact

Son Nguyen - [@hoangsonww](https://github.com/hoangsonww)

Website: [https://sonnguyenhoang.com](https://sonnguyenhoang.com)

Email: [Official MovieVerse Email](mailto:info@movie-verse.com)

## Special Note

> [!NOTE]
> Please note that the **MovieVerse** is an ever-evolving platform, and more updates are underway. I am continually enhancing the user experience and adding new features to help you navigate the vast sea of cinema with ease and excitement!
>
> Additionally, I'd also like to express special gratitude to [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing additional movie data that greatly enriches The MovieVerse experience!
>
> Thank you for your understanding and support~ 🎬🍿

---

Created with ❤️ in 2023-2025 by [Son Nguyen](https://github.com/hoangsonww).

© 2025 The MovieVerse. All Rights Reserved.

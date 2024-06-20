# The MovieVerse - `MovieVerse-Frontend` directory

Welcome to the MovieVerse app, your ultimate guide to the world of movies! This application is designed to help users explore and learn about their favorite movies, directors, actors, and more. Dive into an immersive experience with our comprehensive directory structure.

## Directory Structure

The MovieVerse app's `MovieVerse-Frontend` directory is organized into four primary directories: `css`, `html`, `js`, and `react`. Each directory contains specific files that contribute to the functionality and appearance of the app. Here's a detailed overview:

### CSS Directory - `css`

This directory contains the Cascading Style Sheets (CSS) files responsible for the styling of the web pages.

- `reset.css`: Resets the browser's default styles to ensure consistency across different browsers.
- `style.css`: The main stylesheet for the app, containing styles that are common across multiple pages.
- `discussions.css`: Styles specific to the discussions page.
- `trivia.css`: Styles for the trivia section of the app.

### HTML Directory - `html`

The HTML directory includes all the markup files necessary for the structure of the web pages.

- `about.html`: Contains information about the MovieVerse app.
- `analytics.html`: A page for viewing database analytics and user interactions.
- `actor-details.html`: A detailed view of actor profiles.
- `api-fails.html`: A page to display when the app's API fails.
- `company-details.html`: Provides information about movie production companies.
- `create-account.html`: Allows users to create an account on MovieVerse.
- `chatbot.html`: A chatbot feature for interacting with users.
- `director-details.html`: Detailed information about movie directors.
- `discussions.html`: A platform for users to discuss various movie-related topics.
- `favorites.html`: Allows users to view and manage their favorite movies.
- `movie-details.html`: Detailed information about specific movies.
- `movie-match.html`: A feature that helps users find movies matching their mood, genre, and time period preferences.
- `movie-timeline.html`: A timeline view of movies.
- `privacy-policy.html`: Outlines the app's approach to user privacy.
- `profile.html`: A user's profile page.
- `reset-password.html`: Allows users to reset their password.
- `settings.html`: Allows users to customize their MovieVerse experience.
- `sign-in.html`: Allows users to sign in to their MovieVerse account.
- `terms-of-service.html`: The terms governing the use of MovieVerse.
- `trivia.html`: A trivia game to test users' movie knowledge.
- `tv-details.html`: Detailed information about TV shows.
- `offline.html`: A page to display when the app is offline.
- `support.html`: A page for users to seek support and assistance.
- `feedback.html`: A page for users to provide feedback.
- `404.html`: A 404 error page for when a page is not found.
- `index.ejs`: The entry point for the app.

### JS Directory - `js`

The JavaScript directory contains scripts that add interactivity and functionality to the web pages.

- `about.js`: Handles the functionality for the about page.
- `analytics.js`: Script for handling database analytics and tracking user interactions.
- `actor-details.js`: Handles the dynamic functionality on the actor details page.
- `chatbot.js`: The main JavaScript file that initiates the app.
- `company-details.js`: Script for handling company details functionality.
- `create-account.js`: Handles the create account functionality.
- `director-details.js`: Manages functionality on the director details page.
- `index.ejs`: A file for the entry point of the app.
- `movie-details.js`: Script for the movie details page.
- `movie-timeline.js`: Manages the timeline functionality for movies.
- `quiz.js`: Handles the trivia quiz functionalities.
- `reset-password.js`: Script for handling password reset functionality.
- `root-config.js`: Root configuration script for the app.
- `router.js`: Manages routing across the app.
- `service-worker.js`: Service worker script for the app to allow for offline functionality.
- `settings.js`: Script for handling user settings.
- `sign-in.js`: Script for handling user sign-in.
- `trivia.js`: Script for the trivia game.
- `user-profile.js`: Script for managing user profiles.
- `single-spa-config.js`: Configuration file for the single-spa framework used in the app.
- `systemjs-importmap.js`: Import map for the systemJS module loader.

### React Directory - `react`

The React directory contains a collection of React components developed for the MovieVerse application.

Please note that it is currently under development, and the components may undergo frequent updates and refinements - especially the API links (most of which are meant to be secret and are thus not included in this repository). The components are designed to interact with the MovieVerse backend API, which is currently under development. The API is not yet publicly available, but you can contact the project owner for more information.

- `index.jsx`: Entry point for React components
- `MovieList.jsx`: Component for listing movies
- `MovieDetails.jsx`: Component for showing movie details
- `MovieSearch.jsx`: Component for searching movies
- `UserReviews.jsx`: Component for displaying user reviews
- `MovieRecommendations.jsx`: Component for recommending movies
- `GenreMovies.jsx`: Component for genre-based movie listing
- `UserProfile.jsx`: Component for managing user profiles
- `FeaturedMoviesCarousel.jsx`: Component for featured movies carousel

### Tests Directory - `tests`

The tests directory contains a collection of test scripts and suites for the `MovieVerse` application. These tests are designed to ensure that the app's functionality is working as expected and to identify any potential issues or bugs.

- `apiTests.js`: Tests for the API functionality
- `chatbotInteractionTests.js`: Tests for the chatbot interaction
- `eventListenerTests.js`: Tests for event listeners
- `favoritesPageTests.js`: Tests for the favorites page
- `localStorageTests.js`: Tests for local storage functionality
- `movieDetailsRenderTests.js`: Tests for rendering movie details
- `movieDetailsUtilityTests.js`: Tests for movie details utility functions
- `movieSearchTests.js`: Tests for movie search functionality
- `renderTests.js`: Tests for rendering components
- `uiTests.js`: Tests for the user interface
- `utilityTests.js`: Tests for utility functions

## Getting Started

To get started with MovieVerse:

1. **Clone the repository**: Use Git to clone the app to your local machine.
2. **Navigate to the app directory**: Change your directory to the MovieVerse folder.
3. **Install dependencies**: If the app requires any dependencies, install them via your package manager.
4. **Run the app**: Start the frontend app on your local server and navigate to the appropriate port to view it:
    ```bash
    npm start
    ```
5. **Explore the app**: Interact with the app's features, pages, and functionalities to get a feel for how it works.

## Contributing

Contributions to MovieVerse are always welcome. Whether it's bug reports, feature requests, or code contributions, please feel free to contribute. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under MIT license. Refer to the `LICENSE` file in each subdirectory for more information.

---

Enjoy exploring the MovieVerse and delve into the fascinating world of cinema!

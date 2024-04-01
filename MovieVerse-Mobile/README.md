# The MovieVerse - `MovieVerse-Mobile` Directory

## Overview

MovieVerse is a dynamic, user-friendly mobile application that offers an extensive library of movies across various genres. Designed for movie enthusiasts, it provides a seamless browsing experience on iOS devices, including iPhones and iPads. Explore popular, award-winning, and hidden gems, or dive into categories like action, horror, romance, and more. MovieVerse is your ultimate mobile destination for movie discovery and entertainment.

**Note:** The app is under active development and will be available for download on the App Store and Google Play Store soon. Stay tuned for updates!

## Features

### Easy Navigation
- **Side Navigation Bar**: Swipe or tap to access different movie categories and features.
- **Search Functionality**: Search for your favorite movies or explore new ones with ease.
- **Back to Top Button**: Quickly return to the top of the page with a single tap.

### Rich Movie Catalog
- **Multiple Genres**: Access movies sorted by genres like action, horror, documentary, and more.
- **Director's Spotlight**: Discover movies by renowned directors in the special spotlight section.
- **Movie of the Day**: Get daily recommendations for the top-rated movie of the day.

### Interactive Elements
- **Favorites**: Add movies to your favorites list for quick access.
- **Movie Details**: Tap on any movie to view detailed information, including ratings, overviews, and more.
- **Responsive Design**: Enjoy a consistent and engaging user experience on both iPhones and iPads.

### And all other features from the web app!

## Development

### Prerequisites
- [Xcode](https://developer.apple.com/xcode/) 12.5 or later
- [CocoaPods](https://cocoapods.org/) 1.10.1 or later
- [Android Studio](https://developer.android.com/studio) 4.2.1 or later
- [Android SDK](https://developer.android.com/studio#downloads) 30.0.3 or later
- [Apache Cordova](https://cordova.apache.org/) 10.0.0 or later
- [Node.js](https://nodejs.org/en/) 14.17.0 or later
- [npm](https://www.npmjs.com/) 6.14.13 or later

### Instructions
1. **Clone the Repository**: Clone the repository to your local machine using the following command:
```
git clone
```
2. **Install Dependencies**: Navigate to the project directory and install the dependencies using the following command:
```
npm install
```
3. **Add iOS Platform**: Add the iOS platform to the project using the following command:
```
cordova platform add ios
```
4. **Add Android Platform**: Add the Android platform to the project using the following command:
```
cordova platform add android
```
5. **Build the Project**: Build the project using the following command:
```
cordova build ios
cordova build android
```
6. **Run the Project**: Run the project using the following command:
```
cordova emulate ios
cordova emulate android
```
7. **Open the Project**: Open the project in Xcode and/or Android Studio to view the source code and test the app within the simulator.
8. **Enjoy coding!**

**Important**: If you make any changes to the source code of the mobile app, you will need to update the iOS build process by removing iOS and adding it again using the following commands:
```
cordova platform rm ios
cordova platform add ios
```
The Android app, however, will build and run automatically as expected without any additional steps.

## Usage

### Browsing Movies
- Scroll through various categories on the home screen.
- Tap on any genre title to explore movies within that genre.

### Searching for Movies
- Tap on the search bar at the top.
- Enter the movie name and tap the search icon.

### Viewing Movie Details
- Tap on any movie poster to view detailed information.
- In the movie details page, you can read the synopsis, check ratings, and more.

### Adding to Favorites
- While viewing movie details, tap on the "Add to Favorites" button to add the movie to your favorites list.

### Accessing Favorites
- Tap on the "Favorites" button in the navigation bar to view your list of favorite movies.

## Support

For support, feedback, or inquiries, please email us at [info@movie-verse.com](mailto:info@movie-verse.com).

## Updates and Feedback

Stay updated with the latest version of the app for new features and improvements. Your feedback is valuable to us, so don't hesitate to share your thoughts and suggestions.

Enjoy exploring the world of movies with MovieVerse on your mobile device!

---

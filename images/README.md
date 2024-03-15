# The MovieVerse - `images` Directory

## Overview

This directory serves as a repository for the images used throughout our application. It includes a variety of images that users can select as background themes and specific images used as icons and placeholders within the app. The images add to the aesthetic appeal and interactivity of the application by allowing user customization.

## Directory Contents

- `black.jpeg`, `blue.jpg`, `brown.jpg`, `gold.jpg`, `green.jpg`, `grey.png`, `orange.jpg`, `pink.png`, `purple.jpg`, `red.jpg`, `rose.png`, `silver.png`, `yellow.jpg`, `universe.jpg`, and `universe-{1-19}.png`: These images are provided as optional backgrounds for the application. Users can choose from these to customize the app's appearance to their preference.
- `logo.png`: This image is the official logo of the application.
- `image.png`, `image-192x192.png`, `image-384x384.png`, `image-512x512.png`: These placeholder images are used within the app where user profile pictures or other personal images may be uploaded. The `image-384x384.png` and `image-512x512.png` are also used within the `manifest.json` file for app icons of varying sizes.
- `favicon.ico`: This icon is used as the website's favicon, visible in browser tabs and bookmarks.
- `screenshot.png`: This image is used within the app to demonstrate features or provide visual guides, such as for UI design.
- `user-default.png`: This image is used as a placeholder for the user's profile until they add their own profile image.

## Usage Guidelines

### Background Images

To apply a background image from this directory in CSS:

```css
body {
    background-image: url('blue.jpg');
    background-size: cover;
    background-repeat: no-repeat;
}
```

Users can select their background preference through the application's settings, which will apply their chosen image as the app's background.

### Icons and Placeholders

`logo.png`, `image.png`, and specific size variants (`image-384x384.png`, `image-512x512.png`) are used within the application's user interface and `manifest.json` to represent the app on various platforms and devices.

### Favicon

`favicon.ico` is linked in the HTML to represent the site's favicon across all pages of MovieVerse as follows:

```html
<link rel="icon" type="image/x-icon" href="favicon.ico">
```

## Licensing

The images in this directory are for use within our application only. Redistribution or use outside the scope of the application is not permitted without explicit permission. For any images not created in-house, please verify the license and usage rights from the respective copyright holders.

## Contributions

Contributors are encouraged to submit new images for inclusion in the app's background selection. Submitted images should be optimized for web use, adhere to the app's aesthetic, and follow the contribution guidelines provided in the project documentation.

For any inquiries regarding image usage or contributions, please contact the project maintainer at [info@movie-verse.com](mailto:info@movie-verse.com).

---

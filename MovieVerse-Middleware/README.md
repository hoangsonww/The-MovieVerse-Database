# The MovieVerse - `MovieVerse-Middleware` Directory

## Overview

Welcome to the `MovieVerse-Middleware` directory of the MovieVerse project! This directory contains crucial middleware components that handle various aspects of the MovieVerse application. These components include authentication, logging, error handling, and data processing for the application's backend.

## Directory Contents

The Middleware directory consists of two primary files:

1. **middleware.js**
2. **app-middleware.py**

### middleware.js

This JavaScript file is built on the Node.js platform using the Express framework. It includes several middleware functions essential for the backend operations of the MovieVerse application.

#### Key Features:

- **Logger Middleware**: Logs every request to the server, including the request method, URL, and timestamp.
- **Authentication Middleware**: Verifies JWT tokens in request headers to authenticate users.
- **Movie Fetcher Middleware**: Retrieves movie details based on the provided movie ID.
- **Error Handling Middleware**: Catches and handles errors occurring during request processing.
- **Movie Data Validation Middleware**: Ensures that all required movie data fields are present in the request.
- **Route-specific Middleware Application**: Demonstrates how to apply middleware to specific routes, such as the route for adding new movies.

#### Usage:

To use this middleware in your Node.js application, include it in your server file and apply it to your Express app instance as shown in the file.

### middleware.py

This Python file contains custom middleware classes designed to be used within a Django project.  Middleware components act as intermediaries between incoming requests and outgoing responses, allowing you to modify or enhance the behavior of your web application.

#### Key Features:

*   **Request Timing Middleware (`RequestTimingMiddleware`)**: 
    *   Calculates and logs the processing time (in milliseconds) for each request. This is useful for monitoring and optimizing your application's performance.

*   **URL-Based Rate Limiting Middleware (`URLBasedRateLimitingMiddleware`)**:
    *   Implements rate limiting based on the requested URL path and the client's IP address. It helps prevent abuse by limiting the number of requests a user or IP can make within a defined time window.
    *   Uses Redis (or a similar cache) to store the rate limit counters.

*   **Content Security Policy Middleware (`ContentSecurityPolicyMiddleware`)**:
    *   Enhances security by adding a Content-Security-Policy (CSP) header to the HTTP response.
    *   This CSP can define strict rules about what resources (scripts, images, etc.) are allowed to be loaded by the browser, helping to mitigate cross-site scripting (XSS) and other attacks.

*   **Exception Logging Middleware (`ExceptionLoggingMiddleware`)**:
    *   Logs any exceptions that occur during the processing of a request.
    *   This provides valuable information for debugging errors and understanding how your application behaves in unexpected situations.

*   **Blacklisting Middleware (`BlacklistingMiddleware`)**:
    *   Prevents access to your application from specified IP addresses. 
    *   Blacklisted IPs are configured in your Django settings file (`settings.py`).

#### How to Use:

1.  **Place in App Directory:** Save this `middleware.py` file within one of your Django app directories (e.g., `your_app/middleware.py`).

2.  **Update Settings (`settings.py`)**: Add the middleware classes to your Django project's `MIDDLEWARE` setting:

    ```python
    MIDDLEWARE = [
        # ... other middleware ...
        'your_app.middleware.RequestTimingMiddleware',  
        'your_app.middleware.URLBasedRateLimitingMiddleware',
        'your_app.middleware.ContentSecurityPolicyMiddleware',
        'your_app.middleware.ExceptionLoggingMiddleware',
        'your_app.middleware.BlacklistingMiddleware'
    ]
    ```
    (Replace `your_app` with the actual name of the app where you placed the middleware file.)

3.  **Additional Configuration:**
    *   Configure logging (e.g., in your `settings.py`) to view the messages from `LoggingMiddleware` and `ExceptionLoggingMiddleware`.
    *   Set up and configure Redis if you plan to use the rate-limiting feature.
    *   Adjust the CSP directives in `ContentSecurityPolicyMiddleware` to match your specific security requirements.
    *   Add blacklisted IP addresses to your `settings.py` file as a list under `BLACKLISTED_IPS` if you want to block access. 

## Contribution

Contributions to improve or extend the functionality of these middleware components are welcome. Please adhere to the project's contributing guidelines and code of conduct when making contributions.

## License

This entire project is licensed under MIT's license. View the [LICENSE](../LICENSE) file for more details.

---

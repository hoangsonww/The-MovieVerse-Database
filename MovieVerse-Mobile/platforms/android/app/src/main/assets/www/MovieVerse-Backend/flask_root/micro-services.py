microservices = {
    "movie_service": {
        "description": "Handles all movie-related operations",
        "framework": "Django",
        "database": "MySQL",
        "endpoints": [
            "/api/movies",
            "/api/movies/{id}",
        ]
    },
    "user_service": {
        "description": "Manages user authentication and profiles",
        "framework": "Flask",
        "database": "MongoDB",
        "endpoints": [
            "/api/users",
            "/api/users/{id}",
        ]
    },
    "rating_service": {
        "description": "Handles movie ratings and reviews",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/ratings",
            "/api/ratings/{id}",
        ]
    },
    "recommendation_service": {
        "description": "Generates movie recommendations for users",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/recommendations",
            "/api/recommendations/{id}",
        ]
    },
    "search_service": {
        "description": "Handles movie search",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/search",
            "/api/search/{id}",
        ]
    },
    "notification_service": {
        "description": "Handles notifications for users",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/notifications",
            "/api/notifications/{id}",
        ]
    },
    "payment_service": {
        "description": "Handles payments for users",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/payments",
            "/api/payments/{id}",
        ]
    },
    "analytics_service": {
        "description": "Handles analytics for the application",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/analytics",
            "/api/analytics/{id}",
        ]
    },
    "admin_service": {
        "description": "Handles admin operations",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/admin",
            "/api/admin/{id}",
        ]
    },
    "account_service": {
        "description": "Handles user accounts",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/accounts",
            "/api/accounts/{id}",
        ]
    },
    "subscription_service": {
        "description": "Handles user subscriptions",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/subscriptions",
            "/api/subscriptions/{id}",
        ]
    },
    "content_service": {
        "description": "Handles content management",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/content",
            "/api/content/{id}",
        ]
    },
    "review_service": {
        "description": "Handles movie reviews",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/reviews",
            "/api/reviews/{id}",
        ]
    },
    "genre_service": {
        "description": "Handles movie genres",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/genres",
            "/api/genres/{id}",
        ]
    },
    "actor_service": {
        "description": "Handles movie actors",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/actors",
            "/api/actors/{id}",
        ]
    },
    "director_service": {
        "description": "Handles movie directors",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/directors",
            "/api/directors/{id}",
        ]
    },
    "crew_service": {
        "description": "Handles movie crew",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/crew",
            "/api/crew/{id}",
        ]
    },
    "company_service": {
        "description": "Handles movie companies",
        "framework": "Flask",
        "database": "MySQL",
        "endpoints": [
            "/api/companies",
            "/api/companies/{id}",
        ]
    },
}

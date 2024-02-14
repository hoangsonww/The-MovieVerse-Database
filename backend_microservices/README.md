# MovieVerse Microservices Backend

---

## Overview

The backend of MovieVerse is built using a microservices architecture. This architecture allows for independent scalability and enhanced flexibility in the development of different functionalities of the app, such as authentication, user management, movie data processing, and more.

## Architecture

The microservices architecture of MovieVerse is designed to segregate the application into small, loosely coupled services. Each service is focused on a single business capability and can be developed, deployed, and scaled independently.

- **Authentication Service**: Manages user authentication and authorization.
- **User Service**: Handles user-related operations like profile management.
- **Movie Service**: Manages movie data and interactions.
- **Crawler Service**: Dynamically updates the database with new movie data from various online sources.
- **Review Service**: Handles user reviews and ratings.
- **Recommendation Service**: Provides movie recommendations to users based on their preferences and viewing history.
- **Search Service**: Offers comprehensive search functionality for movies and users.

## Getting Started

### Prerequisites

- Node.js
- Docker
- Docker Compose
- Express.js
- MongoDB
- MySQL
- PostgreSQL
- Flask
- Django
- Celery for asynchronous task queue
- Redis or RabbitMQ as a broker for Celery
- BeautifulSoup4 and Requests for web scraping in the Crawler Service
- Transformers and PyTorch for AI functionalities within the Crawler Service

### Installation

1. Clone the repository: `git clone https://github.com/hoangsonww/The-MovieVerse-Database.git`
2. Navigate to the repository: `cd backend_microservices`
3. Follow the specific installation instructions for each service below.

### Configuration

- Execute `setupMicroservices.sh` to configure the environment for all services.
- Each service has detailed configuration instructions to tailor the environment to your needs.

### Running the Services

To run a specific service:

1. Navigate to the service directory: `cd service_name`
2. Install dependencies: `npm install` (For Django-based services like the Crawler Service, use `pip install -r requirements.txt`)
3. Start the service: `npm start` (For Django-based services, use `python manage.py runserver`)

For the Crawler Service, additional steps might include setting up Celery workers and scheduling periodic tasks:

```bash
celery -A moviereviews worker --loglevel=info
celery -A moviereviews beat --loglevel=info
```

## Testing

To run tests for each microservice:

1. Navigate to the service's directory: `cd service_name`
2. Execute the test command: `npm test` (For Django-based services, use `python manage.py test`)
3. Remebmber to test the functionalities of the app visually, too!

---

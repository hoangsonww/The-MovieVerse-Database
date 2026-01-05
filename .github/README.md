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
- [Quick Links](#quick-links)
- [Platform Highlights](#platform-highlights)
- [Operational Modes](#operational-modes)
- [Features & Usage](#features--usage)
  - [Search & Discover](#search--discover)
  - [User Interaction](#user-interaction)
  - [Navigating the MovieVerse](#navigating-the-movieverse)
  - [Enhanced User Experience](#enhanced-user-experience)
  - [Additional Features](#additional-features)
- [Project Structure](#project-structure)
- [Service Catalog](#service-catalog)
- [Deployment](#deployment)
- [Environment Configuration](#environment-configuration)
- [Observability & Monitoring](#observability--monitoring)
- [Operations Checklist](#operations-checklist)
- [CI/CD & Release](#cicd--release)
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
> **This open-source repository is not the production repository for The MovieVerse. The deployed repository is private for security reasons. This repository is only for educational purposes and to showcase _parts_ of codebase of The MovieVerse, which may differ significantly from the official, private codebase. However, this codebase is still functional (if you would like to run the app locally) and actively maintained.**

## User Interface

<p align="center" style="cursor: pointer">
  <a href="https://movie-verse.com">
    <img src="../images/MovieVerse-UI.png" alt="The MovieVerse App Interface" style="border-radius: 10px" width="100%"/>
  </a>
</p>

## Live URLs

- **Official Website**: [https://movie-verse.com](https://movie-verse.com)
- **Self-Hosted Edge Gateway (Docker Compose)**: `http://localhost:8080`
- **Self-Hosted AI API (Docker Compose)**: `http://localhost:9100`
- **OpenAPI Spec**: `MovieVerse-Backend/APIs/movieverse-openapi.yaml`

### Local Observability Endpoints

- **Kibana**: `http://localhost:5601`
- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3000`
- **Jaeger**: `http://localhost:16686`

### Platform Status

![All Systems Operational](https://img.shields.io/badge/All_Systems-Operational-brightgreen)
![Website Status](https://img.shields.io/website?down_color=red&down_message=Offline&label=Website&up_color=brightgreen&up_message=Online&url=https%3A%2F%2Fmovie-verse.com)
![Microservices](https://img.shields.io/badge/Microservices-Production_Ready-brightgreen)
![AI Platform](https://img.shields.io/badge/AI_Platform-Production_Ready-brightgreen)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-brightgreen)
![Observability](https://img.shields.io/badge/Observability-Enabled-brightgreen)
![CI/CD](https://img.shields.io/badge/CI%2FCD-Jenkins_Ready-brightgreen)

## Quick Links

- Backend microservices: `MovieVerse-Backend/README.md`
- AI platform: `MovieVerse-AI/README.md`
- Middleware: `MovieVerse-Middleware/README.md`
- Architecture deep dive: `MovieVerse-Design/DESIGN.md`
- Kubernetes: `kubernetes/README.md`
- AWS infrastructure: `aws/README.md`
- Jenkins pipelines: `jenkins/README.md`

## Platform Highlights

- Full microservices architecture with a Django gateway (BFF) and FastAPI services.
- Production AI/ML platform with feature store, registry, pipelines, and inference API.
- Event-driven backbone via Kafka and RabbitMQ plus search via OpenSearch.
- Edge routing, rate limiting, and security headers through Nginx + shared middleware.
- Infrastructure-ready: Docker Compose, Kubernetes, AWS CloudFormation, Jenkins pipelines.
- Observability stack with ELK, Prometheus, Grafana, and Jaeger.

## Operational Modes

- **Local development**: Docker Compose for microservices, AI stack, and edge gateway.
- **Staging/QA**: Kubernetes manifests with environment-specific ConfigMaps/Secrets.
- **Production**: AWS-managed data services + Kubernetes services + CI/CD automation.

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

The MovieVerse is a full-stack application with a production-ready microservices backend and an AI platform. Core directories include:

1. `MovieVerse-Backend`: Microservices, Django gateway, crawler, APIs, and data stores. ([Read more](../MovieVerse-Backend/README.md))
2. `MovieVerse-AI`: End-to-end AI/ML platform (pipelines, registry, inference). ([Read more](../MovieVerse-AI/README.md))
3. `MovieVerse-Frontend`: Web UI and client assets. ([Read more](../MovieVerse-Frontend/README.md))
4. `MovieVerse-Mobile`: Mobile app (Cordova). ([Read more](../MovieVerse-Mobile/README.md))
5. `MovieVerse-Middleware`: Shared middleware, security headers, and rate limiting. ([Read more](../MovieVerse-Middleware/README.md))

Platform and deployment assets live in `kubernetes/`, `aws/`, `infrastructure/`, `deployment/`, `jenkins/`, and `docs/`, alongside supporting utilities such as `MovieVerse-Utilities` and `MovieVerse-Design`.

> [!NOTE]
> As a reminder, this repository is not the official production repository for The MovieVerse. The official codebase is private for security reasons. This repository is only for educational purposes and to showcase _parts_ of the codebase of The MovieVerse, which may differ significantly from the official, private codebase. However, this codebase is still functional (if you would like to run the app locally) and actively maintained.

## Service Catalog

### Core Microservices

- **Auth Service**: user registration, login, JWT issuance.
- **User Service**: profile management and user preferences.
- **Movie Service**: movie catalog and metadata ingestion.
- **Review Service**: ratings, reviews, and event emission.
- **Search Service**: OpenSearch-backed movie and review search.
- **Search Indexer Service**: batch reindex pipelines for search.
- **Notification Service**: notification API + RabbitMQ fan-out.
- **Recommendation Service**: AI-backed recommendations with cache.
- **Metadata Service**: genres, people, and analysis in MongoDB.
- **Crawler Service**: crawl orchestration + RabbitMQ queue.
- **Data Platform Service**: TMDB ingestion, health checks, controlled seeding.

### AI Platform

- **AI API**: inference endpoints for recommendations, similarity, ranking, sentiment, summarization, and vision.
- **Pipelines**: feature builds, training, embeddings, and registry sync.
- **Model Registry**: MLflow for experiments and artifact storage.
- **Feature Store**: Feast (offline + Redis online store).

### Data + Messaging

- **Datastores**: PostgreSQL, MySQL, MongoDB, Redis, OpenSearch.
- **Messaging**: Kafka events + RabbitMQ queues for async workflows.

## Deployment

The official website is currently deployed LIVE at **[movie-verse.com](https://movie-verse.com)**. This repository ships a production-ready microservices + AI platform with containerized runtime, observability, and deployment automation.

- **Local stack**: `docker-compose.microservices.yml` for backend services and `MovieVerse-AI/docker-compose.ai.yml` for AI.
- **Kubernetes**: production manifests in `kubernetes/` and `MovieVerse-AI/k8s/`.
- **AWS**: CloudFormation templates in `aws/` for RDS, MSK, MQ, OpenSearch, ElastiCache, and EKS.
- **CI/CD**: Jenkins pipelines and scripts in `jenkins/` for build, publish, and deploy.
- **Observability**: ELK + Prometheus/Grafana/Jaeger assets in `infrastructure/`.
- **Docs**: see `kubernetes/README.md`, `MovieVerse-AI/k8s/README.md`, `aws/README.md`, and `jenkins/README.md`.

The app is deployed with blue-green & canary deployments, autoscaling, and managed AWS services for reliability and scalability.

## Environment Configuration

- **Django gateway**: `DJANGO_DEBUG`, `DJANGO_SECRET_KEY`, and `DJANGO_DB_ENGINE` + `DJANGO_DB_NAME` for production DBs.
- **Microservices**: `MOVIEVERSE_ENVIRONMENT`, `MOVIEVERSE_AUTO_MIGRATE`, `MOVIEVERSE_JWT_SECRET`, DSNs/URLs for Postgres, MySQL, Mongo, Redis, Kafka, RabbitMQ, and OpenSearch.
- **AI platform**: `MOVIEVERSE_AI_*` for data sources, MLflow registry, and artifact storage (S3/MinIO).
- **Kubernetes**: edit `kubernetes/base/configmap.yml` and `kubernetes/base/secrets.yml` for environment overrides.
- **Security**: never commit secrets; use Secret managers or CI/CD variables.

## Observability & Monitoring

- **Metrics**: each service exposes `/metrics` (Prometheus scrape targets).
- **Tracing**: Jaeger supports distributed tracing in the observability stack.
- **Logging**: ELK stack configured in `infrastructure/elk/` and `docker-compose.observability.yml`.
- **Dashboards**: Grafana + Kibana for service health, latency, and logs.

## Operations Checklist

- Set production secrets (`MOVIEVERSE_JWT_SECRET`, database credentials, `DJANGO_SECRET_KEY`).
- Ensure `MOVIEVERSE_AUTO_MIGRATE=false` and seeding disabled in production.
- Configure Nginx ingress/TLS and trusted origins for the Django gateway.
- Verify Kafka, RabbitMQ, and OpenSearch connectivity before scaling services.
- Apply Kubernetes resource limits/quotas and tune autoscaling policies.
- Confirm backups for Postgres, MySQL, Mongo, and OpenSearch indices.

## CI/CD & Release

- **Jenkins pipelines**: `jenkins/Jenkinsfile.microservices`, `jenkins/Jenkinsfile.ai`, `jenkins/Jenkinsfile.infra`.
- **Builds**: `jenkins/scripts/build-images.sh` builds and pushes service images.
- **Deploy**: `jenkins/scripts/deploy-k8s.sh` applies Kubernetes manifests.
- **Infra**: `jenkins/scripts/deploy-aws.sh` provisions AWS dependencies via CloudFormation.

## Technology Stack

| Frontend | Backend/API | Data/Infra/DevOps | AI/ML |
| --- | --- | --- | --- |
| HTML5 + CSS3 + Vanilla JS | Django Gateway + DRF | PostgreSQL + MySQL | LightFM Recommenders |
| Webpack + Babel | FastAPI Microservices + Uvicorn | MongoDB + Redis | SentenceTransformers + FAISS |
| Cordova Mobile | Nginx Edge Gateway | Kafka + RabbitMQ | scikit-learn (ranking, sentiment) |
| WebAssembly + Emscripten | Python 3.11 + SQLAlchemy + Pydantic | OpenSearch + ELK | Feast Feature Store |
| Node.js + npm | OpenAPI + Swagger + ReDoc | Prometheus + Grafana + Jaeger + Loki | MLflow + Airflow |
| Font Awesome Icons + TypeScript (optional) | JWT Auth (JOSE + Passlib) | Kubernetes + Docker + Jenkins + AWS (EKS/RDS/MSK/MQ/S3/ElastiCache) | PyTorch + MinIO |

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Optional-3178C6?logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-Frontend-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Frontend-1572B6?logo=css3&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-Icons-528DD7?logo=fontawesome&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Tooling-339933?logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-Tooling-CB3837?logo=npm&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-Bundler-8DD6F9?logo=webpack&logoColor=black)
![Babel](https://img.shields.io/badge/Babel-Transpiler-F9DC3E?logo=babel&logoColor=black)
![Cordova](https://img.shields.io/badge/Cordova-Mobile-35434F?logo=apachecordova&logoColor=white)
![WebAssembly](https://img.shields.io/badge/WebAssembly-Enabled-654FF0?logo=webassembly&logoColor=white)
![Emscripten](https://img.shields.io/badge/Emscripten-Toolchain-000000?logo=emacs&logoColor=white)

![Django](https://img.shields.io/badge/Django-Gateway-092E20?logo=django&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/DRF-API-A30000?logo=django&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Microservices-009688?logo=fastapi&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-2E2E2E?logo=gunicorn&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Edge-009639?logo=nginx&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI-Spec-6BA539?logo=openapiinitiative&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-Docs-85EA2D?logo=swagger&logoColor=black)
![ReDoc](https://img.shields.io/badge/ReDoc-Docs-8A2BE2?logo=readthedocs&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?logo=sqlalchemy&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-Validation-E92063?logo=pydantic&logoColor=white)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Data-4169E1?logo=postgresql&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Data-4479A1?logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Data-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white)
![OpenSearch](https://img.shields.io/badge/OpenSearch-Search-005EB8?logo=opensearch&logoColor=white)
![Kafka](https://img.shields.io/badge/Kafka-Events-231F20?logo=apachekafka&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Queue-FF6600?logo=rabbitmq&logoColor=white)

![ELK](https://img.shields.io/badge/ELK-Logging-005571?logo=elasticstack&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-Search-005571?logo=elasticsearch&logoColor=white)
![Logstash](https://img.shields.io/badge/Logstash-ETL-005571?logo=logstash&logoColor=white)
![Kibana](https://img.shields.io/badge/Kibana-Analytics-005571?logo=kibana&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-E6522C?logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-Dashboards-F46800?logo=grafana&logoColor=white)
![Jaeger](https://img.shields.io/badge/Jaeger-Tracing-60D0E4?logo=jaeger&logoColor=black)
![Loki](https://img.shields.io/badge/Loki-Logs-F7B93E?logo=grafana&logoColor=black)

![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-Orchestration-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-326CE5?logo=kubernetes&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-Cloud-232F3E?logo=amazonaws&logoColor=white)
![CloudFormation](https://img.shields.io/badge/CloudFormation-IaC-FF9900?logo=amazonaws&logoColor=white)
![EKS](https://img.shields.io/badge/Amazon_EKS-Cluster-FF9900?logo=amazoneks&logoColor=white)
![RDS](https://img.shields.io/badge/Amazon_RDS-Database-527FFF?logo=amazonrds&logoColor=white)
![MSK](https://img.shields.io/badge/Amazon_MSK-Kafka-FF9900?logo=apachekafka&logoColor=white)
![Amazon MQ](https://img.shields.io/badge/Amazon_MQ-RabbitMQ-FF9900?logo=rabbitmq&logoColor=white)
![ElastiCache](https://img.shields.io/badge/ElastiCache-Redis-FF9900?logo=redis&logoColor=white)
![S3](https://img.shields.io/badge/S3-Storage-569A31?logo=amazons3&logoColor=white)
![MinIO](https://img.shields.io/badge/MinIO-Artifacts-C72E49?logo=minio&logoColor=white)

![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?logo=jenkins&logoColor=white)
![Airflow](https://img.shields.io/badge/Airflow-Pipelines-017CEE?logo=apacheairflow&logoColor=white)
![MLflow](https://img.shields.io/badge/MLflow-Registry-0194E2?logo=mlflow&logoColor=white)
![Feast](https://img.shields.io/badge/Feast-Feature_Store-4B8BF5?logo=feast&logoColor=white)
![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-2E2E2E)
![SentenceTransformers](https://img.shields.io/badge/SentenceTransformers-Embeddings-1F2937)
![LightFM](https://img.shields.io/badge/LightFM-Recommenders-0B7285)
![scikit--learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikitlearn&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-Deep_Learning-EE4C2C?logo=pytorch&logoColor=white)

## API Documentation

The MovieVerse API surface is documented in `MovieVerse-Backend/APIs/` with an OpenAPI spec and curated request examples. Each FastAPI service exposes `/docs` and `/redoc` when running, and the Nginx edge gateway fronts the unified API.

- Use `MovieVerse-Backend/APIs/api.http` for manual requests and `MovieVerse-Backend/APIs/api_test_suite.py` for smoke tests.

```mermaid
flowchart LR
    Client[Web + Mobile Clients] --> Edge[Nginx Edge Gateway]
    Edge --> Gateway[Django Gateway / BFF]
    Gateway --> Auth[Auth Service]
    Gateway --> User[User Service]
    Gateway --> Movie[Movie Service]
    Gateway --> Review[Review Service]
    Gateway --> Search[Search Service]
    Gateway --> Recommend[Recommendation Service]
    Gateway --> Metadata[Metadata Service]
    Gateway --> Crawler[Crawler Service]
    Auth --> Postgres[(PostgreSQL)]
    User --> Postgres
    Review --> Postgres
    Movie --> MySQL[(MySQL)]
    Metadata --> Mongo[(MongoDB)]
    Search --> OpenSearch[(OpenSearch)]
    Recommend --> Redis[(Redis)]
    Recommend --> AI[MovieVerse AI API]
    Gateway --> Kafka[(Kafka Events)]
    Gateway --> RabbitMQ[(RabbitMQ Workers)]
```

### Swagger Documentation

Use the `/docs` endpoint on each FastAPI service, or load `MovieVerse-Backend/APIs/movieverse-openapi.yaml` in Swagger UI.

### ReDoc Documentation

Use the `/redoc` endpoint on each FastAPI service, or render `MovieVerse-Backend/APIs/movieverse-openapi.yaml` in ReDoc.

## Architecture

Here are some detailed flowcharts illustrating the microservices + AI architecture:

### Microservices Platform Overview

```mermaid
flowchart LR
    Clients[Web + Mobile Clients] --> Edge[Nginx Edge Gateway]
    Edge --> Gateway[Django Gateway / BFF]
    Gateway --> Services[FastAPI Microservices]
    Services --> Data[(Postgres, MySQL, Mongo, Redis, OpenSearch)]
    Services --> Events[(Kafka + RabbitMQ)]
    Services --> AI[MovieVerse AI Platform]
    Services --> Obs[Prometheus + Grafana + ELK]
```

### Data + Search Pipeline

```mermaid
flowchart LR
    TMDB[TMDB + External Sources] --> DataPlatform[Data Platform Service]
    DataPlatform --> MovieSvc[Movie Service]
    DataPlatform --> MetadataSvc[Metadata Service]
    Crawler[Crawler Service] --> MovieSvc
    MovieSvc --> Indexer[Search Indexer Service]
    Indexer --> OpenSearch[(OpenSearch)]
    OpenSearch --> SearchSvc[Search Service]
    SearchSvc --> Gateway[Django Gateway]
```

### AI/ML Lifecycle

```mermaid
flowchart TD
    Events[(Kafka Events)] --> Ingest[Ingest + Feature Builds]
    Ingest --> Feast[Feast Feature Store]
    Feast --> Materialize[Materialize Online Features]
    Materialize --> Redis[(Redis Online Store)]
    Ingest --> Train[Train Models]
    Train --> Registry[MLflow Registry]
    Registry --> Serve[AI API Inference]
    Serve --> Gateway[Django Gateway]
```

## Getting Started

### Local Quick Start (Microservices + Edge)

```bash
docker compose -f docker-compose.microservices.yml up -d
```

The edge gateway is available at `http://localhost:8080`.

### Local AI Platform

```bash
docker compose -f MovieVerse-AI/docker-compose.ai.yml up -d
psql postgresql://movieverse:movieverse@localhost:5433/movieverse_ai \
  -f MovieVerse-AI/sql/postgres_init.sql
```

Optional training and feature pipelines:

```bash
python -m movieverse_ai.pipelines.train_recommender
python -m movieverse_ai.pipelines.train_sentiment
python -m movieverse_ai.pipelines.train_ranker
```

### Observability Stack

```bash
docker compose -f docker-compose.microservices.yml -f docker-compose.observability.yml up -d
```

### Django Gateway (Optional Dev Run)

```bash
export DJANGO_DEBUG=true
export DJANGO_SECRET_KEY=change-me
python MovieVerse-Backend/django_backend/manage.py runserver
```

### Frontend Development

```bash
npm install
npm start
```

### Mobile App (Cordova)

```bash
cd MovieVerse-Mobile
npm install
cordova platform add ios
cordova platform add android
cordova build
```

### Kubernetes Deploy

```bash
kubectl apply -f kubernetes/base/
kubectl apply -f kubernetes/infra/
kubectl apply -f kubernetes/services/
kubectl apply -f kubernetes/edge/
kubectl apply -f MovieVerse-AI/k8s/
```

### AWS Deploy

Use the CloudFormation templates in `aws/` or the Jenkins helper script:

```bash
jenkins/scripts/deploy-aws.sh
```

### Contribution Flow

1. Fork the project and create a feature branch.
2. Make changes and verify locally.
3. Commit with `Update:` or `Fix:` prefixes and open a PR.

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

Created with ❤️ between 2023-2026 by [Son Nguyen](https://github.com/hoangsonww).

© 2026 The MovieVerse. All Rights Reserved.

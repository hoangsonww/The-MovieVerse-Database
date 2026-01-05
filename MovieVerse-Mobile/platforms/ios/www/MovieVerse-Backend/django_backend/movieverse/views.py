from __future__ import annotations

import logging

import requests
from django.shortcuts import render
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import (
    AuthLoginSerializer,
    AuthRefreshSerializer,
    AuthRegisterSerializer,
    MovieCreateSerializer,
    MovieUpdateSerializer,
    NotificationCreateSerializer,
    ProfileCreateSerializer,
    ProfileUpdateSerializer,
    RecommendationRequestSerializer,
    ReviewCreateSerializer,
    SearchRequestSerializer,
    SimilarRequestSerializer,
)
from .service_clients import (
    create_movie,
    create_profile,
    create_review,
    enqueue_crawl,
    get_genre,
    get_movie,
    get_movie_analysis,
    get_person,
    get_profile,
    get_recommendations,
    get_similar,
    list_genres,
    list_movies,
    list_notifications,
    list_people,
    list_reviews_for_movie,
    list_reviews_for_user,
    login_user,
    notify_user,
    refresh_user_token,
    register_user,
    search_movies,
    search_reviews,
    update_movie,
    update_profile,
)

logger = logging.getLogger(__name__)


def index(request):
    return render(request, "movieverse/index.html")


def healthz(_request):
    return Response({"status": "ok"})


class MovieViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        params = {
            "limit": request.query_params.get("limit", 50),
            "genre": request.query_params.get("genre"),
        }
        try:
            movies = list_movies(params, request=request)
            return Response(movies)
        except requests.RequestException as exc:
            logger.warning("movie_list_failed", extra={"error": str(exc)})
            return Response({"detail": "Movie service unavailable"}, status=503)

    def retrieve(self, request, pk=None):
        try:
            movie = get_movie(int(pk), request=request)
            return Response(movie)
        except requests.RequestException as exc:
            logger.warning("movie_get_failed", extra={"error": str(exc)})
            return Response({"detail": "Movie not found"}, status=404)

    def create(self, request):
        serializer = MovieCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            movie = create_movie(serializer.validated_data, request=request)
            return Response(movie, status=201)
        except requests.RequestException as exc:
            logger.warning("movie_create_failed", extra={"error": str(exc)})
            return Response({"detail": "Movie create failed"}, status=502)

    def update(self, request, pk=None):
        serializer = MovieUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        try:
            movie = update_movie(int(pk), serializer.validated_data, request=request)
            return Response(movie)
        except requests.RequestException as exc:
            logger.warning("movie_update_failed", extra={"error": str(exc)})
            return Response({"detail": "Movie update failed"}, status=502)


class GenreViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        try:
            payload = list_genres(limit=int(request.query_params.get("limit", 50)), request=request)
            return Response(payload.get("items", []))
        except requests.RequestException as exc:
            logger.warning("genre_list_failed", extra={"error": str(exc)})
            return Response({"detail": "Metadata service unavailable"}, status=503)

    def retrieve(self, request, pk=None):
        try:
            genre = get_genre(int(pk), request=request)
            return Response(genre)
        except requests.RequestException as exc:
            logger.warning("genre_get_failed", extra={"error": str(exc)})
            return Response({"detail": "Genre not found"}, status=404)


class PersonViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        try:
            payload = list_people(
                limit=int(request.query_params.get("limit", 50)),
                q=request.query_params.get("q"),
                department=request.query_params.get("department"),
                request=request,
            )
            return Response(payload.get("items", []))
        except requests.RequestException as exc:
            logger.warning("person_list_failed", extra={"error": str(exc)})
            return Response({"detail": "Metadata service unavailable"}, status=503)

    def retrieve(self, request, pk=None):
        try:
            person = get_person(int(pk), request=request)
            return Response(person)
        except requests.RequestException as exc:
            logger.warning("person_get_failed", extra={"error": str(exc)})
            return Response({"detail": "Person not found"}, status=404)


class ReviewViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        movie_id = request.query_params.get("movie_id")
        user_id = request.query_params.get("user_id")
        try:
            if movie_id:
                reviews = list_reviews_for_movie(int(movie_id), request=request)
                return Response(reviews)
            if user_id:
                reviews = list_reviews_for_user(int(user_id), request=request)
                return Response(reviews)
            return Response({"detail": "movie_id or user_id required"}, status=400)
        except requests.RequestException as exc:
            logger.warning("review_list_failed", extra={"error": str(exc)})
            return Response({"detail": "Review service unavailable"}, status=503)

    def create(self, request):
        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            review = create_review(serializer.validated_data, request=request)
            return Response(review, status=201)
        except requests.RequestException as exc:
            logger.warning("review_create_failed", extra={"error": str(exc)})
            return Response({"detail": "Review create failed"}, status=502)


class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, pk=None):
        try:
            profile = get_profile(int(pk), request=request)
            return Response(profile)
        except requests.RequestException as exc:
            logger.warning("profile_get_failed", extra={"error": str(exc)})
            return Response({"detail": "Profile not found"}, status=404)

    def create(self, request):
        serializer = ProfileCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            profile = create_profile(serializer.validated_data, request=request)
            return Response(profile, status=201)
        except requests.RequestException as exc:
            logger.warning("profile_create_failed", extra={"error": str(exc)})
            return Response({"detail": "Profile create failed"}, status=502)

    def update(self, request, pk=None):
        serializer = ProfileUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        try:
            profile = update_profile(int(pk), serializer.validated_data, request=request)
            return Response(profile)
        except requests.RequestException as exc:
            logger.warning("profile_update_failed", extra={"error": str(exc)})
            return Response({"detail": "Profile update failed"}, status=502)


class RecommendationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        serializer = RecommendationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            payload = get_recommendations(serializer.validated_data, request=request)
            return Response(payload)
        except requests.RequestException as exc:
            logger.warning("recommendations_failed", extra={"error": str(exc)})
            return Response({"detail": "Recommendation service unavailable"}, status=503)

    @action(detail=False, methods=["post"])
    def similar(self, request):
        serializer = SimilarRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            payload = get_similar(serializer.validated_data, request=request)
            return Response(payload)
        except requests.RequestException as exc:
            logger.warning("similar_failed", extra={"error": str(exc)})
            return Response({"detail": "Recommendation service unavailable"}, status=503)


class SearchViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        serializer = SearchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            results = search_movies(
                serializer.validated_data["query"],
                serializer.validated_data.get("limit", 20),
                request=request,
            )
            return Response({"results": results})
        except requests.RequestException as exc:
            logger.warning("search_failed", extra={"error": str(exc)})
            return Response({"detail": "Search service unavailable"}, status=503)

    @action(detail=False, methods=["post"], url_path="reviews")
    def reviews(self, request):
        serializer = SearchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            results = search_reviews(
                serializer.validated_data["query"],
                serializer.validated_data.get("limit", 20),
                request=request,
            )
            return Response({"results": results})
        except requests.RequestException as exc:
            logger.warning("search_reviews_failed", extra={"error": str(exc)})
            return Response({"detail": "Search service unavailable"}, status=503)


class NotificationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"detail": "user_id is required"}, status=400)
        try:
            notifications = list_notifications(int(user_id), request=request)
            return Response(notifications)
        except requests.RequestException as exc:
            logger.warning("notifications_failed", extra={"error": str(exc)})
            return Response({"detail": "Notification service unavailable"}, status=503)

    def create(self, request):
        serializer = NotificationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            payload = notify_user(serializer.validated_data, request=request)
            return Response(payload, status=201)
        except requests.RequestException as exc:
            logger.warning("notify_failed", extra={"error": str(exc)})
            return Response({"detail": "Notification failed"}, status=502)


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["post"])
    def register(self, request):
        serializer = AuthRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            payload = register_user(serializer.validated_data, request=request)
            return Response(payload, status=status.HTTP_201_CREATED)
        except requests.RequestException as exc:
            logger.warning("register_failed", extra={"error": str(exc)})
            return Response({"detail": "Registration failed"}, status=502)

    @action(detail=False, methods=["post"])
    def login(self, request):
        serializer = AuthLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            payload = login_user(serializer.validated_data, request=request)
            return Response(payload)
        except requests.RequestException as exc:
            logger.warning("login_failed", extra={"error": str(exc)})
            return Response({"detail": "Login failed"}, status=401)

    @action(detail=False, methods=["post"])
    def refresh(self, request):
        serializer = AuthRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            payload = refresh_user_token(serializer.validated_data, request=request)
            return Response(payload)
        except requests.RequestException as exc:
            logger.warning("refresh_failed", extra={"error": str(exc)})
            return Response({"detail": "Refresh failed"}, status=401)


class CrawlViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        try:
            payload = enqueue_crawl(request.data, request=request)
            return Response(payload, status=202)
        except requests.RequestException as exc:
            logger.warning("crawl_enqueue_failed", extra={"error": str(exc)})
            return Response({"detail": "Crawler unavailable"}, status=503)


def search(request):
    query = request.GET.get("search") or request.GET.get("q") or ""
    try:
        movies = search_movies(query, request=request) if query else []
    except requests.RequestException as exc:
        logger.warning("search_failed", extra={"error": str(exc)})
        movies = []
    return render(request, "movieverse/search.html", {"movies": movies, "query": query})


def movie_detail(request, movie_id):
    try:
        movie = get_movie(movie_id, request=request)
        reviews = list_reviews_for_movie(movie_id, request=request)
        try:
            analysis = get_movie_analysis(movie_id, request=request)
        except requests.RequestException:
            analysis = {}
    except requests.RequestException as exc:
        logger.warning("movie_detail_failed", extra={"error": str(exc)})
        return render(
            request,
            "movieverse/movie_detail.html",
            {"movie": {}, "reviews": [], "analysis": {}},
            status=404,
        )
    return render(
        request,
        "movieverse/movie_detail.html",
        {"movie": movie, "reviews": reviews, "analysis": analysis},
    )

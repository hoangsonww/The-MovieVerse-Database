from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'movies', views.MovieViewSet, basename='movie')
router.register(r'genres', views.GenreViewSet, basename='genre')
router.register(r'people', views.PersonViewSet, basename='person')
router.register(r'reviews', views.ReviewViewSet, basename='review')
router.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('search/', views.search, name='search'),
    path('movies/<int:movie_id>/', views.movie_detail, name='movie_detail'),
    path('api/', include(router.urls)),
    # AI Agent endpoints
    path('api/agent/what-to-watch/', views.agent_what_to_watch, name='agent_what_to_watch'),
    path('api/agent/trivia/', views.agent_trivia, name='agent_trivia'),
    path('api/agent/rewatch-reminder/', views.agent_rewatch_reminder, name='agent_rewatch_reminder'),
    path('api/agent/weekly-watchlist/', views.agent_weekly_watchlist, name='agent_weekly_watchlist'),
]

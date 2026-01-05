from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = "movieverse"

router = DefaultRouter()
router.register(r'movies', views.MovieViewSet, basename='movie')
router.register(r'genres', views.GenreViewSet, basename='genre')
router.register(r'people', views.PersonViewSet, basename='person')
router.register(r'reviews', views.ReviewViewSet, basename='review')
router.register(r'profiles', views.ProfileViewSet, basename='profile')
router.register(r'recommendations', views.RecommendationViewSet, basename='recommendation')
router.register(r'search', views.SearchViewSet, basename='search')
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'auth', views.AuthViewSet, basename='auth')
router.register(r'crawl', views.CrawlViewSet, basename='crawl')

urlpatterns = [
    path('', views.index, name='index'),
    path('healthz/', views.healthz, name='healthz'),
    path('search/', views.search, name='search'),
    path('movies/<int:movie_id>/', views.movie_detail, name='movie_detail'),
    path('api/', include(router.urls)),
]

from django.urls import path, include
from django.contrib import admin
from . import views
from rest_framework.routers import DefaultRouter

admin.site.site_header = "MovieVerse Application - Backend Administration"

router = DefaultRouter()
router.register(r'movies', views.MovieViewSet)
router.register(r'actors', views.ActorViewSet)

urlpatterns = [
    path('', views.index, name='index'),
    path('search/', views.search, name='search'),
    path('<int:movie_id>/', views.movie_detail, name='movie_detail'),
    path('<actor_id>/', views.actor_detail, name='actor_detail'),
    path('like/<int:movie_id>/', views.like_movie, name='like_movie'),
    path('comment/<int:movie_id>/', views.add_comment, name='add_comment'),
    path('api/', include(router.urls)),
]

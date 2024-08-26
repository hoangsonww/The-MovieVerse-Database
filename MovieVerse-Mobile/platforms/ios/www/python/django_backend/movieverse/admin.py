from django.contrib import admin
from .models import Movie, Actor, Director, Genre

admin.site.site_header = "MovieVerse Application - Backend Administration"


class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'overview', 'poster_path', 'vote_average', 'release_date')
    search_fields = ('title', 'overview', 'poster_path', 'vote_average', 'release_date')
    list_filter = ('title', 'release_date')
    ordering = ('title',)


admin.site.register(Movie, MovieAdmin)


class ActorAdmin(admin.ModelAdmin):
    list_display = ('name', 'date_of_birth', 'profile_path', 'biography')
    search_fields = ('name', 'date_of_birth', 'profile_path', 'biography')
    list_filter = ('name', 'date_of_birth')
    ordering = ('name',)


admin.site.register(Actor, ActorAdmin)


class DirectorAdmin(admin.ModelAdmin):
    list_display = ('name', 'date_of_birth', 'profile_path', 'biography')
    search_fields = ('name', 'date_of_birth', 'profile_path', 'biography')
    list_filter = ('name', 'date_of_birth')
    ordering = ('name',)


admin.site.register(Director, DirectorAdmin)


class GenreAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    list_filter = ('name',)
    ordering = ('name',)


admin.site.register(Genre, GenreAdmin)

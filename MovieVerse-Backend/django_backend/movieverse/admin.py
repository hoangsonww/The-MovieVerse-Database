from django.contrib import admin
from django.db import connections
from .models import Movie, Genre, Person, Review, User

admin.site.site_header = "MovieVerse Application - Backend Administration"


class MovieAdmin(admin.ModelAdmin):
    using = 'movies_db'

    list_display = ('title', 'releaseDate', 'voteAverage')
    search_fields = ('title', 'overview', 'releaseDate')
    list_filter = ('releaseDate', 'genres')
    ordering = ('title', 'releaseDate')

    def get_queryset(self, request):
        return super().get_queryset(request).using(self.using)

    def save_model(self, request, obj, form, change):
        obj.save(using=self.using)


class GenreAdmin(admin.ModelAdmin):
    using = 'genres_db'

    list_display = ('name',)
    search_fields = ('name',)

    def get_queryset(self, request):
        return super().get_queryset(request).using(self.using)

    def save_model(self, request, obj, form, change):
        obj.save(using=self.using)


class PersonAdmin(admin.ModelAdmin):
    using = 'people_db'

    list_display = ('name', 'knownForDepartment')
    search_fields = ('name',)
    list_filter = ('knownForDepartment',)

    def get_queryset(self, request):
        return super().get_queryset(request).using(self.using)

    def save_model(self, request, obj, form, change):
        obj.save(using=self.using)


class ReviewAdmin(admin.ModelAdmin):
    using = 'reviews_db'

    list_display = ('id', 'userId', 'movieId', 'rating', 'createdAt', 'reviewText')
    search_fields = ('reviewText',)
    list_filter = ('rating', 'createdAt')

    def get_queryset(self, request):
        return super().get_queryset(request).using(self.using)

    def save_model(self, request, obj, form, change):
        obj.save(using=self.using)


class UserAdmin(admin.ModelAdmin):
    using = 'users_db'

    list_display = ('username', 'email', 'firstName', 'lastName')
    search_fields = ('username', 'email')

    def get_queryset(self, request):
        return super().get_queryset(request).using(self.using)

    def save_model(self, request, obj, form, change):
        obj.save(using=self.using)


admin.site.register(Movie, MovieAdmin)
admin.site.register(Genre, GenreAdmin)
admin.site.register(Person, PersonAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(User, UserAdmin)

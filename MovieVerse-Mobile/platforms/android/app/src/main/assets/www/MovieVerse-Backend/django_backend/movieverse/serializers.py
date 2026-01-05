from rest_framework import serializers


class MovieSerializer(serializers.Serializer):
    movie_id = serializers.IntegerField()
    tmdb_id = serializers.IntegerField(required=False, allow_null=True)
    title = serializers.CharField()
    overview = serializers.CharField(required=False, allow_blank=True)
    genres = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    release_date = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    rating = serializers.FloatField(required=False, allow_null=True)
    popularity = serializers.FloatField(required=False, allow_null=True)


class MovieCreateSerializer(serializers.Serializer):
    tmdb_id = serializers.IntegerField(required=False, allow_null=True)
    title = serializers.CharField()
    overview = serializers.CharField(required=False, allow_blank=True)
    genres = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    release_date = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    rating = serializers.FloatField(required=False, allow_null=True)
    popularity = serializers.FloatField(required=False, allow_null=True)


class MovieUpdateSerializer(serializers.Serializer):
    tmdb_id = serializers.IntegerField(required=False, allow_null=True)
    title = serializers.CharField(required=False, allow_blank=True)
    overview = serializers.CharField(required=False, allow_blank=True)
    genres = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    release_date = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    rating = serializers.FloatField(required=False, allow_null=True)
    popularity = serializers.FloatField(required=False, allow_null=True)


class GenreSerializer(serializers.Serializer):
    genre_id = serializers.IntegerField()
    name = serializers.CharField()


class PersonSerializer(serializers.Serializer):
    person_id = serializers.IntegerField()
    name = serializers.CharField()
    biography = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    birthday = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    deathday = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    profile_path = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    known_for_department = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class ReviewSerializer(serializers.Serializer):
    review_id = serializers.IntegerField()
    user_id = serializers.IntegerField()
    movie_id = serializers.IntegerField()
    rating = serializers.FloatField()
    review_text = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(required=False)


class ReviewCreateSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    movie_id = serializers.IntegerField()
    rating = serializers.FloatField()
    review_text = serializers.CharField(required=False, allow_blank=True)


class ProfileSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    display_name = serializers.CharField()
    bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    favorite_genres = serializers.ListField(child=serializers.CharField(), required=False)


class ProfileCreateSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    display_name = serializers.CharField()
    bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    favorite_genres = serializers.ListField(child=serializers.CharField(), required=False)


class ProfileUpdateSerializer(serializers.Serializer):
    display_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    favorite_genres = serializers.ListField(child=serializers.CharField(), required=False)


class SearchRequestSerializer(serializers.Serializer):
    query = serializers.CharField()
    limit = serializers.IntegerField(required=False, min_value=1, max_value=200)


class RecommendationRequestSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    limit = serializers.IntegerField(required=False, min_value=1, max_value=50)
    filter_genres = serializers.ListField(child=serializers.CharField(), required=False)


class SimilarRequestSerializer(serializers.Serializer):
    movie_id = serializers.IntegerField()
    limit = serializers.IntegerField(required=False, min_value=1, max_value=50)


class NotificationSerializer(serializers.Serializer):
    notification_id = serializers.IntegerField()
    user_id = serializers.IntegerField()
    message = serializers.CharField()
    status = serializers.CharField()
    created_at = serializers.DateTimeField(required=False)


class NotificationCreateSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    message = serializers.CharField()


class AuthRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class AuthLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class AuthRefreshSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    refresh_token = serializers.CharField()

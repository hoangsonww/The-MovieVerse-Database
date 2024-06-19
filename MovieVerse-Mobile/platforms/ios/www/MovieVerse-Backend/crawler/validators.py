from django.core.exceptions import ValidationError


def validate_movie_data(data):
    if not data.get('name') or not data.get('description'):
        raise ValidationError("Missing required movie fields")

    if not data.get('poster_url'):
        raise ValidationError("Missing required movie poster URL")

    if not data.get('cast'):
        raise ValidationError("Missing required movie cast")

    if not data.get('director'):
        raise ValidationError("Missing required movie director")

    if not data.get('genres'):
        raise ValidationError("Missing required movie genres")

    if not data.get('duration'):
        raise ValidationError("Missing required movie duration")

    if not data.get('rating'):
        raise ValidationError("Missing required movie rating")

    if not data.get('release_date'):
        raise ValidationError("Missing required movie release date")

    if not data.get('trailer_url'):
        raise ValidationError("Missing required movie trailer URL")

    if not data.get('imdb_url'):
        raise ValidationError("Missing required movie IMDb URL")

    if not data.get('rotten_tomatoes_url'):
        raise ValidationError("Missing required movie Rotten Tomatoes URL")

    if not data.get('metacritic_url'):
        raise ValidationError("Missing required movie Metacritic URL")

    if not data.get('reviews'):
        raise ValidationError("Missing required movie reviews")

    if not data.get('similar_movies'):
        raise ValidationError("Missing required similar movies")

    if not data.get('recommendations'):
        raise ValidationError("Missing required movie recommendations")

    if not data.get('awards'):
        raise ValidationError("Missing required movie awards")

    if not data.get('box_office'):
        raise ValidationError("Missing required movie box office")

    if not data.get('budget'):
        raise ValidationError("Missing required movie budget")

    if not data.get('company'):
        raise ValidationError("Missing required movie company")

    if not data.get('country'):
        raise ValidationError("Missing required movie country")

    if not data.get('language'):
        raise ValidationError("Missing required movie language")

    if not data.get('tagline'):
        raise ValidationError("Missing required movie tagline")

    if not data.get('website'):
        raise ValidationError("Missing required movie website")

    if not data.get('writers'):
        raise ValidationError("Missing required movie writers")

    if not data.get('year'):
        raise ValidationError("Missing required movie year")

    if not data.get('id'):
        raise ValidationError("Missing required movie ID")

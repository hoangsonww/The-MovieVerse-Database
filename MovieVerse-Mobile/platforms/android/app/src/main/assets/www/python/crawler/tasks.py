from celery import shared_task
from .scraper import fetch_movie_data
from .parser import parse_movie_data
from moviereviews.models import Movie
from models import MovieDetail


@shared_task
def crawl_movie_data_and_store(url):
    html_content = fetch_movie_data(url)
    if html_content:
        movie_data = parse_movie_data(html_content)
        movie, created = Movie.objects.get_or_create(title=movie_data['name'])
        MovieDetail.objects.update_or_create(
            movie=movie,
            defaults={
                'description': movie_data['description'],
                'poster_url': movie_data['poster_url'],
                'cast': ','.join(movie_data['cast']),
            }
        )
        return movie.title
    return None

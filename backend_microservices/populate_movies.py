from django.core.management.base import BaseCommand
from moviereviews.models import Movie

class Command(BaseCommand):
    help = 'Populates the database with initial movie data'

    def handle(self, *args, **options):
        movies = [
            {'title': 'The Shawshank Redemption', 'description': 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'},
            {'title': 'The Godfather', 'description': 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'},
            # Add more movies as needed
        ]

        for movie in movies:
            Movie.objects.create(**movie)

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with movies.'))

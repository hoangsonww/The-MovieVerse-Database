"""
AI Agent Service for MovieVerse
Provides intelligent, personalized movie recommendations and insights
"""
import random
from datetime import datetime, timedelta
from django.db.models import Q
from .models import Movie, Review, User


class CinematicAssistant:
    """
    AI-powered cinematic assistant that provides personalized recommendations,
    trivia, and engagement features
    """

    def __init__(self, user_id=None):
        self.user_id = user_id
        self.user = None
        if user_id:
            try:
                self.user = User.objects.using('users_db').get(id=user_id)
            except User.DoesNotExist:
                pass

    def get_what_to_watch(self, time_available=None, mood=None, limit=5):
        """
        Suggest movies based on time available, mood, and user history
        
        Args:
            time_available: Time in minutes (e.g., 90, 120, 180)
            mood: User's current mood (e.g., 'action', 'comedy', 'thriller', 'drama')
            limit: Number of recommendations to return
            
        Returns:
            List of movie recommendations with reasoning
        """
        filters = Q()
        
        # Filter by runtime if time_available is specified
        if time_available:
            # Add 10 minute buffer for flexibility
            filters &= Q(runtime__lte=time_available + 10)
            filters &= Q(runtime__gte=time_available - 30)
        
        # Filter by mood/genre
        genre_mapping = {
            'action': ['Action', 'Adventure'],
            'comedy': ['Comedy'],
            'thriller': ['Thriller', 'Mystery', 'Crime'],
            'drama': ['Drama'],
            'scifi': ['Science Fiction', 'Fantasy'],
            'romance': ['Romance'],
            'horror': ['Horror'],
        }
        
        if mood and mood.lower() in genre_mapping:
            genre_names = genre_mapping[mood.lower()]
            filters &= Q(genres__name__in=genre_names)
        
        # Get user's viewing history if available
        viewed_movie_ids = []
        if self.user_id:
            viewed_movie_ids = self._get_user_viewed_movies()
            if viewed_movie_ids:
                filters &= ~Q(movieId__in=viewed_movie_ids)
        
        # Fetch movies with filters
        try:
            movies = Movie.objects.using('movies_db').filter(filters).order_by('-voteAverage')[:limit * 2]
            
            # Get user's preferred genres if available
            user_genres = self._get_user_preferred_genres()
            
            # Score and sort movies
            scored_movies = []
            for movie in movies:
                score = movie.voteAverage or 0
                
                # Boost score if matches user preferences
                if user_genres and movie.genres:
                    movie_genre_names = [g.name for g in movie.genres]
                    if any(genre in movie_genre_names for genre in user_genres):
                        score += 2
                
                reasoning = self._generate_recommendation_reason(movie, time_available, mood)
                scored_movies.append({
                    'movie': movie,
                    'score': score,
                    'reasoning': reasoning
                })
            
            # Sort by score and return top recommendations
            scored_movies.sort(key=lambda x: x['score'], reverse=True)
            
            results = []
            for item in scored_movies[:limit]:
                movie = item['movie']
                results.append({
                    'movieId': movie.movieId,
                    'title': movie.title,
                    'overview': movie.overview,
                    'runtime': movie.runtime,
                    'releaseDate': str(movie.releaseDate) if movie.releaseDate else None,
                    'voteAverage': movie.voteAverage,
                    'posterPath': movie.posterPath,
                    'genres': [g.name for g in movie.genres] if movie.genres else [],
                    'reasoning': item['reasoning']
                })
            
            return results
            
        except Exception as e:
            # Fallback to top rated movies
            return self._get_fallback_recommendations(limit)

    def get_trivia(self, movie_id=None, context='general'):
        """
        Generate contextual trivia and facts about movies
        
        Args:
            movie_id: Specific movie ID for trivia (optional)
            context: Context for trivia ('general', 'historical', 'on_this_day')
            
        Returns:
            Dictionary with trivia information
        """
        if context == 'on_this_day':
            return self._get_on_this_day_trivia()
        
        if movie_id:
            return self._get_movie_trivia(movie_id)
        
        return self._get_general_trivia()

    def get_rewatch_reminders(self, limit=5):
        """
        Suggest movies/series to rewatch or continue
        
        Returns:
            List of rewatch suggestions with context
        """
        if not self.user_id:
            return []
        
        reminders = []
        
        # Get user's highly rated movies (potential rewatches)
        try:
            user_reviews = Review.objects.using('reviews_db').filter(
                userId=self.user_id,
                rating__gte=4
            ).order_by('-createdAt')[:10]
            
            for review in user_reviews:
                try:
                    movie = Movie.objects.using('movies_db').get(movieId=review.movieId)
                    
                    # Check if it's been a while since they watched it
                    days_since = (datetime.now() - review.createdAt).days
                    
                    if days_since > 180:  # 6 months
                        reminders.append({
                            'movieId': movie.movieId,
                            'title': movie.title,
                            'posterPath': movie.posterPath,
                            'reason': f"You loved this {days_since // 30} months ago. Time for a rewatch?",
                            'type': 'rewatch'
                        })
                except Movie.DoesNotExist:
                    continue
                    
        except Exception as e:
            pass
        
        return reminders[:limit]

    def get_weekly_watchlist(self, theme=None):
        """
        Generate a weekly watchlist with a specific theme
        
        Args:
            theme: Optional theme for the watchlist
            
        Returns:
            Dictionary with watchlist and theme information
        """
        themes = [
            {'name': 'Time Travel Adventures', 'genres': ['Science Fiction'], 'keywords': ['time']},
            {'name': 'Classic Noir', 'genres': ['Crime', 'Thriller'], 'keywords': ['detective']},
            {'name': 'Feel-Good Comedies', 'genres': ['Comedy'], 'keywords': ['funny']},
            {'name': 'Epic Adventures', 'genres': ['Adventure', 'Action'], 'keywords': ['adventure']},
            {'name': 'Mind-Bending Thrillers', 'genres': ['Thriller', 'Mystery'], 'keywords': ['mystery']},
        ]
        
        selected_theme = random.choice(themes) if not theme else themes[0]
        
        movies = Movie.objects.using('movies_db').filter(
            genres__name__in=selected_theme['genres'],
            voteAverage__gte=7.0
        ).order_by('-voteAverage')[:7]
        
        watchlist = []
        for movie in movies:
            watchlist.append({
                'movieId': movie.movieId,
                'title': movie.title,
                'overview': movie.overview,
                'posterPath': movie.posterPath,
                'voteAverage': movie.voteAverage,
            })
        
        return {
            'theme': selected_theme['name'],
            'description': f"A curated selection of {selected_theme['name'].lower()} for your week",
            'movies': watchlist,
            'weekOf': datetime.now().strftime('%Y-%m-%d')
        }

    # Helper methods
    
    def _get_user_viewed_movies(self):
        """Get list of movie IDs the user has already viewed"""
        try:
            reviews = Review.objects.using('reviews_db').filter(
                userId=self.user_id
            ).values_list('movieId', flat=True)
            return list(reviews)
        except Exception:
            return []
    
    def _get_user_preferred_genres(self):
        """Analyze user's reviews to determine preferred genres"""
        try:
            # Get user's highly rated movies
            high_rated_reviews = Review.objects.using('reviews_db').filter(
                userId=self.user_id,
                rating__gte=4
            ).values_list('movieId', flat=True)[:20]
            
            # Get genres from these movies
            movies = Movie.objects.using('movies_db').filter(movieId__in=high_rated_reviews)
            
            genre_counts = {}
            for movie in movies:
                if movie.genres:
                    for genre in movie.genres:
                        genre_counts[genre.name] = genre_counts.get(genre.name, 0) + 1
            
            # Return top 3 genres
            sorted_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)
            return [genre for genre, count in sorted_genres[:3]]
        except Exception:
            return []
    
    def _generate_recommendation_reason(self, movie, time_available, mood):
        """Generate a reason for recommending this movie"""
        reasons = []
        
        if movie.voteAverage and movie.voteAverage >= 8.0:
            reasons.append(f"Highly rated ({movie.voteAverage}/10)")
        
        if time_available and movie.runtime:
            if movie.runtime <= time_available:
                reasons.append(f"Perfect for your {time_available}-minute window")
        
        if mood:
            reasons.append(f"Matches your {mood} mood")
        
        if movie.genres:
            genre_names = [g.name for g in movie.genres]
            if genre_names:
                reasons.append(f"Great {genre_names[0].lower()} film")
        
        if not reasons:
            reasons.append("Popular choice")
        
        return " • ".join(reasons)
    
    def _get_fallback_recommendations(self, limit):
        """Fallback recommendations when filters don't work"""
        try:
            movies = Movie.objects.using('movies_db').filter(
                voteAverage__gte=7.5
            ).order_by('-voteAverage')[:limit]
            
            results = []
            for movie in movies:
                results.append({
                    'movieId': movie.movieId,
                    'title': movie.title,
                    'overview': movie.overview,
                    'runtime': movie.runtime,
                    'releaseDate': str(movie.releaseDate) if movie.releaseDate else None,
                    'voteAverage': movie.voteAverage,
                    'posterPath': movie.posterPath,
                    'genres': [g.name for g in movie.genres] if movie.genres else [],
                    'reasoning': "Highly rated movie you might enjoy"
                })
            
            return results
        except Exception:
            return []
    
    def _get_on_this_day_trivia(self):
        """Get trivia about movies released on this day in history"""
        today = datetime.now()
        month_day = today.strftime('%m-%d')
        
        try:
            # Find movies released on this day (any year)
            movies = Movie.objects.using('movies_db').filter(
                releaseDate__isnull=False
            ).order_by('-voteAverage')[:100]
            
            matching_movies = []
            for movie in movies:
                if movie.releaseDate and movie.releaseDate.strftime('%m-%d') == month_day:
                    matching_movies.append(movie)
            
            if matching_movies:
                movie = matching_movies[0]
                years_ago = today.year - movie.releaseDate.year
                
                return {
                    'type': 'on_this_day',
                    'message': f"On this day {years_ago} years ago, '{movie.title}' was released!",
                    'movieId': movie.movieId,
                    'title': movie.title,
                    'releaseDate': str(movie.releaseDate),
                    'overview': movie.overview,
                    'posterPath': movie.posterPath
                }
        except Exception:
            pass
        
        return {
            'type': 'general',
            'message': "Did you know? The average movie takes about 871 days to make from script to screen!"
        }
    
    def _get_movie_trivia(self, movie_id):
        """Get trivia for a specific movie"""
        try:
            movie = Movie.objects.using('movies_db').get(movieId=movie_id)
            
            trivia_facts = []
            
            # Runtime fact
            if movie.runtime:
                hours = movie.runtime // 60
                minutes = movie.runtime % 60
                trivia_facts.append(f"Runtime: {hours}h {minutes}min")
            
            # Rating fact
            if movie.voteAverage and movie.voteCount:
                trivia_facts.append(f"Rated {movie.voteAverage}/10 by {movie.voteCount:,} viewers")
            
            # Release info
            if movie.releaseDate:
                year = movie.releaseDate.year
                trivia_facts.append(f"Released in {year}")
            
            # Genre info
            if movie.genres:
                genre_names = [g.name for g in movie.genres]
                trivia_facts.append(f"Genres: {', '.join(genre_names)}")
            
            return {
                'type': 'movie_specific',
                'movieId': movie.movieId,
                'title': movie.title,
                'facts': trivia_facts
            }
        except Movie.DoesNotExist:
            return {'type': 'error', 'message': 'Movie not found'}
    
    def _get_general_trivia(self):
        """Get general cinema trivia"""
        trivia_list = [
            "The first movie ever made was 'Roundhay Garden Scene' in 1888, lasting just 2.11 seconds!",
            "The average Hollywood film takes about 871 days to make from script to screen.",
            "The longest movie ever made is 'Ambiancé' at 720 hours (30 days)!",
            "Movie theater popcorn costs more per ounce than filet mignon.",
            "The famous MGM lion roar is actually a combination of multiple different lions' roars.",
            "Christopher Nolan's 'Inception' used minimal CGI - most effects were practical!",
            "The sound of E.T. walking was made by someone squishing Jello with their hands.",
            "Movie trailers were originally shown after the movie - hence the name 'trailer'.",
        ]
        
        return {
            'type': 'general',
            'message': random.choice(trivia_list)
        }

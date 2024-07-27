from .scraper import fetch_movie_data
from .parser import parse_movie_data
from .ai.text_analysis import analyze_text_sentiment
from .ai.image_analysis import classify_image
from .tasks import crawl_movie_data_and_store
from .models import MovieDetail
from django.core.exceptions import ObjectDoesNotExist


def orchestrate_crawling(url):
    try:
        # Step 1: Fetch data
        html_content = fetch_movie_data(url)
        if not html_content:
            raise ValueError("Failed to fetch data from URL.")

        # Step 2: Parse data
        movie_data = parse_movie_data(html_content)
        if not movie_data:
            raise ValueError("Failed to parse movie data.")

        # Step 3: Analyze text sentiment
        sentiment_result = analyze_text_sentiment(movie_data['description'])
        movie_data['sentiment'] = sentiment_result

        # Step 4: Image analysis
        image_analysis_result = classify_image(movie_data['poster_url'])
        movie_data['image_analysis'] = image_analysis_result

        # Step 5: Store data in the database
        crawl_movie_data_and_store(movie_data)

        print("Crawling and data processing completed successfully.")

    except Exception as e:
        print(f"Error during the crawling process: {e}")

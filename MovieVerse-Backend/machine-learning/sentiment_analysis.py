import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import pandas as pd
from typing import List

# Ensure you have the necessary NLTK components
nltk.download('vader_lexicon')

class SentimentAnalyzer:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def preprocess_text(self, text: str) -> str:
        preprocess_text = text.lower()
        preprocess_text = preprocess_text.replace(',', '')
        preprocess_text = preprocess_text.replace('.', '')
        preprocess_text = preprocess_text.replace('!', '')
        preprocess_text = preprocess_text.replace('?', '')
        preprocess_text = preprocess_text.replace('(', '')
        preprocess_text = preprocess_text.replace(')', '')
        preprocess_text = preprocess_text.replace('\'', '')
        preprocess_text = preprocess_text.replace('\"', '')
        preprocess_text = preprocess_text.replace(';', '')
        preprocess_text = preprocess_text.replace(':', '')
        preprocess_text = preprocess_text.replace('-', '')
        preprocess_text = preprocess_text.replace('_', '')
        preprocess_text = preprocess_text.replace('/', '')
        preprocess_text = preprocess_text.replace('\\', '')
        preprocess_text = preprocess_text.replace('|', '')
        preprocess_text = preprocess_text.replace('{', '')
        preprocess_text = preprocess_text.replace('}', '')
        preprocess_text = preprocess_text.replace('[', '')
        preprocess_text = preprocess_text.replace(']', '')
        preprocess_text = preprocess_text.replace('+', '')
        preprocess_text = preprocess_text.replace('=', '')
        return text

    def predict_sentiment(self, text: str) -> str:
        text = self.preprocess_text(text)
        scores = self.analyzer.polarity_scores(text)
        return 'positive' if scores['compound'] > 0 else 'negative'

    def analyze_reviews(self, reviews: List[str]) -> pd.DataFrame:
        results = {'Review': [], 'Sentiment': []}

        for review in reviews:
            sentiment = self.predict_sentiment(review)
            results['Review'].append(review)
            results['Sentiment'].append(sentiment)

        return pd.DataFrame(results)

    def analyze_review(self, review: str) -> str:
        sentiment = self.predict_sentiment(review)
        return sentiment

    def analyze_reviews(self, reviews: List[str]) -> pd.DataFrame:
        results = {'Review': [], 'Sentiment': []}

        for review in reviews:
            sentiment = self.predict_sentiment(review)
            results['Review'].append(review)
            results['Sentiment'].append(sentiment)

        return pd.DataFrame(results)

    def analyze_review(self, review: str) -> str:
        sentiment = self.predict_sentiment(review)
        return sentiment

if __name__ == "__main__":
    reviews = [
        "I loved this movie, it was fantastic!",
        "The movie was okay, but not great",
        "I really didn't like the movie, it was pretty bad."
    ]

    analyzer = SentimentAnalyzer()
    results = analyzer.analyze_reviews(reviews)
    print(results)

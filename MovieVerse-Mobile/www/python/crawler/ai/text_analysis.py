from transformers import pipeline

# Load a sentiment analysis pipeline
sentiment_pipeline = pipeline("sentiment-analysis")


def analyze_text_sentiment(text):
    try:
        result = sentiment_pipeline(text)
        return result
    except Exception as e:
        raise e

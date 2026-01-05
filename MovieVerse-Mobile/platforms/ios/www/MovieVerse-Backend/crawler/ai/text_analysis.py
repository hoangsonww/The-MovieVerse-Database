from crawler.ai.client import analyze_sentiment


def analyze_text_sentiment(text):
    result = analyze_sentiment(text)
    if result is None:
        return {"label": "unknown", "score": 0.0}
    return result

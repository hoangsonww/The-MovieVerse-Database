import requests


def adjust_crawling_strategy(sentiment_trend, crawling_params):
    """
    Adjust crawling parameters based on sentiment trend analysis.

    :param sentiment_trend: DataFrame with sentiment trend analysis.
    :param crawling_params: Dictionary of current crawling parameters.
    :return: Adjusted crawling parameters.
    """
    recent_trend = sentiment_trend['rolling_avg_sentiment'].iloc[-1]
    if recent_trend > 0.5:
        crawling_params['frequency'] *= 1.1  # Increase frequency
    else:
        crawling_params['frequency'] *= 0.9  # Decrease frequency
    return crawling_params


def fetch_movie_data(url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.text
    else:
        return None

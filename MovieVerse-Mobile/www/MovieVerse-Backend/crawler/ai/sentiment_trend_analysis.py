import pandas as pd
from datetime import datetime


def analyze_sentiment_trend(sentiment_data):
    """
    Analyze sentiment trends over time from collected data.

    :param sentiment_data: List of dictionaries containing 'date' and 'sentiment' keys.
    :return: DataFrame with sentiment trend analysis.
    """
    df = pd.DataFrame(sentiment_data)
    df['date'] = pd.to_datetime(df['date'])
    df.sort_values('date', inplace=True)
    df['rolling_avg_sentiment'] = df['sentiment'].rolling(window=7).mean()
    return df

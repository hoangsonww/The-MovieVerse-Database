import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from scipy.sparse.linalg import svds

# Load movie data
movies_df = pd.read_csv('movies.csv', usecols=['movieId', 'title'], dtype={'movieId': 'int32', 'title': 'str'})
ratings_df = pd.read_csv('ratings.csv', usecols=['userId', 'movieId', 'rating'],
                         dtype={'userId': 'int32', 'movieId': 'int32', 'rating': 'float32'})

# Preprocessing
# Create a user-movie matrix
user_movie_df = ratings_df.pivot(index='userId', columns='movieId', values='rating').fillna(0)

# Normalize the data by subtracting the mean user rating
mean_user_rating = user_movie_df.mean(axis=1)
ratings_demeaned = user_movie_df.sub(mean_user_rating, axis=0)

# Singular Value Decomposition
U, sigma, Vt = svds(ratings_demeaned, k=50)
sigma = np.diag(sigma)

# Making Predictions
all_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) + mean_user_rating.values.reshape(-1, 1)
preds_df = pd.DataFrame(all_user_predicted_ratings, columns=user_movie_df.columns)


# Recommend Movies
def recommend_movies(predictions_df, userID, movies_df, original_ratings_df, num_recommendations=5):
    user_row_number = userID - 1
    sorted_user_predictions = predictions_df.iloc[user_row_number].sort_values(ascending=False)

    user_data = original_ratings_df[original_ratings_df.userId == userID]
    user_full = (user_data.merge(movies_df, how='left', left_on='movieId', right_on='movieId').
                 sort_values(['rating'], ascending=False)
                 )

    recommendations = (movies_df[~movies_df['movieId'].isin(user_full['movieId'])].
                       merge(pd.DataFrame(sorted_user_predictions).reset_index(), how='left',
                             left_on='movieId',
                             right_on='movieId').
                       rename(columns={user_row_number: 'Predictions'}).
                       sort_values('Predictions', ascending=False).
                       iloc[:num_recommendations, :-1]
                       )

    return user_full, recommendations


# Test the recommendation system for a user
user_id = 1
rated_movies, recommendations = recommend_movies(preds_df, user_id, movies_df, ratings_df, 10)

print("User has already rated these movies:")
print(rated_movies.head(10))
print("\nTop 10 movie recommendations:")
print(recommendations)

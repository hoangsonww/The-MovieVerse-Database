library(readr)
library(dplyr)
library(ggplot2)
library(tidyr)
library(textdata)
library(tidytext)
library(syuzhet)

# Load the dataset (not published here)
reviews <- read_csv("reviews.csv")

# Perform sentiment analysis
reviews_sentiment <- reviews %>%
  unnest_tokens(word, review_text) %>%
  inner_join(get_sentiments("bing")) %>%
  count(movie_id, sentiment) %>%
  spread(sentiment, n, fill = 0) %>%
  mutate(sentiment_score = positive - negative)

# Merge sentiment scores with original movie ratings
movie_sentiments <- reviews %>%
  select(movie_id, rating) %>%
  distinct() %>%
  left_join(reviews_sentiment, by = "movie_id")

# Visualize sentiment scores vs. movie ratings
ggplot(movie_sentiments, aes(x = rating, y = sentiment_score)) +
  geom_point(aes(color = sentiment_score)) +
  scale_color_gradient2(low = "red", mid = "white", high = "blue", midpoint = 0) +
  labs(title = "Sentiment Scores vs. Movie Ratings",
       x = "Movie Rating", y = "Sentiment Score") +
  theme_minimal()

# Export sentiment analysis results
write_csv(movie_sentiments, "movie_sentiments.csv")

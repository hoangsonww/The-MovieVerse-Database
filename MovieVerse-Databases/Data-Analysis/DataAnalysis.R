library(dplyr)
library(ggplot2)
library(readr)
library(tidyr)
library(recommenderlab)

# Load the dataset (not published here)
movies <- read_csv("movies.csv")

# 1. Genre Popularity Over Time
genre_trends <- movies %>%
  separate_rows(genre, sep = ",") %>%
  group_by(genre, release_year) %>%
  summarise(count = n(), .groups = "drop") %>%
  arrange(genre, release_year)

# Plotting genre trends
ggplot(genre_trends, aes(x = release_year, y = count, color = genre)) +
  geom_line() +
  labs(title = "Genre Popularity Over Time",
       x = "Release Year", y = "Number of Movies") +
  theme_minimal()

# 2. Director Impact on Movie Ratings
director_impact <- movies %>%
  group_by(director_name) %>%
  summarise(avg_rating = mean(rating, na.rm = TRUE), .groups = "drop") %>%
  arrange(desc(avg_rating))

# Top 10 directors by average movie rating
top_directors <- head(director_impact, 10)
print(top_directors)

# 3. User Engagement Analysis
user_engagement <- movies %>%
  group_by(user_id) %>%
  summarise(ratings_count = n(), avg_rating = mean(rating, na.rm = TRUE), .groups = "drop") %>%
  arrange(desc(ratings_count))

# Plotting user engagement
ggplot(user_engagement, aes(x = ratings_count, y = avg_rating)) +
  geom_point(aes(color = avg_rating)) +
  scale_color_gradient(low = "blue", high = "red") +
  labs(title = "User Engagement Analysis",
       x = "Number of Ratings", y = "Average Rating") +
  theme_minimal()

# 4. Basic Recommendation System based on genres and ratings
# Create a binary matrix for movie genres
genre_matrix <- movies %>%
  separate_rows(genre, sep = ",") %>%
  mutate(value = 1) %>%
  pivot_wider(names_from = genre, values_from = value, values_fill = list(value = 0))

# Create a user-item rating matrix
rating_matrix <- as(genre_matrix[, -c(1:3)], "realRatingMatrix")

# Building a recommendation model
rec_model <- Recommender(rating_matrix, method = "UBCF")
rec <- predict(rec_model, rating_matrix, n = 5)

# Show recommendations for the first user
recommendations <- as(rec, "list")
print(recommendations[[1]])

writeLines(capture.output(recommendations[[1]]), "movie_app_analysis.R")

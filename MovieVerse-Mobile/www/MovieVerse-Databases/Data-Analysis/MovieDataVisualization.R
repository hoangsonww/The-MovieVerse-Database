library(ggplot2)
library(readr)
library(dplyr)
library(scales)

# Load the dataset (not published here)
movie_data <- read_csv("movie_data.csv")

# 1. Budget vs. Revenue Visualization
ggplot(movie_data, aes(x = budget, y = revenue)) +
  geom_point(aes(color = rating)) +
  scale_color_gradient(low = "blue", high = "red") +
  geom_smooth(method = "lm", se = FALSE, color = "black") +
  labs(title = "Budget vs. Revenue by Movie Rating",
       x = "Budget (in 100 millions)", y = "Revenue (in billions)",
       color = "Rating") +
  scale_x_continuous(labels = scales::dollar_format(scale = 1e-7)) +
  scale_y_continuous(labels = scales::dollar_format(scale = 1e-9)) +
  theme_minimal()

# 2. Rating Distribution Visualization
ggplot(movie_data, aes(x = rating)) +
  geom_histogram(binwidth = 0.5, fill = "steelblue", color = "black") +
  labs(title = "Distribution of Movie Ratings",
       x = "Rating", y = "Count") +
  theme_minimal()

# 3. Number of Movies Released Over Time
movies_over_time <- movie_data %>%
  group_by(release_year) %>%
  summarise(number_of_movies = n(), .groups = "drop")

ggplot(movies_over_time, aes(x = release_year, y = number_of_movies)) +
  geom_line(color = "darkgreen") +
  geom_point(color = "darkred") +
  labs(title = "Number of Movies Released Over Time",
       x = "Release Year", y = "Number of Movies") +
  theme_minimal()

# Save plots to files
ggsave("budget_vs_revenue.png")
ggsave("rating_distribution.png")
ggsave("movies_over_time.png")

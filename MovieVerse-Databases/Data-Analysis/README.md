# Data Analysis for MovieVerse

Welcome to the Data Analysis directory of the MovieVerse project. This directory contains R scripts designed to explore, analyze, and visualize data related to movies and user interactions. These scripts offer insights into movie genres, ratings, budget and revenue correlations, and much more.

## Contents

This directory includes the following R scripts:

1. **MovieAppAnalysis.R**: Analyzes movie genre popularity over time, the impact of directors on movie ratings, user engagement with movies, and provides a basic recommendation system based on movie genres and ratings.

2. **MovieReviewsSentimentAnalysis.R**: Performs sentiment analysis on movie reviews to determine the overall sentiment (positive or negative) towards movies and correlates these sentiments with movie ratings.

3. **MovieDataVisualization.R**: Visualizes various aspects of movie data, including budget vs. revenue, rating distributions, and the number of movies released over time.

4. **MovieBudgetAndSuccessAnalysis.do**: A Stata do-file that analyzes the relationship between movie budget and success, using a dataset of movies and their budget and revenue figures.

5. **UserRatingAnalysisByGenre.do**: A Stata do-file that analyzes user ratings for movies by genre, using a dataset of user ratings and movie genres.

## Prerequisites

Before running these scripts, you will need to have R and RStudio installed on your computer. Additionally, certain R packages are required, including `dplyr`, `ggplot2`, `readr`, `tidyr`, `textdata`, `tidytext`, `syuzhet`, and `recommenderlab`. These can be installed using the following R command:

```r
install.packages(c("dplyr", "ggplot2", "readr", "tidyr", "textdata", "tidytext", "syuzhet", "recommenderlab"))
```

## Getting Started

To begin analyzing the MovieVerse data, follow these steps:

1. Ensure all required R packages are installed.
2. Place your movie-related datasets in the same directory as the R scripts. Adjust the dataset file names within the scripts if necessary.
3. Open the desired R script in RStudio and run it to perform the analysis or generate visualizations.

## Data Requirements

These scripts assume the presence of certain datasets:

- **movies.csv**: For `MovieAppAnalysis.R` and `MovieDataVisualization.R` scripts, containing columns for `movie_id`, `title`, `genre`, `director_name`, `actor_names`, `release_year`, `rating`, `budget`, and `revenue`.

- **reviews.csv**: For `MovieReviewsSentimentAnalysis.R`, containing columns for `movie_id`, `review_text`, and `rating`.

Please adjust the script according to the structure of your actual data.

**NOTE**: These datasets are not provided in this repository, as they may contain sensitive or proprietary information. You will need to source your own datasets for analysis.

## Contributing

Contributions to improve these scripts or extend the analyses are welcome. Please feel free to fork the project, make your changes, and submit a pull request with a clear explanation of your modifications or additions.

## License

This project is open-sourced under the MIT License. See the LICENSE file for more details.

---

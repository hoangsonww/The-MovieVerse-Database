* UserRatingAnalysisByGenre.do
clear
set more off

* Load the dataset
import delimited "movie_genre_ratings.csv", clear

* Ensure the rating is numeric
destring rating, replace

* Generate average rating by genre
egen avg_rating = mean(rating), by(genre)

* Sort data by average rating in descending order
gsort -avg_rating

* Create a bar chart of average ratings by genre
graph bar (mean) rating, over(genre) asyvars blabel(bar, format(%9.2f)) ///
    title("Average User Ratings by Movie Genre") ///
    ylabel(#10, format(%9.1f)) xlabel(none) bar(1, fcolor(skyblue)) ///
    bargap(10)

* Save the graph
graph save "average_ratings_by_genre.gph", replace

* Display results in the log
list genre avg_rating in 1/10, sepby(genre)


* MovieBudgetAndSuccessAnalysis.do
clear
set more off

* Load the dataset
import delimited "movie_budget_revenue_ratings.csv", clear

* Ensure budget, revenue, and rating are numeric
destring budget revenue rating, replace

* Generate log versions for budget and revenue for a better scale representation
gen log_budget = log(budget)
gen log_revenue = log(revenue)

* Scatter plot to visualize the relationship between budget and rating
scatter rating log_budget, title("Relationship between Movie Budget and Rating") ///
    xlabel(none) ylabel(, format(%9.1f)) xtitle("Log of Budget") ///
    ytitle("Rating")

* Scatter plot to visualize the relationship between budget and revenue
scatter log_revenue log_budget, title("Relationship between Movie Budget and Revenue") ///
    xlabel(none) ylabel(none) xtitle("Log of Budget") ytitle("Log of Revenue") ///
    mlabeled(mtitle)

* Perform a regression analysis to quantify the relationship between budget and rating
regress rating log_budget

* Perform a regression analysis to quantify the relationship between budget and revenue
regress log_revenue log_budget

* Save the regression results
outreg2 using "budget_rating_relationship.doc", replace
outreg2 using "budget_revenue_relationship.doc", append


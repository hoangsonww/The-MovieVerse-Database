# README for `Machine-Learning` Directory

Welcome to the `Machine-Learning` directory of the MovieVerse App! This directory is dedicated to the machine learning models and algorithms that enhance the functionality of the MovieVerse application. Below, you'll find detailed information about each Python script in this directory.

---

## Table of Contents

1. [Overview](#overview)
2. [Genre Classifier (`genre-classifier.py`)](#genre-classifier.py)
3. [Movie Recommendation (`movie-recommendation.py`)](#movie-recommendation.py)
4. [Movie Reviews Analysis (`movie-reviews.py`)](#movie-reviews.py)
5. [Plot Summarizer (`plot-summarizer.py`)](#plot-summarizer.py)
6. [Sentiment Analysis (`sentiment_analysis.py`)](#sentiment_analysis.py)

## Overview

The `Machine-Learning` directory contains Python scripts that leverage machine learning techniques to provide various functionalities, such as genre classification, movie recommendations, sentiment analysis, and more. These scripts are integral to providing a personalized and interactive experience to the users of the MovieVerse app.

### Genre Classifier (`genre-classifier.py`)

This script uses machine learning models to classify movies into genres based on their descriptions, titles, and other metadata. It helps in categorizing movies accurately within the app database.

To run the genre classifier, execute the following command:

```bash
python genre-classifier.py
```

### Movie Recommendation (`movie-recommendation.py`)

This script is responsible for generating movie recommendations for users based on their viewing history, preferences, and ratings. It uses collaborative filtering and content-based methods to provide personalized recommendations.

To run, execute the following command:

```bash
python movie-recommendation.py
```

### Movie Reviews Analysis (`movie-reviews.py`)

This script processes and analyzes movie reviews, extracting insights and useful information. It might use natural language processing (NLP) techniques to understand user sentiments, key themes, and overall opinions about movies.

To get started, you can run the following command:

```bash
python movie-reviews.py
```

Then, follow the instructions provided by the script to analyze movie reviews and extract valuable information.

### Plot Summarizer (`plot-summarizer.py`)

`plot-summarizer.py` utilizes NLP and text summarization algorithms to create concise summaries of movie plots. This assists users in quickly grasping the essence of a movie without spoilers.

To get started, you can run the following command:

```bash
python plot-summarizer.py
```

Then, follow the instructions by Streamlit to view the plot summarizer web application. For example, you may receive the following instructions:

```
Warning: to view this Streamlit app on a browser, run it with the following command:

streamlit run /Users/davidnguyen/WebstormProjects/The-MovieVerse-Database/MovieVerse-Backend/machine-learning/plot-summarizer.py [ARGUMENTS]
```

In this case, simply copy and run the provided `streamlit run` command in your terminal to view the plot summarizer web application.

### Sentiment Analysis (`sentiment_analysis.py`)

This script performs sentiment analysis on user reviews and comments. It determines the overall sentiment (positive, negative, neutral) expressed in the text, helping in gauging audience reception of movies.

To run, simply execute the following command:

```bash
python sentiment_analysis.py
```

## Using these Scripts

To run these scripts:

1. Ensure you have Python installed on your system.
2. Install necessary libraries using pip: `pip install -r requirements.txt` (assuming a `requirements.txt` file is present).
3. Execute each script as needed, following the instructions above.

## Customization and Adaptation

These scripts can be modified or extended to suit specific needs or to integrate with new datasets. They can also be adapted to improve performance, accuracy, or to include additional machine learning models.

## Dependencies

- Python 3.x
- Libraries: numpy, pandas, scikit-learn, nltk, tensorflow, keras, etc. (as required by each script)

---
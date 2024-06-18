import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report


class GenreClassifier:
    def __init__(self):
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(stop_words='english')),
            ('classifier', MultinomialNB())
        ])

    def train(self, data: pd.DataFrame, target: str):
        X_train, X_test, y_train, y_test = train_test_split(
            data['description'], data[target], test_size=0.2, random_state=42)

        self.pipeline.fit(X_train, y_train)
        predictions = self.pipeline.predict(X_test)
        print(classification_report(y_test, predictions))

    def predict_genre(self, description: str) -> str:
        return self.pipeline.predict([description])[0]

    def predict_genres(self, descriptions: List[str]) -> List[str]:
        return self.pipeline.predict(descriptions)


# Example usage
if __name__ == "__main__":
    # Example data
    data = pd.DataFrame({
        'description': [
            "A group of intergalactic criminals are forced to work together.",
            "A series of stories about the lives of Victorian women.",
            "Two imprisoned men bond over a number of years."
        ],
        'genre': ['Sci-Fi', 'Drama', 'Drama']
    })

    classifier = GenreClassifier()
    classifier.train(data, 'genre')

    # Predicting genre of a new movie description
    new_description = "An epic tale of war and honor."
    predicted_genre = classifier.predict_genre(new_description)
    print(f"The predicted genre is: {predicted_genre}")

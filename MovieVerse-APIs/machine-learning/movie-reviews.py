import pandas as pd
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

# Load dataset
reviews_df = pd.read_csv('movie_reviews.csv', encoding='utf-8')
reviews_df = reviews_df[['review', 'sentiment']]  # Assuming 'review' and 'sentiment' columns

# Text preprocessing
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", '', text)
    text = ' '.join([word for word in text.split() if word not in stop_words])
    return text

reviews_df['review'] = reviews_df['review'].apply(clean_text)

# Tokenization
tokenizer = Tokenizer()
tokenizer.fit_on_texts(reviews_df['review'])
sequences = tokenizer.texts_to_sequences(reviews_df['review'])

# Padding sequences
max_len = max([len(x) for x in sequences])
X = pad_sequences(sequences, maxlen=max_len)
y = pd.get_dummies(reviews_df['sentiment']).values

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model creation
model = Sequential()
model.add(Embedding(len(tokenizer.word_index) + 1, 100, input_length=max_len))
model.add(LSTM(128, dropout=0.2, recurrent_dropout=0.2))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(y.shape[1], activation='softmax'))

model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# Model training
early_stopping = EarlyStopping(monitor='val_loss', patience=3)
model.fit(X_train, y_train, batch_size=128, epochs=10, validation_split=0.1, callbacks=[early_stopping])

# Evaluate the model
loss, accuracy = model.evaluate(X_test, y_test)
print(f'Test Accuracy: {accuracy:.2f}')

# Predictions
def predict_sentiment(review):
    cleaned_review = clean_text(review)
    sequence = tokenizer.texts_to_sequences([cleaned_review])
    padded_sequence = pad_sequences(sequence, maxlen=max_len)
    prediction = model.predict(padded_sequence)
    sentiment = 'Positive' if np.argmax(prediction) == 1 else 'Negative'
    return sentiment

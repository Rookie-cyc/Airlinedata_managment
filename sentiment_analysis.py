import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

# Load the model and vectorizer
with open("model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("vectorizer.pkl", "rb") as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

# Function to predict sentiment of the input text
def predict_sentiment(text):
    # Transform the text using the same vectorizer used during training
    X = vectorizer.transform([text])
    prediction = model.predict(X)
    sentiment = "Positive" if prediction[0] == 1 else "Negative"
    return sentiment

# Sample input (you can modify this part for different inputs)
sample_text = input("Enter text for sentiment analysis: ")
result = predict_sentiment(sample_text)
print(f"Sentiment: {result}")
import pickle

# Load trained model
with open("model.pkl", "rb") as f:  # Update filename here
    model = pickle.load(f)

# Sample input text for sentiment analysis
sample_texts = [
    "This game is amazing! I love the gameplay and story.",
    "I hate the controls, they are so frustrating.",
    "It's an okay game, not the best but not the worst either."
]

# Make predictions
predictions = model.predict(sample_texts)

# Convert numerical predictions to labels
predicted_labels = ["Positive" if pred == 1 else "Negative" for pred in predictions]

# Display predictions
for i, text in enumerate(sample_texts):
    print(f"Review: {text} -> Sentiment: {predicted_labels[i]}")

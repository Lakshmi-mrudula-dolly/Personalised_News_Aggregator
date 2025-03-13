from flask import Flask, request, jsonify
from pymongo import MongoClient
import joblib
import os
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
import logging
from collections import Counter

# Download necessary NLTK data
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')


CATEGORY_MAPPING = {
    "tech": "technology",
    "sport": "sports"
}

# Initialize Flask app
app = Flask(__name__)

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["newsApp"]
users_collection = db["users"]

# Load ML Model and Preprocessors
model = joblib.load("models/news_classifier.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")
label_encoder = joblib.load("models/label_encoder.pkl")

# Text Preprocessing Function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\W', ' ', text)
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    return ' '.join(tokens)

# Fetch clicked news titles from the user's document
def get_clicked_news(email):
    user_data = users_collection.find_one({"email": email})
    return user_data.get("clicked_titles", []) if user_data else []

# Predict categories of the provided news headlines
def predict_category(headlines):
    processed_headlines = [preprocess_text(title) for title in headlines]
    X_new = vectorizer.transform(processed_headlines)
    predicted_indices = model.predict(X_new)
    predicted_categories = label_encoder.inverse_transform(predicted_indices)

    # Convert short categories to full names
    predicted_categories = [CATEGORY_MAPPING.get(cat, cat) for cat in predicted_categories]

    logging.info(f"Predicted categories: {predicted_categories}")
    return predicted_categories

# Update preferred categories, update category counts, and clear clicked news
#  Update preferred categories and store category counts
def update_user_preferences(email):
    logging.info(f"Running recommender system for user: {email}")

    # Fetch user data
    user_data = users_collection.find_one({"email": email})
    if not user_data:
        logging.warning(f"User not found: {email}")
        return {"error": "User not found"}

    clicked_news = user_data.get("clicked_titles", [])
    
    # Initialize category_counts if not present
    existing_category_counts = user_data.get("category_counts", {})

    if not clicked_news:
        logging.warning(f"No clicked news found for user: {email}")
        return {"error": "No clicked news found"}

    # Predict categories for clicked news
    predicted_categories = predict_category(clicked_news)

    # Count new category occurrences
    new_category_counts = Counter(predicted_categories)

    # Merge existing category counts with new ones
    for category, count in new_category_counts.items():
        existing_category_counts[category] = existing_category_counts.get(category, 0) + count

    # Select the top 3 most frequent categories based on updated counts
    sorted_categories = [cat for cat, count in Counter(existing_category_counts).most_common(3)]

    # Update MongoDB: update preferred categories and category counts, then clear clicked_titles
    users_collection.update_one(
        {"email": email},
        {
            "$set": {
                "preferred_categories": sorted_categories,
                "category_counts": existing_category_counts,
                "clicked_titles": []  # Clear clicked news
            }
        }
    )

    logging.info(f"Updated preferred categories for {email}: {sorted_categories}")
    return {
        "message": f"Updated preferred categories: {sorted_categories}",
        "category_counts": existing_category_counts
    }


# API Endpoint: Run Recommender (Update Preferences)
@app.route('/run_recommender', methods=['POST'])
def run_recommender():
    data = request.json
    email = data.get("email")
    
    if not email:
        logging.error("Missing email in request")
        return jsonify({"error": "Email is required"}), 400

    response = update_user_preferences(email)
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(port=5001, debug=True)

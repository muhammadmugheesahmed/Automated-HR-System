import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the CSV file
data = pd.read_csv('questions.csv', delimiter=",", names=["Questions", "Answer"])
data = data.dropna(subset=['Questions'])

# Prepare the vectorizer and matrix globally
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(data['Questions'])

def get_answer(user_question):
    """Returns the best matching answer based on TF-IDF similarity."""
    user_tfidf = vectorizer.transform([user_question])
    cosine_similarities = cosine_similarity(user_tfidf, tfidf_matrix)
    most_similar_idx = cosine_similarities.argmax()
    similarity_score = cosine_similarities[0, most_similar_idx]

    if similarity_score > 0.2:
        return data['Answer'].iloc[most_similar_idx]
    else:
        return "I'm sorry, I don't have an answer for that."

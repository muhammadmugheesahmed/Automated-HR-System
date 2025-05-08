import sys
import os
import re
import json
import nltk
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer
from pymongo import MongoClient
import joblib
from docx import Document
from sklearn.metrics.pairwise import cosine_similarity

# Download NLTK resources silently
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)

stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# MongoDB setup
client = MongoClient('mongodb+srv://mugheesahmad39:12345678MU@cluster0.3d2ak.mongodb.net/mern-app-db?retryWrites=true&w=majority&appName=Cluster0')
db = client['mern-app-db']
collection = db['candidates']

def preprocess_text(text):
    if isinstance(text, str):
        text = re.sub(r'[^a-z\s]', '', text)  # Remove special characters, keep letters and spaces
        text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
        text = re.sub(r'http\S+\s*', ' ', text)  # Remove URLs
        text = re.sub(r'RT|cc', ' ', text)  # Remove RT and cc
        text = re.sub(r'#\S+', '', text)  # Remove hashtags
        text = re.sub(r'@\S+', '  ', text)  # Remove mentions
        punctuation_pattern = r"""[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]"""
        text = re.sub(punctuation_pattern, ' ', text)  # Remove punctuation
        text = re.sub(r'[^\x00-\x7f]', r' ', text)  # Remove non-ASCII characters
        text = re.sub(r'\s+', ' ', text)  # Remove extra whitespace
        return text
    return ""

def clean_tokens(text):
    text = preprocess_text(text)
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    tokens = [stemmer.stem(word) for word in tokens]
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    return ' '.join(tokens)

def get_email_by_filename(filename):
    candidate = collection.find_one({"resume": filename})
    return candidate.get("email") if candidate else "Not found"

def get_name_by_filename(filename):
    candidate = collection.find_one({"resume": filename})
    return candidate.get("name") if candidate else "Not found"

def read_docx(file_path):
    try:
        doc = Document(file_path)
        return '\n'.join([para.text for para in doc.paragraphs])
    except Exception as e:
        print(f"Error reading DOCX {file_path}: {e}")
        return ""

def main():
    try:
        if len(sys.argv) < 3:
            raise ValueError("Usage: python3 score_resumes.py <job_description> <top_n>")

        job_desc = sys.argv[1]
        try:
            top_n = int(sys.argv[2])
        except ValueError:
            raise ValueError("Second argument (top_n) must be an integer.")
        
        resumesDir = "/home/aetisam/Desktop/fyp/Automated-HR-System/mern-app/backend/uploads/resumes"
        base_dir = "/home/aetisam/Desktop/fyp/Automated-HR-System/mern-app/backend"

        # Load and process resumes
        files = sorted([f for f in os.listdir(resumesDir) if f.lower().endswith(('.pdf', '.docx'))])
        raw_docs = []

        for fn in files:
            path = os.path.join(resumesDir, fn)
            if fn.lower().endswith('.docx'):
                text = read_docx(path)
            else:
                text = ""
            raw_docs.append(text)

        # Preprocess job description and resumes
        processed_docs = [clean_tokens(doc) for doc in raw_docs]
        documents = [clean_tokens(job_desc)] + processed_docs

        # Load the pre-trained vectorizer
        vectorizer = joblib.load(os.path.join(base_dir, 'ml', 'JD_Vectorizer.pkl'))
        tfidf_matrix = vectorizer.transform(documents)

        job_vector = tfidf_matrix[0]
        resume_vectors = tfidf_matrix[1:]

        # Calculate cosine similarity
        cosine_scores = cosine_similarity(job_vector, resume_vectors).flatten()

        # Calculate weighted scores based on importance of words
        word_importance = vectorizer.transform([job_desc]).toarray().flatten()
        weighted_scores = resume_vectors.dot(word_importance).flatten()

        # Normalize scores for better ATS ranking
        if weighted_scores.max() > 0:
            ats_scores = (weighted_scores / np.max(weighted_scores)) * 100
        else:
            ats_scores = np.zeros_like(weighted_scores)

        ranked_indices = np.argsort(ats_scores)[::-1]
        output = []

        for i in ranked_indices[:top_n]:
            fn = files[i]
            score = float(ats_scores[i])
            output.append({
                "filename": fn,
                "candidate_name": get_name_by_filename(fn),
                "email": get_email_by_filename(fn),
                "score": round(score, 2)
            })

        # ✅ ONLY JSON OUTPUT
        print(json.dumps(output, indent=2))

    except Exception as e:
        # Ensuring the error is in proper JSON format
        print(json.dumps({"error": f"An error occurred: {str(e)}"}))


if __name__ == '__main__':
    main()

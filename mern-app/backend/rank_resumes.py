# ml/rank_resumes.py
import sys
import os
import joblib
import numpy as np
import re
import json
import nltk
import pdfplumber
import docx
import logging
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer
import textract
import xgboost as xgb
from pymongo import MongoClient

# Setup logging
logging.basicConfig(filename='rank_resumes.log', level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

# NLTK setup
stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# MongoDB setup
client = MongoClient('mongodb+srv://mugheesahmad39:12345678MU@cluster0.3d2ak.mongodb.net/mern-app-db?retryWrites=true&w=majority&appName=Cluster0')
db = client['mern-app-db']
collection = db['candidates']

# Helper Functions
def preprocess(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    tokens = [stemmer.stem(lemmatizer.lemmatize(word)) for word in tokens]
    return ' '.join(tokens)

def extract_text_from_pdf(filepath):
    try:
        with pdfplumber.open(filepath) as pdf:
            return "\n".join([page.extract_text() or "" for page in pdf.pages])
    except Exception as e:
        logging.warning(f"Failed to extract PDF {filepath}: {e}")
        return ""

def extract_text_from_docx(filepath):
    try:
        doc = docx.Document(filepath)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        logging.warning(f"Failed to extract DOCX {filepath}: {e}")
        return ""

def extract_text_from_doc(filepath):
    try:
        return textract.process(filepath).decode('utf-8')
    except Exception as e:
        logging.warning(f"Failed to extract DOC {filepath}: {e}")
        return ""

def extract_name_from_filename(fn):
    base = os.path.splitext(fn)[0]
    name = re.sub(r'[_\-]+', ' ', base)
    return name.title()

def get_email_by_filename(filename):
    candidate = collection.find_one({"resume": filename})
    return candidate.get("email") if candidate else "Not found"

# Main Script
def main():
    if len(sys.argv) < 3:
        print(json.dumps([]))
        return

    category = sys.argv[1]
    top_n = int(sys.argv[2])
    resumes_dir = sys.argv[3] if len(sys.argv) >= 4 else os.path.join(os.path.dirname(__file__), 'uploads', 'resumes')

    base_dir = os.path.dirname(__file__)
    model = xgb.Booster()
    model.load_model(os.path.join(base_dir, 'ml', 'resume_ranker.xgb'))

    vectorizer = joblib.load(os.path.join(base_dir, 'ml', 'xgboost_Model_Vectorizer.pkl'))
    label_encoder = joblib.load(os.path.join(base_dir, 'ml', 'xgboost_LabelEncoder.pkl'))

    try:
        label_index = label_encoder.transform([category])[0]
    except ValueError:
        logging.error(f"Invalid category: {category}")
        print(json.dumps([]))
        return

    filenames = []
    texts = []

    for fname in os.listdir(resumes_dir):
        path = os.path.join(resumes_dir, fname)
        raw = ""
        if fname.lower().endswith('.pdf'):
            raw = extract_text_from_pdf(path)
        elif fname.lower().endswith('.docx'):
            raw = extract_text_from_docx(path)
        elif fname.lower().endswith('.doc'):
            raw = extract_text_from_doc(path)
        else:
            continue

        if raw.strip():
            filenames.append(fname)
            texts.append(preprocess(raw))
        else:
            logging.info(f"Skipped {fname}: no text extracted.")

    if not texts:
        print(json.dumps([]))
        return

    features = vectorizer.transform(texts)
    dmatrix = xgb.DMatrix(features)
    preds = model.predict(dmatrix)

    if preds.ndim > 1:
        raw_scores = preds[:, label_index]
    else:
        raw_scores = preds

    scores = [float(s) for s in raw_scores]

    ranked = sorted(zip(filenames, scores), key=lambda x: x[1], reverse=True)

    result = []
    for f, s in ranked[:top_n]:
        name = extract_name_from_filename(f)
        email = get_email_by_filename(f)
        score = round(s * 100, 2)
        result.append({
            "filename": f,
            "candidate_name": name,
            "email": email,
            "score": score
        })

    print(json.dumps(result))

if __name__ == '__main__':
    main()

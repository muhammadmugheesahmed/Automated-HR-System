# ml/rank_resumes.py
import sys
import os
import joblib
import numpy as np
import pandas as pd
import re
import json
import nltk
import pdfplumber
import docx
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer
import textract
import xgboost as xgb


# Download required NLTK resources
#nltk.download('punkt')
#nltk.download('stopwords')
#nltk.download('wordnet')

# Initialize tools
stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Preprocess text
def preprocess(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    tokens = [stemmer.stem(lemmatizer.lemmatize(word)) for word in tokens]
    return ' '.join(tokens)

# Extract text from PDF
def extract_text_from_pdf(filepath):
    try:
        with pdfplumber.open(filepath) as pdf:
            return "\n".join([page.extract_text() or "" for page in pdf.pages])
    except:
        return ""

# Extract text from DOCX
def extract_text_from_docx(filepath):
    try:
        doc = docx.Document(filepath)
        return "\n".join([para.text for para in doc.paragraphs])
    except:
        return ""

def extract_text_from_doc(filepath):
    try:
        return textract.process(filepath).decode('utf-8')
    except:
        return ""
    
def main():
    category = sys.argv[1]
    top_n = int(sys.argv[2])
    resumes_dir = "/home/aetisam/Desktop/fyp/Automated-HR-System/mern-app/backend/uploads/resumes"

    # Load models
    #model = xgb.Booster()
    #model.load_model('/home/aetisam/Desktop/fyp/Automated-HR-System/mern-app/backend/ml/xgboost_model.json')
    model=joblib.load('/home/aetisam/Desktop/fyp/Automated-HR-System/mern-app/backend/ml/xgboost_Model.pkl')
    vectorizer = joblib.load('/home/aetisam/Desktop/fyp/Automated-HR-System/mern-app/backend/ml/xgboost_Model_Vectorizer.pkl')
    le = joblib.load('/home/aetisam/Desktop/fyp/Automated-HR-System/mern-app/backend/ml/xgboost_LabelEncoder.pkl')

    # Get encoded category label
    try:
        label_index = le.transform([category])[0]
    except ValueError:
        print("[]")
        return

    resume_texts = []
    filenames = []

    for file in os.listdir(resumes_dir):
        filepath = os.path.join(resumes_dir, file)
        if file.endswith(".pdf"):
            text = extract_text_from_pdf(filepath)
        elif file.endswith(".docx"):
            text = extract_text_from_docx(filepath)
        elif file.endswith(".doc"):
            text = extract_text_from_doc(filepath)
        else:
            continue  # Skip unsupported formats

        if text:
            processed = preprocess(text)
            resume_texts.append(processed)
            filenames.append(file)

    if not resume_texts:
        print("[]")
        return

    # Vectorize & score
    features = vectorizer.transform(resume_texts)
    scores = model.predict_proba(features)[:, label_index]
    #scores = model.predict(features)
    #scores = scores[:, label_index] 

    # Rank by score
    ranked = sorted(zip(filenames, scores), key=lambda x: x[1], reverse=True)
    result = [{"filename": name, "score": round(score * 100, 2)} for name, score in ranked[:top_n]]

    print(json.dumps(result, default=str))

if __name__ == "__main__":
    main()

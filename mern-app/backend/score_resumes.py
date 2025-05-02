# score_resumes.py

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

# Ensure these are downloaded once
#nltk.download('stopwords', quiet=True)
#nltk.download('punkt', quiet=True)
#nltk.download('wordnet', quiet=True)

stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# MongoDB setup
client = MongoClient('mongodb+srv://mugheesahmad39:12345678MU@cluster0.3d2ak.mongodb.net/mern-app-db?retryWrites=true&w=majority&appName=Cluster0')  # Replace with your MongoDB URI
db = client['mern-app-db']  # Replace with your database name
collection = db['candidates']  # Replace with your collection name


def clean_tokens(text):
    text = re.sub(r'[^a-z\s]', '', text.lower())
    tokens = word_tokenize(text)
    return [
        lemmatizer.lemmatize(stemmer.stem(tok))
        for tok in tokens
        if tok not in stop_words
    ]

def extract_name_from_filename(fn):
    base = os.path.splitext(fn)[0]
    name = re.sub(r'[_\-]+', ' ', base)
    return name.title()

# Function to get the candidate's email from MongoDB based on filename
def get_email_by_filename(filename):
    candidate = collection.find_one({"resume": filename})
    return candidate.get("email") if candidate else "Not found"
def main():
    # Read args (or fall back)
    job_desc   = sys.argv[1] 
    top_n      = int(sys.argv[2]) 
    resumesDir ="/home/aetisam/Desktop/fyp/Automated-HR-System/mern-app/backend/uploads/resumes"

    # 1) Gather all .pdf/.docx resumes
    files = sorted([
        f for f in os.listdir(resumesDir)
        if f.lower().endswith(('.pdf', '.docx','.doc'))
    ])
    docs = []
    for fn in files:
        path = os.path.join(resumesDir, fn)
        with open(path, 'r', encoding='utf-8', errors='ignore') as fh:
            docs.append(' '.join(clean_tokens(fh.read())))

    # 2) Vectorize + weight by job
    all_docs   = [' '.join(clean_tokens(job_desc))] + docs
    vec        = TfidfVectorizer(stop_words='english').fit_transform(all_docs)
    job_vec    = vec[0].toarray().flatten()
    resume_mat = vec[1:]
    scores     = resume_mat.dot(job_vec)
    if scores.max() > 0:
        scores = (scores / scores.max()) * 100

    # 3) Pick top N, include filename + name + score
    idxs = np.argsort(scores)[::-1][:top_n]
    out  = []
    for i in idxs:
        fn    = files[i]
        name  = extract_name_from_filename(fn)
        email=get_email_by_filename(fn)
        score = float(scores[i])
        out.append({
            'filename':        fn,
            'candidate_name':  name,
            'email' : email,
            'score':   score
        })

    print(json.dumps(out))
    
if __name__ == '__main__':
    main()

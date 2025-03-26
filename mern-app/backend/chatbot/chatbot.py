import pandas as pd

# Load the CSV file
df = pd.read_csv('questions.csv')

def get_answer(query):
    """Searches for the best matching question and returns an answer."""
    for _, row in df.iterrows():
        if query.lower() in row['Questions'].lower():
            return row['Answers']
    return "I'm sorry, I don't have an answer for that."

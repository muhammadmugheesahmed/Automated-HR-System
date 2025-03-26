from flask import Flask, request, jsonify
from chatbot import get_answer  # Import the chatbot function

app = Flask(__name__)

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_query = data.get("query", "")
    response = get_answer(user_query)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)

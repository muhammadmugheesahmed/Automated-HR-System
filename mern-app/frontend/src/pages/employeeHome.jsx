import React, { useState } from "react";
import axios from "axios";

function EmployeeHome() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [chatEnded, setChatEnded] = useState(false);

  const handleSendMessage = async () => {
    if (query.toLowerCase() === "exit") {
      setResponse("Chatbot: Goodbye! 👋");
      setChatEnded(true);
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5001/api/chatbot", {query });
      setResponse("Chatbot: " + res.data.response);
    } catch (error) {
      setResponse("Error reaching chatbot. Please try again.");
      console.error(error);
    }

    setQuery(""); // Clear input
  };
  
  const handleRestart = () => {
    setResponse("");
    setChatEnded(false);
    setQuery("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome, Employee!</h2>
      <p>You have successfully logged in.</p>

      <div className="mt-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hello! Ask chatbot a question or exit to stop ..."
          className="border p-2 w-full rounded"
          disabled={chatEnded}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
          disabled={chatEnded}
        >
          Send
        </button>
        {chatEnded && (
          <button
            onClick={handleRestart}
            className="bg-gray-500 text-white p-2 rounded mt-2 w-full"
          >
            Restart Chat
          </button>
        )}
      </div>

      {response && (
        <p className="mt-4 border p-2 rounded bg-gray-100">{response}</p>
      )}
    </div>
  );
}

export default EmployeeHome;

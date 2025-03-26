import React, { useState } from "react";
import axios from "axios";

const EmployeeHome = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSendMessage = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5001/api/chatbot", { query });
      setResponse(res.data.response);
    } catch (error) {
      setResponse("Error connecting to chatbot.");
    }
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
          placeholder="Ask the chatbot..."
          className="border p-2 w-full rounded"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded mt-2 w-full">
          Send
        </button>
      </div>

      {response && <p className="mt-4 border p-2 rounded bg-gray-100">{response}</p>}
    </div>
  );
};

export default EmployeeHome;

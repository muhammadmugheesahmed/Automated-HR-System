import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./employeehome.css";

function EmployeeHome() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatEnded, setChatEnded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    if (query.toLowerCase() === "exit") {
      setMessages((prev) => [
        ...prev,
        { text: "Chatbot: Goodbye! 👋", sender: "chatbot" },
      ]);
      setChatEnded(true);
      setQuery("");
      return;
    }

    setMessages((prev) => [
      ...prev,
      { text: `You: ${query}`, sender: "user" },
    ]);

    try {
      const res = await axios.post("http://127.0.0.1:5001/api/chatbot", { query });
      setMessages((prev) => [
        ...prev,
        { text: `Chatbot: ${res.data.response}`, sender: "chatbot" },
      ]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { text: "Chatbot: Error reaching chatbot.", sender: "chatbot" },
      ]);
    }

    setQuery("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setChatEnded(false);
    setQuery("");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/employee");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="page-wrapper">
      <div className="chat-header">
        <h2>Employee Chatbot</h2>

        <div className="menu-wrapper" ref={menuRef}>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
          {menuOpen && (
            <div className="menu-dropdown">
              <button onClick={handleRestart}>🆕 New Chat</button>
              <button onClick={handleLogout}>🚪 Logout</button>
            </div>
          )}
        </div>

        <p>Type "exit" to end the chat.</p>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === "user" ? "user" : "chatbot"}`}
            >
              <p>{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-wrapper">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
          disabled={chatEnded}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="send-button"
          disabled={chatEnded}
        >
          ➤
        </button>

        {chatEnded && (
          <button onClick={handleRestart} className="restart-button">
            ↻ Restart Chat
          </button>
        )}
      </div>

      <footer className="chat-footer">
        <p>&copy; 2025 Automated HR. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default EmployeeHome;
import { useState } from "react";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! 👋 I'm your AI Study Assistant. What would you like to learn today?",
    },
  ]);

  const sendMessage = () => {
    if (message.trim() === "") {
      return;
    }

    setMessages([
      ...messages,
      {
        sender: "user",
        text: message,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="chat-page">

      <div className="chat-header">
        <h1>🤖 AI Study Assistant</h1>
        <p>
          Ask questions and get help with your studies.
        </p>
      </div>

      <div className="chat-container">

        <div className="messages">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender}`}
            >
              <strong>
                {msg.sender === "ai" ? "🤖 AI" : "You"}
              </strong>

              <p>{msg.text}</p>
            </div>
          ))}

        </div>

        <div className="chat-input">

          <input
            type="text"
            placeholder="Ask your study question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default Chat;
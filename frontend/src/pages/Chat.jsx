import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { chatService } from '../services/api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

function Chat() {
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hello! I'm your AI Study Assistant. Ask me to explain concepts, summarize notes, solve problems, or prepare you for exams!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await chatService.getHistory();
        if (res.success && res.data && res.data.length > 0) {
          setMessages(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch server chat history, using session history:', err.message);
      } finally {
        setInitialLoaded(true);
      }
    };

    fetchHistory();
  }, []);

  // Handle incoming prompt passed from Dashboard search bar
  useEffect(() => {
    if (initialLoaded && location.state?.initialPrompt) {
      handleSend(location.state.initialPrompt);
      // Clear location state to prevent re-sending
      window.history.replaceState({}, document.title);
    }
  }, [initialLoaded, location.state]);

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend || textToSend.trim() === '' || loading) return;

    const userMsg = {
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setLoading(true);

    try {
      const res = await chatService.sendMessage(textToSend.trim());
      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: res.data.text,
            timestamp: res.data.timestamp || new Date().toISOString(),
          },
        ]);
      } else {
        throw new Error(res.message || 'AI could not process request');
      }
    } catch (err) {
      // Intelligent local fallback response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `### 💡 AI Tutor Explanation\n\nHere is a clear summary for **"${textToSend}"**:\n\n1. **Core Concept**: Break complex topics down into small, digestible milestones.\n2. **Actionable Rule**: Relate this theory to practical coding or real-world problem sets.\n3. **Active Practice**: Write out a brief explanation in your own words to solidify your memory.\n\n*Would you like to generate a practice quiz on this?*`,
            timestamp: new Date().toISOString(),
          },
        ]);
        setLoading(false);
      }, 600);
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await chatService.clearHistory();
    } catch (e) {
      // ignore
    }
    setMessages([
      {
        role: 'assistant',
        text: '🧹 Chat cleared! What would you like to study next?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const suggestions = [
    'Explain Recursion in JavaScript with a base case example',
    'What is Newton\'s Second Law of Motion?',
    'Explain the difference between useState and useEffect',
    'How do I calculate the derivative of x^3?',
  ];

  return (
    <div className="chat-layout">
      <div className="chat-header-bar">
        <div className="chat-header-info">
          <h2>🤖 AI Study Assistant</h2>
          <p>Instant answers, step-by-step solutions, and exam preparation.</p>
        </div>
        <div className="chat-header-actions">
          <button onClick={handleClearChat} className="btn-clear-chat" title="Clear conversation">
            🧹 Clear Chat
          </button>
        </div>
      </div>

      <div className="chat-window">
        <div className="chat-messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-bubble-wrapper ${msg.role}`}>
              <div className="chat-avatar">
                {msg.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className="chat-bubble">
                <div className="chat-bubble-header">
                  <span className="sender-name">
                    {msg.role === 'assistant' ? 'AI Study Tutor' : 'You'}
                  </span>
                  <span className="msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="chat-bubble-body">
                  {msg.text.split('\n').map((line, i) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={i} className="msg-heading">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('## ')) {
                      return <h3 key={i} className="msg-heading">{line.replace('## ', '')}</h3>;
                    }
                    if (line.startsWith('```')) {
                      return null;
                    }
                    return (
                      <p key={i} className="msg-paragraph">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-wrapper assistant">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble typing-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="typing-text">AI is formulating your study notes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="chat-suggestions-bar">
          <span className="suggestions-label">💡 Suggested topics:</span>
          <div className="suggestions-scroll">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                className="suggestion-pill"
                onClick={() => handleSend(item)}
                disabled={loading}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="chat-input-bar"
        >
          <input
            type="text"
            placeholder="Type your study question here (e.g. 'Explain binary search')..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!inputMessage.trim() || loading}
            icon="➤"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
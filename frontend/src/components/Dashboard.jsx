function Dashboard() {
  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome back! 👋</h1>
        <p>Ready to continue your learning journey?</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>📚 Subjects</h3>
          <p>5</p>
          <span>Subjects studied</span>
        </div>

        <div className="stat-card">
          <h3>📝 Quizzes</h3>
          <p>12</p>
          <span>Quizzes completed</span>
        </div>

        <div className="stat-card">
          <h3>📊 Progress</h3>
          <p>75%</p>
          <span>Overall progress</span>
        </div>
      </div>

      <div className="ai-card">
        <h2>🤖 AI Study Assistant</h2>
        <p>Ask me anything about your studies.</p>

        <div className="question-box">
          <input
            type="text"
            placeholder="What would you like to learn today?"
          />

          <button>Ask AI</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
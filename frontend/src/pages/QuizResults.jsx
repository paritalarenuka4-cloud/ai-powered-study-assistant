import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result || {
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    quizTitle: 'React & Modern JavaScript Quiz',
    subject: 'Computer Science',
    answersReview: [
      {
        question: 'What is React primarily categorized as?',
        selectedAnswer: 'B',
        correctAnswer: 'B',
        isCorrect: true,
        explanation: 'React is an open-source JavaScript library focused exclusively on rendering dynamic user interfaces.',
      },
      {
        question: 'Which hook is used for component-level local state management?',
        selectedAnswer: 'C',
        correctAnswer: 'C',
        isCorrect: true,
        explanation: '`useState` declares a state variable and its updater function.',
      },
      {
        question: 'What happens if a recursive function lacks a base case?',
        selectedAnswer: 'B',
        correctAnswer: 'B',
        isCorrect: true,
        explanation: 'Without a base case, recursive calls stack endlessly until call stack memory is depleted.',
      },
      {
        question: 'Which of the following is true about React Props?',
        selectedAnswer: 'B',
        correctAnswer: 'B',
        isCorrect: true,
        explanation: 'Props follow strict unidirectional top-down data flow and must remain pure and read-only.',
      },
      {
        question: 'What does the `useEffect` hook with an empty dependency array `[]` do?',
        selectedAnswer: 'A',
        correctAnswer: 'B',
        isCorrect: false,
        explanation: 'An empty array tells React to run the effect only on initial mount.',
      },
    ],
  };

  const getFeedback = (pct) => {
    if (pct >= 90) return { title: '🏆 Outstanding Mastery!', color: '#10b981', note: 'You demonstrated comprehensive understanding of this topic.' };
    if (pct >= 70) return { title: '🎉 Great Job!', color: '#4f46e5', note: 'Strong performance! Review the questions you missed to reach 100%.' };
    if (pct >= 50) return { title: '👍 Good Effort!', color: '#f59e0b', note: 'You have solid foundations. Re-read the study notes and try again.' };
    return { title: '📚 Needs More Review', color: '#ef4444', note: 'Do not worry! Open the AI tutor for a quick breakdown and retry.' };
  };

  const feedback = getFeedback(result.percentage);

  return (
    <div className="quiz-results-container">
      {/* Results Header Card */}
      <div className="results-hero-card">
        <span className="results-badge">🎉 Quiz Complete</span>
        <h1 className="results-headline">{feedback.title}</h1>
        <p className="results-subtitle">{feedback.note}</p>

        <div className="score-display-box">
          <div className="score-circle">
            <span className="score-percentage">{result.percentage}%</span>
            <span className="score-fraction">
              {result.score} / {result.totalQuestions} Correct
            </span>
          </div>

          <div className="results-meta-details">
            <div className="res-stat">
              <span className="res-stat-label">Quiz Topic</span>
              <span className="res-stat-val">{result.quizTitle || 'Practice Quiz'}</span>
            </div>
            <div className="res-stat">
              <span className="res-stat-label">Subject</span>
              <span className="res-stat-val">{result.subject || 'General Study'}</span>
            </div>
            <div className="res-stat">
              <span className="res-stat-label">Accuracy</span>
              <span className="res-stat-val">{result.percentage}%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="results-actions-row">
          <Button
            variant="outline"
            onClick={() => navigate('/quiz')}
          >
            🔄 Take Another Quiz
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/progress')}
          >
            📊 View Full Progress
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
          >
            🏠 Return to Dashboard
          </Button>
        </div>
      </div>

      {/* Detailed Question Review Section */}
      <div className="question-review-section">
        <h2 className="review-section-heading">Detailed Question Review</h2>
        <p className="review-section-sub">
          Review your answers and explanations to reinforce your learning.
        </p>

        <div className="review-cards-list">
          {result.answersReview &&
            result.answersReview.map((item, idx) => (
              <div
                key={idx}
                className={`review-card ${item.isCorrect ? 'correct-border' : 'incorrect-border'}`}
              >
                <div className="review-card-top">
                  <span className="review-q-num">Question {idx + 1}</span>
                  <span className={`review-status-pill ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                    {item.isCorrect ? '✓ Correct (+1)' : '✕ Incorrect (0)'}
                  </span>
                </div>

                <h3 className="review-q-text">{item.question}</h3>

                <div className="review-answers-box">
                  <div className={`answer-row ${item.isCorrect ? 'ans-correct' : 'ans-wrong'}`}>
                    <span className="ans-label">Your Answer:</span>
                    <span className="ans-val">Option {item.selectedAnswer}</span>
                  </div>

                  {!item.isCorrect && (
                    <div className="answer-row ans-correct">
                      <span className="ans-label">Correct Answer:</span>
                      <span className="ans-val">Option {item.correctAnswer}</span>
                    </div>
                  )}
                </div>

                {item.explanation && (
                  <div className="review-explanation-box">
                    <strong>💡 Explanation:</strong> {item.explanation}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default QuizResults;

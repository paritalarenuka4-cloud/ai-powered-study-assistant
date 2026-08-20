import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { quizService } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

const DEFAULT_QUIZZES = [
  {
    _id: 'quiz-1',
    subject: 'Computer Science',
    title: 'React & Modern JavaScript Quiz',
    description: 'Test your understanding of React component state, hooks, and ES6+ features.',
    difficulty: 'Medium',
    timeLimitMinutes: 10,
    questions: [
      {
        question: 'What is React primarily categorized as?',
        options: {
          A: 'A relational database engine',
          B: 'A JavaScript library for building user interfaces',
          C: 'A full Linux operating system',
          D: 'A CSS preprocessor',
        },
        correctAnswer: 'B',
        explanation: 'React is an open-source JavaScript library focused exclusively on rendering dynamic user interfaces.',
      },
      {
        question: 'Which hook is used for component-level local state management?',
        options: {
          A: 'useEffect',
          B: 'useRef',
          C: 'useState',
          D: 'useCallback',
        },
        correctAnswer: 'C',
        explanation: '`useState` declares a state variable and its updater function.',
      },
      {
        question: 'What happens if a recursive function lacks a base case?',
        options: {
          A: 'The code runs faster',
          B: 'It causes a Stack Overflow / Maximum Call Stack Exceeded error',
          C: 'The browser fixes it automatically',
          D: 'Nothing happens',
        },
        correctAnswer: 'B',
        explanation: 'Without a base case, recursive calls stack endlessly until call stack memory is depleted.',
      },
      {
        question: 'Which of the following is true about React Props?',
        options: {
          A: 'They can be mutated directly by the child component',
          B: 'They are read-only inputs passed from parent components',
          C: 'They only accept numeric values',
          D: 'They cannot be passed to functional components',
        },
        correctAnswer: 'B',
        explanation: 'Props follow strict unidirectional top-down data flow and must remain pure and read-only.',
      },
      {
        question: 'What does the `useEffect` hook with an empty dependency array `[]` do?',
        options: {
          A: 'Runs on every single re-render',
          B: 'Runs only once when the component mounts',
          C: 'Throws a compiler error',
          D: 'Unmounts the component immediately',
        },
        correctAnswer: 'B',
        explanation: 'An empty array tells React to run the effect only on initial mount.',
      },
    ],
  },
  {
    _id: 'quiz-2',
    subject: 'Mathematics',
    title: 'Calculus Differentiation Quiz',
    description: 'Test your understanding of derivative formulas, rates of change, and limits.',
    difficulty: 'Medium',
    timeLimitMinutes: 8,
    questions: [
      {
        question: 'What is the derivative of f(x) = x^3 with respect to x?',
        options: {
          A: '3x^2',
          B: 'x^2',
          C: '3x',
          D: 'x^4 / 4',
        },
        correctAnswer: 'A',
        explanation: 'By the power rule: d/dx(x^n) = n * x^(n-1), so d/dx(x^3) = 3x^2.',
      },
      {
        question: 'What is the derivative of any constant number c?',
        options: {
          A: '1',
          B: 'c',
          C: '0',
          D: 'Infinity',
        },
        correctAnswer: 'C',
        explanation: 'Constants do not change, so their rate of change (derivative) is 0.',
      },
      {
        question: 'What is the derivative of sin(x)?',
        options: {
          A: '-cos(x)',
          B: 'cos(x)',
          C: 'tan(x)',
          D: '-sin(x)',
        },
        correctAnswer: 'B',
        explanation: 'The standard derivative of sin(x) is cos(x).',
      },
    ],
  },
];

function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();

  const [quizzes, setQuizzes] = useState(DEFAULT_QUIZZES);
  const [selectedSubject, setSelectedSubject] = useState(location.state?.subject || 'All');
  const [loading, setLoading] = useState(true);

  // Active Quiz Playing State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIdx]: 'A' | 'B' | 'C' | 'D' }
  const [submitting, setSubmitting] = useState(false);

  // AI Quiz Generation Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSubject, setAiSubject] = useState('Computer Science');
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiCount, setAiCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  const subjects = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Artificial Intelligence'];

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const query = selectedSubject !== 'All' ? `?subject=${encodeURIComponent(selectedSubject)}` : '';
        const res = await quizService.getAll(query);
        if (res.success && res.data && res.data.length > 0) {
          setQuizzes(res.data);
        } else {
          setQuizzes(DEFAULT_QUIZZES);
        }
      } catch (err) {
        console.warn('Using local fallback quizzes:', err.message);
        setQuizzes(DEFAULT_QUIZZES);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [selectedSubject]);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleSelectOption = (optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionKey,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const res = await quizService.submit(activeQuiz._id, answers);
      if (res.success && res.data) {
        navigate('/quiz/results', { state: { result: res.data, quiz: activeQuiz } });
        return;
      }
    } catch (err) {
      console.warn('API submission failed, calculating score locally:', err.message);
    }

    // Local score calculation fallback
    let score = 0;
    const review = activeQuiz.questions.map((q, idx) => {
      const selected = answers[idx] || null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score += 1;
      return {
        question: q.question,
        selectedAnswer: selected || 'Not answered',
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || '',
      };
    });

    const total = activeQuiz.questions.length;
    const percentage = Math.round((score / total) * 100);

    const localResult = {
      score,
      totalQuestions: total,
      percentage,
      answersReview: review,
      quizTitle: activeQuiz.title,
      subject: activeQuiz.subject,
    };

    navigate('/quiz/results', { state: { result: localResult, quiz: activeQuiz } });
    setSubmitting(false);
  };

  const handleGenerateAiQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await quizService.generateAiQuiz({
        subject: aiSubject,
        topic: aiTopic,
        difficulty: aiDifficulty,
        count: aiCount,
      });

      if (res.success && res.data) {
        setQuizzes((prev) => [res.data, ...prev]);
        setIsAiModalOpen(false);
        setAiTopic('');
        handleStartQuiz(res.data);
      }
    } catch (err) {
      // Local AI Quiz generator fallback
      const generatedQuiz = {
        _id: `ai-quiz-${Date.now()}`,
        subject: aiSubject,
        title: `${aiTopic || aiSubject} - AI Custom Quiz`,
        description: `Custom ${aiDifficulty} practice test on ${aiTopic || aiSubject}.`,
        difficulty: aiDifficulty,
        questions: [
          {
            question: `What is the core significance of ${aiTopic || aiSubject}?`,
            options: {
              A: 'Provides structured solutions and algorithmic foundations',
              B: 'Randomly generates system failures',
              C: 'Has no utility in engineering or science',
              D: 'Slows down runtime without benefit',
            },
            correctAnswer: 'A',
            explanation: `${aiTopic || aiSubject} establishes core logical principles for problem-solving.`,
          },
          {
            question: `Which methodology is best when applying ${aiTopic || aiSubject}?`,
            options: {
              A: 'Hardcoding arbitrary variables',
              B: 'Systematic validation, testing, and error handling',
              C: 'Ignoring edge cases',
              D: 'Skipping documentation',
            },
            correctAnswer: 'B',
            explanation: 'Systematic validation and test coverage guarantee robust solutions.',
          },
          {
            question: `What is the best way to retain ${aiTopic || aiSubject}?`,
            options: {
              A: 'Active recall and solving practice questions',
              B: 'Only reading passively once',
              C: 'Memorizing without comprehension',
              D: 'Never reviewing',
            },
            correctAnswer: 'A',
            explanation: 'Active recall is scientifically proven to maximize long-term retention.',
          },
        ],
      };

      setQuizzes((prev) => [generatedQuiz, ...prev]);
      setIsAiModalOpen(false);
      setAiTopic('');
      handleStartQuiz(generatedQuiz);
    } finally {
      setGenerating(false);
    }
  };

  // Render Active Quiz Player Screen
  if (activeQuiz) {
    const currentQ = activeQuiz.questions[currentQuestionIndex];
    const totalQ = activeQuiz.questions.length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQ) * 100);
    const selectedOption = answers[currentQuestionIndex];

    return (
      <div className="active-quiz-container">
        {/* Quiz Top Navigation Bar */}
        <div className="quiz-top-bar">
          <div>
            <span className="quiz-subject-badge">{activeQuiz.subject}</span>
            <h2 className="quiz-active-title">{activeQuiz.title}</h2>
          </div>
          <button
            className="btn-quit-quiz"
            onClick={() => setActiveQuiz(null)}
          >
            ✕ Exit Quiz
          </button>
        </div>

        {/* Question Counter & Progress Bar */}
        <div className="quiz-progress-section">
          <div className="quiz-progress-labels">
            <span>
              Question <strong>{currentQuestionIndex + 1}</strong> of {totalQ}
            </span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="quiz-progress-track">
            <div
              className="quiz-progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <h3 className="question-text">{currentQ.question}</h3>

          <div className="options-grid">
            {Object.entries(currentQ.options).map(([key, text]) => (
              <button
                key={key}
                className={`option-button ${selectedOption === key ? 'selected' : ''}`}
                onClick={() => handleSelectOption(key)}
              >
                <span className="option-badge">{key}</span>
                <span className="option-text">{text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="quiz-controls-row">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </Button>

          {currentQuestionIndex < totalQ - 1 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!selectedOption}
            >
              Next Question →
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmitQuiz}
              loading={submitting}
              disabled={!selectedOption}
              icon="🎯"
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Render Quiz Catalog / Selection Screen
  return (
    <div className="quiz-catalog-page">
      <div className="quiz-header-row">
        <div>
          <h1 className="page-title">📝 Practice Quizzes</h1>
          <p className="page-subtitle">
            Test your knowledge with subject quizzes or create custom AI-generated tests.
          </p>
        </div>
        <Button
          variant="primary"
          icon="✨"
          onClick={() => setIsAiModalOpen(true)}
        >
          Generate AI Quiz
        </Button>
      </div>

      {/* Subject Filter Bar */}
      <div className="filter-pills-row">
        <span className="filter-label">Filter by:</span>
        <div className="pills-scroll">
          {subjects.map((s) => (
            <button
              key={s}
              className={`filter-pill ${selectedSubject === s ? 'active' : ''}`}
              onClick={() => setSelectedSubject(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes List */}
      {loading ? (
        <LoadingSpinner message="Loading quizzes..." />
      ) : quizzes.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No quizzes available for this subject"
          description="Generate a custom quiz using the AI Quiz Generator."
          action={
            <Button variant="primary" onClick={() => setIsAiModalOpen(true)}>
              ✨ Generate AI Quiz
            </Button>
          }
        />
      ) : (
        <div className="quizzes-grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-card-header">
                <span className="quiz-subject-tag">{quiz.subject}</span>
                <span className={`quiz-difficulty-tag ${quiz.difficulty?.toLowerCase()}`}>
                  {quiz.difficulty}
                </span>
              </div>
              <h3 className="quiz-card-title">{quiz.title}</h3>
              <p className="quiz-card-desc">{quiz.description}</p>
              <div className="quiz-card-meta">
                <span>❓ {quiz.questions?.length || 5} Questions</span>
                <span>⏱️ {quiz.timeLimitMinutes || 10} Mins</span>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => handleStartQuiz(quiz)}
              >
                Start Quiz Now →
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* AI Quiz Generator Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="✨ Generate AI-Powered Quiz"
      >
        <form onSubmit={handleGenerateAiQuiz} className="ai-modal-form">
          <div className="form-group">
            <label>Subject</label>
            <select
              value={aiSubject}
              onChange={(e) => setAiSubject(e.target.value)}
            >
              {subjects.filter((s) => s !== 'All').map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Specific Topic (Optional)</label>
            <input
              type="text"
              placeholder="e.g. React Hooks, Derivatives, Newton's Laws"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Questions Count</label>
              <select
                value={aiCount}
                onChange={(e) => setAiCount(Number(e.target.value))}
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
          </div>

          <div className="modal-actions-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAiModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={generating}
              icon="✨"
            >
              Generate & Start Quiz
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Quiz;
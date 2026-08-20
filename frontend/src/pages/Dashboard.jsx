import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressService, materialService } from '../services/api';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalQuizzes: 12,
    averageScore: 78,
    studyHours: 24,
    materialsCompleted: 18,
  });

  const [subjects, setSubjects] = useState([
    { subject: 'Computer Science', masteryPercentage: 91, icon: '💻', color: '#8b5cf6' },
    { subject: 'Mathematics', masteryPercentage: 85, icon: '📘', color: '#3b82f6' },
    { subject: 'Physics', masteryPercentage: 72, icon: '🔬', color: '#06b6d4' },
    { subject: 'Artificial Intelligence', masteryPercentage: 88, icon: '🤖', color: '#ec4899' },
  ]);

  const [featuredMaterials, setFeaturedMaterials] = useState([]);
  const [quickPrompt, setQuickPrompt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, subjRes, matRes] = await Promise.all([
          progressService.getStats().catch(() => null),
          progressService.getSubjects().catch(() => null),
          materialService.getAll().catch(() => null),
        ]);

        if (statsRes?.success && statsRes.data) {
          setStats((prev) => ({ ...prev, ...statsRes.data }));
        }

        if (subjRes?.success && subjRes.data?.length > 0) {
          setSubjects(subjRes.data);
        }

        if (matRes?.success && matRes.data?.length > 0) {
          setFeaturedMaterials(matRes.data.slice(0, 3));
        }
      } catch (err) {
        console.warn('Using default demo metrics on dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuickAsk = (e) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    navigate('/chat', { state: { initialPrompt: quickPrompt } });
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Hero Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <span className="welcome-badge">🚀 Personalized Study Hub</span>
          <h1 className="welcome-title">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Student'}! 👋
          </h1>
          <p className="welcome-subtitle">
            You're on track to hit your weekly study goals. What topic would you like to master today?
          </p>
        </div>
        <div className="welcome-cta">
          <Link to="/quiz" className="btn btn-primary btn-md">
            📝 Take a Quiz
          </Link>
          <Link to="/chat" className="btn btn-outline btn-md">
            🤖 Ask AI Tutor
          </Link>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            📝
          </div>
          <div className="stat-details">
            <span className="stat-label">Quizzes Completed</span>
            <h2 className="stat-value">{stats.totalQuizzes}</h2>
            <span className="stat-meta">🎯 Consistent progress</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#047857' }}>
            📊
          </div>
          <div className="stat-details">
            <span className="stat-label">Average Score</span>
            <h2 className="stat-value">{stats.averageScore}%</h2>
            <span className="stat-meta">✨ Top 15% percentile</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#b45309' }}>
            ⏱️
          </div>
          <div className="stat-details">
            <span className="stat-label">Study Hours</span>
            <h2 className="stat-value">{stats.studyHours}h</h2>
            <span className="stat-meta">🔥 4-day streak</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fce7f3', color: '#be185d' }}>
            📚
          </div>
          <div className="stat-details">
            <span className="stat-label">Materials Studied</span>
            <h2 className="stat-value">{stats.materialsCompleted}</h2>
            <span className="stat-meta">💡 Keep exploring</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Dashboard Content */}
      <div className="dashboard-grid">
        {/* Left Column: Quick AI & Recommended */}
        <div className="dashboard-main-col">
          {/* Quick AI Assistant Card */}
          <Card
            title="AI Study Assistant"
            subtitle="Ask questions, generate summaries, or clarify complex topics instantly."
            icon="🤖"
            className="ai-spotlight-card"
          >
            <form onSubmit={handleQuickAsk} className="quick-ai-form">
              <input
                type="text"
                placeholder="Ask anything (e.g., 'Explain recursion', 'What is Newton\\'s second law?')..."
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
              />
              <Button type="submit" variant="primary" icon="⚡">
                Ask AI
              </Button>
            </form>
            <div className="quick-prompt-chips">
              <button type="button" onClick={() => setQuickPrompt('Explain React Hooks with examples')}>
                React Hooks
              </button>
              <button type="button" onClick={() => setQuickPrompt('What is Big-O notation?')}>
                Big-O Notation
              </button>
              <button type="button" onClick={() => setQuickPrompt('Derivatives vs Integrals')}>
                Calculus Basics
              </button>
            </div>
          </Card>

          {/* Continue Learning / Featured Materials */}
          <div className="section-header-row">
            <h2>Recommended Study Materials</h2>
            <Link to="/materials" className="section-link">
              View All Materials →
            </Link>
          </div>

          <div className="materials-preview-grid">
            {(featuredMaterials.length > 0 ? featuredMaterials : [
              {
                _id: '1',
                title: 'React Fundamentals & Component Architecture',
                subject: 'Computer Science',
                type: 'Notes',
                readingTimeMinutes: 8,
                description: 'Master JSX, props, state, and clean component patterns.',
              },
              {
                _id: '2',
                title: 'Calculus Basics: Limits & Derivatives',
                subject: 'Mathematics',
                type: 'Notes',
                readingTimeMinutes: 7,
                description: 'Essential formulas and geometric interpretations of rates of change.',
              },
            ]).map((mat) => (
              <div key={mat._id} className="material-preview-card">
                <div className="material-preview-header">
                  <span className="material-subject-badge">{mat.subject}</span>
                  <span className="material-type-pill">{mat.type}</span>
                </div>
                <h3 className="material-preview-title">{mat.title}</h3>
                <p className="material-preview-desc">{mat.description}</p>
                <div className="material-preview-footer">
                  <span>⏱️ {mat.readingTimeMinutes || 5} min read</span>
                  <Link to={`/materials`} className="btn btn-outline btn-sm">
                    Study Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Subject Mastery & Progress */}
        <div className="dashboard-side-col">
          <Card
            title="Subject Mastery"
            subtitle="Your current proficiency across courses"
            icon="🎯"
            action={
              <Link to="/progress" className="card-link-small">
                Details →
              </Link>
            }
          >
            <div className="subject-mastery-list">
              {subjects.map((item, idx) => (
                <div key={idx} className="subject-mastery-item">
                  <div className="subject-mastery-info">
                    <span className="subject-icon">{item.icon || '📘'}</span>
                    <span className="subject-name">{item.subject}</span>
                  </div>
                  <ProgressBar
                    value={item.masteryPercentage}
                    max={100}
                    color={item.color || '#4f46e5'}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Quiz Card */}
          <div className="quiz-banner-card">
            <div className="quiz-banner-icon">💡</div>
            <h3>Daily Knowledge Check</h3>
            <p>Test your retention with a quick 5-question AI practice test.</p>
            <Link to="/quiz" className="btn btn-primary btn-md w-full">
              Start Practice Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

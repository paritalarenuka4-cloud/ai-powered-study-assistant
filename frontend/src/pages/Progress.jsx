import { useState, useEffect } from 'react';
import { progressService, quizService } from '../services/api';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

function Progress() {
  const [stats, setStats] = useState({
    totalQuizzes: 12,
    averageScore: 78,
    studyHours: 24.5,
    materialsCompleted: 18,
  });

  const [subjects, setSubjects] = useState([
    { subject: 'Computer Science', masteryPercentage: 91, quizzesTaken: 5, color: '#8b5cf6', icon: '💻' },
    { subject: 'Mathematics', masteryPercentage: 85, quizzesTaken: 4, color: '#3b82f6', icon: '📘' },
    { subject: 'Physics', masteryPercentage: 72, quizzesTaken: 2, color: '#06b6d4', icon: '🔬' },
    { subject: 'Artificial Intelligence', masteryPercentage: 88, quizzesTaken: 1, color: '#ec4899', icon: '🤖' },
  ]);

  const [recentResults, setRecentResults] = useState([
    {
      _id: 'r-1',
      quizTitle: 'React & Modern JavaScript Quiz',
      subject: 'Computer Science',
      score: 4,
      totalQuestions: 5,
      percentage: 80,
      completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      _id: 'r-2',
      quizTitle: 'Calculus Differentiation Quiz',
      subject: 'Mathematics',
      score: 3,
      totalQuestions: 3,
      percentage: 100,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: 'r-3',
      quizTitle: 'Newton\'s Laws of Motion Quiz',
      subject: 'Physics',
      score: 2,
      totalQuestions: 2,
      percentage: 100,
      completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ]);

  const [activities, setActivities] = useState([
    {
      _id: 'a-1',
      title: 'Completed Quiz: React & Modern JavaScript',
      activityType: 'quiz',
      durationMinutes: 10,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      _id: 'a-2',
      title: 'Studied: Understanding Recursion & Call Stacks',
      activityType: 'material',
      durationMinutes: 8,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      _id: 'a-3',
      title: 'AI Tutor Consultation Session on React Hooks',
      activityType: 'chat',
      durationMinutes: 12,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const [statsRes, subjRes, resultsRes, actRes] = await Promise.all([
          progressService.getStats().catch(() => null),
          progressService.getSubjects().catch(() => null),
          quizService.getResults().catch(() => null),
          progressService.getActivity().catch(() => null),
        ]);

        if (statsRes?.success && statsRes.data) {
          setStats((prev) => ({ ...prev, ...statsRes.data }));
        }
        if (subjRes?.success && subjRes.data?.length > 0) {
          setSubjects(subjRes.data);
        }
        if (resultsRes?.success && resultsRes.data?.length > 0) {
          setRecentResults(resultsRes.data);
        }
        if (actRes?.success && actRes.data?.length > 0) {
          setActivities(actRes.data);
        }
      } catch (err) {
        console.warn('Using demo metrics on progress page:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  return (
    <div className="progress-page">
      {/* Header */}
      <div className="progress-header-row">
        <div>
          <h1 className="page-title">📊 Learning Analytics & Mastery</h1>
          <p className="page-subtitle">
            Track your study hours, quiz accuracy, and subject-wise knowledge growth.
          </p>
        </div>
        <Link to="/quiz" className="btn btn-primary btn-md">
          📝 Take a New Quiz
        </Link>
      </div>

      {/* Top Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            📝
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Quizzes Taken</span>
            <h2 className="stat-value">{stats.totalQuizzes}</h2>
            <span className="stat-meta">Active engagement</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#047857' }}>
            🎯
          </div>
          <div className="stat-details">
            <span className="stat-label">Average Score</span>
            <h2 className="stat-value">{stats.averageScore}%</h2>
            <span className="stat-meta">Across all subjects</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#b45309' }}>
            ⏱️
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Study Time</span>
            <h2 className="stat-value">{stats.studyHours} hrs</h2>
            <span className="stat-meta">Goal: 30 hrs/month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fce7f3', color: '#be185d' }}>
            📚
          </div>
          <div className="stat-details">
            <span className="stat-label">Materials Completed</span>
            <h2 className="stat-value">{stats.materialsCompleted}</h2>
            <span className="stat-meta">Reading & guides</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="progress-content-grid">
        {/* Left Column: Subject Mastery */}
        <div className="progress-left-col">
          <Card
            title="Subject Performance & Mastery"
            subtitle="Calculated based on quiz accuracy and materials studied"
            icon="🏆"
          >
            <div className="subject-progress-list">
              {subjects.map((item, idx) => (
                <div key={idx} className="subject-progress-row">
                  <div className="subj-header">
                    <div className="subj-title-group">
                      <span className="subj-icon">{item.icon || '📘'}</span>
                      <span className="subj-name">{item.subject}</span>
                    </div>
                    <span className="subj-score-badge">
                      {item.masteryPercentage}% Mastery
                    </span>
                  </div>
                  <ProgressBar
                    value={item.masteryPercentage}
                    max={100}
                    color={item.color || '#4f46e5'}
                    showPercent={false}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Quiz Performance Timeline */}
          <Card
            title="Recent Quiz Results"
            subtitle="Your past practice test submissions"
            icon="📋"
          >
            <div className="quiz-results-history-list">
              {recentResults.map((res, index) => (
                <div key={index} className="history-result-item">
                  <div className="history-info">
                    <h4 className="history-quiz-title">{res.quizTitle}</h4>
                    <span className="history-subject">{res.subject}</span>
                    <span className="history-date">
                      {new Date(res.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="history-score-col">
                    <span className="history-fraction">
                      {res.score}/{res.totalQuestions}
                    </span>
                    <span
                      className={`history-pill ${res.percentage >= 70 ? 'pill-high' : 'pill-mid'}`}
                    >
                      {res.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Activity Stream & Weekly Goal */}
        <div className="progress-right-col">
          <Card title="Weekly Study Goal" icon="🎯">
            <div className="goal-widget">
              <div className="goal-circle">
                <span className="goal-value">82%</span>
                <span className="goal-sub">of weekly goal</span>
              </div>
              <p className="goal-text">
                You've studied <strong>4.8 hours</strong> out of your <strong>6.0 hour</strong> weekly target.
              </p>
              <ProgressBar value={82} max={100} color="#10b981" />
            </div>
          </Card>

          <Card title="Recent Activity Log" icon="⚡">
            <div className="activity-timeline">
              {activities.map((act, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <p className="timeline-title">{act.title}</p>
                    <span className="timeline-time">
                      ⏱️ {act.durationMinutes} mins • {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Progress;
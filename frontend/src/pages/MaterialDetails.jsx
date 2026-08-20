import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { materialService } from '../services/api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';

function MaterialDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(location.state?.material || null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(!material);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!material) {
        setLoading(true);
        try {
          const res = await materialService.getById(id);
          if (res.success && res.data) {
            setMaterial(res.data);
            setRelated(res.related || []);
          }
        } catch (err) {
          console.warn('Could not fetch material by ID, using demo fallback:', err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [id, material]);

  if (loading) {
    return <LoadingSpinner message="Opening study guide..." />;
  }

  if (!material) {
    return (
      <div className="empty-state-card">
        <h3>Material not found</h3>
        <p>The requested study guide could not be located.</p>
        <Button onClick={() => navigate('/materials')}>Back to Materials</Button>
      </div>
    );
  }

  return (
    <div className="material-details-layout">
      {/* Top Breadcrumbs & Action bar */}
      <div className="details-header-bar">
        <button className="back-link-btn" onClick={() => navigate('/materials')}>
          ← Back to All Materials
        </button>
        <div className="details-header-actions">
          <Button
            variant="outline"
            size="sm"
            icon="🤖"
            onClick={() =>
              navigate('/chat', {
                state: {
                  initialPrompt: `I am reading about "${material.title}". Can you give me 3 practice questions or summarize the key points?`,
                },
              })
            }
          >
            Ask AI Tutor
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon="📝"
            onClick={() =>
              navigate('/quiz', {
                state: { subject: material.subject },
              })
            }
          >
            Take Subject Quiz
          </Button>
        </div>
      </div>

      <div className="details-grid">
        {/* Main Content Area */}
        <article className="details-main-content">
          <div className="details-meta-row">
            <span className="material-subject-badge">{material.subject}</span>
            <span className="material-type-pill">{material.type}</span>
            <span className="material-time-pill">⏱️ {material.readingTimeMinutes || 5} min read</span>
          </div>

          <h1 className="details-title">{material.title}</h1>
          <p className="details-description">{material.description}</p>

          {/* Key Takeaways Card */}
          {material.keyTakeaways && material.keyTakeaways.length > 0 && (
            <div className="takeaways-box">
              <h3 className="takeaways-heading">🎯 Key Takeaways</h3>
              <ul className="takeaways-list">
                {material.keyTakeaways.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Content Body */}
          <div className="details-body-text">
            {material.content.split('\n').map((line, idx) => {
              if (line.startsWith('## ')) {
                return <h2 key={idx}>{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={idx}>{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('```')) {
                return null;
              }
              return <p key={idx}>{line}</p>;
            })}
          </div>

          {/* Bottom Practice CTA */}
          <div className="details-cta-banner">
            <div className="cta-icon">🎓</div>
            <div>
              <h3>Ready to test your knowledge?</h3>
              <p>Practice what you just read with interactive quizzes and immediate feedback.</p>
            </div>
            <Button
              variant="primary"
              onClick={() =>
                navigate('/quiz', { state: { subject: material.subject } })
              }
            >
              Start Practice Quiz →
            </Button>
          </div>
        </article>

        {/* Sidebar Info & Related Topics */}
        <aside className="details-sidebar">
          <Card title="Study Summary" icon="📌">
            <div className="summary-stat-row">
              <span className="summary-stat-label">Subject:</span>
              <span className="summary-stat-val">{material.subject}</span>
            </div>
            <div className="summary-stat-row">
              <span className="summary-stat-label">Estimated Time:</span>
              <span className="summary-stat-val">{material.readingTimeMinutes || 5} mins</span>
            </div>
            <div className="summary-stat-row">
              <span className="summary-stat-label">Format:</span>
              <span className="summary-stat-val">{material.type}</span>
            </div>
          </Card>

          <Card title="AI Tutor Quick Prompts" icon="⚡">
            <div className="quick-prompt-buttons">
              <button
                className="btn-quick-ai"
                onClick={() =>
                  navigate('/chat', {
                    state: {
                      initialPrompt: `Explain the core concept of ${material.title} in simple terms for a beginner.`,
                    },
                  })
                }
              >
                💡 Explain simply for beginners
              </button>
              <button
                className="btn-quick-ai"
                onClick={() =>
                  navigate('/chat', {
                    state: {
                      initialPrompt: `Give me 3 common mistakes students make when learning ${material.title}.`,
                    },
                  })
                }
              >
                ⚠️ Common mistakes to avoid
              </button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default MaterialDetails;

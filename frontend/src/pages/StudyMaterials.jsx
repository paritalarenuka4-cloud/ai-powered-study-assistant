import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { materialService } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const DEFAULT_MATERIALS = [
  {
    _id: 'default-1',
    subject: 'Computer Science',
    title: 'React Fundamentals & Component Architecture',
    description: 'Master JSX, props, state, hooks, and clean reusable component patterns.',
    type: 'Notes',
    readingTimeMinutes: 8,
    keyTakeaways: [
      'Components return JSX and stay isolated.',
      'State manages dynamic local data.',
      'Props pass immutable data downward.',
    ],
    content: 'React is a declarative, component-based library for building interactive user interfaces.',
  },
  {
    _id: 'default-2',
    subject: 'Computer Science',
    title: 'Understanding Recursion & Call Stacks',
    description: 'Deep dive into recursive algorithms, base cases, and avoiding stack overflow.',
    type: 'Article',
    readingTimeMinutes: 6,
    keyTakeaways: ['Always provide a base case', 'Recursion utilizes the call stack'],
    content: 'Recursion occurs when a function calls itself directly or indirectly.',
  },
  {
    _id: 'default-3',
    subject: 'Mathematics',
    title: 'Calculus Basics: Limits & Derivatives',
    description: 'Essential formulas and geometric interpretations of rates of change.',
    type: 'Notes',
    readingTimeMinutes: 7,
    keyTakeaways: ['Power rule: d/dx(x^n) = n*x^(n-1)', 'Limits define continuity'],
    content: 'Calculus is the mathematical study of continuous change.',
  },
  {
    _id: 'default-4',
    subject: 'Physics',
    title: 'Newton\'s Laws of Motion & Applications',
    description: 'Classical mechanics, force diagrams, friction, and acceleration.',
    type: 'Notes',
    readingTimeMinutes: 5,
    keyTakeaways: ['Law 1: Inertia', 'Law 2: F = ma', 'Law 3: Action-Reaction'],
    content: 'Sir Isaac Newton formulated three fundamental laws of classical physics.',
  },
  {
    _id: 'default-5',
    subject: 'Artificial Intelligence',
    title: 'Introduction to Supervised Machine Learning',
    description: 'Feature vectors, labels, loss functions, gradient descent, and evaluation.',
    type: 'Article',
    readingTimeMinutes: 10,
    keyTakeaways: ['Labeled dataset training', 'Classification vs Regression'],
    content: 'Supervised learning trains models on labeled input-output pairs.',
  },
];

function StudyMaterials() {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState(DEFAULT_MATERIALS);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // AI Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiSubject, setAiSubject] = useState('Computer Science');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiLength, setAiLength] = useState('standard');
  const [generating, setGenerating] = useState(false);

  const subjects = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Artificial Intelligence'];
  const types = ['All', 'Notes', 'Article', 'Video', 'PDF', 'Practice Questions'];

  const fetchMaterials = async () => {
    setLoading(true);
    setError('');
    try {
      let query = `?subject=${encodeURIComponent(selectedSubject)}&type=${encodeURIComponent(selectedType)}`;
      if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await materialService.getAll(query);
      if (res.success && res.data && res.data.length > 0) {
        setMaterials(res.data);
      } else {
        // Fallback filter over default materials
        const filtered = DEFAULT_MATERIALS.filter((m) => {
          const matchSubj = selectedSubject === 'All' || m.subject.toLowerCase() === selectedSubject.toLowerCase();
          const matchType = selectedType === 'All' || m.type === selectedType;
          const matchSearch =
            !searchQuery ||
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.description.toLowerCase().includes(searchQuery.toLowerCase());
          return matchSubj && matchType && matchSearch;
        });
        setMaterials(filtered);
      }
    } catch (err) {
      console.warn('API unavailable, displaying local fallback material library:', err.message);
      setMaterials(DEFAULT_MATERIALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [selectedSubject, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMaterials();
  };

  const handleGenerateAiNotes = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setGenerating(true);
    try {
      const res = await materialService.generateAiNotes({
        subject: aiSubject,
        topic: aiTopic,
        difficulty: aiDifficulty,
        length: aiLength,
      });

      if (res.success && res.data) {
        setMaterials((prev) => [res.data, ...prev]);
        setIsModalOpen(false);
        setAiTopic('');
        navigate(`/materials/${res.data._id || 'default-1'}`, { state: { material: res.data } });
      }
    } catch (err) {
      // Local fallback creation
      const generated = {
        _id: `ai-${Date.now()}`,
        subject: aiSubject,
        title: `${aiTopic} - AI Comprehensive Study Guide`,
        description: `Generated study guide on ${aiTopic} for ${aiSubject} (${aiDifficulty} level).`,
        type: 'Notes',
        readingTimeMinutes: 8,
        keyTakeaways: [
          `Key concept summary of ${aiTopic}`,
          `Practical patterns and algorithmic flow in ${aiSubject}`,
          'Active recall practice checklist',
        ],
        content: `## 📘 ${aiTopic} Study Guide\n\nThis guide covers the key elements of **${aiTopic}** under **${aiSubject}**.\n\n### 1. Core Principles\nUnderstanding how ${aiTopic} operates in modern architectures.\n\n### 2. Practice Check\nTry answering 3 practice questions on this topic in the Quiz tab!`,
      };
      setMaterials((prev) => [generated, ...prev]);
      setIsModalOpen(false);
      setAiTopic('');
      navigate(`/materials/${generated._id}`, { state: { material: generated } });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="materials-container">
      {/* Page Header */}
      <div className="materials-header-row">
        <div>
          <h1 className="page-title">📚 Study Materials & Resources</h1>
          <p className="page-subtitle">
            Curated study guides, interactive notes, and AI-generated learning materials.
          </p>
        </div>
        <Button
          variant="primary"
          icon="✨"
          onClick={() => setIsModalOpen(true)}
        >
          Generate AI Study Notes
        </Button>
      </div>

      {/* Search & Filtering Bar */}
      <div className="materials-controls-card">
        <form onSubmit={handleSearchSubmit} className="materials-search-form">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search materials by title, topic, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchQuery('');
                fetchMaterials();
              }}
            >
              ✕
            </button>
          )}
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>

        {/* Subject Filter Pills */}
        <div className="filter-pills-row">
          <span className="filter-label">Subject:</span>
          <div className="pills-scroll">
            {subjects.map((subj) => (
              <button
                key={subj}
                className={`filter-pill ${selectedSubject === subj ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subj)}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching study resources..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchMaterials} />
      ) : materials.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No study materials match your search"
          description="Try selecting a different subject or generate new notes using AI."
          action={
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              ✨ Generate Notes with AI
            </Button>
          }
        />
      ) : (
        <div className="materials-catalog-grid">
          {materials.map((mat) => (
            <div key={mat._id} className="catalog-card">
              <div className="catalog-card-header">
                <span className="catalog-subject-tag">{mat.subject}</span>
                <span className="catalog-type-tag">{mat.type}</span>
              </div>
              <h3 className="catalog-title">{mat.title}</h3>
              <p className="catalog-desc">{mat.description}</p>
              
              <div className="catalog-footer">
                <span className="catalog-time">⏱️ {mat.readingTimeMinutes || 5} min read</span>
                <button
                  className="btn-read-material"
                  onClick={() =>
                    navigate(`/materials/${mat._id}`, { state: { material: mat } })
                  }
                >
                  View Material →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Note Generator Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="✨ Generate AI Study Notes"
      >
        <form onSubmit={handleGenerateAiNotes} className="ai-modal-form">
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
            <label>Topic / Concept to Learn</label>
            <input
              type="text"
              placeholder="e.g. React Hooks, Binary Trees, Newton's Laws"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Difficulty Level</label>
              <select
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Medium">Intermediate (Medium)</option>
                <option value="Hard">Advanced (Hard)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Detail Level</label>
              <select
                value={aiLength}
                onChange={(e) => setAiLength(e.target.value)}
              >
                <option value="short">Quick Summary (4 mins)</option>
                <option value="standard">Standard (7 mins)</option>
                <option value="detailed">In-Depth Guide (12 mins)</option>
              </select>
            </div>
          </div>

          <div className="modal-actions-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={generating}
              icon="✨"
            >
              Generate Notes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default StudyMaterials;
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

function Settings() {
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || 'Student');
  const [email, setEmail] = useState(user?.email || 'student@example.com');
  const [studyGoalMinutes, setStudyGoalMinutes] = useState(user?.studyGoalMinutes || 60);
  const [themePreference, setThemePreference] = useState(user?.themePreference || 'light');
  const [notifications, setNotifications] = useState(user?.notificationsEnabled ?? true);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await authService.updateProfile({
        name,
        studyGoalMinutes: Number(studyGoalMinutes),
        themePreference,
        notificationsEnabled: notifications,
      });

      if (res.success && res.data) {
        updateUser(res.data);
        setSuccessMsg('✅ Profile settings updated successfully!');
      } else {
        throw new Error(res.message || 'Could not update profile');
      }
    } catch (err) {
      // Local fallback update
      updateUser({ name, studyGoalMinutes, themePreference, notificationsEnabled: notifications });
      setSuccessMsg('✅ Settings saved locally!');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="page-title">⚙️ Account & Preferences</h1>
        <p className="page-subtitle">
          Manage your student profile, study targets, and interface themes.
        </p>
      </div>

      {successMsg && <div className="success-banner">{successMsg}</div>}
      {errorMsg && <ErrorMessage message={errorMsg} />}

      <form onSubmit={handleSave} className="settings-form-layout">
        {/* Profile Details Card */}
        <Card title="Student Profile" subtitle="Your personal information" icon="👤">
          <div className="form-row-2">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                title="Email cannot be changed directly"
              />
            </div>
          </div>
        </Card>

        {/* Study Goals Card */}
        <Card title="Learning Targets" subtitle="Customize your daily study targets" icon="🎯">
          <div className="form-group">
            <label>Daily Study Goal (Minutes)</label>
            <select
              value={studyGoalMinutes}
              onChange={(e) => setStudyGoalMinutes(e.target.value)}
            >
              <option value={30}>30 Minutes / Day (Casual)</option>
              <option value={60}>60 Minutes / Day (Recommended)</option>
              <option value={90}>90 Minutes / Day (Intensive)</option>
              <option value={120}>120 Minutes / Day (Exam Prep)</option>
            </select>
          </div>
        </Card>

        {/* Preferences & Notifications */}
        <Card title="Preferences" subtitle="App appearance and notifications" icon="🎨">
          <div className="form-group">
            <label>Theme Preference</label>
            <div className="theme-options-row">
              {['light', 'dark', 'system'].map((th) => (
                <button
                  type="button"
                  key={th}
                  className={`theme-pick-btn ${themePreference === th ? 'active' : ''}`}
                  onClick={() => setThemePreference(th)}
                >
                  {th === 'light' ? '☀️ Light' : th === 'dark' ? '🌙 Dark' : '💻 System'}
                </button>
              ))}
            </div>
          </div>

          <div className="toggle-row">
            <div>
              <span className="toggle-label">Study Reminders & Streak Alerts</span>
              <p className="toggle-sub">Receive daily reminders to maintain your study streak.</p>
            </div>
            <input
              type="checkbox"
              className="checkbox-toggle"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </div>
        </Card>

        {/* Save Button */}
        <div className="settings-actions-bar">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
            icon="💾"
          >
            Save Changes
          </Button>
        </div>
      </form>

      {/* Account Security / Logout Card */}
      <Card title="Account Actions" subtitle="Session management" icon="🔒" className="danger-zone-card">
        <div className="danger-zone-content">
          <div>
            <h4>Sign Out</h4>
            <p>End your current session on this device securely.</p>
          </div>
          <Button variant="danger" onClick={logout} icon="🚪">
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Settings;
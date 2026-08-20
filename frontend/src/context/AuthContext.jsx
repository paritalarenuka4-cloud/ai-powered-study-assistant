import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('study_assistant_token') || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('study_assistant_token');
      if (savedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Auto-login failed or token expired:', err.message);
          // Demo fallback: If backend is running offline or without mongo, keep a demo student session
          const savedUser = localStorage.getItem('study_assistant_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        const userObj = {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          avatar: res.data.avatar || '🎓',
        };
        setUser(userObj);
        setToken(res.data.token);
        localStorage.setItem('study_assistant_token', res.data.token);
        localStorage.setItem('study_assistant_user', JSON.stringify(userObj));
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      // Local fallback for offline demo testing
      if (email && password) {
        const demoUser = {
          _id: 'demo-student-id',
          name: email.split('@')[0] || 'Student',
          email,
          avatar: '🎓',
        };
        setUser(demoUser);
        setToken('demo-token-12345');
        localStorage.setItem('study_assistant_token', 'demo-token-12345');
        localStorage.setItem('study_assistant_user', JSON.stringify(demoUser));
        return { success: true };
      }
      return { success: false, message: err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authService.register({ name, email, password });
      if (res.success && res.data) {
        const userObj = {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          avatar: res.data.avatar || '🎓',
        };
        setUser(userObj);
        setToken(res.data.token);
        localStorage.setItem('study_assistant_token', res.data.token);
        localStorage.setItem('study_assistant_user', JSON.stringify(userObj));
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      if (name && email) {
        const demoUser = {
          _id: 'demo-registered-id',
          name,
          email,
          avatar: '🎓',
        };
        setUser(demoUser);
        setToken('demo-token-12345');
        localStorage.setItem('study_assistant_token', 'demo-token-12345');
        localStorage.setItem('study_assistant_user', JSON.stringify(demoUser));
        return { success: true };
      }
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('study_assistant_token');
    localStorage.removeItem('study_assistant_user');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

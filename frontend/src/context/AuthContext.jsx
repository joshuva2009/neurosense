import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('neurosense_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentSession, setCurrentSession] = useState(() => {
    const saved = localStorage.getItem('neurosense_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [completedTests, setCompletedTests] = useState(() => {
    const saved = localStorage.getItem('neurosense_completed_tests');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('neurosense_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('neurosense_user');
    }
  }, [user]);

  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('neurosense_session', JSON.stringify(currentSession));
    } else {
      localStorage.removeItem('neurosense_session');
    }
  }, [currentSession]);

  useEffect(() => {
    localStorage.setItem('neurosense_completed_tests', JSON.stringify(completedTests));
  }, [completedTests]);

  const loginGuest = async () => {
    const res = await api.guestLogin();
    if (res && res.user) {
      setUser(res.user);
      // Start a fresh screening session for this user
      startNewSession(res.user.id);
      return res.user;
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
    startNewSession(userData.id);
  };

  const logout = () => {
    setUser(null);
    setCurrentSession(null);
    setCompletedTests({});
    localStorage.removeItem('neurosense_user');
    localStorage.removeItem('neurosense_session');
    localStorage.removeItem('neurosense_completed_tests');
  };

  const startNewSession = async (userId = user?.id) => {
    if (!userId) return;
    const sess = await api.startSession(userId);
    if (sess) {
      setCurrentSession(sess);
      setCompletedTests({});
    }
  };

  const recordTestResult = async (testType, rawScore, details = {}) => {
    if (!user) {
      await loginGuest();
    }
    const sessionId = currentSession?.session_id || Date.now();
    const res = await api.submitTest({
      session_id: sessionId,
      user_id: user?.id || 1,
      test_type: testType,
      raw_score: rawScore,
      details
    });

    setCompletedTests(prev => ({
      ...prev,
      [testType]: {
        rawScore,
        normalizedScore: res.test_result?.normalized_score || 80,
        accuracy: res.test_result?.accuracy || 90,
        reactionTime: res.test_result?.reaction_time_ms,
        timestamp: new Date().toISOString()
      }
    }));

    return res;
  };

  const completeActiveSession = async () => {
    if (!currentSession) return;
    const res = await api.completeSession(currentSession.session_id);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentSession,
        completedTests,
        loginGuest,
        loginUser,
        logout,
        startNewSession,
        recordTestResult,
        completeActiveSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('voct_user_id');
    if (userId) {
      getUser(userId)
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('voct_user_id'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('voct_user_id', userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voct_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

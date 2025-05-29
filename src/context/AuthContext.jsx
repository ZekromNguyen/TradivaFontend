import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const userInfo = localStorage.getItem('user');
      

      if (accessToken && userInfo && userInfo !== 'undefined' && userInfo !== 'null') {
        const parsedUser = JSON.parse(userInfo);
        if (parsedUser && typeof parsedUser === 'object') {
          setIsLoggedIn(true);
          setUser(parsedUser);
        } else {
          console.warn('Invalid user data in localStorage');
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    try {
      if (!userData || typeof userData !== 'object' || Object.keys(userData).length === 0) {
        throw new Error('Invalid user data: userData must be a non-empty object');
      }
      if (!accessToken || !refreshToken) {
        throw new Error('Missing accessToken or refreshToken');
      }
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('login: Storing user data:', userData); // Debug
      setIsLoggedIn(true);
      setUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = (newUserData) => {
    try {
      if (!newUserData || typeof newUserData !== 'object') {
        throw new Error('Invalid new user data');
      }
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
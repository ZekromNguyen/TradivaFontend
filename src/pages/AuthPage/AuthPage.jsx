import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../../components/auth/Login/Login';
import Register from '../../components/auth/Register/Register';
import './AuthPage.css';

const AuthPage = ({ initialMode }) => {
  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const location = useLocation();

  // Update isLogin based on pathname
  useEffect(() => {
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  // Preload the background image and force re-render
  useEffect(() => {
    const img = new Image();
    img.src = '/images/travel-bg.jpg';
    img.onload = () => {
      // Force a re-render or update the background
      setTimeout(() => {}, 0); // Trigger a microtask to ensure DOM updates
    };
    img.onerror = () => {
      console.error('Failed to load background image');
    };
  }, [isLogin]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  // Dynamically set background image
  const backgroundStyle = {
    backgroundImage: `url(/images/travel-bg.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div
      className="auth-container"
      style={backgroundStyle}
      key={isLogin ? 'login' : 'register'}
    >
      <div className="overlay"></div>
      <div className="form-wrapper">
        {isLogin ? (
          <Login key="login" onSwitchToRegister={toggleAuthMode} />
        ) : (
          <Register key="register" onSwitchToLogin={toggleAuthMode} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
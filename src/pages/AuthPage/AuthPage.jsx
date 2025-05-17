import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../../components/auth/Login/Login';
import Register from '../../components/auth/Register/Register';

const AuthPage = ({ initialMode }) => {
  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const location = useLocation();

  // Cập nhật trạng thái dựa trên đường dẫn URL
  useEffect(() => {
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen">
      {isLogin ? (
        <Login onSwitchToRegister={toggleAuthMode} />
      ) : (
        <Register onSwitchToLogin={toggleAuthMode} />
      )}
    </div>
  );
};

export default AuthPage;
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle, FaGlobeAmericas, FaSpinner, FaUser, FaLock } from 'react-icons/fa';
import './Login.css';
import '../../../pages/AuthPage/AuthPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://tradivabe.felixtien.dev/api/Auth/login';

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const Login = ({ onSwitchToRegister }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const iconStyle = {
    color: '#9ca3af',
    fill: '#9ca3af',
    width: '16px',
    height: '16px',
    display: 'block'
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }

      if (!result.accessToken || !result.refreshToken) {
        throw new Error('Invalid API response: Missing accessToken or refreshToken');
      }

      const decodedToken = decodeJWT(result.accessToken);
      if (!decodedToken) {
        throw new Error('Unable to decode user data from token');
      }

      const userData = {
        username: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || data.username,
        email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null,
        id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null,
        role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null,
      };

      login(userData, result.accessToken, result.refreshToken);
      toast.success('Đăng nhập thành công!');

      // Role-based navigation
      const role = userData.role;
      setTimeout(() => {
        if (role === 'Customer') {
          navigate('/');
        } else if (role === 'Guide') {
          navigate('/guide');
        } else if (role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/'); // Default route for unrecognized roles
        }
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {

        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="auth-container bg-travel">
      <div className="overlay"></div>
      <ToastContainer position="top-right" autoClose={3000} className="custom-toast-container" />

      <motion.div
        className="auth-form-container login-special-effect login-animation"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        <motion.div className="text-center" variants={itemVariants}>
          <div className="flex justify-center mb-4">
            <div className="flex items-center logo-animation">
              <FaGlobeAmericas className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold gradient-text">TRADIVA</h1>
            </div>
          </div>
          <motion.h2 className="text-3xl font-extrabold text-gray-900" variants={itemVariants}>
            Đăng nhập
          </motion.h2>
          <motion.p className="mt-2 text-sm text-gray-600" variants={itemVariants}>
            Đăng nhập vào tài khoản của bạn
          </motion.p>
        </motion.div>

        <motion.form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} variants={containerVariants}>
          <div className="space-y-5">
            <motion.div variants={itemVariants}>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Tên đăng nhập
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="input-icon-container">
                  <FaUser style={iconStyle} className="login-icon" />
                </span>
                <input
                  id="username"
                  type="text"
                  className={`w-full px-4 py-3 pl-10 border rounded-lg login-input-focus bg-white/80 backdrop-blur-sm ${errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Nhập tên đăng nhập"
                  {...register('username', { required: 'Tên đăng nhập là bắt buộc' })}
                />
                {errors.username && (
                  <motion.p className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {errors.username.message}
                  </motion.p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="input-icon-container">
                  <FaLock style={iconStyle} className="login-icon" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 pl-10 border rounded-lg login-input-focus bg-white/80 backdrop-blur-sm ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Mật khẩu là bắt buộc',
                    minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                  })}
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEye style={iconStyle} className="login-icon" /> : <FaEyeSlash style={iconStyle} className="login-icon" />}
                </span>
                {errors.password && (
                  <motion.p className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {errors.password.message}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div className="flex items-center justify-between" variants={itemVariants}>
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary border-gray-300 rounded login-checkbox" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <div className="text-sm">
              <a href="forgot-password" className="font-medium text-primary hover:text-primary-dark link-animation">
                Quên mật khẩu?
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary login-btn-hover pulse-effect"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin h-5 w-5 mr-2" /> : null}
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </motion.div>
        </motion.form>

        <motion.div className="mt-6" variants={itemVariants}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div>
              <a
                href="#"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 social-login-btn"
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
                <span className="ml-2">Google</span>
              </a>
            </div>
          </div>
        </motion.div>

        <motion.p className="mt-8 text-center text-sm text-gray-600" variants={itemVariants}>
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-dark link-animation">
            Đăng ký ngay
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
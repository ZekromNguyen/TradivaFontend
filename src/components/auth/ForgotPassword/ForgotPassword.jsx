import { useState, useEffect } from 'react'; // Added useEffect for background loading
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaEnvelope, FaSpinner, FaGlobeAmericas } from 'react-icons/fa';
import './ForgotPassword.css';
import '../../../pages/AuthPage/AuthPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tradivabe.felixtien.dev/api/Auth/forgot-password';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Preload the background image
  useEffect(() => {
    const img = new Image();
    img.src = '/images/travel-bg.jpg';
    img.onload = () => {
      console.log('Background image loaded successfully');
    };
    img.onerror = () => {
      console.error('Failed to load background image. Check the path: /images/travel-bg.jpg');
    };
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.');
      }

      toast.success('Yêu cầu đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email của bạn.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const iconStyle = {
    color: '#9ca3af',
    fill: '#9ca3af',
    width: '16px',
    height: '16px',
    display: 'block',
  };

  // Ensure background style is applied
  const backgroundStyle = {
    backgroundImage: `url(/images/travel-bg.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="auth-container" style={backgroundStyle}>
      <div className="overlay" style={{ background: 'rgba(0, 0, 0, 0.3)' }}></div> {/* Increased opacity for better contrast */}
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
            Quên Mật Khẩu
          </motion.h2>
          <motion.p className="mt-2 text-sm text-gray-600" variants={itemVariants}>
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </motion.p>
        </motion.div>

        <motion.form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} variants={containerVariants}>
          <div className="space-y-5">
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="input-icon-container">
                  <FaEnvelope style={iconStyle} className="login-icon" />
                </span>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-3 pl-10 border rounded-lg login-input-focus bg-white backdrop-blur-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập email của bạn"
                  {...register('email', {
                    required: 'Email là bắt buộc',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Email không hợp lệ',
                    },
                  })}
                />
                {errors.email && (
                  <motion.p className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {errors.email.message}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary login-btn-hover pulse-effect"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin h-5 w-5 mr-2" /> : null}
              {isLoading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
            </button>
          </motion.div>
        </motion.form>

        
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion as Motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle, FaGlobeAmericas, FaSpinner } from 'react-icons/fa';
import './Login.css';
import '../../../pages/AuthPage/AuthPage.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login with:', data);
      setIsLoading(false);
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants cho Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Trong phần render, thay thế nút chuyển đổi bằng Link
  return (
    <div className="auth-container bg-travel">
      <div className="overlay"></div>
      
      <Motion.div 
        className="auth-form-container login-special-effect login-animation"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Motion.div className="text-center" variants={itemVariants}>
          <div className="flex justify-center mb-4">
            <div className="flex items-center logo-animation">
              <FaGlobeAmericas className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold gradient-text">TRADIVA</h1>
            </div>
          </div>
          
          <Motion.h2 
            className="text-3xl font-extrabold text-gray-900"
            variants={itemVariants}
          >
            Đăng nhập
          </Motion.h2>
          
          <Motion.p 
            className="mt-2 text-sm text-gray-600"
            variants={itemVariants}
          >
            Đăng nhập vào tài khoản của bạn
          </Motion.p>
        </Motion.div>
        
        <Motion.form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit(onSubmit)}
          variants={containerVariants}
        >
          <div className="space-y-5">
            <Motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                </div>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-3 pl-10 border rounded-lg login-input-focus bg-white/80 backdrop-blur-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                  {...register("email", { 
                    required: "Email là bắt buộc", 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ"
                    }
                  })}
                />
                {errors.email && (
                  <Motion.p 
                    className="error-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.email.message}
                  </Motion.p>
                )}
              </div>
            </Motion.div>
            
            <Motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pl-10 border rounded-lg login-input-focus bg-white/80 backdrop-blur-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Mật khẩu là bắt buộc",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự"
                    }
                  })}
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </div>
                {errors.password && (
                  <Motion.p 
                    className="error-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.password.message}
                  </Motion.p>
                )}
              </div>
            </Motion.div>
          </div>

          <Motion.div className="flex items-center justify-between" variants={itemVariants}>
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded login-checkbox transition-transform hover:scale-110"
                {...register("rememberMe")}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary/80 link-animation">
                Quên mật khẩu?
              </a>
            </div>
          </Motion.div>

          <Motion.div variants={itemVariants}>
            <Motion.button 
              type="submit" 
              className={`w-full px-4 py-3 text-white bg-gradient-to-r from-primary to-secondary rounded-lg font-medium shadow-md login-btn-hover disabled:opacity-70 ${isLoading ? 'pulse-effect' : ''}`}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Đang đăng nhập...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </Motion.button>
          </Motion.div>
        </Motion.form>
        
        <Motion.div className="mt-6" variants={itemVariants}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full max-w-xs">
              <a href="#" className="social-login-btn w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700">
                <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
                Google
              </a>
            </Motion.div>
          </div>
        </Motion.div>
        
        <Motion.div className="mt-6 text-center" variants={itemVariants}>
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link 
              to="/register" 
              className="font-medium text-primary hover:text-primary/80 link-animation"
            >
              Đăng ký ngay
            </Link>
          </p>
        </Motion.div>
      </Motion.div>
    </div>
  );
};

export default Login;

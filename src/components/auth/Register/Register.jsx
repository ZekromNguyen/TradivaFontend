import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion as Motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGlobeAmericas, FaSpinner, FaPhone, FaUserAlt } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import '../../../pages/AuthPage/AuthPage.css';
import './Register.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Định nghĩa schema validation với Yup
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required('Họ và tên là bắt buộc')
      .min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    username: Yup.string()
      .required('Tên đăng nhập là bắt buộc')
      .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
      .matches(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
    phoneNumber: Yup.string()
      .required('Số điện thoại là bắt buộc')
      .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
    password: Yup.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .required('Mật khẩu là bắt buộc'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
      .required('Xác nhận mật khẩu là bắt buộc'),
    agreeTerms: Yup.boolean()
      .oneOf([true], 'Bạn phải đồng ý với điều khoản dịch vụ')
  });

  // Sử dụng Formik để quản lý form
  const formik = useFormik({
    initialValues: {
      fullName: '',
      username: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    },
    validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      
      // Giả lập API call
      setTimeout(() => {
        console.log('Đăng ký với:', values);
        toast.success('Đăng ký thành công!');
        setIsLoading(false);
      }, 1500);
    }
  });

  // Tính toán tiến trình hoàn thành form
  useEffect(() => {
    let progress = 0;
    const { values, errors } = formik;
    
    if (values.fullName && !errors.fullName) progress += 14.28;
    if (values.username && !errors.username) progress += 14.28;
    if (values.phoneNumber && !errors.phoneNumber) progress += 14.28;
    if (values.email && !errors.email) progress += 14.28;
    if (values.password && !errors.password) progress += 14.28;
    if (values.confirmPassword && !errors.confirmPassword) progress += 14.28;
    if (values.agreeTerms) progress += 14.28;
    
    setFormProgress(progress);
  }, [formik.values, formik.errors]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  // Common style for icons
  const iconStyle = { 
    color: '#9ca3af', 
    fill: '#9ca3af',
    width: '16px',
    height: '16px',
    display: 'block'
  };

  // Eye icon style
  const eyeIconStyle = {
    color: '#9ca3af',
    fill: '#9ca3af',
    width: '18px',
    height: '18px',
    display: 'block'
  };

  return (
    <div className="auth-container bg-travel">
      <div className="overlay"></div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Motion.div 
        className="auth-form-container register-special-effect"
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
          <h2 className="text-3xl font-extrabold text-gray-900">Bắt Đầu Hành Trình</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tạo tài khoản để khám phá thế giới
          </p>
        </Motion.div>
        
        {/* Thanh tiến trình */}
        <Motion.div className="form-progress mt-6" variants={itemVariants}>
          <Motion.div 
            className="progress-bar" 
            initial={{ width: 0 }}
            animate={{ width: `${formProgress}%` }}
            transition={{ duration: 0.5 }}
          ></Motion.div>
        </Motion.div>
        
        <Motion.form 
          className="mt-4 space-y-5" 
          onSubmit={formik.handleSubmit}
          variants={containerVariants}
        >
          <div className="space-y-4">
            <Motion.div className="input-container" variants={itemVariants}>
              <div className="relative">
                <span className="input-icon-container">
                  <FaUserAlt className="register-icon" style={iconStyle} />
                </span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  className={`input-field pl-10 register-input-focus ${
                    formik.touched.fullName && !formik.errors.fullName ? 'field-valid' : ''
                  }`}
                  placeholder=" "
                  {...formik.getFieldProps('fullName')}
                />
                <label htmlFor="fullName" className="floating-label pl-10">
                  Họ và tên
                </label>
              </div>
              {formik.touched.fullName && formik.errors.fullName && (
                <Motion.p 
                  className="text-xs text-red-500 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formik.errors.fullName}
                </Motion.p>
              )}
            </Motion.div>
            
            {/* Thêm trường Username */}
            <Motion.div className="input-container" variants={itemVariants}>
              <div className="relative">
                <span className="input-icon-container">
                  <FaUser className="register-icon" style={iconStyle} />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className={`input-field pl-10 register-input-focus ${
                    formik.touched.username && !formik.errors.username ? 'field-valid' : ''
                  }`}
                  placeholder=" "
                  {...formik.getFieldProps('username')}
                />
                <label htmlFor="username" className="floating-label pl-10">
                  Tên đăng nhập
                </label>
              </div>
              {formik.touched.username && formik.errors.username && (
                <Motion.p 
                  className="text-xs text-red-500 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formik.errors.username}
                </Motion.p>
              )}
            </Motion.div>
            
            {/* Thêm trường Số điện thoại */}
            <Motion.div className="input-container" variants={itemVariants}>
              <div className="relative">
                <span className="input-icon-container">
                  <FaPhone className="register-icon" style={iconStyle} />
                </span>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  className={`input-field pl-10 register-input-focus ${
                    formik.touched.phoneNumber && !formik.errors.phoneNumber ? 'field-valid' : ''
                  }`}
                  placeholder=" "
                  {...formik.getFieldProps('phoneNumber')}
                />
                <label htmlFor="phoneNumber" className="floating-label pl-10">
                  Số điện thoại
                </label>
              </div>
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <Motion.p 
                  className="text-xs text-red-500 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formik.errors.phoneNumber}
                </Motion.p>
              )}
            </Motion.div>
            
            <Motion.div className="input-container" variants={itemVariants}>
              <div className="relative">
                <span className="input-icon-container">
                  <FaEnvelope className="register-icon" style={iconStyle} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`input-field pl-10 register-input-focus ${
                    formik.touched.email && !formik.errors.email ? 'field-valid' : ''
                  }`}
                  placeholder=" "
                  {...formik.getFieldProps('email')}
                />
                <label htmlFor="email" className="floating-label pl-10">
                  Email
                </label>
              </div>
              {formik.touched.email && formik.errors.email && (
                <Motion.p 
                  className="text-xs text-red-500 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formik.errors.email}
                </Motion.p>
              )}
            </Motion.div>
            
            <Motion.div className="input-container" variants={itemVariants}>
              <div className="relative">
                <span className="input-icon-container">
                  <FaLock className="register-icon" style={iconStyle} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`input-field pl-10 register-input-focus ${
                    formik.touched.password && !formik.errors.password ? 'field-valid' : ''
                  }`}
                  placeholder=" "
                  {...formik.getFieldProps('password')}
                />
                <label htmlFor="password" className="floating-label pl-10">
                  Mật khẩu
                </label>
                <span 
                  className="eye-icon-container" 
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 
                    <FaEye className="eye-icon" style={eyeIconStyle} /> : 
                    <FaEyeSlash className="eye-icon" style={eyeIconStyle} />
                  }
                </span>
              </div>
              {formik.touched.password && formik.errors.password && (
                <Motion.p 
                  className="text-xs text-red-500 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formik.errors.password}
                </Motion.p>
              )}
            </Motion.div>
            
            <Motion.div className="input-container" variants={itemVariants}>
              <div className="relative">
                <span className="input-icon-container">
                  <FaLock className="register-icon" style={iconStyle} />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`input-field pl-10 register-input-focus ${
                    formik.touched.confirmPassword && !formik.errors.confirmPassword ? 'field-valid' : ''
                  }`}
                  placeholder=" "
                  {...formik.getFieldProps('confirmPassword')}
                />
                <label htmlFor="confirmPassword" className="floating-label pl-10">
                  Xác nhận mật khẩu
                </label>
                <span 
                  className="eye-icon-container" 
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? 
                    <FaEye className="eye-icon" style={eyeIconStyle} /> : 
                    <FaEyeSlash className="eye-icon" style={eyeIconStyle} />
                  }
                </span>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <Motion.p 
                  className="text-xs text-red-500 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formik.errors.confirmPassword}
                </Motion.p>
              )}
            </Motion.div>
          </div>

          <Motion.div className="flex items-center" variants={itemVariants}>
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded register-checkbox checkbox-animation"
              {...formik.getFieldProps('agreeTerms')}
            />
            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
              Tôi đồng ý với <a href="#" className="text-blue-600 hover:text-blue-500 link-animation">Điều khoản dịch vụ</a> và <a href="#" className="text-blue-600 hover:text-blue-500 link-animation">Chính sách bảo mật</a>
            </label>
          </Motion.div>
          {formik.touched.agreeTerms && formik.errors.agreeTerms && (
            <Motion.p 
              className="text-xs text-red-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {formik.errors.agreeTerms}
            </Motion.p>
          )}

          <Motion.div variants={itemVariants}>
            <Motion.button 
              type="submit" 
              className={`btn-primary register-btn-hover ${isLoading ? 'pulse-effect' : ''}`}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Đang đăng ký...
                </span>
              ) : (
                "Đăng ký"
              )}
            </Motion.button>
          </Motion.div>
        </Motion.form>
        
        {/* Phần đăng ký với mạng xã hội */}
        <Motion.div className="mt-6" variants={itemVariants}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
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
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link 
                to="/login" 
                className="font-medium text-primary hover:text-primary/80 link-animation"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </Motion.div>
      </Motion.div>
    </div>
  );
};

export default Register;
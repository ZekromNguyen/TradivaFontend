import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGlobeAmericas, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <Motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Logo và Giới thiệu */}
          <Motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <FaGlobeAmericas className="h-6 w-6 text-blue-400" />
              <h3 className="ml-2 text-xl font-bold">TRADIVA</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Tradiva - Đối tác du lịch đáng tin cậy của bạn. Chúng tôi mang đến những trải nghiệm du lịch tuyệt vời với dịch vụ chuyên nghiệp và giá cả hợp lý.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <FaFacebookF />
              </a>
              <a href="#" className="bg-blue-400 hover:bg-blue-500 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <FaInstagram />
              </a>
              <a href="#" className="bg-blue-700 hover:bg-blue-800 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <FaLinkedinIn />
              </a>
            </div>
          </Motion.div>

          {/* Liên kết nhanh */}
          <Motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 relative">
              Liên Kết Nhanh
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-500 mt-2"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                  Khám phá
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                  Hướng dẫn viên
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                  Liên hệ
                </Link>
              </li>
            </ul>
          </Motion.div>

          {/* Tour phổ biến */}
          <Motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 relative">
              Tour Phổ Biến
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-500 mt-2"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                  Đà Lạt - Thành phố mộng mơ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                  Phú Quốc - Đảo ngọc thiên đường
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                  Hạ Long - Kỳ quan thiên nhiên
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                  Sapa - Thị trấn trong sương
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                  Hội An - Phố cổ di sản
                </a>
              </li>
            </ul>
          </Motion.div>

          {/* Thông tin liên hệ */}
          <Motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 relative">
              Liên Hệ
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-500 mt-2"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400">123 Đường Du Lịch, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-blue-400 mr-3" />
                <span className="text-gray-400">+84 123 456 789</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-400 mr-3" />
                <span className="text-gray-400">info@tradiva.com</span>
              </li>
            </ul>
            
            {/* Form đăng ký nhận tin */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Đăng ký nhận thông tin ưu đãi</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors duration-300">
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
        
        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Tradiva. Tất cả quyền được bảo lưu.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
                  Trợ giúp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
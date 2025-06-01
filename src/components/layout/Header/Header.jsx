import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  FaGlobeAmericas,
  FaUserCircle,
  FaSearch,
  FaCompass,
  FaUserTie,
  FaPhoneAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./Header.css";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  // Kiểm tra đường dẫn hiện tại để highlight menu item
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Thêm event listener để theo dõi scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-500 ${
        scrolled ? "scrolled" : "transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 w-1/4">
            <Link to="/" className="flex items-center">
              <Motion.div
                className="flex items-center"
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={logoVariants}
              >
                <FaGlobeAmericas className="h-6 w-6 text-white" />
                <h1 className="ml-2 text-xl font-bold text-white">TRADIVA</h1>
              </Motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-grow">
            <ul className="flex space-x-10">
              <li>
                <Link
                  to="/"
                  className={`nav-link text-sm font-medium transition-colors duration-300 ${
                    isActive("/")
                      ? "text-white font-bold active-link"
                      : "text-white hover:text-blue-200"
                  }`}
                >
                  Trang chủ
                </Link>
              </li>

              <li>
                <Link
                  to="/explore"
                  className={`nav-link text-sm font-medium transition-colors duration-300 ${
                    isActive("/explore")
                      ? "text-white font-bold active-link"
                      : "text-white hover:text-blue-200"
                  }`}
                >
                  <span className="flex items-center">
                    <FaCompass className="mr-1" />
                    Khám phá
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/guides"
                  className={`nav-link text-sm font-medium transition-colors duration-300 ${
                    isActive("/guides")
                      ? "text-white font-bold active-link"
                      : "text-white hover:text-blue-200"
                  }`}
                >
                  <span className="flex items-center">
                    <FaUserTie className="mr-1" />
                    Hướng dẫn viên
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className={`nav-link text-sm font-medium transition-colors duration-300 ${
                    isActive("/contact")
                      ? "text-white font-bold active-link"
                      : "text-white hover:text-blue-200"
                  }`}
                >
                  <span className="flex items-center">
                    <FaPhoneAlt className="mr-1" />
                    Liên hệ
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4 flex-shrink-0 w-1/4 justify-end">
            {/* Search Button */}
            <button className="search-button" aria-label="Tìm kiếm">
              <FaSearch
                style={{
                  color: "white",
                  width: "20px",
                  height: "20px",
                  display: "inline-block",
                  visibility: "visible",
                  opacity: 1,
                }}
              />
            </button>

            {/* User Profile */}
            {!isLoggedIn && (
              <div>
                <Link
                  to="/login"
                  className="hidden md:flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-full transition-colors duration-300"
                >
                  <FaUserCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Đăng nhập</span>
                </Link>
              </div>
            )}
            {isLoggedIn && user && (
              <div className="flex items-center space-x-3 bg-white/80 px-4 py-2 rounded-full shadow border border-blue-200">
                <FaUserCircle className="text-blue-600 h-6 w-6" />

                <button
                  onClick={logout}
                  className="ml-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm font-medium transition"
                  title="Đăng xuất"
                >
                  <span className="font-semibold text-blue-700">
                    Xin chào, {user.username || "User"}
                  </span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <Motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden mobile-menu-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Motion.div
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 overflow-y-auto"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaGlobeAmericas className="h-6 w-6 text-blue-600" />
                  <h1 className="ml-2 text-xl font-bold text-blue-600">
                    TRADIVA
                  </h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-4">
                <Motion.li variants={mobileItemVariants}>
                  <Link
                    to="/"
                    className={`block py-2 px-4 rounded-md ${
                      isActive("/")
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Trang chủ
                  </Link>
                </Motion.li>

                <Motion.li variants={mobileItemVariants}>
                  <Link
                    to="/explore"
                    className={`block py-2 px-4 rounded-md ${
                      isActive("/explore")
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <FaCompass className="mr-2" />
                      Khám phá
                    </span>
                  </Link>
                </Motion.li>

                <Motion.li variants={mobileItemVariants}>
                  <Link
                    to="/guides"
                    className={`block py-2 px-4 rounded-md ${
                      isActive("/guides")
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <FaUserTie className="mr-2" />
                      Hướng dẫn viên
                    </span>
                  </Link>
                </Motion.li>

                <Motion.li variants={mobileItemVariants}>
                  <Link
                    to="/contact"
                    className={`block py-2 px-4 rounded-md ${
                      isActive("/contact")
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <FaPhoneAlt className="mr-2" />
                      Liên hệ
                    </span>
                  </Link>
                </Motion.li>

                <Motion.li variants={mobileItemVariants}>
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Link
                      to="/login"
                      className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md text-center font-medium hover:bg-blue-700 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full mt-2 py-2 px-4 bg-white border border-blue-600 text-blue-600 rounded-md text-center font-medium hover:bg-blue-50 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </div>
                </Motion.li>
              </ul>
            </nav>
          </Motion.div>
        </Motion.div>
      )}
    </header>
  );
};

export default Header;

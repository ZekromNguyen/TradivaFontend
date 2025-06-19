import React, { useState, useEffect } from "react";
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
  FaHistory,
} from "react-icons/fa";
import "./Header.css";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, delay: 0.2 },
    },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
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
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-500 ${scrolled ? "scrolled" : "transparent"
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
                  className={`nav-link text-sm font-medium transition-colors duration-300 ${isActive("/") ? "text-white font-bold active-link" : "text-white hover:text-blue-200"
                    }`}
                >
                  Trang chủ
                </Link>
              </li>

              <li>
                <Link
                  to="/explore"
                  className={`nav-link text-sm font-medium transition-colors duration-300 ${isActive("/explore") ? "text-white font-bold active-link" : "text-white hover:text-blue-200"
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
                  className={`nav-link text-sm font-medium transition-colors duration-300 ${isActive("/guides") ? "text-white font-bold active-link" : "text-white hover:text-blue-200"
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
                  className={`nav-link text-sm font-medium transition-colors duration-300 ${isActive("/contact") ? "text-white font-bold active-link" : "text-white hover:text-blue-200"
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
          <div className="flex items-center space-x-3 w-1/4 justify-end">
            <button className="search-button" aria-label="Tìm kiếm">
              <FaSearch className="text-white w-5 h-5" />
            </button>

            {!isLoggedIn && (
              <Link
                to="/login"
                className="hidden md:flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-full transition-colors duration-300"
              >
                <FaUserCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Đăng nhập</span>
              </Link>
            )}

            {isLoggedIn && user && (
              <div className="relative hidden md:flex items-center">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center bg-white px-3 py-1 rounded-full shadow border border-blue-200 focus:outline-none"
                >
                  <FaUserCircle className="text-blue-600 h-5 w-5" />
                  <span className="text-blue-700 text-sm font-semibold ml-1">
                    {user.username || "User"}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <Link
                      to="/history"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaHistory className="inline mr-2" />
                      Lịch sử đặt tour
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <Motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <FaGlobeAmericas className="h-6 w-6 text-blue-600" />
                <h1 className="ml-2 text-xl font-bold text-blue-600">TRADIVA</h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-4">
                {[
                  { path: "/", label: "Trang chủ" },
                  { path: "/explore", label: "Khám phá", icon: <FaCompass className="mr-2" /> },
                  { path: "/guides", label: "Hướng dẫn viên", icon: <FaUserTie className="mr-2" /> },
                  { path: "/contact", label: "Liên hệ", icon: <FaPhoneAlt className="mr-2" /> },
                ].map(({ path, label, icon }) => (
                  <Motion.li key={path} variants={mobileItemVariants}>
                    <Link
                      to={path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-2 px-4 rounded-md ${isActive(path)
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <span className="flex items-center">
                        {icon}
                        {label}
                      </span>
                    </Link>
                  </Motion.li>
                ))}

                {!isLoggedIn ? (
                  <Motion.li variants={mobileItemVariants}>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <Link
                        to="/login"
                        className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md text-center font-medium hover:bg-blue-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full mt-2 py-2 px-4 bg-white border border-blue-600 text-blue-600 rounded-md text-center font-medium hover:bg-blue-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </div>
                  </Motion.li>
                ) : (
                  <Motion.li variants={mobileItemVariants}>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <FaUserCircle className="mr-2" />
                        {user.username || "User"}
                      </button>
                      <Link
                        to="/my-bookings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FaHistory className="inline mr-2" />
                        Lịch sử đặt tour
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </Motion.li>
                )}
              </ul>
            </nav>
          </Motion.div>
        </Motion.div>
      )}
    </header>
  );
};

export default Header;
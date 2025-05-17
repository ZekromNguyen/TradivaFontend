import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';
import './HeroSection.css';

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const autoPlayRef = useRef(null);
  const totalSlides = 4;
  
  const images = [
    '/images/hero-beach.jpg',
    '/images/hero-culture.jpg',
    '/images/hero-journey.jpg',
    '/images/hero-nature.jpg',
  ];
  
  const heroTexts = [
    "Khám phá trải nghiệm du lịch địa phương độc đáo",
    "Tận hưởng những khoảnh khắc tuyệt vời",
    "Kết nối với văn hóa bản địa",
    "Tạo nên những kỷ niệm không thể quên"
  ];
  
  const heroSubtexts = [
    "Cùng TRADIVA khám phá những điểm đến tuyệt vời",
    "Mỗi chuyến đi là một câu chuyện đáng nhớ",
    "Trải nghiệm văn hóa đích thực với người dân địa phương",
    "Để mỗi hành trình trở thành kỷ niệm khó quên"
  ];
  
  const nextSlide = useCallback(() => {
    setIsChanging(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsChanging(false);
    }, 500);
  }, [images.length]);
  
  useEffect(() => {
    autoPlayRef.current = nextSlide;
    
    const interval = setInterval(() => {
      autoPlayRef.current();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [nextSlide]);
  
  return (
    <section className="hero-section relative overflow-hidden">
      {/* Hiệu ứng fade-zoom cho ảnh */}
      <div className="hero-slider absolute inset-0">
        {images.map((image, index) => (
          <Motion.div
            key={index}
            className="hero-slide absolute inset-0"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ 
              opacity: currentIndex === index ? 1 : 0,
              scale: currentIndex === index ? 1 : 1.2,
              zIndex: currentIndex === index ? 1 : 0
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut",
              opacity: { duration: 1 },
              scale: { duration: 1.5 }
            }}
          >
            <img 
              src={image} 
              alt={`Hero slide ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </Motion.div>
        ))}
      </div>
      
      <div className="hero-overlay"></div>
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          {/* Hiệu ứng hiển thị từng dòng text - đồng bộ với ảnh */}
          <div className="hero-title-container mb-4">
            <AnimatePresence mode="wait">
              <Motion.h1
                key={currentIndex}
                className="hero-title"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {heroTexts[currentIndex]}
              </Motion.h1>
            </AnimatePresence>
          </div>
          
          <div className="hero-subtitle-container mb-8">
            <AnimatePresence mode="wait">
              <Motion.p
                key={currentIndex}
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                {heroSubtexts[currentIndex]}
              </Motion.p>
            </AnimatePresence>
          </div>
          
          <div className="hero-cta-container">
            <Link to="/about" className="hero-cta-primary">
              Tìm hiểu thêm
            </Link>
            <Link to="/chat" className="hero-cta-secondary chat-ai pulse-effect">
              <FaRobot className="ai-icon" />
              Chat with TripAI
            </Link>
          </div>
          
          <div className="hero-pagination mt-12">
            <div className="flex items-center justify-center space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`hero-dot ${currentIndex === index ? 'active' : ''}`}
                  onClick={() => {
                    setIsChanging(true);
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setIsChanging(false);
                    }, 300);
                  }}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-icon">
          <span></span>
        </div>
        <p>Cuộn xuống</p>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);
import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaArrowRight, FaArrowLeft, FaStar, FaHeart, FaCompass, FaPlane, FaHotel, FaUtensils, FaUser, FaMapMarked, FaRoute, FaPhoneAlt, FaEnvelope, FaDownload } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  // Dữ liệu cho hero carousel
  const heroImages = [
    { url: "/hero-beach.jpg", title: "Khám Phá Điểm Đến Mới Cùng Tradiva" },
    { url: "/hero-culture.jpg", title: "Trải Nghiệm Văn Hóa Độc Đáo" },
    { url: "/hero-nature.jpg", title: "Khám Phá Thiên Nhiên Kỳ Vĩ" },
    { url: "/hero-journey.jpg", title: "Hành Trình Đáng Nhớ" }
  ];
  
  // Dữ liệu cho sidebar carousel
  const sidebarImages = [
    { url: "/travel-bg.jpg", title: "Bãi biển thiên đường" },
    { url: "/destination-1.jpg", title: "Núi non hùng vĩ" },
    { url: "/destination-2.jpg", title: "Thành phố sôi động" },
    { url: "/destination-3.jpg", title: "Làng quê yên bình" },
    { url: "/travel-bg.jpg", title: "Hồ nước trong xanh" },
    { url: "/destination-1.jpg", title: "Thác nước hùng vĩ" }
  ];
  
  // State cho hero carousel
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const heroIntervalRef = useRef(null);
  
  // State cho sidebar scroll
  const sidebarRef = useRef(null);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);
  
  // Các dịch vụ du lịch
  const services = [
    { icon: <FaPlane />, title: "Vé Máy Bay", description: "Đặt vé máy bay giá rẻ đến mọi điểm đến" },
    { icon: <FaHotel />, title: "Khách Sạn", description: "Đa dạng lựa chọn từ bình dân đến cao cấp" },
    { icon: <FaCompass />, title: "Tour Du Lịch", description: "Tour trọn gói với hướng dẫn viên chuyên nghiệp" },
    { icon: <FaUtensils />, title: "Ẩm Thực", description: "Khám phá văn hóa ẩm thực địa phương" }
  ];
  
  // Điểm đến nổi bật
  const destinations = [
    { 
      id: 1, 
      name: "Đà Lạt", 
      image: "/destination-1.jpg", 
      description: "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm",
      rating: 4.8,
      price: "2,500,000đ"
    },
    { 
      id: 2, 
      name: "Phú Quốc", 
      image: "/destination-2.jpg", 
      description: "Đảo ngọc với bãi biển cát trắng và nước biển trong xanh",
      rating: 4.9,
      price: "3,800,000đ"
    },
    { 
      id: 3, 
      name: "Hạ Long", 
      image: "/destination-3.jpg", 
      description: "Kỳ quan thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi",
      rating: 4.7,
      price: "2,900,000đ"
    },
    { 
      id: 4, 
      name: "Hội An", 
      image: "/travel-bg.jpg", 
      description: "Phố cổ lãng mạn với đèn lồng rực rỡ về đêm",
      rating: 4.9,
      price: "2,200,000đ"
    }
  ];
  
  // Tự động chuyển ảnh hero
  useEffect(() => {
    startHeroCarousel();
    
    return () => {
      if (heroIntervalRef.current) {
        clearInterval(heroIntervalRef.current);
      }
    };
  }, []);
  
  const startHeroCarousel = () => {
    if (heroIntervalRef.current) {
      clearInterval(heroIntervalRef.current);
    }
    
    heroIntervalRef.current = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
  };
  
  // Tự động cuộn sidebar
  useEffect(() => {
    let scrollInterval;
    
    if (!isHoveringSidebar && sidebarRef.current) {
      scrollInterval = setInterval(() => {
        if (sidebarRef.current) {
          if (sidebarRef.current.scrollLeft >= sidebarRef.current.scrollWidth - sidebarRef.current.clientWidth - 10) {
            // Khi cuộn đến cuối, quay lại từ đầu với hiệu ứng mượt mà
            const scrollToStart = () => {
              sidebarRef.current.scrollTo({
                left: 0,
                behavior: 'smooth'
              });
            };
            setTimeout(scrollToStart, 500);
          } else {
            // Cuộn mượt mà
            sidebarRef.current.scrollBy({
              left: 1,
              behavior: 'auto'
            });
          }
        }
      }, 30);
    }
    
    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [isHoveringSidebar]);
  
  // Chuyển đến ảnh hero trước đó
  const prevHeroSlide = () => {
    setCurrentHeroIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
    resetHeroInterval();
  };
  
  // Chuyển đến ảnh hero tiếp theo
  const nextHeroSlide = () => {
    setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    resetHeroInterval();
  };
  
  // Reset interval khi chuyển ảnh thủ công
  const resetHeroInterval = () => {
    if (heroIntervalRef.current) {
      clearInterval(heroIntervalRef.current);
      startHeroCarousel();
    }
  };
  
  // Thêm dữ liệu cho hướng dẫn viên
  const guides = [
    {
      id: 1,
      name: "Nguyễn Văn Nam",
      image: "/guide-1.jpg",
      rating: 4.9,
      tours: 120
    },
    {
      id: 2,
      name: "Trần Minh Anh",
      image: "/guide-2.jpg",
      rating: 4.8,
      tours: 98
    },
    {
      id: 3,
      name: "Lê Hoàng Phúc",
      image: "/guide-3.jpg",
      rating: 4.7,
      tours: 85
    },
    {
      id: 4,
      name: "Nguyễn Thị Hương",
      image: "/guide-4.jpg",
      rating: 4.9,
      tours: 110
    }
  ];
  
  // Thêm dữ liệu cho quy trình đặt tour
  const bookingSteps = [
    {
      icon: <FaMapMarked />,
      title: "Chọn điểm đến",
      description: "Lựa chọn điểm đến yêu thích của bạn"
    },
    {
      icon: <FaCalendarAlt />,
      title: "Chọn ngày",
      description: "Chọn ngày khởi hành phù hợp"
    },
    {
      icon: <FaUser />,
      title: "Đặt tour",
      description: "Hoàn tất thông tin đặt tour"
    },
    {
      icon: <FaRoute />,
      title: "Tận hưởng",
      description: "Tận hưởng chuyến đi của bạn"
    }
  ];
  
  return (
    <div className="home-page">
      {/* Hero Section với Carousel - Giữ nguyên */}
      <div className="relative h-screen overflow-hidden">
        {/* Carousel Images */}
        {heroImages.map((image, index) => (
          <Motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url("${image.url}")`,
              zIndex: index === currentHeroIndex ? 1 : 0 
            }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: index === currentHeroIndex ? 1 : 0,
              scale: index === currentHeroIndex ? 1 : 1.05,
              transition: { duration: 1.5, ease: "easeInOut" }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"></div>
          </Motion.div>
        ))}
        
        {/* Carousel Controls */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 rounded-full p-4 text-white transition-all duration-300 backdrop-blur-sm"
          onClick={prevHeroSlide}
          aria-label="Ảnh trước đó"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 rounded-full p-4 text-white transition-all duration-300 backdrop-blur-sm"
          onClick={nextHeroSlide}
          aria-label="Ảnh tiếp theo"
        >
          <FaArrowRight className="h-5 w-5" />
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentHeroIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
              onClick={() => {
                setCurrentHeroIndex(index);
                resetHeroInterval();
              }}
              aria-label={`Chuyển đến ảnh ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <Motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg"
            key={currentHeroIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {heroImages[currentHeroIndex].title}
          </Motion.h1>
          
          <Motion.p 
            className="text-xl md:text-2xl mb-10 max-w-3xl drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trải nghiệm du lịch tuyệt vời với hướng dẫn viên chuyên nghiệp và dịch vụ đẳng cấp
          </Motion.p>
          
          {/* Search Box */}
          <Motion.div 
            className="w-full max-w-4xl bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-primary" />
                </div>
                <input 
                  type="text" 
                  placeholder="Bạn muốn đi đâu?" 
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-primary" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ngày khởi hành" 
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              
              <button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center">
                <FaSearch className="mr-2" />
                Tìm Kiếm
              </button>
            </div>
          </Motion.div>
        </div>
      </div>
      
      {/* Sidebar Images - Auto Scrolling */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Điểm Đến Nổi Bật</h2>
          
          <div 
            ref={sidebarRef}
            className="overflow-x-auto whitespace-nowrap pb-4 hide-scrollbar"
            onMouseEnter={() => setIsHoveringSidebar(true)}
            onMouseLeave={() => setIsHoveringSidebar(false)}
          >
            <div className="inline-flex space-x-4 px-4">
              {sidebarImages.map((image, index) => (
                <div 
                  key={index}
                  className="w-72 h-48 rounded-xl overflow-hidden shadow-md relative group cursor-pointer"
                >
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-lg font-semibold">{image.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Dịch Vụ Du Lịch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Motion.div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Popular Destinations */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Điểm Đến Phổ Biến</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((destination, index) => (
              <Motion.div 
                key={destination.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <button className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/40 transition-colors duration-300">
                    <FaHeart />
                  </button>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="text-gray-700">{destination.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">{destination.price}</span>
                    <button className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-300">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <Motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Sẵn sàng cho chuyến phiêu lưu tiếp theo?
          </Motion.h2>
          
          <Motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Đăng ký ngay hôm nay để nhận thông tin ưu đãi đặc biệt cho chuyến đi của bạn
          </Motion.p>
          
          <Motion.button 
            className="bg-white text-primary hover:bg-gray-100 py-3 px-8 rounded-full font-medium text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đặt Tour Ngay
          </Motion.button>
        </div>
      </div>
      
      {/* CSS cho ẩn thanh cuộn */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
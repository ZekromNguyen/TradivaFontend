import React from 'react';
import { FaMapMarkedAlt, FaUserFriends, FaShieldAlt } from 'react-icons/fa';
import './ServiceFeatures.css';

const ServiceFeatures = () => {
  const features = [
    {
      icon: <FaMapMarkedAlt className="text-primary text-4xl mb-4" />,
      title: "Khám phá địa điểm",
      description: "Tìm kiếm và khám phá các địa điểm du lịch hấp dẫn"
    },
    {
      icon: <FaUserFriends className="text-primary text-4xl mb-4" />,
      title: "Kết nối với Tradiva",
      description: "Kết nối với hướng dẫn viên địa phương và du khách khác"
    },
    {
      icon: <FaShieldAlt className="text-primary text-4xl mb-4" />,
      title: "Đảm bảo an toàn",
      description: "Đảm bảo an toàn và bảo mật cho chuyến đi của bạn"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Tại sao chọn TRADIVA?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceFeatures;
import React from 'react';

const TourHighlights = ({ highlights = [] }) => {
  // Default highlights if none provided
  const defaultHighlights = [
    {
      icon: 'guide',
      title: 'Hướng dẫn viên chuyên nghiệp',
      description: 'Đội ngũ hướng dẫn viên chuyên nghiệp, thông thạo địa phương'
    },
    {
      icon: 'meal',
      title: 'Bao gồm các bữa ăn chính',
      description: 'Thưởng thức ẩm thực đặc sắc địa phương'
    },
    {
      icon: 'transport',
      title: 'Phương tiện di chuyển tiện nghi',
      description: 'Xe đưa đón có máy lạnh và an toàn'
    },
    {
      icon: 'activity',
      title: 'Trải nghiệm văn hóa độc đáo',
      description: 'Tham gia các hoạt động văn hóa tại các điểm tham quan'
    }
  ];
  
  // Use provided highlights or default ones
  const displayHighlights = highlights.length > 0 ? highlights : defaultHighlights;
  
  // Icon mapping function
  const getIconForType = (type) => {
    switch(type) {
      case 'guide':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'meal':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'transport':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'activity':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'ticket':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        );
      case 'accommodation':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };
  
  return (
    <div className="tour-highlights bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tại sao chọn tour này?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayHighlights.map((highlight, index) => (
          <div key={index} className="flex items-start gap-4 group">
            {/* Icon container */}
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
              {getIconForType(highlight.icon)}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{highlight.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{highlight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourHighlights; 
import React from 'react';
import Rating from '../../components/ui/Rating';

const TourOperator = ({ operator = {} }) => {
  // Default operator information if none provided
  const defaultOperator = {
    name: 'Tradiva Travel',
    logo: 'https://placekitten.com/200/200', // Placeholder
    founded: 2015,
    totalTours: 500,
    rating: 4.8,
    reviewCount: 328,
    description: 'Tradiva Travel là công ty du lịch uy tín với nhiều năm kinh nghiệm tổ chức các tour du lịch chất lượng cao. Chúng tôi cam kết mang đến những trải nghiệm du lịch an toàn, thú vị và đáng nhớ cho khách hàng.',
    certifications: [
      'Hiệp hội Du lịch Việt Nam',
      'Travelife Partner',
      'ISO 9001:2015'
    ],
    contactInfo: {
      phone: '+84 28 1234 5678',
      email: 'info@tradiva.com',
      address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'
    }
  };
  
  // Use provided operator info or default
  const displayOperator = {
    ...defaultOperator,
    ...operator
  };
  
  return (
    <div className="tour-operator bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Đơn vị tổ chức tour</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column with logo and basic info */}
        <div className="md:w-1/3 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200 mb-4">
            <img 
              src={displayOperator.logo} 
              alt={`${displayOperator.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900">{displayOperator.name}</h3>
          
          <div className="mt-2 flex justify-center">
            <Rating value={displayOperator.rating} reviews={displayOperator.reviewCount} size="md" />
          </div>
          
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-center gap-1 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Thành lập năm {displayOperator.founded}</span>
            </div>
            
            <div className="flex items-center justify-center gap-1 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Đã tổ chức {displayOperator.totalTours}+ tour</span>
            </div>
          </div>
        </div>
        
        {/* Right column with details */}
        <div className="md:w-2/3 flex flex-col gap-4">
          <p className="text-gray-700">{displayOperator.description}</p>
          
          {/* Certifications */}
          <div className="mt-2">
            <h4 className="font-semibold text-gray-900 mb-2">Chứng nhận & Thành viên</h4>
            <div className="flex flex-wrap gap-2">
              {displayOperator.certifications.map((cert, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  {cert}
                </span>
              ))}
            </div>
          </div>
          
          {/* Contact information */}
          <div className="mt-2">
            <h4 className="font-semibold text-gray-900 mb-2">Thông tin liên hệ</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{displayOperator.contactInfo.phone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{displayOperator.contactInfo.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{displayOperator.contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust badges */}
      <div className="mt-6 p-4 border-t border-gray-100 flex justify-center gap-6 flex-wrap">
        <div className="flex items-center gap-2 text-gray-700">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Đảm bảo hoàn tiền</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Thanh toán an toàn</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Hỗ trợ 24/7</span>
        </div>
      </div>
    </div>
  );
};

export default TourOperator; 
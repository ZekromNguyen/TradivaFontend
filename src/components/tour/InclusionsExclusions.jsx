import React from 'react';

const InclusionsExclusions = ({ inclusions = [], exclusions = [] }) => {
  // Default values if none are provided
  const defaultInclusions = [
    'Hướng dẫn viên chuyên nghiệp, thông thạo địa phương',
    'Xe đưa đón có máy lạnh suốt hành trình',
    'Khách sạn tiêu chuẩn 3 sao (phòng đôi hoặc phòng ba)',
    'Các bữa ăn được đề cập trong lịch trình',
    'Vé vào cửa các điểm tham quan',
    'Nước uống mỗi ngày (1 chai/người/ngày)',
    'Bảo hiểm du lịch cơ bản'
  ];
  
  const defaultExclusions = [
    'Vé máy bay quốc tế và thuế sân bay',
    'Chi phí cá nhân (giặt là, điện thoại, đồ uống...)',
    'Tiền tip cho hướng dẫn viên và tài xế',
    'Các bữa ăn không được đề cập trong lịch trình',
    'Phụ phí phòng đơn',
    'Vé tham quan các điểm ngoài lịch trình',
    'Bảo hiểm du lịch cao cấp (tùy chọn)'
  ];
  
  // Use provided or default values
  const displayInclusions = inclusions.length > 0 ? inclusions : defaultInclusions;
  const displayExclusions = exclusions.length > 0 ? exclusions : defaultExclusions;
  
  return (
    <div className="inclusions-exclusions bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Chi tiết dịch vụ</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inclusions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Bao gồm</span>
          </h3>
          
          <ul className="space-y-3">
            {displayInclusions.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Exclusions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Không bao gồm</span>
          </h3>
          
          <ul className="space-y-3">
            {displayExclusions.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Additional notes */}
      <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-100">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Lưu ý quan trọng</h4>
            <p className="text-yellow-700 text-sm">Lịch trình có thể thay đổi tùy thuộc vào điều kiện thời tiết hoặc các yếu tố khách quan khác. Công ty du lịch sẽ cố gắng đảm bảo trải nghiệm tốt nhất cho khách hàng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InclusionsExclusions; 
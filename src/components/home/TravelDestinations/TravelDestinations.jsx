import React from 'react';
import '../home.css';

const TravelDestinations = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Các địa điểm du lịch</h2>
            <p className="text-gray-600 max-w-xl">
              Khám phá các địa điểm du lịch hấp dẫn và độc đáo tại Việt Nam
            </p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
            Xem tất cả
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Lựa chọn địa điểm</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <input type="checkbox" id="north" className="mr-3" />
                <label htmlFor="north">Miền Bắc</label>
              </li>
              <li className="flex items-center">
                <input type="checkbox" id="central" className="mr-3" />
                <label htmlFor="central">Miền Trung</label>
              </li>
              <li className="flex items-center">
                <input type="checkbox" id="south" className="mr-3" />
                <label htmlFor="south">Miền Nam</label>
              </li>
              <li className="flex items-center">
                <input type="checkbox" id="islands" className="mr-3" />
                <label htmlFor="islands">Đảo</label>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Lựa chọn hoạt động</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <input type="checkbox" id="adventure" className="mr-3" />
                <label htmlFor="adventure">Phiêu lưu</label>
              </li>
              <li className="flex items-center">
                <input type="checkbox" id="culture" className="mr-3" />
                <label htmlFor="culture">Văn hóa</label>
              </li>
              <li className="flex items-center">
                <input type="checkbox" id="food" className="mr-3" />
                <label htmlFor="food">Ẩm thực</label>
              </li>
              <li className="flex items-center">
                <input type="checkbox" id="relax" className="mr-3" />
                <label htmlFor="relax">Nghỉ dưỡng</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelDestinations;
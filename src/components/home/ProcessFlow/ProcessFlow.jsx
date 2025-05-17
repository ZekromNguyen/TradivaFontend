import React from 'react';
import { FaSearch, FaComments, FaCreditCard, FaUserFriends, FaStar } from 'react-icons/fa';
import './ProcessFlow.css';

const ProcessFlow = () => {
  const steps = [
    {
      icon: <FaSearch className="text-white text-2xl" />,
      title: "Đặt dịch vụ",
      description: "Du khách chọn điểm đến và loại tour mong muốn. Lựa chọn hướng dẫn viên phù hợp từ danh sách đề xuất."
    },
    {
      icon: <FaComments className="text-white text-2xl" />,
      title: "Xác nhận & tùy chỉnh",
      description: "HDV xác nhận lịch trình. Hai bên trao đổi chi tiết về tour qua chat."
    },
    {
      icon: <FaCreditCard className="text-white text-2xl" />,
      title: "Thanh toán",
      description: "Du khách thanh toán qua ứng dụng. TRADIVA giữ an toàn khoản tiền."
    },
    {
      icon: <FaUserFriends className="text-white text-2xl" />,
      title: "Thực hiện tour",
      description: "HDV gặp du khách và bắt đầu hành trình khám phá theo lịch trình."
    },
    {
      icon: <FaStar className="text-white text-2xl" />,
      title: "Hoàn tất & đánh giá",
      description: "Tour kết thúc, thanh toán được giải phóng. Du khách đánh giá trải nghiệm."
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Quy trình hoạt động TRADIVA</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Từ lúc đặt dịch vụ đến khi hoàn thành tour
        </p>
        
        <div className="relative mb-16">
          {/* Đường kẻ ngang kết nối các bước */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-blue-500 z-0"></div>
          
          <div className="flex flex-col md:flex-row justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center mb-8 md:mb-0 relative z-10 md:w-1/5">
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center text-sm px-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Lợi ích cho du khách</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Dễ dàng tìm kiếm và đặt tour với HDV chất lượng</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Thanh toán an toàn qua nền tảng</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Tùy chỉnh tour theo nhu cầu cá nhân</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Lợi ích cho hướng dẫn viên</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Quản lý lịch trình và đặt tour hiệu quả</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Xây dựng hồ sơ chuyên nghiệp với đánh giá</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Nhận thanh toán đảm bảo sau mỗi tour</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
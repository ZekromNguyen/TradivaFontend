import React from 'react';
import './UserGuide.css';

const UserGuide = () => {
  const guides = [
    {
      name: "Nguyễn Văn Nam",
      role: "Hướng dẫn viên",
      image: "/images/guide1.jpg",
      description: "Hướng dẫn viên chuyên nghiệp với 5 năm kinh nghiệm"
    },
    {
      name: "Trần Minh Anh",
      role: "Du khách",
      image: "/images/tourist1.jpg",
      description: "Đã trải nghiệm hơn 10 tour cùng TRADIVA"
    },
    {
      name: "Lê Hoàng Phương",
      role: "Đối tác địa phương",
      image: "/images/partner1.jpg",
      description: "Cung cấp dịch vụ du lịch địa phương chất lượng cao"
    },
    {
      name: "Nguyễn Thị Lan",
      role: "Nhà quản lý",
      image: "/images/manager1.jpg",
      description: "Quản lý chất lượng dịch vụ và trải nghiệm khách hàng"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Hướng dẫn viên tại chỗ</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Đội ngũ hướng dẫn viên chuyên nghiệp và thân thiện sẽ giúp bạn có trải nghiệm tuyệt vời
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="img-zoom-container">
                <img 
                  src={guide.image} 
                  alt={guide.name} 
                  className="w-full h-48 object-cover img-zoom"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{guide.name}</h3>
                <p className="text-primary font-medium text-sm mb-2">{guide.role}</p>
                <p className="text-gray-600 text-sm">{guide.description}</p>
                <button className="mt-4 text-primary font-medium text-sm hover:underline">
                  Xem thêm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserGuide;
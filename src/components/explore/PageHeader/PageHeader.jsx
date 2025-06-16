import React from "react";

const PageHeader = ({ 
  title = "Khám phá Tour Du Lịch",
  subtitle = "Tìm kiếm và lọc các tour du lịch phù hợp với bạn tại TRADIVA",
  backgroundImage
}) => {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;
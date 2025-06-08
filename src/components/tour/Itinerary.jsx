import React, { useState } from 'react';

const ItineraryDay = ({ day, index, expanded, toggleExpand }) => {
  // Create a sample itinerary day with activities
  const activities = day.activities || [
    { time: '08:00', title: 'Khởi hành', description: 'Khởi hành từ điểm tập trung' },
    { time: '10:30', title: 'Tham quan', description: 'Tham quan điểm du lịch đầu tiên' },
    { time: '12:00', title: 'Ăn trưa', description: 'Thưởng thức ẩm thực địa phương' },
    { time: '14:00', title: 'Hoạt động ngoài trời', description: 'Các hoạt động giải trí và khám phá' },
    { time: '18:00', title: 'Ăn tối', description: 'Bữa tối tại nhà hàng địa phương' },
    { time: '20:00', title: 'Nghỉ ngơi', description: 'Về khách sạn nghỉ ngơi' }
  ];
  
  // Display meal information
  const meals = {
    breakfast: day.breakfast || true,
    lunch: day.lunch || true,
    dinner: day.dinner || true
  };
  
  // Format date
  const formattedDate = day.date 
    ? new Date(day.date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  
  return (
    <div className={`itinerary-day bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 ${expanded ? 'shadow-md' : 'shadow-sm'}`}>
      {/* Day header - always visible */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
            {index + 1}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Ngày {index + 1}: {day.title}</h3>
            {formattedDate && <p className="text-gray-500 text-sm">{formattedDate}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Meal indicators */}
          <div className="hidden md:flex items-center gap-2">
            <span className={`meal-icon ${meals.breakfast ? 'text-green-600' : 'text-gray-300'}`} title="Bữa sáng">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
            </span>
            <span className={`meal-icon ${meals.lunch ? 'text-green-600' : 'text-gray-300'}`} title="Bữa trưa">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className={`meal-icon ${meals.dinner ? 'text-green-600' : 'text-gray-300'}`} title="Bữa tối">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </span>
          </div>
          
          {/* Expand/collapse arrow */}
          <button 
            className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Day content - only visible when expanded */}
      {expanded && (
        <div className="p-4 pt-0">
          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>
          
          {/* Meals on mobile */}
          <div className="md:hidden flex items-center justify-start gap-6 mb-4">
            <div className={`flex items-center gap-1 ${meals.breakfast ? 'text-green-600' : 'text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
              <span className="text-sm">Bữa sáng</span>
            </div>
            <div className={`flex items-center gap-1 ${meals.lunch ? 'text-green-600' : 'text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Bữa trưa</span>
            </div>
            <div className={`flex items-center gap-1 ${meals.dinner ? 'text-green-600' : 'text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="text-sm">Bữa tối</span>
            </div>
          </div>
          
          {/* Activities timeline */}
          <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-0 before:h-full before:w-0.5 before:bg-blue-200">
            {activities.map((activity, idx) => (
              <div key={idx} className="mb-6 relative">
                {/* Timeline dot */}
                <div className="absolute left-[-1.75rem] top-0 w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                
                {/* Activity content */}
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <span className="text-blue-600 font-semibold">{activity.time}</span>
                    <h4 className="font-bold text-gray-900">{activity.title}</h4>
                  </div>
                  <p className="text-gray-600">{activity.description}</p>
                  
                  {/* Optional image for the activity */}
                  {activity.image && (
                    <div className="mt-3">
                      <img 
                        src={activity.image} 
                        alt={activity.title} 
                        className="rounded-lg w-full h-40 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional information */}
          {day.notes && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Lưu ý</h4>
                  <p className="text-yellow-700 text-sm">{day.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Itinerary = ({ tour }) => {
  // Create sample itinerary data if tour doesn't have it
  const itineraryDays = tour.itinerary || [
    {
      title: 'Khởi hành và khám phá',
      date: tour.dateStart,
      breakfast: false,
      lunch: true,
      dinner: true,
      notes: 'Mang theo đồ bơi và kem chống nắng'
    },
    {
      title: 'Khám phá các điểm tham quan chính',
      date: tour.dateStart ? new Date(new Date(tour.dateStart).getTime() + 86400000).toISOString() : null,
      breakfast: true,
      lunch: true,
      dinner: true
    },
    {
      title: 'Tham quan và trở về',
      date: tour.dateEnd,
      breakfast: true,
      lunch: true,
      dinner: false
    }
  ];
  
  // State to track expanded days
  const [expandedDays, setExpandedDays] = useState([0]); // First day expanded by default
  
  const toggleDay = (index) => {
    setExpandedDays(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index) // Remove if already expanded
        : [...prev, index] // Add if not expanded
    );
  };
  
  return (
    <div className="itinerary-container space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Lịch trình chi tiết</h2>
        
        {/* Expand/collapse all button */}
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          onClick={() => 
            expandedDays.length === itineraryDays.length 
              ? setExpandedDays([]) 
              : setExpandedDays(itineraryDays.map((_, i) => i))
          }
        >
          {expandedDays.length === itineraryDays.length ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
              </svg>
              <span>Thu gọn tất cả</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
              </svg>
              <span>Mở rộng tất cả</span>
            </>
          )}
        </button>
      </div>
      
      {itineraryDays.map((day, index) => (
        <ItineraryDay 
          key={index}
          day={day}
          index={index}
          expanded={expandedDays.includes(index)}
          toggleExpand={() => toggleDay(index)}
        />
      ))}
    </div>
  );
};

export default Itinerary; 
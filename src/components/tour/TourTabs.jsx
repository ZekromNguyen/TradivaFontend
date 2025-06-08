import React, { useState, useEffect, useRef } from 'react';

const TourTabs = ({ activeTab, setActiveTab, tabs }) => {
  const [isSticky, setIsSticky] = useState(false);
  const tabsRef = useRef(null);
  
  // Set default tabs if none provided
  const defaultTabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'itinerary', label: 'Lịch trình' },
    { id: 'inclusions', label: 'Chi tiết dịch vụ' },
    { id: 'reviews', label: 'Đánh giá' },
    { id: 'faq', label: 'Hỏi & Đáp' }
  ];
  
  const displayTabs = tabs || defaultTabs;
  
  // Handle scroll to make tabs sticky
  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsTop = tabsRef.current.getBoundingClientRect().top;
        setIsSticky(tabsTop <= 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle tab click with smooth scroll
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    
    // Scroll to section
    const section = document.getElementById(`section-${tabId}`);
    if (section) {
      const yOffset = -80; // Adjust for header height and some padding
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div 
      ref={tabsRef}
      className={`tour-tabs bg-white border-b border-gray-200 transition-shadow ${isSticky ? 'sticky top-0 left-0 right-0 z-30 shadow-md' : ''}`}
    >
      <div className="container mx-auto">
        <div className="flex overflow-x-auto hide-scrollbar">
          {displayTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`tour-tab-button whitespace-nowrap px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourTabs; 
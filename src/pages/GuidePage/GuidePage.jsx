import React, { useState, useEffect } from 'react';
import Dashboard from '../../components/guide/Dashboard/Dashboard';
import './GuidePage.css';

// Import CSS variables first to ensure they're loaded
import '../../styles/variables.css';
import '../../styles/colors.css';
// Import sidebar overrides to fix styling issues
import '../../styles/sidebar-overrides.css';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/guide/Dashboard/Sidebar/Sidebar';
import GuideMobileNav from '../../components/guide/MobileNav/MobileNav';

const GuidePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="tour-route-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
      {isMobile && <GuideMobileNav />}
    </div>
  );
};

export default GuidePage;
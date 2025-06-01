import React from 'react';
import Dashboard from '../../components/guide/Dashboard/Dashboard';
import './GuidePage.css';

// Import CSS variables first to ensure they're loaded
import '../../styles/variables.css';
import '../../styles/colors.css';
// Import sidebar overrides to fix styling issues
import '../../styles/sidebar-overrides.css';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/guide/Dashboard/Sidebar/Sidebar';

const GuidePage = () => {
  return (
    <div className="tour-route-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
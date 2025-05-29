import React from 'react';
import Dashboard from '../../components/guide/Dashboard/Dashboard';
import './GuidePage.css';

// Import CSS variables first to ensure they're loaded
import '../../styles/variables.css';
import '../../styles/colors.css';
// Import sidebar overrides to fix styling issues
import '../../styles/sidebar-overrides.css';

const GuidePage = () => {
  return (
    <div className="guide-page-container tradiva-body">
      <Dashboard />
    </div>
  );
};

export default GuidePage;
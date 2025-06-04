import React, { useEffect } from 'react';
import HeroSection from '../../components/home/Section/HeroSection';
import ServiceFeatures from '../../components/home/ServiceFeatures/ServiceFeatures';
import PopularTours from '../../components/home/PopularTours/PopularTours';
import ProcessFlow from '../../components/home/ProcessFlow/ProcessFlow';
import TravelDestinations from '../../components/home/TravelDestinations/TravelDestinations';
import CallToAction from '../../components/home/CallToAction/CallToAction';
import './HomePage.css';

const HomePage = () => {
  // Add class to body to ensure proper header visibility
  useEffect(() => {
    document.body.classList.add('home-page-active');
    
    return () => {
      document.body.classList.remove('home-page-active');
    };
  }, []);
  
  return (
    <div className="home-page">
      <HeroSection />
      <ServiceFeatures />
      <PopularTours />
      <ProcessFlow />
      <TravelDestinations />
      <CallToAction />
    </div>
  );
};

export default HomePage;
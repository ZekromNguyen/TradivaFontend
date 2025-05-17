import React from 'react';
import HeroSection from '../../components/home/Section/HeroSection';
import ServiceFeatures from '../../components/home/ServiceFeatures/ServiceFeatures';
import UserGuide from '../../components/home/UserGuide/UserGuide';
import PopularTours from '../../components/home/PopularTours/PopularTours';
import ProcessFlow from '../../components/home/ProcessFlow/ProcessFlow';
import TravelDestinations from '../../components/home/TravelDestinations/TravelDestinations';
import CallToAction from '../../components/home/CallToAction/CallToAction';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <ServiceFeatures />
      <UserGuide />
      <PopularTours />
      <ProcessFlow />
      <TravelDestinations />
      <CallToAction />
    </div>
  );
};

export default HomePage;
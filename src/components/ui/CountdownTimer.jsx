import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // If no end time is provided, default to 24 hours from now
    const targetDate = endTime ? new Date(endTime) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const calculateTimeLeft = () => {
      const difference = targetDate - new Date();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Cleanup interval
    return () => clearInterval(timer);
  }, [endTime]);
  
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };
  
  return (
    <div className="flex items-center gap-1 font-mono">
      {timeLeft.days > 0 && (
        <>
          <div className="bg-blue-600 text-white px-1 rounded">
            {formatNumber(timeLeft.days)}
          </div>
          <span className="text-blue-700">:</span>
        </>
      )}
      <div className="bg-blue-600 text-white px-1 rounded">
        {formatNumber(timeLeft.hours)}
      </div>
      <span className="text-blue-700">:</span>
      <div className="bg-blue-600 text-white px-1 rounded">
        {formatNumber(timeLeft.minutes)}
      </div>
      <span className="text-blue-700">:</span>
      <div className="bg-blue-600 text-white px-1 rounded">
        {formatNumber(timeLeft.seconds)}
      </div>
    </div>
  );
};

export default CountdownTimer; 
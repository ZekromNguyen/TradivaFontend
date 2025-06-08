import React, { useState, useEffect } from 'react';

/**
 * CountdownTimer component with modern styling
 * 
 * @param {Object} props
 * @param {Date|string} props.endTime - The end time of the countdown (Date object or ISO string)
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {string} props.textColor - Optional custom text color
 * @param {string} props.backgroundColor - Optional custom background color
 * @param {Function} props.onComplete - Optional callback for when countdown completes
 */
const CountdownTimer = ({
  endTime,
  size = 'md',
  textColor = 'text-blue-600',
  backgroundColor = 'bg-blue-100',
  onComplete
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false
  });

  // Parse end time from string if needed
  const targetDate = typeof endTime === 'string' ? new Date(endTime) : endTime;

  // Calculate time dimensions based on size
  const getSize = () => {
    switch (size) {
      case 'sm':
        return {
          valueSize: 'text-sm font-bold',
          labelSize: 'text-[10px]',
          blockSize: 'w-8 h-8',
          gap: 'gap-1'
        };
      case 'lg':
        return {
          valueSize: 'text-xl font-bold',
          labelSize: 'text-xs',
          blockSize: 'w-14 h-14',
          gap: 'gap-3'
        };
      case 'md':
      default:
        return {
          valueSize: 'text-base font-bold',
          labelSize: 'text-xs',
          blockSize: 'w-10 h-10',
          gap: 'gap-2'
        };
    }
  };

  const { valueSize, labelSize, blockSize, gap } = getSize();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate - new Date();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
        if (onComplete) onComplete();
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds, isComplete: false });
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Set interval for updates
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clean up interval
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (timeLeft.isComplete) {
    return (
      <div className={`inline-flex items-center ${textColor}`}>
        <span className="font-medium">Đã kết thúc</span>
      </div>
    );
  }

  return (
    <div className={`countdown-timer flex items-center ${gap}`}>
      {timeLeft.days > 0 && (
        <div className="countdown-unit">
          <div className={`${blockSize} ${backgroundColor} ${textColor} flex items-center justify-center rounded-md`}>
            <span className={valueSize}>{timeLeft.days}</span>
          </div>
          <span className={`${labelSize} text-gray-500 mt-1 text-center`}>Ngày</span>
        </div>
      )}
      
      <div className="countdown-unit">
        <div className={`${blockSize} ${backgroundColor} ${textColor} flex items-center justify-center rounded-md`}>
          <span className={valueSize}>{String(timeLeft.hours).padStart(2, '0')}</span>
        </div>
        <span className={`${labelSize} text-gray-500 mt-1 text-center`}>Giờ</span>
      </div>
      
      <div className="countdown-unit">
        <div className={`${blockSize} ${backgroundColor} ${textColor} flex items-center justify-center rounded-md`}>
          <span className={valueSize}>{String(timeLeft.minutes).padStart(2, '0')}</span>
        </div>
        <span className={`${labelSize} text-gray-500 mt-1 text-center`}>Phút</span>
      </div>
      
      <div className="countdown-unit">
        <div className={`${blockSize} ${backgroundColor} ${textColor} flex items-center justify-center rounded-md`}>
          <span className={valueSize}>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
        <span className={`${labelSize} text-gray-500 mt-1 text-center`}>Giây</span>
      </div>
    </div>
  );
};

export default CountdownTimer; 
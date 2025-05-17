import React from 'react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import './CallToAction.css';


const CallToAction = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Trải nghiệm tốt hơn với ứng dụng TRADIVA</h2>
            <p className="mb-6">
              Tải ứng dụng TRADIVA để có trải nghiệm du lịch tốt nhất. Dễ dàng tìm kiếm, đặt tour và khám phá các địa điểm du lịch hấp dẫn.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
                <FaApple className="mr-2 text-xl" />
                <div className="text-left">
                  <div className="text-xs">Tải về trên</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
                <FaGooglePlay className="mr-2 text-xl" />
                <div className="text-left">
                  <div className="text-xs">Tải về trên</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/images/app-mockup.png" 
              alt="TRADIVA App" 
              className="max-w-xs float-animation"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
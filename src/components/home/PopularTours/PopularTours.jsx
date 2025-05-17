import React from 'react';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import './PopularTours.css';


const PopularTours = () => {
  const tours = [
    {
      id: 1,
      title: "Vịnh Hạ Long",
      location: "Quảng Ninh",
      image: "/images/halong.jpg",
      rating: 4.8,
      price: "2,500,000",
      currency: "VND"
    },
    {
      id: 2,
      title: "Phố cổ Hội An",
      location: "Quảng Nam",
      image: "/images/hoian.jpg",
      rating: 4.9,
      price: "1,800,000",
      currency: "VND"
    },
    {
      id: 3,
      title: "Đà Lạt",
      location: "Lâm Đồng",
      image: "/images/dalat.jpg",
      rating: 4.7,
      price: "2,200,000",
      currency: "VND"
    },
    {
      id: 4,
      title: "Phú Quốc",
      location: "Kiên Giang",
      image: "/images/phuquoc.jpg",
      rating: 4.6,
      price: "3,500,000",
      currency: "VND"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Tour phổ biến</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Khám phá những tour du lịch được yêu thích nhất tại TRADIVA
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TourCard = React.memo(({ tour }) => (
  <div 
    key={tour.id} 
    className="destination-card bg-white rounded-lg overflow-hidden shadow-md"
  >
    <div className="img-zoom-container">
      <img 
        src={tour.image} 
        alt={tour.title} 
        className="w-full h-48 object-cover img-zoom"
        loading="lazy"
      />
    </div>
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{tour.title}</h3>
        <div className="flex items-center">
          <FaStar className="text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{tour.rating}</span>
        </div>
      </div>
      <div className="flex items-center text-gray-500 text-sm mb-3">
        <FaMapMarkerAlt className="mr-1" />
        <span>{tour.location}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-bold text-primary">
          {tour.price} {tour.currency}
        </span>
        <button className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary-dark transition">
          Đặt ngay
        </button>
      </div>
    </div>
  </div>
));

export default React.memo(PopularTours);
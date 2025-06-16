import React, { useEffect, useState } from 'react';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import './PopularTours.css';
import { getPopularTours } from '../../../api/tourAPI';

const PopularTours = () => {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const popularToursData = await getPopularTours(8); // Fetch top 4 popular tours
        console.log("Fetched popular tours:", popularToursData);

        // Fetch detailed information for each popular tour
        const detailedTours = await Promise.all(
          popularToursData.map(async (tour) => {
            try {
              const response = await fetch(`https://tradivabe.felixtien.dev/api/Tour/${tour.tourId}`);
              if (!response.ok) throw new Error(`Failed to fetch tour ${tour.tourId}`);
              const tourDetail = await response.json();
              return {
                id: tourDetail.id,
                title: tourDetail.title,
                location: tourDetail.tourLocations?.[0]?.location?.city || 'Vietnam',
                image: tourDetail.files && tourDetail.files.length > 0
                  ? tourDetail.files[0].filePath
                  : '/images/fallback.jpg',
                rating: tourDetail.ratings && tourDetail.ratings.length > 0
                  ? tourDetail.ratings.reduce((sum, r) => sum + r.ratingStar, 0) / tourDetail.ratings.length
                  : 0,
                price: tourDetail.pricePerPerson?.toLocaleString('vi-VN') || '0',
                currency: 'VND',
                popularity: {
                  matchCount: tour.matchCount,
                  totalGuests: tour.totalGuests
                }
              };
            } catch (err) {
              console.error(`Error fetching details for tour ${tour.tourId}:`, err);
              return null;
            }
          })
        );

        setTours(detailedTours.filter(tour => tour !== null));
      } catch (error) {
        console.error("Error fetching popular tours:", error);
        setError("Failed to load popular tours. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (isLoading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  if (tours.length === 0) {
    return <div className="text-center py-16">No tours available.</div>;
  }

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
  <div className="destination-card bg-white rounded-lg overflow-hidden shadow-md">
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
          <span className="text-sm font-medium">{tour.rating.toFixed(1)}</span>
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
        <button
          className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary-dark transition"
          aria-label={`Book tour to ${tour.title}`}
          onClick={() => window.location.href = `/tour/${tour.id}`}
        >
          Đặt ngay
        </button>
      </div>
      {tour.popularity && (
        <div className="mt-2 text-xs text-gray-500">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            {tour.popularity.totalGuests} khách đã đặt
          </span>
        </div>
      )}
    </div>
  </div>
));

export default React.memo(PopularTours);
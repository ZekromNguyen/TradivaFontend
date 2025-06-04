import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ImageCarousel from "../../components/ui/ImageCarousel";
import TourGallery from "../../components/ui/TourGallery";
import "./TourDetailPage.css";
import TourInfo from "../../components/tour/TourInfo/TourInfo";
import LocationList from "../../components/tour/LocationList/LocationList";
import LocationDetail from "../../components/tour/LocationDetail/LocationDetail";
import CountdownTimer from "../../components/ui/CountdownTimer";
import MediaHero from "../../components/ui/MediaHero";
import TourBadges from "../../components/ui/TourBadges";
import Rating from "../../components/ui/Rating";
import LocationBadge from "../../components/ui/LocationBadge";
import PriceBadge from "../../components/ui/PriceBadge";
import MediaGallery from "../../components/ui/MediaGallery";

// Define the background image constant
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80";

// Hero Section Component with improved carousel
const TourHero = ({ tour }) => {
  // Get images from tour.files array 
  const allImages = tour.files
    ?.filter(file => file && file.filePath && (file.fileType === 'jpg' || file.fileType === 'jpeg' || file.fileType === 'png'))
    .map(file => file.filePath) || [];
  
  // If no images available, use a placeholder
  if (allImages.length === 0) {
    allImages.push("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80");
  }
  
  return (
    <div className="relative h-[70vh] w-full">
      {/* Premium image carousel */}
      <ImageCarousel 
        images={allImages}
        transitionEffect="crossfade"
        autoplaySpeed={5000}
        showThumbnails={true}
        lazyLoad="progressive"
      />
      
      {/* Overlay elements for critical information */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent pt-32 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-yellow-500 text-black px-2 py-1 rounded-md text-sm font-bold flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg> 4.9 (128)
            </span>
            <span className="bg-blue-500/90 text-white px-2 py-1 rounded-md text-sm">3 ngày</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">{tour.title}</h1>
        </div>
      </div>
    </div>
  );
};

// BookingPanel Component (replacing PriceCard)
const BookingPanel = ({ tour, guestCount, onGuestChange, onBookTour, isLoading }) => {
  const totalPrice = (tour.pricePerPerson || 0) * guestCount;
  
  return (
    <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium">Giá tour</span>
          <div className="text-2xl font-bold text-blue-700">{tour.pricePerPerson?.toLocaleString("vi-VN")} VND</div>
        </div>
        
        {/* Guest selector with improved UX */}
        <div className="mb-4">
          <label className="text-gray-700 font-medium mb-2 block">Số khách</label>
          <div className="flex items-center border rounded-lg bg-gray-50 p-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                onGuestChange({ target: { value: Math.max(1, guestCount - 1) } });
              }}
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition"
            >
              −
            </button>
            <div className="flex-1 text-center font-semibold">{guestCount}</div>
            <button
              onClick={(e) => {
                e.preventDefault();
                onGuestChange({ target: { value: Math.min(tour.numberOfGuests || 99, guestCount + 1) } });
              }}
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Date display */}
        <div className="p-3 bg-blue-50 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-blue-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
            </svg>
            <span className="font-medium">Từ {tour.dateStart ? new Date(tour.dateStart).toLocaleDateString("vi-VN") : "Chưa cập nhật"} đến {tour.dateEnd ? new Date(tour.dateEnd).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</span>
          </div>
        </div>
        
        {/* Offer notification */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
          <div className="flex items-center text-blue-700 mb-2">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Ưu đãi có hạn</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Giảm 15% khi đặt trong:</span>
            <CountdownTimer endTime={new Date(Date.now() + 24 * 60 * 60 * 1000)} />
          </div>
        </div>
        
        {/* Social proof */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>10 người đã đặt tour này trong tuần qua</span>
        </div>
      </div>
      
      {/* Call to action */}
      <div className="p-6">
        <div className="flex justify-between text-sm mb-4">
          <span>Tổng cộng</span>
          <span className="font-bold text-lg">{totalPrice.toLocaleString("vi-VN")} VND</span>
        </div>
        <button
          onClick={onBookTour}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-xl transition relative overflow-hidden"
        >
          {isLoading ? (
            <>
              <span className="opacity-0">Đặt tour ngay</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </>
          ) : (
            <span>Đặt tour ngay</span>
          )}
        </button>
        <div className="text-xs text-center mt-4 text-gray-500">Miễn phí hủy trong vòng 24 giờ</div>
      </div>
    </div>
  );
};

// Tour Info Component
const TourOverview = ({ tour }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Tổng quan tour</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Ngày khởi hành</div>
              <div className="text-gray-600">
                {tour.dateStart
                  ? new Date(tour.dateStart).toLocaleString("vi-VN")
                  : "Chưa cập nhật"}
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Ngày kết thúc</div>
              <div className="text-gray-600">
                {tour.dateEnd
                  ? new Date(tour.dateEnd).toLocaleString("vi-VN")
                  : "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Số lượng khách</div>
              <div className="text-gray-600">Tối đa {tour.numberOfGuests || "?"} khách</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Điểm đến</div>
              <div className="text-gray-600">{tour.tourLocations?.length || 0} địa điểm</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Mô tả tour</h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          {tour.description || "Chưa có mô tả chi tiết cho tour này."}
        </p>
      </div>
    </div>
  );
};

// Sample placeholder tab components
const ItineraryTab = ({ tour }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-bold mb-4">Lịch trình chi tiết</h3>
    <p className="text-gray-600">Lịch trình đang được cập nhật.</p>
  </div>
);

const LocationsTab = ({ tour, selectedLocation, onSelectLocation }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-bold mb-4">Địa điểm trong tour</h3>
    <LocationList 
      tourLocations={tour.tourLocations}
      selectedLocation={selectedLocation}
      onSelect={onSelectLocation}
    />
    <div className="mt-6">
      <LocationDetail location={selectedLocation} />
    </div>
  </div>
);

const ReviewsTab = ({ reviews = [] }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-bold mb-4">Đánh giá từ khách hàng</h3>
    {reviews.length > 0 ? (
      reviews.map((review, idx) => (
        <div key={idx} className="border-b pb-4 mb-4 last:border-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{review.userName}</span>
            <span className="text-yellow-500">★★★★★</span>
          </div>
          <p className="text-gray-700">{review.content}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-600">Chưa có đánh giá nào.</p>
    )}
  </div>
);

const FAQTab = ({ faqs = [] }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-bold mb-4">Câu hỏi thường gặp</h3>
    {faqs.length > 0 ? (
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b pb-4">
            <h4 className="font-medium text-lg mb-2">{faq.question}</h4>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">Chưa có câu hỏi nào.</p>
    )}
  </div>
);

// MobileBookingSheet Component for mobile devices
const MobileBookingSheet = ({ tour, onClose, onBook }) => {
  const [guestCount, setGuestCount] = useState(1);
  const totalPrice = (tour.pricePerPerson || 0) * guestCount;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center">
      <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-xl p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Đặt tour</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="text-lg font-bold">{tour.title}</div>
          <div className="text-gray-500">{tour.dateStart ? new Date(tour.dateStart).toLocaleDateString() : "Chưa có ngày"}</div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600">Giá mỗi người</span>
          <span className="font-medium">{tour.pricePerPerson?.toLocaleString("vi-VN")} VND</span>
        </div>

        <div className="py-3 border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Số khách</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                −
              </button>
              <span className="w-8 text-center">{guestCount}</span>
              <button
                onClick={() => setGuestCount(Math.min(tour.numberOfGuests || 10, guestCount + 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500">Tối đa {tour.numberOfGuests || 10} khách</div>
        </div>

        <div className="py-4 border-b border-gray-100">
          <div className="flex justify-between text-lg">
            <span className="font-medium">Tổng cộng</span>
            <span className="font-bold text-blue-700">{totalPrice.toLocaleString("vi-VN")} VND</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onBook}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Xác nhận đặt tour
          </button>
          <div className="text-center text-xs text-gray-500 mt-2">
            Bạn sẽ không bị trừ tiền cho đến khi xác nhận
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Tổng quan');
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  // Sample data for the offer
  const [offer] = useState({
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    discount: '15%'
  });
  // Sample reviews data
  const [reviews] = useState([
    { userName: 'Anh Minh', content: 'Tour rất tuyệt vời, hướng dẫn viên nhiệt tình và chuyên nghiệp. Các địa điểm đều đẹp và ý nghĩa.' },
    { userName: 'Chị Lan', content: 'Gia đình tôi rất hài lòng với chuyến đi. Mọi thứ được sắp xếp chu đáo và cẩn thận.' }
  ]);
  // Sample FAQs data
  const [faqs] = useState([
    { question: 'Tôi có thể hủy tour không?', answer: 'Bạn có thể hủy tour trong vòng 24 giờ sau khi đặt mà không mất phí.' },
    { question: 'Tour có bao gồm bữa ăn không?', answer: 'Các bữa ăn chính đều được bao gồm trong giá tour.' },
    { question: 'Tôi nên mang theo những gì?', answer: 'Bạn nên mang theo quần áo phù hợp với thời tiết, kem chống nắng, và các vật dụng cá nhân.' }
  ]);

  useEffect(() => {
    // Add class to body to ensure proper header visibility
    document.body.classList.add('tour-page-active');
    
    if (!id) return;
    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://tradivabe.felixtien.dev/api/Tour/${id}`
        );
        if (!res.ok) throw new Error("Không thể tải dữ liệu tour");
        const data = await res.json();
        
        // Validate and log the tour data structure
        console.log("Raw tour data:", data);
        
        // Make sure the files array is properly structured
        if (!data.files) {
          data.files = [];
        }
        
        // Set the tour data
        setTour(data);
        
        // Set first location if available
        setSelectedLocation(data.tourLocations?.[0]?.location || null);
      } catch (err) {
        console.error("Error fetching tour:", err);
        setError(err.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
    
    return () => {
      // Clean up body class when component unmounts
      document.body.classList.remove('tour-page-active');
    };
  }, [id]);

  const handleGuestChange = (e) => {
    const value = Math.max(1, Math.min(Number(e.target.value), tour?.numberOfGuests || 99));
    setGuestCount(value);
  };

  const { user, isLoggedIn } = useAuth();

  const handleBookTour = async () => {
    if(!isLoggedIn) {
      alert("Bạn cần đăng nhập để đặt tour.");
      navigate("/login");
      return;
    }
    
    if (!tour) return;
    
    setBookingLoading(true);
    try {
      const amount = (tour.pricePerPerson || 0) * guestCount;
      
      // Lấy accessToken từ localStorage hoặc context
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }
      
      // Lấy thông tin user từ context
      const buyerName = user?.username || "";
      const buyerEmail = user?.email || "";
      const buyerPhone = user?.phone || "";
      
      const res = await fetch("https://tradivabe.felixtien.dev/api/Payment/createPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": accessToken ? `Bearer ${accessToken}` : undefined,
          "accept": "*/*"
        },
        body: JSON.stringify({
          tourId: tour.id,
          tourName: tour.title,
          method: "online",
          amount,
          orderCode: 0,
          description: `Tour ${tour.title}`.substring(0, 25),
          buyerName,
          buyerEmail,
          buyerPhone,
          buyerAddress: "",
          numberGuest: guestCount,
          cancelUrl: window.location.href,
          returnUrl: window.location.href,
        }),
      });
      
      // Kiểm tra response status trước khi parse JSON
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);
        
        if (res.status === 401) {
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          try {
            // Thử parse lỗi dưới dạng JSON
            const errorJson = JSON.parse(errorText);
            if (errorJson.error) {
              throw new Error(errorJson.error);
            }
          } catch (e) {
            // Nếu có lỗi parse hoặc không có trường error
            if (e.message !== "Unexpected token '<'") {
              throw e;
            }
          }
          throw new Error("Không thể tạo thanh toán. Vui lòng thử lại sau.");
        }
      }
      
      // Parse JSON chỉ khi response OK
      const data = await res.json();
      
      if (data?.paymentResult?.checkoutUrl) {
        window.location.href = data.paymentResult.checkoutUrl;
      } else {
        console.error("Missing checkout URL in response:", data);
        alert("Không tạo được thanh toán. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(`Có lỗi khi đặt tour: ${err.message || "Không xác định"}`);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!tour) return null;

  // Get images from tour.files array
  const allImages = tour.files
    ?.filter(file => file && file.filePath && (file.fileType === 'jpg' || file.fileType === 'jpeg' || file.fileType === 'png'))
    .map(file => file.filePath) || [];
  
  // If no images available, use a placeholder
  if (allImages.length === 0) {
    allImages.push("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80");
  }
  
  // Debug log to see available images
  console.log("Tour data:", tour);
  console.log("Available images:", allImages);

  return (
    <section className="tour-detail-page relative pt-24">
      {/* Hero with immersive media - adjusted for header space */}
      <div className="relative h-[70vh] w-full overflow-hidden rounded-0 mb-8 -mt-24">
        <MediaHero 
          media={allImages} 
          type="dynamic" 
          effect="parallax"
        />
        
        {/* Overlay elements for critical information */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent pt-32 pb-8 px-6">
          <div className="container mx-auto">
            <TourBadges 
              categories={[]} 
              duration={tour.dateStart && tour.dateEnd ? 
                Math.ceil((new Date(tour.dateEnd) - new Date(tour.dateStart)) / (1000 * 60 * 60 * 24)) : 3
              } 
            />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">{tour.title}</h1>
            
            <div className="flex items-center gap-6 flex-wrap text-white/90">
              <Rating value={4.9} reviews={128} />
              <LocationBadge location={tour.tourLocations?.[0]?.location?.city || "Vietnam"} />
              <PriceBadge price={tour.pricePerPerson} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs - Using CSS class for proper stacking */}
      <div className="tour-tabs bg-white border-b border-gray-200 shadow-sm mb-6">
        <div className="container mx-auto">
          <nav className="flex overflow-x-auto hide-scrollbar">
            {['Tổng quan', 'Lịch trình', 'Địa điểm', 'Đánh giá', 'FAQ'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-4 border-b-2 whitespace-nowrap transition ${
                  activeTab === tab 
                    ? 'border-blue-600 text-blue-700 font-medium' 
                    : 'border-transparent hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="tour-content container mx-auto px-4 bg-white">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content area - 70% */}
          <div className="lg:w-[70%]">
            {activeTab === 'Tổng quan' && <TourOverview tour={tour} />}
            {activeTab === 'Lịch trình' && <ItineraryTab tour={tour} />}
            {activeTab === 'Địa điểm' && <LocationsTab tour={tour} selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />}
            {activeTab === 'Đánh giá' && <ReviewsTab reviews={reviews} />}
            {activeTab === 'FAQ' && <FAQTab faqs={faqs} />}
            
            {/* Media Gallery */}
            {activeTab === 'Tổng quan' && (
              <MediaGallery 
                images={allImages}
                videos={[]}
                panoramas={[]}
                layout="mosaic"
                features={{
                  lightbox: true,
                  zoom: true,
                  categories: true
                }}
              />
            )}
          </div>
          
          {/* Booking panel - 30% */}
          <div className="lg:w-[30%]">
            <BookingPanel 
              tour={tour}
              guestCount={guestCount}
              onGuestChange={handleGuestChange}
              onBookTour={handleBookTour}
              isLoading={bookingLoading}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile bottom action bar - adjusted z-index */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 lg:hidden z-40">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-blue-700">
              {tour.pricePerPerson?.toLocaleString("vi-VN")} VND
            </div>
            <div className="text-sm text-gray-500">/người</div>
          </div>
          <button 
            onClick={() => setShowMobileBooking(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Đặt tour ngay
          </button>
        </div>
      </div>
      
      {/* Mobile booking sheet - adjusted z-index */}
      {showMobileBooking && (
        <MobileBookingSheet 
          tour={tour}
          onClose={() => setShowMobileBooking(false)}
          onBook={handleBookTour}
        />
      )}
    </section>
  );
};

export default TourDetailPage;
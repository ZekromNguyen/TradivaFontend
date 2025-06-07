import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TourInfo from "../../components/tour/TourInfo/TourInfo";
import LocationList from "../../components/tour/LocationList/LocationList";
import LocationDetail from "../../components/tour/LocationDetail/LocationDetail";
import { useAuth } from "../../context/AuthContext";
import "./TourDetailPage.css";

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80";

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://tradivabe.felixtien.dev/api/Tour/${id}`
        );
        if (!res.ok) throw new Error("Không thể tải dữ liệu tour");
        const data = await res.json();
        setTour(data);
        setSelectedLocation(data.tourLocations?.[0]?.location || null);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleGuestChange = (e) => {
    const value = Math.max(1, Math.min(Number(e.target.value), tour?.numberOfGuests || 99));
    setGuestCount(value);
  };

  // Hàm đặt tour và chuyển sang trang payment
  const { user, isLoggedIn } = useAuth();

  const handleBookTour = async () => {
    if (!isLoggedIn) {
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
          description: `Thanh toán tour ${tour.title}`,
          buyerName,
          buyerEmail,
          buyerPhone,
          buyerAddress: "",
          numberGuest: guestCount,
          cancelUrl: window.location.href,
          returnUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (data?.paymentResult?.checkoutUrl) {
        window.location.href = data.paymentResult.checkoutUrl;
      } else {
        alert("Không tạo được thanh toán. Vui lòng thử lại.");
      }
    } catch (err) {
      alert("Có lỗi khi đặt tour: " + err.message);
    } finally {
      setBookingLoading(false);
    }
  };


  if (loading) return <div className="text-center py-16">Đang tải...</div>;
  if (error)
    return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!tour) return null;

  return (
    <section
      className="py-16 min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 136, 229, 0.18), rgba(255,255,255,0.96)), url('${BACKGROUND_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-10 border border-blue-100">
          <h2 className="text-4xl font-extrabold mb-6 text-blue-700 text-center drop-shadow">
            {tour.title}
          </h2>
          {/* Thông tin tổng quan tour */}
          <TourInfo tour={tour} guestCount={guestCount} handleGuestChange={handleGuestChange} />
          {/* Layout 2 cột: trái là danh sách, phải là chi tiết */}
          <div className="flex flex-col md:flex-row gap-8">
            <LocationList
              tourLocations={tour.tourLocations}
              selectedLocation={selectedLocation}
              onSelect={setSelectedLocation}
            />
            <div className="md:w-2/3 w-full">
              <LocationDetail location={selectedLocation} />
            </div>
          </div>
          {/* Mô tả tour */}
          <div className="mt-8">
            <h4 className="font-semibold text-xl mb-2 text-blue-600">
              Mô tả tour
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {tour.description || "Chưa có mô tả."}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
            onClick={handleBookTour}
            disabled={bookingLoading}
          >
            {bookingLoading ? "Đang xử lý..." : "Đặt tour ngay"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TourDetailPage;
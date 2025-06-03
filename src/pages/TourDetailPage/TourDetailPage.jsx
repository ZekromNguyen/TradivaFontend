import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Alert, Button, Spinner, Form } from "react-bootstrap";
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
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentStatus = query.get("payment");
    if (paymentStatus === "success") {
      setBookingSuccess(true);
    } else if (paymentStatus === "cancel") {
      setBookingError("Thanh toán đã bị hủy. Vui lòng thử lại.");
    }
  }, [location.search]);

  useEffect(() => {
    if (!id) {
      setError("Không tìm thấy ID tour");
      setLoading(false);
      return;
    }
    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://tradivabe.felixtien.dev/api/Tour/${id}`, {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Không thể tải dữ liệu tour (Status: ${res.status})`);
        }
        const data = await res.json();
        console.log("Fetched Tour:", data); // Debug log
        setTour({
          ...data,
          numberOfGuests: data.numberOfPeople || data.numberOfGuests || 10,
        });
        setSelectedLocation(data.tourLocations?.[0]?.location || null);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu tour");
        console.error("Fetch Tour Error:", err);
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

  const handleBookTour = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/tour/${id}` } });
      return;
    }
    if (!tour) {
      setBookingError("Không có dữ liệu tour để đặt");
      return;
    }
    setBookingLoading(true);
    setBookingError("");
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Vui lòng đăng nhập lại để tiếp tục.");
      }
      const amount = (tour.pricePerPerson || 0) * guestCount;
      if (amount <= 0) {
        throw new Error("Số tiền thanh toán không hợp lệ.");
      }
      const buyerName = user?.username || "Khách";
      const buyerEmail = user?.email;
      const buyerPhone = user?.phone || "";
      if (!buyerEmail) {
        throw new Error("Email là bắt buộc để đặt tour.");
      }
      const payload = {
        tourId: tour.id,
        tourName: tour.title,
        method: "online",
        amount,
        orderCode: Date.now(), // Unique order code
        description: `Thanh toán tour ${tour.title}`,
        buyerName,
        buyerEmail,
        buyerPhone,
        buyerAddress: user?.address || "",
        numberGuest: guestCount,
        cancelUrl: `${window.location.origin}/tour/${tour.id}?payment=cancel`,
        returnUrl: `${window.location.origin}/tour/${tour.id}?payment=success`,
      };
      console.log("Payment Payload:", payload); // Debug log

      const res = await fetch("https://tradivabe.felixtien.dev/api/Payment/createPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          accept: "*/*",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Payment API Response:", { status: res.status, data }); // Debug log
      if (!res.ok) {
        throw new Error(data.message || `Không thể tạo thanh toán (Status: ${res.status})`);
      }
      if (data?.paymentResult?.checkoutUrl) {
        window.location.href = data.paymentResult.checkoutUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán từ server");
      }
    } catch (err) {
      setBookingError(`Có lỗi khi đặt tour: ${err.message}`);
      console.error("Book Tour Error:", err);
      if (err.message.includes("đăng nhập")) {
        navigate("/login", { state: { from: `/tour/${id}` } });
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const handleTrackTour = () => {
    navigate(`/payment/${tour.id}`, { state: { tour, isPaid: bookingSuccess } });
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <Spinner animation="border" />
        <span className="ms-2">Đang tải...</span>
      </div>
    );
  }
  if (error) {
    return <Alert variant="danger" className="text-center py-16">{error}</Alert>;
  }
  if (!tour) {
    return null;
  }

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
        {bookingError && (
          <Alert variant="danger" onClose={() => setBookingError("")} dismissible>
            {bookingError}
          </Alert>
        )}
        {bookingSuccess && (
          <Alert variant="success" onClose={() => setBookingSuccess(false)} dismissible>
            Thanh toán thành công! Bạn có thể theo dõi hành trình của mình.
          </Alert>
        )}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-10 border border-blue-100">
          <h2 className="text-4xl font-extrabold mb-6 text-blue-700 text-center drop-shadow">
            {tour.title}
          </h2>
          <TourInfo tour={tour} guestCount={guestCount} handleGuestChange={handleGuestChange} />
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
          <div className="mt-8">
            <h4 className="font-semibold text-xl mb-2 text-blue-600">Mô tả tour</h4>
            <p className="text-gray-700 leading-relaxed">
              {tour.description || "Chưa có mô tả."}
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button
            variant="primary"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
            onClick={handleBookTour}
            disabled={bookingLoading || bookingSuccess}
          >
            {bookingLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              "Đặt tour ngay"
            )}
          </Button>
          {bookingSuccess && (
            <Button
              variant="success"
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-800 transition-all duration-200"
              onClick={handleTrackTour}
            >
              Theo dõi hành trình
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TourDetailPage;
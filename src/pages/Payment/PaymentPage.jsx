import React, { useState } from 'react';
import './PaymentPage.css';

const mockTour = {
  id: 1,
  title: 'Tour Đà Nẵng 3N2Đ',
  image: '/images/fallback.jpg',
  rating: 4.5,
  price: 3500000,
  currency: 'VND',
  location: 'Đà Nẵng',
};

const PaymentPage = () => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isPaid, setIsPaid] = useState(false);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    // Xử lý thanh toán ở đây (gọi API, v.v.)
    setIsPaid(true);
  };

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-8">Thanh toán Tour</h2>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row gap-6">
          <img
            src={mockTour.image}
            alt={mockTour.title}
            className="w-full md:w-48 h-32 object-cover rounded-md"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-xl mb-2">{mockTour.title}</h3>
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <span className="mr-2">Địa điểm:</span>
              <span>{mockTour.location}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <span className="mr-2">Đánh giá:</span>
              <span>{mockTour.rating} ★</span>
            </div>
            <div className="font-bold text-primary text-lg mt-2">
              {mockTour.price.toLocaleString('vi-VN')} {mockTour.currency}
            </div>
          </div>
        </div>

        {isPaid ? (
          <div className="text-center text-green-600 font-semibold text-xl py-12">
            Thanh toán thành công! Cảm ơn bạn đã đặt tour tại TRADIVA.
          </div>
        ) : (
          <form onSubmit={handlePayment} className="bg-gray-50 rounded-lg p-6 shadow">
            <h4 className="font-semibold text-lg mb-4">Thông tin khách hàng</h4>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Họ và tên</label>
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập họ tên"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập email"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <h4 className="font-semibold text-lg mb-4">Phương thức thanh toán</h4>
            <div className="mb-6">
              <label className="inline-flex items-center mr-6">
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={() => setPaymentMethod('credit')}
                  className="mr-2"
                />
                Thẻ tín dụng/Ghi nợ
              </label>
              <label className="inline-flex items-center mr-6">
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === 'momo'}
                  onChange={() => setPaymentMethod('momo')}
                  className="mr-2"
                />
                Ví MoMo
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                  className="mr-2"
                />
                Chuyển khoản ngân hàng
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-md font-semibold text-lg hover:bg-primary-dark transition"
            >
              Xác nhận thanh toán
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default PaymentPage;
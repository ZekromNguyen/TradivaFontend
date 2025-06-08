import React from 'react';
import Rating from '../../components/ui/Rating';

const TourReviews = ({ reviews = [], averageRating = 0 }) => {
  // Sample reviews if none are provided
  const sampleReviews = [
    {
      id: 1,
      authorName: 'Nguyễn Văn A',
      rating: 5,
      title: 'Trải nghiệm tuyệt vời, đáng để thử!',
      content: 'Tour rất tuyệt vời với nhiều hoạt động thú vị. Hướng dẫn viên nhiệt tình, thân thiện và am hiểu về các địa điểm tham quan. Thức ăn ngon và phong phú. Tôi sẽ giới thiệu tour này cho bạn bè của mình.',
      date: '2023-06-15',
    },
    {
      id: 2,
      authorName: 'Trần Thị B',
      rating: 4,
      content: 'Tour rất tốt, tuy nhiên thời gian ở một số điểm tham quan hơi ngắn. Hướng dẫn viên nhiệt tình, chu đáo. Khách sạn sạch sẽ, thoải mái.',
      date: '2023-05-20',
    }
  ];
  
  const displayReviews = reviews.length > 0 ? reviews : sampleReviews;
  
  return (
    <div className="tour-reviews bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá từ khách hàng</h2>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
        <div className="flex flex-col">
          <Rating value={averageRating} size="md" />
          <span className="text-sm text-gray-500 mt-1">{reviews.length} đánh giá</span>
        </div>
      </div>
      
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>Viết đánh giá</span>
      </button>
      
      {/* Reviews list */}
      <div className="space-y-6">
        {displayReviews.map(review => (
          <div key={review.id} className="review-card bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            {/* Review header with user info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 border border-blue-200">
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-lg">
                  {review.authorName?.charAt(0) || '?'}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{review.authorName || 'Khách du lịch'}</h4>
                <div className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Rating value={review.rating} size="md" />
              </div>
            </div>
            
            {/* Review content */}
            {review.title && (
              <h5 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h5>
            )}
            
            <p className="text-gray-700">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourReviews;

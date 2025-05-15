import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header có thể được thêm vào đây */}
      <main>
        <Outlet />
      </main>
      {/* Footer có thể được thêm vào đây */}
    </div>
  );
};

export default MainLayout;
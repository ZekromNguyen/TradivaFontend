import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../../context/AuthContext";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('/guide');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  const navigate = useNavigate();

  const menuItems = [
    { path: '/guide', icon: '🏠', label: 'Tổng quan', badge: null },
    { path: '/guide/tours', icon: '🎯', label: 'Quản lý Tour', badge: '12' },
    { path: '/guide/support', icon: '🤖', label: 'AI hỗ trợ', badge: null },
    { path: '/guide/chat', icon: '💬', label: 'Chat với khách', badge: '3' },
    { path: '/guide/payments', icon: '💳', label: 'Thanh toán', badge: null },
    { path: '/guide/feedback', icon: '⭐', label: 'Đánh giá', badge: null },
  ];

  const handleItemClick = (path) => {
    setActiveItem(path);
    navigate(path); // chuyển hướng tới route
  };

  const handleLogout = () => {
    logout(); // gọi hàm logout từ context hoặc hook
    navigate('/'); // quay về trang chủ sau khi logout
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-72'} h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 shadow-lg transition-all duration-300 ease-in-out`}>

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">TRADIVA</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-400 text-sm">
              {isCollapsed ? '→' : '←'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Menu chính
            </p>
          )}

          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-xl text-left transition-all duration-200 group relative ${activeItem === item.path
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>

                  {!isCollapsed && (
                    <>
                      <span className="ml-3 font-medium text-sm flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${activeItem === item.path
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {activeItem === item.path && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-r-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="mt-8 px-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Hành động nhanh
            </p>
            <div className="space-y-2">
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="mr-3">📊</span>
                Thống kê
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="mr-3">⚙️</span>
                Cài đặt
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        {/* User Profile */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-4 p-3 bg-gray-50 rounded-xl`}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">TG</span>
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Tour Guide
              </p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-xs text-gray-500">Đang hoạt động</span>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'gap-3 px-4'} py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 group`}
        >
          <span className="text-lg">🚪</span>
          {!isCollapsed && (
            <span className="text-sm font-medium">Đăng xuất</span>
          )}
        </button>
      </div>
    </div>
  );
}

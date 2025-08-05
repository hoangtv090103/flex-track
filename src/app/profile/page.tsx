'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useUser, useClerk } from '@clerk/nextjs';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Download, 
  Upload, 
  Trash2,
  LogOut,
  Camera,
  Edit3,
  Save
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    achievementAlerts: true,
    weeklyReports: false,
  });

  const handleSignOut = () => {
    signOut();
  };

  const exportData = () => {
    // Export workout data logic
    alert('Tính năng xuất dữ liệu sẽ được phát triển trong phiên bản tiếp theo');
  };

  const importData = () => {
    // Import workout data logic
    alert('Tính năng nhập dữ liệu sẽ được phát triển trong phiên bản tiếp theo');
  };

  const clearAllData = () => {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.')) {
      localStorage.clear();
      alert('Đã xóa tất cả dữ liệu cục bộ');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem trang cá nhân</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <User className="h-6 w-6 text-blue-600" />
            <span>Cá nhân</span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                {user.imageUrl ? (
                  <Image 
                    src={user.imageUrl} 
                    alt="Profile" 
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-blue-600" />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Camera className="h-3 w-3 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-600">
                {user.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Thành viên từ {new Date(user.createdAt!).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
          
          <button className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
            <Edit3 className="h-4 w-4" />
            <span>Chỉnh sửa thông tin</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Thống kê nhanh</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-blue-600">0</div>
              <div className="text-xs text-gray-600">Buổi tập</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">0</div>
              <div className="text-xs text-gray-600">Streak</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">0</div>
              <div className="text-xs text-gray-600">Giờ tập</div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Cài đặt</span>
            </div>
            <div className={`transform transition-transform ${showSettings ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>

          {showSettings && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Notifications */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Thông báo</span>
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Nhắc nhở tập luyện</span>
                    <input
                      type="checkbox"
                      checked={notifications.workoutReminders}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        workoutReminders: e.target.checked
                      }))}
                      className="rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Thông báo thành tích</span>
                    <input
                      type="checkbox"
                      checked={notifications.achievementAlerts}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        achievementAlerts: e.target.checked
                      }))}
                      className="rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Báo cáo hàng tuần</span>
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReports}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        weeklyReports: e.target.checked
                      }))}
                      className="rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Data Management */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Quản lý dữ liệu</span>
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={exportData}
                    className="w-full p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Xuất dữ liệu</span>
                  </button>
                  <button
                    onClick={importData}
                    className="w-full p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Nhập dữ liệu</span>
                  </button>
                  <button
                    onClick={clearAllData}
                    className="w-full p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Xóa tất cả dữ liệu</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Về FlexTrack</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Phiên bản</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Cập nhật lần cuối</span>
              <span>Hôm nay</span>
            </div>
            <div className="flex justify-between">
              <span>Kho dữ liệu</span>
              <span>Supabase + LocalStorage</span>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tài khoản</h3>
          <div className="space-y-2">
            <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-left">
              Thay đổi mật khẩu
            </button>
            <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-left">
              Quản lý thiết bị
            </button>
            <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-left">
              Quyền riêng tư
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <button
            onClick={handleSignOut}
            className="w-full p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 py-4">
          <p>FlexTrack - Fitness Tracker</p>
          <p>Made with ❤️ for fitness enthusiasts</p>
        </div>
      </div>
    </div>
  );
}

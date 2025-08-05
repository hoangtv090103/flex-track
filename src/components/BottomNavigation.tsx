import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Dumbbell,
  BarChart3,
  Calendar,
  User
} from 'lucide-react';

const navItems = [
  {
    name: 'Trang chủ',
    href: '/',
    icon: Home,
  },
  {
    name: 'Tập luyện',
    href: '/workout/new',
    icon: Dumbbell,
  },
  {
    name: 'Quản lý',
    href: '/workouts',
    icon: Calendar,
  },
  {
    name: 'Thống kê',
    href: '/stats',
    icon: BarChart3,
  },
  {
    name: 'Cá nhân',
    href: '/profile',
    icon: User,
  },
];

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';

interface HeaderProps {
  unreadCount?: number;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ unreadCount = 0, onNotificationClick }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VulnWatchdog</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              onClick={onNotificationClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* User menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/profile"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/settings"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-200 my-1"></div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

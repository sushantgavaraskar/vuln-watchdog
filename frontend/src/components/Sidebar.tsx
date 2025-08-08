'use client';

import { useAuth } from './AuthContext';
import { isAdmin } from '@/utils/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FolderOpen, 
  Shield, 
  FileText, 
  Users, 
  Activity, 
  BarChart3,
  Upload,
  Settings
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const userNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Upload Files', href: '/dashboard/upload', icon: Upload },
  { name: 'Vulnerabilities', href: '/dashboard/vulnerabilities', icon: Shield },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Profile', href: '/dashboard/profile', icon: Settings },
];

const adminNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Activity', href: '/admin/activity', icon: Activity },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
];

export const Sidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAdminUser = isAdmin(user);

  const navItems = isAdminUser ? adminNavItems : userNavItems;

  return (
    <div className="w-64 bg-gray-900 min-h-screen">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-white font-bold text-lg">VulnWatchdog</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-gray-300 text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/utils/api';
import { AdminUser, AdminProject, AuditLog } from '@/types';
import { 
  Users, 
  FolderOpen, 
  Activity, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalVulnerabilities: 0,
    criticalVulnerabilities: 0,
  });
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [recentProjects, setRecentProjects] = useState<AdminProject[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user, loading, router]);

  const fetchAdminData = async () => {
    try {
      setLoadingData(true);
      const [users, projects, logs] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getProjects(),
        adminAPI.getLogs(),
      ]);

      setRecentUsers(users.slice(0, 5));
      setRecentProjects(projects.slice(0, 5));
      setRecentLogs(logs.slice(0, 10));

      // Calculate statistics
      const totalVulns = projects.reduce((acc, project) => acc + project.totalVulnerabilities, 0);
      const criticalVulns = projects.reduce((acc, project) => {
        // This would need to be calculated from actual vulnerability data
        return acc + Math.floor(project.totalVulnerabilities * 0.1); // Estimate 10% critical
      }, 0);

      setStats({
        totalUsers: users.length,
        totalProjects: projects.length,
        totalVulnerabilities: totalVulns,
        criticalVulnerabilities: criticalVulns,
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend 
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    trend?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VulnWatchdog Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Link
                href="/dashboard"
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Switch to User View
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System overview and management</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              color="bg-blue-500"
            />
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              icon={FolderOpen}
              color="bg-green-500"
            />
            <StatCard
              title="Total Vulnerabilities"
              value={stats.totalVulnerabilities}
              icon={Shield}
              color="bg-red-500"
            />
            <StatCard
              title="Critical Issues"
              value={stats.criticalVulnerabilities}
              icon={AlertTriangle}
              color="bg-red-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/users"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-600">View and manage user accounts</p>
                </div>
              </Link>
              
              <Link
                href="/admin/activity"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Activity className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">System Activity</p>
                  <p className="text-sm text-gray-600">Monitor system logs and activity</p>
                </div>
              </Link>
              
              <Link
                href="/admin/reports"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Shield className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Security Reports</p>
                  <p className="text-sm text-gray-600">View security reports and analytics</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <Link
                  href="/admin/users"
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              
              {recentUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No users found</p>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
                <Link
                  href="/admin/projects"
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              
              {recentProjects.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No projects found</p>
              ) : (
                <div className="space-y-3">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-600">by {project.user.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {project.totalVulnerabilities} vulns
                        </p>
                        <p className="text-xs text-gray-600">
                          {project.totalDependencies} deps
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent System Logs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent System Activity</h3>
              <Link
                href="/admin/activity"
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {recentLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No activity logs found</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <Activity className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{log.user.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{log.action}</p>
                      <p className="text-xs text-gray-500">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { projectAPI } from '@/utils/api';
import { Project } from '@/types';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FolderOpen,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalVulnerabilities: 0,
    criticalVulnerabilities: 0,
    highVulnerabilities: 0,
    mediumVulnerabilities: 0,
    lowVulnerabilities: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await projectAPI.getAll();
      setProjects(projectsData);

      // Calculate statistics
      let totalVulns = 0;
      let criticalVulns = 0;
      let highVulns = 0;
      let mediumVulns = 0;
      let lowVulns = 0;

      projectsData.forEach((project: Project) => {
        project.dependencies.forEach((dependency) => {
          dependency.issues.forEach((issue) => {
            totalVulns++;
            switch (issue.severity) {
              case 'CRITICAL':
                criticalVulns++;
                break;
              case 'HIGH':
                highVulns++;
                break;
              case 'MEDIUM':
                mediumVulns++;
                break;
              case 'LOW':
                lowVulns++;
                break;
            }
          });
        });
      });

      setStats({
        totalProjects: projectsData.length,
        totalVulnerabilities: totalVulns,
        criticalVulnerabilities: criticalVulns,
        highVulnerabilities: highVulns,
        mediumVulnerabilities: mediumVulns,
        lowVulnerabilities: lowVulns,
      });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
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
    icon: React.ComponentType<{ className?: string }>;
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

  const RecentProjectCard = ({ project }: { project: Project }) => {
    const totalVulns = project.dependencies.reduce(
      (acc, dep) => acc + dep.issues.length,
      0
    );
    const criticalVulns = project.dependencies.reduce(
      (acc, dep) => acc + dep.issues.filter(issue => issue.severity === 'CRITICAL').length,
      0
    );

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <span className="text-sm text-gray-500">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {project.description || 'No description available'}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center text-gray-600">
              <FolderOpen className="h-4 w-4 mr-1" />
              {project.dependencies.length} dependencies
            </span>
            <span className="flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {totalVulns} vulnerabilities
            </span>
            {criticalVulns > 0 && (
              <span className="flex items-center text-red-800 font-medium">
                <Shield className="h-4 w-4 mr-1" />
                {criticalVulns} critical
              </span>
            )}
          </div>
          <Link
            href={`/dashboard/projects/${project.id}`}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor your projects and security status</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={FolderOpen}
            color="bg-blue-500"
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
          <StatCard
            title="Secure Dependencies"
            value={stats.totalProjects > 0 ? 
              projects.reduce((acc, project) => 
                acc + project.dependencies.filter(dep => dep.issues.length === 0).length, 0
              ) : 0
            }
            icon={CheckCircle}
            color="bg-green-500"
          />
        </div>

        {/* Vulnerability Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vulnerability Severity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-red-800">
                  <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                  Critical
                </span>
                <span className="font-semibold">{stats.criticalVulnerabilities}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-orange-600">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  High
                </span>
                <span className="font-semibold">{stats.highVulnerabilities}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-yellow-600">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Medium
                </span>
                <span className="font-semibold">{stats.mediumVulnerabilities}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-blue-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Low
                </span>
                <span className="font-semibold">{stats.lowVulnerabilities}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/upload"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Activity className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-900">Upload New Dependencies</span>
              </Link>
              <Link
                href="/dashboard/projects"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <FolderOpen className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-900">View All Projects</span>
              </Link>
              <Link
                href="/dashboard/vulnerabilities"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Shield className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-900">Security Overview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <Link
              href="/dashboard/projects"
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No projects yet</p>
              <p className="text-sm text-gray-400">Create your first project to get started</p>
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => (
                <RecentProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

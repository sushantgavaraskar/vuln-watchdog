'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { VulnerabilityCard } from '@/components/VulnerabilityCard';
import { projectAPI } from '@/utils/api';
import { Project, Issue } from '@/types';
import { Shield, Filter, Search, AlertTriangle } from 'lucide-react';

export default function VulnerabilitiesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredVulnerabilities, setFilteredVulnerabilities] = useState<Array<{
    issue: Issue;
    project: Project;
    dependency: any;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: '',
    project: '',
    search: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await projectAPI.getAll();
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let vulnerabilities: Array<{
      issue: Issue;
      project: Project;
      dependency: any;
    }> = [];

    // Collect all vulnerabilities from all projects
    projects.forEach((project) => {
      project.dependencies.forEach((dependency) => {
        dependency.issues.forEach((issue) => {
          vulnerabilities.push({
            issue,
            project,
            dependency,
          });
        });
      });
    });

    // Apply filters
    if (filters.severity) {
      vulnerabilities = vulnerabilities.filter(
        (v) => v.issue.severity === filters.severity
      );
    }

    if (filters.project) {
      vulnerabilities = vulnerabilities.filter(
        (v) => v.project.id.toString() === filters.project
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      vulnerabilities = vulnerabilities.filter(
        (v) =>
          v.issue.title.toLowerCase().includes(searchLower) ||
          v.issue.description?.toLowerCase().includes(searchLower) ||
          v.dependency.name.toLowerCase().includes(searchLower) ||
          v.project.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredVulnerabilities(vulnerabilities);
  };

  const getSeverityCount = (severity: string) => {
    return projects.reduce((count, project) => {
      return count + project.dependencies.reduce((depCount, dependency) => {
        return depCount + dependency.issues.filter(issue => issue.severity === severity).length;
      }, 0);
    }, 0);
  };

  const totalVulnerabilities = projects.reduce((count, project) => {
    return count + project.dependencies.reduce((depCount, dependency) => {
      return depCount + dependency.issues.length;
    }, 0);
  }, 0);

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
          <h1 className="text-2xl font-bold text-gray-900">Vulnerabilities</h1>
          <p className="text-gray-600">
            Monitor and manage security vulnerabilities across your projects
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-lg font-semibold text-gray-900">{totalVulnerabilities}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <div className="w-5 h-5 bg-red-600 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-lg font-semibold text-red-600">{getSeverityCount('CRITICAL')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">High</p>
                <p className="text-lg font-semibold text-orange-600">{getSeverityCount('HIGH')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Medium</p>
                <p className="text-lg font-semibold text-yellow-600">{getSeverityCount('MEDIUM')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Low</p>
                <p className="text-lg font-semibold text-blue-600">{getSeverityCount('LOW')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vulnerabilities..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <select
                value={filters.project}
                onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vulnerabilities List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Vulnerabilities ({filteredVulnerabilities.length})
            </h3>
          </div>

          {filteredVulnerabilities.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                {totalVulnerabilities === 0 
                  ? 'No vulnerabilities found' 
                  : 'No vulnerabilities match your filters'
                }
              </p>
              <p className="text-sm text-gray-400">
                {totalVulnerabilities === 0 
                  ? 'Upload dependency files to start scanning for vulnerabilities'
                  : 'Try adjusting your filters to see more results'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVulnerabilities.map((vuln, index) => (
                <VulnerabilityCard
                  key={`${vuln.issue.id}-${index}`}
                  vulnerability={vuln.issue}
                  dependencyName={vuln.dependency.name}
                  dependencyVersion={vuln.dependency.version}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

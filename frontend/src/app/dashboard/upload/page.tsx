'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { FileUpload } from '@/components/FileUpload';
import { projectAPI, scanAPI } from '@/utils/api';
import { Project } from '@/types';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await projectAPI.getAll();
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file.name);
  };

  const handleUpload = async (file: File, projectId: number) => {
    try {
      setUploading(true);
      const result = await scanAPI.uploadFile(file, projectId);
      
      toast.success(`Scan completed! Found ${result.totalVulnerabilities} vulnerabilities.`);
      
      // Refresh projects to get updated data
      await fetchProjects();
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Upload Dependencies</h1>
          <p className="text-gray-600">Scan your dependency files for security vulnerabilities</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Dependency File</h2>
            <p className="text-gray-600">
              Upload a dependency file to scan for security vulnerabilities. Supported formats include 
              package.json, requirements.txt, pom.xml, and more.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No projects available</p>
              <p className="text-sm text-gray-400 mb-4">
                You need to create a project before uploading dependency files.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard/projects'}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          ) : (
            <FileUpload
              onFileSelect={handleFileSelect}
              onUpload={handleUpload}
              projects={projects.map(p => ({ id: p.id, name: p.name }))}
              isLoading={uploading}
            />
          )}
        </div>

        {/* Supported Formats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported File Formats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-blue-600 font-mono text-xs">JS</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Node.js</p>
                <p className="text-sm text-gray-600">package.json, yarn.lock</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                <span className="text-green-600 font-mono text-xs">PY</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Python</p>
                <p className="text-sm text-gray-600">requirements.txt, Pipfile</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                <span className="text-orange-600 font-mono text-xs">JV</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Java</p>
                <p className="text-sm text-gray-600">pom.xml, build.gradle</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                <span className="text-red-600 font-mono text-xs">RB</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ruby</p>
                <p className="text-sm text-gray-600">Gemfile, Gemfile.lock</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <span className="text-purple-600 font-mono text-xs">PHP</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">PHP</p>
                <p className="text-sm text-gray-600">composer.json, composer.lock</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-cyan-100 rounded flex items-center justify-center">
                <span className="text-cyan-600 font-mono text-xs">GO</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Go</p>
                <p className="text-sm text-gray-600">go.mod, go.sum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Upload Tips</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• Maximum file size: 10MB</li>
                <li>• Ensure your dependency file is up to date</li>
                <li>• For best results, include lock files when available</li>
                <li>• Scans typically complete within 30-60 seconds</li>
                <li>• You'll receive notifications for any vulnerabilities found</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

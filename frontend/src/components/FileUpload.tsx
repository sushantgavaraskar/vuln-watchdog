'use client';

import { useState, useCallback } from 'react';
import { Upload, X, File, AlertCircle, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUpload: (file: File, projectId: number) => Promise<void>;
  projects: Array<{ id: number; name: string }>;
  isLoading?: boolean;
}

const allowedFileTypes = [
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'requirements.txt',
  'Pipfile',
  'poetry.lock',
  'pom.xml',
  'build.gradle',
  'Gemfile',
  'Gemfile.lock',
  'composer.json',
  'composer.lock',
  'go.mod',
  'go.sum'
];

const maxFileSize = 10 * 1024 * 1024; // 10MB

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUpload,
  projects,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return 'File size exceeds 10MB limit';
    }

    // Check file type
    const isValidType = allowedFileTypes.some(type => 
      file.name.toLowerCase().includes(type.toLowerCase())
    );
    
    if (!isValidType) {
      return `Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`;
    }

    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setSelectedFile(file);
      setError('');
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/plain': ['.txt', '.lock'],
      'application/xml': ['.xml'],
      'text/xml': ['.xml'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!selectedFile || !selectedProjectId) {
      setError('Please select a file and project');
      return;
    }

    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      setError('');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(selectedFile, selectedProjectId as number);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      // Reset after success
      setTimeout(() => {
        setSelectedFile(null);
        setSelectedProjectId('');
        setUploadProgress(0);
        setUploadStatus('idle');
      }, 2000);

    } catch (err: any) {
      setUploadStatus('error');
      setError(err.message || 'Upload failed');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    setUploadStatus('idle');
    setUploadProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Project Selection */}
      <div>
        <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
          Select Project
        </label>
        <select
          id="project"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="">Choose a project...</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the file here...'
            : 'Drag and drop a dependency file here, or click to select'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: package.json, requirements.txt, pom.xml, Gemfile, composer.json, go.mod
        </p>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Upload Progress */}
      {uploadStatus === 'uploading' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadStatus === 'success' && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm">File uploaded successfully!</span>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && selectedProjectId && uploadStatus === 'idle' && (
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Uploading...' : 'Upload File'}
        </button>
      )}
    </div>
  );
};

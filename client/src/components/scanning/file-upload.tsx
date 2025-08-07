import React, { useState, useCallback, useRef, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import type { FileUploadProps, SupportedFileType } from '@/types';

const SUPPORTED_FILE_TYPES: SupportedFileType[] = [
  {
    extension: '.json',
    name: 'package.json',
    description: 'Node.js dependencies',
    examples: ['package.json', 'package-lock.json']
  },
  {
    extension: '.txt',
    name: 'requirements.txt',
    description: 'Python dependencies',
    examples: ['requirements.txt', 'Pipfile.lock']
  },
  {
    extension: '.xml',
    name: 'pom.xml',
    description: 'Java/Maven dependencies',
    examples: ['pom.xml', 'build.gradle']
  },
  {
    extension: '.lock',
    name: 'Gemfile.lock',
    description: 'Ruby dependencies',
    examples: ['Gemfile.lock', 'Gemfile']
  },
  {
    extension: '.json',
    name: 'composer.json',
    description: 'PHP dependencies',
    examples: ['composer.json', 'composer.lock']
  },
  {
    extension: '.mod',
    name: 'go.mod',
    description: 'Go dependencies',
    examples: ['go.mod', 'go.sum']
  }
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Memoized file validation function
const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (10MB)`;
  }

  const fileExtension = file.name.toLowerCase().split('.').pop();
  const isSupported = SUPPORTED_FILE_TYPES.some(type => 
    type.examples.some(example => 
      file.name.toLowerCase().includes(example.toLowerCase()) ||
      file.name.toLowerCase().endsWith(type.extension)
    )
  );

  if (!isSupported) {
    return `File type not supported. Please upload a supported dependency file.`;
  }

  return null;
};

// Memoized file upload component
export const FileUpload = memo<FileUploadProps>(({ onUpload, projectId }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileSelect = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      toast.error('File validation failed', {
        description: validationError
      });
      return;
    }

    setSelectedFile(file);
    setError(null);
    toast.success('File selected successfully', {
      description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleFileSelect,
    accept: {
      'application/json': ['.json'],
      'text/plain': ['.txt', '.lock', '.mod'],
      'application/xml': ['.xml']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    let progressInterval: NodeJS.Timeout | undefined; // <-- Declaration moved here

    try {
      // Simulate upload progress
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval!);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call the upload function
      await onUpload(selectedFile);

      // Complete progress
      setProgress(100);
      clearInterval(progressInterval);

      toast.success('File uploaded successfully', {
        description: 'Vulnerability scan completed'
      });

      // Reset state after successful upload
      setTimeout(() => {
        setSelectedFile(null);
        setProgress(0);
        setUploading(false);
      }, 1000);

    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      
      toast.error('Upload failed', {
        description: errorMessage
      });
    } finally {
      setUploading(false);
      abortControllerRef.current = null;
    }
  }, [selectedFile, onUpload]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setUploading(false);
    setProgress(0);
    setError(null);
    toast.info('Upload cancelled');
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    setProgress(0);
  }, []);

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
              ${isDragActive && !isDragReject ? 'border-primary bg-primary/5' : ''}
              ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
              ${!isDragActive && !isDragReject ? 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50' : ''}
              ${uploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Uploading...</h3>
                  <p className="text-muted-foreground">Please wait while we process your file</p>
                </div>
              </div>
            ) : selectedFile ? (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">File Selected</h3>
                  <p className="text-muted-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your dependency file'}
                  </h3>
                  <p className="text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {uploading && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      {selectedFile && !uploading && (
        <Button onClick={handleUpload} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Upload and Scan
        </Button>
      )}

      {/* Remove File Button */}
      {selectedFile && !uploading && (
        <Button variant="outline" onClick={removeFile} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Remove File
        </Button>
      )}

      {/* Supported File Types */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Supported File Types</h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORTED_FILE_TYPES.map((type, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                <File className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{type.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Guidelines */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Upload Guidelines</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Maximum file size: 10MB</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Supported formats: JSON, TXT, XML, LOCK, MOD</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>One file per upload</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Scan results available immediately</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

FileUpload.displayName = 'FileUpload'; 
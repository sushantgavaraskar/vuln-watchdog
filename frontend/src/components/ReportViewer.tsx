'use client';

import { useState } from 'react';
import { Download, Copy, Check, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReportViewerProps {
  data: unknown;
  title?: string;
  filename?: string;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  data,
  title = 'Report Data',
  filename = 'report.json',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatJSON = (data: unknown): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return 'Invalid JSON data';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatJSON(data));
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadJSON = () => {
    try {
      const blob = new Blob([formatJSON(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const jsonString = formatJSON(data);
  const isLarge = jsonString.length > 1000;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-1 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={downloadJSON}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </button>
            {isLarge && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isExpanded ? (
                  <EyeOff className="h-4 w-4 mr-1" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* JSON Content */}
      <div className="p-6">
        <div
          className={`bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-auto ${
            isLarge && !isExpanded ? 'max-h-96' : ''
          }`}
        >
          <pre className="text-gray-800 whitespace-pre-wrap break-words">
            {jsonString}
          </pre>
        </div>

        {/* Info */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Size: {jsonString.length} characters</span>
          <span>Format: JSON</span>
        </div>
      </div>
    </div>
  );
};

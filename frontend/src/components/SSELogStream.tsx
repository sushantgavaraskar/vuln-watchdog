'use client';

import { useState, useEffect } from 'react';
import { useSSE } from '@/hooks/useSSE';
import { Activity, Wifi, WifiOff, Clock, User, AlertTriangle } from 'lucide-react';
import { AuditLog } from '@/types';

interface SSELogStreamProps {
  endpoint: string;
  title?: string;
}

export const SSELogStream: React.FC<SSELogStreamProps> = ({
  endpoint,
  title = 'Real-time Activity Log',
}) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const { isConnected, error } = useSSE({
    endpoint,
    onMessage: (event) => {
      if (event.type === 'new_log' && event.log) {
        setLogs(prev => [event.log as AuditLog, ...prev.slice(0, 99)]); // Keep last 100 logs
      }
    },
    onError: (error) => {
      console.error('SSE Error:', error);
    },
  });

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isAutoScroll && logs.length > 0) {
      const logContainer = document.getElementById('log-container');
      if (logContainer) {
        logContainer.scrollTop = 0;
      }
    }
  }, [logs, isAutoScroll]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('logout')) {
      return <User className="h-4 w-4" />;
    }
    if (action.includes('error') || action.includes('failed')) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('error') || action.includes('failed')) {
      return 'text-red-600';
    }
    if (action.includes('login')) {
      return 'text-green-600';
    }
    if (action.includes('logout')) {
      return 'text-orange-600';
    }
    return 'text-blue-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center text-green-600">
                  <Wifi className="h-4 w-4 mr-1" />
                  <span className="text-sm">Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <WifiOff className="h-4 w-4 mr-1" />
                  <span className="text-sm">Disconnected</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isAutoScroll}
                onChange={(e) => setIsAutoScroll(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Auto-scroll
            </label>
          </div>
        </div>
      </div>

      {/* Connection Error */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200">
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Logs Container */}
      <div
        id="log-container"
        className="h-96 overflow-y-auto p-4 space-y-2"
      >
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No activity logs yet</p>
            <p className="text-sm">Logs will appear here in real-time</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={`${log.id}-${index}`}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getActionIcon(log.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {log.user.name}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimestamp(log.createdAt)}
                  </div>
                </div>
                <p className={`text-sm font-medium ${getActionColor(log.action)}`}>
                  {log.action}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {log.details}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{logs.length} log entries</span>
          <span>Real-time updates</span>
        </div>
      </div>
    </div>
  );
};

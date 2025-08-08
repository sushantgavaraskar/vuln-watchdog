'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Loader2, Zap, Database, Users, Bell, FileText, Settings } from 'lucide-react';
import { config } from '@/utils/config';

interface APITestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  response?: any;
  error?: string;
  duration?: number;
}

interface APITest {
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requiresAuth?: boolean;
  testData?: any;
  icon: React.ComponentType<any>;
}

const API_TESTS: APITest[] = [
  {
    name: 'Health Check',
    description: 'Basic API health and connectivity',
    endpoint: '/health',
    method: 'GET',
    icon: Shield,
  },
  {
    name: 'API Documentation',
    description: 'Swagger API documentation endpoint',
    endpoint: '/api/docs',
    method: 'GET',
    icon: FileText,
  },
  {
    name: 'User Registration',
    description: 'Test user registration endpoint',
    endpoint: '/api/auth/register',
    method: 'POST',
    testData: {
      email: 'test@example.com',
      password: 'TestPassword123!',
      name: 'Test User'
    },
    icon: Users,
  },
  {
    name: 'User Login',
    description: 'Test user authentication endpoint',
    endpoint: '/api/auth/login',
    method: 'POST',
    testData: {
      email: 'test@example.com',
      password: 'TestPassword123!'
    },
    icon: Settings,
  },
  {
    name: 'Projects List',
    description: 'Test projects listing endpoint',
    endpoint: '/api/projects',
    method: 'GET',
    requiresAuth: true,
    icon: Database,
  },
  {
    name: 'Vulnerabilities List',
    description: 'Test vulnerabilities listing endpoint',
    endpoint: '/api/vulnerabilities/list',
    method: 'GET',
    requiresAuth: true,
    icon: AlertTriangle,
  },
  {
    name: 'Notifications List',
    description: 'Test notifications listing endpoint',
    endpoint: '/api/notifications/list',
    method: 'GET',
    requiresAuth: true,
    icon: Bell,
  },
  {
    name: 'Admin Users',
    description: 'Test admin users endpoint',
    endpoint: '/api/admin/users',
    method: 'GET',
    requiresAuth: true,
    icon: Users,
  },
  {
    name: 'Admin Reports',
    description: 'Test admin reports endpoint',
    endpoint: '/api/admin/reports/all',
    method: 'GET',
    requiresAuth: true,
    icon: FileText,
  },
  {
    name: 'SSE Notifications',
    description: 'Test Server-Sent Events notifications stream',
    endpoint: '/api/notifications/stream',
    method: 'GET',
    requiresAuth: true,
    icon: Zap,
  },
];

export default function APITester() {
  const [results, setResults] = useState<APITestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
  });

  const runAPITest = async (test: APITest): Promise<APITestResult> => {
    const startTime = Date.now();
    const result: APITestResult = {
      endpoint: test.endpoint,
      status: 'pending',
    };

    try {
      const url = `${config.api.baseUrl}${test.endpoint}`;
      const options: RequestInit = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (test.testData) {
        options.body = JSON.stringify(test.testData);
      }

      if (test.requiresAuth) {
        // For auth-required endpoints, we'll test without auth to see the expected 401
        const response = await fetch(url, options);
        const duration = Date.now() - startTime;
        
        if (response.status === 401) {
          return {
            ...result,
            status: 'success',
            response: { status: 401, message: 'Authentication required (expected)' },
            duration,
          };
        } else if (response.ok) {
          const data = await response.json();
          return {
            ...result,
            status: 'success',
            response: data,
            duration,
          };
        } else {
          const errorText = await response.text();
          return {
            ...result,
            status: 'error',
            error: `HTTP ${response.status}: ${errorText}`,
            duration,
          };
        }
      } else {
        const response = await fetch(url, options);
        const duration = Date.now() - startTime;
        
        if (response.ok) {
          let data;
          try {
            data = await response.json();
          } catch {
            data = { status: response.status, message: 'Response received (non-JSON)' };
          }
          
          return {
            ...result,
            status: 'success',
            response: data,
            duration,
          };
        } else {
          const errorText = await response.text();
          return {
            ...result,
            status: 'error',
            error: `HTTP ${response.status}: ${errorText}`,
            duration,
          };
        }
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        ...result,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    const newResults: APITestResult[] = [];
    
    for (const test of API_TESTS) {
      const result = await runAPITest(test);
      newResults.push(result);
      setResults([...newResults]);
      
      // Small delay between tests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Calculate summary
    const summary = {
      total: newResults.length,
      passed: newResults.filter(r => r.status === 'success').length,
      failed: newResults.filter(r => r.status === 'error').length,
      warnings: newResults.filter(r => r.status === 'warning').length,
    };
    
    setSummary(summary);
    setIsRunning(false);
  };

  const runSingleTest = async (test: APITest) => {
    const result = await runAPITest(test);
    setResults(prev => {
      const updated = prev.filter(r => r.endpoint !== test.endpoint);
      return [...updated, result];
    });
  };

  const getStatusIcon = (status: APITestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: APITestResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Connection Tester</h1>
        <p className="text-gray-600">
          Test all backend API endpoints to verify connectivity and functionality.
        </p>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><strong>API Base URL:</strong> {config.api.baseUrl}</div>
            <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
            <div><strong>Dev Mode:</strong> {config.dev.mode ? 'Enabled' : 'Disabled'}</div>
            <div><strong>Debug Mode:</strong> {config.dev.debug ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            </div>
            <Database className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-2xl font-bold text-green-600">{summary.passed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{summary.failed}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.warnings}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Run All Tests
            </>
          )}
        </button>
        
        <button
          onClick={() => setResults([])}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          Clear Results
        </button>
      </div>

      {/* Test Results */}
      <div className="space-y-4">
        {API_TESTS.map((test) => {
          const result = results.find(r => r.endpoint === test.endpoint);
          const Icon = test.icon;
          
          return (
            <div
              key={test.endpoint}
              className={`border rounded-lg p-4 ${result ? getStatusColor(result.status) : 'border-gray-200 bg-white'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="h-6 w-6 text-gray-500 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{test.name}</h3>
                      {result && getStatusIcon(result.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div><strong>Endpoint:</strong> {test.method} {test.endpoint}</div>
                      {test.requiresAuth && <div className="text-orange-600">Requires Authentication</div>}
                      {result?.duration && <div><strong>Duration:</strong> {result.duration}ms</div>}
                    </div>
                    
                    {result?.error && (
                      <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-800">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                    
                    {result?.response && (
                      <div className="mt-2">
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                            View Response
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                            {JSON.stringify(result.response, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => runSingleTest(test)}
                  disabled={isRunning}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
                >
                  Test
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      {results.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {summary.failed > 0 && (
              <li>• {summary.failed} API endpoint(s) failed. Check your backend server and network connectivity.</li>
            )}
            {summary.passed === summary.total && (
              <li>• All API endpoints are working correctly! Your frontend is ready to connect.</li>
            )}
            {summary.passed > 0 && summary.failed > 0 && (
              <li>• Some endpoints are working. Focus on fixing the failed endpoints first.</li>
            )}
            <li>• Authentication-required endpoints showing 401 errors are expected when not logged in.</li>
            <li>• Check the browser's Network tab for detailed request/response information.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

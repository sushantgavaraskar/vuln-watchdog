'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Shield, Zap, Bell, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VulnWatchdog</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/api-test"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                API Test
              </Link>
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Secure Your Dependencies
            <span className="text-red-600"> Automatically</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            VulnWatchdog continuously monitors your software dependencies for security vulnerabilities 
            and provides real-time alerts to keep your applications secure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-700 transition-colors inline-flex items-center justify-center"
            >
              Start Monitoring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/auth/login"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Security Monitoring
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides everything you need to keep your dependencies secure and up-to-date.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Vulnerability Detection</h3>
            <p className="text-gray-600">
              Automatically scan and detect security vulnerabilities in your dependencies.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Alerts</h3>
            <p className="text-gray-600">
              Get instant notifications when new vulnerabilities are discovered.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Notifications</h3>
            <p className="text-gray-600">
              Configurable alert preferences and frequency settings.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Share projects and collaborate with your development team.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Secure Your Dependencies?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of developers who trust VulnWatchdog to keep their applications secure.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-red-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold">VulnWatchdog</span>
            </div>
            <p className="text-gray-400">
              © 2024 VulnWatchdog. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

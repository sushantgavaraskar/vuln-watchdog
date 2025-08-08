import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import { Toast } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VulnWatchdog - Vulnerability Monitoring System',
  description: 'Comprehensive vulnerability monitoring system for software dependencies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}

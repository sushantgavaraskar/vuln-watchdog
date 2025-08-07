import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: number;
  userId: number;
  message: string;
  type: 'security' | 'scan' | 'system' | 'collaboration';
  metadata: string;
  read: boolean;
  createdAt: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notificationsData, unreadData] = await Promise.all([
          apiClient.getNotifications(),
          apiClient.getUnreadCount()
        ]);
        setNotifications((notificationsData as any)?.notifications || []);
        setUnreadCount(unreadData.count);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Setup SSE connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Use token as query param for SSE
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    const eventSource = new EventSource(url);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'new_notification':
          setNotifications(prev => [data.notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for important notifications
          if (data.notification.type === 'security') {
            toast({
              title: "Security Alert",
              description: data.notification.message,
              variant: "destructive"
            });
          }
          break;
        case 'unread_count':
          setUnreadCount(data.count);
          break;
        case 'connected':
          console.log('SSE connected');
          break;
        case 'heartbeat':
          // Keep connection alive
          break;
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection failed:', error);
      eventSource.close();
      
      // Fallback to polling
      const pollInterval = setInterval(async () => {
        try {
          const unreadData = await apiClient.getUnreadCount();
          setUnreadCount(unreadData.count);
        } catch (error) {
          console.error('Polling failed:', error);
        }
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(pollInterval);
    };

    return () => eventSource.close();
  }, [toast]);

  const markAsRead = async (notificationId: number) => {
    try {
      await apiClient.markAsRead(notificationId.toString());
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const createTestNotification = async () => {
    try {
      await apiClient.createTestNotification();
      toast({
        title: "Test notification sent",
        description: "Check your notifications panel"
      });
    } catch (error) {
      console.error('Failed to create test notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    createTestNotification
  };
};

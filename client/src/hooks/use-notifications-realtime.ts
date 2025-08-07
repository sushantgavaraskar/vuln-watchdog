import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Notification, SSEEvent } from '@/types';
import { queryKeys } from './use-api';

export const useNotificationsRealtime = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const connectSSE = () => {
      try {
        // Create SSE connection with token as query param
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;
        const eventSource = new EventSource(url);

        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
          console.log('SSE connection established');
        };

        eventSource.onmessage = (event) => {
          try {
            const data: SSEEvent = JSON.parse(event.data);
            
            switch (data.type) {
              case 'connected':
                console.log('SSE connected:', data.message);
                break;
                
              case 'new_notification':
                if (data.notification) {
                  setNotifications(prev => [data.notification!, ...prev]);
                  setUnreadCount(prev => prev + 1);
                  
                  // Show toast notification
                  toast(data.notification.message, {
                    description: `Type: ${data.notification.type}`,
                    action: {
                      label: 'View',
                      onClick: () => {
                        // Navigate to notifications page or open notification
                        window.location.href = '/notifications';
                      }
                    }
                  });
                  
                  // Invalidate queries to refresh data
                  queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
                  queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
                }
                break;
                
              case 'unread_count':
                if (data.count !== undefined) {
                  setUnreadCount(data.count);
                }
                break;
                
              case 'heartbeat':
                // Connection is alive, no action needed
                break;
                
              default:
                console.log('Unknown SSE event type:', data.type);
            }
          } catch (error) {
            console.error('Error parsing SSE message:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          setIsConnected(false);
          
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (eventSourceRef.current) {
              eventSourceRef.current.close();
              connectSSE();
            }
          }, 5000);
        };

        eventSource.onclose = () => {
          console.log('SSE connection closed');
          setIsConnected(false);
        };

      } catch (error) {
        console.error('Failed to establish SSE connection:', error);
        setIsConnected(false);
      }
    };

    connectSSE();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [queryClient]);

  // Function to manually add a notification (for testing)
  const addTestNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Function to mark notification as read
  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    isConnected,
    addTestNotification,
    markAsRead,
    markAllAsRead
  };
}; 
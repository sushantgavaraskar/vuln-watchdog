import { useEffect, useRef, useState, useCallback } from 'react';
import { getToken } from '@/utils/auth';
import { SSEEvent } from '@/types';
import { config } from '@/utils/config';

interface UseSSEOptions {
  endpoint: string;
  onMessage?: (event: SSEEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useSSE = ({
  endpoint,
  onMessage,
  onError,
  onOpen,
  onClose,
  autoReconnect = true,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5,
}: UseSSEOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const token = getToken();
    if (!token) {
      setError('No authentication token available');
      return;
    }

    try {
      const base = config.api.baseUrl.replace(/\/?api\/?$/, '/api');
      const url = `${base}${endpoint}${endpoint.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
      const eventSource = new EventSource(url);

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        onOpen?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);
          onMessage?.(data);
        } catch (err) {
          console.error('Failed to parse SSE message:', err);
        }
      };

      eventSource.onerror = (event) => {
        setIsConnected(false);
        setError('SSE connection error');
        onError?.(event);

        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      eventSourceRef.current = eventSource;
    } catch (err) {
      setError('Failed to create SSE connection');
      console.error('SSE connection error:', err);
    }
  }, [endpoint, onMessage, onError, onOpen, autoReconnect, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setIsConnected(false);
    onClose?.();
  }, [onClose]);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect, disconnect]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    reconnect,
  };
};

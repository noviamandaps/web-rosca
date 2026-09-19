import { apiFetch } from '../api-client';
import type { NotificationRow, NotificationsResult } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const qk = {
  notifications: ['notifications'] as const,
  unread: ['notifications', 'unread-count'] as const,
};

function token() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

// shape nyata (audit): GET /notifications → { success, data: { notifications, total, unreadCount } }
export function useNotifications() {
  return useQuery({
    queryKey: qk.notifications,
    queryFn: () => apiFetch<NotificationsResult>('/notifications'),
    enabled: !!token(),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: qk.unread,
    queryFn: () => apiFetch<{ count?: number }>('/notifications/unread-count'),
    enabled: !!token(),
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<NotificationRow>(`/notifications/${id}/read`, { method: 'PATCH', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.notifications }),
  });
}

export function useReadAllNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<null>('/notifications/read-all', { method: 'PATCH', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.notifications }),
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/notifications/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.notifications }),
  });
}

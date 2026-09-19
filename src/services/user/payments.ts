import { apiFetch } from '../api-client';
import type { BankRow, NotificationRow, PaymentResult } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const qk = {
  banks: ['payments', 'banks'] as const,
  notifications: ['notifications'] as const,
  unread: ['notifications', 'unread-count'] as const,
};

export function useBanks() {
  return useQuery({ queryKey: qk.banks, queryFn: () => apiFetch<BankRow[] | { data: BankRow[] }>('/payments/banks'), staleTime: Infinity });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (payload: {
      orderId: string;
      paymentMethod: 'VIRTUAL_ACCOUNT' | 'EWALLET' | string;
      bankCode?: string;
      channelCode?: string;
    }) => apiFetch<Record<string, unknown>>('/payments/create', { method: 'POST', body: payload }),
  });
}

export function getPaymentStatus(paymentId: string) {
  return apiFetch<Record<string, unknown>>(`/payments/${paymentId}/status`);
}

export function useSimulatePayment() {
  return useMutation({
    mutationFn: (paymentId: string) =>
      apiFetch<null>('/payments/simulate', { method: 'POST', body: { paymentId } }),
  });
}

export function useNotifications() {
  return useQuery({ queryKey: qk.notifications, queryFn: () => apiFetch<NotificationRow[] | { data: NotificationRow[] }>('/notifications'), enabled: !!token() });
}

export function useUnreadCount() {
  return useQuery({ queryKey: qk.unread, queryFn: () => apiFetch<{ count?: number }>('/notifications/unread-count'), enabled: !!token(), refetchInterval: 30_000 });
}

function token() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/notifications/${id}/read`, { method: 'PATCH', body: {} }),
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

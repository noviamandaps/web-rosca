import { apiFetch, apiDownload, downloadBlob } from '../api-client';
import type { OrdersListResult, OrderStatus, Order, UserOrdersSummary } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type UserOrderFilters = {
  page?: number; // def 1
  limit?: number; // max 100, def 10
  status?: OrderStatus | 'completed' | 'processing' | 'cancelled' | 'awaiting' | 'returned' | 'all';
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: 'createdAt' | 'totalAmount' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
};

export const qk = {
  orders: (f: UserOrderFilters) => ['orders-user', f] as const,
  order: (n: string) => ['orders-user', 'detail', n] as const,
};

export function getOrders(f: UserOrderFilters = {}) {
  return apiFetch<OrdersListResult>('/orders', { params: f });
}

export function useOrders(f: UserOrderFilters = {}) {
  return useQuery({ queryKey: qk.orders(f), queryFn: () => getOrders(f), enabled: !!localStorageToken() });
}

export function useOrdersSummary() {
  return useQuery({ queryKey: ['orders-user', 'summary'], queryFn: () => apiFetch<UserOrdersSummary>('/orders/summary'), enabled: !!localStorageToken() });
}

function localStorageToken() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

export function getOrderDetail(orderNumber: string) {
  return apiFetch<Order>(`/orders/${orderNumber}`);
}

export function useOrderDetail(orderNumber: string) {
  return useQuery({ queryKey: qk.order(orderNumber), queryFn: () => getOrderDetail(orderNumber), enabled: !!orderNumber });
}

export function useCreateOrderFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      addressId: string;
      cartItemIds: string[];
      courierCode: string;
      courierService: string;
      shippingCost?: number;
      notes?: string;
      couponCode?: string[];
      pointsUsed?: number;
      paymentMethod: 'COD' | 'TRANSFER';
    }) => apiFetch<Order>('/orders/from-cart', { method: 'POST', body: payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['orders-user'] });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderNumber, reason }: { orderNumber: string; reason: string }) =>
      apiFetch<null>(`/orders/${orderNumber}/cancel`, { method: 'POST', body: { reason } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders-user'] }),
  });
}

export function useCompleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderNumber: string) =>
      apiFetch<null>(`/orders/${orderNumber}/complete`, { method: 'POST', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders-user'] }),
  });
}

export async function downloadInvoicePreview(orderNumber: string) {
  const blob = await apiDownload(`/orders/${orderNumber}/invoice/preview`);
  downloadBlob(blob, `invoice-${orderNumber}.pdf`);
}

export function useResendInvoice() {
  return useMutation({
    mutationFn: (orderNumber: string) =>
      apiFetch<null>(`/orders/${orderNumber}/invoice/resend`, { method: 'POST', body: {} }),
  });
}

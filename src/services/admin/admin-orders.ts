import { apiFetch, apiDownload, downloadBlob } from '../api-client';
import type { Courier, Order, OrderStatus, Paginated } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type OrderFilters = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export const qk = {
  orders: (f: OrderFilters) => ['orders', f] as const,
  order: (id: string) => ['orders', 'detail', id] as const,
  couriers: ['orders', 'couriers'] as const,
};

export function getOrders(f: OrderFilters = {}) {
  return apiFetch<Paginated<Order>>('/orders/admin/all', { params: f });
}
export function getOrder(id: string) {
  return apiFetch<Order>(`/orders/admin/${id}`);
}
export function getCouriers() {
  return apiFetch<Courier[]>('/orders/admin/couriers');
}

export function useOrders(f: OrderFilters) {
  return useQuery({ queryKey: qk.orders(f), queryFn: () => getOrders(f) });
}
export function useOrder(id: string) {
  return useQuery({ queryKey: qk.order(id), queryFn: () => getOrder(id), enabled: !!id });
}
export function useCouriers() {
  return useQuery({ queryKey: qk.couriers, queryFn: getCouriers, staleTime: Infinity });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      apiFetch<null>(`/orders/admin/${id}/status`, { method: 'PUT', body: { status } }),
    onSuccess: (_d, { id }) => qc.invalidateQueries({ queryKey: qk.order(id) }),
  });
}

export function useUpdateOrderTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, trackingNumber }: { id: string; trackingNumber: string }) =>
      apiFetch<null>(`/orders/admin/${id}/tracking`, { method: 'PUT', body: { trackingNumber } }),
    onSuccess: (_d, { id }) => qc.invalidateQueries({ queryKey: qk.order(id) }),
  });
}

export async function exportOrders(f: OrderFilters) {
  const blob = await apiDownload('/orders/admin/export', { ...f, format: 'xlsx' });
  downloadBlob(blob, 'orders.xlsx');
}

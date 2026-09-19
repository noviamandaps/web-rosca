import { apiFetch, apiDownload, downloadBlob } from '../api-client';
import type { Courier, Order, OrdersListResult, OrderStatus } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type OrderFilters = {
  page?: number;
  limit?: number; // max 100, def 10
  status?: OrderStatus;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  search?: string;
  sortBy?: 'createdAt' | 'totalAmount' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  courierCode?: string;
  courierService?: string;
  timeSlot?: 'BEFORE_NOON' | 'AFTER_NOON';
  engraved?: boolean;
  cod?: boolean;
  storeType?: 'ROSCA_INDONESIA' | 'ROSCA_ONE';
  warehouseId?: string;
};

export const qk = {
  orders: (f: OrderFilters) => ['orders', f] as const,
  order: (id: string) => ['orders', 'detail', id] as const,
  couriers: ['orders', 'couriers'] as const,
};

export function getOrders(f: OrderFilters = {}) {
  return apiFetch<OrdersListResult>('/orders/admin/all', { params: f });
}
export function getOrder(id: string) {
  return apiFetch<Order>(`/orders/admin/${id}`);
}
export function getOrderByNumber(orderNumber: string) {
  return apiFetch<Order>(`/orders/admin/order-number/${orderNumber}`);
}
export function getCouriers() {
  return apiFetch<Courier[]>('/orders/admin/couriers');
}
export function getOrderTracking(id: string) {
  return apiFetch<Record<string, unknown>>(`/orders/admin/${id}/tracking`);
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
    mutationFn: ({ id, status, notes }: { id: string; status: OrderStatus; notes?: string }) =>
      apiFetch<null>(`/orders/admin/${id}/status`, { method: 'PUT', body: { status, notes } }),
    onSuccess: (_d, { id }) => qc.invalidateQueries({ queryKey: qk.order(id) }),
  });
}

export function useUpdateOrderTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      courierCode,
      courierService,
      trackingNumber,
    }: {
      id: string;
      courierCode?: string;
      courierService?: string;
      trackingNumber?: string;
    }) =>
      apiFetch<null>(`/orders/admin/${id}/tracking`, {
        method: 'PUT',
        body: { courierCode, courierService, trackingNumber },
      }),
    onSuccess: (_d, { id }) => qc.invalidateQueries({ queryKey: qk.order(id) }),
  });
}

export function useSyncKomerce() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<Record<string, unknown>>(`/orders/admin/${id}/komerce/sync`, { method: 'POST', body: {} }),
    onSuccess: (_d, id) => qc.invalidateQueries({ queryKey: qk.order(id) }),
  });
}

export async function exportOrders(f: OrderFilters & { format?: 'csv' | 'xlsx' } = {}) {
  const blob = await apiDownload('/orders/admin/export', { ...f, format: f.format ?? 'csv' });
  downloadBlob(blob, `orders.${f.format ?? 'csv'}`);
}

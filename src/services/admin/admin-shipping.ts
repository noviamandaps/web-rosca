import { apiFetch, apiDownload, downloadBlob } from '../api-client';
import type { LabelOrderBulkPayload, Paginated, PendingPickupOrder, PickupPayload } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type PendingPickupFilters = {
  page?: number;
  limit?: number;
  warehouseId?: string;
};

export const qk = {
  pendingPickup: (f: PendingPickupFilters) => ['shipping', 'pending-pickup', f] as const,
};

export function getPendingPickup(f: PendingPickupFilters = {}) {
  return apiFetch<Paginated<PendingPickupOrder>>('/admin/warehouse/orders/pending-pickup', { params: f });
}

export function usePendingPickup(f: PendingPickupFilters) {
  return useQuery({ queryKey: qk.pendingPickup(f), queryFn: () => getPendingPickup(f) });
}

export function useRequestPickup() {
  return useMutation({
    mutationFn: (payload: PickupPayload) =>
      apiFetch<Record<string, unknown>>('/shipping/request-pickup', { method: 'POST', body: payload }),
  });
}

export function useRequestPickupBulk() {
  return useMutation({
    mutationFn: (payload: PickupPayload) =>
      apiFetch<Record<string, unknown>>('/shipping/request-pickup-bulk', { method: 'POST', body: payload }),
  });
}

export function useLabelOrderBulk() {
  return useMutation({
    mutationFn: async (payload: LabelOrderBulkPayload) => {
      // ponytail: chunk max 200, CHUNK_SIZE=50 — sesuai batas backend
      const CHUNK = 50;
      for (let i = 0; i < payload.orderNos.length; i += CHUNK) {
        const chunk = payload.orderNos.slice(i, i + CHUNK);
        const blob = await apiDownload('/shipping/label-order-bulk', undefined, { orderNos: chunk });
        downloadBlob(blob, `labels-${i + 1}-${i + chunk.length}.pdf`);
      }
    },
  });
}

export function useRetryFailedPickup() {
  return useMutation({
    mutationFn: (payload?: Record<string, unknown>) =>
      apiFetch<Record<string, unknown>>('/shipping/pickup/retry-failed', { method: 'POST', body: payload ?? {} }),
  });
}

export function useLabelOrder() {
  return useMutation({
    mutationFn: async (orderNo: string) => {
      const blob = await apiDownload('/shipping/label-order', { order_no: orderNo });
      downloadBlob(blob, `label-${orderNo}.pdf`);
    },
  });
}

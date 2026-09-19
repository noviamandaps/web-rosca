import { apiFetch } from '../api-client';
import type { Paginated, SaleEntry } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type SaleFilters = {
  status?: string;
  search?: string;
  productId?: string;
  isSale?: boolean;
  page?: number;
  limit?: number;
};

export type SaleInput = {
  salePrice?: number;
  discountPercent?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  salePurchaseLimit?: number;
};

export const qk = {
  sales: (f?: { status?: string; search?: string }) => ['sales', f ?? {}] as const,
  saleStats: ['sales', 'statistics'] as const,
  saleVariants: (f: SaleFilters) => ['sales', 'variants', f] as const,
};

export function getSales(f?: { status?: string; search?: string }) {
  return apiFetch<Paginated<SaleEntry>>('/admin/sales', { params: f });
}
export function getSalesStatistics() {
  return apiFetch<Record<string, number>>('/admin/sales/statistics');
}
export function getSaleVariants(f: SaleFilters = {}) {
  return apiFetch<Paginated<SaleEntry>>('/admin/sales/variants', { params: f });
}

export function useSales(f?: { status?: string; search?: string }) {
  return useQuery({ queryKey: qk.sales(f), queryFn: () => getSales(f) });
}
export function useSalesStatistics() {
  return useQuery({ queryKey: qk.saleStats, queryFn: getSalesStatistics });
}
export function useSaleVariants(f: SaleFilters) {
  return useQuery({ queryKey: qk.saleVariants(f), queryFn: () => getSaleVariants(f) });
}

export function useSetVariantSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, ...input }: SaleInput & { variantId: string }) =>
      apiFetch<null>(`/admin/sales/variants/${variantId}`, { method: 'POST', body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }),
  });
}

export function useRemoveVariantSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) =>
      apiFetch<null>(`/admin/sales/variants/${variantId}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }),
  });
}

export function useSetProductSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, ...input }: SaleInput & { productId: string }) =>
      apiFetch<null>(`/admin/sales/products/${productId}`, { method: 'POST', body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }),
  });
}

export function useRemoveProductSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      apiFetch<null>(`/admin/sales/products/${productId}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }),
  });
}

export function useBulkSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      productIds?: string[];
      categoryIds?: string[];
      discountPercent: number;
      saleStartDate: string;
      saleEndDate: string;
      setSale?: boolean;
      salePrice?: number;
    }) => apiFetch<null>('/admin/sales/bulk', { method: 'POST', body: payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }),
  });
}

export function useAutoSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (kind: 'auto-expire' | 'auto-start') =>
      apiFetch<null>(`/admin/sales/${kind}`, { method: 'POST', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }),
  });
}

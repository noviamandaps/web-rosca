import { apiFetch } from '../api-client';
import type {
  SaleProduct,
  SaleStatistics,
  SaleVariantsListResult,
  SaleVariantsOverviewResult,
} from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type SaleStatus = 'active' | 'expired' | 'upcoming' | 'all';

export type SaleListFilters = {
  status?: SaleStatus;
  page?: number;
  limit?: number; // max 100, def 20
  search?: string;
};

export type SaleVariantFilters = {
  productId?: string;
  isSale?: boolean;
  status?: SaleStatus;
  page?: number;
  limit?: number;
};

export type SaleOverviewFilters = {
  startDate?: string;
  endDate?: string;
  compareStartDate?: string;
  compareEndDate?: string;
  productId?: string;
  isSale?: boolean;
  status?: SaleStatus;
  search?: string;
  page?: number;
  limit?: number; // max 200, def 50
};

export type SaleInput = {
  salePrice?: number;
  discountPercent?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  salePurchaseLimit?: number;
  salePurchaseLimitPerUser?: number;
};

export const qk = {
  sales: (f: SaleListFilters) => ['sales', 'list', f] as const,
  saleStats: ['sales', 'statistics'] as const,
  saleVariants: (f: SaleVariantFilters) => ['sales', 'variants', f] as const,
  saleOverview: (f: SaleOverviewFilters) => ['sales', 'overview', f] as const,
};

export function getSales(f: SaleListFilters = {}) {
  return apiFetch<SaleVariantsListResult & { products?: SaleProduct[] }>('/admin/sales', { params: f });
}

export function getSalesStatistics() {
  return apiFetch<SaleStatistics>('/admin/sales/statistics');
}

export function getSaleVariants(f: SaleVariantFilters = {}) {
  return apiFetch<SaleVariantsListResult>('/admin/sales/variants', { params: f });
}

export function getSaleVariantsOverview(f: SaleOverviewFilters = {}) {
  return apiFetch<SaleVariantsOverviewResult>('/admin/sales/variants/overview', { params: f });
}

export function useSales(f: SaleListFilters = {}) {
  return useQuery({ queryKey: qk.sales(f), queryFn: () => getSales(f) });
}
export function useSalesStatistics() {
  return useQuery({ queryKey: qk.saleStats, queryFn: getSalesStatistics });
}
export function useSaleVariants(f: SaleVariantFilters) {
  return useQuery({ queryKey: qk.saleVariants(f), queryFn: () => getSaleVariants(f) });
}
export function useSaleVariantsOverview(f: SaleOverviewFilters = {}) {
  return useQuery({ queryKey: qk.saleOverview(f), queryFn: () => getSaleVariantsOverview(f) });
}

export function useSetVariantSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, ...input }: SaleInput & { variantId: string }) =>
      apiFetch<null>(`/admin/sales/variants/${variantId}`, { method: 'POST', body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }),
  });
}

export function useSetVariantsSaleBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entries: (SaleInput & { variantId: string })[]) =>
      apiFetch<null>('/admin/sales/variants/batch', { method: 'POST', body: { entries } }),
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
      discountPercent?: number;
      salePrice?: number;
      saleStartDate: string;
      saleEndDate: string;
      setSale?: boolean;
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

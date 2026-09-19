import { apiFetch, apiDownload, downloadBlob } from '../api-client';
import type {
  AbandonedCartsResult,
  DashboardSummary,
  RevenuePoint,
  TopProductsResult,
  TrafficPoint,
  UsersStat,
} from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';

export type PeriodPreset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'last_year'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days';

export type CompareWith = 'last_month' | 'last_year' | 'previous_period';

export type DashboardParams = {
  months?: number;
  days?: number;
  limit?: number;
  period?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'hour';
  compareWith?: CompareWith;
  level?: string;
  page?: number;
};

export const qk = {
  summary: ['dashboard', 'summary'] as const,
  revenue: (p: DashboardParams) => ['dashboard', 'revenue', p] as const,
  users: (p: DashboardParams) => ['dashboard', 'users', p] as const,
  traffic: (p: DashboardParams) => ['dashboard', 'traffic', p] as const,
  topProducts: (p: DashboardParams) => ['dashboard', 'top-products', p] as const,
  slowProducts: (p: DashboardParams) => ['dashboard', 'slow-products', p] as const,
  customerInsights: (p: DashboardParams) => ['dashboard', 'customer-insights', p] as const,
  conversion: (p: DashboardParams) => ['dashboard', 'conversion', p] as const,
  abandonedCarts: (p: DashboardParams) => ['dashboard', 'abandoned-carts', p] as const,
  sales: (p: DashboardParams) => ['dashboard', 'sales', p] as const,
  orderOperations: (p: DashboardParams) => ['dashboard', 'order-operations', p] as const,
  customers: (p: DashboardParams) => ['dashboard', 'customers', p] as const,
  analytics: (path: string, p: DashboardParams) => ['dashboard', 'analytics', path, p] as const,
};

export function getSummary() {
  return apiFetch<DashboardSummary>('/admin/dashboard/summary');
}

export function getRevenue(p: DashboardParams = {}) {
  return apiFetch<{ monthly: RevenuePoint[]; total: number; totalOrders: number; avgOrderValue: number; growthRate: number }>(
    '/admin/dashboard/revenue',
    { params: p }
  );
}

export function getUsersStat(p: DashboardParams = {}) {
  return apiFetch<{
    totalUsers: number;
    newUsersThisMonth: number;
    monthly: UsersStat[];
    growthRate: number;
  }>('/admin/dashboard/users', { params: p });
}

export function getTraffic(p: DashboardParams = {}) {
  // ponytail: shape response /traffic belum terdokumentasi di readme — tetap toleran
  return apiFetch<TrafficPoint[]>('/admin/dashboard/traffic', { params: p });
}

export function getTopProducts(p: DashboardParams = {}) {
  return apiFetch<TopProductsResult>('/admin/dashboard/top-products', { params: p });
}

export function getSlowProducts(p: DashboardParams = {}) {
  return apiFetch<TopProductsResult>('/admin/dashboard/slow-products', { params: p });
}

export function getCustomerInsights(p: DashboardParams = {}) {
  return apiFetch<{
    monthly: { month: number; year: number; newCustomers: number; returningCustomers: number; totalCustomers: number }[];
    totals: { newCustomers: number; returningCustomers: number; totalCustomers: number };
  }>('/admin/dashboard/customer-insights', { params: p });
}

export function getConversion(p: DashboardParams = {}) {
  return apiFetch<{
    period?: string;
    overall?: { totalVisitors: number; totalOrders: number; conversionRate: number };
    data?: { period: string; visitors: number; orders: number; conversionRate: number }[];
  }>('/admin/dashboard/conversion', { params: p });
}

export function getAbandonedCarts(p: DashboardParams = {}) {
  return apiFetch<AbandonedCartsResult>('/admin/dashboard/abandoned-carts', { params: p });
}

export function getSalesAnalytics(p: DashboardParams = {}) {
  return apiFetch<{
    period?: string;
    data: {
      periodKey: string;
      gmv: number;
      netSales: number;
      discounts: number;
      refunds: number;
      shippingCost: number;
      orderCount: number;
      aov: number;
    }[];
    totals: { gmv: number; netSales: number; discounts: number; refunds: number; shippingCost: number; totalOrders: number; aov: number };
    growthRate: number;
  }>('/admin/dashboard/sales', { params: p });
}

export function getOrderOperations(p: DashboardParams = {}) {
  // ponytail: shape order-operations nested kompleks — dirender generik di halaman
  return apiFetch<Record<string, unknown>>('/admin/dashboard/order-operations', { params: p });
}

export function getCustomers(p: DashboardParams & { search?: string; sortBy?: string; sortOrder?: string; isActive?: boolean; tier?: string } = {}) {
  return apiFetch<{
    customers: {
      id: string;
      name?: string;
      email: string;
      phone?: string | null;
      city?: string | null;
      isActive?: boolean;
      membershipLevel?: string;
      points?: number;
      createdAt?: string;
      totalOrders?: number;
      totalSpending?: number;
      averageOrderValue?: number;
      lastOrderDate?: string | null;
    }[];
    pagination: import('@/lib/api-types').Pagination;
  }>('/admin/dashboard/customers', { params: p });
}

// --- Analytics ---
export type AnalyticsPath =
  | 'analytics/coupons'
  | 'analytics/categories'
  | 'analytics/cart-recovery'
  | 'analytics/payments'
  | 'analytics/geographic'
  | 'analytics/demographics'
  | 'products/performance'
  | 'variants/performance'
  // ponytail: dashboard paths dengan response generik — dirender apa adanya di halaman analytics
  | 'customer-insights'
  | 'conversion'
  | 'slow-products'
  | 'order-operations'
  | 'abandoned-carts';

export function getAnalytics(
  path: AnalyticsPath,
  p: DashboardParams & {
    compareWith?: CompareWith;
    productId?: string;
    warehouseId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    includeInactive?: boolean;
    onlyOrdered?: boolean;
  } = {}
) {
  return apiFetch<Record<string, unknown>>(`/admin/dashboard/${path}`, { params: p });
}

export function getVariantDetail(
  variantId: string,
  p: DashboardParams & { groupBy?: 'day' | 'week' | 'month'; recentLimit?: number } = {}
) {
  return apiFetch<Record<string, unknown>>(`/admin/dashboard/variants/${variantId}/detail`, { params: p });
}

// --- Exports ---
export type ExportFormat = 'csv' | 'json' | 'xlsx';

export async function exportDashboard(path: 'sales' | 'users' | 'inventory' | 'customers' | 'dashboard', p: DashboardParams & { format?: ExportFormat; columns?: string; warehouseId?: string; storeType?: string; topProductsLimit?: number } = {}) {
  const blob = await apiDownload(`/admin/dashboard/export/${path}`, p);
  const ext = p.format ?? 'csv';
  downloadBlob(blob, `${path}.${ext === 'json' ? 'json' : ext}`);
}

export async function exportPerformance(p: DashboardParams & { format?: ExportFormat; columns?: string; level?: string } = {}) {
  const blob = await apiDownload('/admin/dashboard/products/performance/export', p);
  downloadBlob(blob, `performance.${p.format ?? 'xlsx'}`);
}

export function useSummary() {
  return useQuery({ queryKey: qk.summary, queryFn: getSummary, staleTime: 60_000 });
}
export function useRevenue(p: DashboardParams = {}) {
  return useQuery({ queryKey: qk.revenue(p), queryFn: () => getRevenue(p), staleTime: 60_000 });
}
export function useUsersStat(p: DashboardParams = {}) {
  return useQuery({ queryKey: qk.users(p), queryFn: () => getUsersStat(p), staleTime: 60_000 });
}
export function useTraffic(p: DashboardParams = {}) {
  return useQuery({ queryKey: qk.traffic(p), queryFn: () => getTraffic(p), staleTime: 60_000 });
}
export function useTopProducts(p: DashboardParams = {}) {
  return useQuery({ queryKey: qk.topProducts(p), queryFn: () => getTopProducts(p), staleTime: 60_000 });
}
export function useSlowProducts(p: DashboardParams = {}) {
  return useQuery({ queryKey: qk.slowProducts(p), queryFn: () => getSlowProducts(p), staleTime: 60_000 });
}
export function useCustomerInsights(p: DashboardParams = {}) {
  return useQuery({ queryKey: qk.customerInsights(p), queryFn: () => getCustomerInsights(p), staleTime: 60_000 });
}
export function useConversion(p: DashboardParams = {}) {
  return useQuery({ queryKey: qk.conversion(p), queryFn: () => getConversion(p), staleTime: 60_000 });
}
export function useAbandonedCarts(p: DashboardParams = {}) {
  return useQuery({ queryKey: qk.abandonedCarts(p), queryFn: () => getAbandonedCarts(p), staleTime: 60_000 });
}
export function useSalesAnalytics(p: DashboardParams = {}) {
  return useQuery({ queryKey: qk.sales(p), queryFn: () => getSalesAnalytics(p), staleTime: 60_000 });
}
export function useOrderOperations(p: DashboardParams = {}) {
  return useQuery({ queryKey: qk.orderOperations(p), queryFn: () => getOrderOperations(p), staleTime: 60_000 });
}
export function useCustomers(p: Parameters<typeof getCustomers>[0] = {}) {
  return useQuery({ queryKey: qk.customers(p), queryFn: () => getCustomers(p!), staleTime: 60_000 });
}
export function useAnalytics(path: AnalyticsPath, p: Parameters<typeof getAnalytics>[1] = {}) {
  return useQuery({ queryKey: qk.analytics(path, p), queryFn: () => getAnalytics(path, p), staleTime: 60_000 });
}

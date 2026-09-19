import { apiFetch, apiDownload, downloadBlob } from '../api-client';
import type { DashboardSummary, RevenuePoint, TopProduct, TrafficPoint, UsersStat } from '@/lib/api-types';

export const qk = {
  summary: (params?: Record<string, string>) => ['dashboard', 'summary', params ?? {}] as const,
  revenue: (params?: Record<string, string>) => ['dashboard', 'revenue', params ?? {}] as const,
  users: (params?: Record<string, string>) => ['dashboard', 'users', params ?? {}] as const,
  traffic: (params?: Record<string, string>) => ['dashboard', 'traffic', params ?? {}] as const,
  topProducts: (params?: Record<string, string>) => ['dashboard', 'top-products', params ?? {}] as const,
};

export function getSummary(params?: Record<string, string>) {
  return apiFetch<DashboardSummary>('/admin/dashboard/summary', { params });
}
export function getRevenue(params?: Record<string, string>) {
  return apiFetch<RevenuePoint[]>('/admin/dashboard/revenue', { params });
}
export function getUsersStat(params?: Record<string, string>) {
  return apiFetch<UsersStat[]>('/admin/dashboard/users', { params });
}
export function getTraffic(params?: Record<string, string>) {
  return apiFetch<TrafficPoint[]>('/admin/dashboard/traffic', { params });
}
export function getTopProducts(params?: Record<string, string>) {
  return apiFetch<TopProduct[]>('/admin/dashboard/top-products', { params });
}

// ponytail: bentuk response analytics bervariasi per endpoint — Record<string, unknown> sampai diverifikasi
export function getAnalytics(path: string, params?: Record<string, string>) {
  return apiFetch<Record<string, unknown>>(`/admin/dashboard/${path}`, { params });
}

export async function exportDashboard(path: string, params?: Record<string, string>) {
  const blob = await apiDownload(`/admin/dashboard/export/${path}`, params);
  downloadBlob(blob, `${path}.xlsx`);
}

export async function exportPerformance(params?: Record<string, string>) {
  const blob = await apiDownload('/admin/dashboard/products/performance/export', params);
  downloadBlob(blob, 'performance.xlsx');
}

import { apiFetch } from '../api-client';
import type { Paginated, PublicProduct, ReviewRow, ReviewInput } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type ProductFilters = {
  page?: number;
  limit?: number;
  search?: string;
  storeType?: 'ROSCA_INDONESIA' | 'ROSCA_ONE';
};

export const qk = {
  products: (f: ProductFilters) => ['products', f] as const,
  product: (slug: string) => ['products', 'detail', slug] as const,
  newArrivals: ['products', 'new-arrivals'] as const,
  bestSelling: ['products', 'best-selling'] as const,
  productReviews: (slug: string) => ['products', 'reviews', slug] as const,
};

// ponytail: response /products bisa data[].{data} / array — unwrap adaptif
function unwrapList<T>(res: T[] | Paginated<T> | { data: T[] }): T[] {
  if (Array.isArray(res)) return res;
  if ('data' in res) return res.data;
  return (res as unknown as { data?: T[] }).data ?? [];
}

async function list<T>(endpoint: string, f?: Record<string, unknown>) {
  return unwrapList(await apiFetch<T[] | Paginated<T> | { data: T[] }>(endpoint, { params: f }));
}

export function getProducts(f: ProductFilters = {}) {
  return list<PublicProduct>('/products', f);
}
export function getProduct(slug: string) {
  return apiFetch<PublicProduct>(`/products/${slug}`);
}
export function getNewArrivals() {
  return list<PublicProduct>('/products/new-arrivals');
}
export function getBestSelling() {
  return list<PublicProduct>('/products/best-selling');
}
export function getProductReviews(slug: string) {
  return list<ReviewRow>(`/products/${slug}/reviews`);
}
export function getAboutUs() {
  return apiFetch<unknown>('/about-us');
}

export function useProducts(f: ProductFilters) {
  return useQuery({ queryKey: qk.products(f), queryFn: () => getProducts(f), staleTime: 60_000 });
}
export function useProduct(slug: string) {
  return useQuery({ queryKey: qk.product(slug), queryFn: () => getProduct(slug), enabled: !!slug, staleTime: 60_000 });
}
export function useNewArrivals() {
  return useQuery({ queryKey: qk.newArrivals, queryFn: getNewArrivals, staleTime: 300_000 });
}
export function useBestSelling() {
  return useQuery({ queryKey: qk.bestSelling, queryFn: getBestSelling, staleTime: 300_000 });
}
export function useProductReviews(slug: string) {
  return useQuery({ queryKey: qk.productReviews(slug), queryFn: () => getProductReviews(slug), enabled: !!slug });
}

export function useAddReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewInput) =>
      apiFetch<unknown>('/reviews', { method: 'POST', body: payload }),
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['products', 'detail'] }),
  });
}

export function contact(payload: { fullName: string; email: string; subject: string; phone: string; message: string }) {
  return apiFetch<null>('/contact', { method: 'POST', body: payload });
}

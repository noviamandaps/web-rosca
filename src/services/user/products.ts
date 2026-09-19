import { apiFetch } from '../api-client';
import type { Pagination, PublicProduct, ReviewRow, ReviewInput } from '@/lib/api-types';
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

// ponytail: list endpoint balik { products, pagination } atau { data } / array — unwrap adaptif (audit staging)
function unwrapList<T>(res: T[] | { data?: T[]; products?: T[]; reviews?: T[] }): T[] {
  if (Array.isArray(res)) return res;
  return res.products ?? res.reviews ?? res.data ?? [];
}

export type ProductsListResult = { products: PublicProduct[]; pagination?: Pagination };

async function list<T>(endpoint: string, f?: Record<string, unknown>) {
  return unwrapList(await apiFetch<T[] | { data?: T[]; products?: T[]; reviews?: T[] }>(endpoint, { params: f }));
}

export function getProducts(f: ProductFilters = {}) {
  return list<PublicProduct>('/products', f);
}
export function getProduct(slug: string) {
  // detail balik { product } (audit staging)
  return apiFetch<{ product: PublicProduct } | PublicProduct>(`/products/${slug}`).then((r) =>
    (r as { product?: PublicProduct }).product ?? (r as PublicProduct)
  );
}
export function getNewArrivals() {
  return list<PublicProduct>('/products/new-arrivals');
}
export function getBestSelling() {
  return list<PublicProduct>('/products/best-selling');
}
export function getFeatured() {
  return list<PublicProduct>('/products/featured');
}
export function getSale() {
  return list<PublicProduct>('/products/sale');
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

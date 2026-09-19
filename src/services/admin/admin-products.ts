import { apiFetch } from '../api-client';
import type { Category, CreateProductPayload, Paginated, Product } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type ProductFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export const qk = {
  products: (f: ProductFilters) => ['products', f] as const,
  product: (id: string) => ['products', 'detail', id] as const,
  categories: ['categories'] as const,
};

export function getProducts(f: ProductFilters = {}) {
  return apiFetch<Paginated<Product>>('/admin/products', { params: f });
}
export function getProduct(id: string) {
  return apiFetch<Product>(`/admin/products/${id}`);
}
export function getCategories() {
  return apiFetch<Paginated<Category>>('/admin/categories', { params: { limit: 100 } });
}

export function useProducts(f: ProductFilters) {
  return useQuery({ queryKey: qk.products(f), queryFn: () => getProducts(f) });
}
export function useProduct(id: string) {
  return useQuery({ queryKey: qk.product(id), queryFn: () => getProduct(id), enabled: !!id });
}
export function useCategories() {
  return useQuery({ queryKey: qk.categories, queryFn: getCategories, staleTime: Infinity });
}

function productFormData(data: CreateProductPayload, images: File[]) {
  const fd = new FormData();
  fd.append('data', JSON.stringify(data));
  images.slice(0, 5).forEach((img) => fd.append('images', img));
  return fd;
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, images }: { data: CreateProductPayload; images: File[] }) =>
      apiFetch<Product>('/admin/products', { method: 'POST', formData: productFormData(data, images) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, images }: { id: string; data: CreateProductPayload; images: File[] }) =>
      apiFetch<Product>(`/admin/products/${id}`, { method: 'PUT', formData: productFormData(data, images) }),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: qk.product(id) });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/admin/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

function useToggle(path: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/admin/products/${id}/${path}`, { method: 'PATCH' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export const useToggleActive = () => useToggle('toggle-active');
export const useToggleFeatured = () => useToggle('toggle-featured');
export const useToggleNewArrival = () => useToggle('toggle-new-arrival');
export const useToggleBestSelling = () => useToggle('toggle-best-selling');

export function useSetPrimaryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      apiFetch<null>(`/admin/products/${productId}/images/primary`, { method: 'PATCH', body: { imageId } }),
    onSuccess: (_d, { productId }) => qc.invalidateQueries({ queryKey: qk.product(productId) }),
  });
}

export function useDeleteImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      apiFetch<null>(`/admin/products/${productId}/images/${imageId}`, { method: 'DELETE' }),
    onSuccess: (_d, { productId }) => qc.invalidateQueries({ queryKey: qk.product(productId) }),
  });
}

export function useReorderImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, images }: { productId: string; images: { id: string; sortOrder: number }[] }) =>
      apiFetch<null>(`/admin/products/${productId}/images/reorder`, { method: 'PUT', body: { images } }),
    onSuccess: (_d, { productId }) => qc.invalidateQueries({ queryKey: qk.product(productId) }),
  });
}

export function uploadSingle(file: File) {
  const fd = new FormData();
  fd.append('file', file);
  return apiFetch<{ url?: string; data?: { url?: string } }>('/upload/single', { method: 'POST', formData: fd });
}

import { apiFetch } from '../api-client';
import type { Address, AddressListResult, CartResult, PublicProduct } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const qk = {
  cart: ['cart'] as const,
  wishlist: ['wishlist'] as const,
  addresses: ['addresses'] as const,
};

export function getCart() {
  return apiFetch<CartResult>('/cart');
}

export function getAddresses() {
  return apiFetch<AddressListResult>('/addresses');
}

export function useCart() {
  return useQuery({ queryKey: qk.cart, queryFn: getCart, enabled: !!token() });
}

function token() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { productId: string; variantId: string; quantity: number; isEngrave?: boolean; engraveText?: string }) =>
      apiFetch<null>('/cart/items', { method: 'POST', body: payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.cart }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      apiFetch<null>(`/cart/items/${cartItemId}`, { method: 'PUT', body: { quantity } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.cart }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: string) =>
      apiFetch<null>(`/cart/items/${cartItemId}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.cart }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<null>('/cart', { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.cart }),
  });
}

export function useWishlist() {
  return useQuery({ queryKey: qk.wishlist, queryFn: () => apiFetch<Record<string, unknown>>('/wishlist'), enabled: !!token() });
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, wishlistId }: { productId: string; wishlistId?: string }) =>
      apiFetch<null>(wishlistId ? `/wishlist/${wishlistId}` : '/wishlist', {
        method: wishlistId ? 'DELETE' : 'POST',
        body: { productId },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.wishlist }),
  });
}

export function checkWishlist(productId: string) {
  return apiFetch<{ exists?: boolean }>(`/wishlist/check/${productId}`);
}

export function useAddresses() {
  return useQuery({ queryKey: qk.addresses, queryFn: getAddresses, enabled: !!token() });
}

export function useSaveAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: Partial<Address> }) =>
      apiFetch<unknown>(id ? `/addresses/${id}` : '/addresses', {
        method: id ? 'PUT' : 'POST',
        body: data,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.addresses }),
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) =>
      apiFetch<null>(`/addresses/${addressId}/default`, { method: 'PATCH', body: { addressId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.addresses }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/addresses/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.addresses }),
  });
}

// ponytail: GET /addresses dipanggil via raw fetch di page — jangan pakai hook di luar komponen
export type { PublicProduct };

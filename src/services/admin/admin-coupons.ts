import { apiFetch } from '../api-client';
import type { Coupon } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const qk = {
  coupons: ['coupons'] as const,
};

// ponytail: shape response daftar coupon diasumsikan { data } / array — sesuaikan saat cek nyata
export function useCoupons() {
  return useQuery({
    queryKey: qk.coupons,
    queryFn: async () => {
      const res = await apiFetch<Coupon[] | { data: Coupon[] }>('/admin/coupons');
      return Array.isArray(res) ? res : res.data;
    },
  });
}

export function couponFormData(data: Partial<Coupon>, image?: File) {
  const fd = new FormData();
  fd.append('data', JSON.stringify(data));
  if (image) fd.append('image', image);
  return fd;
}

export function useSaveCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, image }: { id?: string; data: Partial<Coupon>; image?: File }) =>
      apiFetch<null>(id ? `/admin/coupons/${id}` : '/admin/coupons', {
        method: id ? 'PUT' : 'POST',
        formData: couponFormData(data, image),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.coupons }),
  });
}

export function useToggleCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<null>(`/admin/coupons/${id}/toggle-active`, { method: 'PATCH', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.coupons }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/admin/coupons/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.coupons }),
  });
}

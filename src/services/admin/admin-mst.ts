import { apiFetch } from '../api-client';
import type { MstBank, MstVolume } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const qk = {
  volumes: ['mst', 'volumes'] as const,
  banks: ['mst', 'banks'] as const,
};

export function useVolumes() {
  return useQuery({ queryKey: qk.volumes, queryFn: () => apiFetch<MstVolume[]>('/admin/mst-volumes') });
}

export function useSaveVolume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: { value: number; sortOrder?: number } }) =>
      apiFetch<null>(id ? `/admin/mst-volumes/${id}` : '/admin/mst-volumes', {
        method: id ? 'PATCH' : 'POST',
        body: data,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.volumes }),
  });
}

export function useDeleteVolume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/admin/mst-volumes/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.volumes }),
  });
}

export function useToggleVolume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/admin/mst-volumes/${id}/toggle`, { method: 'PATCH', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.volumes }),
  });
}

export function useBanks() {
  return useQuery({ queryKey: qk.banks, queryFn: () => apiFetch<MstBank[]>('/admin/mst-banks') });
}

export function bankFormData(data: { name: string; code?: string; sortOrder?: number }, image?: File) {
  const fd = new FormData();
  fd.append('name', data.name);
  if (data.code) fd.append('code', data.code);
  if (data.sortOrder !== undefined) fd.append('sortOrder', String(data.sortOrder));
  if (image) fd.append('image', image);
  return fd;
}

export function useSaveBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, image }: { id?: string; data: { name: string; code?: string; sortOrder?: number }; image?: File }) =>
      apiFetch<null>(id ? `/admin/mst-banks/${id}` : '/admin/mst-banks', {
        method: id ? 'PATCH' : 'POST',
        formData: bankFormData(data, image),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.banks }),
  });
}

export function useDeleteBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/admin/mst-banks/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.banks }),
  });
}

export function useToggleBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/admin/mst-banks/${id}/toggle`, { method: 'PATCH', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.banks }),
  });
}

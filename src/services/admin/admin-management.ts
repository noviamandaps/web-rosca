import { apiFetch } from '../api-client';
import type { AdminUser, Paginated } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type AdminFilters = {
  page?: number;
  limit?: number;
};

export const qk = {
  admins: (f: AdminFilters) => ['admins', f] as const,
  myPaths: ['rbac', 'my-paths'] as const,
};

export function getAdmins(f: AdminFilters = {}) {
  return apiFetch<Paginated<AdminUser>>('/admin/management/admins', { params: f });
}
export function useAdmins(f: AdminFilters) {
  return useQuery({ queryKey: qk.admins(f), queryFn: () => getAdmins(f) });
}

export function useSaveAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: { email: string; name?: string; role: string; isActive: boolean; password?: string } }) =>
      apiFetch<null>(id ? `/admin/management/admins/${id}` : '/admin/management/admins', {
        method: id ? 'PUT' : 'POST',
        body: data,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admins'] }),
  });
}

export function useDeleteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/admin/management/admins/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admins'] }),
  });
}

export function useMyPaths() {
  return useQuery({ queryKey: qk.myPaths, queryFn: () => apiFetch<string[]>('/admin/rbac/my-paths'), staleTime: Infinity });
}

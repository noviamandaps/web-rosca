import { apiFetch, apiDownload, downloadBlob } from '../api-client';
import type { UsersListResult } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type UserFilters = {
  page?: number; // def 1
  limit?: number; // max 100, def 20
  search?: string;
  isActive?: boolean;
};

export const qk = {
  users: (f: UserFilters) => ['users', f] as const,
};

export function getUsers(f: UserFilters = {}) {
  return apiFetch<UsersListResult>('/users', { params: f });
}

export function useUsers(f: UserFilters) {
  return useQuery({ queryKey: qk.users(f), queryFn: () => getUsers(f) });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<null>(`/users/${id}/toggle-active`, { method: 'PATCH', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export async function exportUsers(f: { startDate?: string; endDate?: string; format?: 'csv' | 'json' | 'xlsx' } = {}) {
  const blob = await apiDownload('/admin/dashboard/export/users', f);
  downloadBlob(blob, `users.${f.format ?? 'xlsx'}`);
}

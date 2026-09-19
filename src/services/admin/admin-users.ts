import { apiFetch, apiDownload, downloadBlob } from '../api-client';
import type { Paginated, UserRow } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';

export type UserFilters = {
  page?: number;
  limit?: number;
};

export const qk = {
  users: (f: UserFilters) => ['users', f] as const,
};

export function getUsers(f: UserFilters = {}) {
  return apiFetch<Paginated<UserRow>>('/users', { params: f });
}

export function useUsers(f: UserFilters) {
  return useQuery({ queryKey: qk.users(f), queryFn: () => getUsers(f) });
}

export async function exportUsers() {
  const blob = await apiDownload('/admin/dashboard/export/users', { format: 'xlsx' });
  downloadBlob(blob, 'users.xlsx');
}

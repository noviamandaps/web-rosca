import { apiFetch } from '../api-client';
import type { Paginated, ReturnItem, ReturnStatus } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type ReturnFilters = {
  page?: number;
  limit?: number;
  returnStatus?: ReturnStatus;
  condition?: string;
  orderId?: string;
};

export const qk = {
  returns: (f: ReturnFilters) => ['returns', f] as const,
  return: (id: string) => ['returns', 'detail', id] as const,
  returnStats: ['returns', 'statistics'] as const,
};

export function getReturns(f: ReturnFilters = {}) {
  return apiFetch<Paginated<ReturnItem>>('/admin/returns', { params: f });
}
export function getReturn(id: string) {
  return apiFetch<ReturnItem>(`/admin/returns/${id}`);
}
export function getReturnStatistics() {
  return apiFetch<Record<string, number>>('/admin/returns/statistics');
}

export function useReturns(f: ReturnFilters) {
  return useQuery({ queryKey: qk.returns(f), queryFn: () => getReturns(f) });
}
export function useReturn(id: string) {
  return useQuery({ queryKey: qk.return(id), queryFn: () => getReturn(id), enabled: !!id });
}
export function useReturnStatistics() {
  return useQuery({ queryKey: qk.returnStats, queryFn: getReturnStatistics });
}

function useReturnAction<T>(path: string, method: 'PUT' | 'POST' = 'PUT') {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body?: T }) =>
      apiFetch<null>(`/admin/returns/${id}/${path}`, { method, body: body ?? {} }),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: qk.return(id) });
      qc.invalidateQueries({ queryKey: ['returns'] });
    },
  });
}

export const useStartQc = () => useReturnAction<undefined>('start-qc');
export const useQcResult = () =>
  useReturnAction<{ condition: string; notes?: string; images?: string[] }>('qc-result');
export const useProcessReturn = () =>
  useReturnAction<{
    returnStatus: 'APPROVED' | 'REJECTED';
    qcNotes?: string;
    refundAmount?: number;
    returnShippingCost?: number;
  }>('process');
export const useCompleteReturn = () =>
  useReturnAction<{ physicalQcCondition: string; physicalQcNotes?: string; restock?: boolean }>('complete');
export const useRefundTransfer = () =>
  useReturnAction<{ refundProofUrl: string; refundReferenceId?: string }>('refund-transfer');
export const useCloseReturn = () => useReturnAction<undefined>('close');

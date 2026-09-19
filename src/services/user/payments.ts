import { apiFetch } from '../api-client';
import type {
  BanksResult,
  Membership,
  NotificationsResult,
  PaymentFeesResult,
  PaymentResult,
  UserCoupon,
} from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type PaymentMethod = 'VIRTUAL_ACCOUNT' | 'EWALLET' | 'QR_CODE' | 'CREDIT_CARD' | string;

export const qk = {
  banks: ['payments', 'banks'] as const,
  membership: ['membership'] as const,
  coupons: ['coupons'] as const,
};

export function useBanks() {
  return useQuery({ queryKey: qk.banks, queryFn: () => apiFetch<BanksResult>('/payments/banks'), enabled: !!token(), staleTime: Infinity });
}

function token() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

export function getPaymentFees(amount: number) {
  return apiFetch<PaymentFeesResult>('/payments/fees', { params: { amount } });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (payload: { orderId: string; paymentMethod: PaymentMethod; bankCode?: string; channelCode?: string }) =>
      apiFetch<PaymentResult>('/payments/create', { method: 'POST', body: payload }),
  });
}

export function getPaymentStatus(paymentId: string) {
  return apiFetch<Record<string, unknown>>(`/payments/${paymentId}/status`);
}

export function useSimulatePayment() {
  return useMutation({
    mutationFn: (paymentId: string) =>
      apiFetch<null>('/payments/simulate', { method: 'POST', body: { paymentId } }),
  });
}

export function useMembership() {
  return useQuery({ queryKey: qk.membership, queryFn: () => apiFetch<Membership>('/membership'), enabled: !!token() });
}

export function useCoupons() {
  return useQuery({
    queryKey: qk.coupons,
    queryFn: async () => {
      const res = await apiFetch<{ coupons: UserCoupon[]; pagination?: unknown }>('/coupons');
      return res.coupons ?? [];
    },
    enabled: !!token(),
  });
}

export function useClaimCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/coupons/${id}/claim`, { method: 'POST', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.coupons }),
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: (payload: { code: string; orderAmount: number; shippingCost?: number; addressId?: string }) =>
      apiFetch<Record<string, unknown>>('/coupons/validate', { method: 'POST', body: payload }),
  });
}

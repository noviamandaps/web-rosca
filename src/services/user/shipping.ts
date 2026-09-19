import { apiFetch } from '../api-client';
import type {
  CheckoutShippingResult,
  CityRow,
  CourierRow,
  DistrictRow,
  ProvinceRow,
} from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';

export const qk = {
  provinces: ['shipping', 'provinces'] as const,
  couriers: ['shipping', 'couriers'] as const,
  checkoutShipping: (f: CheckoutShippingParams) => ['shipping', 'checkout', f] as const,
};

export type CheckoutShippingParams = {
  addressId: string;
  cartItemIds: string[];
  itemValue: number;
};

export function useProvinces() {
  return useQuery({
    queryKey: qk.provinces,
    queryFn: async () => {
      const res = await apiFetch<ProvinceRow[] | { data: ProvinceRow[] }>('/shipping/provinces');
      return Array.isArray(res) ? res : res.data;
    },
    staleTime: Infinity,
  });
}

export function useCities(provinceId?: string) {
  return useQuery({
    queryKey: ['shipping', 'cities', provinceId],
    queryFn: async () => {
      const res = await apiFetch<CityRow[] | { data: CityRow[] }>(`/shipping/cities/${provinceId}`);
      return Array.isArray(res) ? res : res.data;
    },
    enabled: !!provinceId,
    staleTime: Infinity,
  });
}

export function useDistricts(cityId?: string) {
  return useQuery({
    queryKey: ['shipping', 'districts', cityId],
    queryFn: async () => {
      const res = await apiFetch<DistrictRow[] | { data: DistrictRow[] }>(`/shipping/districts/${cityId}`);
      return Array.isArray(res) ? res : res.data;
    },
    enabled: !!cityId,
    staleTime: Infinity,
  });
}

export function useCouriers() {
  return useQuery({
    queryKey: qk.couriers,
    queryFn: () => apiFetch<CourierRow[] | { data: CourierRow[] }>('/shipping/couriers'),
    staleTime: Infinity,
  });
}

export function useCheckoutShipping(p: CheckoutShippingParams | null) {
  return useQuery({
    queryKey: qk.checkoutShipping(p ?? ({} as CheckoutShippingParams)),
    queryFn: () =>
      apiFetch<CheckoutShippingResult>('/shipping/checkout-shipping', {
        params: p as Record<string, unknown>,
      }),
    enabled: !!(p?.addressId && p.cartItemIds.length),
    staleTime: 60_000,
  });
}

export function searchDestination(keyword: string) {
  return apiFetch<{ id: number | string }[]>('/shipping/search-destination', { params: { keyword } });
}

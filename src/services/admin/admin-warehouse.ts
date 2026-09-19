import { apiFetch } from '../api-client';
import type {
  Paginated,
  PickList,
  StockMovement,
  StockOut,
  StockRequest,
  Warehouse,
  WarehouseProduct,
} from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type ListParams = Record<string, unknown>;

export const qk = {
  warehouses: (f?: ListParams) => ['warehouses', f ?? {}] as const,
  warehouse: (id: string) => ['warehouses', 'detail', id] as const,
  warehouseOverview: (id: string) => ['warehouses', 'overview', id] as const,
  warehouseProducts: (id: string, f?: ListParams) => ['warehouses', 'products', id, f ?? {}] as const,
  warehouseSales: (id: string, f?: ListParams) => ['warehouses', 'sales', id, f ?? {}] as const,
  warehouseMovements: (id: string, f?: ListParams) => ['warehouses', 'movements', id, f ?? {}] as const,
  warehouseOrders: (id: string) => ['warehouses', 'orders', id] as const,
  pickLists: (f?: ListParams) => ['pick-lists', f ?? {}] as const,
  lowStock: (f?: ListParams) => ['inventory', 'low-stock', f ?? {}] as const,
  summary: (f?: ListParams) => ['inventory', 'summary', f ?? {}] as const,
  movements: (f?: ListParams) => ['inventory', 'movements', f ?? {}] as const,
  stockRequests: (f?: ListParams) => ['stock-requests', f ?? {}] as const,
  stockOuts: (f?: ListParams) => ['stock-outs', f ?? {}] as const,
  variants: (f?: ListParams) => ['variants', f ?? {}] as const,
};

export function getWarehouses(f?: ListParams) {
  return apiFetch<Paginated<Warehouse>>('/admin/warehouses', { params: f });
}
export function getActiveWarehouses() {
  return apiFetch<Warehouse[]>('/admin/warehouses/active');
}
export function getWarehouseOverview(id: string) {
  return apiFetch<Record<string, unknown>>(`/admin/warehouses/${id}/overview`);
}
export function getWarehouseProducts(id: string, f?: ListParams) {
  return apiFetch<Paginated<WarehouseProduct>>(`/admin/warehouses/${id}/products`, { params: f });
}
export function getWarehouseSales(id: string, f?: ListParams) {
  return apiFetch<Paginated<Record<string, unknown>>>(`/admin/warehouses/${id}/sales`, { params: f });
}
export function getWarehouseMovements(id: string, f?: ListParams) {
  return apiFetch<Paginated<StockMovement>>(`/admin/warehouses/${id}/movements`, { params: f });
}
export function getWarehouseOrders(id: string) {
  return apiFetch<Record<string, unknown>[]>(`/admin/warehouses/${id}/orders`);
}
export function getPickLists(warehouseId: string, f?: ListParams) {
  return apiFetch<Paginated<PickList>>(`/admin/warehouses/${warehouseId}/pick-list`, { params: f });
}
export function getLowStock(f?: ListParams) {
  return apiFetch<Paginated<WarehouseProduct>>('/admin/inventory/low-stock', { params: f });
}
export function getStockMovements(f?: ListParams) {
  return apiFetch<Paginated<StockMovement>>('/admin/inventory/stock-movements', { params: f });
}
export function getStockRequests(f?: ListParams) {
  return apiFetch<Paginated<StockRequest>>('/admin/inventory/stock-request', { params: f });
}
export function getStockOuts(f?: ListParams) {
  return apiFetch<Paginated<StockOut>>('/admin/inventory/stock-out', { params: f });
}
export function getGlobalVariants(f?: ListParams) {
  return apiFetch<Paginated<Record<string, unknown>>>('/admin/variants', { params: f });
}

export function useWarehouses(f?: ListParams) {
  return useQuery({ queryKey: qk.warehouses(f), queryFn: () => getWarehouses(f) });
}
export function useActiveWarehouses() {
  return useQuery({ queryKey: ['warehouses', 'active'], queryFn: getActiveWarehouses, staleTime: Infinity });
}
export function useWarehouseOverview(id: string) {
  return useQuery({ queryKey: qk.warehouseOverview(id), queryFn: () => getWarehouseOverview(id), enabled: !!id });
}
export function useWarehouseProducts(id: string, f?: ListParams) {
  return useQuery({ queryKey: qk.warehouseProducts(id, f), queryFn: () => getWarehouseProducts(id, f), enabled: !!id });
}
export function useWarehouseMovements(id: string, f?: ListParams) {
  return useQuery({ queryKey: qk.warehouseMovements(id, f), queryFn: () => getWarehouseMovements(id, f), enabled: !!id });
}
export function usePickLists(warehouseId: string, f?: ListParams) {
  return useQuery({ queryKey: qk.pickLists({ warehouseId, ...f }), queryFn: () => getPickLists(warehouseId, f), enabled: !!warehouseId });
}
export function useLowStock(f?: ListParams) {
  return useQuery({ queryKey: qk.lowStock(f), queryFn: () => getLowStock(f) });
}
export function useStockMovements(f?: ListParams) {
  return useQuery({ queryKey: qk.movements(f), queryFn: () => getStockMovements(f) });
}
export function useStockRequests(f?: ListParams) {
  return useQuery({ queryKey: qk.stockRequests(f), queryFn: () => getStockRequests(f) });
}
export function useStockOuts(f?: ListParams) {
  return useQuery({ queryKey: qk.stockOuts(f), queryFn: () => getStockOuts(f) });
}
export function useGlobalVariants(f?: ListParams) {
  return useQuery({ queryKey: qk.variants(f), queryFn: () => getGlobalVariants(f) });
}

function useInvMutation<T>(path: string, keys: readonly unknown[][]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: T) => apiFetch<null>(path, { method: 'POST', body }),
    onSuccess: () => keys.forEach((k) => qc.invalidateQueries({ queryKey: k })),
  });
}

export const useAddStock = () =>
  useInvMutation<{ variantId: string; warehouseId: string; stock: number }>('/admin/inventory/add', [
    ['inventory'],
    ['warehouses'],
  ]);
export const useSetStock = () =>
  useInvMutation<{ variantId: string; warehouseId: string; stock: number }>('/admin/inventory/set', [
    ['inventory'],
    ['warehouses'],
  ]);
export const useStockOpname = () =>
  useInvMutation<{ warehouseId: string; adjustments: { variantId: string; stock: number }[] }>(
    '/admin/inventory/opname',
    [['inventory'], ['warehouses']]
  );
export const useTransferStock = () =>
  useInvMutation<{ variantId: string; fromWarehouseId: string; toWarehouseId: string; quantity: number }>(
    '/admin/inventory/transfer',
    [['inventory'], ['warehouses']]
  );
export const useCreateStockRequest = () =>
  useInvMutation<Record<string, unknown>>('/admin/inventory/stock-request', [['stock-requests']]);
export const useCreateStockOut = () =>
  useInvMutation<Record<string, unknown>>('/admin/inventory/stock-out', [['stock-outs']]);
export const useCreateWarehouse = () =>
  useInvMutation<Record<string, unknown>>('/admin/warehouses', [['warehouses']]);

export function useUpdateStockRequestStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch<null>(`/admin/inventory/stock-request/${id}/status`, { method: 'PUT', body: { status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stock-requests'] }),
  });
}

export function useUpdateStockOutStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch<null>(`/admin/inventory/stock-out/${id}/status`, { method: 'PUT', body: { status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stock-outs'] }),
  });
}

export function useUpdatePickList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pickListId, status, items }: { pickListId: string; status: string; items?: Record<string, unknown>[] }) =>
      apiFetch<null>(`/admin/inventory/pick-list/${pickListId}`, { method: 'PUT', body: { status, items } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pick-lists'] }),
  });
}

export function useCreatePickList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ warehouseId, orderIds, notes }: { warehouseId: string; orderIds: string[]; notes?: string }) =>
      apiFetch<PickList>(`/admin/warehouses/${warehouseId}/pick-list`, {
        method: 'POST',
        body: { orderIds, notes },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pick-lists'] }),
  });
}

export function useUpdateVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, data, images }: { variantId: string; data: Record<string, unknown>; images?: File[] }) => {
      const fd = new FormData();
      fd.append('data', JSON.stringify(data));
      images?.forEach((img) => fd.append('images', img));
      return apiFetch<null>(`/admin/variants/${variantId}`, { method: 'PUT', formData: fd });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['variants'] }),
  });
}

export function useDeleteVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) =>
      apiFetch<null>(`/admin/variants/${variantId}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['variants'] }),
  });
}

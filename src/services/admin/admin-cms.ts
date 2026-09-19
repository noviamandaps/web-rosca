import { apiFetch } from '../api-client';
import type { AboutUs, Benefit, Bundle, NotificationItem, SurveyEntry } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const qk = {
  sliders: ['cms', 'sliders-admin'] as const,
  benefits: ['cms', 'benefits'] as const,
  illustration: ['cms', 'benefit-illustration'] as const,
  notifications: ['cms', 'notifications'] as const,
  about: ['cms', 'about-us'] as const,
  surveys: ['cms', 'surveys'] as const,
  bundles: ['bundles'] as const,
};

// ponytail: response shape CMS admin diasumsikan array sederhana; sesuaikan saat cek response nyata
export type Simple<T> = T[] | { data: T[] };

function unwrap<T>(res: Simple<T>): T[] {
  return Array.isArray(res) ? res : res.data;
}

// --- Sliders admin ---
export function useAdminSliders() {
  return useQuery({
    queryKey: qk.sliders,
    queryFn: async () => unwrap(await apiFetch<Simple<Benefit>>('/cms/admin/sliders')),
  });
}
export function useSaveSlider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: Record<string, unknown> }) =>
      apiFetch<null>(id ? `/cms/admin/sliders/${id}` : '/cms/admin/sliders', {
        method: id ? 'PUT' : 'POST',
        body: data,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.sliders }),
  });
}
export function useDeleteSlider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/cms/admin/sliders/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.sliders }),
  });
}
export function useToggleSlider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive?: boolean }) =>
      apiFetch<null>(`/cms/admin/sliders/${id}/toggle-active`, { method: 'PATCH', body: { isActive } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.sliders }),
  });
}
export function useReorderSliders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orders: { id: string; sortOrder: number }[]) =>
      apiFetch<null>('/cms/admin/sliders/reorder', { method: 'PATCH', body: { orders } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.sliders }),
  });
}

// --- Benefits ---
export function useBenefits() {
  return useQuery({
    queryKey: qk.benefits,
    queryFn: async () => unwrap(await apiFetch<Simple<Benefit>>('/cms/benefits', { params: { limit: 50 } })),
  });
}
export function useSaveBenefit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: Partial<Benefit> }) =>
      apiFetch<null>(id ? `/cms/admin/benefits/${id}` : '/cms/admin/benefits', {
        method: id ? 'PUT' : 'POST',
        body: data,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.benefits }),
  });
}
export function useDeleteBenefit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/cms/admin/benefits/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.benefits }),
  });
}
export function useToggleBenefit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<null>(`/cms/admin/benefits/${id}/toggle-active`, { method: 'PATCH', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.benefits }),
  });
}
export function useBenefitIllustration() {
  return useQuery({
    queryKey: qk.illustration,
    queryFn: async () => unwrap(await apiFetch<Simple<Benefit>>('/cms/benefit-illustration')),
  });
}
export function useSaveIllustration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiFetch<null>('/cms/admin/benefit-illustration', { method: 'POST', body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.illustration }),
  });
}
export function useToggleIllustration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<null>(`/cms/admin/benefit-illustration/${id}/toggle-active`, { method: 'PATCH', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.illustration }),
  });
}

// --- Notifications ---
export function useNotificationHistory() {
  return useQuery({
    queryKey: qk.notifications,
    queryFn: async () => unwrap(await apiFetch<Simple<NotificationItem>>('/cms/admin/notifications/history')),
  });
}
export function useSendNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; message: string }) =>
      apiFetch<null>('/cms/admin/notifications/send', { method: 'POST', body: payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.notifications }),
  });
}

// --- About us ---
export function useAboutUs() {
  return useQuery({
    queryKey: qk.about,
    queryFn: async () => unwrap(await apiFetch<Simple<AboutUs>>('/admin/about-us')),
  });
}
export function useSaveAbout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: Partial<AboutUs> }) =>
      apiFetch<null>(id ? `/admin/about-us/${id}` : '/admin/about-us', {
        method: id ? 'PUT' : 'POST',
        body: data,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.about }),
  });
}
export function useDeleteAbout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<null>(`/admin/about-us/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.about }),
  });
}
export function useToggleAbout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<null>(`/admin/about-us/${id}/toggle`, { method: 'PATCH', body: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.about }),
  });
}

// --- Surveys ---
export function useSurveys() {
  return useQuery({
    queryKey: qk.surveys,
    queryFn: async () => unwrap(await apiFetch<Simple<SurveyEntry>>('/cms/admin/surveys')),
  });
}
export function useCreateSurvey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiFetch<null>('/cms/admin/surveys', { method: 'POST', body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.surveys }),
  });
}

// --- Bundles ---
export function useBundles() {
  return useQuery({
    queryKey: qk.bundles,
    queryFn: async () => unwrap(await apiFetch<Simple<Bundle>>('/admin/bundles')),
  });
}

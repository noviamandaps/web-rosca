import { apiFetch, setCookie } from '../api-client';
import type { LoginResult } from '@/lib/api-types';

export function setAdminToken(token: string, role?: string) {
  localStorage.setItem('admin_token', token);
  setCookie('admin_token', token, '/admin');
  if (role) setCookie('user_role', role, '/admin');
}

export function adminLogin(payload: { email: string; password?: string; otp?: string }) {
  return apiFetch<LoginResult>('/auth/admin/login', { method: 'POST', body: payload });
}

export function adminRequestOtp(email: string) {
  return apiFetch<null>('/auth/admin/request-otp', { method: 'POST', body: { email } });
}

export function adminVerifyOtp(payload: { email: string; code: string }) {
  return apiFetch<LoginResult>('/auth/admin/verify-otp', { method: 'POST', body: payload });
}

export function adminForceChangePassword(payload: {
  email?: string;
  code?: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return apiFetch<null>('/auth/admin/force-change-password', { method: 'POST', body: payload });
}

export function adminForgotPassword(email: string) {
  return apiFetch<null>('/auth/admin/password/forgot', { method: 'POST', body: { email } });
}

export function adminVerifyReset(payload: { email: string; code: string }) {
  return apiFetch<{ resetToken?: string }>('/auth/admin/password/verify', { method: 'POST', body: payload });
}

export function adminResetPassword(payload: { resetToken: string; newPassword: string; confirmPassword: string }) {
  return apiFetch<null>('/auth/admin/password/reset', { method: 'POST', body: payload });
}

export function getMyPaths() {
  return apiFetch<string[]>('/admin/rbac/my-paths');
}

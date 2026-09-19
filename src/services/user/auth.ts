import { apiFetch, setCookie } from '../api-client';

export function userLogin(payload: { email: string; password: string }) {
  return apiFetch<{ token?: string; accessToken?: string; user?: { id: string; name?: string; email: string } }>(
    '/auth/login',
    { method: 'POST', body: payload }
  );
}

export function setUserToken(token: string) {
  localStorage.setItem('token', token);
  setCookie('token', token);
}

// shape nyata register (audit): confirmPassword/phone/birthday/city/gender wajib
export function userRegister(payload: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  birthday: string;
  city: string;
  gender: 'MALE' | 'FEMALE';
}) {
  return apiFetch<unknown>('/auth/register', {
    method: 'POST',
    body: { ...payload, agreedToTerms: true, marketingConsent: false },
  });
}

export function userForgotPassword(email: string) {
  return apiFetch<null>('/auth/password/forgot', { method: 'POST', body: { email } });
}

export function userVerifyCode(payload: { email: string; code: string }) {
  return apiFetch<{ resetToken?: string }>('/auth/password/verify', { method: 'POST', body: payload });
}

export function userResetPassword(payload: { resetToken: string; newPassword: string }) {
  return apiFetch<null>('/auth/password/reset', { method: 'POST', body: payload });
}

export function getMe() {
  return apiFetch<{ user?: UserProfile } & Partial<UserProfile>>('/users/me');
}

// shape nyata GET /users/me (audit): user bungkus + claimedCoupons
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  birthday?: string | null;
  gender?: 'MALE' | 'FEMALE' | null;
  city?: string | null;
  avatarUrl?: string | null;
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  membershipLevel?: string;
  totalSpending?: number | string;
  points?: number | string;
  marketingConsent?: boolean;
  createdAt?: string;
  totalOrders?: number;
  totalReturns?: number;
  claimedCoupons?: unknown[];
}

export function updateMe(payload: { name?: string; phone?: string; city?: string; birthday?: string; gender?: string }) {
  return apiFetch<unknown>('/users/me', { method: 'PUT', body: payload });
}

export function uploadAvatar(file: File) {
  const fd = new FormData();
  fd.append('avatar', file);
  return apiFetch<unknown>('/users/me/avatar', { method: 'POST', formData: fd });
}

export function userLogout() {
  // endpoint /auth/logout ada di BE; best-effort lalu clear lokal
  apiFetch<null>('/auth/logout', { method: 'POST', body: {} }).catch(() => undefined);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('user_role');
  }
}

export function changePassword(payload: { currentPassword: string; newPassword: string }) {
  return apiFetch<null>('/auth/change-password', { method: 'POST', body: payload });
}


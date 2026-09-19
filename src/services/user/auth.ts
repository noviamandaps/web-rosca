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

export function userRegister(payload: { name: string; email: string; password: string; phone?: string }) {
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
  return apiFetch<{ user?: Record<string, unknown> } | Record<string, unknown>>('/users/me');
}

export function updateMe(payload: { name?: string; phone?: string; birthday?: string; gender?: string }) {
  return apiFetch<unknown>('/users/me', { method: 'PUT', body: payload });
}

export function changePassword(payload: { currentPassword: string; newPassword: string }) {
  return apiFetch<null>('/auth/change-password', { method: 'POST', body: payload });
}

export function userLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('user_role');
  }
}

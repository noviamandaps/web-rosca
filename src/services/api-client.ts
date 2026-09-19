const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const ADMIN_PREFIX = '/admin';

export function isAdminEndpoint(endpoint: string) {
  return endpoint.startsWith(ADMIN_PREFIX) || endpoint.includes('/admin/');
}

export function getToken(endpoint: string) {
  if (typeof window === 'undefined') return null;
  return isAdminEndpoint(endpoint) ? localStorage.getItem('admin_token') : localStorage.getItem('token');
}

export function setCookie(name: string, value: string, path = '/') {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=${path}`;
}

export function clearAuth(admin = false) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(admin ? 'admin_token' : 'token');
  localStorage.removeItem('accessToken');
  document.cookie = `${admin ? 'admin_token' : 'token'}=; path=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  if (admin) document.cookie = 'user_role=; path=/admin; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function qs(params?: Record<string, unknown>) {
  if (!params) return '';
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : '';
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, unknown>;
  body?: unknown;
  formData?: FormData;
}

export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = getToken(endpoint);
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined && !options.formData) headers['Content-Type'] = 'application/json';

  const url = `${BASE}${endpoint}${qs(options.params)}`;
  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.formData ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
  });

  if (res.status === 401) {
    const admin = isAdminEndpoint(endpoint);
    clearAuth(admin);
    window.location.assign(admin ? '/admin/login' : '/login');
    throw new ApiError(401, 'Unauthorized');
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = (await res.json()) as { message?: string; error?: string };
      message = err.message ?? err.error ?? message;
    } catch {
      // keep statusText
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return null as T;
  const text = await res.text();
  if (!text) return null as T;
  const json = JSON.parse(text);
  // ponytail: normalisasi envelope — kebanyakan endpoint { status, data }; Sale pakai flat + key success
  if (
    (json.status === true || json.success === true) &&
    typeof json === 'object' &&
    'data' in json
  )
    return json.data as T;
  return json as T;
}

export function apiDownload(
  endpoint: string,
  params?: Record<string, unknown>,
  body?: unknown
): Promise<Blob> {
  const token = getToken(endpoint);
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  return fetch(`${BASE}${endpoint}${qs(params)}`, {
    headers,
    method: body !== undefined ? 'POST' : 'GET',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (!res.ok) throw new ApiError(res.status, res.statusText);
    return res.blob();
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

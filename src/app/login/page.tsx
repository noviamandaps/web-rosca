'use client';

import { Button } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setUserToken, userLogin } from '@/services/user/auth';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'admin' | 'affiliate'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role !== 'user') return;
    setError('');
    setLoading(true);
    try {
      const res = await userLogin({ email, password });
      const token = res.token ?? res.accessToken;
      if (token) {
        setUserToken(token);
        router.push('/');
      } else {
        setError('Login succeeded but no token returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider">ROSCA</h1>
        </Link>

        {/* Role Tabs */}
        <div className="border border-brand-border mb-0">
          <div className="grid grid-cols-3">
            <button
              onClick={() => setRole('user')}
              className={`py-3 text-xs font-medium uppercase tracking-wider border-r border-brand-border transition-colors ${
                role === 'user'
                  ? 'bg-brand-black text-brand-white'
                  : 'bg-transparent text-brand-gray hover:text-brand-black'
              }`}
            >
              User
            </button>
            <button
              onClick={() => router.push('/admin/login')}
              className={`py-3 text-xs font-medium uppercase tracking-wider border-r border-brand-border transition-colors ${
                role === 'admin'
                  ? 'bg-brand-black text-brand-white'
                  : 'bg-transparent text-brand-gray hover:text-brand-black'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setRole('affiliate')}
              className={`py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                role === 'affiliate'
                  ? 'bg-brand-black text-brand-white'
                  : 'bg-transparent text-brand-gray hover:text-brand-black'
              }`}
            >
              Affiliate
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="border border-brand-border border-t-0 p-8">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-2">
            {role === 'user' && 'Login'}
            {role === 'admin' && 'Admin Login'}
            {role === 'affiliate' && 'Affiliate Login'}
          </h2>
          <p className="text-sm text-brand-gray mb-6">
            {role === 'user' && 'Welcome back! Please login to your account.'}
            {role === 'admin' && 'Access the admin dashboard.'}
            {role === 'affiliate' && 'Manage your affiliate dashboard.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">
                  Password <span className="text-ui-error ml-1">*</span>
                </label>
                <Link href="/forgot-password" className="text-2xs text-brand-gray hover:text-brand-black underline underline-offset-4">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                className="w-full border border-brand-border px-4 py-3 text-sm text-brand-dark placeholder:text-brand-gray focus:border-brand-black focus:outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <span className="text-2xs text-ui-error">{error}</span>}
            <Button type="submit" fullWidth>
              {loading ? 'Logging in…' : 'Login'}
            </Button>
          </form>

          {/* Register Link */}
          {role === 'user' && (
            <p className="text-center text-sm text-brand-gray mt-6">
              Don't have an account?{' '}
              <Link href="/register" className="text-brand-black hover:underline underline-offset-4 font-medium">
                Register
              </Link>
            </p>
          )}

          {/* Admin/Affiliate Notice */}
          {(role === 'admin' || role === 'affiliate') && (
            <p className="text-center text-xs text-brand-gray mt-6">
              Contact the administrator if you don't have access credentials.
            </p>
          )}
        </div>

        {/* Social Login - User only */}
        {role === 'user' && (
          <>
            <div className="border-t border-brand-border my-6 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-brand-gray">
                OR CONTINUE WITH
              </span>
            </div>
            <div className="space-y-3">
              {/* ponytail: Google OAuth menunggu flow idToken — endpoint POST /auth/google sudah ada di service */}
              <button
                type="button"
                disabled
                className="w-full border border-brand-border py-3 text-sm font-medium uppercase tracking-wider text-brand-gray cursor-not-allowed"
              >
                Google (soon)
              </button>
            </div>
          </>
        )}

        {/* Back to Home */}
        <Link href="/" className="block text-center text-sm text-brand-gray hover:text-brand-black underline underline-offset-4 mt-8">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

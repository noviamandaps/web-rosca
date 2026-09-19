'use client';

import { Button } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userRegister } from '@/services/user/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [f, setF] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    city: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (f.password !== f.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (f.gender !== 'MALE' && f.gender !== 'FEMALE') {
      setError('Select gender');
      return;
    }
    setLoading(true);
    try {
      await userRegister({
        name: f.name,
        email: f.email,
        password: f.password,
        confirmPassword: f.confirmPassword,
        phone: f.phone.replace(/\D/g, ''),
        birthday: new Date(f.birthday).toISOString(),
        city: f.city,
        gender: f.gender as 'MALE' | 'FEMALE',
      });
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider">ROSCA</h1>
        </Link>

        <div className="border border-brand-border p-8">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-2">Create Account</h2>
          <p className="text-sm text-brand-gray mb-6">
            Join us and start shopping our premium products.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="Enter your full name" required name="name" value={f.name} onChange={set('name')} />
            <Input label="Email" type="email" placeholder="Enter your email" required name="email" value={f.email} onChange={set('email')} />
            <Input label="Phone (10-15 digits)" placeholder="08xxxxxxxxxx" required name="phone" value={f.phone} onChange={set('phone')} />
            <Input label="Birthday" type="date" required name="birthday" value={f.birthday} onChange={set('birthday')} />
            <Input label="City" placeholder="e.g. Jakarta" required name="city" value={f.city} onChange={set('city')} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">
                Gender <span className="text-ui-error ml-1">*</span>
              </label>
              <select
                name="gender"
                required
                value={f.gender}
                onChange={set('gender')}
                className="w-full border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
              >
                <option value="">Select…</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <Input label="Password" type="password" required name="password" value={f.password} onChange={set('password')} />
            <Input label="Confirm Password" type="password" required name="confirmPassword" value={f.confirmPassword} onChange={set('confirmPassword')} />

            {error && <span className="text-2xs text-ui-error">{error}</span>}
            <Button type="submit" fullWidth>
              {loading ? 'Creating…' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-xs text-brand-gray mt-4">
            Harap verifikasi email (cek inbox) sebelum melakukan order.
          </p>

          <p className="text-center text-sm text-brand-gray mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-black hover:underline underline-offset-4 font-medium">
              Login
            </Link>
          </p>
        </div>

        <Link href="/" className="block text-center text-sm text-brand-gray hover:text-brand-black underline underline-offset-4 mt-8">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

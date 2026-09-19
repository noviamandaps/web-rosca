'use client';

import { Button } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userRegister } from '@/services/user/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await userRegister({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider">ROSCA</h1>
        </Link>

        {/* Register Form */}
        <div className="border border-brand-border p-8">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-2">Create Account</h2>
          <p className="text-sm text-brand-gray mb-6">
            Join us and start shopping our premium products.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="Enter your phone number"
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              required
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4"
              />
              <label htmlFor="terms" className="text-xs text-brand-gray">
                I agree to the{' '}
                <Link href="/terms" className="text-brand-black hover:underline underline-offset-4">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-black hover:underline underline-offset-4">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {error && <span className="text-2xs text-ui-error">{error}</span>}
            <Button type="submit" fullWidth>
              {loading ? 'Creating…' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-brand-gray mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-black hover:underline underline-offset-4 font-medium">
              Login
            </Link>
          </p>
        </div>

        {/* Affiliate Signup CTA */}
        <div className="border border-brand-border mt-6 p-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wider mb-2">
            Want to become an Affiliate?
          </p>
          <p className="text-xs text-brand-gray mb-4">
            Join our affiliate program and earn commissions on every sale.
          </p>
          <Link href="/affiliate/register">
            <Button variant="secondary" size="sm">
              Apply Now
            </Button>
          </Link>
        </div>

        {/* Back to Home */}
        <Link href="/" className="block text-center text-sm text-brand-gray hover:text-brand-black underline underline-offset-4 mt-8">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

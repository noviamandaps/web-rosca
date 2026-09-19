'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import {
  adminLogin,
  adminRequestOtp,
  adminVerifyOtp,
  adminForceChangePassword,
  adminForgotPassword,
  adminVerifyReset,
  adminResetPassword,
  setAdminToken,
} from '@/services/admin/admin-auth';
import type { LoginResult } from '@/lib/api-types';

type Step = 'password' | 'otp' | 'forgot' | 'reset' | 'force-change';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const handleResult = (res: LoginResult) => {
    if (res.forceChangePassword) {
      setStep('force-change');
      return;
    }
    const token = res.token ?? res.accessToken;
    if (token) {
      setAdminToken(token, res.user?.role);
      router.replace('/admin');
      return;
    }
    setStep('otp');
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (step === 'password') {
        handleResult(await adminLogin({ email, password }));
      } else if (step === 'otp') {
        await adminRequestOtp(email);
        handleResult(await adminVerifyOtp({ email, code: otp }));
      } else if (step === 'forgot') {
        await adminForgotPassword(email);
        setStep('reset');
      } else if (step === 'reset') {
        const v = await adminVerifyReset({ email, code });
        setResetToken(v.resetToken ?? code);
        setStep('force-change');
      } else if (step === 'force-change') {
        await adminForceChangePassword({
          email,
          code: resetToken || undefined,
          newPassword,
          confirmPassword: newPassword,
        });
        setStep('password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    }
  }

  const labels: Record<Step, string> = {
    password: 'Admin Login',
    otp: 'Verify OTP',
    forgot: 'Forgot Password',
    reset: 'Verify Reset Code',
    'force-change': 'Set New Password',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-white px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-xl font-bold uppercase tracking-widest text-center">{labels[step]}</h1>
        {step !== 'otp' && step !== 'reset' && step !== 'force-change' && (
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        )}
        {(step === 'password' || step === 'otp') && (
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        )}
        {step === 'otp' && (
          <Input label="OTP Code" value={code} onChange={(e) => setCode(e.target.value)} required />
        )}
        {step === 'reset' && (
          <Input label="Code sent to email" value={code} onChange={(e) => setCode(e.target.value)} required />
        )}
        {(step === 'reset' || step === 'force-change') && (
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        )}
        {error && <span className="text-2xs text-ui-error">{error}</span>}
        <Button type="submit" fullWidth>
          {step === 'password' ? 'Login' : step === 'otp' ? 'Verify' : step === 'forgot' ? 'Send Code' : 'Continue'}
        </Button>
        <button
          type="button"
          onClick={() => {
            setError('');
            setStep(step === 'forgot' ? 'password' : 'forgot');
          }}
          className="text-xs text-brand-gray hover:text-brand-black text-center uppercase tracking-wider"
        >
          {step === 'forgot' ? 'Back to login' : 'Forgot password?'}
        </button>
      </form>
    </div>
  );
}

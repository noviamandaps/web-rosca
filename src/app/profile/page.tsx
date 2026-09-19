'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input } from '@/components/ui';
import { getMe, userLogout, updateMe } from '@/services/user/auth';
import { useOrdersSummary } from '@/services/user/orders';
import { useMembership } from '@/services/user/payments';

const nf = new Intl.NumberFormat('id-ID');
const num = (v: unknown) => (typeof v === 'string' ? Number(v) : (v as number | undefined));

export default function ProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: getMe, enabled: hasToken });
  const { data: membership } = useMembership();
  const { data: summary } = useOrdersSummary();
  const [msg, setMsg] = useState('');
  const [f, setF] = useState<{ name?: string; phone?: string; city?: string }>({});
  const [saving, setSaving] = useState(false);

  const user = me?.user;

  if (!hasToken)
    return (
      <div className="section-padding text-center">
        <p className="text-brand-gray mb-8">Please login to view your profile.</p>
        <Button href="/login">LOGIN</Button>
      </div>
    );

  if (isLoading || !user)
    return <div className="section-padding text-center text-xs text-brand-gray uppercase tracking-widest">Loading…</div>;

  const set = (k: 'name' | 'phone' | 'city') => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase">My Profile</h1>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={() => {
              userLogout();
              qc.clear();
              router.push('/');
            }}
          >
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <section className="border border-brand-border p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Membership</h2>
            <p className="text-xl font-bold">{membership?.name ?? user.membershipLevel ?? '-'}</p>
            <p className="text-2xs text-brand-gray mt-1">{membership?.description}</p>
            <p className="text-sm mt-4">Points: {nf.format(Number(membership?.points ?? user.points ?? 0))}</p>
            <p className="text-sm">Total spending: Rp {nf.format(Number(membership?.totalSpending ?? user.totalSpending ?? 0))}</p>
            {membership?.nextTier && (
              <p className="text-2xs text-brand-gray mt-2">
                Next: {membership.nextTier.name} — butuh Rp {nf.format(Number(membership.nextTier.spendingNeeded))} lagi
              </p>
            )}
          </section>

          <section className="border border-brand-border p-6 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Orders</h2>
            <p>Total orders: {summary?.totalOrders ?? 0}</p>
            <p>Total purchase: Rp {nf.format(Number(summary?.totalPurchase ?? 0))}</p>
            <div className="flex gap-3 mt-4 text-xs uppercase tracking-wider">
              <Link href="/orders" className="hover:underline">My orders</Link>
              <Link href="/profile/addresses" className="hover:underline">Addresses</Link>
              <Link href="/profile/vouchers" className="hover:underline">Vouchers</Link>
            </div>
          </section>
        </div>

        <section className="border border-brand-border p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Edit Profile</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              setMsg('');
              try {
                await updateMe({ name: f.name, phone: f.phone, city: f.city });
                qc.invalidateQueries({ queryKey: ['me'] });
                setMsg('Saved');
              } catch (err) {
                setMsg(err instanceof Error ? err.message : 'Save failed');
              } finally {
                setSaving(false);
              }
            }}
            className="grid md:grid-cols-3 gap-4"
          >
            <Input label="Name" value={f.name ?? (user.name as string)} onChange={set('name')} />
            <Input label="Phone" value={f.phone ?? (user.phone as string) ?? ''} onChange={set('phone')} />
            <Input label="City" value={f.city ?? (user.city as string) ?? ''} onChange={set('city')} />
            <div className="md:col-span-3 flex items-center gap-4">
              <Button type="submit" size="sm">
                {saving ? 'Saving…' : 'Save'}
              </Button>
              {msg && <span className="text-2xs text-brand-gray">{msg}</span>}
              {!user.isVerified && <span className="text-2xs text-ui-error">Email belum terverifikasi — cek inbox sebelum order.</span>}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

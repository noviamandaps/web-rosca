'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { useClaimCoupon, useCoupons } from '@/services/user/payments';
import type { UserCoupon } from '@/lib/api-types';

const nf = new Intl.NumberFormat('id-ID');

export default function ProfileVouchersPage() {
  const { data: coupons, isLoading } = useCoupons();
  const claim = useClaimCoupon();
  const [msg, setMsg] = useState('');

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <Link href="/profile" className="text-xs text-brand-gray hover:text-brand-black uppercase tracking-wider">
          ← Profile
        </Link>
        <h1 className="text-2xl font-bold tracking-widest uppercase mt-2 mb-6">Vouchers</h1>

        {isLoading && <p className="text-xs text-brand-gray">Loading…</p>}
        <div className="flex flex-col gap-3">
          {(coupons ?? []).map((c: UserCoupon) => (
            <div key={c.id} className="border border-brand-border p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-40">
                <p className="text-sm font-bold uppercase">{c.code}</p>
                <p className="text-sm">{c.name}</p>
                <p className="text-2xs text-brand-gray">{c.termsAndConditions ?? c.description ?? ''}</p>
                <p className="text-2xs text-brand-gray mt-1">
                  {c.discountType === 'PERCENTAGE' ? `${Number(c.discountValue)}%` : `Rp ${nf.format(Number(c.discountValue))}`} off
                  {c.minOrderAmount ? ` · min. Rp ${nf.format(Number(c.minOrderAmount))}` : ''}
                  {c.endDate ? ` · s/d ${new Date(c.endDate).toLocaleDateString('id-ID')}` : ''}
                </p>
              </div>
              <div className="text-right">
                {c.hasClaimed ? (
                  <span className="text-2xs text-brand-gray uppercase tracking-wider">Claimed</span>
                ) : (
                  <Button
                    size="sm"
                    type="button"
                    onClick={() =>
                      claim.mutate(c.id, {
                        onSuccess: () => setMsg(`${c.code} claimed`),
                        onError: (err) => setMsg(err instanceof Error ? err.message : 'Claim failed'),
                      })
                    }
                  >
                    {claim.isPending ? '…' : 'Claim'}
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!isLoading && !coupons?.length && <p className="text-xs text-brand-gray">Belum ada voucher tersedia.</p>}
        </div>
        {msg && <p className="text-xs text-brand-gray mt-4">{msg}</p>}
      </div>
    </div>
  );
}

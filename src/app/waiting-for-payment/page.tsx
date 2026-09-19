'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { getPaymentStatus, useSimulatePayment } from '@/services/user/payments';

function v(k: string, j: unknown): string | undefined {
  const o = j as Record<string, unknown> | undefined;
  const val = o?.[k];
  return val === undefined || val === null ? undefined : String(val);
}

export default function WaitingForPaymentPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs text-brand-gray uppercase tracking-widest">Loading…</div>}>
      <WaitingInner />
    </Suspense>
  );
}

function WaitingInner() {
  const params = useSearchParams();
  const paymentId = params.get('paymentId') ?? '';
  const orderId = params.get('orderId') ?? '';

  const { data: pay, refetch } = useQuery({
    queryKey: ['payments', 'status', paymentId],
    queryFn: () => getPaymentStatus(paymentId),
    enabled: !!paymentId,
    refetchInterval: 5000,
  });
  const simulate = useSimulatePayment();
  const [msg, setMsg] = useState('');

  const status = v('status', pay) ?? v('paymentStatus', pay) ?? 'PENDING';
  const payCode = v('paymentCode', pay) ?? v('vaNumber', pay) ?? '';
  const qr = v('qrCodeUrl', pay) ?? '';
  const expiredAt = v('expiredAt', pay) ?? '';

  if (!paymentId && !orderId)
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-4">Waiting for Payment</h1>
        <p className="text-brand-gray mb-8">No payment in progress.</p>
        <Button href="/orders">MY ORDERS</Button>
      </div>
    );

  const paid = status.toUpperCase() === 'PAID' || status.toUpperCase() === 'SETTLEMENT';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">
        {paid ? 'Payment Received' : 'Waiting for Payment'}
      </h1>
      <p className="text-sm text-brand-gray mb-8">Order: {orderId}</p>

      {qr && (
        <div className="border border-brand-border p-6 mb-6 text-center">
          <p className="text-xs uppercase tracking-wider text-brand-gray mb-3">QR Code</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="QR Code" className="mx-auto max-w-xs" />
        </div>
      )}

      <div className="border border-brand-border p-6 mb-8 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-brand-gray">Status</span>
          <span className={paid ? 'font-bold' : 'font-medium'}>{status}</span>
        </div>
        {payCode && (
          <div className="flex justify-between">
            <span className="text-brand-gray">VA / Payment Code</span>
            <span className="font-medium">{payCode}</span>
          </div>
        )}
        {expiredAt && (
          <div className="flex justify-between">
            <span className="text-brand-gray">Expiry</span>
            <span>{new Date(expiredAt).toLocaleString('id-ID')}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {/* ponytail: /payments/simulate hanya staging — untuk dev tanpa webhook Midtrans */}
        {!paid && paymentId && (
          <Button
            type="button"
            onClick={() =>
              simulate.mutate(paymentId, {
                onSuccess: () => setMsg('Simulated — refresh status'),
                onError: (err) => setMsg(err.message),
              })
            }
          >
            {simulate.isPending ? 'Simulating…' : 'Simulate Payment (staging)'}
          </Button>
        )}
        <Button variant="secondary" type="button" onClick={() => refetch()}>
          Refresh Status
        </Button>
        {paid ? (
          <Button href="/orders" type="button">
            View My Orders
          </Button>
        ) : (
          <Link
            href="/orders"
            className="text-center text-sm text-brand-gray hover:text-brand-black underline underline-offset-4"
          >
            My Orders
          </Link>
        )}
        {msg && <p className="text-xs text-brand-gray">{msg}</p>}
      </div>
    </div>
  );
}

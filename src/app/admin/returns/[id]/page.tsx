'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import {
  useCloseReturn,
  useCompleteReturn,
  useProcessReturn,
  useQcResult,
  useRefundTransfer,
  useReturn,
  useStartQc,
} from '@/services/admin/admin-returns';

export default function AdminReturnDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: ret, isLoading, error } = useReturn(id);
  const startQc = useStartQc();
  const qcResult = useQcResult();
  const process = useProcessReturn();
  const complete = useCompleteReturn();
  const refund = useRefundTransfer();
  const close = useCloseReturn();

  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  if (isLoading)
    return <div className="py-16 text-center text-brand-gray uppercase tracking-widest text-xs">Loading…</div>;
  if (error || !ret)
    return (
      <div className="py-16 text-center text-ui-error text-sm">
        {error instanceof Error ? error.message : 'Return not found'}
      </div>
    );

  const busy =
    startQc.isPending || qcResult.isPending || process.isPending || complete.isPending || refund.isPending || close.isPending;
  const fail = (e: unknown) => alert(e instanceof Error ? e.message : 'Action failed');

  const act = (fn: () => Promise<unknown>) => () => fn().catch(fail);

  return (
    <div>
      <Link href="/admin/returns" className="text-xs text-brand-gray hover:text-brand-black uppercase tracking-wider">
        ← Back
      </Link>
      <div className="flex items-center justify-between mt-2 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Return {ret.id}</h1>
        <span className="text-xs uppercase tracking-wider">{ret.returnStatus}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="border border-brand-border p-5 text-sm flex flex-col gap-1">
          <p>Order: {ret.orderId ?? '-'}</p>
          <p>Order item: {ret.orderItemId ?? '-'}</p>
          <p>Condition: {ret.condition ?? '-'}</p>
          <p>Type: {ret.returnType ?? '-'}</p>
          <p>Reason: {ret.reason ?? ret.customerNotes ?? '-'}</p>
          <p>QC notes: {ret.qcNotes ?? '-'}</p>
          <p>AWB: {ret.returnAwb ?? '-'}</p>
        </div>

        <div className="border border-brand-border p-5 flex flex-col gap-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wider">Aksi</p>
          <Button size="sm" type="button" onClick={act(() => startQc.mutateAsync({ id }))}>
            {busy ? '…' : 'Start QC'}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="QC condition" value={condition} onChange={(e) => setCondition(e.target.value)} />
            <Input placeholder="QC notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={act(() => qcResult.mutateAsync({ id, body: { condition, notes: notes || undefined } }))}
          >
            Submit QC Result
          </Button>
          <div className="flex gap-3">
            <Button
              size="sm"
              type="button"
              onClick={act(() => process.mutateAsync({ id, body: { returnStatus: 'APPROVED', qcNotes: notes, refundAmount: refundAmount ? Number(refundAmount) : undefined } }))}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="secondary"
              type="button"
              onClick={act(() => process.mutateAsync({ id, body: { returnStatus: 'REJECTED', qcNotes: notes } }))}
            >
              Reject
            </Button>
          </div>
          <Input placeholder="Refund amount (Rp)" type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} />
          <Button
            size="sm"
            type="button"
            onClick={act(() => complete.mutateAsync({ id, body: { physicalQcCondition: condition || 'GOOD', physicalQcNotes: notes, restock: true } }))}
          >
            Complete
          </Button>
          <Input placeholder="Refund proof URL" value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} />
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={act(() => refund.mutateAsync({ id, body: { refundProofUrl: proofUrl } }))}
          >
            Submit Refund Proof
          </Button>
          <Button size="sm" variant="ghost" type="button" onClick={act(() => close.mutateAsync({ id }))}>
            Close Return
          </Button>
        </div>
      </div>
    </div>
  );
}

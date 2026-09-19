'use client';

import { useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button, Input, Modal } from '@/components/ui';
import { useLabelOrderBulk, usePendingPickup, useRequestPickupBulk } from '@/services/admin/admin-shipping';
import type { PendingPickupOrder } from '@/lib/api-types';

export default function AdminShippingPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, error } = usePendingPickup({ page, limit });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pickupOpen, setPickupOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [vehicle, setVehicle] = useState('MOTOR');
  const pickupBulk = useRequestPickupBulk();
  const labels = useLabelOrderBulk();

  const toggle = (id: string, orderNo: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(orderNo);
      return next;
    });

  async function submitPickup(e: React.FormEvent) {
    e.preventDefault();
    try {
      await pickupBulk.mutateAsync({
        pickupDate,
        pickupTime,
        pickupVehicle: vehicle,
        orders: Array.from(selected).map((orderNo) => ({ orderNo })),
      });
      setPickupOpen(false);
      setSelected(new Set());
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  }

  const orderNos = Array.from(selected);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Shipping</h1>
        <div className="flex gap-2">
          <Button size="sm" type="button" onClick={() => setPickupOpen(true)} >
            Request Pickup ({orderNos.length})
          </Button>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={() => labels.mutate({ orderNos })}
          >
            Print Labels
          </Button>
        </div>
      </div>
      <AdminTable<PendingPickupOrder>
        columns={[
          {
            header: '',
            render: (o) => (
              <input
                type="checkbox"
                checked={orderNos.includes(o.orderNumber ?? o.id)}
                onChange={() => toggle(o.id, o.orderNumber ?? o.id)}
              />
            ),
          },
          { header: 'Order', render: (o) => o.orderNumber ?? o.id },
          { header: 'Customer', render: (o) => o.customerName ?? '-' },
          { header: 'Warehouse', render: (o) => o.warehouseName ?? o.warehouseId ?? '-' },
          { header: 'Status', render: (o) => o.status ?? '-' },
          { header: 'Date', render: (o) => (o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : '-') },
        ]}
        rows={data?.data}
        loading={isLoading}
        error={error}
        page={page}
        total={data?.total ?? 0}
        limit={limit}
        onPage={setPage}
      />
      <Modal isOpen={pickupOpen} onClose={() => setPickupOpen(false)} title="Request Pickup">
        <form onSubmit={submitPickup} className="flex flex-col gap-4">
          <Input label="Pickup Date" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} required />
          <Input label="Pickup Time" type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required />
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">Vehicle</label>
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full border border-brand-border px-4 py-3 text-sm mt-1 bg-white focus:border-brand-black focus:outline-none"
            >
              {['MOTOR', 'VAN', 'CAR'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">{pickupBulk.isPending ? 'Requesting…' : `Pickup ${orderNos.length} orders`}</Button>
        </form>
      </Modal>
    </div>
  );
}

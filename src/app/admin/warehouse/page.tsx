'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button, Input, Modal } from '@/components/ui';
import { useCreateWarehouse, useWarehouses } from '@/services/admin/admin-warehouse';
import type { Warehouse } from '@/lib/api-types';

export default function AdminWarehousePage() {
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const limit = 10;
  const { data, isLoading, error } = useWarehouses({ page, limit });
  const create = useCreateWarehouse();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutateAsync({ name, code: code || undefined, address: address || undefined });
      setCreating(false);
      setName('');
      setCode('');
      setAddress('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Warehouse</h1>
        <Button size="sm" type="button" onClick={() => setCreating(true)}>
          + Add
        </Button>
      </div>
      <AdminTable<Warehouse>
        columns={[
          {
            header: 'Name',
            render: (w) => (
              <Link href={`/admin/warehouse/${w.id}`} className="font-medium hover:underline">
                {w.name}
              </Link>
            ),
          },
          { header: 'Code', render: (w) => w.code ?? '-' },
          { header: 'Active', render: (w) => (w.isActive === false ? 'No' : 'Yes') },
        ]}
        rows={data?.data}
        loading={isLoading}
        error={error}
        page={page}
        total={data?.total ?? 0}
        limit={limit}
        onPage={setPage}
      />
      <Modal isOpen={creating} onClose={() => setCreating(false)} title="New Warehouse">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
          <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Button type="submit">{create.isPending ? 'Saving…' : 'Create'}</Button>
        </form>
      </Modal>
    </div>
  );
}

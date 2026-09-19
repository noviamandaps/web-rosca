'use client';

import { useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button, Input } from '@/components/ui';
import { exportUsers, useToggleUserActive, useUsers } from '@/services/admin/admin-users';
import type { UserRow } from '@/lib/api-types';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState('');
  const limit = 20;
  const { data, isLoading, error } = useUsers({
    page,
    limit,
    search: search || undefined,
    isActive: isActive === '' ? undefined : isActive === 'yes',
  });
  const toggle = useToggleUserActive();

  const money = (v?: number | string) => `Rp ${Number(v ?? 0).toLocaleString('id-ID')}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Users</h1>
        <Button size="sm" variant="secondary" onClick={() => exportUsers().catch((e) => alert(e instanceof Error ? e.message : 'Export failed'))} type="button">
          Export
        </Button>
      </div>
      <AdminTable<UserRow>
        columns={[
          { header: 'Name', render: (u) => u.name ?? '-' },
          { header: 'Email', render: (u) => u.email },
          { header: 'Phone', render: (u) => u.phone ?? '-' },
          { header: 'Membership', render: (u) => u.membershipLevel ?? '-' },
          { header: 'Spending', render: (u) => money(u.totalSpending) },
          { header: 'Active', render: (u) => (u.isActive === false ? 'No' : 'Yes') },
          {
            header: '',
            render: (u) => (
              <button type="button" onClick={() => toggle.mutate(u.id)} className="text-xs uppercase tracking-wider hover:underline">
                Toggle
              </button>
            ),
          },
        ]}
        rows={data?.users}
        loading={isLoading}
        error={error}
        page={page}
        total={data?.pagination.total ?? 0}
        limit={limit}
        onPage={setPage}
        toolbar={
          <>
            <Input
              placeholder="Search user…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
            <select
              value={isActive}
              onChange={(e) => {
                setPage(1);
                setIsActive(e.target.value);
              }}
              className="border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
            >
              <option value="">Semua</option>
              <option value="yes">Active</option>
              <option value="no">Inactive</option>
            </select>
          </>
        }
      />
    </div>
  );
}

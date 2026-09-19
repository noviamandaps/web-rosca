'use client';

import { useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button, Input } from '@/components/ui';
import { exportUsers, useUsers } from '@/services/admin/admin-users';
import type { UserRow } from '@/lib/api-types';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, error } = useUsers({ page, limit });

  async function handleExport() {
    try {
      await exportUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Users</h1>
        <Button size="sm" variant="secondary" onClick={handleExport} type="button">
          Export XLSX
        </Button>
      </div>
      <AdminTable<UserRow>
        columns={[
          { header: 'Name', render: (u) => u.name ?? '-' },
          { header: 'Email', render: (u) => u.email },
          { header: 'Phone', render: (u) => u.phone ?? '-' },
          { header: 'Joined', render: (u) => (u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-') },
        ]}
        rows={data?.data}
        loading={isLoading}
        error={error}
        page={page}
        total={data?.total ?? 0}
        limit={limit}
        onPage={setPage}
      />
    </div>
  );
}

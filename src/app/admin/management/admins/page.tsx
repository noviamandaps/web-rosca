'use client';

import { useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button, Input, Modal } from '@/components/ui';
import { useAdmins, useDeleteAdmin, useSaveAdmin } from '@/services/admin/admin-management';
import type { AdminUser } from '@/lib/api-types';

export default function AdminManagementPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, error: listError } = useAdmins({ page, limit });
  const save = useSaveAdmin();
  const del = useDeleteAdmin();

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function openEdit(a?: AdminUser) {
    setEditing(a ?? null);
    setEmail(a?.email ?? '');
    setName(a?.name ?? '');
    setRole(a?.role ?? 'ADMIN');
    setIsActive(a?.isActive ?? true);
    setPassword('');
    setError('');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await save.mutateAsync({
        id: editing?.id,
        data: { email, name: name || undefined, role, isActive, password: password || undefined },
      });
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Admin Management</h1>
        <Button size="sm" type="button" onClick={() => openEdit()}>
          + Add Admin
        </Button>
      </div>
      <AdminTable<AdminUser>
        columns={[
          { header: 'Email', render: (a) => a.email },
          { header: 'Name', render: (a) => a.name ?? '-' },
          { header: 'Role', render: (a) => a.role },
          {
            header: 'Active',
            render: (a) => (
              <button type="button" onClick={() => openEdit(a)} className={a.isActive ? 'text-brand-black' : 'text-brand-gray'}>
                {a.isActive ? 'Yes' : 'No'}
              </button>
            ),
          },
          {
            header: '',
            render: (a) => (
              <button
                type="button"
                onClick={() => confirm(`Delete admin ${a.email}?`) && del.mutate(a.id)}
                className="text-xs text-ui-error uppercase tracking-wider"
              >
                Delete
              </button>
            ),
          },
        ]}
        rows={data?.data}
        loading={isLoading}
        error={listError}
        page={page}
        total={data?.total ?? 0}
        limit={limit}
        onPage={setPage}
      />
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Admin' : 'New Admin'}>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-brand-border px-4 py-3 text-sm mt-1 bg-white focus:border-brand-black focus:outline-none"
            >
              {['SUPER_ADMIN', 'ADMIN', 'OPERATOR'].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <Input label="Password (optional)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active
          </label>
          {error && <span className="text-2xs text-ui-error">{error}</span>}
          <Button type="submit">{save.isPending ? 'Saving…' : 'Save'}</Button>
        </form>
      </Modal>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { uploadSingle } from '@/services/admin/admin-products';
import {
  useBenefitIllustration,
  useBenefits,
  useDeleteBenefit,
  useSaveBenefit,
  useSaveIllustration,
  useToggleBenefit,
} from '@/services/admin/admin-cms';
import type { Benefit } from '@/lib/api-types';

export default function AdminBenefitsPage() {
  const { data: benefits, isLoading } = useBenefits();
  const { data: illustrations } = useBenefitIllustration();
  const save = useSaveBenefit();
  const del = useDeleteBenefit();
  const toggle = useToggleBenefit();
  const saveIllus = useSaveIllustration();

  const [editing, setEditing] = useState<Partial<Benefit> | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      let imageUrl: string | undefined = editing?.imageUrl;
      if (file) {
        const res = await uploadSingle(file);
        imageUrl = res.url ?? res.data?.url;
      }
      await save.mutateAsync({
        id: editing?.id,
        data: { title, description: description || undefined, imageUrl },
      });
      setEditing(null);
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  const open = !!editing;
  const list = benefits ?? [];  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-widest mb-6">Benefits</h1>

      <div className="flex items-center justify-between mb-4">
        <Button
          size="sm"
          type="button"
          onClick={() => {
            setEditing({});
            setTitle('');
            setDescription('');
            setFile(null);
          }}
        >
          + Add
        </Button>
      </div>
      {isLoading && <p className="text-xs text-brand-gray">Loading…</p>}
      <div className="flex flex-col gap-3 mb-10">
        {list.map((b) => (
          <div key={b.id} className="border border-brand-border p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-40">
              <p className="text-sm font-medium">{b.title}</p>
              <p className="text-2xs text-brand-gray">{b.description ?? '-'}</p>
            </div>
            <div className="flex gap-3 text-xs uppercase tracking-wider">
              <button
                type="button"
                onClick={() => {
                  setEditing(b);
                  setTitle(b.title);
                  setDescription(b.description ?? '');
                }}
                className="hover:underline"
              >
                Edit
              </button>
              <button type="button" onClick={() => del.mutate(b.id)} className="text-ui-error">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Benefit Illustration</h2>
      <div className="flex flex-col gap-3">
        {(illustrations ?? []).map((b) => (
          <div key={b.id} className="border border-brand-border p-4 flex flex-wrap items-center gap-4">
            <p className="flex-1 text-sm">{b.title}</p>
            <Button
              size="sm"
              variant="secondary"
              type="button"
              onClick={async () => {
                try {
                  await saveIllus.mutateAsync({ id: b.id, isActive: !b.isActive });
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'Failed');
                }
              }}
            >
              Toggle
            </Button>
          </div>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Benefit' : 'New Benefit'}>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
          {error && <span className="text-2xs text-ui-error">{error}</span>}
          <Button type="submit">{save.isPending ? 'Saving…' : 'Save'}</Button>
        </form>
      </Modal>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { useAboutUs, useDeleteAbout, useSaveAbout, useToggleAbout } from '@/services/admin/admin-cms';
import type { AboutUs } from '@/lib/api-types';

export default function AdminAboutPage() {
  const { data: items, isLoading } = useAboutUs();
  const save = useSaveAbout();
  const del = useDeleteAbout();
  const toggle = useToggleAbout();

  const [editing, setEditing] = useState<AboutUs | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await save.mutateAsync({
        id: editing?.id,
        data: {
          title,
          subtitle: subtitle || undefined,
          description,
          isActive: editing?.isActive ?? true,
          sortOrder: editing?.sortOrder,
        },
      });
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  const list = items ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">About Us CMS</h1>
        <Button size="sm" type="button" onClick={() => { setEditing({ id: '', title: '' }); setTitle(''); setSubtitle(''); setDescription(''); }}>
          + Add
        </Button>
      </div>
      {isLoading && <p className="text-xs text-brand-gray">Loading…</p>}
      <div className="flex flex-col gap-3">
        {list.map((a) => (
          <div key={a.id} className="border border-brand-border p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-40">
              <p className="text-sm font-medium">{a.title}</p>
              <p className="text-2xs text-brand-gray">{a.description ?? '-'}</p>
            </div>
            <div className="flex gap-3 text-xs uppercase tracking-wider">
              <button type="button" onClick={() => toggle.mutate(a.id)} className={a.isActive ? 'text-brand-black' : 'text-brand-gray'}>
                {a.isActive ? 'Active' : 'Inactive'}
              </button>
              <button type="button" onClick={() => { setEditing(a); setTitle(a.title); setSubtitle(a.subtitle ?? ''); setDescription(a.description ?? ''); }} className="hover:underline">
                Edit
              </button>
              <button type="button" onClick={() => del.mutate(a.id)} className="text-ui-error">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Section' : 'New Section'}>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          {error && <span className="text-2xs text-ui-error">{error}</span>}
          <Button type="submit">{save.isPending ? 'Saving…' : 'Save'}</Button>
        </form>
      </Modal>
    </div>
  );
}

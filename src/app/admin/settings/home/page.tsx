'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { uploadSingle } from '@/services/admin/admin-products';
import {
  useAdminSliders,
  useDeleteSlider,
  useReorderSliders,
  useSaveSlider,
  useToggleSlider,
} from '@/services/admin/admin-cms';
import type { Benefit } from '@/lib/api-types';

// ponytail: slider & benefit share field shape di backend admin (title/description/imageUrl/sortOrder)
type Slide = Benefit & { ctaLink?: string };

export default function AdminHomeCmsPage() {
  const { data: sliders, isLoading } = useAdminSliders();
  const save = useSaveSlider();
  const del = useDeleteSlider();
  const toggle = useToggleSlider();
  const reorder = useReorderSliders();

  const [editing, setEditing] = useState<Slide | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  function openEdit(s: Slide) {
    setEditing(s);
    setTitle(s.title);
    setSubtitle(s.description ?? '');
    setCtaText('');
    setCtaLink('');
    setFile(null);
    setError('');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      let imageUrl: string | undefined = editing?.imageUrl;
      if (file) {
        const res = await uploadSingle(file);
        imageUrl = res.url ?? res.data?.url;
      }
      const data = {
        title,
        description: subtitle || undefined,
        imageUrl,
        ctaText: ctaText || undefined,
        ctaLink: ctaLink || undefined,
        sortOrder: sliders?.findIndex((s) => s.id === editing?.id) ?? undefined,
      };
      await save.mutateAsync({ id: editing?.id, data });
      setEditing(null);
      setCreating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  function move(s: Slide, dir: -1 | 1) {
    if (!sliders) return;
    const idx = sliders.findIndex((x) => x.id === s.id);
    const next = [...sliders];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    reorder.mutate(next.map((x, i) => ({ id: x.id, sortOrder: i })));
  }

  const open = creating || !!editing;
  const list = sliders ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Home Sliders</h1>
        <Button size="sm" type="button" onClick={() => { setCreating(true); setEditing(null); setTitle(''); setSubtitle(''); setCtaText(''); setCtaLink(''); setFile(null); }}>
          + Add
        </Button>
      </div>
      {isLoading && <p className="text-xs text-brand-gray">Loading…</p>}
      <div className="flex flex-col gap-3">
        {list.map((s, i) => (
          <div key={s.id} className="border border-brand-border p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-40">
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-2xs text-brand-gray">{s.description ?? '-'}</p>
            </div>
            <div className="flex gap-3 text-xs uppercase tracking-wider">
              <button type="button" onClick={() => move(s, -1)} className="text-brand-gray hover:text-brand-black">↑</button>
              <button type="button" onClick={() => move(s, 1)} className="text-brand-gray hover:text-brand-black">↓</button>
              <button type="button" onClick={() => toggle.mutate({ id: s.id, isActive: !s.isActive })} className={s.isActive ? 'text-brand-black' : 'text-brand-gray'}>
                {s.isActive ? 'Active' : 'Inactive'}
              </button>
              <button type="button" onClick={() => openEdit(s)} className="hover:underline">Edit</button>
              <button type="button" onClick={() => del.mutate(s.id)} className="text-ui-error">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => { setEditing(null); setCreating(false); }} title={editing ? 'Edit Slider' : 'New Slider'}>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          <Input label="CTA Text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
          <Input label="CTA Link" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
          {error && <span className="text-2xs text-ui-error">{error}</span>}
          <Button type="submit">{save.isPending ? 'Saving…' : 'Save'}</Button>
        </form>
      </Modal>
    </div>
  );
}

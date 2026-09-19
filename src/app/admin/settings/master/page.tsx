'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import {
  useBanks,
  useDeleteBank,
  useSaveBank,
  useToggleBank,
  useDeleteVolume,
  useSaveVolume,
  useToggleVolume,
  useVolumes,
} from '@/services/admin/admin-mst';
import type { MstBank, MstVolume } from '@/lib/api-types';

export default function AdminMasterPage() {
  const { data: volumes, isLoading: lv } = useVolumes();
  const { data: banks, isLoading: lb } = useBanks();
  const saveVolume = useSaveVolume();
  const delVolume = useDeleteVolume();
  const toggleVolume = useToggleVolume();
  const saveBank = useSaveBank();
  const delBank = useDeleteBank();
  const toggleBank = useToggleBank();

  const [volume, setVolume] = useState<string>('');
  const [editingVolume, setEditingVolume] = useState<Partial<MstVolume> | null>(null);
  const [bankModal, setBankModal] = useState<Partial<MstBank> | null>(null);
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [bankImage, setBankImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  async function submitVolume(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await saveVolume.mutateAsync({ id: editingVolume?.id, data: { value: Number(volume) } });
      setEditingVolume(null);
      setVolume('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function submitBank(e: React.FormEvent) {
    e.preventDefault();
    if (!bankModal) return;
    setError('');
    try {
      await saveBank.mutateAsync({
        id: bankModal.id,
        data: { name: bankName, code: bankCode || undefined },
        image: bankImage ?? undefined,
      });
      setBankModal(null);
      setBankImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-widest mb-6">Master Data</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider">Volumes</h2>
            <Button size="sm" type="button" onClick={() => { setEditingVolume({ id: '' }); setVolume(''); }}>
              + Add
            </Button>
          </div>
          {lv && <p className="text-xs text-brand-gray mb-2">Loading…</p>}
          <div className="flex flex-col gap-2">
            {(volumes ?? []).map((v: MstVolume) => (
              <div key={v.id} className="border border-brand-border p-3 flex items-center gap-3 text-sm">
                <span className="flex-1">{v.value} ml</span>
                <button type="button" onClick={() => toggleVolume.mutate(v.id)} className={`text-xs uppercase ${v.isActive ? 'text-brand-black' : 'text-brand-gray'}`}>
                  {v.isActive ? 'Active' : 'Inactive'}
                </button>
                <button type="button" onClick={() => { setEditingVolume(v); setVolume(String(v.value)); }} className="text-xs uppercase hover:underline">
                  Edit
                </button>
                <button type="button" onClick={() => delVolume.mutate(v.id)} className="text-xs uppercase text-ui-error">
                  Del
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider">Banks</h2>
            <Button size="sm" type="button" onClick={() => { setBankModal({ id: '' }); setBankName(''); setBankCode(''); }}>
              + Add
            </Button>
          </div>
          {lb && <p className="text-xs text-brand-gray mb-2">Loading…</p>}
          <div className="flex flex-col gap-2">
            {(banks ?? []).map((b: MstBank) => (
              <div key={b.id} className="border border-brand-border p-3 flex items-center gap-3 text-sm">
                <span className="flex-1">{b.name}</span>
                <button type="button" onClick={() => toggleBank.mutate(b.id)} className={`text-xs uppercase ${b.isActive ? 'text-brand-black' : 'text-brand-gray'}`}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </button>
                <button type="button" onClick={() => { setBankModal(b); setBankName(b.name); setBankCode(b.code ?? ''); }} className="text-xs uppercase hover:underline">
                  Edit
                </button>
                <button type="button" onClick={() => delBank.mutate(b.id)} className="text-xs uppercase text-ui-error">
                  Del
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Modal isOpen={!!editingVolume} onClose={() => setEditingVolume(null)} title={editingVolume?.id ? 'Edit Volume' : 'New Volume'}>
        <form onSubmit={submitVolume} className="flex flex-col gap-4">
          <Input label="Value (ml)" type="number" value={volume} onChange={(e) => setVolume(e.target.value)} required />
          {error && <span className="text-2xs text-ui-error">{error}</span>}
          <Button type="submit">{saveVolume.isPending ? 'Saving…' : 'Save'}</Button>
        </form>
      </Modal>

      <Modal isOpen={!!bankModal} onClose={() => setBankModal(null)} title={bankModal?.id ? 'Edit Bank' : 'New Bank'}>
        <form onSubmit={submitBank} className="flex flex-col gap-4">
          <Input label="Name" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
          <Input label="Code" value={bankCode} onChange={(e) => setBankCode(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => setBankImage(e.target.files?.[0] ?? null)} className="text-sm" />
          {error && <span className="text-2xs text-ui-error">{error}</span>}
          <Button type="submit">{saveBank.isPending ? 'Saving…' : 'Save'}</Button>
        </form>
      </Modal>
    </div>
  );
}

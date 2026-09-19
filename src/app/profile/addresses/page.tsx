'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import {
  useAddresses,
  useDeleteAddress,
  useSaveAddress,
  useSetDefaultAddress,
} from '@/services/user/cart';
import { useCities, useDistricts, useProvinces } from '@/services/user/shipping';
import type { Address } from '@/lib/api-types';

const empty = {
  label: '',
  recipientName: '',
  phone: '',
  province: '',
  provinceId: '',
  city: '',
  cityId: '',
  district: '',
  districtId: '',
  subdistrict: '',
  subdistrictId: '',
  postalCode: '',
  fullAddress: '',
  komerceDestinationId: '',
  isDefault: false,
};

export default function ProfileAddressesPage() {
  const { data: res, isLoading } = useAddresses();
  const save = useSaveAddress();
  const del = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const { data: provinces } = useProvinces();

  const [editing, setEditing] = useState<Address | null>(null);
  const [provIdState, setProvIdState] = useState('');
  const [cityIdState, setCityIdState] = useState('');
  const [error, setError] = useState('');
  const { data: cities } = useCities(provIdState || undefined);
  const { data: districts } = useDistricts(cityIdState || undefined);

  const list = res?.addresses ?? [];

  function openNew() {
    setEditing({ recipientName: '', phone: '', province: '', provinceId: '', city: '', cityId: '', district: '', districtId: '', postalCode: '', fullAddress: '', komerceDestinationId: '', latitude: 0, longitude: 0 } as Address);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError('');
    // ponytail: komerceDestinationId = districtId (staging match); lat/lng number wajib (audit)
    const data = { ...editing, komerceDestinationId: editing.komerceDestinationId ?? editing.districtId };
    try {
      await save.mutateAsync({ id: editing.id, data: data });
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <Link href="/profile" className="text-xs text-brand-gray hover:text-brand-black uppercase tracking-wider">
          ← Profile
        </Link>
        <div className="flex items-center justify-between mt-2 mb-6">
          <h1 className="text-2xl font-bold tracking-widest uppercase">Addresses</h1>
          <Button size="sm" type="button" onClick={openNew}>
            + Add Address
          </Button>
        </div>

        {isLoading && <p className="text-xs text-brand-gray">Loading…</p>}
        <div className="flex flex-col gap-3">
          {list.map((a) => (
            <div key={a.id} className="border border-brand-border p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-40">
                <p className="text-sm font-medium">
                  {a.recipientName} {a.isDefault && <span className="text-2xs text-brand-gray">· default</span>}
                </p>
                <p className="text-2xs text-brand-gray">
                  {a.fullAddress}, {a.district}, {a.city}, {a.province} {a.postalCode}
                </p>
              </div>
              <div className="flex gap-3 text-xs uppercase tracking-wider">
                <button type="button" onClick={() => setDefault.mutate(a.id!)} className="hover:underline">
                  Default
                </button>
                <button type="button" onClick={() => setEditing(a)} className="hover:underline">
                  Edit
                </button>
                <button type="button" onClick={() => del.mutate(a.id!)} className="text-ui-error">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!isLoading && list.length === 0 && <p className="text-xs text-brand-gray">Belum ada alamat.</p>}
        </div>

        <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Address' : 'New Address'}>
          {editing && (
            <form onSubmit={submit} className="grid grid-cols-2 gap-4">
              <Input label="Label" value={editing.label ?? ''} onChange={(e) => setEditing({ ...editing, label: e.target.value })} />
              <Input label="Recipient Name" value={editing.recipientName} onChange={(e) => setEditing({ ...editing, recipientName: e.target.value })} required />
              <Input label="Phone (10-15 digits)" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} required />
              <Input label="Postal Code" value={editing.postalCode} onChange={(e) => setEditing({ ...editing, postalCode: e.target.value })} required />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">Province</label>
                <select
                  value={provIdState}
                  onChange={(e) => {
                    const id = e.target.value;
                    setProvIdState(id);
                    const p = (provinces ?? []).find((x) => String(x.id) === id);
                    setEditing({ ...editing, provinceId: id, province: p?.name ?? '' });
                  }}
                  className="w-full border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
                  required
                >
                  <option value="">—</option>
                  {(provinces ?? []).map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">City</label>
                <select
                  value={cityIdState}
                  onChange={(e) => {
                    const id = e.target.value;
                    setCityIdState(id);
                    const c = (cities ?? []).find((x) => String(x.id) === id);
                    setEditing({ ...editing, cityId: id, city: c?.name ?? '' });
                  }}
                  className="w-full border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
                  required
                >
                  <option value="">—</option>
                  {(cities ?? []).map((c) => (
                    <option key={String(c.id)} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">District</label>
                <select
                  value={editing.districtId ?? ''}
                  onChange={(e) => {
                    const id = e.target.value;
                    const d = (districts ?? []).find((x) => String(x.id) === id);
                    setEditing({ ...editing, districtId: id, district: d?.name ?? '', komerceDestinationId: id });
                  }}
                  className="w-full border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
                  required
                >
                  <option value="">—</option>
                  {(districts ?? []).map((d) => (
                    <option key={String(d.id)} value={String(d.id)}>
                      {d.name ?? d.id}
                    </option>
                  ))}
                </select>
              </div>
              <Input label="Subdistrict" value={editing.subdistrict ?? ''} onChange={(e) => setEditing({ ...editing, subdistrict: e.target.value })} required />
              <Input label="Subdistrict ID" value={editing.subdistrictId ?? ''} onChange={(e) => setEditing({ ...editing, subdistrictId: e.target.value })} />
              <div className="col-span-2">
                <Input label="Full Address" value={editing.fullAddress} onChange={(e) => setEditing({ ...editing, fullAddress: e.target.value })} required />
              </div>
              <label className="col-span-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!editing.isDefault} onChange={(e) => setEditing({ ...editing, isDefault: e.target.checked })} /> Default address
              </label>
              <p className="col-span-2 text-2xs text-brand-gray">
                {/* ponytail: lat/lng diisi 0 default — pinpoint map menyusul */}
                Latitude/longitude diisi 0,0 (staging menerima angka).
              </p>
              {error && <span className="col-span-2 text-2xs text-ui-error">{error}</span>}
              <div className="col-span-2">
                <Button type="submit">{save.isPending ? 'Saving…' : 'Save'}</Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
}

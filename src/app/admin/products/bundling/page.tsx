'use client';

import { useBundles } from '@/services/admin/admin-cms';
import type { Bundle } from '@/lib/api-types';

export default function AdminBundlingPage() {
  const { data: bundles, isLoading, error } = useBundles();

  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-widest mb-2">Bundling</h1>
      <p className="text-2xs text-brand-gray mb-6">// ponytail: read-only sampai backend expose CRUD bundle</p>
      {isLoading && <p className="text-xs text-brand-gray">Loading…</p>}
      {error && (
        <p className="text-sm text-ui-error">{error instanceof Error ? error.message : 'Failed to load'}</p>
      )}
      <div className="flex flex-col gap-3">
        {(bundles ?? []).map((b: Bundle) => (
          <div key={b.id} className="border border-brand-border p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">{b.name ?? b.title ?? b.id}</p>
              {b.price !== undefined && <p className="text-2xs text-brand-gray">Rp {b.price.toLocaleString('id-ID')}</p>}
            </div>
            {b.isActive !== undefined && <span className="text-xs uppercase tracking-wider">{b.isActive ? 'Active' : 'Inactive'}</span>}
          </div>
        ))}
        {!bundles?.length && !isLoading && <p className="text-xs text-brand-gray">No bundles</p>}
      </div>
    </div>
  );
}

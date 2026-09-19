'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button, Input } from '@/components/ui';
import {
  useProducts,
  useDeleteProduct,
  useToggleActive,
  useToggleFeatured,
} from '@/services/admin/admin-products';
import type { Product } from '@/lib/api-types';

const nf = new Intl.NumberFormat('id-ID');

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;
  const { data, isLoading, error } = useProducts({ page, limit, search: search || undefined });
  const del = useDeleteProduct();
  const toggleActive = useToggleActive();
  const toggleFeatured = useToggleFeatured();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Products</h1>
        <Button href="/admin/products/new" size="sm">
          + Add Product
        </Button>
      </div>
      <AdminTable<Product>
        columns={[
          {
            header: 'Product',
            render: (p) => (
              <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">
                {p.name}
              </Link>
            ),
          },
          { header: 'Price', render: (p) => `Rp ${nf.format(p.price)}` },
          {
            header: 'Active',
            render: (p) => (
              <button
                type="button"
                onClick={() => toggleActive.mutate(p.id)}
                className={`text-xs uppercase tracking-wider ${p.isActive ? 'text-brand-black' : 'text-brand-gray'}`}
              >
                {p.isActive ? 'Yes' : 'No'}
              </button>
            ),
          },
          {
            header: 'Featured',
            render: (p) => (
              <button
                type="button"
                onClick={() => toggleFeatured.mutate(p.id)}
                className={`text-xs uppercase tracking-wider ${p.isFeatured ? 'text-brand-black' : 'text-brand-gray'}`}
              >
                {p.isFeatured ? 'Yes' : 'No'}
              </button>
            ),
          },
          {
            header: '',
            render: (p) => (
              <button
                type="button"
                onClick={() => confirm(`Delete "${p.name}"?`) && del.mutate(p.id)}
                className="text-xs text-ui-error uppercase tracking-wider"
              >
                Delete
              </button>
            ),
          },
        ]}
        rows={data?.data}
        loading={isLoading}
        error={error}
        page={page}
        total={data?.total ?? 0}
        limit={limit}
        onPage={setPage}
        toolbar={
          <Input
            placeholder="Search product…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        }
      />
    </div>
  );
}

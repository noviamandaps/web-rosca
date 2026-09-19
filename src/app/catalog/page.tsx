'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/sections';
import { useProducts } from '@/services/user/products';
import { toUiProduct } from '@/lib/public-map';
import type { Product } from '@/lib/data';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

export default function CatalogPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const limit = 20;

  const { data: items, isLoading, error } = useProducts({
    page,
    limit,
    search: searchQuery || undefined,
  });

  const products = (items ?? []).map(toUiProduct);
  const sorted = [...products];
  if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
  else if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-6">CATALOG</h1>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setPage(1);
                setSearchQuery(e.target.value);
              }}
              className="w-full md:w-64 px-4 py-2 border border-brand-border text-sm focus:border-brand-black focus:outline-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-brand-border text-xs uppercase tracking-wider focus:border-brand-black focus:outline-none bg-white"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {isLoading && <p className="text-xs text-brand-gray">Loading products…</p>}
        {error && (
          <p className="text-sm text-ui-error">
            {error instanceof Error ? error.message : 'Failed to load products'}
          </p>
        )}

        {!isLoading && sorted.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {!isLoading && !error && sorted.length === 0 && (
          <div className="text-center py-16">
            <p className="text-brand-gray">No products found.</p>
          </div>
        )}

        {items && (
          <div className="flex justify-center gap-4 mt-10">
            {page > 1 && (
              <button onClick={() => setPage(page - 1)} className="text-xs uppercase tracking-wider text-brand-gray hover:text-brand-black">
                ← Prev
              </button>
            )}
            <span className="text-xs text-brand-gray">Page {page}</span>
            {items.length === limit && (
              <button onClick={() => setPage(page + 1)} className="text-xs uppercase tracking-wider text-brand-gray hover:text-brand-black">
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

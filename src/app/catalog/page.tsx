'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/sections';
import { products } from '@/lib/data';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';
type FilterOption = 'all' | 'new' | 'best' | 'sale';

export default function CatalogPage() {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'new':
          result = result.filter(p => p.badge === 'NEW');
          break;
        case 'best':
          result = result.filter(p => p.badge === 'BEST');
          break;
        case 'sale':
          result = result.filter(p => p.badge === 'SALE' || p.originalPrice);
          break;
      }
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        // Keep original order (assuming newest first)
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [sortBy, filterBy, searchQuery]);

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-6">
            CATALOG
          </h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-brand-border text-sm focus:border-brand-black focus:outline-none"
            />

            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="px-4 py-2 border border-brand-border text-xs uppercase tracking-wider focus:border-brand-black focus:outline-none bg-white"
              >
                <option value="all">All Products</option>
                <option value="new">New Arrivals</option>
                <option value="best">Best Sellers</option>
                <option value="sale">On Sale</option>
              </select>

              {/* Sort */}
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
        </div>

        {/* Results Count */}
        <p className="text-xs text-brand-gray mb-6">
          Showing {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
        </p>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-brand-gray">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

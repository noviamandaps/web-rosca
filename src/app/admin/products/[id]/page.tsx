'use client';

import { ProductForm } from '@/components/admin/ProductForm';
import { useProduct } from '@/services/admin/admin-products';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading)
    return <div className="py-16 text-center text-brand-gray uppercase tracking-widest text-xs">Loading…</div>;
  if (error || !product)
    return (
      <div className="py-16 text-center text-ui-error text-sm">
        {error instanceof Error ? error.message : 'Product not found'}
      </div>
    );

  return <ProductForm product={product} />;
}

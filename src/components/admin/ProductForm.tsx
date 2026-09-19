'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useCategories, useCreateProduct, useUpdateProduct, useSetPrimaryImage, useDeleteImage } from '@/services/admin/admin-products';
import type { CreateProductPayload, Product, ProductVariantInput } from '@/lib/api-types';

interface Props {
  product?: Product;
}

interface FormVariant extends ProductVariantInput {
  warehouseId?: string;
  stock?: number;
}

const emptyVariant: FormVariant = { sku: '', isActive: true, warehouseId: '', stock: 0 };

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const { data: cats } = useCategories();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const setPrimary = useSetPrimaryImage();
  const delImage = useDeleteImage();

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(String(product?.price ?? ''));
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice ? String(product.originalPrice) : '');
  const [categoryIds, setCategoryIds] = useState<string[]>(product?.categoryIds ?? product?.categories?.map((c) => c.id) ?? []);
  const [images, setImages] = useState<File[]>([]);
  const [variants, setVariants] = useState<FormVariant[]>(
    product?.variants?.length
      ? product.variants.map((v) => ({
          sku: v.sku,
          colorName: v.colorName,
          sizeLabel: v.sizeLabel,
          additionalPrice: v.additionalPrice,
          isActive: v.isActive ?? true,
          warehouseId: v.inventories?.[0]?.warehouseId,
          stock: v.inventories?.[0]?.stock ?? 0,
        }))
      : [emptyVariant]
  );
  const [error, setError] = useState('');

  const pending = create.isPending || update.isPending;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const data: CreateProductPayload = {
      name,
      description: description || undefined,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      categoryIds,
      variants: variants.map((v) => ({
        sku: v.sku || undefined,
        colorName: v.colorName || undefined,
        sizeLabel: v.sizeLabel || undefined,
        additionalPrice: v.additionalPrice || undefined,
        isActive: v.isActive,
        inventories: v.warehouseId ? [{ warehouseId: v.warehouseId, stock: v.stock ?? 0 }] : undefined,
      })),
    };
    try {
      if (product) {
        await update.mutateAsync({ id: product.id, data, images });
      } else {
        await create.mutateAsync({ data, images });
      }
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl flex flex-col gap-6">
      <Link href="/admin/products" className="text-xs text-brand-gray hover:text-brand-black uppercase tracking-wider">
        ← Back
      </Link>
      <h1 className="text-xl font-bold uppercase tracking-widest">{product ? 'Edit Product' : 'New Product'}</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Price (Rp)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <Input label="Original Price (Rp)" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-brand-border px-4 py-3 text-sm mt-1 focus:border-brand-black focus:outline-none"
          rows={3}
        />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-brand-dark mb-2">Categories</p>
        <div className="flex flex-wrap gap-4">
          {(cats?.data ?? []).map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={categoryIds.includes(c.id)}
                onChange={(e) =>
                  setCategoryIds((prev) => (e.target.checked ? [...prev, c.id] : prev.filter((id) => id !== c.id)))
                }
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-brand-dark mb-2">
          Images {product?.images?.length ? `(existing: ${product.images.length})` : ''} — max 5 baru
        </p>
        {product?.images?.length ? (
          <div className="flex flex-wrap gap-3 mb-3">
            {product.images.map((img) => (
              <div key={img.id} className="flex flex-col items-center gap-1 text-2xs">
                <span className="border border-brand-border px-2 py-1 truncate max-w-[160px]">{img.url.split('/').pop()}</span>
                <span className="flex gap-2">
                  {!img.isPrimary && (
                    <button type="button" onClick={() => setPrimary.mutate({ productId: product.id, imageId: img.id })} className="text-brand-gray hover:text-brand-black">
                      Primary
                    </button>
                  )}
                  <button type="button" onClick={() => delImage.mutate({ productId: product.id, imageId: img.id })} className="text-ui-error">
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        ) : null}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files ?? []))}
          className="text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-dark">Variants</p>
          <Button size="sm" variant="secondary" type="button" onClick={() => setVariants((v) => [...v, { ...emptyVariant }])}>
            + Variant
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {variants.map((v, i) => (
            <div key={i} className="border border-brand-border p-4 grid md:grid-cols-5 gap-3">
              <Input placeholder="SKU" value={v.sku ?? ''} onChange={(e) => setVariants((a) => a.map((x, j) => (j === i ? { ...x, sku: e.target.value } : x)))} />
              <Input placeholder="Color" value={v.colorName ?? ''} onChange={(e) => setVariants((a) => a.map((x, j) => (j === i ? { ...x, colorName: e.target.value } : x)))} />
              <Input placeholder="Size" value={v.sizeLabel ?? ''} onChange={(e) => setVariants((a) => a.map((x, j) => (j === i ? { ...x, sizeLabel: e.target.value } : x)))} />
              <Input placeholder="Warehouse ID" value={v.warehouseId ?? ''} onChange={(e) => setVariants((a) => a.map((x, j) => (j === i ? { ...x, warehouseId: e.target.value } : x)))} />
              <Input placeholder="Stock" type="number" value={String(v.stock ?? '')} onChange={(e) => setVariants((a) => a.map((x, j) => (j === i ? { ...x, stock: Number(e.target.value) } : x)))} />
            </div>
          ))}
        </div>
      </div>

      {error && <span className="text-2xs text-ui-error">{error}</span>}
      <div>
        <Button type="submit">{pending ? 'Saving…' : product ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}

import type { PublicProduct } from '@/lib/api-types';
import type { Product } from '@/lib/data';

const num = (v: unknown) => (typeof v === 'string' ? Number(v) : (v as number | undefined));

// ponytail: mapping ke shape nyata staging — price = salePrice ?? basePrice (+additionalPrice per variant)
export function toUiProduct(p: PublicProduct): Product {
  const images = (p.images ?? [])
    .map((img) => img.imageUrl ?? img.url ?? '')
    .filter(Boolean);
  const firstVariant = p.variants?.[0];
  const base = num(p.basePrice) ?? num(p.price) ?? 0;
  const sale = num(p.salePrice);
  const variantBase =
    firstVariant && (firstVariant.additionalPrice !== undefined || firstVariant.price !== undefined)
      ? base + (num(firstVariant.additionalPrice) ?? 0)
      : undefined;
  const price = sale ?? num(firstVariant?.price) ?? variantBase ?? base;
  const badge = p.isNewArrival ? 'NEW' : p.isBestSelling ? 'BEST' : p.isSale ? 'SALE' : undefined;
  const stock =
    p.stock ??
    p.variants?.reduce((a, v) => a + (v.stockQuantity ?? v.stock ?? 0), 0) ??
    0;
  const category =
    p.productCategories?.[0]?.category?.name ?? p.productCategories?.[0]?.name ?? p.category ?? '';
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.shortDescription ?? p.description ?? '',
    price,
    originalPrice: sale ? base : num(p.originalPrice ?? undefined),
    images: images.length ? images : ['/products/rosca-1.webp'],
    imageDescriptions: (p.images ?? []).map((i) => i.altText ?? i.description ?? ''),
    category,
    badge,
    stock,
    sold: p.sold ?? 0,
  };
}

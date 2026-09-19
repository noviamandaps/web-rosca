import type { PublicProduct } from '@/lib/api-types';
import type { Product } from '@/lib/data';

// ponytail: mapping shape backend → UI; sesuaikan nama field kalau response nyata beda
export function toUiProduct(p: PublicProduct): Product {
  const images = (p.images ?? [])
    .map((img) => img.url ?? img.imageUrl ?? '')
    .filter(Boolean);
  const firstVariant = p.variants?.[0];
  const price = p.salePrice ?? p.price ?? p.basePrice ?? p.variants?.[0]?.price ?? p.variants?.[0]?.salePrice ?? 0;
  const badge = p.isNewArrival ? 'NEW' : p.isBestSelling ? 'BEST' : p.isSale ? 'SALE' : undefined;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    price,
    originalPrice: p.salePrice && (p.basePrice ?? p.price) ? (p.basePrice ?? p.price) : (p.originalPrice ?? undefined),
    images: images.length ? images : ['/products/rosca-1.webp'],
    imageDescriptions: (p.images ?? []).map((i) => i.description ?? ''),
    category: p.categories?.[0]?.name ?? p.category ?? '',
    badge,
    stock: p.stock ?? p.variants?.reduce((a, v) => a + (v.stock ?? 0), 0) ?? 0,
    sold: p.sold ?? 0,
  };
}

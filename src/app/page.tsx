'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api-client';
import { useBestSelling, useNewArrivals } from '@/services/user/products';
import { toUiProduct } from '@/lib/public-map';
import { HeroBanner, ProductSection, ReviewSection } from '@/components/sections';
import type { CmsSlider, Paginated } from '@/lib/api-types';
import type { Slider, Review, Product } from '@/lib/data';
import { getBestProducts, getNewProducts } from '@/lib/data';

// ponytail: fallback ke dummy data kalau backend kosong — hapus saat semua produk terisi di backend
const dummyNew = getNewProducts() as Product[];
const dummyBest = getBestProducts() as Product[];

export default function HomePage() {
  const sliders = useQuery({
    queryKey: ['cms', 'sliders'],
    queryFn: () => apiFetch<Paginated<CmsSlider>>('/cms/sliders', { params: { limit: 10 } }),
  });
  const newArrivals = useNewArrivals();
  const bestSelling = useBestSelling();
  const reviews = useQuery({
    queryKey: ['reviews', 'home'],
    queryFn: () => fetch('/api/reviews?status=Approved').then((r) => (r.ok ? r.json() : [])) as Promise<Review[]>,
  });

  const slides: Slider[] = (sliders.data?.data ?? [])
    .filter((s) => s.isActive !== false)
    .map((s) => ({
      id: s.id,
      image: s.image ?? s.imageUrl ?? '',
      title: s.title,
      subtitle: s.subtitle,
      ctaText: s.ctaText ?? 'Shop Now',
      ctaLink: s.ctaLink ?? '/catalog',
    }));

  const newProducts = (newArrivals.data ?? []).map(toUiProduct);
  const bestProducts = (bestSelling.data ?? []).map(toUiProduct);

  if (sliders.isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-brand-gray">Loading...</div>
      </div>
    );

  return (
    <>
      <HeroBanner slides={slides} />
      <ProductSection title="NEW ARRIVALS" products={newProducts.length ? newProducts : dummyNew} viewAllLink="/catalog?filter=new" />
      <ProductSection title="BEST SELLERS" products={bestProducts.length ? bestProducts : dummyBest} viewAllLink="/catalog?filter=best" />
      <ReviewSection reviews={reviews.data ?? []} />
    </>
  );
}

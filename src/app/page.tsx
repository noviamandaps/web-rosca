'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api-client';
import { HeroBanner, ProductSection, ReviewSection } from '@/components/sections';
import type { CmsSlider, Paginated } from '@/lib/api-types';
import type { Slider, Review, Product } from '@/lib/data';
import { products, getNewProducts, getBestProducts, getSaleProducts } from '@/lib/data';

export default function HomePage() {
  const sliders = useQuery({
    queryKey: ['cms', 'sliders'],
    queryFn: () => apiFetch<Paginated<CmsSlider>>('/cms/sliders', { params: { limit: 10 } }),
  });
  const reviews = useQuery({
    queryKey: ['reviews', 'home'],
    queryFn: () => fetch('/api/reviews?status=Approved').then((r) => (r.ok ? r.json() : [])) as Promise<Review[]>,  });

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

  const newProducts = getNewProducts();
  const bestProducts = getBestProducts();
  const saleProducts = getSaleProducts();

  if (sliders.isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-brand-gray">Loading...</div>
      </div>
    );

  const uiReviews = reviews.data ?? [];

  return (
    <>
      <HeroBanner slides={slides} />
      <ProductSection title="NEW ARRIVALS" products={newProducts.length > 0 ? newProducts : products} viewAllLink="/catalog?filter=new" />
      <ProductSection title="BEST SELLERS" products={bestProducts} viewAllLink="/catalog?filter=best" />
      {saleProducts.length > 0 && <ProductSection title="ON SALE" products={saleProducts} viewAllLink="/catalog?filter=sale" />}
      <ReviewSection reviews={uiReviews} />
    </>
  );
}

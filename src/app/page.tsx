'use client';

import { useEffect, useState } from 'react';
import { HeroBanner, ProductSection, ReviewSection } from '@/components/sections';
import { Slider, Review, Product } from '@/lib/data';
import { products, getNewProducts, getBestProducts, getSaleProducts } from '@/lib/data';

export default function HomePage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidersRes, reviewsRes] = await Promise.all([
          fetch('/api/sliders'),
          fetch('/api/reviews?status=Approved'),
        ]);

        if (slidersRes.ok) {
          const slidersData = await slidersRes.json();
          setSliders(slidersData);
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get products
  const newProducts: Product[] = getNewProducts();
  const bestProducts: Product[] = getBestProducts();
  const saleProducts: Product[] = getSaleProducts();

  // Show loading state or empty state while loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-brand-gray">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Banner - now uses dynamic data from API */}
      <HeroBanner slides={sliders.length > 0 ? sliders : []} />

      {/* New Products */}
      <ProductSection
        title="NEW ARRIVALS"
        products={newProducts.length > 0 ? newProducts : products}
        viewAllLink="/catalog?filter=new"
      />

      {/* Best Sellers */}
      <ProductSection
        title="BEST SELLERS"
        products={bestProducts}
        viewAllLink="/catalog?filter=best"
      />

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <ProductSection
          title="ON SALE"
          products={saleProducts}
          viewAllLink="/catalog?filter=sale"
        />
      )}

      {/* Reviews - now uses dynamic data from API */}
      <ReviewSection reviews={reviews.length > 0 ? reviews : []} />
    </>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Badge } from '@/components/ui';
import { getProductBySlug, formatPrice, products } from '@/lib/data';
import { ProductCard } from '@/components/sections';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold tracking-widest mb-4">PRODUCT NOT FOUND</h1>
          <p className="text-brand-gray mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button href="/catalog">BACK TO CATALOG</Button>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-custom py-4 border-b border-brand-border">
        <nav className="text-xs text-brand-gray">
          <Link href="/" className="hover:text-brand-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/catalog" className="hover:text-brand-black">Catalog</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-black">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <section className="section-padding border-b border-brand-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-brand-light border border-brand-border mb-4">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <Badge variant={product.badge.toLowerCase() as 'new' | 'sale' | 'best'}>
                      {product.badge}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Image Description */}
              {product.imageDescriptions && product.imageDescriptions[selectedImage] && (
                <p className="text-xs text-brand-gray italic mb-4 px-1">
                  {product.imageDescriptions[selectedImage]}
                </p>
              )}

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 border transition-all ${
                        selectedImage === index
                          ? 'border-brand-black ring-2 ring-brand-black ring-offset-1'
                          : 'border-brand-border hover:border-brand-gray'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl font-medium">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-brand-gray line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <div className="border-t border-brand-border pt-6 mb-6">
                <p className="text-sm text-brand-dark leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Category */}
              <div className="mb-6">
                <span className="text-xs text-brand-gray uppercase tracking-wider">
                  Category: {product.category}
                </span>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-xs font-medium uppercase tracking-wider block mb-2">
                  Quantity
                </label>
                <div className="flex items-center border border-brand-border w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-lg hover:bg-brand-light transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 text-sm font-medium border-x border-brand-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 text-lg hover:bg-brand-light transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button fullWidth size="lg" className="mb-4">
                ADD TO CART
              </Button>

              {/* Stock Info */}
              <p className="text-xs text-brand-gray text-center">
                {product.stock > 10
                  ? 'In Stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : 'Out of Stock'}
              </p>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-brand-border">
                <div className="flex flex-wrap gap-4 text-xs text-brand-gray">
                  <span className="flex items-center gap-1">
                    <span>✓</span> Authentic Product
                  </span>
                  <span className="flex items-center gap-1">
                    <span>✓</span> Secure Payment
                  </span>
                  <span className="flex items-center gap-1">
                    <span>✓</span> Easy Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-lg md:text-xl font-bold tracking-widest uppercase mb-8 md:mb-12">
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

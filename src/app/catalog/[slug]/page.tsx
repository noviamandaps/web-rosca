'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Badge } from '@/components/ui';
import { useAddReview, useBestSelling, useProduct, useProductReviews } from '@/services/user/products';
import { useAddToCart, useToggleWishlist } from '@/services/user/cart';
import { toUiProduct } from '@/lib/public-map';
import { ProductCard } from '@/components/sections';
import { formatPrice } from '@/lib/data';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: reviews } = useProductReviews(slug);
  const { data: related } = useBestSelling();
  const addToCart = useAddToCart();
  const wishlist = useToggleWishlist();
  const addReview = useAddReview();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [variantIdx, setVariantIdx] = useState(0);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');

  if (isLoading)
    return (
      <div className="section-padding text-center text-brand-gray text-xs uppercase tracking-widest">
        Loading…
      </div>
    );

  if (error || !product)
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold tracking-widest mb-4">PRODUCT NOT FOUND</h1>
          <p className="text-brand-gray mb-8">
            {error instanceof Error ? error.message : "The product you're looking for doesn't exist."}
          </p>
          <Button href="/catalog">BACK TO CATALOG</Button>
        </div>
      </div>
    );

  const ui = toUiProduct(product);
  const variants = product.variants ?? [];
  const variant = variants[variantIdx] ?? variants[0];
  const images = (product.images ?? []).map((i) => i.url ?? i.imageUrl ?? '').filter(Boolean);
  const gallery = images.length ? images : ui.images;
  const price = product.salePrice ?? variant?.price ?? ui.price;

  const relatedProducts = (related ?? []).filter((r) => r.id !== product.id).slice(0, 4).map(toUiProduct);

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
              <div className="relative aspect-square bg-brand-light border border-brand-border mb-4">
                <Image src={gallery[selectedImage] ?? gallery[0]} alt={product.name} fill className="object-cover" priority />
                {ui.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="text-2xs uppercase tracking-wider bg-brand-black text-brand-white px-2 py-1">{ui.badge}</span>
                  </div>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-2">
                  {gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 border transition-all ${
                        selectedImage === index ? 'border-brand-black ring-2 ring-brand-black ring-offset-1' : 'border-brand-border hover:border-brand-gray'
                      }`}
                    >
                      <Image src={image} alt={`${product.name} - ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl font-medium">{formatPrice(price)}</span>
                {ui.originalPrice && <span className="text-base text-brand-gray line-through">{formatPrice(ui.originalPrice)}</span>}
              </div>

              <div className="border-t border-brand-border pt-6 mb-6">
                <p className="text-sm text-brand-dark leading-relaxed">{product.description}</p>
              </div>

              {variants.length > 1 && (
                <div className="mb-6">
                  <label className="text-xs font-medium uppercase tracking-wider block mb-2">Variant</label>
                  <select
                    value={variantIdx}
                    onChange={(e) => setVariantIdx(Number(e.target.value))}
                    className="px-4 py-2 border border-brand-border text-sm bg-white focus:border-brand-black focus:outline-none"
                  >
                    {variants.map((v, i) => (
                      <option key={v.id} value={i}>
                        {[v.sku, v.colorName, v.sizeLabel, v.volumeMl ? `${v.volumeMl}ml` : null].filter(Boolean).join(' · ') || v.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-xs font-medium uppercase tracking-wider block mb-2">Quantity</label>
                <div className="flex items-center border border-brand-border w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-lg hover:bg-brand-light transition-colors">
                    −
                  </button>
                  <span className="px-6 py-2 text-sm font-medium border-x border-brand-border">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-lg hover:bg-brand-light transition-colors">
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                fullWidth
                size="lg"
                className="mb-4"
                onClick={() => {
                  if (!variant) return;
                  addToCart.mutate(
                    { productId: product.id, variantId: variant.id, quantity },
                    {
                      onSuccess: () => setMsg('Added to cart'),
                      onError: (err) => setMsg(err instanceof Error ? err.message : 'Failed to add'),
                    }
                  );
                }}
              >
                {addToCart.isPending ? 'Adding…' : 'ADD TO CART'}
              </Button>

              <button
                type="button"
                onClick={() => wishlist.mutate({ productId: product.id })}
                className="block mx-auto text-xs text-brand-gray hover:text-brand-black uppercase tracking-wider mb-4"
              >
                {wishlist.isPending ? '…' : '♡ Wishlist'}
              </button>

              <p className="text-xs text-brand-gray text-center">
                {msg ?? ((variant?.stock ?? ui.stock) > 10 ? 'In Stock' : (variant?.stock ?? ui.stock ?? 0) > 0 ? `Only ${variant?.stock ?? ui.stock} left` : 'Out of Stock')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding border-b border-brand-border">
        <div className="container-custom">
          <h2 className="text-lg md:text-xl font-bold tracking-widest uppercase mb-8">REVIEWS</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              {(reviews ?? []).map((r) => (
                <div key={r.id} className="border border-brand-border p-4">
                  <p className="text-sm font-medium">
                    {r.name ?? 'Customer'} · {'★'.repeat(r.rating)}
                  </p>
                  <p className="text-sm text-brand-dark mt-2">{r.comment}</p>
                  <p className="text-2xs text-brand-gray mt-1">{r.date ?? r.createdAt ?? ''}</p>
                  {r.reply && <p className="text-2xs mt-2 border-l-2 border-brand-border pl-3">Reply: {r.reply}</p>}
                </div>
              ))}
              {!reviews?.length && <p className="text-xs text-brand-gray">No reviews yet.</p>}
            </div>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!variant) return;
                  addReview.mutate(
                    { productId: product.id, orderItemId: '', rating: 5, comment },
                    { onSuccess: () => setComment(''), onError: (err) => alert(err instanceof Error ? err.message : 'Failed') }
                  );
                }}
                className="border border-brand-border p-4 flex flex-col gap-3"
              >
                {/* ponytail: orderItemId wajib diisi dari order yang sudah selesai — form review diterapkan dari halaman orders */}
                <textarea
                  placeholder="Write a review…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full border border-brand-border px-4 py-3 text-sm focus:border-brand-black focus:outline-none"
                />
                <Button size="sm" type="submit" onClick={() => undefined}>
                  Submit Review
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-lg md:text-xl font-bold tracking-widest uppercase mb-8 md:mb-12">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui';
import { Product, formatPrice } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/catalog/${product.slug}`} className="group block">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-brand-light border border-brand-border mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge variant={product.badge.toLowerCase() as 'new' | 'sale' | 'best'}>
              {product.badge}
            </Badge>
          </div>
        )}

        {/* Quick Add - appears on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="block text-center text-xs font-medium tracking-widest text-brand-white">
            VIEW PRODUCT
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium tracking-wide uppercase group-hover:underline">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {formatPrice(product.originalPrice ? product.price : product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-brand-gray line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

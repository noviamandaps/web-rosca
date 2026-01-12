import Link from 'next/link';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/data';

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export function ProductSection({ title, products, viewAllLink }: ProductSectionProps) {
  return (
    <section className="section-padding border-b border-brand-border">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-lg md:text-xl font-bold tracking-widest uppercase">
            {title}
          </h2>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-xs font-medium tracking-widest hover:underline underline-offset-4 flex items-center gap-2"
            >
              VIEW ALL
              <span>&rarr;</span>
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

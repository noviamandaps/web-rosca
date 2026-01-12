import { Review } from '@/lib/data';

interface ReviewSectionProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? 'text-brand-black' : 'text-brand-border'}>
          ★
        </span>
      ))}
    </div>
  );
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
  return (
    <section className="section-padding border-b border-brand-border bg-brand-light">
      <div className="container-custom">
        {/* Header */}
        <h2 className="text-lg md:text-xl font-bold tracking-widest uppercase text-center mb-8 md:mb-12">
          WHAT CUSTOMERS SAY
        </h2>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-brand-white border border-brand-border p-6 md:p-8"
            >
              <StarRating rating={review.rating} />
              <p className="mt-4 text-sm text-brand-dark leading-relaxed">
                &ldquo;{review.comment}&rdquo;
              </p>
              <p className="mt-4 text-xs font-medium tracking-wider">
                — {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

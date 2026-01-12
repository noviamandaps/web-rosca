import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store/data-store';

// GET /api/reviews - Get all reviews (with optional status filter)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as 'Pending' | 'Approved' | 'Rejected' | null;

    let reviews;
    if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) {
      reviews = dataStore.getReviewsByStatus(status);
    } else {
      reviews = dataStore.getAllReviews();
    }

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rating, comment, productId, status } = body;

    // Validation
    if (!name || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields: name, rating, comment' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const review = dataStore.createReview({
      name,
      rating,
      comment,
      productId,
      status,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

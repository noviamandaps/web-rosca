import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store/data-store';

// PATCH /api/reviews/[id]/status - Update review status (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be Pending, Approved, or Rejected' },
        { status: 400 }
      );
    }

    const updated = dataStore.updateReviewStatus(
      id,
      status as 'Pending' | 'Approved' | 'Rejected'
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update review status' },
      { status: 500 }
    );
  }
}

// In-memory data store for development
// In production, this should be replaced with a real database

import { Review } from '@/lib/data';

export interface ReviewInput {
  name: string;
  rating: number;
  comment: string;
  productId?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

// ponytail: internal reviews kept until backend exposes a public reviews endpoint (fase 3)
const initialReviews: Review[] = [
  {
    id: '1',
    name: 'Sarah M.',
    rating: 5,
    comment: 'Rosca OzzyJug-nya mantap! Banget dinginnya sampe seharian, bawa ke kantor praktis banget.',
    date: '2024-01-10',
    productId: '1',
    status: 'Approved',
  },
  {
    id: '2',
    name: 'John D.',
    rating: 5,
    comment: 'PoppyJug slim banget muat di cup holder mobil. Desainnya juga elegant. Recommended!',
    date: '2024-01-08',
    productId: '2',
    status: 'Approved',
  },
  {
    id: '3',
    name: 'Lisa K.',
    rating: 5,
    comment: 'Cosmic edition gradient-nya unik banget! Temen-temen pada nanya beli dimana. Love it!',
    date: '2024-01-05',
    productId: '4',
    status: 'Approved',
  },
  {
    id: '4',
    name: 'Mike R.',
    rating: 5,
    comment: 'JumboJug 1.5L pas banget buat gym dan hiking. Hidrasi terjaga sepanjang hari.',
    date: '2024-01-03',
    productId: '19',
    status: 'Approved',
  },
  {
    id: '5',
    name: 'Emma W.',
    rating: 5,
    comment: 'Engraved HandyJug perfect buat kado ulang tahun pacar. Hasil engraving-nya rapi banget!',
    date: '2024-01-02',
    productId: '7',
    status: 'Approved',
  },
  {
    id: '6',
    name: 'David L.',
    rating: 4,
    comment: 'MiciCup compact pas banget buat coffee lover kayak aku. Kopi tetap panas lama.',
    date: '2023-12-28',
    productId: '29',
    status: 'Approved',
  },
];

class DataStore {
  private reviews: Map<string, Review>;

  constructor() {
    this.reviews = new Map(initialReviews.map(r => [r.id, r]));
  }

  getAllReviews(): Review[] {
    return Array.from(this.reviews.values());
  }

  getReviewById(id: string): Review | undefined {
    return this.reviews.get(id);
  }

  getReviewsByStatus(status: 'Pending' | 'Approved' | 'Rejected'): Review[] {
    return Array.from(this.reviews.values()).filter(r => r.status === status);
  }

  createReview(data: ReviewInput): Review {
    const id = Date.now().toString();
    const review: Review = {
      id,
      name: data.name,
      rating: data.rating,
      comment: data.comment,
      date: new Date().toISOString().split('T')[0],
      productId: data.productId,
      status: data.status || 'Pending',
    };
    this.reviews.set(id, review);
    return review;
  }

  updateReview(id: string, data: Partial<ReviewInput>): Review | null {
    const review = this.reviews.get(id);
    if (!review) return null;

    const updated: Review = {
      ...review,
      ...(data.name !== undefined && { name: data.name }),
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.comment !== undefined && { comment: data.comment }),
      ...(data.productId !== undefined && { productId: data.productId }),
      ...(data.status !== undefined && { status: data.status }),
    };
    this.reviews.set(id, updated);
    return updated;
  }

  updateReviewStatus(id: string, status: 'Pending' | 'Approved' | 'Rejected'): Review | null {
    return this.updateReview(id, { status });
  }

  deleteReview(id: string): boolean {
    return this.reviews.delete(id);
  }
}

export const dataStore = new DataStore();

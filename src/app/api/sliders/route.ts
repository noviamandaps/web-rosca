import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store/data-store';

// GET /api/sliders - Get all sliders
export async function GET() {
  try {
    const sliders = dataStore.getAllSliders();
    return NextResponse.json(sliders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sliders' },
      { status: 500 }
    );
  }
}

// POST /api/sliders - Create new slider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, title, subtitle, ctaText, ctaLink, active } = body;

    // Validation
    if (!image || !title || !ctaText || !ctaLink) {
      return NextResponse.json(
        { error: 'Missing required fields: image, title, ctaText, ctaLink' },
        { status: 400 }
      );
    }

    const slider = dataStore.createSlider({
      image,
      title,
      subtitle,
      ctaText,
      ctaLink,
      active,
    });

    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create slider' },
      { status: 500 }
    );
  }
}

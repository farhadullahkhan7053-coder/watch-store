import { NextRequest, NextResponse } from 'next/server';
import { StoreRepository } from '@/lib/store-repository';
import { CreateReviewSchema } from '@/lib/validations';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;
    const status = searchParams.get('status') || undefined;
    const user = getAuthUser(req);

    // If customer, only show approved reviews unless admin requested all
    const filterStatus = user?.role === 'admin' ? status : (status || 'approved');

    const reviews = await StoreRepository.getReviews(productId, filterStatus);

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching reviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = getAuthUser(req);

    const newReview = await StoreRepository.createReview({
      ...parsed.data,
      userId: user?.userId || 'guest_' + Date.now(),
      status: 'approved', // Default to approved so users see their review right away, admin can moderate
      isVerifiedPurchase: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}

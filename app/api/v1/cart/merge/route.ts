import { NextRequest, NextResponse } from 'next/server';
import { StoreRepository } from '@/lib/store-repository';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Must be logged in to merge cart' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const guestSessionId = body.sessionId || req.cookies.get('farhadio_session')?.value;

    if (!guestSessionId) {
      return NextResponse.json({
        success: true,
        message: 'No guest session provided, skipping merge',
      });
    }

    const merged = StoreRepository.mergeCart(`guest_${guestSessionId}`, `user_${user.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Cart merged successfully',
      items: merged,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error merging cart' },
      { status: 500 }
    );
  }
}

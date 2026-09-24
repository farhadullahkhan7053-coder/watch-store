import { NextRequest, NextResponse } from 'next/server';
import { StoreRepository } from '@/lib/store-repository';
import { getAuthUser } from '@/lib/auth';

function getCartSessionKey(req: NextRequest, user: any) {
  if (user) return `user_${user.userId}`;
  const headerSession = req.headers.get('x-session-id');
  if (headerSession) return `guest_${headerSession}`;
  const cookieSession = req.cookies.get('farhadio_session')?.value;
  if (cookieSession) return `guest_${cookieSession}`;
  return 'guest_default';
}

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    const key = getCartSessionKey(req, user);
    const items = StoreRepository.getCart(key);

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching cart' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    const key = getCartSessionKey(req, user);
    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: 'Items array is required' },
        { status: 400 }
      );
    }

    StoreRepository.saveCart(key, items);

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
      items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error saving cart' },
      { status: 500 }
    );
  }
}

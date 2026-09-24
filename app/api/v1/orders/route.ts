import { NextRequest, NextResponse } from 'next/server';
import { StoreRepository } from '@/lib/store-repository';
import { CreateOrderSchema } from '@/lib/validations';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    const { searchParams } = new URL(req.url);
    const guestEmail = searchParams.get('email');

    // If admin, return all orders
    if (user && user.role === 'admin') {
      const allOrders = await StoreRepository.getOrders();
      return NextResponse.json({
        success: true,
        orders: allOrders,
      });
    }

    // If customer, return user orders
    if (user) {
      const userOrders = await StoreRepository.getOrders(user.userId);
      return NextResponse.json({
        success: true,
        orders: userOrders,
      });
    }

    // If guest query by email
    if (guestEmail) {
      const guestOrders = await StoreRepository.getOrders(guestEmail);
      return NextResponse.json({
        success: true,
        orders: guestOrders,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    const body = await req.json();

    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { items, shippingAddress, paymentMethod, couponCode, notes } = parsed.data;

    // Calculate totals server-side
    const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice >= 300 ? 0 : 25; // Free shipping over $300
    const taxPrice = Number((itemsPrice * 0.08).toFixed(2)); // 8% sales tax

    let discountAmount = 0;
    if (couponCode && couponCode.toUpperCase() === 'WELCOME10') {
      discountAmount = Number((itemsPrice * 0.1).toFixed(2));
    } else if (couponCode && couponCode.toUpperCase() === 'LUXURY50') {
      discountAmount = 50;
    }

    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice - discountAmount).toFixed(2));

    const orderData = {
      userId: user?.userId,
      guestEmail: !user ? shippingAddress.email : undefined,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'paid', // Simulated instant checkout success
      orderStatus: 'paid',
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount,
      couponCode,
      totalPrice,
      notes,
      trackingNumber: 'FDX-' + Math.floor(1000000000 + Math.random() * 9000000000) + 'US',
    };

    const newOrder = await StoreRepository.createOrder(orderData);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error placing order' },
      { status: 500 }
    );
  }
}

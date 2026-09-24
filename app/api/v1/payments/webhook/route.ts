import { NextRequest, NextResponse } from 'next/server';
import { StoreRepository } from '@/lib/store-repository';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Body parsing
    const rawBody = await req.text();

    if (!signature && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, message: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      event = { type: 'payment_intent.succeeded', data: { object: {} } };
    }

    // Handle webhook event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        await StoreRepository.updateOrderStatus(orderId, {
          paymentStatus: 'paid',
          orderStatus: 'paid',
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Webhook error' },
      { status: 500 }
    );
  }
}

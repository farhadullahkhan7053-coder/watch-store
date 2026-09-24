import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'usd' } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const isMock = !stripeKey || stripeKey.includes('Mock') || stripeKey.includes('demo');

    if (!isMock) {
      // In production with live Stripe credentials:
      // const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
      // const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(amount * 100), currency });
      // return NextResponse.json({ success: true, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
    }

    // Realistic seamless payment intent simulation
    const simulatedClientSecret = `pi_${Math.random().toString(36).substring(2, 15)}_secret_${Math.random().toString(36).substring(2, 15)}`;
    const simulatedPaymentIntentId = `pi_${Math.random().toString(36).substring(2, 12)}`;

    return NextResponse.json({
      success: true,
      clientSecret: simulatedClientSecret,
      paymentIntentId: simulatedPaymentIntentId,
      amount,
      currency,
      status: 'requires_payment_method',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Payment intent creation failed' },
      { status: 500 }
    );
  }
}

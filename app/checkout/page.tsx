'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingPrice, taxPrice, discountAmount, couponCode, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || 'Alex Montgomery',
    email: user?.email || 'alex@farhadio.com',
    phone: '+1 (555) 234-8901',
    street: '450 Park Avenue South, Apt 12B',
    apartment: 'Apt 12B',
    city: 'New York',
    state: 'NY',
    postalCode: '10016',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'card' | 'cod'>('stripe');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-text mb-2">No items to checkout</h2>
        <p className="text-xs text-secondary mb-6">Your shopping bag is currently empty.</p>
        <Link href="/watches">
          <Button variant="primary" size="md">
            Explore Timepieces
          </Button>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // 1. Call Payment Intent API endpoint
      const paymentRes = await fetch('/api/v1/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const paymentData = await paymentRes.json();

      // 2. Call Order Creation API endpoint
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          slug: i.slug,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
          variant: {
            sku: i.variantSku,
            colorName: i.colorName,
            bandMaterial: i.bandMaterial,
            caseSize: i.caseSize,
          },
        })),
        shippingAddress: formData,
        paymentMethod,
        couponCode: couponCode || undefined,
        paymentIntentId: paymentData.paymentIntentId,
      };

      const orderRes = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();

      if (orderData.success && orderData.order) {
        clearCart();
        router.push(`/order-confirmation?orderId=${orderData.order._id || orderData.order.orderNumber}`);
      } else {
        setErrorMsg(orderData.message || 'Failed to place order. Please verify details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-10 sm:py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
          <div>
            <h1 className="hero-serif text-2xl sm:text-3xl font-normal text-text">
              Concierge Checkout
            </h1>
            <p className="text-xs text-secondary mt-1">
              Complete your acquisition with encrypted, insured global fulfillment.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gold font-semibold">
            <Lock size={15} />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Fields: Shipping & Payment (Left) */}
            <div className="lg:col-span-7 space-y-8">
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-error text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Contact Information */}
              <div className="p-6 bg-surface rounded-lg border border-border space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-2">
                  <span>1. Contact & Recipient</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-text mb-1">Phone Number (For Courier Tracking)</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="p-6 bg-surface rounded-lg border border-border space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">
                  2. Insured Shipping Address
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1">State / Province</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Country / Region</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Germany">Germany</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Canada">Canada</option>
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="p-6 bg-surface rounded-lg border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text">
                    3. Payment Information (Stripe Secure)
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-secondary">
                    <CreditCard size={15} />
                    <span>Card / Apple Pay / Google Pay</span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-border rounded-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">Credit / Debit Card</span>
                    <span className="text-[11px] text-gold font-semibold">Demo Sandbox Active</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-secondary mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-surface text-text font-mono focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 text-xs border border-border rounded-md bg-surface text-text font-mono focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1">CVC Code</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="888"
                        className="w-full px-3 py-2 text-xs border border-border rounded-md bg-surface text-text font-mono focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-secondary">
                  Your payment credentials are tokenized directly with Stripe's PCI-DSS Level 1 certified infrastructure. FARHADIO never stores raw card data.
                </p>
              </div>

              {/* Submit CTA on mobile */}
              <div className="lg:hidden">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  type="submit"
                  isLoading={isProcessing}
                >
                  Authorize Payment & Complete Acquisition (${totalPrice.toFixed(2)})
                </Button>
              </div>
            </div>

            {/* Order Review Sidebar (Right) */}
            <div className="lg:col-span-5">
              <div className="p-6 bg-surface rounded-lg border border-border sticky top-24 space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text pb-3 border-b border-border">
                  Order Breakdown ({items.length} Timepieces)
                </h3>

                {/* Items preview */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.variantSku} className="flex gap-3 text-xs">
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-white border border-border shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-text line-clamp-1">{item.name}</p>
                          <p className="text-secondary text-[11px]">{item.colorName} • {item.caseSize}</p>
                          <p className="text-secondary text-[11px]">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-text">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 pt-4 border-t border-border text-xs">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal</span>
                    <span className="font-semibold text-text">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Insured Express Courier</span>
                    <span className="font-semibold text-text">
                      {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Estimated Sales Tax</span>
                    <span className="font-semibold text-text">${taxPrice.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-success font-semibold">
                      <span>Discount ({couponCode})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-border flex justify-between text-base font-bold text-text">
                    <span>Total</span>
                    <span className="text-gold">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Desktop Place Order CTA */}
                <div className="hidden lg:block pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    type="submit"
                    isLoading={isProcessing}
                    className="py-4"
                  >
                    Authorize Payment & Place Order
                  </Button>
                </div>

                <div className="pt-3 border-t border-border text-center space-y-1.5 text-[11px] text-secondary">
                  <div className="flex items-center justify-center gap-1.5 text-text font-semibold">
                    <ShieldCheck size={14} className="text-gold" />
                    <span>FARHADIO 5-Year Global Warranty Included</span>
                  </div>
                  <p>Includes Certificate of Authenticity and wooden display case.</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      const res = applyCoupon(inputCoupon.trim());
      setCouponFeedback(res);
      if (res.success) {
        setInputCoupon('');
      }
    }
  };

  // Free shipping progress calculation
  const freeShippingThreshold = 300;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="bg-background min-h-screen py-10 sm:py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="hero-serif text-3xl sm:text-4xl text-text font-normal mb-2">
          Your Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-secondary mb-10">
          Review your chosen timepieces before proceeding to secured concierge checkout.
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-lg border border-border p-8 max-w-xl mx-auto">
            <h2 className="text-lg font-bold text-text mb-2">Your Bag is Empty</h2>
            <p className="text-xs text-secondary mb-6">
              You haven't selected any timepieces yet. Explore our latest master releases to find your signature piece.
            </p>
            <Link href="/watches">
              <Button variant="primary" size="md">
                Browse Timepieces
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress Meter */}
              <div className="p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-text flex items-center gap-1.5">
                    <Sparkles size={14} className="text-gold" />
                    {remainingForFreeShipping === 0
                      ? 'Congratulations! You qualify for Free Worldwide Express Courier.'
                      : `Add $${remainingForFreeShipping.toFixed(2)} more for Free Express Courier.`}
                  </span>
                  <span className="font-bold text-gold">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="divide-y divide-border border-y border-border">
                {items.map((item) => (
                  <div key={item.variantSku} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden bg-surface border border-border shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <Link href={`/product/${item.slug}`} className="text-sm font-bold text-text hover:text-gold transition-colors">
                          {item.name}
                        </Link>
                        <div className="text-xs text-secondary mt-1 space-x-2">
                          <span>{item.colorName}</span>
                          <span>•</span>
                          <span>{item.caseSize}</span>
                          <span>•</span>
                          <span>{item.bandMaterial}</span>
                        </div>
                        <p className="text-xs font-semibold text-text mt-1">
                          ${item.price} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                          className="px-2.5 py-1 text-secondary hover:bg-surface"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-text min-w-[30px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="px-2.5 py-1 text-secondary hover:bg-surface disabled:opacity-30"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Total */}
                      <span className="text-sm font-bold text-text min-w-[70px] text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.variantSku)}
                        className="text-secondary hover:text-error p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions below table */}
              <div className="flex justify-between items-center pt-2">
                <Link href="/watches" className="text-xs font-semibold text-text hover:text-gold uppercase tracking-wider">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="p-6 bg-surface rounded-lg border border-border space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text pb-3 border-b border-border">
                  Order Summary
                </h3>

                {/* Subtotal, Shipping, Tax */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal</span>
                    <span className="font-semibold text-text">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Express Insured Courier</span>
                    <span className="font-semibold text-text">
                      {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Estimated Sales Tax (8%)</span>
                    <span className="font-semibold text-text">${taxPrice.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-success font-semibold">
                      <span>Discount ({couponCode})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border flex justify-between text-base font-bold text-text">
                    <span>Total Amount</span>
                    <span className="text-gold">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="pt-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Promo Code (e.g. WELCOME10)"
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text uppercase placeholder-secondary focus:outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-text hover:bg-gold text-white text-xs font-bold uppercase rounded-md transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>

                  {couponFeedback && (
                    <p
                      className={`text-[11px] mt-1.5 ${
                        couponFeedback.success ? 'text-success' : 'text-error'
                      }`}
                    >
                      {couponFeedback.message}
                    </p>
                  )}

                  {couponCode && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-gold bg-gold/15 px-2.5 py-1 rounded">
                      <Tag size={12} />
                      <span className="font-bold">{couponCode} applied</span>
                      <button
                        onClick={removeCoupon}
                        className="text-text hover:text-error ml-1 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" className="block w-full">
                  <Button variant="primary" size="lg" fullWidth className="flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight size={15} />
                  </Button>
                </Link>

                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-secondary text-center">
                  <ShieldCheck size={14} className="text-gold" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

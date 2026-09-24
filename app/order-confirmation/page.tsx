'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, ShieldCheck } from 'lucide-react';
import { Order } from '@/types';
import Button from '@/components/ui/Button';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/v1/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <p className="text-xs uppercase tracking-widest text-secondary animate-pulse">
          Retrieving Atelier Order Details...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center pb-8 border-b border-border">
          <div className="w-14 h-14 rounded-full bg-green-50 text-success border border-green-200 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-1">
            Acquisition Confirmed
          </span>
          <h1 className="hero-serif text-3xl sm:text-4xl text-text font-normal">
            Thank You For Your Order
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-2 max-w-md mx-auto">
            Your FARHADIO timepiece is now entering our atelier fulfillment queue for precision inspection and white-glove packaging.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-surface px-4 py-2 rounded-md border border-border text-xs">
            <span className="text-secondary font-medium">Order Reference:</span>
            <span className="font-bold text-text font-mono">{order?.orderNumber || orderId || 'FAR-89201'}</span>
          </div>
        </div>

        {/* Order Status Timeline Workflow */}
        <div className="py-8 border-b border-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text mb-6 text-center">
            Atelier Dispatch Status
          </h3>

          <div className="grid grid-cols-4 gap-2 text-center text-xs relative">
            {/* Step 1: Paid */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center font-bold text-xs mb-2 shadow-xs">
                ✓
              </div>
              <span className="font-bold text-text">Payment Paid</span>
              <span className="text-[10px] text-secondary">Verified</span>
            </div>

            {/* Step 2: Atelier Assembly / Inspection */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center font-bold text-xs mb-2 shadow-xs">
                ✓
              </div>
              <span className="font-bold text-text">Inspection</span>
              <span className="text-[10px] text-secondary">Atelier testing</span>
            </div>

            {/* Step 3: Shipped */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-neutral-200 text-secondary flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <span className="font-semibold text-secondary">In Transit</span>
              <span className="text-[10px] text-secondary">FedEx Express</span>
            </div>

            {/* Step 4: Delivered */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-neutral-200 text-secondary flex items-center justify-center font-bold text-xs mb-2">
                4
              </div>
              <span className="font-semibold text-secondary">Delivered</span>
              <span className="text-[10px] text-secondary">Signature req.</span>
            </div>
          </div>

          {order?.trackingNumber && (
            <div className="mt-6 text-center p-3 bg-surface rounded-md border border-border text-xs">
              <span className="text-secondary">Tracking Identifier: </span>
              <span className="font-mono font-bold text-text">{order.trackingNumber}</span>
            </div>
          )}
        </div>

        {/* Order Details & Summary */}
        <div className="py-8 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text">
            Acquired Timepieces
          </h3>

          <div className="divide-y divide-border border-y border-border">
            {(order?.items || []).map((item, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-surface border border-border shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text">{item.name}</h4>
                    <p className="text-[11px] text-secondary">
                      {item.variant?.colorName} • {item.variant?.caseSize} • {item.variant?.bandMaterial}
                    </p>
                    <p className="text-[11px] text-secondary">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-text">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery & Billing Summary */}
          {order?.shippingAddress && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs">
              <div className="p-4 bg-surface rounded-md border border-border space-y-1">
                <span className="font-bold text-text uppercase tracking-wider block mb-2">
                  Delivery Address
                </span>
                <p className="text-text font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-secondary">{order.shippingAddress.street}</p>
                <p className="text-secondary">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-secondary">{order.shippingAddress.country}</p>
              </div>

              <div className="p-4 bg-surface rounded-md border border-border space-y-1.5">
                <span className="font-bold text-text uppercase tracking-wider block mb-2">
                  Financial Settlement
                </span>
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span>${order.itemsPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Insured Courier</span>
                  <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice?.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Estimated Tax</span>
                  <span>${order.taxPrice?.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-${order.discountAmount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-text pt-2 border-t border-border text-sm">
                  <span>Total Paid</span>
                  <span className="text-gold">${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons: Print Receipt & Continue Shopping */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-secondary hover:text-text uppercase tracking-wider"
          >
            <Printer size={15} /> Print Atelier Receipt
          </button>

          <Link href="/watches">
            <Button variant="primary" size="md" className="flex items-center gap-1.5">
              Explore More Watches <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 text-center bg-white">
          <p className="text-xs uppercase tracking-widest text-secondary animate-pulse">
            Loading Acquisition Details...
          </p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}

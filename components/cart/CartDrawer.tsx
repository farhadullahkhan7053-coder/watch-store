'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#18100C] border-l border-border shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 text-white">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-gold" size={20} />
              <h2 className="text-base font-bold uppercase tracking-wider text-text">
                Your Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-secondary hover:text-text rounded-md hover:bg-surface transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-border">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-secondary mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-base font-bold text-text mb-1">Your cart is empty</h3>
                <p className="text-xs text-secondary max-w-xs mb-6">
                  Discover our iconic timepieces hand-assembled with Swiss precision and surgical steel.
                </p>
                <Link href="/watches" onClick={() => setIsCartOpen(false)}>
                  <Button variant="primary" size="md">
                    Explore Watches
                  </Button>
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variantSku} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-surface rounded-md overflow-hidden shrink-0 border border-border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-semibold text-text hover:text-gold transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.variantSku)}
                          className="text-secondary hover:text-error transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="text-[11px] text-secondary mt-0.5 space-x-2">
                        <span>{item.colorName}</span>
                        <span>•</span>
                        <span>{item.caseSize}</span>
                        <span>•</span>
                        <span>{item.bandMaterial}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                          className="p-1 hover:bg-surface text-secondary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-text min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                          className="p-1 hover:bg-surface text-secondary transition-colors disabled:opacity-30"
                          disabled={item.quantity >= item.maxStock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-text">
                        ${item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals and action buttons */}
          {items.length > 0 && (
            <div className="p-5 border-t border-border bg-surface/50 space-y-3">
              <div className="flex items-center justify-between text-xs text-secondary">
                <span>Free Express Shipping</span>
                <span className="font-semibold text-text">{subtotal >= 300 ? 'FREE' : '$25'}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-text">
                <span>Estimated Subtotal</span>
                <span className="text-base text-gold">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-secondary text-center">
                Taxes and discounts calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" size="md" fullWidth>
                    View Bag
                  </Button>
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" size="md" fullWidth className="flex items-center gap-1">
                    Checkout <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

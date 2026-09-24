'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantSku: string) => void;
  updateQuantity: (variantSku: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Initialize guest session ID if none exists
  useEffect(() => {
    let session = localStorage.getItem('farhadio_guest_session');
    if (!session) {
      session = 'guest_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem('farhadio_guest_session', session);
    }

    const savedCart = localStorage.getItem('farhadio_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {}
    }

    const savedCoupon = localStorage.getItem('farhadio_coupon');
    if (savedCoupon) {
      setCouponCode(savedCoupon);
    }
  }, []);

  // Save cart to local storage and sync
  useEffect(() => {
    localStorage.setItem('farhadio_cart', JSON.stringify(items));

    // Recalculate discount if coupon is applied
    if (couponCode) {
      calculateDiscount(couponCode, items);
    } else {
      setDiscountAmount(0);
    }
  }, [items, couponCode]);

  const calculateDiscount = (code: string, currentItems: CartItem[]) => {
    const rawSubtotal = currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (code.toUpperCase() === 'WELCOME10') {
      setDiscountAmount(Number((rawSubtotal * 0.1).toFixed(2)));
    } else if (code.toUpperCase() === 'LUXURY50') {
      setDiscountAmount(Math.min(50, rawSubtotal));
    } else {
      setDiscountAmount(0);
    }
  };

  const addItem = (product: Product, variant: ProductVariant, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.variantSku === variant.sku);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(next[existingIndex].quantity + quantity, variant.stock);
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
        };
        return next;
      } else {
        const newItem: CartItem = {
          productId: product._id,
          variantSku: variant.sku,
          name: product.name,
          slug: product.slug,
          image: variant.image || product.featuredImage,
          colorName: variant.colorName,
          bandMaterial: variant.bandMaterial,
          caseSize: variant.caseSize,
          price: variant.price,
          quantity: Math.min(quantity, variant.stock),
          maxStock: variant.stock,
        };
        return [...prev, newItem];
      }
    });
    setIsCartOpen(true);
  };

  const removeItem = (variantSku: string) => {
    setItems((prev) => prev.filter((item) => item.variantSku !== variantSku));
  };

  const updateQuantity = (variantSku: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantSku);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantSku === variantSku) {
          return { ...item, quantity: Math.min(quantity, item.maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscountAmount(0);
    localStorage.removeItem('farhadio_cart');
    localStorage.removeItem('farhadio_coupon');
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME10') {
      setCouponCode(clean);
      localStorage.setItem('farhadio_coupon', clean);
      return { success: true, message: 'Coupon WELCOME10 applied (10% off)' };
    } else if (clean === 'LUXURY50') {
      setCouponCode(clean);
      localStorage.setItem('farhadio_coupon', clean);
      return { success: true, message: 'Coupon LUXURY50 applied ($50 off)' };
    }
    return { success: false, message: 'Invalid coupon code. Try WELCOME10 or LUXURY50' };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountAmount(0);
    localStorage.removeItem('farhadio_coupon');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 0 ? (subtotal >= 300 ? 0 : 25) : 0;
  const taxPrice = Number((subtotal * 0.08).toFixed(2));
  const totalPrice = Math.max(0, Number((subtotal + shippingPrice + taxPrice - discountAmount).toFixed(2)));

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discountAmount,
        couponCode,
        applyCoupon,
        removeCoupon,
        shippingPrice,
        taxPrice,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

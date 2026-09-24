'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const savedProducts = products.filter(
    (p) => wishlist.includes(p._id) || wishlist.includes(p.slug)
  );

  return (
    <div className="bg-background min-h-screen py-12 sm:py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between pb-6 border-b border-border mb-8">
          <div>
            <h1 className="hero-serif text-3xl font-normal text-text">
              My Saved Timepieces
            </h1>
            <p className="text-xs text-secondary mt-1">
              Your curated personal vault of FARHADIO pieces.
            </p>
          </div>
          {savedProducts.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-error hover:underline mt-2 sm:mt-0 font-medium"
            >
              Clear Entire Wishlist
            </button>
          )}
        </div>

        {savedProducts.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-lg border border-border max-w-md mx-auto p-8">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-secondary mx-auto mb-4 border border-border shadow-xs">
              <Heart size={24} />
            </div>
            <h2 className="text-base font-bold text-text mb-1">Your Wishlist is Empty</h2>
            <p className="text-xs text-secondary mb-6">
              Save your favorite timepieces to compare and access them whenever you return.
            </p>
            <Link href="/watches">
              <Button variant="primary" size="md">
                Browse Timepieces
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {savedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

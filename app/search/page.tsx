'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
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

  const filteredProducts = products.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      p.movement.toLowerCase().includes(q) ||
      p.dialColor.toLowerCase().includes(q) ||
      p.strapMaterial.toLowerCase().includes(q)
    );
  });

  const popularKeywords = ['Classic Black', 'Chrono Silver', 'Automatic', 'Gold', 'Titanium', 'Diamond', 'Sapphire'];

  return (
    <div className="bg-background min-h-screen py-12 sm:py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-2">
            FARHADIO Search Engine
          </span>
          <h1 className="hero-serif text-3xl sm:text-4xl text-text font-normal mb-6">
            Find Your Signature Timepiece
          </h1>

          {/* Search Bar Input */}
          <div className="relative">
            <SearchIcon size={18} className="absolute left-4 top-3.5 text-secondary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by collection, movement, strap material, dial color..."
              className="w-full pl-11 pr-10 py-3 text-sm bg-surface border border-border rounded-lg text-text focus:outline-none focus:border-gold shadow-sm"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-3.5 text-secondary hover:text-text"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Popular Tag Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-secondary font-medium">Suggested:</span>
            {popularKeywords.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1 rounded-full bg-surface hover:bg-neutral-200 text-secondary hover:text-text transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Grid */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between pb-6 text-xs text-secondary font-medium">
            <span>
              {query ? `Showing results for "${query}"` : 'All Available Master Timepieces'}
            </span>
            <span>{filteredProducts.length} Timepieces Found</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-surface rounded-md border border-border" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-lg border border-border max-w-md mx-auto p-6">
              <h3 className="text-base font-bold text-text mb-1">No timepieces matched</h3>
              <p className="text-xs text-secondary mb-4">
                We could not find any models matching your query "{query}".
              </p>
              <button
                onClick={() => setQuery('')}
                className="text-xs font-semibold text-gold hover:underline uppercase tracking-wider"
              >
                Clear Search Query
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 text-center bg-white">
          <p className="text-xs uppercase tracking-widest text-secondary animate-pulse">
            Searching FARHADIO Vault...
          </p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

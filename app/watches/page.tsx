'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import { Product, WatchCollection, MovementType, BandMaterial } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';

function WatchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters state initialized from URL or defaults
  const [selectedCollection, setSelectedCollection] = useState<string>(searchParams.get('collection') || 'all');
  const [selectedMovement, setSelectedMovement] = useState<string>(searchParams.get('movement') || 'all');
  const [selectedBand, setSelectedBand] = useState<string>(searchParams.get('bandMaterial') || 'all');
  const [priceRange, setPriceRange] = useState<number>(Number(searchParams.get('maxPrice')) || 1000);
  const [sortOption, setSortOption] = useState<string>(searchParams.get('sort') || 'featured');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/products');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error('Failed to load watches', e);
    } finally {
      setLoading(false);
    }
  };

  const collections: Array<{ label: string; value: string }> = [
    { label: 'All Collections', value: 'all' },
    { label: "Men's Collection", value: 'Men' },
    { label: "Women's Collection", value: 'Women' },
    { label: 'Automatic Mechanical', value: 'Automatic' },
    { label: 'Smart Luxe', value: 'Smart' },
  ];

  const movements: Array<{ label: string; value: string }> = [
    { label: 'All Movements', value: 'all' },
    { label: 'Automatic Caliber', value: 'Automatic' },
    { label: 'Swiss Quartz', value: 'Quartz' },
    { label: 'Smart Digital', value: 'Smart Digital' },
  ];

  const bands: Array<{ label: string; value: string }> = [
    { label: 'All Straps', value: 'all' },
    { label: 'Italian Leather', value: 'Italian Leather' },
    { label: 'Stainless Steel', value: 'Stainless Steel' },
    { label: 'Milanese Mesh', value: 'Milanese Mesh' },
    { label: 'Rubber / Silicone', value: 'Rubber / Silicone' },
  ];

  // Client-side instant faceted filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Collection filter
      if (selectedCollection !== 'all' && p.collection.toLowerCase() !== selectedCollection.toLowerCase()) {
        return false;
      }
      // Movement filter
      if (selectedMovement !== 'all' && p.movement.toLowerCase() !== selectedMovement.toLowerCase()) {
        return false;
      }
      // Band filter
      if (selectedBand !== 'all' && !p.strapMaterial.toLowerCase().includes(selectedBand.toLowerCase())) {
        return false;
      }
      // Price filter
      if (p.basePrice > priceRange) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.movement.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price_asc') return a.basePrice - b.basePrice;
      if (sortOption === 'price_desc') return b.basePrice - a.basePrice;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'popular') return b.numReviews - a.numReviews;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCollection, selectedMovement, selectedBand, priceRange, searchQuery, sortOption]);

  const resetFilters = () => {
    setSelectedCollection('all');
    setSelectedMovement('all');
    setSelectedBand('all');
    setPriceRange(1000);
    setSearchQuery('');
    setSortOption('featured');
  };

  const activeFilterCount =
    (selectedCollection !== 'all' ? 1 : 0) +
    (selectedMovement !== 'all' ? 1 : 0) +
    (selectedBand !== 'all' ? 1 : 0) +
    (priceRange < 1000 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="bg-background min-h-screen py-10 sm:py-14 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-border pb-8">
          <div className="text-[11px] uppercase tracking-widest text-secondary mb-2">
            FARHADIO Haute Horlogerie / Catalog
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="hero-serif text-3xl sm:text-4xl text-text font-normal">
                All Master Timepieces
              </h1>
              <p className="text-xs sm:text-sm text-secondary mt-1">
                Explore our comprehensive collection of precision chronometers, skeleton automatics, and refined dress watches.
              </p>
            </div>
            <div className="text-xs text-secondary font-medium">
              Showing <span className="text-text font-bold">{filteredProducts.length}</span> of {products.length} models
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-border">
          {/* Mobile Filter Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 border border-border rounded-md text-xs font-semibold uppercase tracking-wider text-text hover:border-gold"
            >
              <SlidersHorizontal size={14} className="text-gold" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            {/* Quick Pill Chips for Collections */}
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto">
              {collections.map((col) => (
                <button
                  key={col.value}
                  onClick={() => setSelectedCollection(col.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                    selectedCollection === col.value
                      ? 'bg-gold text-white shadow-xs'
                      : 'bg-surface text-secondary hover:bg-neutral-200 hover:text-text'
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search size={14} className="absolute left-3 top-2.5 text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface border border-border rounded-md text-text focus:outline-none focus:border-gold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-secondary hover:text-text"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface border border-border rounded-md text-text focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="popular">Sort by: Most Popular</option>
              <option value="rating">Sort by: Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-4 border-r border-border">
            {/* Active Filters Clear */}
            {activeFilterCount > 0 && (
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-xs font-semibold text-text">
                  {activeFilterCount} Active Filter{activeFilterCount > 1 ? 's' : ''}
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs text-gold hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
            )}

            {/* Collection Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text mb-3">
                Collection
              </h3>
              <div className="space-y-1.5">
                {collections.map((col) => (
                  <label
                    key={col.value}
                    className="flex items-center justify-between text-xs text-secondary hover:text-text cursor-pointer py-1"
                  >
                    <span className={selectedCollection === col.value ? 'font-bold text-gold' : ''}>
                      {col.label}
                    </span>
                    <input
                      type="radio"
                      name="desktop_collection"
                      checked={selectedCollection === col.value}
                      onChange={() => setSelectedCollection(col.value)}
                      className="accent-gold"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Movement Type Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text mb-3">
                Movement Type
              </h3>
              <div className="space-y-1.5">
                {movements.map((mov) => (
                  <label
                    key={mov.value}
                    className="flex items-center justify-between text-xs text-secondary hover:text-text cursor-pointer py-1"
                  >
                    <span className={selectedMovement === mov.value ? 'font-bold text-gold' : ''}>
                      {mov.label}
                    </span>
                    <input
                      type="radio"
                      name="desktop_movement"
                      checked={selectedMovement === mov.value}
                      onChange={() => setSelectedMovement(mov.value)}
                      className="accent-gold"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Band / Strap Material */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text mb-3">
                Strap Material
              </h3>
              <div className="space-y-1.5">
                {bands.map((b) => (
                  <label
                    key={b.value}
                    className="flex items-center justify-between text-xs text-secondary hover:text-text cursor-pointer py-1"
                  >
                    <span className={selectedBand === b.value ? 'font-bold text-gold' : ''}>
                      {b.label}
                    </span>
                    <input
                      type="radio"
                      name="desktop_band"
                      checked={selectedBand === b.value}
                      onChange={() => setSelectedBand(b.value)}
                      className="accent-gold"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">
                  Maximum Price
                </h3>
                <span className="text-xs font-bold text-gold">${priceRange}</span>
              </div>
              <input
                type="range"
                min="300"
                max="1000"
                step="25"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-secondary mt-1">
                <span>$300</span>
                <span>$1,000+</span>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-surface rounded-md border border-border" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-surface rounded-lg border border-border p-8">
                <h3 className="text-base font-bold text-text mb-2">No matching timepieces</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto mb-6">
                  We could not find any models matching your selected filter criteria. Try clearing some filters.
                </p>
                <Button variant="primary" size="md" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {filterDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-xl flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text">
                    Filter Watches
                  </h2>
                  <button
                    onClick={() => setFilterDrawerOpen(false)}
                    className="p-1 text-secondary hover:text-text"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-6 overflow-y-auto max-h-[70vh]">
                  {/* Collection */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text mb-2">
                      Collection
                    </h4>
                    <div className="space-y-2">
                      {collections.map((col) => (
                        <button
                          key={col.value}
                          onClick={() => setSelectedCollection(col.value)}
                          className={`block w-full text-left px-3 py-1.5 rounded text-xs ${
                            selectedCollection === col.value
                              ? 'bg-gold text-white font-semibold'
                              : 'bg-surface text-secondary'
                          }`}
                        >
                          {col.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Movement */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text mb-2">
                      Movement
                    </h4>
                    <div className="space-y-2">
                      {movements.map((m) => (
                        <button
                          key={m.value}
                          onClick={() => setSelectedMovement(m.value)}
                          className={`block w-full text-left px-3 py-1.5 rounded text-xs ${
                            selectedMovement === m.value
                              ? 'bg-gold text-white font-semibold'
                              : 'bg-surface text-secondary'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Strap */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text mb-2">
                      Strap Material
                    </h4>
                    <div className="space-y-2">
                      {bands.map((b) => (
                        <button
                          key={b.value}
                          onClick={() => setSelectedBand(b.value)}
                          className={`block w-full text-left px-3 py-1.5 rounded text-xs ${
                            selectedBand === b.value
                              ? 'bg-gold text-white font-semibold'
                              : 'bg-surface text-secondary'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Price */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-text mb-1">
                      <span>Max Price:</span>
                      <span className="text-gold">${priceRange}</span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="1000"
                      step="25"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-gold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex gap-2">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={resetFilters}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setFilterDrawerOpen(false)}
                >
                  Show Results ({filteredProducts.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WatchesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 text-center bg-white">
          <p className="text-xs uppercase tracking-widest text-secondary animate-pulse">
            Loading FARHADIO Catalog...
          </p>
        </div>
      }
    >
      <WatchesContent />
    </Suspense>
  );
}

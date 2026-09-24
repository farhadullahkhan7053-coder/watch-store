'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Check, Menu } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface LuxuryHeroProps {
  products: Product[];
}

export const LuxuryHero: React.FC<LuxuryHeroProps> = ({ products }) => {
  const { addItem, totalItems, setIsCartOpen } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  // Curated hero watches matching the luxury aesthetic
  const heroWatches = products.filter((p) =>
    ['farhadio-royal-gold', 'farhadio-classic-black', 'farhadio-chrono-silver'].includes(p.slug)
  );

  // Fallback if not found
  const activeWatches = heroWatches.length > 0 ? heroWatches : products.slice(0, 3);
  const currentWatch = activeWatches[activeIndex] || activeWatches[0];
  const nextWatchIndex = (activeIndex + 1) % activeWatches.length;
  const nextWatch = activeWatches[nextWatchIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % activeWatches.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + activeWatches.length) % activeWatches.length);
  };

  const handleAddToCart = () => {
    if (currentWatch && currentWatch.variants[0]) {
      addItem(currentWatch, currentWatch.variants[0], 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  // Split title for the bold + outlined stroke effect (e.g., "FARHADIO" and "ROYAL GOLD")
  const brandWord = 'FARHADIO';
  const seriesWord = currentWatch?.name.replace(/FARHADIO\s*/i, '') || 'ROYAL GOLD';

  return (
    <section className="bg-[#B58D69] py-4 sm:py-8 lg:py-10 px-2 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto bg-[#18100C] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-14 border border-[#3A261B] relative overflow-hidden shadow-2xl">
        
        {/* Hourglass organic backdrop cutout framing the watch */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Top curve flare */}
          <div className="absolute -top-28 sm:-top-32 w-[340px] sm:w-[500px] h-[220px] sm:h-[260px] bg-[#B58D69] rounded-b-[180px] sm:rounded-b-[240px] opacity-95"></div>
          {/* Soft central ambient glow */}
          <div className="absolute w-[280px] h-[340px] bg-[#B58D69]/20 rounded-full blur-3xl"></div>
          {/* Bottom curve flare */}
          <div className="absolute -bottom-28 sm:-bottom-32 w-[340px] sm:w-[500px] h-[220px] sm:h-[260px] bg-[#B58D69] rounded-t-[180px] sm:rounded-t-[240px] opacity-95"></div>
        </div>

        {/* Minimal Hero Sub-header */}
        <div className="relative z-20 flex items-center justify-between pb-8 sm:pb-12 border-b border-white/5">
          <div className="flex items-center gap-6 sm:gap-10">
            <span className="text-sm font-black tracking-[0.25em] text-white uppercase">
              FARHADIO
            </span>
            <div className="hidden sm:flex items-center gap-6 text-[11px] font-semibold tracking-widest text-[#D4C4B5] uppercase">
              <Link href="/watches" className="hover:text-white transition-colors">
                Shop
              </Link>
              <Link href="/search" className="hover:text-white transition-colors">
                Search
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-5 text-[11px] font-semibold tracking-widest text-[#D4C4B5] uppercase">
            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Cart ({totalItems})</span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[#D4C4B5] hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* 3-Column Luxury Hero Grid */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center pt-8 sm:pt-12 min-h-[520px] lg:min-h-[580px]">
          
          {/* Left Column: Bold + Outlined Typography & Details */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6 lg:space-y-0 text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B58D69]/20 border border-[#B58D69]/30 text-[#E5D2C1] text-[10px] uppercase font-bold tracking-widest mb-4">
                <span>The 2026 Master Series</span>
              </div>

              {/* Bold Brand Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[0.95]">
                {brandWord}
              </h1>

              {/* Signature Hollow Outlined Subtitle */}
              <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-stroke tracking-tight uppercase leading-[0.95] mt-1 sm:mt-2">
                {seriesWord}
              </div>

              {/* Price Tag */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  ${currentWatch?.basePrice || 580}.00
                </span>
                {currentWatch?.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    ${currentWatch.originalPrice}.00
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs text-[#D4C4B5] max-w-sm leading-relaxed">
                {currentWatch?.shortDescription ||
                  '18K gold electro-plated surgical steel with champagne satin dial, sapphire crystal, and Swiss horological movement.'}
              </p>
            </div>

            {/* Bottom Left Meta & Wrist Detail Capsule */}
            <div className="pt-6 sm:pt-10 flex items-center gap-6">
              <Link
                href="#featured-collection"
                className="group inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#B58D69] hover:text-white transition-colors"
              >
                <span>Explore</span>
                <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </Link>

              {/* Wrist craftsmanship thumbnail preview */}
              <div className="flex items-center gap-3 bg-[#241812]/90 border border-white/10 rounded-full py-1.5 px-3.5 backdrop-blur-md">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#B58D69]/50">
                  <Image
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80"
                    alt="Watch on wrist"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#E5D2C1] font-semibold">
                  Hand-Finished Atelier
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: The Majestic Timepiece Center Stage */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6 lg:py-0">
            {/* The Floating Watch Image */}
            <div className="relative w-64 sm:w-80 lg:w-96 aspect-[3/4] transition-all duration-700 ease-out transform hover:scale-105">
              <Image
                src={currentWatch?.featuredImage || 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1000&q=80'}
                alt={currentWatch?.name || 'FARHADIO Luxury Watch'}
                fill
                priority
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Docked "Add to cart" CTA Button right below watch */}
            <div className="mt-4 sm:mt-6 z-20">
              <button
                onClick={handleAddToCart}
                className={`group flex items-center gap-3 px-7 py-3 rounded-full text-xs uppercase font-bold tracking-widest transition-all duration-300 shadow-xl ${
                  isAdded
                    ? 'bg-success text-white'
                    : 'bg-[#18100C] text-white hover:bg-white hover:text-[#18100C] border border-[#B58D69]/40 hover:border-white'
                }`}
              >
                <span>{isAdded ? 'Added to Cart' : 'Add to cart'}</span>
                <span className="w-6 h-6 rounded-full bg-[#B58D69] text-white group-hover:bg-[#18100C] group-hover:text-white flex items-center justify-center transition-colors">
                  {isAdded ? <Check size={12} /> : <ArrowRight size={12} />}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Alternate Watch Preview & Controls */}
          <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end h-full space-y-6 lg:space-y-0">
            {/* Empty space on top for desktop balance */}
            <div className="hidden lg:block"></div>

            {/* Miniature Alternate Watch Preview Card */}
            <div className="w-full sm:w-auto bg-[#241812]/95 border border-[#3A261B] rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3 text-[10px] font-bold tracking-wider text-[#D4C4B5] uppercase">
                <span>Next Piece</span>
                <span className="text-[#B58D69]">{nextWatchIndex + 1}/{activeWatches.length}</span>
              </div>

              {/* Preview image */}
              <div
                onClick={handleNext}
                className="relative w-28 h-28 sm:w-32 sm:h-32 bg-[#1A110C] rounded-xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#B58D69] transition-all group p-2"
              >
                <Image
                  src={nextWatch?.featuredImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'}
                  alt={nextWatch?.name || 'Next Watch'}
                  fill
                  className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="mt-3 text-center">
                <h4 className="text-xs font-bold text-white line-clamp-1">{nextWatch?.name}</h4>
                <p className="text-[11px] text-[#B58D69] font-semibold mt-0.5">${nextWatch?.basePrice}.00</p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={handlePrev}
                  className="w-7 h-7 rounded-full bg-[#18100C] text-[#D4C4B5] hover:text-white hover:bg-[#B58D69] flex items-center justify-center transition-colors border border-white/10"
                  aria-label="Previous watch"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-semibold">
                  Switch
                </span>
                <button
                  onClick={handleNext}
                  className="w-7 h-7 rounded-full bg-[#18100C] text-[#D4C4B5] hover:text-white hover:bg-[#B58D69] flex items-center justify-center transition-colors border border-white/10"
                  aria-label="Next watch"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Direct Shop Link */}
            <div className="pt-2">
              <Link
                href="/watches"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-[#B58D69] text-[#D4C4B5] hover:text-white flex items-center justify-center transition-all hover:scale-110"
                aria-label="View all watches"
              >
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LuxuryHero;

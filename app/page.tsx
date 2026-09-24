import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles, Award, Compass, Clock, Star } from 'lucide-react';
import { StoreRepository } from '@/lib/store-repository';
import ProductCard from '@/components/product/ProductCard';
import RatingStars from '@/components/ui/RatingStars';
import Button from '@/components/ui/Button';
import LuxuryHero from '@/components/home/LuxuryHero';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const products = await StoreRepository.getProducts({ status: 'active' });

  // Featured Collection items matching the exact 4 watches requested in the prompt:
  // Classic Black, Chrono Silver, Royal Gold, Minimal Steel
  const featuredSlugs = [
    'farhadio-classic-black',
    'farhadio-chrono-silver',
    'farhadio-royal-gold',
    'farhadio-minimal-steel',
  ];

  const featuredCollection = products.filter((p) => featuredSlugs.includes(p.slug));
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const collections = [
    {
      title: "Men's Horology",
      slug: 'men',
      count: products.filter((p) => p.collection.toLowerCase() === 'men').length,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: "Women's Atelier",
      slug: 'women',
      count: products.filter((p) => p.collection.toLowerCase() === 'women').length,
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Automatic Kinetic',
      slug: 'automatic',
      count: products.filter((p) => p.collection.toLowerCase() === 'automatic').length,
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Smart Luxury',
      slug: 'smart',
      count: products.filter((p) => p.collection.toLowerCase() === 'smart').length,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const testimonials = [
    {
      quote:
        'The finish and dial clarity rival pieces in my collection that cost thousands more. FARHADIO has genuinely cracked the code on accessible luxury.',
      author: 'Alexander Vance',
      role: 'Architect & Watch Enthusiast',
      watch: 'FARHADIO Classic Black',
      rating: 5,
    },
    {
      quote:
        'The Royal Gold has an exquisite warm tone. The Tuscan leather strap molded perfectly to my wrist from day one. Pure understated elegance.',
      author: 'Sophia Lindqvist',
      role: 'Creative Director',
      watch: 'FARHADIO Royal Gold',
      rating: 5,
    },
    {
      quote:
        'The exhibition caseback on the Grand Atelier Skeleton is a masterclass in mechanical movement assembly. Incredible value and craftsmanship.',
      author: 'Marcus Chen',
      role: 'Industrial Designer',
      watch: 'Grand Atelier Skeleton',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. LUXURY EDITORIAL HERO SECTION (Matching User Reference Design) */}
      <LuxuryHero products={products} />

      {/* 2. FEATURED COLLECTION GRID (Classic Black, Chrono Silver, Royal Gold, Minimal Steel) */}
      <section id="featured-collection" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block mb-2">
            Curated Selection
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text">
            Featured Collection
          </h2>
          <p className="text-xs sm:text-sm text-secondary mt-2">
            Four quintessential timepieces defining FARHADIO's aesthetic manifesto — pure geometry, tactile weight, and horological precision.
          </p>
        </div>

        {/* 4-card grid on desktop, 2-col on mobile as specified */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {featuredCollection.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/watches">
            <Button variant="outline" size="md" className="gap-2">
              View All 12 Timepieces <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. SHOP BY COLLECTION BAND: Men | Women | Automatic | Smart */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10">
            <div>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block mb-1">
                Categories
              </span>
              <h2 className="text-2xl font-bold text-text">Shop By Collection</h2>
            </div>
            <Link
              href="/watches"
              className="text-xs uppercase font-semibold text-text hover:text-gold flex items-center gap-1 mt-2 sm:mt-0 tracking-wider"
            >
              Browse All Collections <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {collections.map((col) => (
              <Link
                key={col.slug}
                href={`/watches/${col.slug}`}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-border shadow-sm hover:border-gold hover:shadow-gold-soft transition-all duration-300 flex flex-col justify-end p-5"
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="relative z-10 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mb-1">
                    {col.count} Timepieces
                  </span>
                  <h3 className="text-base sm:text-lg font-bold group-hover:text-gold transition-colors">
                    {col.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-[11px] uppercase tracking-wider font-medium text-neutral-300 group-hover:text-white">
                    <span>Discover</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS PRODUCT GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block mb-1">
              Top Rated
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Best Sellers</h2>
          </div>
          <Link
            href="/watches?sort=popular"
            className="text-xs uppercase font-semibold text-secondary hover:text-gold flex items-center gap-1 mt-2 sm:mt-0 tracking-wider"
          >
            Explore Popular Timepieces <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. CRAFTSMANSHIP & ATELIER ETHOS */}
      <section className="py-24 bg-[#0D0704] text-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block">
                The Atelier Standard
              </span>
              <h2 className="hero-serif text-3xl sm:text-4xl font-normal leading-tight text-white">
                Uncompromising Materials. <br />
                <span className="italic text-gold">Engineered to Outlast Generations.</span>
              </h2>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Every FARHADIO timepiece begins with cold-forged 316L austenitic stainless steel — renowned for corrosion resistance and hypoallergenic skin tolerance. Dials are machined with micrometer precision before receiving scratch-proof synthetic sapphire crystals treated with dual anti-reflective coating.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold">316L Surgical Steel</h4>
                  <p className="text-[11px] text-secondary mt-1">High-luster mirror bevels & satin brushed flanks.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold">Sapphire Crystal</h4>
                  <p className="text-[11px] text-secondary mt-1">9 on the Mohs scale, second only to diamond.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold">Swiss & Kinetic Calibers</h4>
                  <p className="text-[11px] text-secondary mt-1">Calibrated to ±5 seconds per month precision.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold">Tuscan Full Grain</h4>
                  <p className="text-[11px] text-secondary mt-1">Naturally vegetable-tanned Italian leather straps.</p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/about">
                  <Button variant="primary" size="md">
                    Explore The Brand Story
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-square rounded-2xl overflow-hidden border border-border shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
                alt="FARHADIO Atelier Horology Craftsmanship"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS & TESTIMONIAL CAROUSEL */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block mb-2">
            Client Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Loved By Connoisseurs Worldwide
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <RatingStars rating={5.0} size={16} />
            <span className="text-xs font-semibold text-secondary">4.9 / 5.0 Average Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((test, i) => (
            <div
              key={i}
              className="bg-surface p-7 rounded-xl border border-border flex flex-col justify-between hover:border-gold/60 hover:shadow-luxury transition-all duration-300"
            >
              <div>
                <RatingStars rating={test.rating} size={14} />
                <p className="text-xs sm:text-sm text-secondary italic mt-4 leading-relaxed">
                  "{test.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{test.author}</h4>
                  <p className="text-[11px] text-muted">{test.role}</p>
                </div>
                <span className="text-[10px] font-semibold text-gold bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
                  {test.watch}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

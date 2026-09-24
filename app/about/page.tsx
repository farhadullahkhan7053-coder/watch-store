import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Compass, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Our Story & Horology Heritage',
  description:
    'Discover the provenance of FARHADIO. Where reductive Scandinavian aesthetics meet meticulous Swiss watchmaking traditions.',
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen text-white">
      {/* Hero */}
      <section className="relative bg-surface py-20 lg:py-28 border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-3">
            The FARHADIO Manifesto
          </span>
          <h1 className="hero-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-text leading-tight">
            TIME, DESIGNED <br />
            <span className="italic text-gold">BETTER.</span>
          </h1>
          <p className="text-sm sm:text-base text-secondary mt-6 leading-relaxed">
            FARHADIO was born out of a profound frustration with traditional luxury horology: excessive markups, artificial scarcity, and dated ornamentation. We set out to engineer uncompromising timepieces crafted with surgical-grade materials, sapphire crystal, and Swiss calibers — delivered directly to those who value authentic substance.
          </p>
        </div>
      </section>

      {/* Chapter 1: The Material Standard */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
              alt="FARHADIO Watchmaking Atelier Precision"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs uppercase font-bold tracking-widest text-gold block">
              Architectural Materials
            </span>
            <h2 className="hero-serif text-3xl font-normal text-text">
              The 316L Surgical Steel Standard
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              Every FARHADIO chassis is machined from cold-forged 316L surgical stainless steel. This marine-grade alloy offers exceptional resistance to chlorides, sweat, and corrosion, ensuring that the mirror-polished bevels and brushed satin flanks retain their lustrous brilliance for lifetimes.
            </p>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              Shielding the dial is a synthetic sapphire crystal with a hardness rating of 9 on the Mohs scale, surpassed only by diamond. Both sides receive multi-layer anti-reflective vaporization treatments for optical purity under harsh sunlight.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 2: The Calibers */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-5">
              <span className="text-xs uppercase font-bold tracking-widest text-gold block">
                Kinetic Heart
              </span>
              <h2 className="hero-serif text-3xl font-normal text-text">
                Mechanical Purity & Hybrid Calibers
              </h2>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Whether powered by our self-winding mechanical movements featuring 21 jewels and 42 hours of reserve autonomy, or our temperature-compensated Swiss quartz calibers, each movement undergoes rigorous multi-position regulation over seven days in our workshop.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-3 text-xs">
                <div className="p-4 bg-white rounded border border-border">
                  <span className="font-bold text-gold uppercase tracking-wider block">±5 Seconds</span>
                  <span className="text-secondary mt-1 block">Calibrated tolerance standards across all calibers.</span>
                </div>
                <div className="p-4 bg-white rounded border border-border">
                  <span className="font-bold text-gold uppercase tracking-wider block">5 ATM to 30 ATM</span>
                  <span className="text-secondary mt-1 block">Hydrostatically pressure tested in specialized chambers.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80"
                alt="Automatic Skeleton Caliber Detail"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <h2 className="hero-serif text-3xl sm:text-4xl text-text font-normal mb-4">
          Experience The Collection
        </h2>
        <p className="text-xs sm:text-sm text-secondary max-w-lg mx-auto mb-8">
          Complimentary insured shipping, 30-day wrist trial, and our 5-year global warranty included with every acquisition.
        </p>
        <Link href="/watches">
          <Button variant="primary" size="lg">
            Shop All Timepieces
          </Button>
        </Link>
      </section>
    </div>
  );
}

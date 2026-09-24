import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { StoreRepository } from '@/lib/store-repository';
import ProductCard from '@/components/product/ProductCard';

interface Props {
  params: {
    collection: string;
  };
}

const COLLECTION_METADATA: Record<
  string,
  {
    name: string;
    title: string;
    tagline: string;
    description: string;
    heroImage: string;
  }
> = {
  men: {
    name: 'Men',
    title: "Men's Haute Horlogerie",
    tagline: 'Bold geometry, surgical grade 316L steel, and Swiss engineering.',
    description:
      'Engineered for the discerning modern gentleman. Designed with high-tensile stainless steel cases, anti-reflective sapphire crystals, and calibrated movements that command presence on the wrist.',
    heroImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=80',
  },
  women: {
    name: 'Women',
    title: "Women's Atelier Collection",
    tagline: 'Mother-of-pearl luminescence, handset gemstones, and refined slender profiles.',
    description:
      'A celebration of feminine grace and mechanical refinement. Featuring hand-set crystal markers, shimmering natural mother-of-pearl dials, and silky Milanese mesh bracelets.',
    heroImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1600&q=80',
  },
  automatic: {
    name: 'Automatic',
    title: 'Automatic Mechanical Calibers',
    tagline: 'Self-winding kinetic art with open exhibition casebacks.',
    description:
      'Powered purely by the natural motion of your wrist. With transparent exhibition sapphire crystal casebacks showcasing 21-jewel rotor mechanisms, perlage finishing, and blued balance screws.',
    heroImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1600&q=80',
  },
  smart: {
    name: 'Smart',
    title: 'Smart Connected Luxury',
    tagline: 'AMOLED clarity encased in titanium and luxury leather.',
    description:
      'The modern nexus where heritage horology meets digital intelligence. Comprehensive health biometric sensors, continuous heart-rate tracking, and smart notifications housed in lightweight aerospace titanium.',
    heroImage: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1600&q=80',
  },
};

export async function generateMetadata({ params }: Props) {
  const meta = COLLECTION_METADATA[params.collection.toLowerCase()];
  if (!meta) return { title: 'Collection' };
  return {
    title: `${meta.title} | FARHADIO`,
    description: meta.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const key = params.collection.toLowerCase();
  const meta = COLLECTION_METADATA[key];

  if (!meta) {
    notFound();
  }

  const products = await StoreRepository.getProducts({
    collection: meta.name,
    status: 'active',
  });

  return (
    <div className="bg-background min-h-screen text-white">
      {/* Hero Header with Imagery */}
      <section className="relative bg-[#0E0805] text-white py-20 lg:py-28 overflow-hidden border-b border-border">
        <Image
          src={meta.heroImage}
          alt={meta.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <Link
            href="/watches"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-300 hover:text-gold mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Back to All Watches
          </Link>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-2">
            The {meta.name} Series
          </span>
          <h1 className="hero-serif text-3xl sm:text-5xl font-normal leading-tight max-w-2xl">
            {meta.title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mt-3 leading-relaxed">
            {meta.description}
          </p>
        </div>
      </section>

      {/* Watches Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between pb-6 border-b border-border mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-text">
            {products.length} {meta.name} Timepieces Available
          </div>
          <Link
            href="/watches"
            className="text-xs text-gold hover:underline font-semibold uppercase tracking-wider"
          >
            View Entire Catalog
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-lg">
            <p className="text-sm text-secondary">New models currently in development at our atelier.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

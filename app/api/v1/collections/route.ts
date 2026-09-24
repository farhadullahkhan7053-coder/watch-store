import { NextResponse } from 'next/server';
import { StoreRepository } from '@/lib/store-repository';

export async function GET() {
  try {
    const products = await StoreRepository.getProducts({ status: 'active' });

    const collections = [
      {
        slug: 'men',
        name: 'Men',
        title: "Men's Haute Horlogerie",
        tagline: 'Sculpted from 316L surgical steel with masculine proportion and Swiss precision.',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80',
        count: products.filter((p) => p.collection.toLowerCase() === 'men').length,
      },
      {
        slug: 'women',
        name: 'Women',
        title: "Women's Delicate Atelier",
        tagline: 'Mother-of-pearl luminescence, handset gemstones, and refined slender profiles.',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80',
        count: products.filter((p) => p.collection.toLowerCase() === 'women').length,
      },
      {
        slug: 'automatic',
        name: 'Automatic',
        title: 'Automatic Mechanical Movements',
        tagline: 'Self-winding kinetic marvels with open exhibition casebacks and perpetual precision.',
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80',
        count: products.filter((p) => p.collection.toLowerCase() === 'automatic').length,
      },
      {
        slug: 'smart',
        name: 'Smart',
        title: 'Smart Connected Luxury',
        tagline: 'High-resolution AMOLED optics integrated seamlessly into hand-finished titanium casings.',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80',
        count: products.filter((p) => p.collection.toLowerCase() === 'smart').length,
      },
    ];

    return NextResponse.json({
      success: true,
      collections,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching collections' },
      { status: 500 }
    );
  }
}

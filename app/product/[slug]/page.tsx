import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { StoreRepository } from '@/lib/store-repository';
import ProductDetailView from '@/components/product/ProductDetailView';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await StoreRepository.getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | FARHADIO Timepieces`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: `${product.name} | FARHADIO`,
      description: product.shortDescription || product.description,
      images: [
        {
          url: product.featuredImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = params;
  const product = await StoreRepository.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [reviews, allProducts] = await Promise.all([
    StoreRepository.getReviews(product._id, 'approved'),
    StoreRepository.getProducts({ status: 'active' }),
  ]);

  const relatedProducts = allProducts.filter((p) => p._id !== product._id);

  // Schema.org Product Structured Data (SEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.variants[0]?.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: 'FARHADIO',
    },
    offers: {
      '@type': 'Offer',
      url: `https://farhadio.com/product/${product.slug}`,
      priceCurrency: 'USD',
      price: product.basePrice,
      availability: product.variants.some((v) => v.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: reviews.length > 0 ? reviews.length : 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView
        product={product}
        initialReviews={reviews}
        relatedProducts={relatedProducts}
      />
    </>
  );
}

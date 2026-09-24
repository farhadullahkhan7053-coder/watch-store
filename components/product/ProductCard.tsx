'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { RatingStars } from '@/components/ui/RatingStars';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const displayImage = currentVariant?.image || product.featuredImage;
  const inWish = isInWishlist(product._id) || isInWishlist(product.slug);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentVariant) {
      addItem(product, currentVariant, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.basePrice
      ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group relative bg-surface rounded-xl border border-border transition-all duration-300 hover:border-gold/60 hover:shadow-luxury flex flex-col justify-between overflow-hidden">
      {/* Badges & Wishlist Button */}
      <div className="relative aspect-square w-full bg-[#160E0A] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="bg-background/90 text-white border border-border/80 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
              Best Seller
            </span>
          )}
          {discountPercent && (
            <span className="bg-gold text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            inWish
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm'
              : 'bg-surface-elevated/80 backdrop-blur-sm text-secondary hover:text-gold hover:bg-surface border border-border/60 shadow-sm'
          }`}
        >
          <Heart size={15} className={inWish ? 'fill-red-400 text-red-400' : ''} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="hidden md:block absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={currentVariant?.stock === 0}
            className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg ${
              isAdded
                ? 'bg-success text-white'
                : currentVariant?.stock === 0
                ? 'bg-surface-elevated text-muted cursor-not-allowed'
                : 'bg-gold text-white hover:bg-gold-hover active:bg-gold-dark shadow-gold-soft'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={14} /> Added to Cart
              </>
            ) : currentVariant?.stock === 0 ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag size={14} /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Collection & Movement tag */}
          <div className="flex items-center justify-between text-[11px] text-secondary uppercase tracking-widest mb-1">
            <span>{product.collection}</span>
            <span>{product.movement}</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-text line-clamp-1 group-hover:text-gold transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <RatingStars rating={product.rating} size={12} showValue numReviews={product.numReviews} />
          </div>

          {/* Color Variant Swatches */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.variants.map((v, i) => (
                <button
                  key={v.sku}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantIndex(i);
                  }}
                  title={v.colorName}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedVariantIndex === i
                      ? 'border-gold ring-1 ring-gold scale-110'
                      : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                  aria-label={v.colorName}
                />
              ))}
              <span className="text-[10px] text-secondary ml-1">
                {product.variants.length} styles
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Mobile Quick Add */}
        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-text">
              ${currentVariant?.price || product.basePrice}
            </span>
            {product.originalPrice && product.originalPrice > product.basePrice && (
              <span className="text-xs text-secondary line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            aria-label="Quick add to cart"
            className="md:hidden w-8 h-8 rounded-md bg-gold text-white flex items-center justify-center hover:bg-gold-hover transition-colors"
          >
            {isAdded ? <Check size={15} /> : <ShoppingBag size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

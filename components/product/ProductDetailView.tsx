'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/image';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  Clock,
  Compass,
} from 'lucide-react';
import { Product, ProductVariant, Review } from '@/types';
import RatingStars from '@/components/ui/RatingStars';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface Props {
  product: Product;
  initialReviews: Review[];
  relatedProducts: Product[];
}

export const ProductDetailView: React.FC<Props> = ({
  product,
  initialReviews,
  relatedProducts,
}) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // State
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'shipping'>('specs');

  // Review form state
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const currentVariant: ProductVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const allImages = [
    currentVariant.image,
    ...product.images.filter((img) => img !== currentVariant.image),
  ];

  const inWish = isInWishlist(product._id) || isInWishlist(product.slug);
  const isOutOfStock = currentVariant.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, currentVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          userName: reviewName,
          userEmail: reviewEmail,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setReviewSuccess(true);
        setTimeout(() => {
          setReviewSuccess(false);
          setReviewFormOpen(false);
          setReviewName('');
          setReviewEmail('');
          setReviewTitle('');
          setReviewComment('');
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-secondary mb-8">
          <a href="/" className="hover:text-gold">Home</a>
          <ChevronRight size={12} />
          <a href="/watches" className="hover:text-gold">Watches</a>
          <ChevronRight size={12} />
          <a href={`/watches/${product.collection.toLowerCase()}`} className="hover:text-gold">{product.collection}</a>
          <ChevronRight size={12} />
          <span className="text-text font-semibold">{product.name}</span>
        </nav>

        {/* Main Product Layout: Gallery (Left) + Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full bg-surface rounded-lg overflow-hidden border border-border">
              <Image
                src={allImages[activeImageIndex] || product.featuredImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center transition-all duration-300"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isBestSeller && (
                  <span className="bg-text text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-sm">
                    Best Seller
                  </span>
                )}
                {currentVariant.stock <= 5 && currentVariant.stock > 0 && (
                  <span className="bg-gold text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-sm animate-pulse">
                    Only {currentVariant.stock} left in stock
                  </span>
                )}
              </div>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  inWish ? 'bg-red-50 text-red-500' : 'bg-white/90 text-text hover:text-gold'
                }`}
                aria-label="Save to wishlist"
              >
                <Heart size={20} className={inWish ? 'fill-red-500' : ''} />
              </button>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden bg-surface border-2 shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-gold shadow-xs' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover object-center" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Meta & Purchase Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Collection & Movement tag */}
              <div className="flex items-center justify-between text-xs text-secondary uppercase tracking-widest font-semibold">
                <span>{product.collection} Edition</span>
                <span>Caliber: {product.movement}</span>
              </div>

              {/* Title */}
              <h1 className="hero-serif text-2xl sm:text-3xl lg:text-4xl text-text font-normal leading-snug">
                {product.name}
              </h1>

              {/* Ratings and Reviews summary */}
              <div className="flex items-center gap-2">
                <RatingStars rating={product.rating} size={15} showValue numReviews={reviews.length} />
                <span className="text-secondary text-xs">• Verified Atelier Piece</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-2 border-y border-border">
                <span className="text-2xl sm:text-3xl font-bold text-text">
                  ${currentVariant.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-secondary line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-success font-semibold ml-auto">
                  Free Insured Express Shipping Included
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                {product.shortDescription || product.description}
              </p>

              {/* VARIANT PICKER 1: Colorways */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-text mb-2.5">
                  <span>Colorway:</span>
                  <span className="text-gold font-normal capitalize">{currentVariant.colorName}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.sku}
                      onClick={() => {
                        setSelectedVariantIndex(i);
                        setActiveImageIndex(0);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs transition-all ${
                        selectedVariantIndex === i
                          ? 'border-gold bg-gold/10 font-bold text-gold-dark shadow-xs'
                          : 'border-border text-secondary hover:border-neutral-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* VARIANT PICKER 2: Case Size & Strap Material Specs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-surface rounded-md border border-border text-xs">
                  <span className="text-[10px] uppercase font-bold text-secondary block">Case Diameter</span>
                  <span className="font-semibold text-text mt-0.5 block">{currentVariant.caseSize}</span>
                </div>
                <div className="p-3 bg-surface rounded-md border border-border text-xs">
                  <span className="text-[10px] uppercase font-bold text-secondary block">Strap Material</span>
                  <span className="font-semibold text-text mt-0.5 block">{currentVariant.bandMaterial}</span>
                </div>
              </div>

              {/* Quantity Stepper & Stock */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text">Quantity</span>
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-secondary hover:bg-surface disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-semibold text-text min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentVariant.stock, quantity + 1))}
                    disabled={quantity >= currentVariant.stock}
                    className="px-3 py-1.5 text-secondary hover:bg-surface disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="space-y-2.5 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex items-center justify-center gap-2"
                >
                  {isAdded ? (
                    <>
                      <Check size={16} /> Added to Your Bag
                    </>
                  ) : isOutOfStock ? (
                    'Currently Out of Stock'
                  ) : (
                    <>
                      <ShoppingBag size={16} /> Add to Bag — ${(currentVariant.price * quantity).toFixed(2)}
                    </>
                  )}
                </Button>

                <a href="/checkout" className="block w-full">
                  <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      if (!isOutOfStock) addItem(product, currentVariant, quantity);
                    }}
                  >
                    Instant Checkout
                  </Button>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border text-center text-[11px] text-secondary">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={18} className="text-gold" />
                  <span>5-Yr Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck size={18} className="text-gold" />
                  <span>Insured Courier</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw size={18} className="text-gold" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS SECTION: Specifications, Customer Reviews, Concierge Shipping */}
        <div className="mt-20 border-t border-border pt-12">
          <div className="flex items-center justify-center space-x-8 border-b border-border pb-4 mb-8">
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-xs uppercase font-bold tracking-wider transition-colors pb-2 border-b-2 ${
                activeTab === 'specs'
                  ? 'border-gold text-gold font-black'
                  : 'border-transparent text-secondary hover:text-text'
              }`}
            >
              Horology Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-xs uppercase font-bold tracking-wider transition-colors pb-2 border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-gold text-gold font-black'
                  : 'border-transparent text-secondary hover:text-text'
              }`}
            >
              Client Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`text-xs uppercase font-bold tracking-wider transition-colors pb-2 border-b-2 ${
                activeTab === 'shipping'
                  ? 'border-gold text-gold font-black'
                  : 'border-transparent text-secondary hover:text-text'
              }`}
            >
              Shipping & Authenticity
            </button>
          </div>

          {/* TAB 1: Specs */}
          {activeTab === 'specs' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
              <p className="text-xs sm:text-sm text-secondary leading-relaxed text-center max-w-2xl mx-auto">
                {product.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface rounded-md border border-border flex justify-between items-center text-xs">
                  <span className="text-secondary uppercase font-semibold">Movement Caliber</span>
                  <span className="font-bold text-text">{product.movement}</span>
                </div>
                <div className="p-4 bg-surface rounded-md border border-border flex justify-between items-center text-xs">
                  <span className="text-secondary uppercase font-semibold">Case Diameter</span>
                  <span className="font-bold text-text">{product.caseDiameter}</span>
                </div>
                <div className="p-4 bg-surface rounded-md border border-border flex justify-between items-center text-xs">
                  <span className="text-secondary uppercase font-semibold">Glass</span>
                  <span className="font-bold text-text">{product.glassType}</span>
                </div>
                <div className="p-4 bg-surface rounded-md border border-border flex justify-between items-center text-xs">
                  <span className="text-secondary uppercase font-semibold">Water Resistance</span>
                  <span className="font-bold text-text">{product.waterResistance}</span>
                </div>
                <div className="p-4 bg-surface rounded-md border border-border flex justify-between items-center text-xs">
                  <span className="text-secondary uppercase font-semibold">Strap Material</span>
                  <span className="font-bold text-text">{product.strapMaterial}</span>
                </div>
                <div className="p-4 bg-surface rounded-md border border-border flex justify-between items-center text-xs">
                  <span className="text-secondary uppercase font-semibold">Dial Finish</span>
                  <span className="font-bold text-text">{product.dialColor}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Client Reviews */}
          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-200">
              {/* Header with write review button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-surface rounded-lg border border-border">
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={product.rating} size={18} showValue />
                    <span className="text-xs text-secondary">Based on {reviews.length} reviews</span>
                  </div>
                  <p className="text-xs text-secondary mt-1">100% of purchasers recommend this timepiece.</p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setReviewFormOpen(!reviewFormOpen)}
                >
                  {reviewFormOpen ? 'Cancel Review' : 'Write a Client Review'}
                </Button>
              </div>

              {/* Write Review Form */}
              {reviewFormOpen && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-6 bg-surface rounded-lg border border-border space-y-4 animate-in fade-in duration-200"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text">
                    Submit Your Verification Review
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        placeholder="e.g. eleanor@example.com"
                        className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Rating</label>
                    <RatingStars
                      rating={reviewRating}
                      size={20}
                      interactive
                      onRatingChange={(r) => setReviewRating(r)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Headline</label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Unbelievable finish and wrist comfort"
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Review Comments</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience regarding the case finish, accuracy, strap comfort, or presentation..."
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  {reviewSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 text-success text-xs rounded">
                      Thank you! Your verified review has been published.
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="md"
                    isLoading={submittingReview}
                    type="submit"
                  >
                    Submit Review
                  </Button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-5 border border-border rounded-lg bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RatingStars rating={rev.rating} size={13} />
                        <span className="text-xs font-bold text-text">{rev.title}</span>
                      </div>
                      <span className="text-[11px] text-secondary">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-secondary leading-relaxed">{rev.comment}</p>

                    <div className="pt-2 flex items-center gap-1.5 text-[11px] text-text font-medium">
                      <span>{rev.userName}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="text-success flex items-center gap-0.5 text-[10px] font-bold">
                          <Check size={11} /> Verified Buyer
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Shipping & Authenticity */}
          {activeTab === 'shipping' && (
            <div className="max-w-4xl mx-auto space-y-6 text-xs text-secondary leading-relaxed animate-in fade-in duration-200">
              <div className="p-6 bg-surface rounded-lg border border-border space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-text">
                  FARHADIO Global Atelier Guarantee
                </h4>
                <p>
                  Every FARHADIO timepiece is individually inspected and tested for water resistance and timekeeping accuracy prior to dispatch. Each watch includes an individual serial number and an embossed Certificate of Authenticity signed by our master watchmakers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="border border-border p-4 rounded bg-white">
                    <h5 className="font-bold text-text uppercase tracking-wider mb-1">Express Courier</h5>
                    <p>Delivered via DHL Express or FedEx Priority within 2–4 business days worldwide. Signature required upon delivery.</p>
                  </div>
                  <div className="border border-border p-4 rounded bg-white">
                    <h5 className="font-bold text-text uppercase tracking-wider mb-1">30-Day Evaluation</h5>
                    <p>Experience the watch on your wrist. If you are not completely satisfied, return in original protective packaging for a 100% refund.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS RECOMMENDATION */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-border pt-16">
            <h3 className="hero-serif text-2xl text-text font-normal text-center mb-10">
              You May Also Appreciate
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <div key={p._id} className="group">
                  <a href={`/product/${p.slug}`} className="block">
                    <div className="relative aspect-square rounded-md overflow-hidden bg-surface border border-border group-hover:border-gold transition-colors">
                      <Image src={p.featuredImage} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-semibold text-text group-hover:text-gold transition-colors truncate">
                        {p.name}
                      </h4>
                      <p className="text-xs font-bold text-text mt-0.5">${p.basePrice}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY ADD TO CART BAR (Specified in Page 2 & 5) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-border p-3.5 z-40 flex items-center justify-between gap-3 shadow-lg">
        <div className="truncate">
          <p className="text-xs font-bold text-text truncate">{product.name}</p>
          <p className="text-xs font-bold text-gold">${currentVariant.price}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="px-5 py-2.5 bg-gold text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-gold-hover shrink-0 flex items-center gap-1.5"
        >
          {isAdded ? (
            <>
              <Check size={14} /> Added
            </>
          ) : (
            <>
              <ShoppingBag size={14} /> Add to Bag
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailView;

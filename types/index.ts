export type Role = 'customer' | 'admin';

export type WatchCollection = 'Men' | 'Women' | 'Automatic' | 'Smart';

export type MovementType = 'Automatic' | 'Quartz' | 'Mechanical' | 'Smart Digital';

export type BandMaterial = 'Italian Leather' | 'Stainless Steel' | 'Milanese Mesh' | 'Rubber / Silicone' | 'Titanium';

export interface ProductVariant {
  sku: string;
  colorName: string;
  colorHex: string;
  bandMaterial: BandMaterial;
  caseSize: string; // e.g. "40mm", "42mm"
  price: number;
  stock: number;
  image: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  collection: WatchCollection;
  basePrice: number;
  originalPrice?: number;
  images: string[];
  featuredImage: string;
  movement: MovementType;
  caseDiameter: string;
  waterResistance: string;
  strapMaterial: BandMaterial;
  dialColor: string;
  glassType: string;
  variants: ProductVariant[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  status: 'active' | 'archived';
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerifiedPurchase: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'returned' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variant: {
    sku: string;
    colorName: string;
    bandMaterial: string;
    caseSize: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'stripe' | 'card' | 'cod' | 'paypal';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentIntentId?: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  discountAmount: number;
  couponCode?: string;
  totalPrice: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  addresses?: ShippingAddress[];
  wishlist?: string[]; // array of product IDs or slugs
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CartItem {
  productId: string;
  variantSku: string;
  name: string;
  slug: string;
  image: string;
  colorName: string;
  bandMaterial: string;
  caseSize: string;
  price: number;
  quantity: number;
  maxStock: number;
}

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVariant {
  sku: string;
  colorName: string;
  colorHex: string;
  bandMaterial: string;
  caseSize: string;
  price: number;
  stock: number;
  image: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  collectionName: 'Men' | 'Women' | 'Automatic' | 'Smart';
  basePrice: number;
  originalPrice?: number;
  images: string[];
  featuredImage: string;
  movement: 'Automatic' | 'Quartz' | 'Mechanical' | 'Smart Digital';
  caseDiameter: string;
  waterResistance: string;
  strapMaterial: string;
  dialColor: string;
  glassType: string;
  variants: IVariant[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>(
  {
    sku: { type: String, required: true },
    colorName: { type: String, required: true },
    colorHex: { type: String, required: true },
    bandMaterial: { type: String, required: true },
    caseSize: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    collectionName: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Automatic', 'Smart'],
      index: true,
    },
    basePrice: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [{ type: String, required: true }],
    featuredImage: { type: String, required: true },
    movement: {
      type: String,
      required: true,
      enum: ['Automatic', 'Quartz', 'Mechanical', 'Smart Digital'],
    },
    caseDiameter: { type: String, default: '40mm' },
    waterResistance: { type: String, default: '5 ATM / 50M' },
    strapMaterial: { type: String, default: 'Italian Leather' },
    dialColor: { type: String, default: 'Onyx Black' },
    glassType: { type: String, default: 'Sapphire Crystal (Anti-Reflective)' },
    variants: [VariantSchema],
    rating: { type: Number, default: 5.0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

// Indexes on non-field indexed properties
ProductSchema.index({ basePrice: 1 });
ProductSchema.index({ status: 1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

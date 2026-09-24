import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const AddressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone number is required'),
  street: z.string().min(3, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State / Province is required'),
  postalCode: z.string().min(2, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  slug: z.string(),
  image: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  variant: z.object({
    sku: z.string(),
    colorName: z.string(),
    bandMaterial: z.string(),
    caseSize: z.string(),
  }),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'Order must contain at least 1 item'),
  shippingAddress: AddressSchema,
  paymentMethod: z.enum(['stripe', 'card', 'cod', 'paypal']),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateOrderStatusSchema = z.object({
  orderStatus: z.enum(['pending', 'paid', 'shipped', 'delivered', 'returned', 'refunded']),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  trackingNumber: z.string().optional(),
});

export const CreateReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  userEmail: z.string().email('Valid email is required'),
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Review title must be at least 3 characters'),
  comment: z.string().min(10, 'Review comment must be at least 10 characters'),
});

export const ModerateReviewSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
});

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const ProductVariantSchema = z.object({
  sku: z.string(),
  colorName: z.string(),
  colorHex: z.string(),
  bandMaterial: z.string(),
  caseSize: z.string(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  image: z.string().url(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(10, 'Description is required'),
  shortDescription: z.string().optional(),
  collectionName: z.enum(['Men', 'Women', 'Automatic', 'Smart']),
  basePrice: z.number().positive('Price must be greater than 0'),
  originalPrice: z.number().positive().optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  featuredImage: z.string().url('Featured image must be a valid URL'),
  movement: z.enum(['Automatic', 'Quartz', 'Mechanical', 'Smart Digital']),
  caseDiameter: z.string().default('40mm'),
  waterResistance: z.string().default('5 ATM / 50M'),
  strapMaterial: z.string().default('Italian Leather'),
  dialColor: z.string().default('Onyx Black'),
  glassType: z.string().default('Sapphire Crystal'),
  variants: z.array(ProductVariantSchema).min(1, 'At least one variant is required'),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  status: z.enum(['active', 'archived']).default('active'),
});

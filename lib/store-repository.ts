import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import UserModel from '@/models/User';
import ReviewModel from '@/models/Review';
import OrderModel from '@/models/Order';
import { Product, Review, Order, User, WatchCollection } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS, INITIAL_USERS } from '@/lib/mock-data';
import bcrypt from 'bcryptjs';

// In-memory persistent state for dev / offline / immediate testing
class InMemoryStore {
  products: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  reviews: Review[] = JSON.parse(JSON.stringify(INITIAL_REVIEWS));
  orders: Order[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
  users: Array<User & { passwordHash: string }> = [
    {
      ...INITIAL_USERS[0],
      // password: admin123456
      passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    },
    {
      ...INITIAL_USERS[1],
      // password: customer123456
      passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    },
  ];
  carts: Map<string, Array<{ productId: string; variantSku: string; quantity: number; price: number }>> = new Map();
}

declare global {
  // eslint-disable-next-line no-var
  var farhadioStore: InMemoryStore | undefined;
}

if (!global.farhadioStore) {
  global.farhadioStore = new InMemoryStore();
}

const memoryStore = global.farhadioStore;

export const StoreRepository = {
  // --- PRODUCTS ---
  async getProducts(params?: {
    collection?: string;
    movement?: string;
    bandMaterial?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
    featured?: boolean;
    bestSeller?: boolean;
    status?: string;
  }): Promise<Product[]> {
    const conn = await connectDB();
    if (conn) {
      try {
        const query: any = {};
        if (params?.collection) query.collectionName = params.collection;
        if (params?.movement) query.movement = params.movement;
        if (params?.bandMaterial) query.strapMaterial = params.bandMaterial;
        if (params?.featured !== undefined) query.isFeatured = params.featured;
        if (params?.bestSeller !== undefined) query.isBestSeller = params.bestSeller;
        if (params?.status) query.status = params.status;
        else query.status = 'active';

        if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
          query.basePrice = {};
          if (params.minPrice !== undefined) query.basePrice.$gte = params.minPrice;
          if (params.maxPrice !== undefined) query.basePrice.$lte = params.maxPrice;
        }

        if (params?.search) {
          query.$or = [
            { name: { $regex: params.search, $options: 'i' } },
            { description: { $regex: params.search, $options: 'i' } },
            { dialColor: { $regex: params.search, $options: 'i' } },
          ];
        }

        let sortOption: any = { createdAt: -1 };
        if (params?.sort === 'price_asc') sortOption = { basePrice: 1 };
        if (params?.sort === 'price_desc') sortOption = { basePrice: -1 };
        if (params?.sort === 'rating') sortOption = { rating: -1 };
        if (params?.sort === 'popular') sortOption = { numReviews: -1 };

        const products = await ProductModel.find(query).sort(sortOption).lean();
        if (products && products.length > 0) {
          return products.map((p: any) => ({
            ...p,
            _id: p._id.toString(),
            collection: p.collectionName,
          }));
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for products:', err);
      }
    }

    // Memory Store filtering
    let list = [...memoryStore.products];

    if (params?.status) {
      list = list.filter((p) => p.status === params.status);
    } else {
      list = list.filter((p) => p.status === 'active');
    }

    if (params?.collection) {
      list = list.filter((p) => p.collection.toLowerCase() === params.collection?.toLowerCase());
    }

    if (params?.movement) {
      list = list.filter((p) => p.movement.toLowerCase() === params.movement?.toLowerCase());
    }

    if (params?.bandMaterial) {
      list = list.filter((p) => p.strapMaterial.toLowerCase().includes(params.bandMaterial!.toLowerCase()));
    }

    if (params?.minPrice !== undefined) {
      list = list.filter((p) => p.basePrice >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      list = list.filter((p) => p.basePrice <= params.maxPrice!);
    }

    if (params?.featured !== undefined) {
      list = list.filter((p) => p.isFeatured === params.featured);
    }

    if (params?.bestSeller !== undefined) {
      list = list.filter((p) => p.isBestSeller === params.bestSeller);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.movement.toLowerCase().includes(q)
      );
    }

    if (params?.sort === 'price_asc') {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (params?.sort === 'price_desc') {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (params?.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (params?.sort === 'popular') {
      list.sort((a, b) => b.numReviews - a.numReviews);
    }

    return list;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const conn = await connectDB();
    if (conn) {
      try {
        const prod = await ProductModel.findOne({ slug }).lean();
        if (prod) {
          return {
            ...prod,
            _id: (prod as any)._id.toString(),
            collection: (prod as any).collectionName,
          } as unknown as Product;
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for slug:', err);
      }
    }
    const found = memoryStore.products.find((p) => p.slug === slug);
    return found || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    const conn = await connectDB();
    if (conn) {
      try {
        const prod = await ProductModel.findById(id).lean();
        if (prod) {
          return {
            ...prod,
            _id: (prod as any)._id.toString(),
            collection: (prod as any).collectionName,
          } as unknown as Product;
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for ID:', err);
      }
    }
    const found = memoryStore.products.find((p) => p._id === id);
    return found || null;
  },

  async createProduct(data: any): Promise<Product> {
    const conn = await connectDB();
    if (conn) {
      try {
        const created = await ProductModel.create({
          ...data,
          collectionName: data.collectionName || data.collection,
        });
        return {
          ...created.toObject(),
          _id: created._id.toString(),
          collection: created.collectionName,
        } as unknown as Product;
      } catch (err) {
        console.warn('Fallback to memoryStore for createProduct:', err);
      }
    }

    const newProd: Product = {
      ...data,
      _id: 'prod_' + Date.now(),
      collection: data.collectionName || data.collection || 'Men',
      rating: 5.0,
      numReviews: 0,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.products.unshift(newProd);
    return newProd;
  },

  async updateProduct(id: string, data: any): Promise<Product | null> {
    const conn = await connectDB();
    if (conn) {
      try {
        const updated = await ProductModel.findByIdAndUpdate(
          id,
          {
            ...data,
            ...(data.collection ? { collectionName: data.collection } : {}),
            ...(data.collectionName ? { collectionName: data.collectionName } : {}),
          },
          { new: true }
        ).lean();
        if (updated) {
          return {
            ...updated,
            _id: (updated as any)._id.toString(),
            collection: (updated as any).collectionName,
          } as unknown as Product;
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for updateProduct:', err);
      }
    }

    const idx = memoryStore.products.findIndex((p) => p._id === id || p.slug === id);
    if (idx >= 0) {
      memoryStore.products[idx] = {
        ...memoryStore.products[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return memoryStore.products[idx];
    }
    return null;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const conn = await connectDB();
    if (conn) {
      try {
        await ProductModel.findByIdAndDelete(id);
        return true;
      } catch (err) {
        console.warn('Fallback to memoryStore for deleteProduct:', err);
      }
    }

    const idx = memoryStore.products.findIndex((p) => p._id === id || p.slug === id);
    if (idx >= 0) {
      memoryStore.products.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- REVIEWS ---
  async getReviews(productId?: string, status?: string): Promise<Review[]> {
    const conn = await connectDB();
    if (conn) {
      try {
        const q: any = {};
        if (productId) q.productId = productId;
        if (status) q.status = status;
        const revs = await ReviewModel.find(q).sort({ createdAt: -1 }).lean();
        if (revs && revs.length > 0) {
          return revs.map((r: any) => ({
            ...r,
            _id: r._id.toString(),
          }));
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for reviews:', err);
      }
    }

    let revs = [...memoryStore.reviews];
    if (productId) {
      revs = revs.filter((r) => r.productId === productId);
    }
    if (status) {
      revs = revs.filter((r) => r.status === status);
    }
    return revs;
  },

  async createReview(data: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const conn = await connectDB();
    if (conn) {
      try {
        const created = await ReviewModel.create(data);
        return {
          ...created.toObject(),
          _id: created._id.toString(),
        } as unknown as Review;
      } catch (err) {
        console.warn('Fallback to memoryStore for createReview:', err);
      }
    }

    const newRev: Review = {
      ...data,
      _id: 'rev_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.reviews.unshift(newRev);

    // Update product rating
    const prod = memoryStore.products.find((p) => p._id === data.productId || p.slug === data.productId);
    if (prod) {
      prod.numReviews += 1;
    }

    return newRev;
  },

  async updateReviewStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Review | null> {
    const conn = await connectDB();
    if (conn) {
      try {
        const updated = await ReviewModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
        if (updated) {
          return {
            ...updated,
            _id: (updated as any)._id.toString(),
          } as unknown as Review;
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for updateReviewStatus:', err);
      }
    }

    const found = memoryStore.reviews.find((r) => r._id === id);
    if (found) {
      found.status = status;
      found.updatedAt = new Date().toISOString();
      return found;
    }
    return null;
  },

  async deleteReview(id: string): Promise<boolean> {
    const conn = await connectDB();
    if (conn) {
      try {
        await ReviewModel.findByIdAndDelete(id);
        return true;
      } catch (err) {
        console.warn('Fallback to memoryStore for deleteReview:', err);
      }
    }

    const idx = memoryStore.reviews.findIndex((r) => r._id === id);
    if (idx >= 0) {
      memoryStore.reviews.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- ORDERS ---
  async getOrders(userId?: string): Promise<Order[]> {
    const conn = await connectDB();
    if (conn) {
      try {
        const q: any = {};
        if (userId) q.userId = userId;
        const ords = await OrderModel.find(q).sort({ createdAt: -1 }).lean();
        if (ords && ords.length > 0) {
          return ords.map((o: any) => ({
            ...o,
            _id: o._id.toString(),
          }));
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for getOrders:', err);
      }
    }

    let ords = [...memoryStore.orders];
    if (userId) {
      ords = ords.filter((o) => o.userId === userId || o.guestEmail === userId);
    }
    return ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getOrderById(id: string): Promise<Order | null> {
    const conn = await connectDB();
    if (conn) {
      try {
        const ord = await OrderModel.findOne({
          $or: [{ _id: id }, { orderNumber: id }],
        }).lean();
        if (ord) {
          return {
            ...ord,
            _id: (ord as any)._id.toString(),
          } as unknown as Order;
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for getOrderById:', err);
      }
    }

    const found = memoryStore.orders.find((o) => o._id === id || o.orderNumber === id);
    return found || null;
  },

  async createOrder(data: any): Promise<Order> {
    const orderNumber = 'FAR-' + Math.floor(10000 + Math.random() * 90000);
    const orderPayload = {
      ...data,
      orderNumber,
      orderStatus: data.orderStatus || 'paid',
      paymentStatus: data.paymentStatus || 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const conn = await connectDB();
    if (conn) {
      try {
        const created = await OrderModel.create(orderPayload);
        return {
          ...created.toObject(),
          _id: created._id.toString(),
        } as unknown as Order;
      } catch (err) {
        console.warn('Fallback to memoryStore for createOrder:', err);
      }
    }

    const newOrder: Order = {
      ...orderPayload,
      _id: 'ord_' + Date.now(),
    };
    memoryStore.orders.unshift(newOrder);

    // Reduce stock of product variants
    if (newOrder.items) {
      for (const item of newOrder.items) {
        const prod = memoryStore.products.find((p) => p._id === item.productId || p.slug === item.slug);
        if (prod && prod.variants) {
          const variant = prod.variants.find((v) => v.sku === item.variant?.sku);
          if (variant && variant.stock >= item.quantity) {
            variant.stock -= item.quantity;
          }
        }
      }
    }

    return newOrder;
  },

  async updateOrderStatus(id: string, updates: { orderStatus?: string; paymentStatus?: string; trackingNumber?: string }): Promise<Order | null> {
    const conn = await connectDB();
    if (conn) {
      try {
        const updated = await OrderModel.findOneAndUpdate(
          { $or: [{ _id: id }, { orderNumber: id }] },
          { ...updates, updatedAt: new Date() },
          { new: true }
        ).lean();
        if (updated) {
          return {
            ...updated,
            _id: (updated as any)._id.toString(),
          } as unknown as Order;
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for updateOrderStatus:', err);
      }
    }

    const found = memoryStore.orders.find((o) => o._id === id || o.orderNumber === id);
    if (found) {
      if (updates.orderStatus) found.orderStatus = updates.orderStatus as any;
      if (updates.paymentStatus) found.paymentStatus = updates.paymentStatus as any;
      if (updates.trackingNumber) found.trackingNumber = updates.trackingNumber;
      found.updatedAt = new Date().toISOString();
      return found;
    }
    return null;
  },

  // --- USERS ---
  async getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    const conn = await connectDB();
    if (conn) {
      try {
        const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
        if (user) {
          return {
            ...user,
            _id: (user as any)._id.toString(),
          } as any;
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for getUserByEmail:', err);
      }
    }

    const found = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return found || null;
  },

  async getUserById(id: string): Promise<User | null> {
    const conn = await connectDB();
    if (conn) {
      try {
        const user = await UserModel.findById(id).lean();
        if (user) {
          return {
            ...user,
            _id: (user as any)._id.toString(),
          } as any;
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for getUserById:', err);
      }
    }

    const found = memoryStore.users.find((u) => u._id === id);
    if (found) {
      const { passwordHash, ...rest } = found;
      return rest;
    }
    return null;
  },

  async createUser(data: { name: string; email: string; passwordHash: string; role?: 'customer' | 'admin' }): Promise<User> {
    const conn = await connectDB();
    if (conn) {
      try {
        const created = await UserModel.create({
          ...data,
          role: data.role || 'customer',
          addresses: [],
          wishlist: [],
        });
        const obj = created.toObject();
        return {
          ...obj,
          _id: obj._id.toString(),
        } as unknown as User;
      } catch (err) {
        console.warn('Fallback to memoryStore for createUser:', err);
      }
    }

    const newUser = {
      _id: 'user_' + Date.now(),
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role || 'customer',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.users.push(newUser);
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  },

  async updateUserWishlist(userId: string, productId: string, action: 'add' | 'remove'): Promise<string[]> {
    const user = memoryStore.users.find((u) => u._id === userId);
    if (user) {
      user.wishlist = user.wishlist || [];
      if (action === 'add' && !user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
      } else if (action === 'remove') {
        user.wishlist = user.wishlist.filter((id) => id !== productId);
      }
      return user.wishlist;
    }
    return [];
  },

  async getAllUsers(): Promise<User[]> {
    const conn = await connectDB();
    if (conn) {
      try {
        const users = await UserModel.find().select('-passwordHash').lean();
        if (users && users.length > 0) {
          return users.map((u: any) => ({
            ...u,
            _id: u._id.toString(),
          }));
        }
      } catch (err) {
        console.warn('Fallback to memoryStore for getAllUsers:', err);
      }
    }

    return memoryStore.users.map(({ passwordHash, ...rest }) => rest);
  },

  // --- CARTS (Server side) ---
  getCart(key: string) {
    return memoryStore.carts.get(key) || [];
  },

  saveCart(key: string, items: any[]) {
    memoryStore.carts.set(key, items);
  },

  mergeCart(guestKey: string, userKey: string) {
    const guestItems = memoryStore.carts.get(guestKey) || [];
    const userItems = memoryStore.carts.get(userKey) || [];

    const merged = [...userItems];
    for (const gItem of guestItems) {
      const existing = merged.find((m) => m.productId === gItem.productId && m.variantSku === gItem.variantSku);
      if (existing) {
        existing.quantity += gItem.quantity;
      } else {
        merged.push(gItem);
      }
    }
    memoryStore.carts.set(userKey, merged);
    memoryStore.carts.delete(guestKey);
    return merged;
  },
};

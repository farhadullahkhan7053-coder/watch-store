import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import UserModel from '@/models/User';
import ReviewModel from '@/models/Review';
import OrderModel from '@/models/Order';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS, INITIAL_USERS } from '@/lib/mock-data';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    const conn = await connectDB();
    if (conn) {
      await ProductModel.deleteMany({});
      await UserModel.deleteMany({});
      await ReviewModel.deleteMany({});
      await OrderModel.deleteMany({});

      // Seed products
      for (const p of INITIAL_PRODUCTS) {
        await ProductModel.create({
          ...p,
          collectionName: p.collection,
        });
      }

      // Seed demo admin & customer
      const defaultPasswordHash = await hashPassword('farhadio123456');
      for (const u of INITIAL_USERS) {
        await UserModel.create({
          ...u,
          passwordHash: defaultPasswordHash,
        });
      }

      // Seed reviews
      for (const r of INITIAL_REVIEWS) {
        await ReviewModel.create(r);
      }

      // Seed orders
      for (const o of INITIAL_ORDERS) {
        await OrderModel.create(o);
      }

      return NextResponse.json({
        success: true,
        message: 'Database successfully seeded with FARHADIO products, reviews, users, and orders.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Running in in-memory mode. Store is already pre-loaded with FARHADIO luxury catalog.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error seeding database' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { StoreRepository } from '@/lib/store-repository';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin privileges required.' },
        { status: 403 }
      );
    }

    const [users, orders] = await Promise.all([
      StoreRepository.getAllUsers(),
      StoreRepository.getOrders(),
    ]);

    const customersWithStats = users.map((u) => {
      const userOrders = orders.filter((o) => o.userId === u._id || o.guestEmail === u.email);
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      return {
        ...u,
        ordersCount: userOrders.length,
        totalSpent,
      };
    });

    return NextResponse.json({
      success: true,
      customers: customersWithStats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching customers' },
      { status: 500 }
    );
  }
}

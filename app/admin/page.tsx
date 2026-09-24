'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Watch,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    fetch('/api/v1/admin/dashboard')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="hero-serif text-2xl sm:text-3xl text-text font-normal">
              Atelier Executive Dashboard
            </h1>
            <p className="text-xs text-secondary mt-1">
              Live horology performance metrics, sales volume, and order fulfillment workflows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/products">
              <Button variant="primary" size="sm">
                + Add Timepiece
              </Button>
            </Link>
          </div>
        </div>

        {/* Low Stock Warning Banner if any */}
        {data?.lowStockItems?.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <div className="text-xs">
              <span className="font-bold text-amber-900 block">
                Atelier Low Stock Alert ({data.lowStockItems.length} Variants Depleting)
              </span>
              <p className="text-amber-800 mt-0.5">
                The following variants have 5 or fewer pieces remaining:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.lowStockItems.map((item: any, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-[11px] text-amber-950"
                  >
                    {item.productName} ({item.colorName}): <strong>{item.stock} left</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-lg border border-border shadow-xs space-y-2">
            <div className="flex items-center justify-between text-secondary">
              <span className="text-xs uppercase font-bold tracking-wider">Total Sales</span>
              <div className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                <DollarSign size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-text">
              ${data?.stats?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
            </div>
            <div className="text-[11px] text-success flex items-center gap-1 font-semibold">
              <TrendingUp size={12} />
              <span>+18.4% vs previous cycle</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg border border-border shadow-xs space-y-2">
            <div className="flex items-center justify-between text-secondary">
              <span className="text-xs uppercase font-bold tracking-wider">Total Orders</span>
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-text flex items-center justify-center">
                <ShoppingBag size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-text">
              {data?.stats?.ordersCount || 0}
            </div>
            <div className="text-[11px] text-secondary">
              Across active worldwide regions
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg border border-border shadow-xs space-y-2">
            <div className="flex items-center justify-between text-secondary">
              <span className="text-xs uppercase font-bold tracking-wider">Active Timepieces</span>
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-text flex items-center justify-center">
                <Watch size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-text">
              {data?.stats?.productsCount || 0}
            </div>
            <div className="text-[11px] text-secondary">
              In Men, Women, Automatic, Smart
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg border border-border shadow-xs space-y-2">
            <div className="flex items-center justify-between text-secondary">
              <span className="text-xs uppercase font-bold tracking-wider">Pending Reviews</span>
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-text flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-text">
              {data?.stats?.pendingReviewsCount || 0}
            </div>
            <div className="text-[11px] text-secondary">
              Awaiting verification moderation
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart Simulation */}
        <div className="p-6 bg-white rounded-lg border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">
              Revenue Trajectory ($ USD)
            </h3>
            <span className="text-[11px] text-secondary font-medium">Fiscal Year 2026</span>
          </div>

          <div className="h-48 flex items-end gap-4 pt-6 pb-2 border-b border-border">
            {(data?.salesChart || []).map((point: any, idx: number) => {
              const max = 15000;
              const heightPercent = Math.min(100, Math.max(15, (point.sales / max) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    ${Math.round(point.sales)}
                  </span>
                  <div
                    className="w-full bg-gold hover:bg-gold-hover transition-all rounded-t-md"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-semibold text-text">{point.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders with Workflow Status Modifier */}
        <div className="p-6 bg-white rounded-lg border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">
              Recent Client Orders & Status Workflow
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-gold hover:underline font-semibold flex items-center gap-1"
            >
              All Orders ({data?.stats?.ordersCount}) <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-secondary uppercase font-semibold text-[11px]">
                <tr>
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Current Status</th>
                  <th className="pb-3">Action Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data?.recentOrders || []).map((ord: any) => (
                  <tr key={ord._id} className="hover:bg-surface/50">
                    <td className="py-3 font-mono font-bold text-text">{ord.orderNumber}</td>
                    <td className="py-3">
                      <p className="font-semibold text-text">{ord.shippingAddress?.fullName || 'Guest'}</p>
                      <p className="text-[11px] text-secondary">{ord.shippingAddress?.email}</p>
                    </td>
                    <td className="py-3 text-secondary">{ord.items?.length || 1} timepiece(s)</td>
                    <td className="py-3 font-bold text-text">${ord.totalPrice?.toFixed(2)}</td>
                    <td className="py-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-bold bg-surface border border-border">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      {/* Live Workflow Status Changer */}
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleQuickStatusChange(ord._id, e.target.value)}
                        className="px-2 py-1 text-xs border border-border rounded bg-white font-medium cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Search, CheckCircle, Truck, PackageCheck, RotateCcw } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Order, OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchOrders = () => {
    fetch('/api/v1/orders')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setOrders(res.orders);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/v1/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'all' && ord.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchClient = ord.shippingAddress?.fullName?.toLowerCase().includes(q);
      const matchEmail = ord.shippingAddress?.email?.toLowerCase().includes(q);
      return matchNum || matchClient || matchEmail;
    }
    return true;
  });

  const statuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'returned'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="hero-serif text-2xl sm:text-3xl text-text font-normal">
              Order Fulfillment Workflow
            </h1>
            <p className="text-xs text-secondary mt-1">
              Transition client orders through standard workflow: pending → paid → shipped → delivered → returned.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                statusFilter === 'all' ? 'bg-gold text-white' : 'bg-white border border-border text-secondary'
              }`}
            >
              All Orders ({orders.length})
            </button>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full capitalize font-semibold transition-colors ${
                  statusFilter === st ? 'bg-gold text-white' : 'bg-white border border-border text-secondary'
                }`}
              >
                {st} ({orders.filter((o) => o.orderStatus === st).length})
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search size={14} className="absolute left-3 top-2.5 text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, client, email..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-border rounded-md text-text focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-border text-secondary uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Client & Address</th>
                  <th className="py-3 px-4">Items Acquired</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Workflow Progression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-surface/50">
                    <td className="py-3 px-4 font-mono font-bold text-text">
                      {ord.orderNumber}
                      {ord.trackingNumber && (
                        <span className="block text-[10px] text-secondary font-sans font-normal mt-0.5">
                          {ord.trackingNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-secondary">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-text">{ord.shippingAddress?.fullName}</p>
                      <p className="text-[11px] text-secondary">{ord.shippingAddress?.city}, {ord.shippingAddress?.country}</p>
                      <p className="text-[10px] text-secondary">{ord.shippingAddress?.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {ord.items.map((item, idx) => (
                          <p key={idx} className="text-secondary font-medium">
                            <span className="text-text font-bold">{item.quantity}x</span> {item.name} ({item.variant?.colorName})
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-text">${ord.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateStatus(ord._id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 text-xs border border-border rounded-md bg-white font-medium capitalize cursor-pointer focus:outline-none focus:border-gold"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid (Atelier)</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="returned">Returned / Refunded</option>
                        </select>
                      </div>
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

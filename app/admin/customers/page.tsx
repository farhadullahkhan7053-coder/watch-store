'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, DollarSign, ShoppingBag } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/customers')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.customers) {
          setCustomers(res.customers);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="hero-serif text-2xl sm:text-3xl text-text font-normal">
              Customer Directory
            </h1>
            <p className="text-xs text-secondary mt-1">
              Registered FARHADIO clientele, order counts, and lifetime acquisition value.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-border text-secondary uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-surface/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold/15 text-gold-dark font-bold text-xs flex items-center justify-center">
                          {c.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-bold text-text">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-secondary">{c.email}</td>
                    <td className="py-3 px-4">
                      <span className={`capitalize font-bold text-[10px] px-2 py-0.5 rounded ${
                        c.role === 'admin' ? 'bg-gold/15 text-gold-dark' : 'bg-surface text-secondary'
                      }`}>
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-text">{c.ordersCount || 0}</td>
                    <td className="py-3 px-4 font-bold text-text">
                      ${(c.totalSpent || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-secondary">
                      {new Date(c.createdAt || Date.now()).toLocaleDateString()}
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

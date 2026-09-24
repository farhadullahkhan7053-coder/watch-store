'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Watch,
  ShoppingBag,
  MessageSquare,
  Users,
  Store,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user, isAdmin, demoLogin } = useAuth();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products Catalog', href: '/admin/products', icon: Watch },
    { label: 'Orders Workflow', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Reviews Moderation', href: '/admin/reviews', icon: MessageSquare },
    { label: 'Customers', href: '/admin/customers', icon: Users },
  ];

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-surface">
        <div className="max-w-md w-full p-8 bg-white rounded-xl border border-border text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-red-50 text-error rounded-full flex items-center justify-center mx-auto border border-red-200">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-text">Administrator Access Required</h2>
          <p className="text-xs text-secondary leading-relaxed">
            This portal is restricted to authorized FARHADIO staff and administrators.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => demoLogin('admin')}
            >
              Log In as Demo Admin (1-Click)
            </Button>
            <Link href="/">
              <Button variant="outline" size="md" fullWidth>
                Return to Storefront
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-text text-white p-6 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div>
              <span className="text-lg font-black tracking-widest text-white">FARHADIO</span>
              <span className="text-[10px] text-gold uppercase tracking-widest block font-bold">Admin Atelier</span>
            </div>
            <ShieldCheck size={20} className="text-gold" />
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-gold text-white font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-neutral-800 space-y-3">
          <div className="text-xs text-neutral-400">
            <p className="font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] truncate">{user.email}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-gold hover:underline font-semibold"
          >
            <Store size={14} /> Back to Public Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

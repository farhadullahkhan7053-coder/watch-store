'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  MapPin,
  Heart,
  User as UserIcon,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Plus,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { Order, Product } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AccountPage() {
  const { user, logout, demoLogin } = useAuth();
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Address form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      fetch('/api/v1/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.orders) {
            setOrders(data.orders);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    } else {
      setLoadingOrders(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full p-8 bg-surface rounded-xl border border-border text-center space-y-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-gold mx-auto border border-border shadow-xs">
            <UserIcon size={24} />
          </div>
          <h2 className="text-xl font-bold text-text">Account Authentication Required</h2>
          <p className="text-xs text-secondary leading-relaxed">
            Please sign in to view your orders, saved addresses, and registered timepieces.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login">
              <Button variant="primary" size="md" fullWidth>
                Sign In to Your Account
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => demoLogin('customer')}
            >
              1-Click Demo Customer Access
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'shipped':
        return <Badge variant="gold">Shipped / In Transit</Badge>;
      case 'paid':
        return <Badge variant="surface">Atelier Inspection</Badge>;
      case 'pending':
        return <Badge variant="surface">Payment Pending</Badge>;
      case 'returned':
        return <Badge variant="error">Returned</Badge>;
      default:
        return <Badge variant="surface">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="p-6 bg-surface rounded-xl border border-border mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-text text-white font-bold text-lg flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-text">{user.name}</h1>
                {user.role === 'admin' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold-dark px-2 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link href="/admin">
                <Button variant="primary" size="sm">
                  Go to Admin Dashboard
                </Button>
              </Link>
            )}
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-error hover:bg-white font-medium"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 sm:gap-6 border-b border-border pb-3 mb-8 overflow-x-auto text-xs uppercase font-bold tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'orders' ? 'border-gold text-gold font-black' : 'border-transparent text-secondary hover:text-text'
            }`}
          >
            <Package size={15} /> Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'addresses' ? 'border-gold text-gold font-black' : 'border-transparent text-secondary hover:text-text'
            }`}
          >
            <MapPin size={15} /> Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'wishlist' ? 'border-gold text-gold font-black' : 'border-transparent text-secondary hover:text-text'
            }`}
          >
            <Heart size={15} /> Saved Timepieces ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'profile' ? 'border-gold text-gold font-black' : 'border-transparent text-secondary hover:text-text'
            }`}
          >
            <UserIcon size={15} /> Profile Settings
          </button>
        </div>

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loadingOrders ? (
              <p className="text-xs text-secondary animate-pulse">Loading order history...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-surface rounded-lg border border-border">
                <p className="text-sm font-bold text-text mb-1">No Orders Found</p>
                <p className="text-xs text-secondary mb-4">You have not acquired any timepieces yet.</p>
                <Link href="/watches">
                  <Button variant="primary" size="sm">
                    Browse Watches
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="p-5 bg-surface rounded-lg border border-border hover:border-gold transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-text">{ord.orderNumber}</span>
                        {getStatusBadge(ord.orderStatus)}
                      </div>
                      <p className="text-[11px] text-secondary mt-1">
                        Ordered on {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} timepiece(s)
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="relative w-12 h-12 rounded bg-white border border-border overflow-hidden">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                      <div className="text-right">
                        <span className="text-[10px] text-secondary uppercase font-semibold block">Total</span>
                        <span className="text-sm font-bold text-text">${ord.totalPrice.toFixed(2)}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(ord)}
                      >
                        View Order Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text">
                Your Delivery Destinations
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddressModal(!showAddressModal)}
                className="flex items-center gap-1.5"
              >
                <Plus size={14} /> Add New Address
              </Button>
            </div>

            {/* Address Form Toggle */}
            {showAddressModal && (
              <div className="p-6 bg-surface rounded-lg border border-border space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text">
                  New Shipping Destination
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Phone</label>
                    <input
                      type="text"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">Street Address</label>
                    <input
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded bg-white"
                    />
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    alert('Address saved to your profile.');
                    setShowAddressModal(false);
                  }}
                >
                  Save Address
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 border border-gold/40 rounded-lg bg-surface relative">
                <span className="absolute top-4 right-4 text-[10px] font-bold text-gold uppercase tracking-wider bg-gold/15 px-2 py-0.5 rounded">
                  Default Address
                </span>
                <p className="font-bold text-xs text-text">{user.name}</p>
                <p className="text-xs text-secondary mt-1">450 Park Avenue South, Apt 12B</p>
                <p className="text-xs text-secondary">New York, NY 10016</p>
                <p className="text-xs text-secondary">United States</p>
                <p className="text-xs text-secondary mt-2">+1 (555) 234-8901</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED TIMEPIECES */}
        {activeTab === 'wishlist' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text">
                Your Saved Vault ({wishlist.length})
              </h3>
              <Link href="/wishlist" className="text-xs text-gold hover:underline font-semibold">
                Open Full Wishlist Page →
              </Link>
            </div>
            <p className="text-xs text-secondary">
              Items in your wishlist remain synced across all your sessions.
            </p>
          </div>
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-lg p-6 bg-surface rounded-lg border border-border space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">
              Profile Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-3 py-2 border border-border rounded bg-white text-text"
                />
              </div>
              <div>
                <label className="block font-semibold text-text mb-1">Email Address</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded bg-neutral-100 text-secondary cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-text mb-1">Role Permissions</label>
                <input
                  type="text"
                  defaultValue={user.role === 'admin' ? 'Executive Administrator' : 'Standard Customer'}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded bg-neutral-100 text-secondary cursor-not-allowed"
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => alert('Profile preferences updated.')}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setSelectedOrder(null)}
            />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-[10px] text-secondary uppercase font-semibold">Order Details</span>
                  <h3 className="text-base font-bold text-text font-mono">{selectedOrder.orderNumber}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-secondary hover:text-text text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span>Status: {getStatusBadge(selectedOrder.orderStatus)}</span>
                <span className="text-secondary">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>

              {/* Items */}
              <div className="divide-y divide-border border-y border-border">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded bg-surface border border-border overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-text">{item.name}</p>
                        <p className="text-[11px] text-secondary">{item.variant?.colorName} • Qty {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-text">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="p-3 bg-surface rounded text-xs space-y-1">
                <span className="font-bold uppercase text-[10px] text-secondary">Delivery Destination</span>
                <p className="font-semibold text-text">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-secondary">{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}</p>
                {selectedOrder.trackingNumber && (
                  <p className="text-gold font-mono pt-1">FedEx Tracking: {selectedOrder.trackingNumber}</p>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-secondary">Payment Method: {selectedOrder.paymentMethod.toUpperCase()}</span>
                <span className="text-sm font-bold text-gold">Total: ${selectedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

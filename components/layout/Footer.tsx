'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, ShieldCheck, RefreshCw, Truck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0E0805] border-t border-border pt-16 pb-12 text-white">
      {/* 4-Icon Trust Row as specified in wireframe */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 px-6 bg-surface rounded-xl border border-border">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0 border border-gold/20">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Complimentary Shipping</h4>
              <p className="text-[11px] text-secondary mt-1">Free insured express courier on all orders over $300.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0 border border-gold/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">5-Year Global Warranty</h4>
              <p className="text-[11px] text-secondary mt-1">Full atelier service and international coverage guaranteed.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0 border border-gold/20">
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">30-Day Effortless Returns</h4>
              <p className="text-[11px] text-secondary mt-1">Pre-paid insured return packaging included in every order.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0 border border-gold/20">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Swiss Horology Craft</h4>
              <p className="text-[11px] text-secondary mt-1">Individual serial numbering & certificate of authenticity.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-border">
          {/* Brand Ethos & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-2xl font-black tracking-[0.28em] text-white block">
              FARHADIO
            </span>
            <p className="text-xs text-secondary leading-relaxed max-w-sm">
              TIME, DESIGNED BETTER. We create accessible luxury timepieces designed for the modern connoisseur. Precision engineering meets minimalist Scandinavian-Swiss design.
            </p>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Join The FARHADIO Inner Circle
              </h4>
              <p className="text-[11px] text-secondary mb-3">
                Receive private vault access, limited edition previews, and $50 off your first timepiece.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-success bg-green-950/40 p-3 rounded-lg border border-green-800">
                  <Check size={16} /> Thank you for subscribing to FARHADIO Private Vault.
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={16} className="absolute left-3 top-3 text-muted" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-surface text-white placeholder-muted focus:outline-none focus:border-gold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gold hover:bg-gold-hover text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-gold-soft"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Timepieces */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text mb-4">
              Timepieces
            </h4>
            <ul className="space-y-2.5 text-xs text-secondary">
              <li>
                <Link href="/watches" className="hover:text-gold transition-colors">
                  All Watches
                </Link>
              </li>
              <li>
                <Link href="/watches/men" className="hover:text-gold transition-colors">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link href="/watches/women" className="hover:text-gold transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link href="/watches/automatic" className="hover:text-gold transition-colors">
                  Automatic Mechanical
                </Link>
              </li>
              <li>
                <Link href="/watches/smart" className="hover:text-gold transition-colors">
                  Smart Digital Luxe
                </Link>
              </li>
              <li>
                <Link href="/product/farhadio-classic-black" className="hover:text-gold transition-colors">
                  Classic Black Limited
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text mb-4">
              Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-secondary">
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact & Atelier
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-gold transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Warranty & Servicing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold transition-colors">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text mb-4">
              Flagship Ateliers
            </h4>
            <p className="text-xs text-secondary leading-relaxed mb-4">
              Geneva · London · New York · Dubai · Tokyo
            </p>
            <p className="text-[11px] text-secondary mb-1">Concierge Inquiries:</p>
            <p className="text-xs font-medium text-text">concierge@farhadio.com</p>
            <p className="text-xs font-medium text-text mt-0.5">+1 (800) 928-2446</p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Icons */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary">
          <p>© {new Date().getFullYear()} FARHADIO Timepieces Inc. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary">
              Guaranteed Safe Checkout
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-text bg-surface px-2 py-1 rounded border border-border">
              <span>VISA</span>
              <span>·</span>
              <span>MC</span>
              <span>·</span>
              <span>AMEX</span>
              <span>·</span>
              <span>STRIPE</span>
              <span>·</span>
              <span>APPLE PAY</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="hover:text-gold transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

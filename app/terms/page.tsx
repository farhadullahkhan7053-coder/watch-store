import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 text-xs text-secondary leading-relaxed">
        <span className="text-xs uppercase font-bold tracking-widest text-gold block">
          Legal Agreement
        </span>
        <h1 className="hero-serif text-3xl font-normal text-text">
          FARHADIO Terms of Service
        </h1>
        <p className="text-secondary text-[11px]">Effective Date: September 2026</p>

        <section className="space-y-2 pt-4">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider">1. General Provisions</h2>
          <p>
            By accessing or acquiring timepieces from FARHADIO, you agree to be bound by these Terms of Service. All orders placed through our digital storefront represent a binding contract upon confirmation of payment authorization.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider">2. Pricing & Currency</h2>
          <p>
            All prices listed on FARHADIO are displayed in USD unless explicitly stated otherwise. We reserve the right to correct typographical pricing discrepancies prior to fulfillment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider">3. 5-Year Global Warranty</h2>
          <p>
            Each timepiece includes our comprehensive 5-Year Limited Global Warranty covering mechanical caliber defects and manufacturing tolerances. Warranty does not cover normal aesthetic wear, unauthorized servicing, or water damage exceeding verified ATM thresholds.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider">4. 30-Day Return Evaluation</h2>
          <p>
            Timepieces may be returned within 30 days of delivery provided they remain unworn with protective films, tags, and Certificate of Authenticity intact in original packaging.
          </p>
        </section>
      </div>
    </div>
  );
}

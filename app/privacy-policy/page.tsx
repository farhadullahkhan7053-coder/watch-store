import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 text-xs text-secondary leading-relaxed">
        <span className="text-xs uppercase font-bold tracking-widest text-gold block">
          Legal Notice
        </span>
        <h1 className="hero-serif text-3xl font-normal text-text">
          FARHADIO Privacy Policy
        </h1>
        <p className="text-secondary text-[11px]">Last Updated: September 2026</p>

        <section className="space-y-2 pt-4">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider">1. Commitment to Privacy</h2>
          <p>
            FARHADIO Timepieces Inc. (&quot;FARHADIO&quot;, &quot;we&quot;, &quot;our&quot;) is committed to protecting the integrity and confidentiality of your personal information. This Privacy Policy details how we collect, use, and safeguard personal data when you explore our digital boutique or acquire our timepieces.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider">2. Information Collection</h2>
          <p>
            We collect personal information necessary to fulfill acquisitions, verify warranty credentials, and provide concierge customer support. This includes your name, shipping address, contact email, phone number, and tokenized payment identifiers handled securely by PCI-compliant payment gateways.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider">3. Use of Cookies and Analytics</h2>
          <p>
            Our store utilizes essential cookies to maintain shopping bag persistence, remember session authentication, and analyze aggregate visitor traffic patterns to refine our horological collection presentations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider">4. Inquiries</h2>
          <p>
            For inquiries regarding data privacy or to request the deletion of your account records, please contact <a href="mailto:privacy@farhadio.com" className="text-gold underline">privacy@farhadio.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

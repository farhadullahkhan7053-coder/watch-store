'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Consultation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setTimeout(() => {
        setName('');
        setEmail('');
        setMessage('');
      }, 500);
    }
  };

  const faqs = [
    {
      q: 'How does the FARHADIO 5-Year Global Warranty work?',
      a: 'Every FARHADIO watch includes five years of worldwide coverage against mechanical and manufacturing defects. Should your timepiece require servicing, our concierge will arrange insured express courier transport to our nearest regional atelier.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a complimentary 30-day evaluation period. If you decide the timepiece does not suit your style, simply use the pre-paid insured return packaging included in your delivery box for a 100% full refund.',
    },
    {
      q: 'Are FARHADIO watches suitable for water sports and swimming?',
      a: 'Our Classic and Dress watches are rated to 5 ATM (50 meters/165 feet), suitable for rain, handwashing, and light immersion. Our Diver models are hydrostatically certified to 30 ATM (300 meters) with screw-down crowns engineered for scuba diving.',
    },
    {
      q: 'How long does worldwide express shipping take?',
      a: 'Orders are dispatched within 24 hours from our fulfillment hub via DHL Express or FedEx Priority. Deliveries typically arrive within 2 business days in North America & Europe, and 3–4 business days worldwide.',
    },
  ];

  return (
    <div className="bg-background min-h-screen py-12 sm:py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-2">
            FARHADIO Concierge
          </span>
          <h1 className="hero-serif text-3xl sm:text-5xl font-normal text-text">
            Client Relations & Atelier Services
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-3 leading-relaxed">
            Our horological advisors are available 7 days a week for styling guidance, custom engraving inquiries, and technical support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form (Left) */}
          <div className="lg:col-span-7 bg-surface p-8 rounded-xl border border-border">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text mb-4">
              Send a Concierge Inquiry
            </h2>

            {submitted ? (
              <div className="p-6 bg-white rounded-lg border border-green-200 text-center space-y-3">
                <CheckCircle2 size={36} className="text-success mx-auto" />
                <h3 className="text-sm font-bold text-text">Inquiry Dispatched to Concierge</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Thank you, <span className="font-semibold">{name}</span>. A senior horology advisor will respond to <span className="font-semibold">{email}</span> within 4 business hours.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-text mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Julian Ross"
                      className="w-full px-3 py-2 border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-text mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="julian@example.com"
                      className="w-full px-3 py-2 border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-text mb-1">Inquiry Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                  >
                    <option value="Product Consultation">Timepiece Recommendation / Sizing</option>
                    <option value="Order Status">Order Tracking & Fulfillment</option>
                    <option value="Warranty & Service">Warranty & Atelier Maintenance</option>
                    <option value="Corporate / Gifting">Corporate Orders & Custom Engraving</option>
                    <option value="Press">Press & Media Relations</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How may our concierge assist your horological collection today?..."
                    className="w-full px-3 py-2 border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                  />
                </div>

                <Button variant="primary" size="lg" type="submit" fullWidth>
                  Dispatch Inquiry to Atelier
                </Button>
              </form>
            )}
          </div>

          {/* Showrooms & Hours (Right) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 bg-surface rounded-xl border border-border space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text">
                Direct Atelier Contact
              </h3>

              <div className="space-y-3 text-xs text-secondary">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Client Relations Email</span>
                    <span>concierge@farhadio.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Toll-Free Telephone</span>
                    <span>+1 (800) 928-2446 (North America)</span>
                    <span className="block">+44 20 7946 0912 (UK / Europe)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Concierge Hours</span>
                    <span>Mon – Fri: 08:00 – 21:00 EST</span>
                    <span className="block">Sat – Sun: 09:00 – 18:00 EST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Principal Flagship Showrooms</span>
                    <span>New York: 450 Park Avenue South</span>
                    <span className="block">Geneva: Rue du Rhône 42</span>
                    <span className="block">London: 14 New Bond Street</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ Accordion */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text">
                Frequently Asked Inquiries
              </h3>

              <div className="divide-y divide-border border border-border rounded-lg bg-surface">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-4">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between text-left text-xs font-bold text-text hover:text-gold transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={14}
                        className={`text-gold transition-transform shrink-0 ml-2 ${
                          openFaq === i ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <p className="mt-2 text-xs text-secondary leading-relaxed animate-in fade-in duration-150">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

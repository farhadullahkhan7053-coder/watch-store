'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-white min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full p-8 bg-surface rounded-xl border border-border shadow-sm text-center">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-1">
          Vault Recovery
        </span>
        <h1 className="hero-serif text-2xl sm:text-3xl text-text font-normal mb-2">
          Reset Your Credentials
        </h1>

        {submitted ? (
          <div className="space-y-4 pt-4">
            <div className="w-12 h-12 bg-green-50 text-success rounded-full flex items-center justify-center mx-auto border border-green-200">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-xs text-text leading-relaxed">
              If an account is associated with <span className="font-bold">{email}</span>, we have dispatched instructions to reset your passcode.
            </p>
            <Link href="/login" className="inline-block mt-4">
              <Button variant="outline" size="sm">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-left">
            <p className="text-xs text-secondary leading-relaxed">
              Enter your registered email address and our concierge system will send you a secure verification link.
            </p>

            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-3 text-secondary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <Button variant="primary" size="lg" fullWidth type="submit">
              Send Reset Passcode
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-gold"
              >
                <ArrowLeft size={13} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

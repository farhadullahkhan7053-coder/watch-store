'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setErrorMsg(res.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleQuickDemo = async (role: 'admin' | 'customer') => {
    setLoading(true);
    await demoLogin(role);
    setLoading(false);
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="bg-background min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full space-y-8 p-8 bg-surface rounded-xl border border-border shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-1">
            FARHADIO Private Vault
          </span>
          <h1 className="hero-serif text-2xl sm:text-3xl text-white font-normal">
            Welcome Back
          </h1>
          <p className="text-xs text-secondary mt-1">
            Access your order tracking, personal vault, and registered timepieces.
          </p>
        </div>

        {/* 1-Click Demo Accounts Banner */}
        <div className="p-4 bg-surface-elevated rounded-lg border border-gold/40 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-gold" />
              1-Click Demo Access
            </span>
            <span className="text-[10px] text-secondary font-medium">Instant Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-3 text-xs bg-gold/15 text-gold-dark hover:bg-gold hover:text-white font-bold rounded transition-colors text-center border border-gold/30"
            >
              Demo Admin (Full CRUD)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-2 px-3 text-xs bg-neutral-100 text-text hover:bg-text hover:text-white font-bold rounded transition-colors text-center border border-border"
            >
              Demo Customer Account
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-error text-xs rounded flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-text uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-gold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-secondary" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            type="submit"
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-secondary">
          Don't have an account yet?{' '}
          <Link href="/register" className="font-bold text-text hover:text-gold underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}

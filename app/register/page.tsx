'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await register(name, email, password);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setErrorMsg(res.message || 'Registration failed. Try again with a different email.');
    }
  };

  return (
    <div className="bg-background min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full space-y-8 p-8 bg-surface rounded-xl border border-border shadow-2xl">
        <div className="text-center">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-1">
            Create an Account
          </span>
          <h1 className="hero-serif text-2xl sm:text-3xl text-white font-normal">
            Join The FARHADIO Circle
          </h1>
          <p className="text-xs text-secondary mt-1">
            Enjoy priority order fulfillment, digital warranty registration, and private release invitations.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-error text-xs rounded flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-3 text-secondary" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian Ross"
                className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-md bg-white text-text focus:outline-none focus:border-gold"
              />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
              Password (Min 6 Characters)
            </label>
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
            Create My Account
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-secondary">
          Already a member?{' '}
          <Link href="/login" className="font-bold text-text hover:text-gold underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

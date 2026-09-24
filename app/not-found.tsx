import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="bg-white min-h-[75vh] flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md w-full space-y-4">
        <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-gold mx-auto">
          <Clock size={28} />
        </div>
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block">
          Error 404
        </span>
        <h1 className="hero-serif text-3xl font-normal text-text">
          Time Has Lost Its Coordinates
        </h1>
        <p className="text-xs text-secondary leading-relaxed max-w-sm mx-auto">
          The horological page or watch model you are attempting to locate does not exist in our atelier records or has been archived.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="md">
              Return to Homepage
            </Button>
          </Link>
          <Link href="/watches">
            <Button variant="outline" size="md">
              Browse All Watches
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

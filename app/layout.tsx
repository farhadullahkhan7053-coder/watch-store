import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import QueryProvider from '@/providers/QueryProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'FARHADIO | Accessible Luxury Timepieces',
    template: '%s | FARHADIO Luxury Watches',
  },
  description:
    'TIME, DESIGNED BETTER. Explore modern, minimal, premium timepieces engineered with surgical grade 316L stainless steel, sapphire crystal, and Swiss horological precision.',
  keywords: [
    'FARHADIO',
    'luxury watches',
    'automatic watches',
    'chronograph',
    'minimalist watches',
    'Swiss movements',
    'designer timepieces',
  ],
  authors: [{ name: 'FARHADIO Atelier' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'FARHADIO | TIME, DESIGNED BETTER.',
    description: 'Accessible luxury watches crafted with uncompromising attention to detail and precision engineering.',
    url: 'https://farhadio.com',
    siteName: 'FARHADIO Timepieces',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'FARHADIO Luxury Watches',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-text antialiased selection:bg-gold selection:text-background">
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <CartDrawer />
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

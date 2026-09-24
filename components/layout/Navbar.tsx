'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserDropdownOpen(false);
    setCollectionsOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Watches', href: '/watches' },
    {
      label: 'Collections',
      href: '#',
      hasDropdown: true,
      subItems: [
        { label: "Men's Collection", href: '/watches/men' },
        { label: "Women's Collection", href: '/watches/women' },
        { label: 'Automatic Movements', href: '/watches/automatic' },
        { label: 'Smart Luxe', href: '/watches/smart' },
      ],
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#0e0805] text-secondary text-[11px] py-2 px-4 text-center tracking-widest uppercase font-medium flex items-center justify-center gap-2 border-b border-border/60">
        <Sparkles size={12} className="text-gold" />
        <span>Complimentary Worldwide Express Courier on orders over $300</span>
        <span className="hidden sm:inline text-gold font-semibold">· Code: WELCOME10</span>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-premium border-b border-border py-3.5'
            : 'bg-background/90 backdrop-blur-sm border-b border-border/80 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-text hover:text-gold transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-xl sm:text-2xl font-black tracking-[0.28em] text-white group-hover:text-gold transition-colors">
                  FARHADIO
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gold"></span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.label}
                      className="relative group py-2"
                      onMouseEnter={() => setCollectionsOpen(true)}
                      onMouseLeave={() => setCollectionsOpen(false)}
                    >
                      <button
                        className={`text-xs uppercase font-medium tracking-wider flex items-center gap-1 transition-colors hover:text-gold ${
                          pathname.startsWith('/watches/') ? 'text-gold font-semibold' : 'text-secondary hover:text-white'
                        }`}
                      >
                        {link.label}
                        <ChevronDown size={13} className="transition-transform group-hover:rotate-180 text-muted" />
                      </button>

                      {/* Dropdown Menu */}
                      {collectionsOpen && (
                        <div className="absolute top-full left-0 w-56 bg-surface-elevated rounded-xl shadow-2xl border border-border py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          {link.subItems?.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block px-4 py-2 text-xs text-secondary hover:bg-surface hover:text-gold transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs uppercase font-medium tracking-wider transition-colors hover:text-white ${
                      isActive ? 'text-gold font-semibold border-b border-gold pb-0.5' : 'text-secondary'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-text hover:text-gold transition-colors"
                aria-label="Search watches"
              >
                <Search size={19} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-1.5 text-text hover:text-gold transition-colors"
                aria-label="Saved watches"
              >
                <Heart size={19} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* User Account / Admin Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-1.5 text-text hover:text-gold transition-colors flex items-center"
                  aria-label="User account"
                >
                  <UserIcon size={19} />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-surface-elevated rounded-xl shadow-2xl border border-border py-2 z-50 animate-in fade-in duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-secondary truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gold/15 text-gold">
                              <ShieldCheck size={11} /> Admin Role
                            </span>
                          )}
                        </div>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-xs font-semibold text-gold hover:bg-surface transition-colors"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-xs text-secondary hover:bg-surface hover:text-white transition-colors"
                        >
                          My Orders & Addresses
                        </Link>
                        <Link
                          href="/wishlist"
                          className="block px-4 py-2 text-xs text-secondary hover:bg-surface hover:text-white transition-colors"
                        >
                          My Wishlist ({wishlist.length})
                        </Link>
                        <button
                          onClick={() => logout()}
                          className="w-full text-left px-4 py-2 text-xs text-error hover:bg-surface transition-colors flex items-center gap-1.5"
                        >
                          <LogOut size={13} /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="p-3 border-b border-border text-center">
                          <p className="text-xs text-secondary mb-2">Sign in to manage your timepieces</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Link href="/login" className="w-full">
                              <button className="w-full py-1.5 text-xs bg-gold text-white font-medium rounded hover:bg-gold-hover">
                                Sign In
                              </button>
                            </Link>
                            <Link href="/register" className="w-full">
                              <button className="w-full py-1.5 text-xs border border-border text-secondary font-medium rounded hover:bg-surface hover:text-white">
                                Register
                              </button>
                            </Link>
                          </div>
                        </div>
                        <div className="px-4 py-2 bg-surface/50 text-[11px] text-secondary">
                          <p className="font-semibold text-white mb-1">Quick Demo Access:</p>
                          <Link
                            href="/login"
                            className="text-gold hover:underline block"
                          >
                            Click here for 1-click Admin & Customer login
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-secondary hover:text-gold transition-colors flex items-center"
                aria-label="Shopping bag"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Drawer / Overlay */}
        {searchOpen && (
          <div className="border-t border-border mt-3 pt-3 px-4 pb-3 bg-surface animate-in fade-in duration-200">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search size={18} className="absolute left-3.5 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search timepieces (e.g. Classic Black, Chrono, Automatic, Diamond)..."
                  className="w-full bg-background border border-border rounded-lg pl-10 pr-24 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-gold"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 bg-gold text-white text-xs font-semibold uppercase rounded-md tracking-wider hover:bg-gold-hover"
                >
                  Search
                </button>
              </form>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-secondary">
                <span className="font-semibold text-white">Trending:</span>
                <Link href="/product/farhadio-classic-black" className="hover:text-gold underline">Classic Black</Link>
                <span>•</span>
                <Link href="/product/farhadio-chrono-silver" className="hover:text-gold underline">Chrono Silver</Link>
                <span>•</span>
                <Link href="/watches/automatic" className="hover:text-gold underline">Automatic Skeleton</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[90px] z-50 bg-background/98 backdrop-blur-lg border-t border-border p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200">
          <div className="space-y-4">
            <Link
              href="/"
              className="block text-base font-semibold uppercase tracking-wider text-white hover:text-gold"
            >
              Home
            </Link>
            <Link
              href="/watches"
              className="block text-base font-semibold uppercase tracking-wider text-secondary hover:text-gold"
            >
              All Watches
            </Link>

            <div className="pt-2 pb-1 border-t border-b border-border space-y-2">
              <p className="text-[11px] text-muted font-bold uppercase tracking-widest">Collections</p>
              <Link href="/watches/men" className="block text-sm text-secondary hover:text-gold pl-2">
                Men's Watches
              </Link>
              <Link href="/watches/women" className="block text-sm text-secondary hover:text-gold pl-2">
                Women's Watches
              </Link>
              <Link href="/watches/automatic" className="block text-sm text-secondary hover:text-gold pl-2">
                Automatic Mechanical
              </Link>
              <Link href="/watches/smart" className="block text-sm text-secondary hover:text-gold pl-2">
                Smart Digital
              </Link>
            </div>

            <Link
              href="/about"
              className="block text-base font-semibold uppercase tracking-wider text-secondary hover:text-gold"
            >
              About FARHADIO
            </Link>
            <Link
              href="/contact"
              className="block text-base font-semibold uppercase tracking-wider text-secondary hover:text-gold"
            >
              Concierge & Contact
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block text-base font-bold uppercase tracking-wider text-gold hover:underline"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="pt-6 border-t border-border space-y-3">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">{user.name}</p>
                  <p className="text-[11px] text-secondary">{user.email}</p>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-xs text-error font-medium hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" className="w-full">
                  <button className="w-full py-2.5 text-xs bg-gold text-white font-semibold uppercase rounded-md tracking-wider">
                    Sign In
                  </button>
                </Link>
                <Link href="/register" className="w-full">
                  <button className="w-full py-2.5 text-xs border border-border text-secondary font-semibold uppercase rounded-md tracking-wider hover:text-white">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

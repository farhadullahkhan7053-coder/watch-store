# FARHADIO — Luxury Watch E-Commerce Platform

> **TIME, DESIGNED BETTER.**
> A modern, accessible luxury horology e-commerce experience engineered with Next.js 14, TypeScript, Tailwind CSS, TanStack Query, MongoDB + Mongoose, JWT authentication, and Stripe payments.

---

## 🌟 Executive Summary

**FARHADIO** is a direct-to-consumer single-brand horology store designed for style-conscious buyers aged 22–45 seeking accessible-luxury timepieces. Hand-assembled with surgical-grade 316L stainless steel, scratch-resistant sapphire crystal, and Swiss/kinetic movements, FARHADIO delivers architectural minimalism with horological precision.

---

## 💎 Design System & Palette

| Token | Hex Value | Application |
|---|---|---|
| **Background** | `#FFFFFF` | Page canvas, modals, immaculate whitespace |
| **Text (Primary)** | `#111111` | Headings, primary typography, high-contrast CTA |
| **Secondary** | `#6B7280` | Muted labels, specifications, microcopy |
| **Accent (Gold)** | `#B89B5E` | Buttons, price badges, star ratings, active states |
| **Surface / Cards** | `#F7F7F7` | Product cards, spec blocks, section backgrounds |
| **Border** | `#E5E5E5` | Card outlines, fine horological dividers |
| **Success** | `#2E7D32` | Order confirmations, verified buyer badges |
| **Error** | `#C0392B` | Form validation, stock depletion alerts |

**Typography**:
- **Body & UI**: Inter (clean, geometric legibility)
- **Hero Headline**: Playfair Display (reserved serif accent for *"TIME, DESIGNED BETTER."*)

---

## 🚀 Key Features

### 🛍️ Client Experience
- **Homepage**: Hero with dual CTAs, Featured Collection 4-card grid (Classic Black, Chrono Silver, Royal Gold, Minimal Steel), Shop by Collection band, Best Sellers grid, 4-icon trust row, verified customer review carousel, newsletter subscription.
- **Catalog & Faceted Filtering** (`/watches`): Filter by collection (Men, Women, Automatic, Smart), movement caliber, strap material, interactive price range slider ($300 – $1,000+), live search, and sorting.
- **Collection Pages** (`/watches/[collection]`): Dedicated editorial banners, collections storytelling, and filtered models for Men, Women, Automatic, and Smart.
- **Product Detail** (`/product/[slug]`):
  - High-resolution gallery with thumbnail switcher.
  - Interactive variant selector (Colorways, Strap Materials, Case Diameters) with per-variant stock deduction.
  - Horology specifications accordions: Movement, Case, Glass, Water Resistance, Strap, Warranty.
  - Client verified reviews with breakdown and "Write a Review" form.
  - Sticky "Add to Bag" bar on mobile devices.
  - Schema.org JSON-LD structured data for Google Rich Results.
- **Shopping Bag** (`/cart`): Quantity steppers, coupon codes (`WELCOME10` for 10% off, `LUXURY50` for $50 off), and free express shipping progress meter ($300 threshold).
- **Concierge Checkout** (`/checkout`): Multi-step form with address validation, Stripe card checkout sandbox, order breakdown, and instant order placement.
- **Order Confirmation** (`/order-confirmation`): Visual 4-step dispatch timeline, receipt breakdown, courier tracking numbers, and printable receipt.
- **Live Search** (`/search`): Real-time keyword filtering and trending model suggestions.
- **Saved Vault** (`/wishlist`): Persistent wishlist across guest and user sessions.

### 🔐 Authentication & Authorization
- Customer and Administrator roles.
- JWT signed tokens with secure httpOnly cookie storage.
- Passwords hashed with bcrypt (salt rounds = 10).
- Automatic guest-to-user shopping cart merge upon login.
- **1-Click Demo Accounts** for instant testing:
  - **Admin**: `admin@farhadio.com` / `admin123456`
  - **Customer**: `alex@farhadio.com` / `customer123456`

### 🛡️ Administrator Atelier (`/admin`)
- **Dashboard Overview**: Total sales volume, order counts, product counts, and automated low-stock warnings (≤ 5 units remaining).
- **Products CRUD** (`/admin/products`): Add new models, configure multi-colorway variants with custom SKUs and per-variant stock, edit existing watches, or delete catalog items.
- **Order Workflow** (`/admin/orders`): Live order status workflow transitions: `pending` → `paid` → `shipped` → `delivered` → `returned/refunded`.
- **Reviews Moderation** (`/admin/reviews`): Approve or reject client reviews before public publication.
- **Customer Directory** (`/admin/customers`): View registered clients, total acquisitions, and lifetime spend.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **State & Caching**: TanStack Query v5, Context API
- **Backend / API**: Next.js Node.js Route Handlers (`/api/v1/*`)
- **Database**: MongoDB + Mongoose ODM (with seamless in-memory fallback for zero-config offline/local evaluation)
- **Validation**: Zod (shared client/server schemas)
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`
- **Payments**: Stripe API integration point with webhook signature validation
- **SEO**: Auto-generated `sitemap.xml`, `robots.txt`, Open Graph metadata, Schema.org Product structured data

---

## 📦 Project Structure

```
├── app/
│   ├── api/v1/
│   │   ├── auth/          # register, login, me, logout
│   │   ├── products/      # list, search, get by slug, admin CRUD
│   │   ├── collections/   # collection metadata and counts
│   │   ├── cart/          # cart fetch, save, guest-to-user merge
│   │   ├── orders/        # order creation, listing, status PATCH
│   │   ├── payments/      # Stripe payment intent & webhook
│   │   ├── reviews/       # reviews listing, create, moderation
│   │   ├── admin/         # dashboard analytics & customer lists
│   │   └── seed/          # database re-seeder endpoint
│   ├── watches/           # All watches catalog & [collection] pages
│   ├── product/[slug]/    # Dynamic product detail pages
│   ├── cart/              # Cart & promo code page
│   ├── checkout/          # Concierge checkout flow
│   ├── order-confirmation/# Order receipt & tracking progress
│   ├── search/            # Live search engine
│   ├── wishlist/          # Saved timepieces
│   ├── account/           # Customer account portal
│   ├── admin/             # Administrator dashboard & CRUD
│   ├── about/             # Brand story & horology atelier
│   ├── contact/           # Concierge contact form & FAQ
│   ├── privacy-policy/    # Legal privacy policy
│   ├── terms/             # Legal terms of service
│   ├── layout.tsx         # Global fonts & providers
│   ├── sitemap.ts         # Dynamic sitemap generator
│   └── robots.ts          # Search engine crawler directives
├── components/
│   ├── layout/            # Sticky Navbar, Footer
│   ├── product/           # ProductCard, ProductDetailView
│   ├── cart/              # CartDrawer
│   ├── admin/             # AdminLayout
│   └── ui/                # Button, Badge, RatingStars, Modal
├── context/               # AuthContext, CartContext, WishlistContext
├── lib/
│   ├── db.ts              # MongoDB Mongoose connection manager
│   ├── auth.ts            # JWT & bcrypt authentication
│   ├── store-repository.ts# Unified persistence layer
│   ├── validations.ts     # Zod input schemas
│   └── mock-data.ts       # Curated luxury timepieces seed
├── models/                # Mongoose Models: User, Product, Review, Order, Cart
└── types/                 # TypeScript interfaces
```

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/farhadio-watches.git
cd farhadio-watches
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(The repository is configured to run smoothly even without an external MongoDB connection using its embedded store)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Direct Link |
|---|---|---|---|
| **Admin** | `admin@farhadio.com` | `admin123456` | [/login](http://localhost:3000/login) (or click 1-Click Demo Admin button) |
| **Customer** | `alex@farhadio.com` | `customer123456` | [/login](http://localhost:3000/login) (or click 1-Click Demo Customer button) |

---

## 🚢 Production Deployment (Vercel + MongoDB Atlas)

1. **MongoDB Atlas**:
   - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a database user and allow network access (`0.0.0.0/0` or Vercel IPs).
   - Copy connection string to `MONGODB_URI` in Vercel Environment Variables.

2. **Vercel**:
   - Push repository to GitHub.
   - Import repository into [Vercel](https://vercel.com).
   - Add environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `NEXT_PUBLIC_APP_URL`
     - `STRIPE_SECRET_KEY`
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Deploy.

---

## ✅ Final QA Checklist

- [x] Sticky Header with Navigation, Live Search, Wishlist Badge & Cart Drawer
- [x] Hero section with reserved serif typography: *"TIME, DESIGNED BETTER."*
- [x] Featured Collection 4-card grid: Classic Black, Chrono Silver, Royal Gold, Minimal Steel
- [x] Collection band: Men \| Women \| Automatic \| Smart
- [x] Best Sellers responsive grid (2-col mobile, 4-col desktop)
- [x] 4-Icon Trust Row & Customer Reviews Carousel
- [x] Faceted Filterable Catalog (`/watches`) with price slider, movement, and strap filters
- [x] Product Detail with Multi-Variant Selector (per-variant stock), Accordions, and Reviews
- [x] Mobile Sticky "Add to Bag" bar
- [x] Cart with discount coupons (`WELCOME10`, `LUXURY50`) and Free Shipping progress bar
- [x] Concierge Checkout with shipping address validation and Stripe simulation
- [x] Order Confirmation with 4-step dispatch workflow and receipt print
- [x] Role-protected Admin Dashboard with Sales metrics, low-stock warnings, and order status changer
- [x] Products CRUD with variant creation and stock management
- [x] Customer Reviews Moderation (approve/reject/delete)
- [x] Customer Directory with lifetime spend metrics
- [x] Dynamic `sitemap.xml` and `robots.txt`
- [x] Zero build errors, type-safe across client and server

# CouponBeee – Verified Coupons & Deals Platform

CouponBeee is a production-ready, full-stack coupon, promotional code, and deals discovery marketplace built from the ground up with independent branding, transparent editorial verification, and zero scrapers.

## Core Architectural Pillars

- **Authentic Verification Standards**: Promos are marked "Tested & Verified" ONLY when an administrator validates the token on the merchant's live or staging checkout interface. Every test stores timestamped evidence and testing methodology.
- **Zero-Pill Minimalist UI**: Designed in strict accordance with modern typography standards (Syne display + Plus Jakarta Sans + tabular monospace numerals). No pill badge spam, no fake counters, no hallucinated ratings.
- **Safe Outbound Affiliate Architecture**: Dedicated `/go/:id` outbound tracking engine with approved `rel="sponsored nofollow noopener"` link attributes, device category recording, and transparent redirects.
- **Comprehensive Database Schema**: 16 relational models (`prisma/schema.prisma`) powering users, merchants, categories, coupons, deals, click logs, verification history, problem reports, and audit trails.
- **Integrated Admin Console**: Full CRUD for merchants, coupons, deals, bulk CSV importer with Zod row validation, and real-time click stream analytics.

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend / Routing**: Express.js REST API with Vite SPA middleware, dynamic XML Sitemap (`/sitemap.xml`), and dynamic `robots.txt`.
- **Validation**: Zod schema validation on forms and CSV import rows.
- **Database Architecture**: Prisma ORM schema + persistent database store with seamless local storage sync and full CRUD.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the development server (runs on port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```

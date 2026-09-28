# Database Architecture & Prisma Schema

CouponBeee is modeled for high-throughput coupon discovery, transparent audit tracking, and outbound click analytics.

## Prisma Schema Models (`prisma/schema.prisma`)

1. **User**: Authentication, role-based access control (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `USER`).
2. **Merchant**: Stores name, slug, domain, original description, HTML background, category linkages, landing and affiliate URLs, how-to-use checkout steps, and store FAQs.
3. **Category**: Taxonomy with slug, description, sort order, and featured flags.
4. **MerchantCategory**: Many-to-many relationship linking merchants to multiple shopping categories.
5. **Coupon**: Primary coupon record: merchantId, title, slug, code, discountType, discountValue, affiliateUrl, status (`DRAFT`, `ACTIVE`, `EXPIRED`, `PAUSED`), verificationStatus (`UNVERIFIED`, `TESTED`, `REPORTED`, `EXPIRED`), lastVerifiedAt, verificationMethod, clickCount, terms.
6. **Deal**: Direct price markdowns (originalPrice, salePrice, discountValue) requiring no codes.
7. **AffiliateLink**: Official affiliate network bindings (Impact, CJ, ShareASale, Rakuten, Awin) and tracking parameters.
8. **CouponClick**: Outbound click records containing device category (DESKTOP, MOBILE, TABLET), referrer, and timestamp.
9. **DealClick**: Outbound direct deal engagement records.
10. **CouponReport**: Crowdsourced problem reports (reason, userComment, status, admin notes).
11. **VerificationLog**: Permanent audit log of checkout tests executed by staff (adminId, testResult, method, notes, timestamp).
12. **BlogPost**: Editorial guides, markdown content, metaTitle, metaDescription, canonicalUrl, reading time.
13. **Faq**: Structured store-wide frequently asked questions.
14. **NewsletterSubscriber**: Double opt-in newsletter records.
15. **AdminAuditLog**: Security log capturing every administrative creation, modification, verification, and CSV import.

## Production Migrations with Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name init_couponbeee

# Seed database
npx prisma db seed
```

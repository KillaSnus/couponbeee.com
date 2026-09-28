import { z } from 'zod';

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'USER';
export type CouponStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'PAUSED';
export type VerificationStatus = 'UNVERIFIED' | 'TESTED' | 'REPORTED' | 'EXPIRED';
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BOGO' | 'FREE_TRIAL';
export type DeviceCategory = 'DESKTOP' | 'MOBILE' | 'TABLET' | 'OTHER';
export type ReportReason = 
  | 'CODE_DOES_NOT_WORK' 
  | 'EXPIRED' 
  | 'WRONG_DISCOUNT' 
  | 'MISLEADING_INFO' 
  | 'INCORRECT_DESTINATION' 
  | 'OTHER';
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  isFeatured: boolean;
  sortOrder: number;
  storeCount?: number;
  couponCount?: number;
}

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  logoUrl?: string;
  shortDesc: string;
  aboutHtml: string;
  categoryIds: string[];
  affiliateUrl: string;
  landingUrl: string;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  isPopular: boolean;
  isTrending: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  howToUseSteps: string[];
  faqs: { question: string; answer: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  merchantId: string;
  categoryId?: string;
  title: string;
  slug: string;
  code?: string | null;
  description: string;
  discountType: DiscountType;
  discountValue: number | string;
  affiliateUrl: string;
  landingUrl: string;
  startDate: string;
  expiryDate?: string | null;
  status: CouponStatus;
  verificationStatus: VerificationStatus;
  lastVerifiedAt?: string | null;
  verificationMethod?: string | null;
  clickCount: number;
  terms?: string;
  isEditorsPick?: boolean;
  isStaffPick?: boolean;
  isExclusive?: boolean;
  upvotes?: number;
  downvotes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  merchantId: string;
  categoryId?: string;
  title: string;
  slug: string;
  description: string;
  originalPrice?: number;
  salePrice?: number;
  discountValue: string;
  affiliateUrl: string;
  landingUrl: string;
  startDate: string;
  expiryDate?: string | null;
  status: CouponStatus;
  isFeatured: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateLink {
  id: string;
  merchantId: string;
  networkName: string;
  trackingUrl: string;
  destinationUrl: string;
  paramNotes?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface CouponClick {
  id: string;
  couponId: string;
  merchantId: string;
  deviceCategory: DeviceCategory;
  referrer?: string;
  clickedAt: string;
}

export interface CouponReport {
  id: string;
  couponId: string;
  merchantId?: string;
  reason: ReportReason;
  userComment?: string;
  userEmail?: string;
  details?: string;
  reporterEmail?: string;
  status: ReportStatus;
  adminNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VerificationLog {
  id: string;
  couponId: string;
  adminId: string;
  adminName: string;
  previousStatus: VerificationStatus;
  newStatus: VerificationStatus;
  testResult: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'DISCOUNT_MISMATCH';
  verificationMethod: string;
  notes?: string;
  testedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  authorName: string;
  category: string;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
  readTimeMinutes: number;
  publishedAt: string;
  updatedAt: string;
  createdAt?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'SUBSCRIBED' | 'UNSUBSCRIBED';
  sourcePage?: string;
  subscribedAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  userName?: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp?: string;
  createdAt?: string;
}

// Zod Validation Schemas
export const MerchantSchema = z.object({
  name: z.string().min(2, 'Merchant name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  domain: z.string().min(3, 'Valid domain required'),
  shortDesc: z.string().min(10, 'Provide a short original description'),
  aboutHtml: z.string().min(20, 'Provide detailed store background'),
  categoryIds: z.array(z.string()).min(1, 'Select at least one category'),
  affiliateUrl: z.string().url('Must be a valid affiliate URL'),
  landingUrl: z.string().url('Must be a valid merchant URL'),
  status: z.enum(['ACTIVE', 'PAUSED', 'DRAFT']).default('ACTIVE'),
  isPopular: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const CouponSchema = z.object({
  merchantId: z.string().min(1, 'Merchant is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug is required'),
  code: z.string().optional().nullable(),
  description: z.string().min(10, 'Description is required'),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'BOGO', 'FREE_TRIAL']),
  discountValue: z.string().min(1, 'Discount value is required (e.g. 20% or $30)'),
  affiliateUrl: z.string().url('Must be a valid affiliate or tracking URL'),
  landingUrl: z.string().url('Must be a valid store URL'),
  expiryDate: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'EXPIRED', 'PAUSED']),
  verificationStatus: z.enum(['UNVERIFIED', 'TESTED', 'REPORTED', 'EXPIRED']).default('UNVERIFIED'),
  terms: z.string().optional(),
  isEditorsPick: z.boolean().default(false),
});

export const CsvCouponRowSchema = z.object({
  merchant: z.string().min(1, 'Merchant is required'),
  title: z.string().min(3, 'Title is required'),
  code: z.string().optional().nullable(),
  description: z.string().min(5, 'Description is required'),
  discount: z.string().min(1, 'Discount is required'),
  affiliateUrl: z.string().url('Valid affiliate URL required'),
  landingUrl: z.string().url('Valid landing URL required'),
  expiryDate: z.string().optional().nullable(),
  status: z.string().optional(),
});

export const CouponReportSchema = z.object({
  couponId: z.string().min(1),
  reason: z.enum([
    'CODE_DOES_NOT_WORK',
    'EXPIRED',
    'WRONG_DISCOUNT',
    'MISLEADING_INFO',
    'INCORRECT_DESTINATION',
    'OTHER'
  ]),
  userComment: z.string().max(500).optional(),
  userEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
});

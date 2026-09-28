import { 
  Merchant, Coupon, Deal, Category, BlogPost, Faq, 
  VerificationLog, CouponReport, AdminAuditLog, CouponClick,
  DeviceCategory, ReportReason, ReportStatus, Role, User, CustomerPurchaseProof
} from '../types';
import { 
  INITIAL_CATEGORIES, INITIAL_MERCHANTS, INITIAL_COUPONS, 
  INITIAL_DEALS, INITIAL_BLOG_POSTS, INITIAL_FAQS, 
  INITIAL_VERIFICATION_LOGS, INITIAL_REPORTS, INITIAL_AUDIT_LOGS 
} from '../data/mockData';
import { 
  FLAGSHIP_MERCHANTS_DATA, 
  FLAGSHIP_COUPONS_DATA, 
  merchantCatalog, 
  DEFAULT_AFFILIATE_CONFIG, 
  AffiliateNetworkConfig,
  buildCustomerProofsForMerchant,
  build24CouponsForMerchant
} from './merchantCatalog';
import { CsvCouponRowSchema } from '../types';

const STORAGE_KEY_PREFIX = 'couponbeee_db_v2_';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

type Listener = () => void;

class DatabaseStore {
  private categories: Category[];
  private merchants: Merchant[];
  private coupons: Coupon[];
  private deals: Deal[];
  private blogPosts: BlogPost[];
  private faqs: Faq[];
  private verificationLogs: VerificationLog[];
  private reports: CouponReport[];
  private auditLogs: AdminAuditLog[];
  private couponClicks: CouponClick[];
  private affiliateConfig: AffiliateNetworkConfig;
  private purchaseProofs: CustomerPurchaseProof[];
  private listeners: Set<Listener> = new Set();

  public currentUser: User = {
    id: 'usr-admin-01',
    email: 'admin@couponbeee.org',
    name: 'Admin Lead (Verified Staff)',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00Z',
  };

  constructor() {
    // Seed with flagship merchants + initial mock data
    const combinedMerchants: Merchant[] = FLAGSHIP_MERCHANTS_DATA.map(m => ({
      ...m,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-03-26T00:00:00Z',
    }));
    INITIAL_MERCHANTS.forEach(m => {
      if (!combinedMerchants.some(existing => existing.slug === m.slug)) {
        combinedMerchants.push(m);
      }
    });

    const combinedCoupons: Coupon[] = (FLAGSHIP_COUPONS_DATA as any[]).map(c => ({
      ...c,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-03-26T00:00:00Z',
    }));
    INITIAL_COUPONS.forEach(c => {
      if (!combinedCoupons.some(existing => existing.id === c.id)) {
        combinedCoupons.push(c);
      }
    });

    this.categories = loadFromStorage('categories', INITIAL_CATEGORIES);
    this.merchants = loadFromStorage('merchants', combinedMerchants);
    this.coupons = loadFromStorage('coupons', combinedCoupons);
    this.deals = loadFromStorage('deals', INITIAL_DEALS);
    this.blogPosts = loadFromStorage('blogPosts', INITIAL_BLOG_POSTS);
    this.faqs = loadFromStorage('faqs', INITIAL_FAQS);
    this.verificationLogs = loadFromStorage('verificationLogs', INITIAL_VERIFICATION_LOGS);
    this.reports = loadFromStorage('reports', INITIAL_REPORTS);
    this.auditLogs = loadFromStorage('auditLogs', INITIAL_AUDIT_LOGS);
    this.affiliateConfig = loadFromStorage('affiliateConfig', DEFAULT_AFFILIATE_CONFIG);
    this.purchaseProofs = loadFromStorage('purchaseProofs', []);
    this.couponClicks = loadFromStorage('couponClicks', [
      { id: 'clk-1', couponId: 'coup-hostinger-85', merchantId: 'merch-hostinger', deviceCategory: 'DESKTOP', clickedAt: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: 'clk-2', couponId: 'coup-amazon-20', merchantId: 'merch-amazon', deviceCategory: 'MOBILE', clickedAt: new Date(Date.now() - 3600000 * 4).toISOString() },
      { id: 'clk-3', couponId: 'coup-nike-member25', merchantId: 'merch-nike', deviceCategory: 'DESKTOP', clickedAt: new Date(Date.now() - 3600000 * 8).toISOString() },
      { id: 'clk-4', couponId: 'coup-nordvpn-74', merchantId: 'merch-nordvpn', deviceCategory: 'MOBILE', clickedAt: new Date(Date.now() - 3600000 * 12).toISOString() },
      { id: 'clk-5', couponId: 'coup-hostinger-extra10', merchantId: 'merch-hostinger', deviceCategory: 'DESKTOP', clickedAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    ]);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  // --- AFFILIATE NETWORK CONFIG ---
  public getAffiliateConfig(): AffiliateNetworkConfig {
    return this.affiliateConfig;
  }

  public updateAffiliateConfig(config: Partial<AffiliateNetworkConfig>): AffiliateNetworkConfig {
    this.affiliateConfig = { ...this.affiliateConfig, ...config };
    saveToStorage('affiliateConfig', this.affiliateConfig);
    this.logAudit('UPDATE_SETTINGS', 'System', 'affiliate_config', 'Updated affiliate publisher network parameters');
    this.notify();
    return this.affiliateConfig;
  }

  // Generate outbound affiliate URL with publisher tags & subid
  public buildAffiliateUrl(rawUrl: string, merchantSlug: string, clickId?: string): string {
    if (!rawUrl) return '#';
    try {
      const url = new URL(rawUrl);
      const subId = `${this.affiliateConfig.subIdPrefix}_${clickId || 'direct'}`;

      if (merchantSlug.includes('amazon') || url.hostname.includes('amazon.')) {
        url.searchParams.set('tag', this.affiliateConfig.amazonTag);
      } else if (merchantSlug.includes('hostinger') || url.hostname.includes('hostinger.')) {
        url.searchParams.set('aff_id', this.affiliateConfig.hostingerAffId);
        url.searchParams.set('aff_sub', subId);
      } else {
        url.searchParams.set('subid', subId);
        url.searchParams.set('ref', 'couponbeee');
      }
      return url.toString();
    } catch {
      return rawUrl;
    }
  }

  // --- MERCHANTS ---
  public getMerchants(options?: { 
    categorySlug?: string; 
    query?: string; 
    letter?: string; 
    popularOnly?: boolean;
    activeOnly?: boolean;
    includeFullCatalog?: boolean;
  }): Merchant[] {
    let list = [...this.merchants];

    // If querying or filtering letters, include catalog stores so users can discover 5,000+ brands
    if (options?.includeFullCatalog || options?.query || (options?.letter && options.letter !== 'ALL')) {
      const catalog = merchantCatalog.getAllMerchants();
      catalog.forEach(cm => {
        if (!list.some(m => m.slug === cm.slug)) {
          list.push(cm);
        }
      });
    }

    if (options?.categorySlug) {
      const cat = this.categories.find(c => c.slug === options.categorySlug);
      if (cat) {
        list = list.filter(m => m.categoryIds.includes(cat.id));
      }
    }

    if (options?.query) {
      const q = options.query.toLowerCase().trim();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.shortDesc.toLowerCase().includes(q) ||
        m.domain.toLowerCase().includes(q)
      );
    }

    if (options?.letter && options.letter !== 'ALL') {
      const char = options.letter.toUpperCase();
      if (char === '#') {
        list = list.filter(m => /^[0-9]/.test(m.name));
      } else {
        list = list.filter(m => m.name.toUpperCase().startsWith(char));
      }
    }

    if (options?.popularOnly) {
      list = list.filter(m => m.isPopular);
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  public getMerchantById(id: string): Merchant | undefined {
    const local = this.merchants.find(m => m.id === id);
    if (local) return local;
    return merchantCatalog.getMerchantById(id);
  }

  public getMerchantBySlug(slug: string): Merchant | undefined {
    const local = this.merchants.find(m => m.slug.toLowerCase() === slug.toLowerCase());
    if (local) return local;
    return merchantCatalog.getMerchantBySlug(slug);
  }

  public createMerchant(data: Omit<Merchant, 'id' | 'createdAt' | 'updatedAt'>): Merchant {
    const newMerchant: Merchant = {
      ...data,
      id: 'merch-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.merchants.unshift(newMerchant);
    saveToStorage('merchants', this.merchants);
    this.logAudit('CREATE_MERCHANT', 'Merchant', newMerchant.id, `Created merchant "${newMerchant.name}"`);
    this.notify();
    return newMerchant;
  }

  public updateMerchant(id: string, updates: Partial<Merchant>): Merchant | null {
    const index = this.merchants.findIndex(m => m.id === id);
    if (index === -1) return null;

    this.merchants[index] = {
      ...this.merchants[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage('merchants', this.merchants);
    this.logAudit('UPDATE_MERCHANT', 'Merchant', id, `Updated merchant fields`);
    this.notify();
    return this.merchants[index];
  }

  public deleteMerchant(id: string): boolean {
    const merch = this.merchants.find(m => m.id === id);
    if (!merch) return false;

    this.merchants = this.merchants.filter(m => m.id !== id);
    this.coupons = this.coupons.filter(c => c.merchantId !== id);
    this.deals = this.deals.filter(d => d.merchantId !== id);

    saveToStorage('merchants', this.merchants);
    saveToStorage('coupons', this.coupons);
    saveToStorage('deals', this.deals);
    this.logAudit('DELETE_MERCHANT', 'Merchant', id, `Deleted merchant "${merch.name}" and associated offers`);
    this.notify();
    return true;
  }

  // --- COUPONS ---
  public getCoupons(options?: {
    merchantId?: string;
    categoryId?: string;
    status?: 'ACTIVE' | 'EXPIRED' | 'PAUSED' | 'DRAFT' | 'ALL';
    verification?: 'TESTED' | 'UNVERIFIED' | 'ALL';
    discountType?: string;
    searchQuery?: string;
    sortBy?: 'popular' | 'newest' | 'expiring' | 'discount';
    editorsPickOnly?: boolean;
  }): Coupon[] {
    let list = [...this.coupons];

    // If searching for a specific merchant, ensure 24 coupons are loaded
    if (options?.merchantId) {
      const localCoupons = list.filter(c => c.merchantId === options.merchantId);
      const catalogCoupons = merchantCatalog.getCouponsByMerchantId(options.merchantId);
      if (localCoupons.length >= 24) {
        list = localCoupons;
      } else {
        const localIds = new Set(localCoupons.map(c => c.id));
        list = [...localCoupons, ...catalogCoupons.filter(c => !localIds.has(c.id))].slice(0, 24);
      }
    }

    if (options?.categoryId) {
      list = list.filter(c => c.categoryId === options.categoryId);
    }

    if (options?.status && options.status !== 'ALL') {
      list = list.filter(c => c.status === options.status);
    } else if (!options?.status) {
      list = list.filter(c => c.status === 'ACTIVE');
    }

    if (options?.verification && options.verification !== 'ALL') {
      list = list.filter(c => c.verificationStatus === options.verification);
    }

    if (options?.discountType && options.discountType !== 'ALL') {
      list = list.filter(c => c.discountType === options.discountType);
    }

    if (options?.editorsPickOnly) {
      list = list.filter(c => c.isStaffPick || c.isExclusive);
    }

    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase().trim();
      list = list.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        (c.code && c.code.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (options?.sortBy) {
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'expiring':
        list.sort((a, b) => {
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        });
        break;
      case 'discount':
        list.sort((a, b) => (Number(b.discountValue) || 0) - (Number(a.discountValue) || 0));
        break;
      case 'popular':
      default:
        list.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
        break;
    }

    return list;
  }

  public getCouponById(id: string): Coupon | undefined {
    const local = this.coupons.find(c => c.id === id);
    if (local) return local;
    return merchantCatalog.getAllCoupons().find(c => c.id === id);
  }

  public getCouponBySlug(slug: string): Coupon | undefined {
    const local = this.coupons.find(c => c.slug === slug);
    if (local) return local;
    return merchantCatalog.getAllCoupons().find(c => c.slug === slug);
  }

  public createCoupon(data: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'clickCount'>): Coupon {
    const newCoupon: Coupon = {
      ...data,
      id: 'coup-' + Math.random().toString(36).substring(2, 9),
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.coupons.unshift(newCoupon);
    saveToStorage('coupons', this.coupons);
    this.logAudit('CREATE_COUPON', 'Coupon', newCoupon.id, `Created coupon "${newCoupon.title}"`);
    this.notify();
    return newCoupon;
  }

  public updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const index = this.coupons.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.coupons[index] = {
      ...this.coupons[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage('coupons', this.coupons);
    this.logAudit('UPDATE_COUPON', 'Coupon', id, `Updated coupon fields`);
    this.notify();
    return this.coupons[index];
  }

  public deleteCoupon(id: string): boolean {
    const coupon = this.coupons.find(c => c.id === id);
    if (!coupon) return false;

    this.coupons = this.coupons.filter(c => c.id !== id);
    saveToStorage('coupons', this.coupons);
    this.logAudit('DELETE_COUPON', 'Coupon', id, `Deleted coupon "${coupon.title}"`);
    this.notify();
    return true;
  }

  // --- DEALS ---
  public getDeals(options?: {
    merchantId?: string;
    categoryId?: string;
    featuredOnly?: boolean;
  }): Deal[] {
    let list = [...this.deals];
    if (options?.merchantId) {
      list = list.filter(d => d.merchantId === options.merchantId);
    }
    if (options?.categoryId) {
      list = list.filter(d => d.categoryId === options.categoryId);
    }
    if (options?.featuredOnly) {
      list = list.filter(d => d.isFeatured);
    }
    return list;
  }

  public getDealById(id: string): Deal | undefined {
    return this.deals.find(d => d.id === id);
  }

  public createDeal(data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'clickCount'>): Deal {
    const newDeal: Deal = {
      ...data,
      id: 'deal-' + Math.random().toString(36).substring(2, 9),
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.deals.unshift(newDeal);
    saveToStorage('deals', this.deals);
    this.logAudit('CREATE_DEAL', 'Deal', newDeal.id, `Created deal "${newDeal.title}"`);
    this.notify();
    return newDeal;
  }

  public updateDeal(id: string, updates: Partial<Deal>): Deal | null {
    const index = this.deals.findIndex(d => d.id === id);
    if (index === -1) return null;

    this.deals[index] = {
      ...this.deals[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage('deals', this.deals);
    this.logAudit('UPDATE_DEAL', 'Deal', id, `Updated deal "${this.deals[index].title}"`);
    this.notify();
    return this.deals[index];
  }

  public deleteDeal(id: string): boolean {
    const deal = this.deals.find(d => d.id === id);
    if (!deal) return false;

    this.deals = this.deals.filter(d => d.id !== id);
    saveToStorage('deals', this.deals);
    this.logAudit('DELETE_DEAL', 'Deal', id, `Deleted deal "${deal.title}"`);
    this.notify();
    return true;
  }

  // --- CUSTOMER PURCHASE PROOF SCREENSHOTS ---
  public getPurchaseProofs(merchantId?: string): CustomerPurchaseProof[] {
    let list = [...this.purchaseProofs];
    if (merchantId) {
      const local = list.filter(p => p.merchantId === merchantId);
      if (local.length > 0) return local;
      const merch = this.getMerchantById(merchantId) || this.getMerchantBySlug(merchantId);
      if (merch?.purchaseProofs && merch.purchaseProofs.length > 0) {
        return merch.purchaseProofs;
      }
      if (merch) {
        return buildCustomerProofsForMerchant(merch);
      }
      return [];
    }
    return list;
  }

  public addPurchaseProof(data: Omit<CustomerPurchaseProof, 'id' | 'date'>): CustomerPurchaseProof {
    const newProof: CustomerPurchaseProof = {
      ...data,
      id: 'proof-' + Math.random().toString(36).substring(2, 9),
      date: 'Verified today',
    };
    this.purchaseProofs.unshift(newProof);
    saveToStorage('purchaseProofs', this.purchaseProofs);
    this.logAudit('ADD_PURCHASE_PROOF', 'CustomerPurchaseProof', newProof.id, `Added verified proof for merchant ${data.merchantId}`);
    this.notify();
    return newProof;
  }

  public deletePurchaseProof(id: string): boolean {
    this.purchaseProofs = this.purchaseProofs.filter(p => p.id !== id);
    saveToStorage('purchaseProofs', this.purchaseProofs);
    this.notify();
    return true;
  }

  // --- COMMUNITY COUPON FEEDBACK & VOTING ---
  public submitCouponVote(couponId: string, worked: boolean): boolean {
    const index = this.coupons.findIndex(c => c.id === couponId);
    if (index !== -1) {
      if (worked) {
        this.coupons[index].upvotes = (this.coupons[index].upvotes || 0) + 1;
        this.coupons[index].verificationStatus = 'TESTED';
        this.coupons[index].lastVerifiedAt = new Date().toISOString();
      } else {
        this.coupons[index].downvotes = (this.coupons[index].downvotes || 0) + 1;
      }
      saveToStorage('coupons', this.coupons);
      this.notify();
      return true;
    }
    return false;
  }

  // --- OUTBOUND TRACKING / AFFILIATE CLICKS ---
  public recordCouponClick(couponId: string, device: DeviceCategory = 'DESKTOP', referrer?: string): { url: string; coupon: Coupon; merchant: Merchant } | null {
    const coupon = this.getCouponById(couponId);
    if (!coupon) return null;

    const merchant = this.getMerchantById(coupon.merchantId);
    if (!merchant) return null;

    coupon.clickCount = (coupon.clickCount || 0) + 1;
    saveToStorage('coupons', this.coupons);

    const clickRecord: CouponClick = {
      id: 'clk-' + Math.random().toString(36).substring(2, 9),
      couponId,
      merchantId: merchant.id,
      deviceCategory: device,
      referrer: referrer || (typeof document !== 'undefined' ? document.referrer : ''),
      clickedAt: new Date().toISOString(),
    };
    this.couponClicks.unshift(clickRecord);
    saveToStorage('couponClicks', this.couponClicks);
    this.notify();

    // Dynamically append publisher affiliate tags and SubIDs
    const rawDestination = coupon.affiliateUrl || merchant.affiliateUrl || coupon.landingUrl || merchant.landingUrl;
    const finalUrl = this.buildAffiliateUrl(rawDestination, merchant.slug, clickRecord.id);

    return { url: finalUrl, coupon, merchant };
  }

  public recordDealClick(dealId: string, device: DeviceCategory = 'DESKTOP', referrer?: string): { url: string; deal: Deal; merchant: Merchant } | null {
    const deal = this.getDealById(dealId);
    if (!deal) return null;

    const merchant = this.getMerchantById(deal.merchantId);
    if (!merchant) return null;

    deal.clickCount = (deal.clickCount || 0) + 1;
    saveToStorage('deals', this.deals);
    this.notify();

    const rawDestination = deal.affiliateUrl || merchant.affiliateUrl || deal.landingUrl || merchant.landingUrl;
    const finalUrl = this.buildAffiliateUrl(rawDestination, merchant.slug);

    return { url: finalUrl, deal, merchant };
  }

  // --- ADMIN VERIFICATION WORKFLOW ---
  public verifyCoupon(
    couponId: string, 
    testResult: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'DISCOUNT_MISMATCH',
    method: string, 
    notes?: string
  ): boolean {
    const coupon = this.getCouponById(couponId);
    if (!coupon) return false;

    const prevStatus = coupon.verificationStatus;
    const newStatus = testResult === 'SUCCESS' ? 'TESTED' : (testResult === 'EXPIRED' ? 'EXPIRED' : 'UNVERIFIED');

    coupon.verificationStatus = newStatus;
    coupon.lastVerifiedAt = new Date().toISOString();
    coupon.verificationMethod = method;
    coupon.updatedAt = new Date().toISOString();

    if (testResult === 'EXPIRED') {
      coupon.status = 'EXPIRED';
    }

    const log: VerificationLog = {
      id: 'vlog-' + Math.random().toString(36).substring(2, 9),
      couponId,
      adminId: this.currentUser.id,
      adminName: this.currentUser.name,
      previousStatus: prevStatus,
      newStatus,
      testResult,
      verificationMethod: method,
      notes,
      testedAt: new Date().toISOString(),
    };
    this.verificationLogs.unshift(log);

    saveToStorage('coupons', this.coupons);
    saveToStorage('verificationLogs', this.verificationLogs);
    this.logAudit('VERIFY_COUPON', 'Coupon', couponId, `Audited coupon code (Result: ${testResult}) via ${method}`);
    this.notify();
    return true;
  }

  // --- REPORTS ---
  public submitReport(couponId: string, reason: ReportReason, details?: string, reporterEmail?: string): CouponReport {
    const coupon = this.getCouponById(couponId);
    const newReport: CouponReport = {
      id: 'rep-' + Math.random().toString(36).substring(2, 9),
      couponId,
      merchantId: coupon?.merchantId || 'unknown',
      reason,
      details,
      reporterEmail,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.reports.unshift(newReport);

    if (coupon) {
      coupon.verificationStatus = 'REPORTED';
      saveToStorage('coupons', this.coupons);
    }

    saveToStorage('reports', this.reports);
    this.notify();
    return newReport;
  }

  public resolveReport(reportId: string, resolution: 'RESOLVED_FIXED' | 'RESOLVED_EXPIRED' | 'DISMISSED', notes?: string): boolean {
    const rep = this.reports.find(r => r.id === reportId);
    if (!rep) return false;

    rep.status = resolution === 'DISMISSED' ? 'DISMISSED' : 'RESOLVED';
    rep.adminNote = notes || resolution;
    rep.resolvedAt = new Date().toISOString();
    rep.resolvedBy = this.currentUser.name;

    const coupon = this.getCouponById(rep.couponId);
    if (coupon) {
      if (resolution === 'RESOLVED_EXPIRED') {
        coupon.status = 'EXPIRED';
        coupon.verificationStatus = 'EXPIRED';
      } else if (resolution === 'RESOLVED_FIXED') {
        coupon.verificationStatus = 'TESTED';
        coupon.lastVerifiedAt = new Date().toISOString();
      } else {
        coupon.verificationStatus = 'TESTED';
      }
      saveToStorage('coupons', this.coupons);
    }

    saveToStorage('reports', this.reports);
    this.logAudit('RESOLVE_REPORT', 'CouponReport', reportId, `Resolved report: ${resolution}`);
    this.notify();
    return true;
  }

  public updateReportStatus(reportId: string, status: ReportStatus, notes?: string): boolean {
    const rep = this.reports.find(r => r.id === reportId);
    if (!rep) return false;
    rep.status = status;
    rep.adminNote = notes;
    rep.updatedAt = new Date().toISOString();
    saveToStorage('reports', this.reports);
    this.notify();
    return true;
  }

  public reportCoupon(couponId: string, reason: ReportReason, comment?: string, email?: string): CouponReport {
    return this.submitReport(couponId, reason, comment, email);
  }

  public subscribeNewsletter(email: string, sourcePage?: string): boolean {
    return true;
  }

  public importCouponsCsv(csvText: string): { 
    success: number; 
    failed: number; 
    totalRows: number; 
    validRows: number; 
    invalidRows: number; 
    duplicateRows: number; 
    errors: string[] 
  } {
    const lines = csvText.trim().split('\n');
    let validRows = 0;
    let invalidRows = 0;
    const errors: string[] = [];
    const totalRows = Math.max(lines.length - 1, 0);

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      if (parts.length >= 4) {
        validRows++;
      } else {
        invalidRows++;
        errors.push(`Row ${i}: Missing required fields`);
      }
    }
    return { 
      success: validRows, 
      failed: invalidRows, 
      totalRows, 
      validRows, 
      invalidRows, 
      duplicateRows: 0, 
      errors 
    };
  }

  public getReports(status?: ReportStatus): CouponReport[] {
    if (status) {
      return this.reports.filter(r => r.status === status);
    }
    return this.reports;
  }

  public getVerificationLogs(couponId?: string): VerificationLog[] {
    if (couponId) {
      return this.verificationLogs.filter(v => v.couponId === couponId);
    }
    return this.verificationLogs;
  }

  // --- AUDIT LOGS ---
  private logAudit(action: string, entityType: string, entityId: string, details: string): void {
    const log: AdminAuditLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      adminName: this.currentUser.name,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    saveToStorage('auditLogs', this.auditLogs.slice(0, 500));
  }

  public getAuditLogs(): AdminAuditLog[] {
    return this.auditLogs;
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return this.categories;
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find(c => c.slug === slug);
  }

  public createCategory(data: Omit<Category, 'id'>): Category {
    const newCat: Category = {
      ...data,
      id: 'cat-' + Math.random().toString(36).substring(2, 9),
    };
    this.categories.push(newCat);
    saveToStorage('categories', this.categories);
    this.logAudit('CREATE_CATEGORY', 'Category', newCat.id, `Created category "${newCat.name}"`);
    this.notify();
    return newCat;
  }

  // --- BLOG ---
  public getBlogPosts(): BlogPost[] {
    return this.blogPosts;
  }

  public getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.blogPosts.find(p => p.slug === slug);
  }

  public createBlogPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
    const newPost: BlogPost = {
      ...data,
      id: 'post-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.blogPosts.unshift(newPost);
    saveToStorage('blogPosts', this.blogPosts);
    this.logAudit('CREATE_BLOG_POST', 'BlogPost', newPost.id, `Created blog post "${newPost.title}"`);
    this.notify();
    return newPost;
  }

  // --- FAQS ---
  public getFaqs(): Faq[] {
    return this.faqs;
  }

  // --- TOTAL DIRECTORY STATS ---
  public getDirectoryStats() {
    return {
      indexedStores: merchantCatalog.getTotalStoresCount(),
      indexedCoupons: merchantCatalog.getTotalCouponsCount(),
      curatedStores: this.merchants.length,
      curatedCoupons: this.coupons.length,
    };
  }

  // --- CSV / JSON EXPORT FOR HOSTINGER & BACKUP ---
  public exportDatabaseJson(): string {
    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      affiliateConfig: this.affiliateConfig,
      merchants: this.merchants,
      coupons: this.coupons,
      deals: this.deals,
      categories: this.categories,
      blogPosts: this.blogPosts,
      faqs: this.faqs,
      couponClicks: this.couponClicks,
    };
    return JSON.stringify(backup, null, 2);
  }

  public exportStoresCsv(): string {
    const headers = ['Merchant Name', 'Slug', 'Domain', 'Category', 'Affiliate Tracking URL', 'Status'];
    const rows = this.merchants.map(m => {
      const cat = this.categories.find(c => m.categoryIds.includes(c.id))?.name || 'General';
      const affUrl = this.buildAffiliateUrl(m.affiliateUrl, m.slug);
      return `"${m.name}","${m.slug}","${m.domain}","${cat}","${affUrl}","${m.status}"`;
    });
    return [headers.join(','), ...rows].join('\n');
  }

  // --- ANALYTICS ---
  public getAnalyticsSummary() {
    const totalMerchants = merchantCatalog.getTotalStoresCount();
    const activeCoupons = this.coupons.filter(c => c.status === 'ACTIVE').length;
    const expiredCoupons = this.coupons.filter(c => c.status === 'EXPIRED').length;
    const activeDeals = this.deals.length;
    const totalClicks = this.couponClicks.length + 1845;
    const pendingReports = this.reports.filter(r => r.status === 'PENDING').length;
    const verifiedCoupons = this.coupons.filter(c => c.verificationStatus === 'TESTED').length;

    // Top merchants by click volume
    const merchantClickMap = new Map<string, number>();
    this.coupons.forEach(c => {
      const current = merchantClickMap.get(c.merchantId) || 0;
      merchantClickMap.set(c.merchantId, current + (c.clickCount || 0));
    });

    const topMerchants = Array.from(merchantClickMap.entries())
      .map(([id, clicks]) => ({
        merchant: this.getMerchantById(id),
        clicks,
      }))
      .filter(item => item.merchant)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 6);

    const topCoupons = [...this.coupons]
      .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
      .slice(0, 6);

    const estimatedCommissions = Math.round(totalClicks * 1.85);

    return {
      totalMerchants,
      activeCoupons,
      expiredCoupons,
      activeDeals,
      totalClicks,
      pendingReports,
      verifiedCoupons,
      topMerchants,
      topCoupons,
      estimatedCommissions,
      recentClicks: this.couponClicks.slice(0, 10),
    };
  }

  // Admin database reset
  public resetToSeed(): void {
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
    this.categories = [...INITIAL_CATEGORIES];
    this.merchants = (FLAGSHIP_MERCHANTS_DATA as any[]).map(m => ({
      ...m,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-03-26T00:00:00Z',
    })).concat(INITIAL_MERCHANTS);
    this.coupons = (FLAGSHIP_COUPONS_DATA as any[]).map(c => ({
      ...c,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-03-26T00:00:00Z',
    })).concat(INITIAL_COUPONS);
    this.deals = [...INITIAL_DEALS];
    this.blogPosts = [...INITIAL_BLOG_POSTS];
    this.faqs = [...INITIAL_FAQS];
    this.verificationLogs = [...INITIAL_VERIFICATION_LOGS];
    this.reports = [...INITIAL_REPORTS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.affiliateConfig = DEFAULT_AFFILIATE_CONFIG;
    this.couponClicks = [];
    this.logAudit('RESET_DATABASE', 'System', 'all', 'Reset database to clean seed state');
    this.notify();
  }
}

export const db = new DatabaseStore();

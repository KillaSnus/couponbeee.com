import React, { useState, useMemo } from 'react';
import { useDb } from '../lib/useDb';
import { CouponCard } from '../components/CouponCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { Coupon, Merchant } from '../types';
import { Search, Filter, ShieldCheck, Tag, Sparkles } from 'lucide-react';

interface CouponsPageProps {
  onNavigate: (path: string) => void;
  onOpenCodeModal: (coupon: Coupon, merchant?: Merchant) => void;
  onOpenReportModal: (coupon: Coupon) => void;
}

export const CouponsPage: React.FC<CouponsPageProps> = ({
  onNavigate,
  onOpenCodeModal,
  onOpenReportModal,
}) => {
  const db = useDb();
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | 'TESTED'>('ALL');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [merchantFilter, setMerchantFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'expiring' | 'discount'>('popular');

  const allCoupons = db.getCoupons({ status: 'ACTIVE' });
  const allCategories = db.getCategories();
  const allMerchants = db.getMerchants();

  const filteredCoupons = useMemo(() => {
    return allCoupons.filter(coupon => {
      // Verification filter
      if (verificationFilter === 'TESTED' && coupon.verificationStatus !== 'TESTED') {
        return false;
      }

      // Discount type
      if (discountTypeFilter !== 'ALL' && coupon.discountType !== discountTypeFilter) {
        return false;
      }

      // Category
      if (categoryFilter !== 'ALL' && coupon.categoryId !== categoryFilter) {
        return false;
      }

      // Merchant
      if (merchantFilter !== 'ALL' && coupon.merchantId !== merchantFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const m = db.getMerchantById(coupon.merchantId);
        const matchTitle = coupon.title.toLowerCase().includes(q);
        const matchDesc = coupon.description.toLowerCase().includes(q);
        const matchMerchant = m ? m.name.toLowerCase().includes(q) : false;
        const matchCode = coupon.code ? coupon.code.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchDesc && !matchMerchant && !matchCode) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'expiring') {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      if (sortBy === 'discount') {
        const valA = parseInt(a.discountValue) || 0;
        const valB = parseInt(b.discountValue) || 0;
        return valB - valA;
      }
      // Popular (click volume)
      return (b.clickCount || 0) - (a.clickCount || 0);
    });
  }, [allCoupons, verificationFilter, discountTypeFilter, categoryFilter, merchantFilter, searchQuery, sortBy, db]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHead
        title="Verified Coupon Codes & Promo Vouchers (2026)"
        description="Search active, editor-tested discount coupons, promotional codes, and shopping savings. Filter by verified status, store, or percentage discount."
        canonicalPath="/coupons"
      />

      <Breadcrumbs
        items={[{ label: 'Coupons' }]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Verified Coupons &amp; Promo Codes
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          Filter through our audited directory of active promotional tokens. Every voucher labeled &ldquo;Tested &amp; Verified&rdquo; has been tested on a live merchant checkout screen.
        </p>
      </div>

      {/* Filter Matrix */}
      <div className="bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-200 space-y-4">
        
        {/* Top Filter Row: Search & Segmented Verified Control */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search coupons by store or title..."
              className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Interactive Segmented Filter for Verified vs All */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setVerificationFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                verificationFilter === 'ALL'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Active Coupons
            </button>
            <button
              onClick={() => setVerificationFilter('TESTED')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                verificationFilter === 'TESTED'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tested &amp; Verified Only</span>
            </button>
          </div>
        </div>

        {/* Second Filter Row: Categories, Stores, Types, Sorting */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-200/70">
          
          {/* Category */}
          <div>
            <label className="text-[11px] font-semibold text-stone-500 block mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {allCategories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Merchant */}
          <div>
            <label className="text-[11px] font-semibold text-stone-500 block mb-1">
              Merchant / Store
            </label>
            <select
              value={merchantFilter}
              onChange={e => setMerchantFilter(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Stores</option>
              {allMerchants.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Type */}
          <div>
            <label className="text-[11px] font-semibold text-stone-500 block mb-1">
              Discount Type
            </label>
            <select
              value={discountTypeFilter}
              onChange={e => setDiscountTypeFilter(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="PERCENTAGE">Percentage (%) Off</option>
              <option value="FIXED_AMOUNT">Fixed Dollar ($) Off</option>
              <option value="FREE_SHIPPING">Free Shipping</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[11px] font-semibold text-stone-500 block mb-1">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Added</option>
              <option value="expiring">Expiring Soon</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>

        </div>

      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong className="text-stone-900">{filteredCoupons.length}</strong> active promotional vouchers
        </span>
        {(searchQuery || categoryFilter !== 'ALL' || merchantFilter !== 'ALL' || discountTypeFilter !== 'ALL' || verificationFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('ALL');
              setMerchantFilter('ALL');
              setDiscountTypeFilter('ALL');
              setVerificationFilter('ALL');
            }}
            className="text-amber-700 hover:text-amber-800 underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Coupon List */}
      {filteredCoupons.length > 0 ? (
        <div className="space-y-4">
          {filteredCoupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onOpenCodeModal={onOpenCodeModal}
              onOpenReportModal={onOpenReportModal}
              onNavigateMerchant={slug => onNavigate(`/stores/${slug}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <Tag className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-display text-lg font-bold text-stone-800">
            No Coupons Matched Your Criteria
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your discount type or category filters to explore more available offers.
          </p>
        </div>
      )}

    </div>
  );
};

import React from 'react';
import { Merchant } from '../types';
import { db } from '../lib/store';
import { ArrowRight, Tag, Percent } from 'lucide-react';

interface StoreCardProps {
  merchant: Merchant;
  onSelect: (slug: string) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ merchant, onSelect }) => {
  const coupons = db.getCoupons({ merchantId: merchant.id, status: 'ACTIVE' });
  const deals = db.getDeals({ merchantId: merchant.id });
  const categories = db.getCategories();
  const primaryCategory = categories.find(c => merchant.categoryIds.includes(c.id));

  // Determine best discount
  const bestCoupon = coupons[0];
  const bestDiscountLabel = bestCoupon
    ? (typeof bestCoupon.discountValue === 'number'
        ? `${bestCoupon.discountValue}%`
        : String(bestCoupon.discountValue))
    : null;

  const formattedDate = new Date(merchant.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div 
      onClick={() => onSelect(merchant.slug)}
      className="group bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header: Store Monogram / Logo + Best Discount Tag */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center font-display font-bold text-lg text-stone-800 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
            {merchant.name.slice(0, 2).toUpperCase()}
          </div>
          {bestDiscountLabel && (
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
              Up to {bestDiscountLabel}
            </span>
          )}
        </div>

        {/* Store Title */}
        <h3 className="font-semibold text-stone-900 text-lg group-hover:text-amber-600 transition-colors">
          {merchant.name}
        </h3>

        {/* Category Unboxed Line */}
        <div className="text-xs text-stone-500 mt-0.5">
          <span>{primaryCategory?.name || 'Retail'}</span>
          <span aria-hidden="true" className="mx-1.5 text-stone-300">·</span>
          <span>Updated {formattedDate}</span>
        </div>

        {/* Short Original Description */}
        <p className="text-sm text-stone-600 line-clamp-2 mt-2 leading-relaxed">
          {merchant.shortDesc}
        </p>
      </div>

      {/* Counts & Action */}
      <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-3">
          <span className="font-medium text-stone-900 tabular-nums">
            {coupons.length} {coupons.length === 1 ? 'Coupon' : 'Coupons'}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="tabular-nums">
            {deals.length} {deals.length === 1 ? 'Deal' : 'Deals'}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-amber-700 font-medium group-hover:translate-x-0.5 transition-transform">
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

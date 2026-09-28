import React from 'react';
import { Deal, Merchant } from '../types';
import { db } from '../lib/store';
import { ExternalLink, Tag } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  merchant?: Merchant;
  onNavigateMerchant?: (slug: string) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, merchant, onNavigateMerchant }) => {
  const m = merchant || db.getMerchantById(deal.merchantId);

  const handleGetDeal = () => {
    const res = db.recordDealClick(deal.id, 'DESKTOP');
    if (res?.url) {
      window.open(res.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between">
      <div className="space-y-2.5">
        {/* Unboxed Metadata */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          {m ? (
            <button
              onClick={() => onNavigateMerchant && onNavigateMerchant(m.slug)}
              className="font-medium text-stone-900 hover:text-amber-600 transition-colors cursor-pointer"
            >
              {m.name}
            </button>
          ) : (
            <span className="font-medium">Direct Deal</span>
          )}
          <span className="text-amber-700 font-semibold">{deal.discountValue}</span>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-stone-900 text-base leading-snug line-clamp-2">
          {deal.title}
        </h4>

        {/* Description */}
        <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
          {deal.description}
        </p>

        {/* Price Breakdown if available */}
        {(deal.originalPrice || deal.salePrice) && (
          <div className="flex items-baseline gap-2 pt-1">
            {deal.salePrice && (
              <span className="text-lg font-bold text-stone-900 tabular-nums">
                ${deal.salePrice.toFixed(2)}
              </span>
            )}
            {deal.originalPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                ${deal.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action */}
      <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs text-stone-400">No code needed</span>
        <button
          onClick={handleGetDeal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
        >
          <span>Shop Deal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

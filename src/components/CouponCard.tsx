import React, { useState, useEffect } from 'react';
import { Coupon, Merchant } from '../types';
import { db } from '../lib/store';
import { authService } from '../lib/firebase';
import { 
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Flag, 
  ExternalLink, Scissors, Bookmark, ThumbsUp, ThumbsDown, Sparkles, ShieldCheck 
} from 'lucide-react';

interface CouponCardProps {
  coupon: Coupon;
  merchant?: Merchant;
  onOpenCodeModal: (coupon: Coupon, merchant?: Merchant) => void;
  onOpenReportModal: (coupon: Coupon) => void;
  onNavigateMerchant?: (slug: string) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  merchant,
  onOpenCodeModal,
  onOpenReportModal,
  onNavigateMerchant,
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(coupon.upvotes || 42);
  const [downvotes, setDownvotes] = useState(coupon.downvotes || 2);

  useEffect(() => {
    setIsSaved(authService.isCouponSaved(coupon.id));
  }, [coupon.id]);

  const m = merchant || db.getMerchantById(coupon.merchantId);
  const isCode = Boolean(coupon.code);
  const isVerified = coupon.verificationStatus === 'TESTED';
  const isExpired = coupon.status === 'EXPIRED';

  const handleClickAction = () => {
    db.recordCouponClick(coupon.id, 'DESKTOP');
    onOpenCodeModal(coupon, m);
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = authService.toggleSaveCoupon(coupon.id);
    setIsSaved(newState);
  };

  const handleVote = (type: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (userVote === type) return;
    if (type === 'up') {
      setUpvotes(prev => prev + 1);
      if (userVote === 'down') setDownvotes(prev => Math.max(0, prev - 1));
    } else {
      setDownvotes(prev => prev + 1);
      if (userVote === 'up') setUpvotes(prev => Math.max(0, prev - 1));
    }
    setUserVote(type);
  };

  // Format discount value display
  const getDiscountLabel = () => {
    if (coupon.discountType === 'FREE_SHIPPING') return 'FREE SHIP';
    if (coupon.discountType === 'FIXED_AMOUNT') return `$${coupon.discountValue} OFF`;
    if (coupon.discountValue) return `${coupon.discountValue}% OFF`;
    return 'DEAL';
  };

  const totalVotes = upvotes + downvotes;
  const successPercentage = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 95;

  const formattedTestedDate = coupon.lastVerifiedAt 
    ? new Date(coupon.lastVerifiedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently';

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-200 relative overflow-hidden ${
      isExpired 
        ? 'border-stone-200 opacity-70 bg-stone-50/50' 
        : 'border-stone-200 hover:border-amber-400 hover:shadow-md'
    }`}>
      
      {/* Top Banner for Exclusive / Staff Pick */}
      {(coupon.isExclusive || coupon.isStaffPick) && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-4 py-1 text-[11px] font-bold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-stone-950" />
            <span>{coupon.isExclusive ? '⭐ CouponBeee Exclusive Partner' : '🔥 Editor’s Top Pick · 98% Success'}</span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-90">Verified Today</span>
        </div>
      )}

      <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
        
        {/* Left Side: Discount Box + Metadata */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          
          {/* Discount Badge */}
          <div className="shrink-0 w-24 sm:w-28 text-center py-3.5 px-2 rounded-xl bg-gradient-to-b from-amber-50 to-stone-50 border border-amber-200/80 shadow-xs flex flex-col justify-center items-center">
            <span className="block font-display text-lg sm:text-xl font-black text-amber-950 tracking-tight leading-none">
              {getDiscountLabel()}
            </span>
            <span className="block text-[10px] font-extrabold text-amber-800 uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded bg-amber-200/60">
              {isCode ? 'PROMO CODE' : 'DIRECT DEAL'}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            
            {/* Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              {m && (
                <button
                  onClick={() => onNavigateMerchant && onNavigateMerchant(m.slug)}
                  className="font-bold text-stone-900 hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{m.name}</span>
                </button>
              )}

              {isVerified && (
                <>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Tested &amp; Verified
                  </span>
                </>
              )}

              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-[11px] text-stone-500">
                {successPercentage}% success rate
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 leading-snug group-hover:text-amber-700 transition-colors">
              {coupon.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
              {coupon.description}
            </p>

            {/* Voting & Verification Feedback */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-stone-500">
              <span className="text-stone-400">Did it work?</span>
              <button
                onClick={(e) => handleVote('up', e)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  userVote === 'up' ? 'text-emerald-700 font-bold bg-emerald-50' : 'hover:text-emerald-700'
                }`}
                title="Vote: Worked for me"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{upvotes}</span>
              </button>
              <button
                onClick={(e) => handleVote('down', e)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  userVote === 'down' ? 'text-red-700 font-bold bg-red-50' : 'hover:text-red-700'
                }`}
                title="Vote: Did not work"
              >
                <ThumbsDown className="w-3 h-3" />
                <span>{downvotes}</span>
              </button>

              <span aria-hidden="true" className="text-stone-300">·</span>
              <button
                onClick={() => setShowTerms(!showTerms)}
                className="hover:text-stone-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Terms &amp; Details</span>
                {showTerms ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <button
                onClick={() => onOpenReportModal(coupon)}
                className="hover:text-amber-800 transition-colors flex items-center gap-1 cursor-pointer text-stone-400"
                title="Report invalid coupon"
              >
                <Flag className="w-3 h-3" />
                <span>Report</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: CTA Button + Wishlist Save */}
        <div className="shrink-0 flex items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Wishlist Bookmark Button */}
          <button
            onClick={handleToggleSave}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isSaved
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save coupon'}
            title={isSaved ? 'Saved to your Wishlist' : 'Save to Wishlist'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>

          {/* Action CTA */}
          {isCode ? (
            <button
              onClick={handleClickAction}
              className="relative flex-1 md:flex-initial group/btn flex items-center bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-stone-950 font-bold text-xs rounded-xl overflow-hidden shadow-sm transition-all cursor-pointer"
            >
              <div className="px-4 py-3 flex items-center gap-1.5 font-bold tracking-wide">
                <Scissors className="w-3.5 h-3.5" />
                <span>Show Code</span>
              </div>
              <div className="px-3 py-3 bg-amber-400/90 group-hover/btn:bg-amber-300 text-stone-900 border-l border-amber-600/30 font-mono font-bold tracking-wider text-[11px] flex items-center">
                {coupon.code?.slice(0, 4)}••
              </div>
            </button>
          ) : (
            <button
              onClick={handleClickAction}
              className="flex-1 md:flex-initial px-5 py-3 bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Deal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

      </div>

      {/* Expandable Terms Drawer */}
      {showTerms && (
        <div className="border-t border-stone-100 bg-stone-50/80 px-6 py-3.5 text-xs text-stone-600 space-y-1 animate-in slide-in-from-top-1 duration-150">
          <p className="font-semibold text-stone-800">Coupon Terms &amp; Restrictions:</p>
          <p>{coupon.terms || 'Standard merchant exclusions apply. May not be combined with other discounts. Subject to inventory availability.'}</p>
          <div className="flex items-center gap-4 text-[11px] text-stone-400 pt-1">
            <span>Last Tested: {formattedTestedDate}</span>
            {coupon.expiryDate && <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>}
            <span>Tracking Method: Merchant Verified Link</span>
          </div>
        </div>
      )}

    </div>
  );
};

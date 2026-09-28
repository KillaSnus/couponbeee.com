import React, { useEffect, useState } from 'react';
import { useDb } from '../lib/useDb';
import { SeoHead } from '../components/SeoHead';
import { ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

interface OutboundRedirectPageProps {
  id: string;
  onNavigate: (path: string) => void;
}

export const OutboundRedirectPage: React.FC<OutboundRedirectPageProps> = ({ id, onNavigate }) => {
  const db = useDb();
  const [destinationUrl, setDestinationUrl] = useState<string>('');
  const [targetName, setTargetName] = useState<string>('Merchant');
  const [discountTitle, setDiscountTitle] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string | null>(null);

  useEffect(() => {
    // Detect device category safely
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const deviceCategory = isMobile ? 'MOBILE' : 'DESKTOP';
    const referrer = typeof document !== 'undefined' ? document.referrer : '';

    // Check if ID matches a coupon
    const couponResult = db.recordCouponClick(id, deviceCategory, referrer);
    if (couponResult) {
      setDestinationUrl(couponResult.url);
      setTargetName(couponResult.merchant.name);
      setDiscountTitle(couponResult.coupon.title);
      setCouponCode(couponResult.coupon.code || null);

      // Auto redirect after brief transparent interval (800ms)
      const timer = setTimeout(() => {
        if (couponResult.url) {
          window.location.href = couponResult.url;
        }
      }, 900);
      return () => clearTimeout(timer);
    }

    // Check if ID matches a deal
    const dealResult = db.recordDealClick(id, deviceCategory, referrer);
    if (dealResult) {
      setDestinationUrl(dealResult.url);
      setTargetName(dealResult.merchant.name);
      setDiscountTitle(dealResult.deal.title);

      const timer = setTimeout(() => {
        if (dealResult.url) {
          window.location.href = dealResult.url;
        }
      }, 900);
      return () => clearTimeout(timer);
    }

    // If ID not found
    setDestinationUrl('');
  }, [id, db]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <SeoHead
        title="Redirecting to Merchant | CouponBeee"
        description="Redirecting you securely to our verified partner store with discount tracking active."
        noIndex={true}
      />

      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-md space-y-5">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center mx-auto animate-bounce">
          <ExternalLink className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Safe Outbound Redirect
          </span>
          <h1 className="font-display text-xl font-bold text-stone-900">
            Taking you to {targetName}...
          </h1>
          {discountTitle && (
            <p className="text-xs text-stone-500 line-clamp-1">
              {discountTitle}
            </p>
          )}
        </div>

        {couponCode && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-950 font-medium">
            Don&rsquo;t forget your code at checkout: <span className="font-mono font-bold">{couponCode}</span>
          </div>
        )}

        <div className="pt-2">
          {destinationUrl ? (
            <a
              href={destinationUrl}
              rel="sponsored nofollow noopener"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
            >
              <span>Click if not redirected automatically</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-stone-500">
                Offer identifier not found or expired.
              </p>
              <button
                onClick={() => onNavigate('/')}
                className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-md"
              >
                Return to CouponBeee
              </button>
            </div>
          )}
        </div>

        <div className="text-[10px] text-stone-400 border-t border-stone-100 pt-3">
          This link includes approved partner tracking parameters to help support CouponBeee at no cost to you.
        </div>
      </div>
    </div>
  );
};

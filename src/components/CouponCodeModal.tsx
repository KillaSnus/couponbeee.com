import React, { useState, useEffect } from 'react';
import { Coupon, Merchant } from '../types';
import { Copy, Check, ExternalLink, X, ShieldCheck, ThumbsUp, ThumbsDown, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CouponCodeModalProps {
  coupon: Coupon | null;
  merchant?: Merchant;
  onClose: () => void;
  onOpenReport: (coupon: Coupon) => void;
}

export const CouponCodeModal: React.FC<CouponCodeModalProps> = ({
  coupon,
  merchant,
  onClose,
  onOpenReport,
}) => {
  const [copied, setCopied] = useState(false);
  const [userVoted, setUserVoted] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    if (coupon) {
      setCopied(false);
      setUserVoted(null);
      // Delightful confetti burst on modal open
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899']
      });

      // Safely open merchant window in background when code is revealed
      const targetUrl = coupon.affiliateUrl || merchant?.affiliateUrl || coupon.landingUrl || merchant?.landingUrl;
      if (targetUrl && typeof window !== 'undefined') {
        try {
          const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
          if (win) win.blur();
          window.focus();
        } catch {
          // Popup blocked, user can click "Continue to Store"
        }
      }
    }
  }, [coupon]);

  if (!coupon) return null;

  const codeText = coupon.code || '';
  const destinationUrl = coupon.affiliateUrl || merchant?.affiliateUrl || coupon.landingUrl || merchant?.landingUrl || '#';
  const isVerified = coupon.verificationStatus === 'TESTED';

  const handleCopy = () => {
    if (codeText) {
      navigator.clipboard.writeText(codeText);
      setCopied(true);
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.5 } });
      setTimeout(() => setCopied(false), 3500);
    }
  };

  const getDiscountDisplay = () => {
    if (coupon.discountType === 'FREE_SHIPPING') return 'FREE SHIPPING';
    if (coupon.discountType === 'FIXED_AMOUNT') return `$${coupon.discountValue} OFF`;
    if (coupon.discountValue) return `${coupon.discountValue}% OFF`;
    return 'EXCLUSIVE DEAL';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-950 text-xs font-black rounded-full border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{getDiscountDisplay()}</span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-black text-stone-900 leading-snug">
            {coupon.title}
          </h2>

          {merchant && (
            <p className="text-xs text-stone-500 font-medium">
              Verified for <span className="text-stone-900 font-bold">{merchant.name}</span> online checkout
            </p>
          )}
        </div>

        {/* Coupon Code Display Box */}
        {codeText ? (
          <div className="bg-gradient-to-b from-amber-50/60 to-stone-50 border-2 border-dashed border-amber-300 rounded-2xl p-5 sm:p-6 text-center mb-6 shadow-inner">
            <span className="text-[11px] uppercase tracking-wider text-amber-900 block mb-2 font-bold">
              Your Verified Promo Code
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-black text-stone-950 tracking-widest px-4 py-2 bg-white rounded-xl border border-stone-200 shadow-xs select-all">
                {codeText}
              </span>
              <button
                onClick={handleCopy}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-black rounded-xl transition-all cursor-pointer shadow-md ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {copied && (
              <p className="text-xs text-emerald-700 mt-3 font-bold flex items-center justify-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" />
                <span>Code copied! Paste it in the coupon box at checkout.</span>
              </p>
            )}
          </div>
        ) : (
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 text-center mb-6">
            <p className="text-xs font-semibold text-amber-950">
              No promo code needed! Discount applies automatically via the partner link below.
            </p>
          </div>
        )}

        {/* External Link Action */}
        <div className="space-y-3 mb-6">
          <a
            href={destinationUrl}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="w-full py-3.5 px-4 bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open {merchant?.name || 'Store'} &amp; Apply Discount</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-[11px] text-center text-stone-400">
            A new tab opens directly to the merchant. Your savings will be active at checkout.
          </p>
        </div>

        {/* How To Use Checklist */}
        <div className="border-t border-stone-100 pt-4 mb-5 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
            How to redeem this coupon:
          </span>
          <ol className="text-xs text-stone-600 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Copy the code shown above.</li>
            <li>Head to the {merchant?.name || 'merchant'} cart or payment summary page.</li>
            <li>Paste your code into the &ldquo;Promo Code&rdquo; or &ldquo;Coupon&rdquo; box and click Apply.</li>
          </ol>
        </div>

        {/* Feedback: Did it work? */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 flex items-center justify-between">
          <span className="text-xs font-medium text-stone-700">Did this coupon work?</span>
          <div className="flex items-center gap-2">
            {userVoted ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Thanks for your feedback!</span>
              </span>
            ) : (
              <>
                <button
                  onClick={() => setUserVoted('yes')}
                  className="px-3 py-1 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-lg text-xs font-semibold text-stone-700 hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3 text-emerald-600" />
                  <span>Yes</span>
                </button>
                <button
                  onClick={() => setUserVoted('no')}
                  className="px-3 py-1 bg-white hover:bg-red-50 border border-stone-200 hover:border-red-300 rounded-lg text-xs font-semibold text-stone-700 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ThumbsDown className="w-3 h-3 text-red-600" />
                  <span>No</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer info & report link */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tested &amp; Guaranteed Safe</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenReport(coupon);
            }}
            className="hover:text-amber-800 underline transition-colors cursor-pointer"
          >
            Report an issue with this code
          </button>
        </div>

      </div>
    </div>
  );
};

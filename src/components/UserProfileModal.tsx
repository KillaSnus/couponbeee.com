import React, { useState } from 'react';
import { authService, UserProfile } from '../lib/firebase';
import { db } from '../lib/store';
import { Coupon } from '../types';
import { 
  X, User, DollarSign, Bookmark, Share2, LogOut, 
  ExternalLink, Copy, Check, Gift, Sparkles, ShieldCheck 
} from 'lucide-react';

interface UserProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCodeModal: (coupon: Coupon) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onOpenCodeModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'wallet' | 'referrals'>('overview');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);

  if (!isOpen || !user) return null;

  const savedCouponIds = user.savedCoupons || [];
  const savedCoupons = savedCouponIds
    .map(id => db.getCouponById(id))
    .filter((c): c is Coupon => c !== undefined);

  const referralUrl = `https://couponbeee.org/?ref=${user.referralCode}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleLogout = async () => {
    await authService.logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-stone-200">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xl shadow-sm overflow-hidden shrink-0">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
            ) : (
              (user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-stone-900 truncate">
                {user.displayName || 'CouponBeee Member'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Verified Saver
              </span>
            </div>
            <p className="text-xs text-stone-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex items-center gap-1 border-b border-stone-200 my-4 text-xs font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'border-amber-500 text-amber-900' : 'border-transparent hover:text-stone-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'saved' ? 'border-amber-500 text-amber-900' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedCoupons.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'wallet' ? 'border-amber-500 text-amber-900' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Cash Back (${user.cashbackBalance.toFixed(2)})</span>
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3 py-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'referrals' ? 'border-amber-500 text-amber-900' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Refer &amp; Earn</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] text-amber-900 font-semibold uppercase tracking-wider block mb-1">
                  Cash Back Balance
                </span>
                <span className="font-display text-2xl font-bold text-amber-950">
                  ${user.cashbackBalance.toFixed(2)}
                </span>
                <p className="text-[10px] text-amber-800 mt-1">Available for PayPal or Gift Card withdrawal</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider block mb-1">
                  Saved Wishlist
                </span>
                <span className="font-display text-2xl font-bold text-stone-900">
                  {savedCoupons.length}
                </span>
                <p className="text-[10px] text-stone-500 mt-1">Vouchers bookmarked for later checkout</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">VIP Membership Status</span>
                <span className="text-emerald-700 font-bold">Gold Tier</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full w-3/4"></div>
              </div>
              <p className="text-[11px] text-stone-500">
                Earned via coupon verifications and shopping through CouponBeee affiliate links.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Coupons */}
        {activeTab === 'saved' && (
          <div className="space-y-3">
            {savedCoupons.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Bookmark className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-600 font-medium">No saved coupons yet.</p>
                <p className="text-[11px] text-stone-400">Click the bookmark icon on any coupon card to save it here.</p>
              </div>
            ) : (
              savedCoupons.map(coupon => {
                const merch = db.getMerchantById(coupon.merchantId);
                return (
                  <div key={coupon.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">{merch?.name}</span>
                      <p className="text-xs font-semibold text-stone-900 truncate">{coupon.title}</p>
                      <span className="text-[10px] font-mono text-stone-500">{coupon.code || 'Automatic Deal'}</span>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCodeModal(coupon);
                      }}
                      className="shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Show Code
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: Cash Back Wallet */}
        {activeTab === 'wallet' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md">
              <span className="text-xs font-semibold uppercase tracking-wider block opacity-90">Total Available Cash Back</span>
              <span className="font-display text-3xl font-extrabold block my-1">${user.cashbackBalance.toFixed(2)}</span>
              <span className="text-xs opacity-90">Minimum payout threshold: $15.00</span>
            </div>

            {payoutRequested ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Payout request of ${user.cashbackBalance.toFixed(2)} submitted! Processing to your PayPal within 24 hours.</span>
              </div>
            ) : (
              <button
                onClick={() => setPayoutRequested(true)}
                disabled={user.cashbackBalance < 15}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Withdraw Funds via PayPal / Bank
              </button>
            )}

            <div className="text-[11px] text-stone-500 space-y-1">
              <p className="font-semibold text-stone-700">How CouponBeee Cash Back works:</p>
              <p>When you click our verified affiliate links before shopping at Hostinger, Amazon, or Nike, the merchant rewards us with a referral fee. We share up to 80% of this fee directly back to your wallet.</p>
            </div>
          </div>
        )}

        {/* Tab 4: Referral Link */}
        {activeTab === 'referrals' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-700" />
                <span>Give $10, Get $5</span>
              </span>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Invite friends to CouponBeee. When they register, they get an instant $10 welcome cash back bonus, and you receive $5 when they make their first verified shopping trip!
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">Your Unique Referral Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-lg text-stone-700 select-all"
                />
                <button
                  onClick={copyReferral}
                  className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReferral ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer with logout */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-400">CouponBeee ID: {user.uid.slice(0, 10)}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-stone-600 hover:text-red-700 transition-colors cursor-pointer font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};

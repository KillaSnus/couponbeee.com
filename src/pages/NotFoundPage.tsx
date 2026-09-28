import React from 'react';
import { SeoHead } from '../components/SeoHead';
import { Store, Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <SeoHead
        title="404 – Page Not Found | CouponBeee"
        description="The requested coupon, store, or page could not be found."
        noIndex={true}
      />

      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center font-display font-black text-2xl mx-auto">
        404
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
          Page Not Found
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          The link you followed may have expired, or the promotional voucher has been retired from our verified database.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </button>
        <button
          onClick={() => onNavigate('/stores')}
          className="px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 cursor-pointer flex items-center gap-1.5"
        >
          <Store className="w-4 h-4" />
          <span>Browse Stores</span>
        </button>
      </div>
    </div>
  );
};

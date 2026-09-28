import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';

interface CookiePolicyPageProps {
  onNavigate: (path: string) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHead
        title="Cookie Policy | CouponBeee"
        description="Learn about the essential cookies and analytics tokens used by CouponBeee."
        canonicalPath="/cookie-policy"
      />

      <Breadcrumbs
        items={[{ label: 'Cookie Policy' }]}
        onNavigate={onNavigate}
      />

      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-xs text-stone-500">
          Last revised: March 2026
        </p>
      </div>

      <div className="prose prose-stone text-stone-700 text-sm sm:text-base leading-relaxed space-y-5">
        <p>
          This Cookie Policy explains how CouponBeee uses cookies and similar local storage technologies when you visit our website.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          1. What Are Cookies?
        </h2>
        <p>
          Cookies are small text files stored on your computer or mobile device when you load modern web pages. They help websites remember preferences and provide smooth navigation.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          2. Cookies Used by CouponBeee
        </h2>
        <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-2">
          <li><strong>Essential Operational Storage:</strong> We use local storage to maintain your active search filters, store sorting preferences, and admin dashboard state.</li>
          <li><strong>Affiliate Tracking Tokens:</strong> When clicking an outbound coupon link to visit a merchant, an affiliate network session cookie may be set on the destination domain to track referral commissions. These cookies expire according to the partner merchant&rsquo;s standard cookie window (typically 7 to 30 days).</li>
        </ul>

        <h2 className="font-display text-xl font-bold text-stone-900">
          3. Managing Cookies
        </h2>
        <p>
          You can restrict or block cookies through your browser settings. Please note that disabling cookies may affect certain interactive conveniences such as saving favorite stores or persisting filter parameters.
        </p>
      </div>
    </div>
  );
};

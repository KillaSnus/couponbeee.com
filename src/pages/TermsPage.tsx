import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHead
        title="Terms of Use | CouponBeee"
        description="Review the terms and conditions governing the use of CouponBeee and its verified discount directories."
        canonicalPath="/terms"
      />

      <Breadcrumbs
        items={[{ label: 'Terms of Use' }]}
        onNavigate={onNavigate}
      />

      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Terms of Use
        </h1>
        <p className="text-xs text-stone-500">
          Last revised: March 2026
        </p>
      </div>

      <div className="prose prose-stone text-stone-700 text-sm sm:text-base leading-relaxed space-y-5">
        <h2 className="font-display text-xl font-bold text-stone-900">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using CouponBeee (&ldquo;the Site&rdquo;), you agree to comply with and be bound by these Terms of Use. If you do not agree, you should refrain from using the platform.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          2. Informational Nature of Vouchers
        </h2>
        <p>
          CouponBeee compiles promotional codes, coupons, and sales offers for informational purposes. All transactions, order fulfillments, returns, warranties, and billing customer support occur directly between you and the third-party merchant. CouponBeee does not sell merchandise directly and does not guarantee merchant stock availability, fulfillment times, or item quality.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          3. Coupon Accuracy Disclaimer
        </h2>
        <p>
          While our editorial staff tests promotional vouchers on live retailer checkout interfaces, merchants reserve the legal right to revoke, pause, or modify promotions at any time. We make no warranty that a specific voucher will remain active at the exact moment of your purchase. Always verify the applied discount on the merchant&rsquo;s checkout summary before submitting payment.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          4. Prohibited Uses
        </h2>
        <p>
          You agree not to scrape, automate, copy, or redistribute our verification logs, editorial guides, or coupon database without prior written authorization from CouponBeee.
        </p>
      </div>
    </div>
  );
};

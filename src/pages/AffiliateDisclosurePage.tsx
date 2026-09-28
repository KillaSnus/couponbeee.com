import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';

interface AffiliateDisclosurePageProps {
  onNavigate: (path: string) => void;
}

export const AffiliateDisclosurePage: React.FC<AffiliateDisclosurePageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHead
        title="Affiliate Disclosure & Transparency Policy | CouponBeee"
        description="Detailed disclosure of how CouponBeee generates revenue through affiliate links, our editorial independence, and consumer guarantees."
        canonicalPath="/affiliate-disclosure"
      />

      <Breadcrumbs
        items={[{ label: 'Affiliate Disclosure' }]}
        onNavigate={onNavigate}
      />

      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Affiliate Disclosure &amp; Transparency Statement
        </h1>
        <p className="text-xs text-stone-500">
          Last revised: March 2026
        </p>
      </div>

      <div className="prose prose-stone text-stone-700 text-sm sm:text-base leading-relaxed space-y-5">
        <p>
          At CouponBeee, we believe full transparency is paramount to maintaining consumer trust. This document outlines how CouponBeee earns revenue and how our commercial relationships interact with our editorial processes.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          1. Affiliate Compensation
        </h2>
        <p>
          CouponBeee is free for all visitors. We do not charge membership fees, display disruptive pop-under advertising, or sell personal customer dossiers. Instead, we receive an affiliate referral commission from select merchants when you click an outbound link or copy a promotional voucher code on our website and proceed to make a qualifying purchase on the merchant’s storefront.
        </p>
        <p>
          This referral fee is paid directly by the retailer from their existing marketing budget. <strong>Using CouponBeee never increases the price you pay.</strong> In fact, our verified discount codes reduce your purchase subtotal.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          2. Editorial Independence
        </h2>
        <p>
          Our verification team operates independently of merchant commercial arrangements. A merchant offering a higher commission rate cannot buy a &ldquo;Tested &amp; Verified&rdquo; badge. Only offers that have been successfully checked on an authentic merchant checkout screen receive our verification stamp.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          3. Outbound Link Tracking &amp; Privacy
        </h2>
        <p>
          When you click &ldquo;Show Code&rdquo; or &ldquo;Get Deal&rdquo;, our outbound redirect architecture records a non-identifying timestamp, the referral merchant identifier, and standard device category (e.g. desktop vs mobile) to understand general traffic volume. All commercial links use standard <code>rel=&ldquo;sponsored nofollow noopener&rdquo;</code> attributes in compliance with search engine guidelines.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          4. No Guaranteed Outcomes
        </h2>
        <p>
          While our editorial team endeavors to keep every listing fresh and verified, retailers frequently alter promotional terms, expire codes ahead of scheduled end-dates, or introduce regional exclusions without prior notification. We encourage all shoppers to review the merchant&rsquo;s final checkout invoice before placing an order.
        </p>
      </div>
    </div>
  );
};

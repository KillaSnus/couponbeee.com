import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHead
        title="Privacy Policy | CouponBeee"
        description="Learn how CouponBeee respects and safeguards your personal privacy, data collection practices, and cookie handling."
        canonicalPath="/privacy"
      />

      <Breadcrumbs
        items={[{ label: 'Privacy Policy' }]}
        onNavigate={onNavigate}
      />

      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-stone-500">
          Effective Date: March 2026
        </p>
      </div>

      <div className="prose prose-stone text-stone-700 text-sm sm:text-base leading-relaxed space-y-5">
        <p>
          CouponBeee (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting the privacy of our visitors. This Privacy Policy details what information is collected when you visit our website, how that information is used, and the choices available to you.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          1. Information We Collect
        </h2>
        <p>
          We do not require users to create personal accounts to browse our coupon directory, view discounts, or copy promotional vouchers. The limited data we collect includes:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2">
          <li><strong>Voluntary Submissions:</strong> Your email address and feedback if you opt into our newsletter or submit a coupon problem report.</li>
          <li><strong>Anonymous Outbound Aggregations:</strong> Click events when a voucher code or deal is copied, containing general device category (mobile or desktop), date/time, and target store identifier.</li>
          <li><strong>Server Logs:</strong> Standard HTTP request data (IP addresses are hashed or stripped) used strictly for security monitoring and bot abuse mitigation.</li>
        </ul>

        <h2 className="font-display text-xl font-bold text-stone-900">
          2. How Information is Used
        </h2>
        <p>
          Collected data is used solely to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2">
          <li>Deliver accurate coupon listings and analyze which promotional offers are in demand.</li>
          <li>Dispatch our weekly verified deals email to opt-in subscribers.</li>
          <li>Investigate community problem reports regarding non-functional codes.</li>
          <li>Prevent automated scraper bots from abusing our infrastructure.</li>
        </ul>

        <h2 className="font-display text-xl font-bold text-stone-900">
          3. Third-Party Affiliate Networks
        </h2>
        <p>
          When you click a link redirecting to a partner store, you may be routed through an approved affiliate network (such as Impact, CJ, ShareASale, or Rakuten). These networks use secure, privacy-compliant tracking identifiers to credit CouponBeee for resulting merchant purchases. These tokens contain zero personal information such as names, passwords, or credit card numbers.
        </p>

        <h2 className="font-display text-xl font-bold text-stone-900">
          4. Contact Us
        </h2>
        <p>
          For any inquiries concerning data privacy or to request removal of your email from our newsletter database, please contact our Data Protection Officer at privacy@couponbeee.org.
        </p>
      </div>
    </div>
  );
};

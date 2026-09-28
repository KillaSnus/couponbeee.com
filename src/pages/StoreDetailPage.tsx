import React, { useState } from 'react';
import { useDb } from '../lib/useDb';
import { Coupon, Merchant } from '../types';
import { CouponCard } from '../components/CouponCard';
import { DealCard } from '../components/DealCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { 
  ShieldCheck, ExternalLink, Calendar, Tag, Percent, 
  HelpCircle, ChevronDown, ChevronUp, Info, CheckCircle2, ArrowRight 
} from 'lucide-react';

interface StoreDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onOpenCodeModal: (coupon: Coupon, merchant?: Merchant) => void;
  onOpenReportModal: (coupon: Coupon) => void;
}

export const StoreDetailPage: React.FC<StoreDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenCodeModal,
  onOpenReportModal,
}) => {
  const db = useDb();
  const [showExpired, setShowExpired] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const merchant = db.getMerchantBySlug(slug);

  if (!merchant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <SeoHead
          title="Store Not Found"
          description="The requested store page could not be located on CouponBeee."
          noIndex={true}
        />
        <h1 className="font-display text-2xl font-bold text-stone-900">
          Store Not Found
        </h1>
        <p className="text-sm text-stone-600">
          The merchant you are searching for might have changed its name or is currently inactive.
        </p>
        <button
          onClick={() => onNavigate('/stores')}
          className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 cursor-pointer"
        >
          Back to All Stores
        </button>
      </div>
    );
  }

  const activeCoupons = db.getCoupons({ merchantId: merchant.id, status: 'ACTIVE' });
  const expiredCoupons = db.getCoupons({ merchantId: merchant.id, status: 'EXPIRED' });
  const deals = db.getDeals({ merchantId: merchant.id });
  const categories = db.getCategories();
  const primaryCategory = categories.find(c => merchant.categoryIds.includes(c.id));
  const relatedStores = db.getMerchants()
    .filter(m => m.id !== merchant.id && m.categoryIds.some(cid => merchant.categoryIds.includes(cid)))
    .slice(0, 3);

  // Best discount computation
  const bestDiscount = activeCoupons[0]?.discountValue || 'Special Offers';

  const lastUpdatedFormatted = new Date(merchant.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Dynamic FAQ structured data JSON-LD
  const faqJsonLd = merchant.faqs?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: merchant.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  } : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SeoHead
        title={merchant.seoTitle || `${merchant.name} Coupons, Promo Codes & Discounts (2026)`}
        description={merchant.seoDescription || `Save with tested ${merchant.name} promotional codes and deals. Audited discount vouchers updated for ${new Date().getFullYear()}.`}
        canonicalPath={`/stores/${merchant.slug}`}
        jsonLd={faqJsonLd}
      />

      <Breadcrumbs
        items={[
          { label: 'Stores', path: '/stores' },
          { label: merchant.name },
        ]}
        onNavigate={onNavigate}
      />

      {/* Store Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start gap-5">
          {/* Logo / Monogram */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-display font-extrabold text-2xl text-amber-900 shrink-0">
            {merchant.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              {primaryCategory && (
                <button
                  onClick={() => onNavigate(`/categories/${primaryCategory.slug}`)}
                  className="font-medium text-amber-700 hover:underline cursor-pointer"
                >
                  {primaryCategory.name}
                </button>
              )}
              <span aria-hidden="true">·</span>
              <span>Updated {lastUpdatedFormatted}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Merchant
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {merchant.name} Promo Codes &amp; Coupons
            </h1>

            <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
              {merchant.shortDesc}
            </p>
          </div>
        </div>

        {/* Quick Stats & Outbound Link */}
        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-stretch gap-3 w-full md:w-auto">
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-center">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Best Discount
            </span>
            <span className="font-display text-xl font-extrabold text-amber-900">
              {bestDiscount}
            </span>
          </div>

          <a
            href={merchant.affiliateUrl || merchant.landingUrl}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <span>Visit {merchant.name}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Coupons, Deals, Expired */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Coupons Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-stone-900 tracking-tight">
                Active {merchant.name} Promo Codes ({activeCoupons.length})
              </h2>
              <span className="text-xs text-stone-500">
                Sorted by community verification
              </span>
            </div>

            {activeCoupons.length > 0 ? (
              <div className="space-y-4">
                {activeCoupons.map(coupon => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    merchant={merchant}
                    onOpenCodeModal={onOpenCodeModal}
                    onOpenReportModal={onOpenReportModal}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 bg-stone-50 rounded-xl border border-stone-200 text-center text-xs text-stone-600">
                There are currently no active coupon codes for {merchant.name}. Check the direct deals below or browse related stores.
              </div>
            )}
          </section>

          {/* Deals Section if available */}
          {deals.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-stone-900 tracking-tight">
                Direct Deals &amp; Sales ({deals.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {deals.map(deal => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    merchant={merchant}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Expired Coupons Toggle */}
          {expiredCoupons.length > 0 && (
            <section className="space-y-3 pt-4 border-t border-stone-200">
              <button
                onClick={() => setShowExpired(!showExpired)}
                className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                <span>Recently Expired {merchant.name} Coupons ({expiredCoupons.length})</span>
                {showExpired ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showExpired && (
                <div className="space-y-3 opacity-60">
                  <p className="text-xs text-stone-500">
                    These codes have surpassed their expiration dates or failed recent checkout validation. They are listed here for historical reference.
                  </p>
                  {expiredCoupons.map(coupon => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      merchant={merchant}
                      onOpenCodeModal={onOpenCodeModal}
                      onOpenReportModal={onOpenReportModal}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* How to Use a Coupon at this store */}
          {merchant.howToUseSteps && merchant.howToUseSteps.length > 0 && (
            <section className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-stone-900">
                How to Redeem a Promo Code at {merchant.name}
              </h2>
              <ol className="space-y-3 text-xs text-stone-600 leading-relaxed list-decimal list-inside">
                {merchant.howToUseSteps.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="font-medium text-stone-900">Step {idx + 1}: </span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Store FAQs */}
          {merchant.faqs && merchant.faqs.length > 0 && (
            <section className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-stone-900">
                Frequently Asked Questions About {merchant.name} Discounts
              </h2>
              <div className="space-y-3 divide-y divide-stone-100">
                {merchant.faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="pt-3 first:pt-0">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full text-left flex items-center justify-between gap-3 text-xs font-semibold text-stone-900 cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
                      </button>
                      {isOpen && (
                        <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>

        {/* Right Sidebar: About Store, Editorial Info, Related Stores */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* About Store Box */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
            <h3 className="font-semibold text-sm text-stone-900 border-b border-stone-100 pb-2">
              About {merchant.name}
            </h3>
            <div 
              className="text-xs text-stone-600 leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{ __html: merchant.aboutHtml }}
            />
            <div className="pt-2 text-xs text-stone-500 border-t border-stone-100 flex items-center justify-between">
              <span>Official Website:</span>
              <a 
                href={merchant.landingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-stone-700 hover:text-amber-600"
              >
                {merchant.domain}
              </a>
            </div>
          </div>

          {/* Editorial Testing Standards */}
          <div className="bg-amber-50/70 rounded-xl border border-amber-200/80 p-5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Editorial Guarantee</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Every voucher listed under {merchant.name} is evaluated by our savings team. We do not generate mock codes or auto-scrape low-quality coupon forums.
            </p>
          </div>

          {/* Related Stores */}
          {relatedStores.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
              <h3 className="font-semibold text-sm text-stone-900 border-b border-stone-100 pb-2">
                Similar Stores You May Like
              </h3>
              <div className="space-y-2.5">
                {relatedStores.map(related => {
                  const relCoupons = db.getCoupons({ merchantId: related.id, status: 'ACTIVE' });
                  return (
                    <button
                      key={related.id}
                      onClick={() => onNavigate(`/stores/${related.slug}`)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition-colors text-left cursor-pointer group"
                    >
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-amber-600">
                          {related.name}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {relCoupons.length} active offers
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Affiliate Disclosure in Sidebar */}
          <div className="text-[11px] text-stone-400 leading-normal p-3 bg-stone-50 rounded-lg border border-stone-200">
            <strong>Disclosure:</strong> CouponBeee earns an affiliate commission if you purchase through our links to {merchant.name}. This does not change the price you pay.
          </div>

        </div>

      </div>
    </div>
  );
};

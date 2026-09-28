import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { ShieldCheck, HeartHandshake, Eye, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SeoHead
        title="About CouponBeee – Our Mission & Testing Methodology"
        description="Learn about CouponBeee's origin, editorial verification process, and commitment to transparent coupon discovery without deceptive spam."
        canonicalPath="/about"
      />

      <Breadcrumbs
        items={[{ label: 'About CouponBeee' }]}
        onNavigate={onNavigate}
      />

      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          About CouponBeee
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          CouponBeee was founded to solve a pervasive problem across the internet: the proliferation of dead, fabricated, and scraped coupon codes.
        </p>
      </div>

      <div className="prose prose-stone text-stone-700 text-sm sm:text-base leading-relaxed space-y-6">
        <h2 className="font-display text-2xl font-bold text-stone-900">
          Our Core Mission
        </h2>
        <p>
          Online shopping should be effortless and transparent. Too often, consumers spend fifteen minutes cycling through coupon aggregators testing invalid codes like &ldquo;SAVE80&rdquo; or &ldquo;DISCOUNT2026&rdquo; that were auto-generated or scraped from decades-old forum threads.
        </p>
        <p>
          CouponBeee approaches coupon discovery with an uncompromising commitment to verified quality over sheer quantity. We maintain a curated collection of genuine online retailers and manually test vouchers in live merchant checkout modules.
        </p>

        <h2 className="font-display text-2xl font-bold text-stone-900 pt-4">
          Our Three Guiding Principles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 not-prose my-6">
          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-sm text-stone-900">Verifiable Testing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We never label a coupon as verified unless an editor has validated it directly. Every verification record stores timestamps and methodology.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <HeartHandshake className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-sm text-stone-900">Honest Business Model</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We disclose our affiliate relationships clearly on every page. We never prioritize non-working codes simply to harvest affiliate clicks.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <Eye className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-sm text-stone-900">No Invasive Software</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              CouponBeee operates entirely in your web browser. We do not require invasive browser extensions that monitor keystrokes or browsing history.
            </p>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-stone-900 pt-4">
          Contact Our Editorial Team
        </h2>
        <p>
          Have questions about a listing or want to report an inaccurate promotional code? Reach out through our <button onClick={() => onNavigate('/contact')} className="text-amber-700 underline font-semibold cursor-pointer">Contact Page</button>.
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { db } from '../lib/store';
import { Check, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    db.subscribeNewsletter(email, 'footer');
    setSubscribed(true);
    setError('');
    setEmail('');
  };

  const handleLink = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Editorial Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 6.5V17.5L12 22L20 17.5V6.5L12 2Z" fill="currentColor" />
                  <path d="M8 11.5L12 9L16 11.5L12 14L8 11.5Z" fill="#1C1917" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                CouponBeee
              </span>
            </div>
            
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              An independent coupon verification platform dedicated to tested promo codes, 
              genuine shopping deals, and transparent savings records.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Weekly Verified Deals Digest
              </h4>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-stone-800/80 p-2.5 rounded-md border border-stone-700">
                  <Check className="w-4 h-4" />
                  <span>Subscribed! We will email you only verified promotional alerts.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 flex-1"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => handleLink('/stores')} className="hover:text-white transition-colors cursor-pointer">
                  All Stores Directory
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/coupons')} className="hover:text-white transition-colors cursor-pointer">
                  Verified Coupons
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/deals')} className="hover:text-white transition-colors cursor-pointer">
                  Direct Deals & Sales
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/categories')} className="hover:text-white transition-colors cursor-pointer">
                  Store Categories
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/blog')} className="hover:text-white transition-colors cursor-pointer">
                  Savings Guides & Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
              Top Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => handleLink('/categories/hosting-cloud')} className="hover:text-white transition-colors cursor-pointer">
                  Hosting & Cloud
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/categories/developer-software')} className="hover:text-white transition-colors cursor-pointer">
                  Developer Software
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/categories/electronics-audio')} className="hover:text-white transition-colors cursor-pointer">
                  Electronics & Audio
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/categories/fashion-apparel')} className="hover:text-white transition-colors cursor-pointer">
                  Sustainable Fashion
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/categories/home-workspace')} className="hover:text-white transition-colors cursor-pointer">
                  Home & Workspace
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
              Transparency & Legal
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => handleLink('/about')} className="hover:text-white transition-colors cursor-pointer">
                  About CouponBeee
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/affiliate-disclosure')} className="hover:text-white transition-colors cursor-pointer">
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/terms')} className="hover:text-white transition-colors cursor-pointer">
                  Terms of Use
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/cookie-policy')} className="hover:text-white transition-colors cursor-pointer">
                  Cookie Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Editorial
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/sitemap.xml')} className="hover:text-white transition-colors cursor-pointer">
                  XML Sitemap
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Note */}
        <div className="mt-12 pt-8 border-t border-stone-800 text-xs text-stone-500 leading-relaxed space-y-3">
          <p>
            <strong className="text-stone-400">Editorial Independence & Affiliate Disclosure:</strong> CouponBeee is a free savings discovery resource. When you click outbound store links or redeem listed promotional vouchers, we may receive an affiliate commission from the merchant partner at zero additional cost to you. This compensation does not influence our editorial assessments or verification findings. We only label codes as "Tested & Verified" after staff checkout evaluations.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 text-stone-400">
            <div>
              &copy; {new Date().getFullYear()} CouponBeee. All rights reserved. Registered trademark.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Verification System Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

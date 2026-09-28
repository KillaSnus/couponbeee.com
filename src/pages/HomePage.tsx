import React, { useState } from 'react';
import { useDb } from '../lib/useDb';
import { Coupon, Merchant, Deal } from '../types';
import { CouponCard } from '../components/CouponCard';
import { StoreCard } from '../components/StoreCard';
import { DealCard } from '../components/DealCard';
import { SeoHead } from '../components/SeoHead';
import { ASSETS } from '../assets/images';
import { 
  Search, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, 
  HelpCircle, ChevronDown, ChevronUp, Zap, Clock, ExternalLink,
  Sliders, DollarSign, Award, ThumbsUp, ShoppingBag, Chrome, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenCodeModal: (coupon: Coupon, merchant?: Merchant) => void;
  onOpenReportModal: (coupon: Coupon) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenCodeModal,
  onOpenReportModal,
}) => {
  const db = useDb();
  const [heroSearch, setHeroSearch] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'hosting' | 'tech' | 'picks'>('all');
  const [monthlySpend, setMonthlySpend] = useState<number>(350);
  const [extensionInstalled, setExtensionInstalled] = useState(false);

  const allMerchants = db.getMerchants();
  const trendingStores = db.getMerchants({ popularOnly: true }).slice(0, 8);
  const popularCategories = db.getCategories().slice(0, 6);
  const verifiedCoupons = db.getCoupons({ verification: 'TESTED' });
  const editorsPicks = db.getCoupons({ editorsPickOnly: true });
  const latestDeals = db.getDeals({ featuredOnly: true }).slice(0, 4);
  const faqs = db.getFaqs();

  // Filter coupons based on active tab
  const displayedCoupons = React.useMemo(() => {
    if (activeTab === 'picks') return editorsPicks.slice(0, 6);
    if (activeTab === 'hosting') {
      const hostingCat = db.getCategories().find(c => c.slug.includes('hosting'));
      return verifiedCoupons.filter(c => {
        const m = db.getMerchantById(c.merchantId);
        return m?.categoryIds.includes(hostingCat?.id || '') || m?.slug.includes('host');
      }).slice(0, 6);
    }
    if (activeTab === 'tech') {
      return verifiedCoupons.filter(c => {
        const m = db.getMerchantById(c.merchantId);
        return m?.categoryIds.some(cat => cat.includes('software') || cat.includes('electronics'));
      }).slice(0, 6);
    }
    return verifiedCoupons.slice(0, 8);
  }, [activeTab, verifiedCoupons, editorsPicks, db]);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      onNavigate('/stores');
    }
  };

  const estimatedYearlySavings = Math.round(monthlySpend * 12 * 0.18);

  const handleInstallExtension = () => {
    setExtensionInstalled(true);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-20 pb-20">
      <SeoHead
        title="CouponBeee – Verified Coupons, Promo Codes & Shopping Deals"
        description="Find verified coupons, tested promo codes, and real shopping discounts across top stores. Independent coupon discovery with transparent testing records."
        canonicalPath="/"
      />

      {/* Live Verified Activity Ticker */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 border-b border-stone-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Live Testing Feed:</span>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto text-[11px] font-medium no-scrollbar py-0.5">
            <span className="shrink-0 flex items-center gap-1.5 text-stone-300">
              <Zap className="w-3 h-3 text-amber-400" />
              <span><strong>Hostinger</strong> 85% Off code verified 4m ago</span>
            </span>
            <span className="shrink-0 text-stone-500">&bull;</span>
            <span className="shrink-0 flex items-center gap-1.5 text-stone-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span><strong>Nike</strong> 25% Member code saved $32 in California</span>
            </span>
            <span className="shrink-0 text-stone-500">&bull;</span>
            <span className="shrink-0 flex items-center gap-1.5 text-stone-300">
              <Zap className="w-3 h-3 text-amber-400" />
              <span><strong>NordVPN</strong> 74% Off deal activated 11m ago</span>
            </span>
            <span className="shrink-0 text-stone-500">&bull;</span>
            <span className="shrink-0 flex items-center gap-1.5 text-stone-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span><strong>Amazon</strong> Daily Lightning deal claimed</span>
            </span>
          </div>
          <span className="hidden md:inline-block text-[10px] text-stone-400 shrink-0">
            99.2% Verification Accuracy
          </span>
        </div>
      </div>

      {/* Hero Section with 3D Mascot Artwork */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-stone-50/60 to-white pt-10 pb-16 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline, Search, Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Quiet unboxed kicker */}
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100/80 border border-amber-300/80 px-3 py-1 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Independent Editorial Coupon Testing</span>
                <span aria-hidden="true">&middot;</span>
                <span className="text-amber-800 font-semibold">Zero Non-Working Codes</span>
              </div>

              {/* Exact user headline required */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
                Find Verified <span className="text-amber-600 underline decoration-amber-400/60 underline-offset-8">Coupons</span> &amp; Deals
              </h1>

              {/* Completely original supporting text */}
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                Tired of copying non-working voucher codes? CouponBeee audits promotional vouchers directly on merchant checkout consoles. Save time and money with genuine, verified offers.
              </p>

              {/* Large Search Field & Primary CTA */}
              <form onSubmit={handleHeroSubmit} className="max-w-xl">
                <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-white rounded-2xl border-2 border-stone-300 hover:border-amber-400 shadow-md focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15 transition-all">
                  <div className="relative flex-1 flex items-center pl-3">
                    <Search className="w-5 h-5 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={e => setHeroSearch(e.target.value)}
                      placeholder="Search stores, brands or coupons (e.g. Hostinger, Nike, Amazon)"
                      className="w-full pl-3 pr-2 py-2.5 text-stone-900 text-sm placeholder-stone-400 bg-transparent focus:outline-none font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-7 py-3 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-stone-950 text-sm font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm hover:shadow"
                  >
                    Find Deals
                  </button>
                </div>
              </form>

              {/* Quick Jump Brand Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 pt-1">
                <span className="font-bold text-stone-800">Popular Stores:</span>
                {['Hostinger', 'Amazon', 'Nike', 'Apple', 'NordVPN', 'Best Buy', 'Canva'].map(name => {
                  const s = allMerchants.find(m => m.name.toLowerCase() === name.toLowerCase()) || { slug: name.toLowerCase() };
                  return (
                    <button
                      key={name}
                      onClick={() => onNavigate(`/stores/${s.slug}`)}
                      className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-lg text-stone-700 font-semibold transition-all cursor-pointer shadow-2xs"
                    >
                      {name}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Right Column: 3D Mascot Artwork */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-200/60 bg-stone-900 aspect-[16/11] group">
                <img
                  src={ASSETS.hero3D}
                  alt="CouponBeee 3D Honeybee mascot with glowing vouchers and discount tags"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Checkout Audit Engine</span>
                  </div>
                  <p className="text-xs text-stone-200 leading-snug">
                    Every voucher is tested across live shopping carts before receiving our verified seal.
                  </p>
                </div>

                {/* Floating 3D Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/60 shadow-lg text-xs font-black text-amber-950 flex items-center gap-1.5 animate-bounce">
                  <span>🐝</span>
                  <span>Average $38 Saved</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Partner Banner: Hostinger Special */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-amber-500/30">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured Partner of the Month</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                Hostinger Web Hosting &amp; Cloud: Up to 85% OFF
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                LiteSpeed servers, free custom domain, unlimited SSL, and 24/7 priority support. Stack our verified coupon code for an additional 10% reduction.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => onNavigate('/stores/hostinger')}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg cursor-pointer flex items-center gap-2"
              >
                <span>View Hostinger Codes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Coupon Feed with Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tested &amp; Guaranteed Working</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Verified Coupons &amp; Promo Codes
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Audited by CouponBeee editors. Click &ldquo;Show Code&rdquo; to reveal and open the merchant.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Offers
            </button>
            <button
              onClick={() => setActiveTab('picks')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'picks' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🔥 Top Picks</span>
            </button>
            <button
              onClick={() => setActiveTab('hosting')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'hosting' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Hosting &amp; Cloud
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'tech' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tech &amp; Tools
            </button>
          </div>
        </div>

        {/* Coupon Grid */}
        <div className="space-y-4">
          {displayedCoupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onOpenCodeModal={onOpenCodeModal}
              onOpenReportModal={onOpenReportModal}
              onNavigateMerchant={slug => onNavigate(`/stores/${slug}`)}
            />
          ))}
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => onNavigate('/coupons')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span>Explore All 5,000+ Verified Coupons</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3D Browser Extension & Shopping Assistant Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-amber-100/70 rounded-3xl border border-amber-200/80 p-8 sm:p-12 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs font-bold">
                <Chrome className="w-3.5 h-3.5" />
                <span>Free Browser Extension</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-black text-stone-900 leading-tight">
                Never Pay Full Price Again with BeeBot&trade; Auto-Apply
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Shop normally at Hostinger, Amazon, Nike, Best Buy, and thousands of top stores. BeeBot automatically tests all working promo codes at checkout and applies the largest discount in seconds.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <span className="font-bold text-xs text-stone-900 block">1-Click Auto Apply</span>
                  <span className="text-[11px] text-stone-500">Tests 10+ codes in 3 seconds</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <span className="font-bold text-xs text-stone-900 block">Cash Back Alerts</span>
                  <span className="text-[11px] text-stone-500">Up to 15% cash back at checkout</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <span className="font-bold text-xs text-stone-900 block">100% Free &amp; Private</span>
                  <span className="text-[11px] text-stone-500">Zero data tracking or selling</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleInstallExtension}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Chrome className="w-4 h-4 text-amber-400" />
                  <span>{extensionInstalled ? 'Added to Chrome! 🎉' : 'Add to Chrome - It’s Free'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-amber-300 max-w-sm w-full bg-stone-900">
                <img
                  src={ASSETS.beeBot3D}
                  alt="CouponBeee 3D BeeBot shopping assistant"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Annual Savings Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Interactive Savings Calculator</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-stone-900">
                Calculate Your Real Annual Shopping Savings
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Based on our average verified user savings rate of 18% across tech, cloud hosting, fashion, and electronics.
              </p>
            </div>

            {/* Slider */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span>Estimated Monthly Online Spend:</span>
                <span className="font-display text-xl text-amber-900">${monthlySpend} / month</span>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="50"
                value={monthlySpend}
                onChange={e => setMonthlySpend(Number(e.target.value))}
                className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                <span>$50/mo</span>
                <span>$1,000/mo</span>
                <span>$2,500/mo</span>
              </div>

              {/* Result banner */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
                <div>
                  <span className="text-[11px] text-stone-500 uppercase font-bold block">Annual Money Saved</span>
                  <span className="font-display text-3xl sm:text-4xl font-black text-emerald-600 block">
                    ${estimatedYearlySavings}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 uppercase font-bold block">Cash Back Bonuses</span>
                  <span className="font-display text-3xl sm:text-4xl font-black text-amber-600 block">
                    ${Math.round(estimatedYearlySavings * 0.15)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trending Stores Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900 tracking-tight">
              Trending Stores &amp; Brands
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Top requested merchants with active promotional discounts this week
            </p>
          </div>
          <button
            onClick={() => onNavigate('/stores')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All Stores</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingStores.map(merchant => (
            <StoreCard
              key={merchant.id}
              merchant={merchant}
              onSelect={slug => onNavigate(`/stores/${slug}`)}
            />
          ))}
        </div>
      </section>

      {/* 3D Savings Vault: Why Shoppers Trust CouponBeee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800">
          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-lg border border-amber-500/30">
            <img
              src={ASSETS.savingsVault3D}
              alt="CouponBeee 3D Savings Vault with gold tokens and security shield"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Independent Verification Guarantee</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
              The Transparent Coupon Platform Built for Trust
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Unlike generic coupon aggregators that scrape expired codes or display fake timer clocks, CouponBeee enforces rigorous editorial standards:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Manual Cart Audits</span>
                </span>
                <p className="text-[11px] text-stone-400">
                  Every code is tested on live checkouts prior to listing.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Community Voting</span>
                </span>
                <p className="text-[11px] text-stone-400">
                  Members vote in real-time if a voucher worked or expired.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transparent Tracking</span>
                </span>
                <p className="text-[11px] text-stone-400">
                  Approved affiliate links with zero deceptive redirects.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cash Back Sharing</span>
                </span>
                <p className="text-[11px] text-stone-400">
                  We share up to 80% of affiliate rewards back to our users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Browse promotions grouped by industry and shopping domain
            </p>
          </div>
          <button
            onClick={() => onNavigate('/categories')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {popularCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate(`/categories/${cat.slug}`)}
              className="group p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-sm transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-stone-400 block mt-0.5">Explore deals</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Editorial Guides & Savings Blog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900 tracking-tight">
              Shopping Advice &amp; Savings Guides
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Independent shopping research, coupon stacking guides, and merchant comparisons
            </p>
          </div>
          <button
            onClick={() => onNavigate('/blog')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {db.getBlogPosts().slice(0, 3).map(post => (
            <div
              key={post.id}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/9] bg-stone-100 overflow-hidden relative">
                <img
                  src={post.featuredImage || ASSETS.blogGuideCover}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Editorial Guide
                  </span>
                  <h3 className="font-display text-sm sm:text-base font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                  <span>{post.readTimeMinutes} min read</span>
                  <span className="text-amber-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Read guide &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-500">
            Everything you need to know about our coupon testing methodology and verification
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map(faq => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/70"
                >
                  <span className="text-xs sm:text-sm font-semibold text-stone-900">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

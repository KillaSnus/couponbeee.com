import React, { useState, useMemo } from 'react';
import { useDb } from '../lib/useDb';
import { Coupon, Merchant } from '../types';
import { CouponCard } from '../components/CouponCard';
import { StoreCard } from '../components/StoreCard';
import { DealCard } from '../components/DealCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { Search, Store, Tag, BookOpen, Sparkles, X } from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
  onNavigate: (path: string) => void;
  onOpenCodeModal: (coupon: Coupon, merchant?: Merchant) => void;
  onOpenReportModal: (coupon: Coupon) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  onNavigate,
  onOpenCodeModal,
  onOpenReportModal,
}) => {
  const db = useDb();
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'stores' | 'coupons' | 'deals' | 'blog'>('all');

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) {
      return {
        stores: db.getMerchants({ popularOnly: true }).slice(0, 6),
        coupons: db.getCoupons({ editorsPickOnly: true }).slice(0, 6),
        deals: db.getDeals().slice(0, 4),
        blog: db.getBlogPosts().slice(0, 2),
      };
    }

    const stores = db.getMerchants({ query: trimmed, includeFullCatalog: true });
    const coupons = db.getCoupons({ searchQuery: trimmed });
    const deals = db.getDeals().filter(d => 
      d.title.toLowerCase().includes(trimmed) || 
      d.description.toLowerCase().includes(trimmed)
    );
    const blog = db.getBlogPosts().filter(b =>
      b.title.toLowerCase().includes(trimmed) ||
      b.content.toLowerCase().includes(trimmed)
    );

    return { stores, coupons, deals, blog };
  }, [trimmed, db]);

  const totalResultsCount = 
    results.stores.length + 
    results.coupons.length + 
    results.deals.length + 
    results.blog.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Explicitly noindex internal search queries per SEO guidelines */}
      <SeoHead
        title={trimmed ? `Search: "${query}"` : 'Site-Wide Search'}
        description="Search verified coupons, merchants, promo vouchers, and shopping guides."
        noIndex={true}
      />

      <Breadcrumbs
        items={[{ label: 'Search' }]}
        onNavigate={onNavigate}
      />

      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="font-display text-3xl font-bold text-stone-900 tracking-tight">
          {trimmed ? `Search results for "${query}"` : 'Search Coupons & Stores'}
        </h1>

        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stores, brands, promotional codes, or guides..."
            className="w-full bg-white border border-stone-300 rounded-xl pl-12 pr-10 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 shadow-xs"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'all'
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          All Results ({totalResultsCount})
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'stores'
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Stores ({results.stores.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'coupons'
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Coupons ({results.coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('deals')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'deals'
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Direct Deals ({results.deals.length})
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'blog'
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Guides ({results.blog.length})
        </button>
      </div>

      {/* Results Content */}
      <div className="space-y-10">
        
        {/* Stores Section */}
        {(activeTab === 'all' || activeTab === 'stores') && results.stores.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-700" />
              <span>Stores ({results.stores.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.stores.map(merchant => (
                <StoreCard
                  key={merchant.id}
                  merchant={merchant}
                  onSelect={s => onNavigate(`/stores/${s}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Coupons Section */}
        {(activeTab === 'all' || activeTab === 'coupons') && results.coupons.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-700" />
              <span>Coupons &amp; Promo Codes ({results.coupons.length})</span>
            </h2>
            <div className="space-y-4">
              {results.coupons.map(coupon => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onOpenCodeModal={onOpenCodeModal}
                  onOpenReportModal={onOpenReportModal}
                  onNavigateMerchant={s => onNavigate(`/stores/${s}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Deals Section */}
        {(activeTab === 'all' || activeTab === 'deals') && results.deals.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Direct Deals ({results.deals.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.deals.map(deal => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onNavigateMerchant={s => onNavigate(`/stores/${s}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Blog Guides */}
        {(activeTab === 'all' || activeTab === 'blog') && results.blog.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Editorial Savings Guides ({results.blog.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.blog.map(post => (
                <div
                  key={post.id}
                  onClick={() => onNavigate(`/blog/${post.slug}`)}
                  className="p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-400 transition-colors cursor-pointer"
                >
                  <h3 className="font-semibold text-sm text-stone-900 hover:text-amber-600">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {totalResultsCount === 0 && (
          <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
            <Search className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-display text-lg font-bold text-stone-800">
              No Matches Found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn&rsquo;t find anything matching &ldquo;{query}&rdquo;. Check spelling or explore popular categories.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

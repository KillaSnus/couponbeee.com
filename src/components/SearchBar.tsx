import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/store';
import { Search, X, Store, Tag, Sparkles, Folder, BookOpen, ArrowRight } from 'lucide-react';
import { Merchant, Coupon, Deal, Category, BlogPost } from '../types';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onSelectCoupon: (coupon: Coupon) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectCoupon,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate('/search');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Multi-entity search results
  const matchedMerchants = trimmed 
    ? db.getMerchants({ query: trimmed, includeFullCatalog: true }).slice(0, 5)
    : db.getMerchants({ popularOnly: true }).slice(0, 5);

  const matchedCoupons = trimmed
    ? db.getCoupons({ searchQuery: trimmed }).slice(0, 4)
    : db.getCoupons({ editorsPickOnly: true }).slice(0, 4);

  const matchedCategories = trimmed
    ? db.getCategories().filter(c => c.name.toLowerCase().includes(trimmed) || c.description.toLowerCase().includes(trimmed)).slice(0, 3)
    : [];

  const matchedBlogPosts = trimmed
    ? db.getBlogPosts().filter(b => b.title.toLowerCase().includes(trimmed) || b.excerpt.toLowerCase().includes(trimmed)).slice(0, 3)
    : [];

  const hasResults = matchedMerchants.length > 0 || matchedCoupons.length > 0 || matchedCategories.length > 0 || matchedBlogPosts.length > 0;

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmed) {
      onNavigate(`/search?q=${encodeURIComponent(trimmed)}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Box */}
        <form onSubmit={handleFullSearch} className="relative flex items-center border-b border-stone-200 px-4 py-3.5">
          <Search className="w-5 h-5 text-stone-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stores, brands, coupons, or categories..."
            className="w-full pl-3 pr-10 text-stone-900 text-sm sm:text-base placeholder-stone-400 bg-transparent focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[11px] font-mono text-stone-400 bg-stone-100 rounded border border-stone-200">ESC</kbd>
          )}
        </form>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1 divide-y divide-stone-100">
          
          {/* Section: Stores / Merchants */}
          {matchedMerchants.length > 0 && (
            <div className="space-y-2 pt-2 first:pt-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 px-2">
                <Store className="w-3.5 h-3.5" />
                {trimmed ? 'Matching Stores' : 'Trending Stores'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {matchedMerchants.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onNavigate(`/stores/${m.slug}`);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-50 text-left transition-colors cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-xs text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-900 shrink-0">
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-stone-900 group-hover:text-amber-600 truncate">
                        {m.name}
                      </div>
                      <div className="text-xs text-stone-500 truncate">
                        {m.shortDesc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Verified Coupons */}
          {matchedCoupons.length > 0 && (
            <div className="space-y-2 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 px-2">
                <Tag className="w-3.5 h-3.5" />
                {trimmed ? 'Matching Coupons' : "Editor's Pick Coupons"}
              </span>
              <div className="space-y-1">
                {matchedCoupons.map(c => {
                  const m = db.getMerchantById(c.merchantId);
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCoupon(c);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-50 text-left transition-colors cursor-pointer group"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="text-xs text-stone-500 font-medium">
                          {m?.name || 'Store'} · <span className="text-amber-800 font-semibold">{c.discountValue}</span>
                        </div>
                        <div className="text-sm font-medium text-stone-900 group-hover:text-amber-600 truncate">
                          {c.title}
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-semibold px-2.5 py-1 bg-amber-50 group-hover:bg-amber-500 group-hover:text-stone-950 text-amber-900 rounded border border-amber-200 transition-colors">
                        View Code
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Categories */}
          {matchedCategories.length > 0 && (
            <div className="space-y-2 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 px-2">
                <Folder className="w-3.5 h-3.5" />
                Categories
              </span>
              <div className="flex flex-wrap gap-2 px-2">
                {matchedCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onNavigate(`/categories/${cat.slug}`);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md cursor-pointer transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Blog Articles */}
          {matchedBlogPosts.length > 0 && (
            <div className="space-y-2 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 px-2">
                <BookOpen className="w-3.5 h-3.5" />
                Guides & Articles
              </span>
              <div className="space-y-1">
                {matchedBlogPosts.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onNavigate(`/blog/${b.slug}`);
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-stone-50 cursor-pointer group"
                  >
                    <div className="text-sm font-medium text-stone-900 group-hover:text-amber-600">
                      {b.title}
                    </div>
                    <div className="text-xs text-stone-500 line-clamp-1">
                      {b.excerpt}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!hasResults && trimmed && (
            <div className="py-12 text-center text-stone-500 space-y-2">
              <p className="text-sm">No results found for &ldquo;{trimmed}&rdquo;</p>
              <p className="text-xs text-stone-400">
                Try searching for a store name like &ldquo;CloudForge&rdquo;, &ldquo;Lumina&rdquo;, or &ldquo;Hosting&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Footer Jump CTA */}
        {trimmed && (
          <div className="bg-stone-50 p-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <span>Press Enter for full results</span>
            <button
              onClick={handleFullSearch}
              className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800 cursor-pointer"
            >
              <span>See all results for &ldquo;{trimmed}&rdquo;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

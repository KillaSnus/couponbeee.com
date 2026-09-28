import React, { useState } from 'react';
import { useDb } from '../lib/useDb';
import { DealCard } from '../components/DealCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { Tag, Sparkles } from 'lucide-react';

interface DealsPageProps {
  onNavigate: (path: string) => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ onNavigate }) => {
  const db = useDb();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const allDeals = db.getDeals();
  const categories = db.getCategories();

  const filteredDeals = selectedCategory === 'ALL'
    ? allDeals
    : allDeals.filter(d => d.categoryId === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHead
        title="Direct Shopping Deals, Sales & Markdowns (2026)"
        description="Save immediately with direct promotional price drops and seasonal sales that require zero coupon codes at checkout."
        canonicalPath="/deals"
      />

      <Breadcrumbs
        items={[{ label: 'Deals' }]}
        onNavigate={onNavigate}
      />

      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Direct Shopping Deals &amp; Markdowns
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          No promotional code required. These vetted offers represent direct price reductions, seasonal clearance specials, and official bundle discounts applied automatically on store sites.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            selectedCategory === 'ALL'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          All Deals ({allDeals.length})
        </button>
        {categories.map(cat => {
          const count = allDeals.filter(d => d.categoryId === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map(deal => (
          <DealCard
            key={deal.id}
            deal={deal}
            onNavigateMerchant={slug => onNavigate(`/stores/${slug}`)}
          />
        ))}
      </div>
    </div>
  );
};

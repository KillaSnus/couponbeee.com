import React from 'react';
import { useDb } from '../lib/useDb';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { Folder, ArrowRight, Store, Tag } from 'lucide-react';

interface CategoriesPageProps {
  onNavigate: (path: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const db = useDb();
  const categories = db.getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHead
        title="Coupon Categories – Browse Discounts by Domain (2026)"
        description="Find verified promo vouchers organized by industry: Hosting, Developer Tools, Electronics, Fashion, Home Decor, and Travel."
        canonicalPath="/categories"
      />

      <Breadcrumbs
        items={[{ label: 'Categories' }]}
        onNavigate={onNavigate}
      />

      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Browse Categories
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          Navigate verified coupons and merchant discounts tailored to your specific shopping requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => onNavigate(`/categories/${cat.slug}`)}
            className="group bg-white rounded-xl border border-stone-200 p-6 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-900 mb-4 group-hover:scale-105 transition-transform">
                <Folder className="w-5 h-5" />
              </div>

              <h2 className="font-display text-xl font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                {cat.name}
              </h2>

              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-stone-800 tabular-nums">
                  {cat.storeCount} Stores
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="tabular-nums">
                  {cat.couponCount} Coupons
                </span>
              </div>
              <span className="inline-flex items-center gap-1 font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

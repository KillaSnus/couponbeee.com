import React from 'react';
import { useDb } from '../lib/useDb';
import { Coupon, Merchant } from '../types';
import { CouponCard } from '../components/CouponCard';
import { StoreCard } from '../components/StoreCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { Folder, ArrowRight } from 'lucide-react';

interface CategoryDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onOpenCodeModal: (coupon: Coupon, merchant?: Merchant) => void;
  onOpenReportModal: (coupon: Coupon) => void;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenCodeModal,
  onOpenReportModal,
}) => {
  const db = useDb();
  const category = db.getCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <SeoHead
          title="Category Not Found"
          description="The requested category could not be found."
          noIndex={true}
        />
        <h1 className="font-display text-2xl font-bold text-stone-900">
          Category Not Found
        </h1>
        <button
          onClick={() => onNavigate('/categories')}
          className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 cursor-pointer"
        >
          View All Categories
        </button>
      </div>
    );
  }

  const categoryStores = db.getMerchants().filter(m => m.categoryIds.includes(category.id));
  const categoryCoupons = db.getCoupons({ categoryId: category.id, status: 'ACTIVE' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SeoHead
        title={`${category.name} Coupons & Promo Codes (2026)`}
        description={category.description || `Browse verified promo codes and discount vouchers for ${category.name}.`}
        canonicalPath={`/categories/${category.slug}`}
      />

      <Breadcrumbs
        items={[
          { label: 'Categories', path: '/categories' },
          { label: category.name },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
          <Folder className="w-4 h-4 text-amber-600" />
          <span>Category Directory</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          {category.name} Promo Codes &amp; Deals
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Coupons in Category */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-stone-900 tracking-tight">
            Active {category.name} Coupons ({categoryCoupons.length})
          </h2>
        </div>

        {categoryCoupons.length > 0 ? (
          <div className="space-y-4">
            {categoryCoupons.map(coupon => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onOpenCodeModal={onOpenCodeModal}
                onOpenReportModal={onOpenReportModal}
                onNavigateMerchant={s => onNavigate(`/stores/${s}`)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-xl border border-stone-200 text-center text-xs text-stone-500">
            No active coupons currently listed under this category. Check back soon as our team updates codes daily.
          </div>
        )}
      </section>

      {/* Stores in Category */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-stone-900 tracking-tight">
          Featured {category.name} Stores ({categoryStores.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryStores.map(merchant => (
            <StoreCard
              key={merchant.id}
              merchant={merchant}
              onSelect={s => onNavigate(`/stores/${s}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

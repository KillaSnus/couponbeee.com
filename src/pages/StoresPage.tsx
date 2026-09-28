import React, { useState, useMemo } from 'react';
import { useDb } from '../lib/useDb';
import { StoreCard } from '../components/StoreCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { Search, Filter, Store, Sparkles } from 'lucide-react';

interface StoresPageProps {
  onNavigate: (path: string) => void;
}

const ALPHABET = ['ALL', '#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export const StoresPage: React.FC<StoresPageProps> = ({ onNavigate }) => {
  const db = useDb();
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyActiveCoupons, setOnlyActiveCoupons] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'coupons' | 'recent'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18;

  const allCategories = db.getCategories();
  const allMerchants = useMemo(() => {
    return db.getMerchants({ includeFullCatalog: true });
  }, [db]);

  const filteredMerchants = useMemo(() => {
    return allMerchants.filter(merchant => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          merchant.name.toLowerCase().includes(q) ||
          merchant.shortDesc.toLowerCase().includes(q) ||
          merchant.domain.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Letter filter
      if (selectedLetter !== 'ALL') {
        if (selectedLetter === '#') {
          if (!/^[0-9]/.test(merchant.name)) return false;
        } else {
          if (!merchant.name.toUpperCase().startsWith(selectedLetter)) return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'ALL') {
        if (!merchant.categoryIds.includes(selectedCategory)) return false;
      }

      // Only active coupons
      if (onlyActiveCoupons) {
        const activeCount = db.getCoupons({ merchantId: merchant.id, status: 'ACTIVE' }).length;
        if (activeCount === 0) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'coupons') {
        const countA = db.getCoupons({ merchantId: a.id, status: 'ACTIVE' }).length;
        const countB = db.getCoupons({ merchantId: b.id, status: 'ACTIVE' }).length;
        return countB - countA;
      } else if (sortBy === 'recent') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });
  }, [allMerchants, searchQuery, selectedLetter, selectedCategory, onlyActiveCoupons, sortBy, db]);

  // Pagination
  const totalPages = Math.ceil(filteredMerchants.length / pageSize) || 1;
  const paginatedMerchants = filteredMerchants.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHead
        title="Store Directory – Browse Verified Brand Vouchers & Promo Codes"
        description="Explore hundreds of verified online merchants and retailers. Filter alphabetically, by category, or by active discount availability."
        canonicalPath="/stores"
      />

      <Breadcrumbs
        items={[{ label: 'Stores' }]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Stores &amp; Brands Directory
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          Browse verified merchants and online retailers offering audited discount promo codes, flash markdowns, and exclusive partner vouchers.
        </p>
      </div>

      {/* Alphabet Bar */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {ALPHABET.map(letter => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedLetter === letter
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-stone-50 p-4 rounded-xl border border-stone-200">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter stores by name or domain..."
            className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Dropdowns & Checkbox */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {allCategories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="name">Sort: A to Z</option>
            <option value="coupons">Sort: Most Coupons</option>
            <option value="recent">Sort: Recently Updated</option>
          </select>

          {/* Checkbox: Active Coupons only */}
          <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyActiveCoupons}
              onChange={e => {
                setOnlyActiveCoupons(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded border-stone-300 text-amber-500 focus:ring-amber-400"
            />
            <span>Active Coupons Only</span>
          </label>
        </div>
      </div>

      {/* Store Count Indicator */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong className="text-stone-900">{filteredMerchants.length}</strong> stores
        </span>
        {filteredMerchants.length > 0 && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      {/* Store Cards Grid */}
      {paginatedMerchants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedMerchants.map(merchant => (
            <StoreCard
              key={merchant.id}
              merchant={merchant}
              onSelect={slug => onNavigate(`/stores/${slug}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <Store className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-display text-lg font-bold text-stone-800">
            No Stores Found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No merchants matched your current filter selections. Try clearing your search query or choosing another letter.
          </p>
          <button
            onClick={() => {
              setSelectedLetter('ALL');
              setSelectedCategory('ALL');
              setSearchQuery('');
              setOnlyActiveCoupons(false);
            }}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

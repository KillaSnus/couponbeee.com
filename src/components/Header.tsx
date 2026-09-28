import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ShieldCheck, Tag, ArrowRight, User, PlusCircle, Bookmark, DollarSign } from 'lucide-react';
import { authService, UserProfile } from '../lib/firebase';
import { AuthModal } from './AuthModal';
import { UserProfileModal } from './UserProfileModal';
import { Coupon } from '../types';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenCodeModal?: (coupon: Coupon) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenSearch, onOpenCodeModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    return authService.subscribe(u => setUser(u));
  }, []);

  const navLinks = [
    { label: 'Stores', path: '/stores' },
    { label: 'Coupons', path: '/coupons' },
    { label: 'Deals', path: '/deals' },
    { label: 'Categories', path: '/categories' },
    { label: 'Blog', path: '/blog' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Zone 1: Brand Wordmark with modern 3D bee badge */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
            aria-label="CouponBeee Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-stone-950 font-bold shadow-sm group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl select-none" role="img" aria-label="Bee">🐝</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-extrabold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors leading-none">
                CouponBeee
              </span>
              <span className="text-[10px] text-amber-700 font-semibold tracking-wider uppercase mt-0.5">
                Verified Codes
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navLinks.map(link => {
              const isActive = currentPath === link.path || currentPath.startsWith(link.path + '/');
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`transition-colors py-1 cursor-pointer relative ${
                    isActive 
                      ? 'text-stone-950 font-bold' 
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Search + User Account + Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search command bar trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-500 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors cursor-pointer border border-stone-200"
              aria-label="Search coupons and stores"
            >
              <Search className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Search 5,000+ brands...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-mono bg-white text-stone-500 rounded border border-stone-200">⌘K</kbd>
            </button>

            {/* User Auth or Profile Button */}
            {user ? (
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-stone-900 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (user.displayName?.[0] || 'U').toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.displayName || 'Account'}</span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-200/70 px-1.5 py-0.2 rounded-full">
                  ${user.cashbackBalance.toFixed(0)}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  <span>Join Free</span>
                  <span className="text-[10px] text-amber-900 font-extrabold bg-amber-200 px-1 rounded">+$10</span>
                </button>
              </div>
            )}

            {/* Admin Panel button */}
            <button
              onClick={() => handleNav('/admin')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentPath.startsWith('/admin')
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              Admin
            </button>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 cursor-pointer rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map(link => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    className={`text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200' 
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="text-xs font-semibold text-amber-800 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Wallet &amp; Wishlist (${user.cashbackBalance.toFixed(2)})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2 bg-amber-400 text-stone-950 font-bold text-xs rounded-lg text-center"
                >
                  Claim $10 Bonus &amp; Register Free
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />

      <UserProfileModal
        user={user}
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onOpenCodeModal={coupon => {
          onOpenCodeModal?.(coupon);
        }}
      />
    </>
  );
};

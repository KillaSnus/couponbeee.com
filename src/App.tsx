import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchBar } from './components/SearchBar';
import { CouponCodeModal } from './components/CouponCodeModal';
import { ReportModal } from './components/ReportModal';

// Pages
import { HomePage } from './pages/HomePage';
import { StoresPage } from './pages/StoresPage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { CouponsPage } from './pages/CouponsPage';
import { DealsPage } from './pages/DealsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AffiliateDisclosurePage } from './pages/AffiliateDisclosurePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { OutboundRedirectPage } from './pages/OutboundRedirectPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SitemapXmlPage } from './pages/SitemapXmlPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { Coupon, Merchant } from './types';
import { db } from './lib/store';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search || '/';
    }
    return '/';
  });

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeCodeCoupon, setActiveCodeCoupon] = useState<{ coupon: Coupon; merchant?: Merchant } | null>(null);
  const [reportingCoupon, setReportingCoupon] = useState<Coupon | null>(null);

  // Sync browser URL with popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenCodeModal = (coupon: Coupon, merchant?: Merchant) => {
    const m = merchant || db.getMerchantById(coupon.merchantId);
    setActiveCodeCoupon({ coupon, merchant: m });
  };

  const handleOpenReportModal = (coupon: Coupon) => {
    setReportingCoupon(coupon);
  };

  // Route Dispatcher
  const renderCurrentView = () => {
    const cleanPath = currentPath.split('?')[0];

    // Homepage
    if (cleanPath === '' || cleanPath === '/') {
      return (
        <HomePage
          onNavigate={navigate}
          onOpenCodeModal={handleOpenCodeModal}
          onOpenReportModal={handleOpenReportModal}
        />
      );
    }

    // Stores Directory
    if (cleanPath === '/stores') {
      return <StoresPage onNavigate={navigate} />;
    }

    // Store Detail: /stores/:slug
    if (cleanPath.startsWith('/stores/')) {
      const slug = cleanPath.replace('/stores/', '');
      return (
        <StoreDetailPage
          slug={slug}
          onNavigate={navigate}
          onOpenCodeModal={handleOpenCodeModal}
          onOpenReportModal={handleOpenReportModal}
        />
      );
    }

    // Coupons Directory
    if (cleanPath === '/coupons') {
      return (
        <CouponsPage
          onNavigate={navigate}
          onOpenCodeModal={handleOpenCodeModal}
          onOpenReportModal={handleOpenReportModal}
        />
      );
    }

    // Single Coupon View / Modal
    if (cleanPath.startsWith('/coupons/')) {
      const slug = cleanPath.replace('/coupons/', '');
      const cpn = db.getCouponBySlug(slug);
      if (cpn) {
        return (
          <StoreDetailPage
            slug={db.getMerchantById(cpn.merchantId)?.slug || ''}
            onNavigate={navigate}
            onOpenCodeModal={handleOpenCodeModal}
            onOpenReportModal={handleOpenReportModal}
          />
        );
      }
    }

    // Direct Deals Directory
    if (cleanPath === '/deals' || cleanPath.startsWith('/deals/')) {
      return <DealsPage onNavigate={navigate} />;
    }

    // Categories Directory
    if (cleanPath === '/categories') {
      return <CategoriesPage onNavigate={navigate} />;
    }

    // Category Detail: /categories/:slug
    if (cleanPath.startsWith('/categories/')) {
      const slug = cleanPath.replace('/categories/', '');
      return (
        <CategoryDetailPage
          slug={slug}
          onNavigate={navigate}
          onOpenCodeModal={handleOpenCodeModal}
          onOpenReportModal={handleOpenReportModal}
        />
      );
    }

    // Blog
    if (cleanPath === '/blog') {
      return <BlogPage onNavigate={navigate} />;
    }

    // Blog Post Detail: /blog/:slug
    if (cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.replace('/blog/', '');
      return <BlogPostPage slug={slug} onNavigate={navigate} />;
    }

    // Site-wide Search
    if (cleanPath === '/search') {
      const params = new URLSearchParams(currentPath.includes('?') ? currentPath.split('?')[1] : '');
      const query = params.get('q') || '';
      return (
        <SearchPage
          initialQuery={query}
          onNavigate={navigate}
          onOpenCodeModal={handleOpenCodeModal}
          onOpenReportModal={handleOpenReportModal}
        />
      );
    }

    // Safe Outbound Affiliate Tracking Redirect
    if (cleanPath.startsWith('/go/')) {
      const id = cleanPath.replace('/go/', '');
      return <OutboundRedirectPage id={id} onNavigate={navigate} />;
    }

    // Admin Dashboard
    if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
      return <AdminDashboard onNavigate={navigate} />;
    }

    // Legal & Trust Pages
    if (cleanPath === '/about') return <AboutPage onNavigate={navigate} />;
    if (cleanPath === '/contact') return <ContactPage onNavigate={navigate} />;
    if (cleanPath === '/affiliate-disclosure') return <AffiliateDisclosurePage onNavigate={navigate} />;
    if (cleanPath === '/privacy') return <PrivacyPage onNavigate={navigate} />;
    if (cleanPath === '/terms') return <TermsPage onNavigate={navigate} />;
    if (cleanPath === '/cookie-policy') return <CookiePolicyPage onNavigate={navigate} />;
    if (cleanPath === '/sitemap.xml') return <SitemapXmlPage onNavigate={navigate} />;

    return <NotFoundPage onNavigate={navigate} />;
  };

  const isAdminView = currentPath.startsWith('/admin');
  const isOutboundRedirect = currentPath.startsWith('/go/');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Universal Header (hidden in admin mode to allow full control cockpit) */}
      {!isAdminView && !isOutboundRedirect && (
        <Header
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenSearch={() => setSearchModalOpen(true)}
        />
      )}

      {/* Main View Container */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Universal Footer */}
      {!isAdminView && !isOutboundRedirect && (
        <Footer onNavigate={navigate} />
      )}

      {/* Quick Search Modal */}
      <SearchBar
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={navigate}
        onSelectCoupon={cpn => handleOpenCodeModal(cpn)}
      />

      {/* Coupon Reveal Modal */}
      {activeCodeCoupon && (
        <CouponCodeModal
          coupon={activeCodeCoupon.coupon}
          merchant={activeCodeCoupon.merchant}
          onClose={() => setActiveCodeCoupon(null)}
          onOpenReport={cpn => {
            setActiveCodeCoupon(null);
            handleOpenReportModal(cpn);
          }}
        />
      )}

      {/* Problem Report Modal */}
      {reportingCoupon && (
        <ReportModal
          coupon={reportingCoupon}
          onClose={() => setReportingCoupon(null)}
        />
      )}

    </div>
  );
}

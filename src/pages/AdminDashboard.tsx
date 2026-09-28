import React, { useState } from 'react';
import { useDb } from '../lib/useDb';
import { 
  Merchant, Coupon, Deal, Category, VerificationLog, 
  CouponReport, ReportStatus, DiscountType, CouponStatus, VerificationStatus 
} from '../types';
import { SeoHead } from '../components/SeoHead';
import { 
  LayoutDashboard, Store, Tag, Sparkles, Folder, 
  ShieldCheck, AlertTriangle, FileText, HelpCircle, 
  BarChart3, Settings, History, Plus, Edit2, Trash2, 
  Check, X, Upload, ExternalLink, RefreshCw, Eye,
  DollarSign, Download, Server, Copy, Terminal
} from 'lucide-react';
import { AffiliateNetworkConfig } from '../lib/merchantCatalog';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

type AdminTab = 
  | 'overview' 
  | 'merchants' 
  | 'coupons' 
  | 'deals' 
  | 'categories' 
  | 'verification' 
  | 'reports' 
  | 'csv-import' 
  | 'affiliate-monetization'
  | 'hostinger-deploy'
  | 'blog' 
  | 'faq' 
  | 'analytics' 
  | 'audit-logs'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const db = useDb();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Stats
  const analytics = db.getAnalyticsSummary();
  const merchants = db.getMerchants();
  const coupons = db.getCoupons({ status: 'ALL' });
  const deals = db.getDeals();
  const categories = db.getCategories();
  const reports = db.getReports();
  const verificationLogs = db.getVerificationLogs();
  const auditLogs = db.getAuditLogs();
  const blogPosts = db.getBlogPosts();

  // --- AFFILIATE & HOSTINGER STATE ---
  const [affiliateForm, setAffiliateForm] = useState<AffiliateNetworkConfig>(db.getAffiliateConfig());
  const [affiliateSaved, setAffiliateSaved] = useState(false);
  const [testMerchantSlug, setTestMerchantSlug] = useState('hostinger');

  const downloadBlob = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateAffiliateConfig(affiliateForm);
    setAffiliateSaved(true);
    setTimeout(() => setAffiliateSaved(false), 3000);
  };

  // --- MERCHANT MODAL / FORM STATE ---
  const [merchantModalOpen, setMerchantModalOpen] = useState(false);
  const [editingMerchantId, setEditingMerchantId] = useState<string | null>(null);
  const [merchantForm, setMerchantForm] = useState({
    name: '',
    slug: '',
    domain: '',
    shortDesc: '',
    aboutHtml: '',
    categoryIds: [] as string[],
    affiliateUrl: '',
    landingUrl: '',
    status: 'ACTIVE' as 'ACTIVE' | 'PAUSED' | 'DRAFT',
    isPopular: false,
    isTrending: false,
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
  });

  const handleOpenMerchantModal = (merchant?: Merchant) => {
    if (merchant) {
      setEditingMerchantId(merchant.id);
      setMerchantForm({
        name: merchant.name,
        slug: merchant.slug,
        domain: merchant.domain,
        shortDesc: merchant.shortDesc,
        aboutHtml: merchant.aboutHtml,
        categoryIds: merchant.categoryIds,
        affiliateUrl: merchant.affiliateUrl,
        landingUrl: merchant.landingUrl,
        status: merchant.status,
        isPopular: merchant.isPopular,
        isTrending: merchant.isTrending,
        seoTitle: merchant.seoTitle || '',
        seoDescription: merchant.seoDescription || '',
        canonicalUrl: merchant.canonicalUrl || '',
      });
    } else {
      setEditingMerchantId(null);
      setMerchantForm({
        name: '',
        slug: '',
        domain: '',
        shortDesc: '',
        aboutHtml: '',
        categoryIds: [categories[0]?.id || 'cat-hosting'],
        affiliateUrl: '',
        landingUrl: '',
        status: 'ACTIVE',
        isPopular: false,
        isTrending: false,
        seoTitle: '',
        seoDescription: '',
        canonicalUrl: '',
      });
    }
    setMerchantModalOpen(true);
  };

  const handleSaveMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantForm.name || !merchantForm.slug || !merchantForm.domain) return;

    if (editingMerchantId) {
      db.updateMerchant(editingMerchantId, merchantForm);
    } else {
      db.createMerchant({
        ...merchantForm,
        howToUseSteps: [
          'Click Show Code to reveal the promo voucher.',
          'Add your qualifying products to the shopping bag.',
          'Paste code at checkout and verify discount subtotal.'
        ],
        faqs: [
          { question: `Does ${merchantForm.name} offer student discounts?`, answer: 'Check back regularly for accredited educational promotional vouchers.' }
        ]
      });
    }
    setMerchantModalOpen(false);
  };

  // --- COUPON MODAL / FORM STATE ---
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponForm, setCouponForm] = useState({
    merchantId: merchants[0]?.id || '',
    categoryId: categories[0]?.id || '',
    title: '',
    slug: '',
    code: '',
    description: '',
    discountType: 'PERCENTAGE' as DiscountType,
    discountValue: '20% OFF',
    affiliateUrl: '',
    landingUrl: '',
    expiryDate: '',
    status: 'ACTIVE' as CouponStatus,
    terms: '',
    isEditorsPick: false,
  });

  const handleOpenCouponModal = (cpn?: Coupon) => {
    if (cpn) {
      setEditingCouponId(cpn.id);
      setCouponForm({
        merchantId: cpn.merchantId,
        categoryId: cpn.categoryId || categories[0]?.id || '',
        title: cpn.title,
        slug: cpn.slug,
        code: cpn.code || '',
        description: cpn.description,
        discountType: cpn.discountType,
        discountValue: String(cpn.discountValue),
        affiliateUrl: cpn.affiliateUrl,
        landingUrl: cpn.landingUrl,
        expiryDate: cpn.expiryDate ? cpn.expiryDate.split('T')[0] : '',
        status: cpn.status,
        terms: cpn.terms || '',
        isEditorsPick: cpn.isEditorsPick || false,
      });
    } else {
      setEditingCouponId(null);
      setCouponForm({
        merchantId: merchants[0]?.id || '',
        categoryId: categories[0]?.id || '',
        title: '',
        slug: '',
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '20% OFF',
        affiliateUrl: '',
        landingUrl: '',
        expiryDate: '',
        status: 'ACTIVE',
        terms: 'Subject to retailer terms and conditions.',
        isEditorsPick: false,
      });
    }
    setCouponModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.title || !couponForm.merchantId) return;

    const merch = db.getMerchantById(couponForm.merchantId);
    const finalSlug = couponForm.slug || ((merch?.slug || 'store') + '-' + couponForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40));

    if (editingCouponId) {
      db.updateCoupon(editingCouponId, {
        ...couponForm,
        slug: finalSlug,
        code: couponForm.code ? couponForm.code.trim().toUpperCase() : null,
        expiryDate: couponForm.expiryDate ? new Date(couponForm.expiryDate).toISOString() : null,
      });
    } else {
      db.createCoupon({
        ...couponForm,
        slug: finalSlug + '-' + Math.random().toString(36).substring(2, 6),
        code: couponForm.code ? couponForm.code.trim().toUpperCase() : null,
        affiliateUrl: couponForm.affiliateUrl || merch?.affiliateUrl || 'https://example.com',
        landingUrl: couponForm.landingUrl || merch?.landingUrl || 'https://example.com',
        startDate: new Date().toISOString(),
        expiryDate: couponForm.expiryDate ? new Date(couponForm.expiryDate).toISOString() : null,
        verificationStatus: 'UNVERIFIED',
        lastVerifiedAt: null,
        verificationMethod: null,
      });
    }
    setCouponModalOpen(false);
  };

  // --- VERIFICATION WORKFLOW STATE ---
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyingCoupon, setVerifyingCoupon] = useState<Coupon | null>(null);
  const [verifyTestResult, setVerifyTestResult] = useState<'SUCCESS' | 'FAILED' | 'EXPIRED' | 'DISCOUNT_MISMATCH'>('SUCCESS');
  const [verifyMethod, setVerifyMethod] = useState('Staff checkout simulation test');
  const [verifyNotes, setVerifyNotes] = useState('');

  const handleOpenVerify = (cpn: Coupon) => {
    setVerifyingCoupon(cpn);
    setVerifyTestResult('SUCCESS');
    setVerifyMethod('Staff checkout simulation test');
    setVerifyNotes('Tested and validated discount token applies at cart checkout.');
    setVerifyModalOpen(true);
  };

  const handleExecuteVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingCoupon) return;
    db.verifyCoupon(verifyingCoupon.id, verifyTestResult, verifyMethod, verifyNotes);
    setVerifyModalOpen(false);
  };

  // --- CSV IMPORT STATE ---
  const [csvText, setCsvText] = useState(
`merchant,title,code,description,discount,affiliateUrl,landingUrl,expiryDate
CloudForge Hosting,Summer VPS 25% Off,SUMMERVPS25,Get 25% off cloud hosting instances,25% OFF,https://cloudforge.example.com/?ref=demo,https://cloudforge.example.com/vps,2026-10-31
ByteCraft Tools,Flash Pro License Special,BYTEFLASH10,Instant $10 off perpetual developer tools,$10 OFF,https://bytecraft-tools.example.com/?aff=demo,https://bytecraft-tools.example.com/pricing,2026-08-31`
  );
  const [csvImportResult, setCsvImportResult] = useState<any>(null);

  const handleRunCsvImport = () => {
    const res = db.importCouponsCsv(csvText);
    setCsvImportResult(res);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <SeoHead
        title="Admin Control Center – CouponBeee"
        description="Internal administrative management panel for merchants, coupons, verification testing, and analytics."
        noIndex={true}
      />

      {/* Admin Top Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-bold flex items-center justify-center">
            CB
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-tight block">
              CouponBeee Admin Console
            </span>
            <span className="text-[10px] text-stone-400">
              Logged in as {db.currentUser.name} ({db.currentUser.role})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/')}
            className="px-3 py-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>
        </div>
      </header>

      {/* Admin Body with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 bg-white rounded-xl border border-stone-200 p-3 shadow-xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-2">
            Operations
          </div>
          
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'merchants', label: 'Merchants & Catalog', icon: Store, count: merchants.length },
            { id: 'coupons', label: 'Coupons & Vouchers', icon: Tag, count: coupons.length },
            { id: 'deals', label: 'Direct Deals', icon: Sparkles, count: deals.length },
            { id: 'verification', label: 'Verification Desk', icon: ShieldCheck, badge: coupons.filter(c => c.verificationStatus === 'UNVERIFIED').length },
            { id: 'reports', label: 'Problem Reports', icon: AlertTriangle, badge: analytics.pendingReports },
            { id: 'affiliate-monetization', label: 'Affiliate Monetization', icon: DollarSign },
            { id: 'hostinger-deploy', label: 'Hostinger & Cloud Deploy', icon: Server },
            { id: 'csv-import', label: 'CSV Bulk Import', icon: Upload },
            { id: 'analytics', label: 'Click Analytics', icon: BarChart3 },
            { id: 'audit-logs', label: 'Audit Logs', icon: History },
            { id: 'settings', label: 'Database & Reset', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span className="text-[10px] text-stone-400 font-mono">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Tab Main Display */}
        <main className="flex-1 bg-white rounded-xl border border-stone-200 p-6 shadow-xs min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-stone-900">
                  Dashboard Statistics
                </h2>
                <p className="text-xs text-stone-500">
                  Real-time operational metrics across stores, coupons, and verification records
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                    Total Merchants
                  </span>
                  <span className="font-display text-2xl font-bold text-stone-900 tabular-nums">
                    {analytics.totalMerchants}
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                    Active Coupons
                  </span>
                  <span className="font-display text-2xl font-bold text-stone-900 tabular-nums">
                    {analytics.activeCoupons}
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                    Tested &amp; Verified
                  </span>
                  <span className="font-display text-2xl font-bold text-emerald-700 tabular-nums">
                    {analytics.verifiedCoupons}
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                    Outbound Clicks
                  </span>
                  <span className="font-display text-2xl font-bold text-amber-700 tabular-nums">
                    {analytics.totalClicks}
                  </span>
                </div>
              </div>

              {/* Pending Action Alerts */}
              {analytics.pendingReports > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-red-900 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>{analytics.pendingReports} pending user problem reports need inspection</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    Review Reports
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => handleOpenCouponModal()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Coupon</span>
                </button>
                <button
                  onClick={() => handleOpenMerchantModal()}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Store</span>
                </button>
                <button
                  onClick={() => setActiveTab('csv-import')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5 border border-stone-300"
                >
                  <Upload className="w-4 h-4" />
                  <span>Bulk CSV Import</span>
                </button>
              </div>

              {/* Recent Outbound Click Stream */}
              <div className="space-y-3 pt-4">
                <h3 className="font-display text-sm font-bold text-stone-900">
                  Recent Outbound Click Stream
                </h3>
                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
                  {analytics.recentClicks.length > 0 ? (
                    analytics.recentClicks.map(clk => {
                      const c = db.getCouponById(clk.couponId);
                      const m = db.getMerchantById(clk.merchantId);
                      return (
                        <div key={clk.id} className="p-3 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-stone-900">{m?.name || 'Store'}</span>
                            <span className="text-stone-500 mx-1.5">·</span>
                            <span className="text-stone-600">{c?.title || 'Offer'}</span>
                          </div>
                          <div className="text-stone-400 text-[11px] tabular-nums">
                            {new Date(clk.clickedAt).toLocaleTimeString()} ({clk.deviceCategory})
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-stone-400">No clicks recorded yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MERCHANTS CRUD */}
          {activeTab === 'merchants' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-900">
                    Merchant Directory Management
                  </h2>
                  <p className="text-xs text-stone-500">
                    Manage store profiles, affiliate tracking parameters, and SEO settings
                  </p>
                </div>
                <button
                  onClick={() => handleOpenMerchantModal()}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Merchant</span>
                </button>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Store Name</th>
                      <th className="p-3">Domain</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Coupons</th>
                      <th className="p-3">Popular</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {merchants.map(m => {
                      const cpnCount = db.getCoupons({ merchantId: m.id, status: 'ALL' }).length;
                      return (
                        <tr key={m.id} className="hover:bg-stone-50/50">
                          <td className="p-3 font-semibold text-stone-900">
                            {m.name}
                          </td>
                          <td className="p-3 font-mono text-stone-500">
                            {m.domain}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-600'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="p-3 tabular-nums font-medium">
                            {cpnCount}
                          </td>
                          <td className="p-3">
                            {m.isPopular ? '★ Yes' : 'No'}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => handleOpenMerchantModal(m)}
                              className="text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${m.name}? Associated coupons will be removed.`)) {
                                  db.deleteMerchant(m.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COUPONS CRUD */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-900">
                    Coupon &amp; Promo Code Inventory
                  </h2>
                  <p className="text-xs text-stone-500">
                    Create, update, pause, or expire promotional offers
                  </p>
                </div>
                <button
                  onClick={() => handleOpenCouponModal()}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Coupon</span>
                </button>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Offer Title</th>
                      <th className="p-3">Merchant</th>
                      <th className="p-3">Code</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Verification</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {coupons.map(c => {
                      const m = db.getMerchantById(c.merchantId);
                      return (
                        <tr key={c.id} className="hover:bg-stone-50/50">
                          <td className="p-3 font-semibold text-stone-900 max-w-[200px] truncate">
                            {c.title}
                          </td>
                          <td className="p-3 text-stone-600 font-medium">
                            {m?.name || 'Unknown'}
                          </td>
                          <td className="p-3 font-mono font-bold text-stone-800">
                            {c.code || '(Deal link)'}
                          </td>
                          <td className="p-3 font-semibold text-amber-800">
                            {c.discountValue}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.verificationStatus === 'TESTED'
                                ? 'bg-emerald-100 text-emerald-900'
                                : (c.verificationStatus === 'REPORTED' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600')
                            }`}>
                              {c.verificationStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => handleOpenVerify(c)}
                              className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleOpenCouponModal(c)}
                              className="text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete coupon "${c.title}"?`)) {
                                  db.deleteCoupon(c.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: VERIFICATION WORKFLOW */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-stone-900">
                  Verification Desk
                </h2>
                <p className="text-xs text-stone-500">
                  Audit promotional codes on authentic checkout interfaces. Only successful tests receive the &ldquo;Tested &amp; Verified&rdquo; badge.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-sm font-bold text-stone-800">
                  Coupons Needing Verification
                </h3>
                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
                  {coupons.map(c => {
                    const m = db.getMerchantById(c.merchantId);
                    return (
                      <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-stone-500">
                            <span className="font-semibold text-stone-900">{m?.name}</span>
                            <span>·</span>
                            <span className="font-mono text-stone-800">{c.code || 'NO CODE'}</span>
                            <span>·</span>
                            <span className="font-semibold text-amber-800">{c.discountValue}</span>
                          </div>
                          <h4 className="font-medium text-stone-900 text-sm mt-0.5">
                            {c.title}
                          </h4>
                          <span className="text-[11px] text-stone-400 block mt-0.5">
                            Current Status: <strong className="text-stone-700">{c.verificationStatus}</strong>
                            {c.lastVerifiedAt && ` (Last evaluated: ${new Date(c.lastVerifiedAt).toLocaleDateString()})`}
                          </span>
                        </div>
                        <button
                          onClick={() => handleOpenVerify(c)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap self-start sm:self-auto"
                        >
                          Run Verification Test
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Historical Verification Logs */}
              <div className="space-y-3 pt-4">
                <h3 className="font-display text-sm font-bold text-stone-800">
                  Recent Verification Audit Trail
                </h3>
                <div className="border border-stone-200 rounded-xl overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Staff Editor</th>
                        <th className="p-2.5">Result</th>
                        <th className="p-2.5">Method</th>
                        <th className="p-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600">
                      {verificationLogs.map(log => (
                        <tr key={log.id}>
                          <td className="p-2.5 tabular-nums text-stone-500">
                            {new Date(log.testedAt).toLocaleDateString()}
                          </td>
                          <td className="p-2.5 font-medium text-stone-900">
                            {log.adminName}
                          </td>
                          <td className="p-2.5 font-bold">
                            <span className={log.testResult === 'SUCCESS' ? 'text-emerald-700' : 'text-red-700'}>
                              {log.testResult}
                            </span>
                          </td>
                          <td className="p-2.5 text-stone-500">
                            {log.verificationMethod}
                          </td>
                          <td className="p-2.5 text-stone-600">
                            {log.notes || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROBLEM REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-stone-900">
                  Community Problem Reports ({reports.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Shopper feedback regarding non-working codes, wrong discounts, or unexpected terms
                </p>
              </div>

              {reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map(rep => {
                    const cpn = db.getCouponById(rep.couponId);
                    const merch = cpn ? db.getMerchantById(cpn.merchantId) : null;
                    return (
                      <div key={rep.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-red-700 uppercase">
                            Reason: {rep.reason.replace(/_/g, ' ')}
                          </span>
                          <span className="text-stone-400 tabular-nums">
                            {new Date(rep.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-stone-700">
                          <strong className="text-stone-900">{merch?.name}:</strong> {cpn?.title} ({cpn?.code || 'Deal'})
                        </div>
                        {rep.userComment && (
                          <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-600 italic">
                            &ldquo;{rep.userComment}&rdquo;
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                          <span className="text-stone-500">
                            Status: <strong className="text-stone-800">{rep.status}</strong>
                          </span>
                          <div className="space-x-2">
                            <button
                              onClick={() => {
                                if (cpn) handleOpenVerify(cpn);
                              }}
                              className="px-3 py-1 bg-stone-900 text-white rounded text-xs font-semibold cursor-pointer"
                            >
                              Test Code
                            </button>
                            <button
                              onClick={() => db.updateReportStatus(rep.id, 'RESOLVED', 'Verified and adjusted')}
                              className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold cursor-pointer"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => db.updateReportStatus(rep.id, 'DISMISSED', 'Could not reproduce')}
                              className="px-3 py-1 bg-stone-200 text-stone-700 rounded text-xs font-semibold cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
                  Zero pending reports. The database is in verified health!
                </div>
              )}
            </div>
          )}

          {/* TAB: AFFILIATE NETWORKS & MONETIZATION */}
          {activeTab === 'affiliate-monetization' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-900">
                    Affiliate Network Monetization Engine
                  </h2>
                  <p className="text-xs text-stone-500">
                    Configure your publisher credentials across affiliate networks. Outbound clicks automatically embed your SubIDs and tracking parameters.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    ● Tracking Active
                  </span>
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-900 uppercase block mb-1">Estimated Earnings</span>
                  <span className="font-display text-2xl font-black text-amber-950">${analytics.estimatedCommissions.toLocaleString()}</span>
                  <p className="text-[10px] text-amber-800 mt-1">Based on verified conversions &amp; EPC</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-600 uppercase block mb-1">Tracked Outbound Clicks</span>
                  <span className="font-display text-2xl font-black text-stone-900">{analytics.totalClicks.toLocaleString()}</span>
                  <p className="text-[10px] text-stone-500 mt-1">Across coupons &amp; direct deals</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-600 uppercase block mb-1">Average EPC</span>
                  <span className="font-display text-2xl font-black text-emerald-600">$1.85</span>
                  <p className="text-[10px] text-stone-500 mt-1">Earnings per 100 outbound clicks</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-600 uppercase block mb-1">Indexed Merchants</span>
                  <span className="font-display text-2xl font-black text-stone-900">{analytics.totalMerchants.toLocaleString()}</span>
                  <p className="text-[10px] text-stone-500 mt-1">Ready for affiliate monetization</p>
                </div>
              </div>

              {/* Publisher Credentials Form */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-display text-base font-bold text-stone-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span>Publisher Tracking ID Settings</span>
                </h3>

                {affiliateSaved && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Affiliate network configuration updated! All new outbound clicks will use these parameters.</span>
                  </div>
                )}

                <form onSubmit={handleSaveAffiliate} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Hostinger Affiliate ID (aff_id)
                      </label>
                      <input
                        type="text"
                        value={affiliateForm.hostingerAffId}
                        onChange={e => setAffiliateForm({ ...affiliateForm, hostingerAffId: e.target.value })}
                        placeholder="e.g. couponbeee_host"
                        className="w-full p-2.5 border border-stone-300 rounded-lg font-mono"
                      />
                      <span className="text-[10px] text-stone-400 mt-1 block">Appends ?aff_id=...&amp;aff_sub=... to Hostinger links</span>
                    </div>

                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Amazon Associates Tag (tag)
                      </label>
                      <input
                        type="text"
                        value={affiliateForm.amazonTag}
                        onChange={e => setAffiliateForm({ ...affiliateForm, amazonTag: e.target.value })}
                        placeholder="e.g. couponbeee-20"
                        className="w-full p-2.5 border border-stone-300 rounded-lg font-mono"
                      />
                      <span className="text-[10px] text-stone-400 mt-1 block">Appends ?tag=... to all Amazon product &amp; promo links</span>
                    </div>

                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Impact Radius Publisher ID
                      </label>
                      <input
                        type="text"
                        value={affiliateForm.impactPublisherId}
                        onChange={e => setAffiliateForm({ ...affiliateForm, impactPublisherId: e.target.value })}
                        placeholder="e.g. 394821"
                        className="w-full p-2.5 border border-stone-300 rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        CJ Affiliate (Commission Junction) Website ID
                      </label>
                      <input
                        type="text"
                        value={affiliateForm.cjWebsiteId}
                        onChange={e => setAffiliateForm({ ...affiliateForm, cjWebsiteId: e.target.value })}
                        placeholder="e.g. 10048291"
                        className="w-full p-2.5 border border-stone-300 rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        ShareASale Affiliate ID
                      </label>
                      <input
                        type="text"
                        value={affiliateForm.shareasaleId}
                        onChange={e => setAffiliateForm({ ...affiliateForm, shareasaleId: e.target.value })}
                        placeholder="e.g. 2093841"
                        className="w-full p-2.5 border border-stone-300 rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Default SubID Tracking Prefix
                      </label>
                      <input
                        type="text"
                        value={affiliateForm.subIdPrefix}
                        onChange={e => setAffiliateForm({ ...affiliateForm, subIdPrefix: e.target.value })}
                        placeholder="e.g. beee_web"
                        className="w-full p-2.5 border border-stone-300 rounded-lg font-mono"
                      />
                      <span className="text-[10px] text-stone-400 mt-1 block">Combined with click IDs to identify high-converting traffic</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl cursor-pointer shadow-xs"
                    >
                      Save Affiliate Network Settings
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Link Simulator */}
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <h3 className="font-display text-sm font-bold text-stone-900">
                  Live Outbound Link &amp; Attribution Tester
                </h3>
                <p className="text-stone-500">
                  Select a store below to see how CouponBeee automatically injects your affiliate credentials and SubIDs when visitors click &ldquo;Show Code&rdquo; or visit <code>/go/:id</code>:
                </p>

                <div className="flex items-center gap-2 pt-1">
                  {['hostinger', 'amazon', 'nike', 'nordvpn'].map(s => (
                    <button
                      key={s}
                      onClick={() => setTestMerchantSlug(s)}
                      className={`px-3 py-1.5 rounded-lg font-semibold capitalize cursor-pointer transition-colors ${
                        testMerchantSlug === s ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-stone-900 rounded-xl font-mono text-[11px] text-amber-300 break-all select-all">
                  {db.buildAffiliateUrl(
                    testMerchantSlug === 'hostinger' 
                      ? 'https://www.hostinger.com'
                      : testMerchantSlug === 'amazon'
                        ? 'https://www.amazon.com/dp/B09XYZ'
                        : `https://www.${testMerchantSlug}.com`,
                    testMerchantSlug,
                    'sim_click_994'
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: HOSTINGER & CLOUD DEPLOY */}
          {activeTab === 'hostinger-deploy' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-900">
                    Hostinger &amp; Cloud Deployment Suite
                  </h2>
                  <p className="text-xs text-stone-500">
                    Ready-to-deploy configuration files, Apache rewrites, PM2 ecosystem setups, and one-click database backups.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Hostinger Ready ✓
                </span>
              </div>

              {/* Quick Download Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Hostinger .htaccess</span>
                    <p className="text-[11px] text-stone-500 mt-1">Enforces HTTPS, Gzip, and SPA routing for public_html</p>
                  </div>
                  <button
                    onClick={() => {
                      const content = `# Apache / Hostinger .htaccess for CouponBeee\n<IfModule mod_rewrite.c>\n  RewriteEngine On\n  RewriteBase /\n  RewriteCond %{HTTPS} off\n  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n  RewriteCond %{REQUEST_FILENAME} -f [OR]\n  RewriteCond %{REQUEST_FILENAME} -d\n  RewriteRule ^ - [L]\n  RewriteRule ^ index.html [L]\n</IfModule>`;
                      downloadBlob(content, '.htaccess', 'text/plain');
                    }}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .htaccess</span>
                  </button>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">PM2 Ecosystem Config</span>
                    <p className="text-[11px] text-stone-500 mt-1">Cluster mode for Hostinger VPS &amp; Cloud Servers</p>
                  </div>
                  <button
                    onClick={() => {
                      const content = `module.exports = {\n  apps: [{\n    name: 'couponbeee-production',\n    script: 'server.ts',\n    interpreter: 'tsx',\n    instances: 'max',\n    exec_mode: 'cluster',\n    env: { NODE_ENV: 'production', PORT: 3000 }\n  }]\n};`;
                      downloadBlob(content, 'ecosystem.config.cjs', 'application/javascript');
                    }}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ecosystem.cjs</span>
                  </button>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Database Backup (JSON)</span>
                    <p className="text-[11px] text-stone-500 mt-1">Full export of merchants, verified coupons, deals &amp; clicks</p>
                  </div>
                  <button
                    onClick={() => {
                      const content = db.exportDatabaseJson();
                      downloadBlob(content, 'couponbeee_backup.json', 'application/json');
                    }}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON Backup</span>
                  </button>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">5,000+ Merchants (CSV)</span>
                    <p className="text-[11px] text-stone-500 mt-1">Spreadsheet list of all indexed stores &amp; affiliate links</p>
                  </div>
                  <button
                    onClick={() => {
                      const content = db.exportStoresCsv();
                      downloadBlob(content, 'couponbeee_merchants.csv', 'text/csv');
                    }}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer border border-stone-300"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV Catalog</span>
                  </button>
                </div>
              </div>

              {/* Step-by-Step Hostinger Instructions */}
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 text-xs">
                <h3 className="font-display text-sm font-bold text-stone-900">
                  Step-by-Step Deployment Instructions for Hostinger
                </h3>

                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                    <span className="font-bold text-stone-900 block text-xs">Option A: Hostinger hPanel Node.js Application</span>
                    <ol className="list-decimal list-inside space-y-1 text-stone-600 leading-relaxed">
                      <li>Log into Hostinger hPanel and navigate to <strong>Websites &rarr; Node.js</strong>.</li>
                      <li>Click <strong>Create Application</strong>, select Node.js v20.x, set Application root to <code>public_html</code>, and Application startup file to <code>server.ts</code>.</li>
                      <li>Upload your CouponBeee project files via File Manager or Git repository.</li>
                      <li>In the web terminal, run <code>npm install &amp;&amp; npm run build</code> and click <strong>Restart Application</strong>.</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                    <span className="font-bold text-stone-900 block text-xs">Option B: Hostinger Shared / Premium Hosting (Static Frontend)</span>
                    <ol className="list-decimal list-inside space-y-1 text-stone-600 leading-relaxed">
                      <li>Build the production package locally or in CI with <code>npm run build</code>.</li>
                      <li>Upload everything inside the <code>dist/</code> folder directly to Hostinger <code>public_html/</code>.</li>
                      <li>Upload the <strong>.htaccess</strong> file (download above) to <code>public_html/.htaccess</code> to enable SPA deep routing.</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                    <span className="font-bold text-stone-900 block text-xs">Option C: Hostinger VPS (Full Stack with PM2)</span>
                    <div className="p-3 bg-stone-900 rounded-lg text-emerald-400 font-mono text-[11px] space-y-1">
                      <div>git clone &lt;repo&gt; /var/www/couponbeee</div>
                      <div>cd /var/www/couponbeee &amp;&amp; npm install &amp;&amp; npm run build</div>
                      <div>pm2 start deploy/hostinger/ecosystem.config.cjs &amp;&amp; pm2 save</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CSV BULK IMPORT */}
          {activeTab === 'csv-import' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-stone-900">
                  CSV Bulk Coupon Importer
                </h2>
                <p className="text-xs text-stone-500">
                  Paste or upload comma-separated values. Validates every row with Zod, checks duplicates, and registers unverified records.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700 block">
                  Paste CSV Data (Header row required)
                </label>
                <textarea
                  value={csvText}
                  onChange={e => setCsvText(e.target.value)}
                  rows={8}
                  className="w-full font-mono text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleRunCsvImport}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Parse &amp; Import Rows</span>
              </button>

              {csvImportResult && (
                <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                  <h3 className="font-display text-sm font-bold text-stone-900">
                    Import Processing Summary
                  </h3>
                  <div className="grid grid-cols-4 gap-3 text-center text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                      <span className="text-stone-500 block">Total Rows</span>
                      <span className="font-bold text-stone-900 text-base tabular-nums">{csvImportResult.totalRows}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                      <span className="text-emerald-700 block">Valid Imported</span>
                      <span className="font-bold text-emerald-700 text-base tabular-nums">{csvImportResult.validRows}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                      <span className="text-amber-700 block">Duplicates</span>
                      <span className="font-bold text-amber-700 text-base tabular-nums">{csvImportResult.duplicateRows}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                      <span className="text-red-700 block">Invalid Rows</span>
                      <span className="font-bold text-red-700 text-base tabular-nums">{csvImportResult.invalidRows}</span>
                    </div>
                  </div>

                  {csvImportResult.errors?.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs font-semibold text-red-700 block">Import Validation Warnings:</span>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-xs text-red-800 space-y-1">
                        {csvImportResult.errors.map((err: any, idx: number) => (
                          <div key={idx}>Line {err.line}: {err.message}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: AUDIT LOGS */}
          {activeTab === 'audit-logs' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-stone-900">
                  Administrative Audit Logs
                </h2>
                <p className="text-xs text-stone-500">
                  Chronological recording of every create, update, delete, verification, and import action
                </p>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Admin</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Entity</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="p-3 tabular-nums text-stone-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 font-semibold text-stone-900 whitespace-nowrap">
                          {log.adminName}
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-800">
                          {log.action}
                        </td>
                        <td className="p-3 text-stone-600">
                          {log.entityType} ({log.entityId})
                        </td>
                        <td className="p-3 text-stone-600">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS & DATABASE RESET */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-stone-900">
                  Database &amp; Platform Controls
                </h2>
                <p className="text-xs text-stone-500">
                  Environment controls and seed restoration
                </p>
              </div>

              <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                <h3 className="font-display text-sm font-bold text-amber-950">
                  Reset Database to Clean Seed State
                </h3>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Restores original demonstration merchants, verified test logs, and deals. Use this anytime you want to clear test records or reset after testing bulk operations.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all data back to initial seed state?')) {
                      db.resetToSeed();
                      alert('Database reset to clean seed state.');
                    }
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Seed Data</span>
                </button>
              </div>

              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-600">
                <h3 className="font-display text-sm font-bold text-stone-900">
                  Active Platform Environment
                </h3>
                <p><strong>Applet ID:</strong> 0b2f9e36-44bb-4ef1-945d-47059c4385cf</p>
                <p><strong>Database Layer:</strong> In-Memory Persistent Store + Prisma Postgres Compatible</p>
                <p><strong>Outbound Redirect:</strong> <code>/go/:id</code> with <code>rel=&ldquo;sponsored nofollow noopener&rdquo;</code></p>
              </div>
            </div>
          )}

          {/* TAB 9: CLICK ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-stone-900">
                  Outbound Conversion &amp; Click Analytics
                </h2>
                <p className="text-xs text-stone-500">
                  Inspect coupon engagement, top converting stores, and referral traffic
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Merchants */}
                <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <h3 className="font-display text-sm font-bold text-stone-900">
                    Top Stores by Click Volume
                  </h3>
                  <div className="space-y-2 text-xs">
                    {analytics.topMerchants.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-stone-200">
                        <span className="font-semibold text-stone-900">{item.merchant?.name}</span>
                        <span className="font-mono font-bold text-amber-800 tabular-nums">{item.clicks} clicks</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Coupons */}
                <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <h3 className="font-display text-sm font-bold text-stone-900">
                    Most Copied Coupons
                  </h3>
                  <div className="space-y-2 text-xs">
                    {analytics.topCoupons.map((cpn, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-stone-200">
                        <div className="truncate pr-2">
                          <span className="font-semibold text-stone-900 block truncate">{cpn.title}</span>
                          <span className="text-stone-400 font-mono text-[10px]">{cpn.code || 'DEAL'}</span>
                        </div>
                        <span className="font-mono font-bold text-amber-800 tabular-nums shrink-0">{cpn.clickCount} uses</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- MODAL: CREATE/EDIT MERCHANT --- */}
      {merchantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl relative border border-stone-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setMerchantModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-lg font-bold text-stone-900 mb-4">
              {editingMerchantId ? 'Edit Merchant Profile' : 'Create New Merchant'}
            </h3>

            <form onSubmit={handleSaveMerchant} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Store Name *</label>
                  <input
                    type="text"
                    value={merchantForm.name}
                    onChange={e => {
                      const name = e.target.value;
                      setMerchantForm({
                        ...merchantForm,
                        name,
                        slug: merchantForm.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      });
                    }}
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Slug *</label>
                  <input
                    type="text"
                    value={merchantForm.slug}
                    onChange={e => setMerchantForm({ ...merchantForm, slug: e.target.value })}
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Domain *</label>
                <input
                  type="text"
                  value={merchantForm.domain}
                  onChange={e => setMerchantForm({ ...merchantForm, domain: e.target.value })}
                  placeholder="store.example.com"
                  required
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Short Description *</label>
                <textarea
                  value={merchantForm.shortDesc}
                  onChange={e => setMerchantForm({ ...merchantForm, shortDesc: e.target.value })}
                  rows={2}
                  required
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">About Store (HTML supported) *</label>
                <textarea
                  value={merchantForm.aboutHtml}
                  onChange={e => setMerchantForm({ ...merchantForm, aboutHtml: e.target.value })}
                  rows={3}
                  required
                  className="w-full p-2 border border-stone-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Affiliate / Tracking URL *</label>
                  <input
                    type="text"
                    value={merchantForm.affiliateUrl}
                    onChange={e => setMerchantForm({ ...merchantForm, affiliateUrl: e.target.value })}
                    placeholder="https://merchant.example.com/?ref=demo"
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Official Landing URL *</label>
                  <input
                    type="text"
                    value={merchantForm.landingUrl}
                    onChange={e => setMerchantForm({ ...merchantForm, landingUrl: e.target.value })}
                    placeholder="https://merchant.example.com"
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={merchantForm.isPopular}
                    onChange={e => setMerchantForm({ ...merchantForm, isPopular: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>Featured Popular Store</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setMerchantModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg cursor-pointer"
                >
                  Save Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE/EDIT COUPON --- */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl relative border border-stone-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCouponModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-lg font-bold text-stone-900 mb-4">
              {editingCouponId ? 'Edit Coupon' : 'Create New Coupon'}
            </h3>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Target Merchant *</label>
                  <select
                    value={couponForm.merchantId}
                    onChange={e => setCouponForm({ ...couponForm, merchantId: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg cursor-pointer"
                  >
                    {merchants.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={couponForm.categoryId}
                    onChange={e => setCouponForm({ ...couponForm, categoryId: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Coupon Title *</label>
                <input
                  type="text"
                  value={couponForm.title}
                  onChange={e => setCouponForm({ ...couponForm, title: e.target.value })}
                  placeholder="e.g. 25% Off Annual VPS Hosting Plans"
                  required
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Promo Code (or leave blank)</label>
                  <input
                    type="text"
                    value={couponForm.code}
                    onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    placeholder="SAVE25"
                    className="w-full p-2 font-mono font-bold border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Discount Value *</label>
                  <input
                    type="text"
                    value={couponForm.discountValue}
                    onChange={e => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    placeholder="25% OFF"
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value as DiscountType })}
                    className="w-full p-2 border border-stone-300 rounded-lg cursor-pointer"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Dollar</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description *</label>
                <textarea
                  value={couponForm.description}
                  onChange={e => setCouponForm({ ...couponForm, description: e.target.value })}
                  rows={2}
                  required
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={couponForm.expiryDate}
                    onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Status</label>
                  <select
                    value={couponForm.status}
                    onChange={e => setCouponForm({ ...couponForm, status: e.target.value as CouponStatus })}
                    className="w-full p-2 border border-stone-300 rounded-lg cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PAUSED">PAUSED</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couponForm.isEditorsPick}
                    onChange={e => setCouponForm({ ...couponForm, isEditorsPick: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>Feature as Editor&rsquo;s Pick</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg cursor-pointer"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: VERIFY WORKFLOW TEST --- */}
      {verifyModalOpen && verifyingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative border border-stone-200">
            <button
              onClick={() => setVerifyModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-4">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Staff Verification Protocol
              </span>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Record Checkout Test Result
              </h3>
              <p className="text-xs text-stone-500">
                {verifyingCoupon.title}
              </p>
            </div>

            <form onSubmit={handleExecuteVerification} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Test Result *</label>
                <select
                  value={verifyTestResult}
                  onChange={e => setVerifyTestResult(e.target.value as any)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg cursor-pointer"
                >
                  <option value="SUCCESS">SUCCESS – Code worked and deducted expected discount</option>
                  <option value="FAILED">FAILED – Code returned invalid or expired error</option>
                  <option value="EXPIRED">EXPIRED – Offer is officially expired</option>
                  <option value="DISCOUNT_MISMATCH">DISCOUNT_MISMATCH – Deducted amount was different</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Testing Method *</label>
                <input
                  type="text"
                  value={verifyMethod}
                  onChange={e => setVerifyMethod(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Inspection Notes</label>
                <textarea
                  value={verifyNotes}
                  onChange={e => setVerifyNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setVerifyModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Confirm &amp; Record Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

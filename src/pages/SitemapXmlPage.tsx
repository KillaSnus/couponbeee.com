import React from 'react';
import { useDb } from '../lib/useDb';
import { SeoHead } from '../components/SeoHead';
import { Copy, Check, FileCode, ArrowLeft } from 'lucide-react';

interface SitemapXmlPageProps {
  onNavigate: (path: string) => void;
}

export const SitemapXmlPage: React.FC<SitemapXmlPageProps> = ({ onNavigate }) => {
  const db = useDb();
  const [copied, setCopied] = React.useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://couponbeee.org';
  const currentDate = new Date().toISOString().split('T')[0];

  const merchants = db.getMerchants();
  const categories = db.getCategories();
  const coupons = db.getCoupons({ status: 'ACTIVE' });
  const blogPosts = db.getBlogPosts();

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Static Indexable Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/stores</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/coupons</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/deals</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/categories</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/affiliate-disclosure</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Categories -->
${categories.map(c => `  <url>
    <loc>${baseUrl}/categories/${c.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}

  <!-- Merchants -->
${merchants.map(m => `  <url>
    <loc>${baseUrl}/stores/${m.slug}</loc>
    <lastmod>${new Date(m.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>`).join('\n')}

  <!-- Blog Posts -->
${blogPosts.map(b => `  <url>
    <loc>${baseUrl}/blog/${b.slug}</loc>
    <lastmod>${new Date(b.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SeoHead
        title="Dynamic XML Sitemap | CouponBeee"
        description="Machine-readable XML sitemap index of verified stores, categories, and shopping guides."
        noIndex={true}
      />

      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
          <h1 className="font-display text-2xl font-bold text-stone-900 flex items-center gap-2">
            <FileCode className="w-6 h-6 text-amber-600" />
            <span>Dynamic XML Sitemap (/sitemap.xml)</span>
          </h1>
          <p className="text-xs text-stone-500">
            Dynamically synchronized with all verified stores, categories, and editorial guides. Excludes /admin and /search.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied XML!' : 'Copy XML'}</span>
        </button>
      </div>

      <div className="bg-stone-900 text-amber-200/90 rounded-2xl p-5 border border-stone-800 font-mono text-xs overflow-x-auto shadow-md max-h-[650px] leading-relaxed">
        <pre>{xmlContent}</pre>
      </div>
    </div>
  );
};

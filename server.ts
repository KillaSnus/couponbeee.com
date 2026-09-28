import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  INITIAL_CATEGORIES, INITIAL_MERCHANTS, INITIAL_COUPONS, 
  INITIAL_DEALS, INITIAL_BLOG_POSTS, INITIAL_FAQS, 
  INITIAL_VERIFICATION_LOGS, INITIAL_REPORTS, INITIAL_AUDIT_LOGS 
} from './src/data/mockData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory data store for backend REST API
let merchants = [...INITIAL_MERCHANTS];
let coupons = [...INITIAL_COUPONS];
let deals = [...INITIAL_DEALS];
let categories = [...INITIAL_CATEGORIES];
let blogPosts = [...INITIAL_BLOG_POSTS];
let faqs = [...INITIAL_FAQS];
let verificationLogs = [...INITIAL_VERIFICATION_LOGS];
let reports = [...INITIAL_REPORTS];
let auditLogs = [...INITIAL_AUDIT_LOGS];
let couponClicks: any[] = [];

// --- DYNAMIC ROBOTS.TXT ---
app.get('/robots.txt', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://couponbeee.org';
  res.type('text/plain');
  res.send(`User-agent: *
Disallow: /admin
Disallow: /admin/*
Disallow: /search
Disallow: /search/*
Disallow: /go/*

Sitemap: ${baseUrl}/sitemap.xml
`);
});

// --- DYNAMIC XML SITEMAP ---
app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://couponbeee.org';
  const currentDate = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
${categories.map(c => `  <url>
    <loc>${baseUrl}/categories/${c.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${merchants.map(m => `  <url>
    <loc>${baseUrl}/stores/${m.slug}</loc>
    <lastmod>${new Date(m.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>`).join('\n')}
${blogPosts.map(b => `  <url>
    <loc>${baseUrl}/blog/${b.slug}</loc>
    <lastmod>${new Date(b.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// --- SAFE OUTBOUND AFFILIATE REDIRECT ---
app.get('/go/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(req.headers['user-agent'] || '');
  const device = isMobile ? 'MOBILE' : 'DESKTOP';
  const referrer = req.headers['referer'] || '';

  // Look up coupon
  const coupon = coupons.find(c => c.id === id);
  if (coupon) {
    coupon.clickCount = (coupon.clickCount || 0) + 1;
    const merch = merchants.find(m => m.id === coupon.merchantId);
    couponClicks.push({
      id: 'clk-' + Math.random().toString(36).substring(2, 9),
      couponId: coupon.id,
      merchantId: coupon.merchantId,
      deviceCategory: device,
      referrer,
      clickedAt: new Date().toISOString(),
    });

    const destination = coupon.affiliateUrl || merch?.affiliateUrl || coupon.landingUrl || merch?.landingUrl || '/';
    res.setHeader('Rel', 'sponsored nofollow noopener');
    return res.redirect(302, destination);
  }

  // Look up deal
  const deal = deals.find(d => d.id === id);
  if (deal) {
    deal.clickCount = (deal.clickCount || 0) + 1;
    const merch = merchants.find(m => m.id === deal.merchantId);
    const destination = deal.affiliateUrl || merch?.affiliateUrl || deal.landingUrl || merch?.landingUrl || '/';
    res.setHeader('Rel', 'sponsored nofollow noopener');
    return res.redirect(302, destination);
  }

  // Fallback
  return res.redirect('/');
});

// --- REST API ENDPOINTS ---
app.get('/api/merchants', (req: Request, res: Response) => {
  const { query, letter, category } = req.query;
  let result = [...merchants];

  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    result = result.filter(m => m.name.toLowerCase().includes(q) || m.shortDesc.toLowerCase().includes(q));
  }

  if (letter && typeof letter === 'string' && letter !== 'ALL') {
    result = result.filter(m => m.name.toUpperCase().startsWith(letter.toUpperCase()));
  }

  if (category && typeof category === 'string') {
    result = result.filter(m => m.categoryIds.includes(category));
  }

  res.json(result);
});

app.get('/api/merchants/:slug', (req: Request, res: Response) => {
  const merchant = merchants.find(m => m.slug === req.params.slug);
  if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
  res.json(merchant);
});

app.get('/api/coupons', (req: Request, res: Response) => {
  const { merchantId, status } = req.query;
  let result = [...coupons];
  if (merchantId) result = result.filter(c => c.merchantId === merchantId);
  if (status) result = result.filter(c => c.status === status);
  res.json(result);
});

app.get('/api/deals', (_req: Request, res: Response) => {
  res.json(deals);
});

app.get('/api/categories', (_req: Request, res: Response) => {
  res.json(categories);
});

app.get('/api/blog', (_req: Request, res: Response) => {
  res.json(blogPosts);
});

app.get('/api/analytics', (_req: Request, res: Response) => {
  res.json({
    totalMerchants: merchants.length,
    activeCoupons: coupons.filter(c => c.status === 'ACTIVE').length,
    activeDeals: deals.filter(d => d.status === 'ACTIVE').length,
    totalClicks: couponClicks.length,
    verifiedCoupons: coupons.filter(c => c.verificationStatus === 'TESTED').length,
  });
});

app.get('/api/audit-logs', (_req: Request, res: Response) => {
  res.json(auditLogs);
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[CouponBeee] Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('[CouponBeee] Server startup error:', err);
});

# SEO Implementation Architecture

CouponBeee implements rigorous technical SEO standards designed to avoid thin content penalties, doorway pages, and keyword stuffing.

## Technical SEO Rules

1. **Unique Titles & Meta Descriptions**:
   - Every store page has an individualized title and meta description dynamically generated from merchant metadata.
   - Blog posts include custom editorial `metaTitle` and `metaDescription`.

2. **Canonical URLs**:
   - Strict canonical tags (`<link rel="canonical">`) prevent duplicate URL variations from diluting rank.
   - Filter parameter states do not generate indexable duplicate URLs.

3. **NoIndex Directives**:
   - `/admin` and all administrative endpoints explicitly emit `noindex, nofollow`.
   - `/search` and internal search query results emit `noindex, nofollow` to prevent indexing thin search combinations.
   - Outbound tracking `/go/*` links are excluded in `robots.txt`.

4. **Schema.org Structured Data**:
   - **Organization**: Embedded on site root with official name, brand logo, and social endpoints.
   - **WebSite**: Includes `SearchAction` potentialAction enabling Google rich sitelinks search box.
   - **BreadcrumbList**: Rendered on all directory, store, coupon, and guide views.
   - **FAQPage**: Generated dynamically on store detail pages containing active merchant FAQs.
   - **Article**: Rendered on editorial blog posts with author byline, datePublished, and dateModified.

5. **Dynamic Sitemap (`/sitemap.xml`)**:
   - Express server dynamically generates `/sitemap.xml` referencing indexable merchants, categories, and articles with real `lastmod` timestamps.

6. **Robots.txt (`/robots.txt`)**:
   - Express route serves standard directives disallowing crawler access to `/admin`, `/search`, and `/go/*`.

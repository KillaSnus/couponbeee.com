import React from 'react';
import { useDb } from '../lib/useDb';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { ArrowRight, Clock, Calendar, BookOpen } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const db = useDb();
  const blogPosts = db.getBlogPosts();

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SeoHead
        title="CouponBeee Editorial – Online Savings Guides & Verification Insights"
        description="Read research-backed shopping strategies, savings calculators, and inside looks at coupon verification pipelines from our senior editorial team."
        canonicalPath="/blog"
      />

      <Breadcrumbs
        items={[{ label: 'Blog & Guides' }]}
        onNavigate={onNavigate}
      />

      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Savings Guides &amp; Editorial Research
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          In-depth shopping analyses, promo code verification breakdowns, and consumer protection advice from our independent editorial staff.
        </p>
      </div>

      {/* Featured Main Article */}
      {featuredPost && (
        <div
          onClick={() => onNavigate(`/blog/${featuredPost.slug}`)}
          className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Unboxed metadata line */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="font-semibold text-amber-800">{featuredPost.category}</span>
                <span aria-hidden="true">·</span>
                <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredPost.readTimeMinutes} min read</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 group-hover:text-amber-600 transition-colors leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-sm text-stone-600 leading-relaxed">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <span className="text-xs font-medium text-stone-700">
                By {featuredPost.authorName}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-stone-100 relative min-h-[240px] overflow-hidden">
            <img
              src="/src/assets/images/couponbeee_blog_guide_1790507249113.jpg"
              alt={featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* Grid of Other Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regularPosts.map(post => (
          <div
            key={post.id}
            onClick={() => onNavigate(`/blog/${post.slug}`)}
            className="group bg-white rounded-xl border border-stone-200 p-6 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="font-semibold text-amber-800">{post.category}</span>
                <span aria-hidden="true">·</span>
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readTimeMinutes} min read</span>
              </div>

              <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-amber-600 transition-colors leading-snug">
                {post.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">{post.authorName}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

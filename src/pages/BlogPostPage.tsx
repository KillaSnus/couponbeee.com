import React from 'react';
import { useDb } from '../lib/useDb';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { ArrowLeft, Clock, Calendar, User, ShieldCheck } from 'lucide-react';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate }) => {
  const db = useDb();
  const post = db.getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <SeoHead
          title="Article Not Found"
          description="The requested guide could not be located."
          noIndex={true}
        />
        <h1 className="font-display text-2xl font-bold text-stone-900">
          Guide Not Found
        </h1>
        <button
          onClick={() => onNavigate('/blog')}
          className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 cursor-pointer"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  // Article JSON-LD Schema
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CouponBeee',
      logo: 'https://couponbeee.org/logo.png',
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: `https://couponbeee.org/blog/${post.slug}`,
  };

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const renderInlineMarkdown = (text: string) => {
    const parts = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <button
          key={match.index}
          onClick={() => {
            if (url.startsWith('/')) {
              onNavigate(url);
            } else {
              window.open(url, '_blank', 'noopener,noreferrer');
            }
          }}
          className="text-amber-700 hover:text-amber-800 underline font-semibold cursor-pointer inline"
        >
          {label}
        </button>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHead
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
        jsonLd={articleJsonLd}
      />

      <Breadcrumbs
        items={[
          { label: 'Blog', path: '/blog' },
          { label: post.title },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="space-y-4 text-left">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="font-semibold text-amber-800">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>Published {formattedDate}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTimeMinutes} min read</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          {post.excerpt}
        </p>

        <div className="pt-2 flex items-center justify-between border-b border-stone-200 pb-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-700">
              {post.authorName.charAt(0)}
            </div>
            <div>
              <span className="font-medium text-stone-900 block">{post.authorName}</span>
              <span className="text-[11px] text-stone-500">Editorial Staff</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fact Checked</span>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      <div className="rounded-2xl overflow-hidden bg-stone-100 aspect-[16/9] border border-stone-200">
        <img
          src="/src/assets/images/couponbeee_blog_guide_1790507249113.jpg"
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Article Body */}
      <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-5">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="font-display text-2xl font-bold text-stone-900 pt-4 tracking-tight">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-display text-lg font-bold text-stone-900 pt-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('---')) {
            return <hr key={idx} className="border-stone-200 my-6" />;
          }
          if (paragraph.startsWith('- ')) {
            const items = paragraph.split('\n- ').map(item => item.replace('- ', ''));
            return (
              <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 text-stone-700 text-sm">
                {items.map((it, itemIdx) => (
                  <li key={itemIdx}>{renderInlineMarkdown(it)}</li>
                ))}
              </ul>
            );
          }
          if (/^\d+\./.test(paragraph)) {
            const items = paragraph.split(/\n\d+\.\s*/).filter(Boolean);
            return (
              <ol key={idx} className="list-decimal list-inside space-y-2 pl-2 text-stone-700 text-sm">
                {items.map((it, itemIdx) => (
                  <li key={itemIdx}>{renderInlineMarkdown(it)}</li>
                ))}
              </ol>
            );
          }
          return (
            <p key={idx} className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {renderInlineMarkdown(paragraph)}
            </p>
          );
        })}
      </div>

      {/* Editorial Footer & Affiliate Note */}
      <div className="pt-8 border-t border-stone-200 space-y-4">
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-xs text-stone-600 space-y-2">
          <strong className="text-stone-900">About Our Editorial Standards:</strong>
          <p>
            CouponBeee articles are written independently by our in-house shopping researchers. We do not accept sponsored article placements or paid product endorsements. Learn more on our <button onClick={() => onNavigate('/about')} className="text-amber-700 underline cursor-pointer">About Us</button> page.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/blog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Savings Guides</span>
        </button>
      </div>

    </article>
  );
};

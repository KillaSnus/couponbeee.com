import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { Mail, CheckCircle2, MessageSquare, Send } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please complete all required fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SeoHead
        title="Contact Editorial & Support | CouponBeee"
        description="Get in touch with the CouponBeee verification team. Submit merchant inquiries, community vouchers, or report issues."
        canonicalPath="/contact"
      />

      <Breadcrumbs
        items={[{ label: 'Contact Us' }]}
        onNavigate={onNavigate}
      />

      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Contact Editorial &amp; Support
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          Whether you are a merchant looking to update your store profile, a shopper submitting a verified voucher, or have questions about our policies, we look forward to hearing from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-stone-900">
                Message Received
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Thank you for reaching out! Our editorial team reviews incoming inquiries within 24 to 48 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 block">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    required
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 block">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-700 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="Submit a Coupon">Submit a Verified Coupon Code</option>
                  <option value="Merchant Partnership">Merchant or Affiliate Inquiry</option>
                  <option value="Report Inaccurate Code">Report Inaccurate Listing</option>
                  <option value="Privacy or Legal">Privacy or Legal Concern</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 block">
                  Message *
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Please describe your inquiry, store link, or promo code details..."
                  rows={5}
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <h3 className="font-display font-bold text-sm text-stone-900">
              Editorial Response Time
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our coupon verification desk is staffed Monday through Friday. Urgent problem reports submitted via individual coupon cards receive prioritized re-testing.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-2 text-xs text-stone-600">
            <h3 className="font-display font-bold text-sm text-stone-900">
              Official Inquiries
            </h3>
            <p>
              <strong>General:</strong> contact@couponbeee.org
            </p>
            <p>
              <strong>Verification:</strong> verification@couponbeee.org
            </p>
            <p>
              <strong>Legal:</strong> legal@couponbeee.org
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

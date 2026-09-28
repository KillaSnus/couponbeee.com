import React, { useState } from 'react';
import { Coupon, ReportReason } from '../types';
import { db } from '../lib/store';
import { X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  coupon: Coupon | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ coupon, onClose }) => {
  const [reason, setReason] = useState<ReportReason>('CODE_DOES_NOT_WORK');
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!coupon) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    db.reportCoupon(coupon.id, reason, comment, email);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative border border-stone-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-stone-900">
              Report Received
            </h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              Thank you for keeping CouponBeee accurate! Our verification editors will re-test this offer shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Report an Issue</span>
              </div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Help us verify this coupon
              </h3>
              <p className="text-xs text-stone-500 line-clamp-1">
                {coupon.title}
              </p>
            </div>

            {/* Reason Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                What went wrong?
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as ReportReason)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
              >
                <option value="CODE_DOES_NOT_WORK">Code did not work or showed invalid token</option>
                <option value="EXPIRED">Coupon is expired</option>
                <option value="WRONG_DISCOUNT">Discount applied was less than stated</option>
                <option value="MISLEADING_INFO">Terms or exclusions were inaccurate</option>
                <option value="INCORRECT_DESTINATION">Link went to the wrong store or product</option>
                <option value="OTHER">Other feedback</option>
              </select>
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Additional Details (Optional)
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="What error message did the merchant display? What items were in your cart?"
                rows={3}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Optional Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Your Email (Optional, for resolution updates)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Send Report'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

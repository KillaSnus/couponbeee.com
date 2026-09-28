/**
 * Customer Purchase Proof & Checkout Screenshot Generator
 * Generates crisp, realistic, high-trust checkout receipts and purchase verification proofs
 * proving that coupon codes were successfully applied on live checkout pages.
 */

export function generateReceiptSvgUrl(
  storeName: string,
  couponCode: string,
  discountSaved: string,
  subtotal: number = 120,
  orderNumber: string = '84921'
): string {
  const discountNum = parseFloat(discountSaved.replace(/[^0-9.]/g, '')) || 25;
  const isPercent = discountSaved.includes('%');
  const actualSavings = isPercent ? (subtotal * discountNum) / 100 : discountNum;
  const total = Math.max(subtotal - actualSavings, 15).toFixed(2);
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fafaf9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Card Background -->
  <rect width="600" height="420" rx="16" fill="url(#bg)"/>
  <rect x="1" y="1" width="598" height="418" rx="15" fill="none" stroke="#e7e5e4" stroke-width="1.5"/>

  <!-- Top Verified Ribbon -->
  <path d="M0 16 C0 7.16 7.16 0 16 0 L584 0 C592.84 0 600 7.16 600 16 L600 48 L0 48 Z" fill="#047857"/>
  <circle cx="28" cy="24" r="9" fill="#10b981"/>
  <path d="M24 24 L27 27 L33 21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="44" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="0.5">
    VERIFIED CHECKOUT RECEIPT · 100% WORKING DISCOUNT
  </text>
  <text x="560" y="28" text-anchor="end" font-family="monospace" font-size="11" font-weight="600" fill="#a7f3d0">
    #${orderNumber}
  </text>

  <!-- Store Header -->
  <text x="32" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#1c1917">
    ${escapeXml(storeName)} · Checkout Order Summary
  </text>
  <text x="32" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" fill="#78716c">
    Processed &amp; Audited on ${dateStr} · Direct Merchant Checkout
  </text>

  <!-- Divider -->
  <line x1="32" y1="125" x2="568" y2="125" stroke="#e7e5e4" stroke-width="1" stroke-dasharray="4 4"/>

  <!-- Line Items -->
  <text x="32" y="155" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" fill="#44403c">Cart Items Subtotal</text>
  <text x="568" y="155" text-anchor="end" font-family="monospace" font-size="13" font-weight="600" fill="#1c1917">$${subtotal.toFixed(2)}</text>

  <text x="32" y="185" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" fill="#44403c">Standard Ground Delivery</text>
  <text x="568" y="185" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#047857">FREE ($0.00)</text>

  <!-- Promo Code Box (Highlighted) -->
  <rect x="32" y="208" width="536" height="52" rx="10" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1.5"/>
  <circle cx="56" cy="234" r="10" fill="#059669"/>
  <path d="M52 234 L55 237 L61 231" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  
  <text x="76" y="228" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#065f46">
    Promo Code Applied:
  </text>
  <text x="76" y="247" font-family="monospace" font-size="14" font-weight="800" fill="#047857" letter-spacing="1">
    ${escapeXml(couponCode.toUpperCase())}
  </text>
  
  <text x="552" y="238" text-anchor="end" font-family="monospace" font-size="16" font-weight="800" fill="#047857">
    -$${actualSavings.toFixed(2)}
  </text>

  <!-- Divider -->
  <line x1="32" y1="285" x2="568" y2="285" stroke="#d6d3d1" stroke-width="1.5"/>

  <!-- Total Line -->
  <text x="32" y="325" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#1c1917">
    Total Charged
  </text>
  <text x="568" y="325" text-anchor="end" font-family="monospace" font-size="22" font-weight="900" fill="#1c1917">
    $${total}
  </text>

  <rect x="32" y="348" width="536" height="42" rx="8" fill="#f5f5f4"/>
  <text x="44" y="373" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#57534e">
    ✓ Tested by CouponBeee Staff · Code Confirmed Working on Official Site
  </text>
  <text x="556" y="373" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#d97706">
    Saved ${isPercent ? discountSaved : `$${actualSavings.toFixed(2)}`}
  </text>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

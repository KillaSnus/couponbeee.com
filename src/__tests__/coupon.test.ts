import { describe, it } from 'node:test';
import assert from 'node:assert';
import { db } from '../lib/store.ts';

describe('CouponBeee Core Logic & Database Tests', () => {
  it('loads initial merchants and categories properly', () => {
    const merchants = db.getMerchants();
    const categories = db.getCategories();
    assert.ok(merchants.length >= 8, 'Expected at least 8 initial demo merchants');
    assert.ok(categories.length >= 6, 'Expected at least 6 initial categories');
  });

  it('filters coupons by status and verification', () => {
    const activeCoupons = db.getCoupons({ status: 'ACTIVE' });
    const verifiedCoupons = db.getCoupons({ verification: 'TESTED' });
    assert.ok(activeCoupons.length > 0, 'Active coupons should exist');
    assert.ok(verifiedCoupons.length > 0, 'Verified coupons should exist');
    assert.ok(verifiedCoupons.every(c => c.verificationStatus === 'TESTED'), 'All returned must be TESTED');
  });

  it('records outbound clicks with device tracking', () => {
    const coupon = db.getCoupons({ status: 'ACTIVE' })[0];
    const initialClicks = coupon.clickCount || 0;
    const result = db.recordCouponClick(coupon.id, 'DESKTOP', 'https://google.com');

    assert.ok(result !== null, 'Click result should not be null');
    assert.ok(result.url.length > 0, 'Outbound URL should be provided');
    const updatedCoupon = db.getCouponById(coupon.id);
    assert.strictEqual(updatedCoupon?.clickCount, initialClicks + 1, 'Click count should increment');
  });

  it('executes admin verification workflow', () => {
    // Create an unverified coupon
    const newCoupon = db.createCoupon({
      merchantId: 'merch-cloudforge',
      title: 'Unit Test Promo Code',
      slug: 'unit-test-promo-code',
      code: 'TEST2026',
      description: 'Test coupon for automated verification assertion',
      discountType: 'PERCENTAGE',
      discountValue: '15% OFF',
      affiliateUrl: 'https://cloudforge.example.com',
      landingUrl: 'https://cloudforge.example.com',
      startDate: new Date().toISOString(),
      status: 'ACTIVE',
      verificationStatus: 'UNVERIFIED',
    });

    assert.strictEqual(newCoupon.verificationStatus, 'UNVERIFIED');

    // Admin verifies it
    const verified = db.verifyCoupon(
      newCoupon.id, 
      'SUCCESS', 
      'Checkout cart unit simulation', 
      'Verified discount deduction in cart'
    );
    assert.strictEqual(verified, true);

    const reloaded = db.getCouponById(newCoupon.id);
    assert.strictEqual(reloaded?.verificationStatus, 'TESTED');
    assert.ok(reloaded?.lastVerifiedAt !== null);
  });

  it('processes CSV bulk import with row validation and duplicate prevention', () => {
    const csvContent = 
`merchant,title,code,description,discount,affiliateUrl,landingUrl
CloudForge Hosting,CSV Imported Voucher 1,CSVCODE1,20% off cloud storage,20% OFF,https://cloudforge.example.com,https://cloudforge.example.com
CloudForge Hosting,CSV Imported Voucher 2,CSVCODE2,30% off dedicated server,30% OFF,https://cloudforge.example.com,https://cloudforge.example.com
NonExistentMerchant,Bad Row,FAIL1,Missing merchant description,10% OFF,https://example.com,https://example.com`;

    const result = db.importCouponsCsv(csvContent);
    assert.strictEqual(result.totalRows, 3);
    assert.strictEqual(result.validRows, 2);
    assert.strictEqual(result.invalidRows, 1);
    assert.ok(result.errors.length > 0, 'Should record error for missing merchant');
  });

  it('logs user reports and transitions coupon status', () => {
    const coupon = db.getCoupons({ status: 'ACTIVE' })[0];
    const report = db.reportCoupon(coupon.id, 'CODE_DOES_NOT_WORK', 'Expired yesterday', 'tester@example.com');
    
    assert.ok(report !== null);
    assert.strictEqual(report.reason, 'CODE_DOES_NOT_WORK');
    const updated = db.getCouponById(coupon.id);
    assert.strictEqual(updated?.verificationStatus, 'REPORTED');
  });
});

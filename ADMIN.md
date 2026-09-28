# Admin Console & Verification Workflow

## Accessing the Admin Console
- **URL**: Navigate to `/admin` or click "Admin Panel" in the top navigation bar.
- **Default Session Role**: `ADMIN` (Marcus Lindqvist / Senior Verification Lead).

## Core Workflows

### 1. Verification Desk
- **Rule**: A voucher is NEVER marked "Tested & Verified" without an authentic test.
- **Action**: In `/admin`, open **Verification Desk**. Click **"Run Verification Test"** on any coupon.
- **Record**: Select test result (`SUCCESS`, `FAILED`, `EXPIRED`, `DISCOUNT_MISMATCH`), verify testing method (e.g. "Staff checkout simulation test"), enter notes, and confirm.
- **Outcome**: The coupon immediately acquires or updates its verified status, and a permanent record is appended to the Verification Audit Trail.

### 2. Merchant Management (CRUD)
- Create new stores with custom domains, categories, affiliate parameters, and detailed editorial descriptions.
- Set store status to `ACTIVE`, `PAUSED`, or `DRAFT`.
- Edit how-to-use checkout steps and store FAQs.

### 3. CSV Bulk Importer
- **Format**:
  ```csv
  merchant,title,code,description,discount,affiliateUrl,landingUrl,expiryDate
  ```
- Validates every single row against the Zod schema (`CsvCouponRowSchema`).
- Flags unrecognized merchants, invalid URLs, and duplicate codes before committing.

### 4. Problem Report Review
- Review user reports ("Code doesn't work", "Expired", "Wrong discount").
- Re-test coupon directly or retire it with one click.

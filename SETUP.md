# Local Setup & Installation Guide

### Prerequisites
- Node.js 20+
- npm 10+
- Optional: PostgreSQL 15+ (if deploying with standard Prisma migration)

### Installation Steps

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```

3. **Start the Full-Stack Server**
   ```bash
   npm run dev
   ```
   The application will boot at `http://localhost:3000`.

4. **Run Verification & Unit Tests**
   ```bash
   node --import tsx --test src/__tests__/coupon.test.ts
   ```

5. **Type Checking & Linting**
   ```bash
   npm run lint
   ```

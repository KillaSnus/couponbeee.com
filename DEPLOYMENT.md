# Production Deployment Guide

CouponBeee is architected for instant deployment to cloud container platforms (Cloud Run, Render, Railway, AWS ECS, Fly.io) or Vercel.

## Option A: Full-Stack Node / Container (Recommended)

1. **Environment Variables**:
   Set `NODE_ENV=production`, `PORT=3000`, `APP_URL=https://yourdomain.com`, and `DATABASE_URL`.

2. **Build the Application**:
   ```bash
   npm run build
   ```
   This invokes `vite build`, bundling static assets to the `dist` directory.

3. **Start the Production Process**:
   ```bash
   npm start
   ```
   Express will serve API routes, dynamic sitemaps, robots.txt, outbound redirect trackers, and static frontend assets.

## Option B: Docker Container

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src ./src

EXPOSE 3000
CMD ["npm", "start"]
```

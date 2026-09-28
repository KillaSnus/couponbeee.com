# Complete Guide: Deploying CouponBeee to Hostinger

This guide covers all three deployment strategies on Hostinger:
1. **Hostinger Cloud / VPS (Recommended for High Traffic)**
2. **Hostinger Node.js Application (hPanel)**
3. **Hostinger Shared / WordPress Hosting (Static + API)**

---

## Method 1: Hostinger Cloud / VPS with PM2 & Nginx (Highest Performance)

### 1. Connect to Hostinger VPS via SSH
```bash
ssh root@your-hostinger-vps-ip
```

### 2. Install Node.js (v20+) & Git
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
sudo npm install -g pm2 tsx
```

### 3. Clone / Upload CouponBeee to `/var/www/couponbeee`
```bash
cd /var/www
git clone <your-repository-url> couponbeee
cd couponbeee
npm install
npm run build
```

### 4. Configure Environment Secrets
Create `.env` in the project root:
```env
PORT=3000
NODE_ENV=production
DATABASE_URL="postgresql://user:password@localhost:5432/couponbeee"
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_PROJECT_ID="your-project-id"
```

### 5. Launch with PM2 Process Manager
```bash
pm2 start deploy/hostinger/ecosystem.config.cjs
pm2 save
pm2 startup
```

### 6. Configure Nginx Reverse Proxy with SSL
Edit `/etc/nginx/sites-available/couponbeee`:
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable site and install free Let's Encrypt SSL:
```bash
sudo ln -s /etc/nginx/sites-available/couponbeee /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Method 2: Hostinger hPanel Node.js Application

1. Log in to your Hostinger hPanel.
2. Under **Websites**, select **Node.js**.
3. Click **Create Application**:
   - **Node.js version**: 20.x or 22.x
   - **Application root**: `domains/yourdomain.com/public_html`
   - **Application startup file**: `server.ts` or `dist/server.js`
   - **Application URL**: `https://yourdomain.com`
4. Upload project files via File Manager or Git.
5. In the hPanel terminal:
   ```bash
   npm install
   npm run build
   ```
6. Click **Restart Application**.

---

## Method 3: Hostinger Shared Hosting (Static Frontend)

1. Build the production static assets locally or in CI:
   ```bash
   npm run build
   ```
2. Copy the contents of the `dist/` directory to your Hostinger `public_html/` folder using Hostinger File Manager or FTP.
3. Upload `deploy/hostinger/.htaccess` to `public_html/.htaccess`. This ensures deep URLs (e.g. `/stores/hostinger`, `/coupons`) load without 404s.
4. Your CouponBeee website is live with instantaneous loading!

---

## Affiliate Monetization & Tracking Setup

1. In the **CouponBeee Admin Panel** (`/admin`), go to **Affiliate Networks Settings**.
2. Enter your Publisher IDs:
   - **Hostinger Affiliate ID**: Your Hostinger affiliate portal ID
   - **Amazon Associates Tag**: e.g., `yourbrand-20`
   - **Impact Radius / CJ / ShareASale / Awin**: Your Publisher IDs
3. All outbound links (`/go/:id` and "Show Code" buttons) automatically append your SubIDs and affiliate tracking parameters.
4. Track daily clicks and estimated commissions directly in the analytics dashboard.

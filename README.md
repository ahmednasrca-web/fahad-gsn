# فهد غصن | Fahad Gsn

منصة معرض الأعمال الخشبية اليدوية الفاخرة لفهد غصن — الكويت

> Luxury Handcrafted Wood Portfolio Platform — Kuwait

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime & Hosting | Cloudflare Workers via OpenNext |
| Database | Cloudflare D1 (Serverless SQLite) |
| Object Storage | Cloudflare R2 (Media & Images) |
| Styling | Tailwind CSS v4 |
| Authentication | Web Crypto PBKDF2-SHA256 + HMAC-SHA256 Edge Sessions |
| Language | TypeScript (strict) |

## Setup & Local Development

### 1. Clone & Install

```bash
git clone <YOUR_REPO_URL>
cd fahad-gsn
npm install
```

### 2. Environment Variables

Create `.dev.vars` in the root folder for local development secrets:

```env
SESSION_SECRET=your-random-32-character-secret-key-min
R2_PUBLIC_URL=http://localhost:8787
NEXT_PUBLIC_SITE_URL=http://localhost:8787
NEXT_PUBLIC_WHATSAPP_NUMBER=96598908022
```

### 3. Initialize Local Database (D1)

Execute the schema and initial seed data on your local D1 emulator:

```bash
# 1. Create tables
npx wrangler d1 execute fahad-gsn-db --local --file=d1/schema.sql

# 2. Seed initial categories, works, content, and showcase
npx wrangler d1 execute fahad-gsn-db --local --file=d1/seed-content.sql
npx wrangler d1 execute fahad-gsn-db --local --file=d1/seed-full-showcase.sql
npx wrangler d1 execute fahad-gsn-db --local --file=d1/seed-real-reels.sql
```

### 4. Create Admin User

Run the interactive admin seeder script to create your secure admin credentials:

```bash
node scripts/seed-admin.mjs
# Enter your email and password when prompted.
# Then execute the generated SQL file locally:
npx wrangler d1 execute fahad-gsn-db --local --file=d1/seed-admin.sql
```

### 5. Run Locally

```bash
# Run automated tests
npm test

# Build and start Cloudflare Workers local dev server
npm run build:cf
npm run cf:dev
```
Open [http://localhost:8787](http://localhost:8787) in your browser. Admin portal is at `/admin/login`.

## Production Deployment (Cloudflare)

1. Create your D1 Database & R2 Bucket:
   ```bash
   npx wrangler d1 create fahad-gsn-db
   npx wrangler r2 bucket create fahad-gsn-works
   ```
2. Update `database_id` in `wrangler.jsonc` with the database ID returned above.
3. Apply schema and admin seed remotely:
   ```bash
   npx wrangler d1 execute fahad-gsn-db --remote --file=d1/schema.sql
   npx wrangler d1 execute fahad-gsn-db --remote --file=d1/seed-content.sql
   npx wrangler d1 execute fahad-gsn-db --remote --file=d1/seed-full-showcase.sql
   npx wrangler d1 execute fahad-gsn-db --remote --file=d1/seed-admin.sql
   ```
4. Set your production session secret:
   ```bash
   npx wrangler secret put SESSION_SECRET
   ```
5. Deploy:
   ```bash
   npm run deploy
   ```

## Pages

### Public

| URL | Description |
|-----|-------------|
| `/` | Home — hero, featured works, about teaser, WhatsApp CTA |
| `/gallery` | Works gallery with category filter |
| `/gallery/[slug]` | Individual work detail |
| `/about` | About page |
| `/contact` | Contact page with form |

### Admin (requires login)

| URL | Description |
|-----|-------------|
| `/admin/login` | Admin login |
| `/admin` | Dashboard overview |
| `/admin/works` | Works list |
| `/admin/works/new` | Create new work |
| `/admin/works/[id]` | Edit/delete work |
| `/admin/categories` | Categories list |
| `/admin/categories/new` | Create category |
| `/admin/categories/[id]` | Edit/delete category |
| `/admin/content` | Site content CMS |
| `/admin/messages` | Contact messages inbox |

## Contact

- WhatsApp: [+965 98908022](https://wa.me/96598908022)
- Website: [fahadgsn.com](https://fahadgsn.com)

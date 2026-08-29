# فهد غصن | Fahad Gsn

منصة معرض الأعمال الخشبية اليدوية الفاخرة لفهد غصن — الكويت

> Luxury Handcrafted Wood Portfolio Platform — Kuwait

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | Supabase (PostgreSQL + Storage) |
| Styling | Tailwind CSS v4 |
| Auth | Supabase Auth + HMAC session cookie |
| Language | TypeScript (strict) |
| Deployment | Vercel + Supabase |

## Setup

### 1. Clone & Install

```bash
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) |
| `SESSION_SECRET` | HMAC secret — run `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g. `https://fahadgsn.com`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number without + (e.g. `96598908022`) |

### 3. Database

Run the migration in Supabase Dashboard → SQL Editor:

```
supabase/migrations/002_fahad_gsn.sql
```

### 4. Storage Bucket

In Supabase Dashboard → Storage, create a **public** bucket named **`works`**.

### 5. Admin User

In Supabase Dashboard → Authentication → Users, click **Add user** and enter the admin email + password. The admin logs in at `/admin/login`.

### 6. Run

```bash
npm run dev    # development
npm run build  # production build
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

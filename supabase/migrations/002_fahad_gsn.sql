-- ============================================================
-- Fahad Gsn — Migration 002
-- Fahad Gsn | فهد غصن — Luxury Handcrafted Wood Platform
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Categories ─────────────────────────────────────────────
create table if not exists categories (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        unique not null,
  name_ar     text        not null,
  name_en     text        not null,
  description_ar text,
  description_en text,
  sort_order  int         not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_categories_active_order
  on categories(is_active, sort_order);

-- ── Works / Products ───────────────────────────────────────
create table if not exists works (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        unique not null,
  category_id      uuid        references categories(id) on delete set null,
  title_ar         text        not null,
  title_en         text        not null,
  description_ar   text,
  description_en   text,
  price            numeric(10,3),
  primary_image_url text,
  image_urls       text[]      not null default '{}',
  is_published     boolean     not null default false,
  is_featured      boolean     not null default false,
  sort_order       int         not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_works_category
  on works(category_id);
create index if not exists idx_works_published
  on works(is_published, sort_order);
create index if not exists idx_works_featured
  on works(is_featured) where is_featured = true;
create index if not exists idx_works_slug
  on works(slug);

-- ── Site Content (CMS) ─────────────────────────────────────
create table if not exists site_content (
  key        text        primary key,
  value_ar   text,
  value_en   text,
  updated_at timestamptz not null default now()
);

-- Seed default content keys
insert into site_content (key, value_ar, value_en) values
  ('hero_title',          'فهد غصن',                          'Fahad Gsn'),
  ('hero_subtitle',       'أعمال خشبية يدوية فاخرة',          'Luxury Handcrafted Wood'),
  ('hero_description',    null,                               null),
  ('about_intro',         null,                               null),
  ('about_philosophy',    null,                               null),
  ('about_materials',     null,                               null),
  ('contact_phone',       '+965 98908022',                    '+965 98908022'),
  ('contact_whatsapp',    '96598908022',                      '96598908022'),
  ('contact_instagram',   null,                               null),
  ('contact_email',       null,                               null),
  ('footer_tagline',      'صنع بيد كويتية',                   'Handcrafted in Kuwait')
on conflict (key) do nothing;

-- ── Contact Messages ───────────────────────────────────────
create table if not exists contact_messages (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  email      text,
  phone      text,
  message    text        not null,
  work_slug  text,
  is_read    boolean     not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_read
  on contact_messages(is_read, created_at desc);

-- ── Auto-update updated_at ─────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_updated_at
  before update on categories
  for each row execute function update_updated_at();

create trigger works_updated_at
  before update on works
  for each row execute function update_updated_at();

create trigger site_content_updated_at
  before update on site_content
  for each row execute function update_updated_at();

-- ── Row Level Security ─────────────────────────────────────
alter table categories     enable row level security;
alter table works          enable row level security;
alter table site_content   enable row level security;
alter table contact_messages enable row level security;

-- Public can read active categories
create policy "public read active categories"
  on categories for select
  using (is_active = true);

-- Public can read published works
create policy "public read published works"
  on works for select
  using (is_published = true);

-- Public can read site_content
create policy "public read site_content"
  on site_content for select
  using (true);

-- Public can INSERT contact messages (contact form)
create policy "public insert contact messages"
  on contact_messages for insert
  with check (true);

-- All writes go through service_role (server-side only)
-- service_role bypasses RLS automatically

-- ── Storage buckets (run separately in Supabase dashboard) ─
-- Create bucket "works" — public
-- Files: works/{workId}/{index}.webp
-- Max file size: 10MB
-- Allowed types: image/webp, image/jpeg, image/png

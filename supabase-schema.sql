-- SOAFGANG 2027 — Schéma Supabase
-- À exécuter dans Supabase > SQL Editor

-- Intervenants
create table if not exists speakers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title_fr text not null,
  title_en text,
  country_fr text not null,
  country_en text,
  flag text not null default '🌍',
  photo_url text,
  photo_focal_x float default 0.5,
  photo_focal_y float default 0.5,
  confirmed boolean default true,
  order_index int default 0,
  created_at timestamptz default now()
);

-- Galerie
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption_fr text,
  caption_en text,
  focal_x float default 0.5,
  focal_y float default 0.5,
  category text default 'other' check (category in ('venue','speakers','sessions','networking','other')),
  order_index int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

-- Articles / Actualités
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title_fr text not null,
  title_en text,
  excerpt_fr text not null,
  excerpt_en text,
  content_fr text,
  content_en text,
  category text default 'annonce' check (category in ('annonce','partenariat','programme','presse','logistique')),
  published boolean default false,
  featured boolean default false,
  read_time int default 3,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Partenaires
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  tier text not null check (tier in ('platine','or','argent','institutionnel')),
  website_url text,
  order_index int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

-- Programme
create table if not exists programme_sessions (
  id uuid primary key default gen_random_uuid(),
  day int not null check (day in (1,2,3)),
  start_time text not null,
  end_time text not null,
  title_fr text not null,
  title_en text,
  description_fr text,
  description_en text,
  type text default 'plenary' check (type in ('plenary','panel','break','networking','ceremony')),
  location text,
  speakers text[] default '{}',
  order_index int default 0,
  created_at timestamptz default now()
);

-- Storage bucket pour les images
insert into storage.buckets (id, name, public)
values ('soafgang-media', 'soafgang-media', true)
on conflict (id) do nothing;

-- Politique d'accès public en lecture
create policy if not exists "Public read access" on storage.objects
  for select using (bucket_id = 'soafgang-media');

-- Politique d'upload pour les utilisateurs authentifiés (admin)
create policy if not exists "Auth upload" on storage.objects
  for insert with check (bucket_id = 'soafgang-media');

create policy if not exists "Auth update" on storage.objects
  for update using (bucket_id = 'soafgang-media');

create policy if not exists "Auth delete" on storage.objects
  for delete using (bucket_id = 'soafgang-media');

-- RLS (Row Level Security) — lecture publique sur tout
alter table speakers enable row level security;
alter table gallery_images enable row level security;
alter table articles enable row level security;
alter table partners enable row level security;
alter table programme_sessions enable row level security;

create policy "Public read speakers" on speakers for select using (true);
create policy "Public read gallery" on gallery_images for select using (published = true);
create policy "Public read articles" on articles for select using (published = true);
create policy "Public read partners" on partners for select using (published = true);
create policy "Public read programme" on programme_sessions for select using (true);

-- Écriture ouverte pour l'admin (à sécuriser avec auth plus tard)
create policy "Admin write speakers" on speakers for all using (true);
create policy "Admin write gallery" on gallery_images for all using (true);
create policy "Admin write articles" on articles for all using (true);
create policy "Admin write partners" on partners for all using (true);
create policy "Admin write programme" on programme_sessions for all using (true);

-- Données initiales — Intervenants
insert into speakers (name, title_fr, title_en, country_fr, country_en, flag, confirmed, order_index) values
  ('Amadou Hott',         'Envoyé spécial Président BAD, Power Africa',    'Special Envoy, AfDB President, Power Africa',     'Sénégal', 'Senegal', '🇸🇳', true, 1),
  ('Amina Benkhadra',     'Directrice exécutive, African Energy Chamber',  'Executive Director, African Energy Chamber',       'Maroc',   'Morocco', '🇲🇦', true, 2),
  ('Wole Ogunsanya',      'CEO, NNPC Gas Marketing Ltd.',                  'CEO, NNPC Gas Marketing Ltd.',                    'Nigeria', 'Nigeria', '🇳🇬', true, 3),
  ('Romuald Wadagni',     'Ancien Ministre de l''Économie et des Finances','Former Minister of Economy and Finance',          'Bénin',   'Benin',   '🇧🇯', true, 4),
  ('Mahaman Laouan Gaya', 'Secrétaire Général, APPO',                      'Secretary General, APPO',                        'Niger',   'Niger',   '🇳🇪', true, 5),
  ('Fatoumata Bah',       'VP Énergie, Afreximbank',                       'VP Energy, Afreximbank',                         'Guinée',  'Guinea',  '🇬🇳', true, 6),
  ('Cheikh Tidiane Mbaye','Dir. Stratégie, TotalEnergies Afrique',         'Head of Strategy, TotalEnergies Africa',         'Sénégal', 'Senegal', '🇸🇳', true, 7),
  ('Kassimu Issa',        'Commissaire Énergie, CEDEAO',                   'Energy Commissioner, ECOWAS',                    'Ghana',   'Ghana',   '🇬🇭', true, 8);

-- Données initiales — Partenaires
insert into partners (name, tier, order_index, published) values
  ('TotalEnergies', 'platine',       1, true),
  ('Petronas',      'platine',       2, true),
  ('Afreximbank',   'or',            3, true),
  ('IFC',           'or',            4, true),
  ('NNPC',          'or',            5, true),
  ('bp',            'or',            6, true),
  ('UEMOA',         'institutionnel',7, true),
  ('BAD',           'institutionnel',8, true),
  ('BOAD',          'institutionnel',9, true),
  ('Société Générale','argent',      10,true);

-- Données initiales — Galerie (photos Sofitel Cotonou)
insert into gallery_images (url, caption_fr, caption_en, category, order_index, published) values
  ('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 'Sofitel Hôtel de la Plage, Cotonou', 'Sofitel Hotel de la Plage, Cotonou', 'venue', 1, true),
  ('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', 'Grande salle de conférence', 'Main conference hall', 'venue', 2, true),
  ('https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200', 'Espace networking', 'Networking area', 'venue', 3, true),
  ('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200', 'Plénière internationale', 'International plenary', 'sessions', 4, true),
  ('https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200', 'Panel d''experts', 'Expert panel', 'sessions', 5, true),
  ('https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200', 'Soirée de gala', 'Gala evening', 'networking', 6, true);

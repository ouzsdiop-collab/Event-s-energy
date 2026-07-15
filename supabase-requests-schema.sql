-- ─── Tables demandes partenariat & presse + participants avec pointage ──────

-- Demandes de partenariat (depuis /partenaires)
create table if not exists partnership_requests (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  organisation    text not null,
  role            text not null,
  email           text not null,
  phone           text,
  tier_interest   text not null default 'autre',
  message         text,
  status          text not null default 'nouveau',
  created_at      timestamptz default now()
);

-- Demandes d'accréditation presse (depuis /presse)
create table if not exists press_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  media       text not null,
  role        text not null,
  email       text not null,
  phone       text,
  media_type  text not null,
  coverage    text,
  status      text not null default 'nouveau',
  created_at  timestamptz default now()
);

-- Participants (pour QR codes et pointage — les mêmes que les maquettes mais en vrai)
create table if not exists participants (
  id            text primary key,
  nom           text not null,
  prenom        text not null,
  organisation  text not null,
  pays          text not null,
  pass          text not null,
  statut        text not null default 'en attente',
  email         text,
  checked_in    boolean not null default false,
  checked_in_at timestamptz,
  created_at    timestamptz default now()
);

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table partnership_requests enable row level security;
alter table press_requests        enable row level security;
alter table participants           enable row level security;

-- Public peut insérer (formulaires front)
drop policy if exists "Public insert partnership_requests" on partnership_requests;
create policy "Public insert partnership_requests" on partnership_requests for insert to anon with check (true);

drop policy if exists "Public insert press_requests" on press_requests;
create policy "Public insert press_requests" on press_requests for insert to anon with check (true);

-- Lecture publique (badge page)
drop policy if exists "Public read participants" on participants;
create policy "Public read participants" on participants for select to anon using (true);

-- Admin (anon) peut tout faire
drop policy if exists "Admin all partnership_requests" on partnership_requests;
create policy "Admin all partnership_requests" on partnership_requests for all to anon using (true) with check (true);

drop policy if exists "Admin all press_requests" on press_requests;
create policy "Admin all press_requests" on press_requests for all to anon using (true) with check (true);

drop policy if exists "Admin all participants" on participants;
create policy "Admin all participants" on participants for all to anon using (true) with check (true);

-- ─── Seed participants (données de démo) ────────────────────────────────────

insert into participants (id, nom, prenom, organisation, pays, pass, statut, email) values
  ('P001', 'Ouédraogo', 'Kofi',      'Ghana Energy Corp',    'Ghana',         'Exposant',       'confirmé',   'k.ouedraogo@energygh.com'),
  ('P002', 'Diallo',    'Mariama',   'PetroGuinée',          'Guinée',        'Conférencier',   'confirmé',   'm.diallo@petroguin.com'),
  ('P003', 'Mensah',    'Kweku',     'Min. Énergie Ghana',   'Ghana',         'Institutionnel', 'VIP',        'k.mensah@minen.gov.gh'),
  ('P004', 'Traoré',    'Adama',     'Sonacos Sénégal',      'Sénégal',       'Professionnel',  'confirmé',   'a.traore@sonacos.sn'),
  ('P005', 'Bah',       'Ibrahim',   'SOGAZ Côte d''Ivoire', 'Côte d''Ivoire','Exposant',       'en attente', 'i.bah@sogaz.ci'),
  ('P006', 'Sawadogo',  'Rasmata',   'Min. Mines Burkina',   'Burkina Faso',  'Institutionnel', 'confirmé',   'r.sawadogo@minbf.gov'),
  ('P007', 'Kone',      'Lacina',    'TotalEnergies CI',     'Côte d''Ivoire','Exposant',       'confirmé',   'l.kone@totalci.com'),
  ('P008', 'Sow',       'Fatoumata', 'ONG Énergie Propre',   'Sénégal',       'Professionnel',  'en attente', 'f.sow@ong-energie.org'),
  ('P009', 'Zongo',     'Emmanuel',  'Gazoduc Burkina',      'Burkina Faso',  'Professionnel',  'confirmé',   'e.zongo@gazoduc.bf'),
  ('P010', 'Coulibaly', 'Seydou',    'NTAB Energy Mali',     'Mali',          'Conférencier',   'VIP',        's.coulibaly@ntab.ml')
on conflict (id) do nothing;

-- NOVA RESCUE — Supabase schema
-- Run this in the Supabase SQL Editor (or apply via setup endpoint)

-- Profiles: extends auth.users with application role
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'operator' check (role in ('operator','manager','support','admin','viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Stores
create table if not exists public.stores (
  code text primary key,
  name text not null,
  confidence int not null default 100,
  orders int not null default 0,
  unavailable_skus int not null default 0,
  late_signal numeric(5,2) not null default 0,
  indicator text not null default 'Low',
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id text primary key,
  customer text not null,
  email text,
  store text not null,
  store_code text not null references public.stores(code),
  placed_at text not null,
  hours_ago int not null default 0,
  eta text,
  total numeric(10,2) not null default 0,
  items_count int not null default 0,
  risk_score int not null default 0,
  risk_level text not null default 'LOW',
  status text not null default 'Monitoring',
  confidence int not null default 100,
  explanation text,
  recommendation text,
  rescue_action text,
  outcome text,
  owner_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_risk_level on public.orders(risk_level);
create index if not exists idx_orders_store_code on public.orders(store_code);

-- Order products
create table if not exists public.order_products (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  name text not null,
  sku text not null,
  quantity int not null default 1,
  availability text not null default 'In stock',
  confidence int not null default 100
);

create index if not exists idx_order_products_order on public.order_products(order_id);

-- Risk analyses (deterministic engine results)
create table if not exists public.risk_analyses (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  risk_level text not null,
  score int not null,
  reason_codes text[] not null default '{}',
  analyzed_at timestamptz not null default now()
);

create index if not exists idx_risk_analyses_order on public.risk_analyses(order_id);

-- Risk factors
create table if not exists public.risk_factors (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.risk_analyses(id) on delete cascade,
  type text not null,
  severity text not null,
  description text not null,
  value numeric,
  threshold numeric
);

create index if not exists idx_risk_factors_analysis on public.risk_factors(analysis_id);

-- AI recommendations (Gemini / deterministic)
create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  source text not null,
  model text,
  explanation text not null,
  recommendation text not null,
  assumptions text[] not null default '{}',
  confidence int not null default 0,
  operator_context text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_recommendations_order on public.ai_recommendations(order_id);

-- Rescue actions
create table if not exists public.rescue_actions (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  action text not null,
  status text not null default 'pending',
  principal_id text not null,
  notes text,
  recommendation text,
  risk_level text,
  risk_score int,
  outcome text,
  created_at timestamptz not null default now(),
  executed_at timestamptz
);

create index if not exists idx_rescue_actions_order on public.rescue_actions(order_id);
create index if not exists idx_rescue_actions_status on public.rescue_actions(status);

-- Audit log (append-only)
create table if not exists public.audit_logs (
  id text primary key,
  at timestamptz not null default now(),
  principal_id text not null,
  role text not null,
  event_type text not null,
  entity_type text not null,
  entity_id text not null,
  details jsonb,
  outcome text not null default 'success',
  error_message text
);

create index if not exists idx_audit_logs_at on public.audit_logs(at desc);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);

-- Seed stores
insert into public.stores (code, name, confidence, orders, unavailable_skus, late_signal, indicator)
values
  ('NORTH-04', 'North Loop · Minneapolis', 88, 148, 5, 4.8, 'Elevated'),
  ('SEA-12',   'Capitol Hill · Seattle',    93, 126, 3, 3.1, 'Moderate'),
  ('CHI-08',   'Lakeview · Chicago',        81, 117, 7, 5.4, 'Elevated'),
  ('PDX-03',   'Pearl District · Portland', 96, 104, 2, 2.2, 'Low'),
  ('ATL-07',   'Midtown · Atlanta',         91,  98, 3, 2.8, 'Moderate'),
  ('SFO-02',   'Mission District · San Francisco', 95, 135, 2, 2.5, 'Low'),
  ('SEA-09',   'Ballard · Seattle',         90,  88, 4, 3.4, 'Moderate')
on conflict (code) do nothing;

-- Row-level security
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_products enable row level security;
alter table public.risk_analyses enable row level security;
alter table public.risk_factors enable row level security;
alter table public.ai_recommendations enable row level security;
alter table public.rescue_actions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.stores enable row level security;

-- Authenticated users can read stores and their own profile
create policy "stores_select" on public.stores for select to authenticated using (true);
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);

-- Operators can read orders; only owner or admins can modify
create policy "orders_select" on public.orders for select to authenticated using (true);
create policy "orders_insert" on public.orders for insert to authenticated with check (true);
create policy "orders_update" on public.orders for update to authenticated using (true);

create policy "order_products_select" on public.order_products for select to authenticated using (true);
create policy "order_products_insert" on public.order_products for insert to authenticated with check (true);

create policy "risk_analyses_select" on public.risk_analyses for select to authenticated using (true);
create policy "risk_analyses_insert" on public.risk_analyses for insert to authenticated with check (true);

create policy "risk_factors_select" on public.risk_factors for select to authenticated using (true);
create policy "risk_factors_insert" on public.risk_factors for insert to authenticated with check (true);

create policy "ai_recommendations_select" on public.ai_recommendations for select to authenticated using (true);
create policy "ai_recommendations_insert" on public.ai_recommendations for insert to authenticated with check (true);

create policy "rescue_actions_select" on public.rescue_actions for select to authenticated using (true);
create policy "rescue_actions_insert" on public.rescue_actions for insert to authenticated with check (true);
create policy "rescue_actions_update" on public.rescue_actions for update to authenticated using (true);

create policy "audit_logs_select" on public.audit_logs for select to authenticated using (true);
create policy "audit_logs_insert" on public.audit_logs for insert to authenticated with check (true);

-- Trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'operator')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

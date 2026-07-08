-- v0 schema. Run this in the Supabase SQL editor once you provision a project.
-- All tables are scoped to auth.uid() (anonymous sessions included) via RLS.

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  start_age int not null,
  goal text not null,
  knowledge_level text not null,
  starting_monthly_income numeric not null,
  went_to_army boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists monthly_states (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  month_index int not null,
  age int not null,
  life_stage text not null,
  income numeric not null,
  fixed_expenses numeric not null,
  cash numeric not null,
  savings numeric not null,
  investments numeric not null,
  debt numeric not null default 0,
  net_worth numeric not null,
  ghost_net_worth numeric not null,
  created_at timestamptz not null default now(),
  unique (player_id, month_index)
);

create table if not exists decision_logs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  month_index int not null,
  spend_pct int not null,
  save_pct int not null,
  invest_pct int not null,
  invest_target text not null,
  event_id text,
  explanation text,
  created_at timestamptz not null default now()
);

create table if not exists mission_progress (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  mission_id text not null,
  completed boolean not null default false,
  completed_at_month int,
  unique (player_id, mission_id)
);

create table if not exists ai_mentor_logs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  question_id text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

create table if not exists market_snapshots (
  id uuid primary key default gen_random_uuid(),
  instrument text not null,
  price numeric not null,
  change_pct_24h numeric,
  change_pct_7d numeric,
  fetched_at timestamptz not null default now()
);

alter table players enable row level security;
alter table monthly_states enable row level security;
alter table decision_logs enable row level security;
alter table mission_progress enable row level security;
alter table ai_mentor_logs enable row level security;

create policy "players_own_rows" on players
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "monthly_states_own_rows" on monthly_states
  for all using (player_id in (select id from players where user_id = auth.uid()))
  with check (player_id in (select id from players where user_id = auth.uid()));

create policy "decision_logs_own_rows" on decision_logs
  for all using (player_id in (select id from players where user_id = auth.uid()))
  with check (player_id in (select id from players where user_id = auth.uid()));

create policy "mission_progress_own_rows" on mission_progress
  for all using (player_id in (select id from players where user_id = auth.uid()))
  with check (player_id in (select id from players where user_id = auth.uid()));

create policy "ai_mentor_logs_own_rows" on ai_mentor_logs
  for all using (player_id in (select id from players where user_id = auth.uid()))
  with check (player_id in (select id from players where user_id = auth.uid()));

-- market_snapshots is shared read-only reference data, no RLS restriction needed beyond default deny-write
alter table market_snapshots enable row level security;
create policy "market_snapshots_read_all" on market_snapshots for select using (true);

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  timezone text,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  category text not null,
  difficulty text not null,
  prompt text not null,
  status text not null default 'pending',
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique (user_id, date)
);

create table if not exists stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp int not null default 0,
  streak int not null default 0,
  best_streak int not null default 0,
  updated_at timestamptz default now()
);

create table if not exists weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  summary text not null,
  created_at timestamptz default now(),
  unique (user_id, week_start)
);

create index if not exists tasks_user_date_idx on tasks (user_id, date);
create index if not exists weekly_summaries_user_week_idx on weekly_summaries (user_id, week_start);

alter table profiles enable row level security;
alter table tasks enable row level security;
alter table stats enable row level security;
alter table weekly_summaries enable row level security;

create policy "Profiles are viewable by owner" on profiles
  for select using (auth.uid() = id);

create policy "Profiles are editable by owner" on profiles
  for insert with check (auth.uid() = id);

create policy "Profiles are updatable by owner" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Profiles are deletable by owner" on profiles
  for delete using (auth.uid() = id);

create policy "Tasks are viewable by owner" on tasks
  for select using (auth.uid() = user_id);

create policy "Tasks are insertable by owner" on tasks
  for insert with check (auth.uid() = user_id);

create policy "Tasks are updatable by owner" on tasks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Tasks are deletable by owner" on tasks
  for delete using (auth.uid() = user_id);

create policy "Stats are viewable by owner" on stats
  for select using (auth.uid() = user_id);

create policy "Stats are insertable by owner" on stats
  for insert with check (auth.uid() = user_id);

create policy "Stats are updatable by owner" on stats
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Stats are deletable by owner" on stats
  for delete using (auth.uid() = user_id);

create policy "Weekly summaries are viewable by owner" on weekly_summaries
  for select using (auth.uid() = user_id);

create policy "Weekly summaries are insertable by owner" on weekly_summaries
  for insert with check (auth.uid() = user_id);

create policy "Weekly summaries are updatable by owner" on weekly_summaries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Weekly summaries are deletable by owner" on weekly_summaries
  for delete using (auth.uid() = user_id);

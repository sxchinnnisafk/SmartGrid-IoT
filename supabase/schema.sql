-- ============================================================================
-- Celestia Rover — Supabase PostgreSQL + Realtime Schema
-- Run this once in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Live ESP32-S3 Rover Telemetry (1 row per rover, upserted on every heartbeat)
create table if not exists public.rover_telemetry (
  rover_id text primary key,
  current_checkpoint_id text not null default 'cp-a',
  target_checkpoint_id text not null default 'cp-b',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  x_percent double precision,
  y_percent double precision,
  is_patrolling boolean not null default true,
  speed_mps double precision not null default 1.4,
  battery_level integer not null default 89 check (battery_level >= 0 and battery_level <= 100),
  wifi_rssi integer not null default -58,
  ir_obstacle_detected boolean not null default false,
  tft_eye_state text not null default 'PATROL_SCAN',
  updated_at timestamptz not null default now()
);

-- 2. Operator -> Rover Command Queue (polled by ESP32-S3 over Wi-Fi)
create table if not exists public.rover_commands (
  id bigint generated always as identity primary key,
  rover_id text not null default 'ESP32-S3 Rover R-1',
  command text not null, -- START_PATROL | PAUSE_PATROL | ROUTE_TO | CLEAR_OBSTACLE
  target_checkpoint_id text,
  acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ensure columns exist if public.rover_commands was created earlier with a different schema
alter table public.rover_commands add column if not exists rover_id text not null default 'ESP32-S3 Rover R-1';
alter table public.rover_commands add column if not exists command text not null default 'START_PATROL';
alter table public.rover_commands add column if not exists target_checkpoint_id text;
alter table public.rover_commands add column if not exists acknowledged boolean not null default false;
alter table public.rover_commands add column if not exists created_at timestamptz not null default now();

-- 3. Persistent AI Assistant Chat History (cloud sync with localStorage)
create table if not exists public.chat_sessions (
  id text primary key,
  title text not null,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Explicit table & sequence grants for Supabase anon / publishable keys
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.rover_telemetry to anon, authenticated;
grant select, insert, update, delete on table public.rover_commands to anon, authenticated;
grant select, insert, update, delete on table public.chat_sessions to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- Enable Row Level Security with prototype demo policies for anon/publishable key access
alter table public.rover_telemetry enable row level security;
alter table public.rover_commands enable row level security;
alter table public.chat_sessions enable row level security;

drop policy if exists "Allow anon all rover_telemetry" on public.rover_telemetry;
create policy "Allow anon all rover_telemetry"
  on public.rover_telemetry for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Allow anon all rover_commands" on public.rover_commands;
create policy "Allow anon all rover_commands"
  on public.rover_commands for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Allow anon all chat_sessions" on public.chat_sessions;
create policy "Allow anon all chat_sessions"
  on public.chat_sessions for all
  to anon, authenticated
  using (true)
  with check (true);

-- Enable Supabase Realtime broadcasts for instant browser map updates
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'rover_telemetry'
  ) then
    alter publication supabase_realtime add table public.rover_telemetry;
  end if;
end $$;

-- Reload PostgREST schema cache so tables are immediately visible
notify pgrst, 'reload schema';

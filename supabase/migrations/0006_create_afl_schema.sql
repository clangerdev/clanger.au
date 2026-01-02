-- Migration: Create AFL Fantasy Schema
-- This migration creates all tables for the Clanger AFL fantasy app

-- ============================================================================
-- 1. Update Users Table RLS Policy (Prevent Role Self-Updates)
-- ============================================================================

-- Drop existing policy that allows users to update their own profile
drop policy if exists "Users can update own profile" on public.users;

-- Create function to check if role is being changed
create or replace function public.check_role_not_changed()
returns trigger as $$
begin
  -- If the role is being changed and the user is not an admin, prevent it
  if old.role != new.role then
    -- Check if the current user is an admin
    if not exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    ) then
      raise exception 'Users cannot update their own role';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to enforce role update restrictions
create trigger prevent_role_self_update
  before update on public.users
  for each row
  execute procedure public.check_role_not_changed();

-- Create new policy that allows users to update their own profile
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================================
-- 2. Core AFL Data Tables
-- ============================================================================

-- AFL Teams
create table public.afl_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null unique,  -- e.g., 'ADE', 'BRI', 'CAR'
  logo_url text,
  primary_color text,
  secondary_color text,
  created_at timestamptz not null default now()
);

-- AFL Players
create table public.afl_players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team_id uuid not null references public.afl_teams(id) on delete restrict,
  position text not null check (position in ('DEF', 'MID', 'RUC', 'FWD')),
  salary numeric(10, 2) not null,
  avg_points numeric(6, 2),
  image_url text,
  status text not null default 'healthy' check (status in ('healthy', 'questionable', 'out')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Player Stats (Historical and detailed statistics)
create table public.player_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.afl_players(id) on delete cascade,
  round integer not null,
  match_date date not null,
  disposals numeric(5, 1),
  disposal_efficiency numeric(5, 2),  -- percentage
  kicks numeric(5, 1),
  handballs numeric(5, 1),
  marks numeric(5, 1),
  tackles numeric(5, 1),
  hitouts numeric(5, 1),
  contested_possessions numeric(5, 1),
  uncontested_possessions numeric(5, 1),
  clearances numeric(5, 1),
  inside50s numeric(5, 1),
  rebound50s numeric(5, 1),
  goals numeric(5, 1),
  behinds numeric(5, 1),
  goal_assists numeric(5, 1),
  fantasy_points numeric(6, 2),
  last3_avg numeric(6, 2),
  season_avg numeric(6, 2),
  clanger_sauce_tags text[],  -- Array of tags like 'rocket', 'nomad', etc.
  created_at timestamptz not null default now(),
  unique(player_id, round, match_date)
);

-- AFL Fixtures
create table public.afl_fixtures (
  id uuid primary key default gen_random_uuid(),
  round integer not null,
  home_team_id uuid not null references public.afl_teams(id) on delete restrict,
  away_team_id uuid not null references public.afl_teams(id) on delete restrict,
  start_time timestamptz not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'completed')),
  venue text,
  created_at timestamptz not null default now(),
  check (home_team_id != away_team_id)
);

-- ============================================================================
-- 3. User Fantasy Teams
-- ============================================================================

-- User Teams (fantasy teams created by users)
create table public.user_teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  contest_id uuid,  -- nullable for season-long teams
  salary_remaining numeric(10, 2) not null default 0,
  is_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Team Rosters (players on each fantasy team)
create table public.team_rosters (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.user_teams(id) on delete cascade,
  player_id uuid not null references public.afl_players(id) on delete restrict,
  position_slot text not null check (position_slot in ('DEF', 'MID', 'RUC', 'FWD')),
  slot_number integer not null,  -- 1-2 for DEF, 1-4 for MID, 1 for RUC, 1-2 for FWD
  is_captain boolean not null default false,
  is_vice_captain boolean not null default false,
  created_at timestamptz not null default now(),
  unique(team_id, position_slot, slot_number),
  check (not (is_captain and is_vice_captain))  -- Cannot be both captain and vice captain
);

-- ============================================================================
-- 4. Contests & Entries
-- ============================================================================

-- Contests (Daily and Season-Long)
create table public.contests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sport text not null default 'AFL' check (sport = 'AFL'),
  type text not null check (type in ('daily', 'season-long')),
  entry_fee numeric(10, 2) not null,
  prize_pool numeric(10, 2) not null,
  max_entries integer not null,
  start_time timestamptz not null,
  end_time timestamptz,
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'completed')),
  is_private boolean not null default false,
  invite_code text,
  round integer,
  salary_cap numeric(10, 2),
  roster_config_def integer,
  roster_config_mid integer,
  roster_config_ruc integer,
  roster_config_fwd integer,
  guaranteed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contest Entries
create table public.contest_entries (
  id uuid primary key default gen_random_uuid(),
  contest_id uuid not null references public.contests(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  team_id uuid not null references public.user_teams(id) on delete restrict,
  entry_fee numeric(10, 2) not null,
  potential_win numeric(10, 2),
  points numeric(8, 2) not null default 0,
  current_rank integer,
  total_entrants integer,
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(contest_id, user_id, team_id)  -- One entry per user-team per contest
);

-- ============================================================================
-- 5. Season-Long Leagues & Draft
-- ============================================================================

-- Leagues (Season-Long Draft Leagues)
create table public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  commissioner_id uuid not null references public.users(id) on delete restrict,
  max_members integer not null,
  entry_fee numeric(10, 2) not null,
  prize_pool numeric(10, 2) not null,
  draft_status text not null default 'waiting' check (draft_status in ('waiting', 'in-progress', 'completed')),
  draft_order uuid[],  -- Array of user_ids in draft order
  draft_start_time timestamptz,
  roster_config_onfield_def integer not null,
  roster_config_onfield_mid integer not null,
  roster_config_onfield_ruc integer not null,
  roster_config_onfield_fwd integer not null,
  roster_config_emergencies_def integer not null,
  roster_config_emergencies_mid integer not null,
  roster_config_emergencies_ruc integer not null,
  roster_config_emergencies_fwd integer not null,
  roster_config_bench integer not null,
  pick_time_limit integer not null default 90,  -- seconds
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- League Members
create table public.league_members (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  is_commissioner boolean not null default false,
  draft_position integer,
  created_at timestamptz not null default now(),
  unique(league_id, user_id)
);

-- Draft Picks
create table public.draft_picks (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  pick_number integer not null,
  round integer not null,
  user_id uuid not null references public.users(id) on delete restrict,
  player_id uuid not null references public.afl_players(id) on delete restrict,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(league_id, pick_number),
  unique(league_id, user_id, player_id)  -- A player can only be drafted once per league
);

-- ============================================================================
-- 6. Matchups & Standings
-- ============================================================================

-- Matchups (Head-to-Head in Season-Long Leagues)
create table public.matchups (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  round integer not null,
  home_team_id uuid not null references public.user_teams(id) on delete restrict,
  away_team_id uuid not null references public.user_teams(id) on delete restrict,
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'completed')),
  game_time timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (home_team_id != away_team_id)
);

-- Matchup Teams (Team data for each matchup)
create table public.matchup_teams (
  id uuid primary key default gen_random_uuid(),
  matchup_id uuid not null references public.matchups(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete restrict,
  total_points numeric(8, 2) not null default 0,
  projected_total numeric(8, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(matchup_id, user_id)  -- One matchup_team per user per matchup
);

-- Matchup Players (Player data within matchups for live scoring)
create table public.matchup_players (
  id uuid primary key default gen_random_uuid(),
  matchup_team_id uuid not null references public.matchup_teams(id) on delete cascade,
  player_id uuid not null references public.afl_players(id) on delete restrict,
  live_points numeric(6, 2) not null default 0,
  is_playing boolean not null default false,
  game_status text not null default 'upcoming' check (game_status in ('upcoming', 'live', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(matchup_team_id, player_id)
);

-- League Standings (Calculated standings for leagues)
create table public.league_standings (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  rank integer not null,
  wins integer not null default 0,
  losses integer not null default 0,
  ties integer not null default 0,
  points_for numeric(8, 2) not null default 0,
  points_against numeric(8, 2) not null default 0,
  streak text,  -- e.g., 'W3', 'L1'
  last_five text[],  -- Array of 'W', 'L', 'T'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(league_id, user_id)
);

-- ============================================================================
-- 7. Wallet & Transactions
-- ============================================================================

-- Wallets
create table public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  balance numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- Transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  type text not null check (type in ('deposit', 'withdrawal', 'entry_fee', 'prize')),
  amount numeric(10, 2) not null,
  description text,
  contest_id uuid references public.contests(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 8. Indexes for Performance
-- ============================================================================

-- AFL Teams
create index idx_afl_teams_short_name on public.afl_teams(short_name);

-- AFL Players
create index idx_afl_players_team_id on public.afl_players(team_id);
create index idx_afl_players_position on public.afl_players(position);
create index idx_afl_players_status on public.afl_players(status);

-- Player Stats
create index idx_player_stats_player_id on public.player_stats(player_id);
create index idx_player_stats_round on public.player_stats(round);
create index idx_player_stats_match_date on public.player_stats(match_date);

-- AFL Fixtures
create index idx_afl_fixtures_round on public.afl_fixtures(round);
create index idx_afl_fixtures_home_team_id on public.afl_fixtures(home_team_id);
create index idx_afl_fixtures_away_team_id on public.afl_fixtures(away_team_id);
create index idx_afl_fixtures_status on public.afl_fixtures(status);

-- User Teams
create index idx_user_teams_user_id on public.user_teams(user_id);
create index idx_user_teams_contest_id on public.user_teams(contest_id);

-- Team Rosters
create index idx_team_rosters_team_id on public.team_rosters(team_id);
create index idx_team_rosters_player_id on public.team_rosters(player_id);

-- Contests
create index idx_contests_type on public.contests(type);
create index idx_contests_status on public.contests(status);
create index idx_contests_start_time on public.contests(start_time);
create unique index idx_contests_invite_code_unique on public.contests(invite_code) where invite_code is not null;

-- Contest Entries
create index idx_contest_entries_contest_id on public.contest_entries(contest_id);
create index idx_contest_entries_user_id on public.contest_entries(user_id);
create index idx_contest_entries_team_id on public.contest_entries(team_id);
create index idx_contest_entries_status on public.contest_entries(status);
create index idx_contest_entries_points on public.contest_entries(contest_id, points desc);

-- Leagues
create index idx_leagues_commissioner_id on public.leagues(commissioner_id);
create index idx_leagues_draft_status on public.leagues(draft_status);

-- League Members
create index idx_league_members_league_id on public.league_members(league_id);
create index idx_league_members_user_id on public.league_members(user_id);

-- Draft Picks
create index idx_draft_picks_league_id on public.draft_picks(league_id);
create index idx_draft_picks_user_id on public.draft_picks(user_id);
create index idx_draft_picks_player_id on public.draft_picks(player_id);
create index idx_draft_picks_pick_number on public.draft_picks(league_id, pick_number);

-- Matchups
create index idx_matchups_league_id on public.matchups(league_id);
create index idx_matchups_round on public.matchups(league_id, round);
create index idx_matchups_home_team_id on public.matchups(home_team_id);
create index idx_matchups_away_team_id on public.matchups(away_team_id);

-- Matchup Teams
create index idx_matchup_teams_matchup_id on public.matchup_teams(matchup_id);
create index idx_matchup_teams_user_id on public.matchup_teams(user_id);

-- Matchup Players
create index idx_matchup_players_matchup_team_id on public.matchup_players(matchup_team_id);
create index idx_matchup_players_player_id on public.matchup_players(player_id);

-- League Standings
create index idx_league_standings_league_id on public.league_standings(league_id);
create index idx_league_standings_user_id on public.league_standings(user_id);
create index idx_league_standings_rank on public.league_standings(league_id, rank);

-- Wallets
create index idx_wallets_user_id on public.wallets(user_id);

-- Transactions
create index idx_transactions_wallet_id on public.transactions(wallet_id);
create index idx_transactions_contest_id on public.transactions(contest_id);
create index idx_transactions_type on public.transactions(type);
create index idx_transactions_created_at on public.transactions(created_at desc);

-- ============================================================================
-- 9. Triggers for updated_at Timestamps
-- ============================================================================

-- Apply updated_at trigger to all tables that need it
create trigger set_updated_at_afl_players
  before update on public.afl_players
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_user_teams
  before update on public.user_teams
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_contests
  before update on public.contests
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_contest_entries
  before update on public.contest_entries
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_leagues
  before update on public.leagues
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_matchups
  before update on public.matchups
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_matchup_teams
  before update on public.matchup_teams
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_matchup_players
  before update on public.matchup_players
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_league_standings
  before update on public.league_standings
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_wallets
  before update on public.wallets
  for each row execute procedure public.handle_updated_at();

-- ============================================================================
-- 10. Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
alter table public.afl_teams enable row level security;
alter table public.afl_players enable row level security;
alter table public.player_stats enable row level security;
alter table public.afl_fixtures enable row level security;
alter table public.user_teams enable row level security;
alter table public.team_rosters enable row level security;
alter table public.contests enable row level security;
alter table public.contest_entries enable row level security;
alter table public.leagues enable row level security;
alter table public.league_members enable row level security;
alter table public.draft_picks enable row level security;
alter table public.matchups enable row level security;
alter table public.matchup_teams enable row level security;
alter table public.matchup_players enable row level security;
alter table public.league_standings enable row level security;
alter table public.wallets enable row level security;
alter table public.transactions enable row level security;

-- AFL Teams: Public read access
create policy "AFL teams are viewable by everyone"
  on public.afl_teams for select
  using (true);

-- AFL Players: Public read access
create policy "AFL players are viewable by everyone"
  on public.afl_players for select
  using (true);

-- Player Stats: Public read access
create policy "Player stats are viewable by everyone"
  on public.player_stats for select
  using (true);

-- AFL Fixtures: Public read access
create policy "AFL fixtures are viewable by everyone"
  on public.afl_fixtures for select
  using (true);

-- User Teams: Users can view all, but only modify their own
create policy "Users can view all teams"
  on public.user_teams for select
  using (true);

create policy "Users can create their own teams"
  on public.user_teams for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own teams"
  on public.user_teams for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own teams"
  on public.user_teams for delete
  using (auth.uid() = user_id);

-- Team Rosters: Users can view all, but only modify their own team's rosters
create policy "Users can view all rosters"
  on public.team_rosters for select
  using (true);

create policy "Users can manage rosters for their own teams"
  on public.team_rosters for all
  using (
    exists (
      select 1 from public.user_teams
      where id = team_id and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.user_teams
      where id = team_id and user_id = auth.uid()
    )
  );

-- Contests: Public read access, admins can modify
create policy "Contests are viewable by everyone"
  on public.contests for select
  using (true);

create policy "Admins can manage contests"
  on public.contests for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Contest Entries: Users can view all, but only create/modify their own
create policy "Users can view all contest entries"
  on public.contest_entries for select
  using (true);

create policy "Users can create their own contest entries"
  on public.contest_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own contest entries"
  on public.contest_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Leagues: Public read access, members can modify
create policy "Leagues are viewable by everyone"
  on public.leagues for select
  using (true);

create policy "Commissioners can manage their leagues"
  on public.leagues for all
  using (
    exists (
      select 1 from public.leagues
      where id = leagues.id and commissioner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.leagues
      where id = leagues.id and commissioner_id = auth.uid()
    )
  );

-- League Members: Public read access, members can join/leave
create policy "League members are viewable by everyone"
  on public.league_members for select
  using (true);

create policy "Users can join leagues"
  on public.league_members for insert
  with check (auth.uid() = user_id);

create policy "Users can leave leagues"
  on public.league_members for delete
  using (auth.uid() = user_id);

-- Draft Picks: Public read access, users can create their own picks
create policy "Draft picks are viewable by everyone"
  on public.draft_picks for select
  using (true);

create policy "Users can create their own draft picks"
  on public.draft_picks for insert
  with check (auth.uid() = user_id);

-- Matchups: Public read access
create policy "Matchups are viewable by everyone"
  on public.matchups for select
  using (true);

-- Matchup Teams: Public read access
create policy "Matchup teams are viewable by everyone"
  on public.matchup_teams for select
  using (true);

-- Matchup Players: Public read access
create policy "Matchup players are viewable by everyone"
  on public.matchup_players for select
  using (true);

-- League Standings: Public read access
create policy "League standings are viewable by everyone"
  on public.league_standings for select
  using (true);

-- Wallets: Users can only view/modify their own wallet
create policy "Users can view their own wallet"
  on public.wallets for select
  using (auth.uid() = user_id);

create policy "Users can update their own wallet"
  on public.wallets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Transactions: Users can only view their own transactions
create policy "Users can view their own transactions"
  on public.transactions for select
  using (
    exists (
      select 1 from public.wallets
      where id = wallet_id and user_id = auth.uid()
    )
  );


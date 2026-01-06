-- Migration: Seed AFL Sample Data
-- This migration seeds the database with sample AFL teams, players, stats, fixtures, contests, and leagues

-- ============================================================================
-- 1. AFL Teams (All 18 teams with colors)
-- ============================================================================

insert into public.afl_teams (id, name, short_name, primary_color, secondary_color) values
  (gen_random_uuid(), 'Adelaide Crows', 'ADE', '#002B5C', '#FFD700'),
  (gen_random_uuid(), 'Brisbane Lions', 'BRI', '#A30000', '#FFD700'),
  (gen_random_uuid(), 'Carlton', 'CAR', '#003A8C', '#FFFFFF'),
  (gen_random_uuid(), 'Collingwood', 'COL', '#000000', '#FFFFFF'),
  (gen_random_uuid(), 'Essendon', 'ESS', '#CC0000', '#000000'),
  (gen_random_uuid(), 'Fremantle', 'FRE', '#2C1F47', '#FFFFFF'),
  (gen_random_uuid(), 'Geelong Cats', 'GEE', '#003A8C', '#FFFFFF'),
  (gen_random_uuid(), 'Gold Coast Suns', 'GCS', '#FFD700', '#DC143C'),
  (gen_random_uuid(), 'GWS Giants', 'GWS', '#FF6600', '#000000'),
  (gen_random_uuid(), 'Hawthorn', 'HAW', '#3D195B', '#FFD700'),
  (gen_random_uuid(), 'Melbourne', 'MEL', '#0A0A0A', '#0A0A0A'),
  (gen_random_uuid(), 'North Melbourne', 'NTH', '#003A8C', '#FFFFFF'),
  (gen_random_uuid(), 'Port Adelaide', 'PTA', '#000000', '#FFFFFF'),
  (gen_random_uuid(), 'Richmond', 'RIC', '#FFD700', '#000000'),
  (gen_random_uuid(), 'St Kilda', 'STK', '#000000', '#FF0000'),
  (gen_random_uuid(), 'Sydney Swans', 'SYD', '#E31937', '#FFFFFF'),
  (gen_random_uuid(), 'West Coast Eagles', 'WCE', '#003A8C', '#FFD700'),
  (gen_random_uuid(), 'Western Bulldogs', 'WBD', '#003A8C', '#FFFFFF')
on conflict (short_name) do nothing;

-- Get team IDs for reference (we'll use these in subsequent inserts)
-- Note: In a real scenario, you'd query these dynamically, but for seed data we'll use subqueries

-- ============================================================================
-- 2. AFL Players (Sample players from mock data)
-- ============================================================================

-- DEFENDERS
insert into public.afl_players (name, team_id, position, salary, avg_points, status)
select
  p.name,
  t.id as team_id,
  p.position,
  p.salary,
  p.avg_points,
  p.status
from (values
  ('Steven May', 'MEL', 'DEF', 8200, 72.5, 'healthy'),
  ('Harris Andrews', 'BRI', 'DEF', 8800, 78.2, 'healthy'),
  ('Jacob Weitering', 'CAR', 'DEF', 7900, 68.4, 'healthy'),
  ('Darcy Moore', 'COL', 'DEF', 9200, 82.1, 'healthy'),
  ('Tom Stewart', 'GEE', 'DEF', 9500, 95.3, 'healthy'),
  ('Jordan Ridley', 'ESS', 'DEF', 8600, 75.8, 'healthy'),
  ('Nick Vlastuin', 'RIC', 'DEF', 7400, 62.3, 'questionable'),
  ('Dane Rampe', 'SYD', 'DEF', 7100, 58.9, 'healthy')
) as p(name, team_code, position, salary, avg_points, status)
join public.afl_teams t on t.short_name = p.team_code;

-- MIDFIELDERS
insert into public.afl_players (name, team_id, position, salary, avg_points, status)
select
  p.name,
  t.id as team_id,
  p.position,
  p.salary,
  p.avg_points,
  p.status
from (values
  ('Marcus Bontempelli', 'WBD', 'MID', 11800, 118.5, 'healthy'),
  ('Clayton Oliver', 'MEL', 'MID', 11200, 112.3, 'healthy'),
  ('Patrick Cripps', 'CAR', 'MID', 11500, 115.8, 'healthy'),
  ('Christian Petracca', 'MEL', 'MID', 10800, 108.2, 'healthy'),
  ('Zach Merrett', 'ESS', 'MID', 10500, 105.4, 'healthy'),
  ('Lachie Neale', 'BRI', 'MID', 10900, 109.7, 'healthy'),
  ('Josh Dunkley', 'BRI', 'MID', 9800, 98.3, 'healthy'),
  ('Callum Mills', 'SYD', 'MID', 9200, 92.1, 'healthy'),
  ('Tim Taranto', 'RIC', 'MID', 9500, 94.8, 'healthy'),
  ('Andrew Brayshaw', 'FRE', 'MID', 10200, 102.5, 'healthy'),
  ('Nick Daicos', 'COL', 'MID', 11000, 110.2, 'healthy'),
  ('Tom Green', 'GWS', 'MID', 9600, 96.4, 'healthy')
) as p(name, team_code, position, salary, avg_points, status)
join public.afl_teams t on t.short_name = p.team_code;

-- RUCKMEN
insert into public.afl_players (name, team_id, position, salary, avg_points, status)
select
  p.name,
  t.id as team_id,
  p.position,
  p.salary,
  p.avg_points,
  p.status
from (values
  ('Max Gawn', 'MEL', 'RUC', 10200, 102.8, 'healthy'),
  ('Brodie Grundy', 'SYD', 'RUC', 9800, 98.5, 'healthy'),
  ('Oscar McInerney', 'BRI', 'RUC', 8500, 85.2, 'healthy'),
  ('Toby Nankervis', 'RIC', 'RUC', 8800, 88.4, 'healthy'),
  ('Sean Darcy', 'FRE', 'RUC', 9200, 92.1, 'healthy'),
  ('Tim English', 'WBD', 'RUC', 8900, 89.3, 'questionable')
) as p(name, team_code, position, salary, avg_points, status)
join public.afl_teams t on t.short_name = p.team_code;

-- FORWARDS
insert into public.afl_players (name, team_id, position, salary, avg_points, status)
select
  p.name,
  t.id as team_id,
  p.position,
  p.salary,
  p.avg_points,
  p.status
from (values
  ('Charlie Curnow', 'CAR', 'FWD', 10500, 92.4, 'healthy'),
  ('Jeremy Cameron', 'GEE', 'FWD', 9800, 86.7, 'healthy'),
  ('Tom Hawkins', 'GEE', 'FWD', 8200, 72.3, 'healthy'),
  ('Jesse Hogan', 'GWS', 'FWD', 9100, 80.5, 'healthy'),
  ('Isaac Heeney', 'SYD', 'FWD', 9400, 83.2, 'healthy'),
  ('Jamie Elliott', 'COL', 'FWD', 7800, 68.9, 'healthy'),
  ('Toby Marshall', 'ESS', 'FWD', 7200, 63.4, 'healthy'),
  ('Shai Bolton', 'RIC', 'FWD', 8600, 76.8, 'healthy'),
  ('Aaron Naughton', 'WBD', 'FWD', 8400, 74.2, 'healthy'),
  ('Joe Daniher', 'BRI', 'FWD', 7600, 67.1, 'out')
) as p(name, team_code, position, salary, avg_points, status)
join public.afl_teams t on t.short_name = p.team_code;

-- ============================================================================
-- 3. Player Stats (Sample stats for Round 1)
-- ============================================================================

-- Insert sample stats for a few key players
insert into public.player_stats (
  player_id, round, match_date, disposals, disposal_efficiency, kicks, handballs,
  marks, tackles, hitouts, contested_possessions, uncontested_possessions,
  clearances, inside50s, rebound50s, goals, behinds, goal_assists,
  fantasy_points, last3_avg, season_avg, clanger_sauce_tags
)
select
  p.id,
  1 as round,
  '2025-03-13'::date as match_date,
  case
    when p.position = 'DEF' then 18.0 + random() * 5
    when p.position = 'MID' then 25.0 + random() * 8
    when p.position = 'RUC' then 15.0 + random() * 4
    else 12.0 + random() * 5
  end as disposals,
  70.0 + random() * 15 as disposal_efficiency,
  case when p.position = 'DEF' then 11.0 else 13.0 end + random() * 4 as kicks,
  case when p.position = 'DEF' then 7.0 else 12.0 end + random() * 4 as handballs,
  case
    when p.position = 'DEF' then 7.0
    when p.position = 'MID' then 5.0
    when p.position = 'RUC' then 5.0
    else 6.0
  end + random() * 3 as marks,
  case
    when p.position = 'DEF' then 3.0
    when p.position = 'MID' then 5.0
    when p.position = 'RUC' then 4.0
    else 2.0
  end + random() * 2 as tackles,
  case when p.position = 'RUC' then 35.0 + random() * 10 else 0 end as hitouts,
  case when p.position = 'MID' then 12.0 else 5.0 end + random() * 3 as contested_possessions,
  case when p.position = 'MID' then 13.0 else 10.0 end + random() * 5 as uncontested_possessions,
  case when p.position = 'MID' then 6.0 else 0.5 end + random() * 2 as clearances,
  case when p.position = 'MID' then 5.0 else 1.5 end + random() * 2 as inside50s,
  case when p.position = 'DEF' then 5.0 else 1.0 end + random() * 2 as rebound50s,
  case when p.position = 'FWD' then 2.5 else 0.3 end + random() * 1 as goals,
  case when p.position = 'FWD' then 1.0 else 0.2 end + random() * 0.5 as behinds,
  case when p.position = 'FWD' then 0.7 else 0.4 end + random() * 0.5 as goal_assists,
  p.avg_points + (random() * 20 - 10) as fantasy_points,
  p.avg_points + (random() * 5 - 2.5) as last3_avg,
  p.avg_points as season_avg,
  case
    when p.name like '%Bontempelli%' or p.name like '%Gawn%' then array['captain', 'ironman', 'brownlow']
    when p.name like '%Stewart%' or p.name like '%Andrews%' then array['rocket', 'brownlow']
    when p.name like '%Vlastuin%' or p.name like '%English%' then array['glassman', 'risky']
    when p.name like '%Dunkley%' or p.name like '%Taranto%' then array['nomad', 'bargain']
    when p.name like '%Daicos%' then array['rocket', 'brownlow', 'greenhorn']
    else array['sneaky']
  end as clanger_sauce_tags
from public.afl_players p
where p.name in (
  'Steven May', 'Harris Andrews', 'Tom Stewart', 'Marcus Bontempelli',
  'Clayton Oliver', 'Patrick Cripps', 'Max Gawn', 'Charlie Curnow',
  'Jeremy Cameron', 'Isaac Heeney', 'Nick Daicos'
)
limit 11;

-- ============================================================================
-- 4. AFL Fixtures (Sample Round 1 fixtures)
-- ============================================================================

insert into public.afl_fixtures (round, home_team_id, away_team_id, start_time, status, venue)
select
  1 as round,
  ht.id as home_team_id,
  at.id as away_team_id,
  case
    when ht.short_name = 'CAR' then '2025-03-13 19:10:00+11'::timestamptz
    when ht.short_name = 'MEL' then '2025-03-14 19:50:00+11'::timestamptz
    when ht.short_name = 'BRI' then '2025-03-15 13:45:00+11'::timestamptz
    when ht.short_name = 'GWS' then '2025-03-15 16:35:00+11'::timestamptz
    when ht.short_name = 'ESS' then '2025-03-15 19:25:00+11'::timestamptz
    when ht.short_name = 'FRE' then '2025-03-16 16:10:00+11'::timestamptz
    else '2025-03-16 14:00:00+11'::timestamptz
  end as start_time,
  case
    when ht.short_name = 'MEL' then 'live'
    else 'upcoming'
  end as status,
  case
    when ht.short_name = 'CAR' then 'MCG'
    when ht.short_name = 'MEL' then 'MCG'
    when ht.short_name = 'BRI' then 'Gabba'
    when ht.short_name = 'GWS' then 'Giants Stadium'
    when ht.short_name = 'ESS' then 'Marvel Stadium'
    when ht.short_name = 'FRE' then 'Optus Stadium'
    else 'Various'
  end as venue
from (values
  ('CAR', 'RIC'),
  ('MEL', 'SYD'),
  ('COL', 'WBD'),
  ('BRI', 'GEE'),
  ('GWS', 'GCS'),
  ('ESS', 'HAW'),
  ('FRE', 'WCE'),
  ('ADE', 'PTA'),
  ('STK', 'NTH')
) as fixtures(home_code, away_code)
join public.afl_teams ht on ht.short_name = fixtures.home_code
join public.afl_teams at on at.short_name = fixtures.away_code;

-- ============================================================================
-- 5. Contests (Daily and Season-Long)
-- ============================================================================

insert into public.contests (
  name, sport, type, entry_fee, prize_pool, max_entries, start_time, status,
  guaranteed, round, salary_cap, roster_config_def, roster_config_mid,
  roster_config_ruc, roster_config_fwd
) values
  (
    'Round 1 Classic', 'AFL', 'daily', 5.00, 10000.00, 2500,
    '2025-03-13 19:10:00+11'::timestamptz, 'upcoming', true, 1,
    100000, 2, 3, 1, 2
  ),
  (
    'Round 1 Mega Contest', 'AFL', 'daily', 15.00, 50000.00, 5000,
    '2025-03-13 19:10:00+11'::timestamptz, 'upcoming', true, 1,
    100000, 2, 3, 1, 2
  ),
  (
    'Round 1 Head-to-Head', 'AFL', 'daily', 10.00, 18.00, 2,
    '2025-03-13 19:10:00+11'::timestamptz, 'upcoming', false, 1,
    100000, 2, 3, 1, 2
  ),
  (
    'Friday Night Fever', 'AFL', 'daily', 3.00, 5000.00, 2000,
    '2025-03-14 19:50:00+11'::timestamptz, 'live', true, 1,
    100000, 2, 3, 1, 2
  ),
  (
    'Saturday Showdown', 'AFL', 'daily', 25.00, 100000.00, 5000,
    '2025-03-15 13:45:00+11'::timestamptz, 'upcoming', true, 1,
    100000, 2, 3, 1, 2
  );

-- ============================================================================
-- 6. Leagues (Season-Long Draft Leagues)
-- ============================================================================

-- Note: This requires a user to exist first. We'll create a league that references
-- the first user (if any exists). In practice, you'd create users first via auth.
-- For now, we'll create the league structure but it won't have a valid commissioner_id
-- until users are created.

-- Create a placeholder league (will need to be updated with actual user IDs)
-- This is a template that shows the structure
insert into public.leagues (
  name, commissioner_id, max_members, entry_fee, prize_pool, draft_status,
  roster_config_onfield_def, roster_config_onfield_mid, roster_config_onfield_ruc,
  roster_config_onfield_fwd, roster_config_emergencies_def, roster_config_emergencies_mid,
  roster_config_emergencies_ruc, roster_config_emergencies_fwd, roster_config_bench,
  pick_time_limit, draft_start_time
)
select
  'The Footy Fanatics' as name,
  (select id from public.users limit 1) as commissioner_id,  -- Will be null if no users exist yet
  10 as max_members,
  50.00 as entry_fee,
  500.00 as prize_pool,
  'waiting' as draft_status,
  5 as roster_config_onfield_def,
  7 as roster_config_onfield_mid,
  1 as roster_config_onfield_ruc,
  5 as roster_config_onfield_fwd,
  1 as roster_config_emergencies_def,
  1 as roster_config_emergencies_mid,
  1 as roster_config_emergencies_ruc,
  1 as roster_config_emergencies_fwd,
  6 as roster_config_bench,
  90 as pick_time_limit,
  '2025-03-10 18:00:00+11'::timestamptz as draft_start_time
where exists (select 1 from public.users limit 1);

-- ============================================================================
-- 7. Sample User Teams and Rosters
-- ============================================================================

-- Note: This also requires users to exist. We'll create sample teams for the first user
-- if they exist. In practice, users would create teams through the application.

-- Create a sample user team (if a user exists)
insert into public.user_teams (user_id, name, contest_id, salary_remaining, is_complete)
select
  u.id as user_id,
  'My Round 1 Team' as name,
  c.id as contest_id,
  5000.00 as salary_remaining,
  false as is_complete
from public.users u
cross join (select id from public.contests where type = 'daily' limit 1) c
limit 1;

-- Add some players to the roster (if team was created)
insert into public.team_rosters (team_id, player_id, position_slot, slot_number, is_captain, is_vice_captain)
select
  ut.id as team_id,
  p.id as player_id,
  p.position as position_slot,
  row_number() over (partition by ut.id, p.position order by p.salary desc) as slot_number,
  case when row_number() over (partition by ut.id order by p.avg_points desc) = 1 then true else false end as is_captain,
  case when row_number() over (partition by ut.id order by p.avg_points desc) = 2 then true else false end as is_vice_captain
from public.user_teams ut
cross join (
  select id, position, salary, avg_points
  from (
    select id, position, salary, avg_points
    from public.afl_players
    where position = 'DEF'
    order by avg_points desc
    limit 2
  ) def_players
  union all
  select id, position, salary, avg_points
  from (
    select id, position, salary, avg_points
    from public.afl_players
    where position = 'MID'
    order by avg_points desc
    limit 3
  ) mid_players
  union all
  select id, position, salary, avg_points
  from (
    select id, position, salary, avg_points
    from public.afl_players
    where position = 'RUC'
    order by avg_points desc
    limit 1
  ) ruc_players
  union all
  select id, position, salary, avg_points
  from (
    select id, position, salary, avg_points
    from public.afl_players
    where position = 'FWD'
    order by avg_points desc
    limit 2
  ) fwd_players
) p
where exists (select 1 from public.user_teams limit 1);

-- ============================================================================
-- 8. Wallets (Create wallets for existing users)
-- ============================================================================

insert into public.wallets (user_id, balance)
select
  id as user_id,
  100.00 as balance  -- Starting balance
from public.users
on conflict (user_id) do nothing;

-- ============================================================================
-- Notes
-- ============================================================================
--
-- This seed data creates:
-- - All 18 AFL teams
-- - 36 sample players (8 DEF, 12 MID, 6 RUC, 10 FWD)
-- - Sample player stats for 11 key players
-- - 9 Round 1 fixtures
-- - 5 sample contests (4 daily, 1 could be season-long)
-- - 1 sample league (requires users to exist)
-- - Sample user team and roster (requires users to exist)
-- - Wallets for all existing users
--
-- Note: Some inserts (leagues, user teams) depend on users existing in the database.
-- These will only insert if users exist. In a real scenario, you would:
-- 1. Create users via Supabase Auth first
-- 2. Then run this seed migration
-- 3. Or create a separate seed script that runs after user creation


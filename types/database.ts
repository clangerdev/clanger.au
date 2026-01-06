// Database types matching Supabase schema

export type AflPosition = 'DEF' | 'MID' | 'RUC' | 'FWD';
export type ContestType = 'daily' | 'season-long';
export type ContestStatus = 'upcoming' | 'live' | 'completed';
export type PlayerStatus = 'healthy' | 'questionable' | 'out';
export type DraftStatus = 'waiting' | 'in-progress' | 'completed';
export type TransactionType = 'deposit' | 'withdrawal' | 'entry_fee' | 'prize';

export interface AflTeam {
  id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  created_at: string;
}

export interface AflPlayer {
  id: string;
  name: string;
  team_id: string;
  position: AflPosition;
  salary: number;
  avg_points: number | null;
  image_url: string | null;
  status: PlayerStatus;
  created_at: string;
  updated_at: string;
}

export interface PlayerStats {
  id: string;
  player_id: string;
  round: number;
  match_date: string;
  disposals: number | null;
  disposal_efficiency: number | null;
  kicks: number | null;
  handballs: number | null;
  marks: number | null;
  tackles: number | null;
  hitouts: number | null;
  contested_possessions: number | null;
  uncontested_possessions: number | null;
  clearances: number | null;
  inside50s: number | null;
  rebound50s: number | null;
  goals: number | null;
  behinds: number | null;
  goal_assists: number | null;
  fantasy_points: number | null;
  last3_avg: number | null;
  season_avg: number | null;
  clanger_sauce_tags: string[] | null;
  created_at: string;
}

export interface AflFixture {
  id: string;
  round: number;
  home_team_id: string;
  away_team_id: string;
  start_time: string;
  status: ContestStatus;
  venue: string | null;
  created_at: string;
}

export interface UserTeam {
  id: string;
  user_id: string;
  name: string;
  contest_id: string | null;
  salary_remaining: number;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamRoster {
  id: string;
  team_id: string;
  player_id: string;
  position_slot: AflPosition;
  slot_number: number;
  is_captain: boolean;
  is_vice_captain: boolean;
  created_at: string;
}

export interface Contest {
  id: string;
  name: string;
  sport: string;
  type: ContestType;
  entry_fee: number;
  prize_pool: number;
  max_entries: number;
  start_time: string;
  end_time: string | null;
  status: ContestStatus;
  is_private: boolean;
  invite_code: string | null;
  round: number | null;
  salary_cap: number | null;
  roster_config_def: number | null;
  roster_config_mid: number | null;
  roster_config_ruc: number | null;
  roster_config_fwd: number | null;
  guaranteed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContestEntry {
  id: string;
  contest_id: string;
  user_id: string;
  team_id: string;
  entry_fee: number;
  potential_win: number | null;
  points: number;
  current_rank: number | null;
  total_entrants: number | null;
  status: ContestStatus;
  created_at: string;
  updated_at: string;
}

export interface League {
  id: string;
  name: string;
  commissioner_id: string;
  max_members: number;
  entry_fee: number;
  prize_pool: number;
  draft_status: DraftStatus;
  draft_order: string[] | null;
  draft_start_time: string | null;
  roster_config_onfield_def: number;
  roster_config_onfield_mid: number;
  roster_config_onfield_ruc: number;
  roster_config_onfield_fwd: number;
  roster_config_emergencies_def: number;
  roster_config_emergencies_mid: number;
  roster_config_emergencies_ruc: number;
  roster_config_emergencies_fwd: number;
  roster_config_bench: number;
  pick_time_limit: number;
  created_at: string;
  updated_at: string;
}

export interface LeagueMember {
  id: string;
  league_id: string;
  user_id: string;
  is_commissioner: boolean;
  draft_position: number | null;
  created_at: string;
}

export interface DraftPick {
  id: string;
  league_id: string;
  pick_number: number;
  round: number;
  user_id: string;
  player_id: string;
  timestamp: string;
  created_at: string;
}

export interface Matchup {
  id: string;
  league_id: string;
  round: number;
  home_team_id: string;
  away_team_id: string;
  status: ContestStatus;
  game_time: string;
  created_at: string;
  updated_at: string;
}

export interface MatchupTeam {
  id: string;
  matchup_id: string;
  user_id: string;
  total_points: number;
  projected_total: number;
  created_at: string;
  updated_at: string;
}

export interface MatchupPlayer {
  id: string;
  matchup_team_id: string;
  player_id: string;
  live_points: number;
  is_playing: boolean;
  game_status: ContestStatus;
  created_at: string;
  updated_at: string;
}

export interface LeagueStanding {
  id: string;
  league_id: string;
  user_id: string;
  rank: number;
  wins: number;
  losses: number;
  ties: number;
  points_for: number;
  points_against: number;
  streak: string | null;
  last_five: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  contest_id: string | null;
  created_at: string;
}


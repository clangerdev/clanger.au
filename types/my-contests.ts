export type EntryCardData = {
  id: string;
  contest_id: string;
  contest_name: string;
  status: "upcoming" | "live" | "completed";
  sport: string;
  entry_fee: number;
  points: number;
  current_rank?: number;
  total_entrants?: number;
  potential_win?: number;
};

export type MatchupWithDetails = {
  id: string;
  leagueName?: string;
  status: "upcoming" | "live" | "completed";
  homeTeam: {
    user_id: string;
    username: string;
    total_points: number;
  };
  awayTeam: {
    user_id: string;
    username: string;
    total_points: number;
  };
};

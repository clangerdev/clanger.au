// Mock Data Layer for Clanger Fantasy App - AFL Only

export type AFLPosition = 'DEF' | 'MID' | 'RUC' | 'FWD';

export interface Contest {
  id: string;
  name: string;
  sport: 'AFL';
  entryFee: number;
  prizePool: number;
  entries: number;
  maxEntries: number;
  startTime: string;
  status: 'upcoming' | 'live' | 'completed';
  type: 'daily' | 'season-long';
  guaranteed: boolean;
  round?: number;
  salaryCap?: number;
  rosterConfig?: RosterConfig;
  leagueId?: string;
}

export interface RosterConfig {
  DEF: number;
  MID: number;
  RUC: number;
  FWD: number;
}

// Season-Long Roster Config (28 players total)
export interface SeasonLongRosterConfig {
  onField: RosterConfig; // 5 DEF, 7 MID, 1 RUC, 5 FWD = 18
  emergencies: RosterConfig; // 1 DEF, 1 MID, 1 RUC, 1 FWD = 4
  bench: number; // 6 any position
}

export interface Player {
  id: string;
  name: string;
  team: string;
  position: AFLPosition;
  sport: 'AFL';
  salary: number;
  projectedPoints: number;
  actualPoints?: number;
  opponent: string;
  gameTime: string;
  imageUrl?: string;
  status?: 'healthy' | 'questionable' | 'out';
  avgPoints?: number; // Season average for draft
}

export interface UserEntry {
  id: string;
  contestId: string;
  contestName: string;
  sport: 'AFL';
  entryFee: number;
  potentialWin: number;
  picks: Player[];
  currentRank?: number;
  totalEntrants?: number;
  points: number;
  status: 'upcoming' | 'live' | 'completed';
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  balance: number;
  totalWinnings: number;
  contestsEntered: number;
  contestsWon: number;
}

// League types for Season-Long
export interface League {
  id: string;
  name: string;
  commissioner: string;
  members: LeagueMember[];
  maxMembers: number;
  entryFee: number;
  prizePool: number;
  draftStatus: 'waiting' | 'in-progress' | 'completed';
  draftOrder?: string[]; // user IDs in draft order
  draftStartTime?: string;
  rosterConfig: SeasonLongRosterConfig;
  pickTimeLimit: number; // seconds per pick
}

export interface LeagueMember {
  userId: string;
  username: string;
  avatar?: string;
  isCommissioner: boolean;
  draftPosition?: number;
  roster: Player[];
}

export interface DraftPick {
  pickNumber: number;
  round: number;
  userId: string;
  username: string;
  player: Player;
  timestamp: string;
}

// Matchup types for head-to-head
export interface MatchupPlayer extends Player {
  livePoints: number;
  isPlaying: boolean;
  gameStatus: 'upcoming' | 'live' | 'completed';
}

export interface MatchupTeam {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  players: MatchupPlayer[];
  totalPoints: number;
  projectedTotal: number;
}

export interface Matchup {
  id: string;
  leagueId: string;
  leagueName: string;
  round: number;
  homeTeam: MatchupTeam;
  awayTeam: MatchupTeam;
  status: 'upcoming' | 'live' | 'completed';
  gameTime: string;
}

// Standings types
export interface TeamStanding {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: string; // e.g., "W3", "L1"
  lastFive: ('W' | 'L' | 'T')[]; // Last 5 results
  isCurrentUser?: boolean;
}

export interface LeagueStandings {
  leagueId: string;
  leagueName: string;
  currentRound: number;
  totalRounds: number;
  standings: TeamStanding[];
}

// AFL Teams
export const AFL_TEAMS = [
  { code: 'ADE', name: 'Adelaide Crows' },
  { code: 'BRI', name: 'Brisbane Lions' },
  { code: 'CAR', name: 'Carlton' },
  { code: 'COL', name: 'Collingwood' },
  { code: 'ESS', name: 'Essendon' },
  { code: 'FRE', name: 'Fremantle' },
  { code: 'GEE', name: 'Geelong Cats' },
  { code: 'GCS', name: 'Gold Coast Suns' },
  { code: 'GWS', name: 'GWS Giants' },
  { code: 'HAW', name: 'Hawthorn' },
  { code: 'MEL', name: 'Melbourne' },
  { code: 'NTH', name: 'North Melbourne' },
  { code: 'PTA', name: 'Port Adelaide' },
  { code: 'RIC', name: 'Richmond' },
  { code: 'STK', name: 'St Kilda' },
  { code: 'SYD', name: 'Sydney Swans' },
  { code: 'WCE', name: 'West Coast Eagles' },
  { code: 'WBD', name: 'Western Bulldogs' },
] as const;

// Daily Fantasy Roster Config (8 players)
export const DAILY_ROSTER_CONFIG: RosterConfig = {
  DEF: 2,
  MID: 3,
  RUC: 1,
  FWD: 2,
};

// Season-Long Roster Config (28 players total)
export const SEASON_LONG_ROSTER_CONFIG: SeasonLongRosterConfig = {
  onField: { DEF: 5, MID: 7, RUC: 1, FWD: 5 }, // 18 players
  emergencies: { DEF: 1, MID: 1, RUC: 1, FWD: 1 }, // 4 players
  bench: 6, // 6 players any position
};

export const TOTAL_DRAFT_PICKS = 28; // Total players per team in draft
export const DEFAULT_PICK_TIME = 90; // seconds

export const DAILY_SALARY_CAP = 100000;

// Mock AFL Contests
export const mockContests: Contest[] = [
  {
    id: 'afl-r1-classic',
    name: 'Round 1 Classic',
    sport: 'AFL',
    entryFee: 5,
    prizePool: 10000,
    entries: 1847,
    maxEntries: 2500,
    startTime: '2025-03-13T19:10:00+11:00',
    status: 'upcoming',
    type: 'daily',
    guaranteed: true,
    round: 1,
    salaryCap: DAILY_SALARY_CAP,
    rosterConfig: DAILY_ROSTER_CONFIG,
  },
  {
    id: 'afl-r1-mega',
    name: 'Round 1 Mega Contest',
    sport: 'AFL',
    entryFee: 15,
    prizePool: 50000,
    entries: 2100,
    maxEntries: 5000,
    startTime: '2025-03-13T19:10:00+11:00',
    status: 'upcoming',
    type: 'daily',
    guaranteed: true,
    round: 1,
    salaryCap: DAILY_SALARY_CAP,
    rosterConfig: DAILY_ROSTER_CONFIG,
  },
  {
    id: 'afl-r1-h2h',
    name: 'Round 1 Head-to-Head',
    sport: 'AFL',
    entryFee: 10,
    prizePool: 18,
    entries: 1,
    maxEntries: 2,
    startTime: '2025-03-13T19:10:00+11:00',
    status: 'upcoming',
    type: 'daily',
    guaranteed: false,
    round: 1,
    salaryCap: DAILY_SALARY_CAP,
    rosterConfig: DAILY_ROSTER_CONFIG,
  },
  {
    id: 'afl-r1-friday',
    name: 'Friday Night Fever',
    sport: 'AFL',
    entryFee: 3,
    prizePool: 5000,
    entries: 890,
    maxEntries: 2000,
    startTime: '2025-03-14T19:50:00+11:00',
    status: 'live',
    type: 'daily',
    guaranteed: true,
    round: 1,
    salaryCap: DAILY_SALARY_CAP,
    rosterConfig: DAILY_ROSTER_CONFIG,
  },
  {
    id: 'afl-r1-sat',
    name: 'Saturday Showdown',
    sport: 'AFL',
    entryFee: 25,
    prizePool: 100000,
    entries: 3200,
    maxEntries: 5000,
    startTime: '2025-03-15T13:45:00+11:00',
    status: 'upcoming',
    type: 'daily',
    guaranteed: true,
    round: 1,
    salaryCap: DAILY_SALARY_CAP,
    rosterConfig: DAILY_ROSTER_CONFIG,
  },
  {
    id: 'afl-league-1',
    name: 'Season-Long Draft League',
    sport: 'AFL',
    entryFee: 50,
    prizePool: 500,
    entries: 8,
    maxEntries: 10,
    startTime: '2025-03-10T18:00:00+11:00',
    status: 'upcoming',
    type: 'season-long',
    guaranteed: false,
    round: 1,
  },
];

// Mock AFL Players
export const mockPlayers: Player[] = [
  // DEFENDERS
  {
    id: 'afl-d1',
    name: 'Steven May',
    team: 'MEL',
    position: 'DEF',
    sport: 'AFL',
    salary: 8200,
    projectedPoints: 72.5,
    opponent: 'vs SYD',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-d2',
    name: 'Harris Andrews',
    team: 'BRI',
    position: 'DEF',
    sport: 'AFL',
    salary: 8800,
    projectedPoints: 78.2,
    opponent: 'vs GEE',
    gameTime: 'Sat 1:45 PM',
    status: 'healthy',
  },
  {
    id: 'afl-d3',
    name: 'Jacob Weitering',
    team: 'CAR',
    position: 'DEF',
    sport: 'AFL',
    salary: 7900,
    projectedPoints: 68.4,
    opponent: 'vs RIC',
    gameTime: 'Thu 7:10 PM',
    status: 'healthy',
  },
  {
    id: 'afl-d4',
    name: 'Darcy Moore',
    team: 'COL',
    position: 'DEF',
    sport: 'AFL',
    salary: 9200,
    projectedPoints: 82.1,
    opponent: 'vs WBD',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-d5',
    name: 'Tom Stewart',
    team: 'GEE',
    position: 'DEF',
    sport: 'AFL',
    salary: 9500,
    projectedPoints: 95.3,
    opponent: '@ BRI',
    gameTime: 'Sat 1:45 PM',
    status: 'healthy',
  },
  {
    id: 'afl-d6',
    name: 'Jordan Ridley',
    team: 'ESS',
    position: 'DEF',
    sport: 'AFL',
    salary: 8600,
    projectedPoints: 75.8,
    opponent: 'vs HAW',
    gameTime: 'Sat 7:25 PM',
    status: 'healthy',
  },
  {
    id: 'afl-d7',
    name: 'Nick Vlastuin',
    team: 'RIC',
    position: 'DEF',
    sport: 'AFL',
    salary: 7400,
    projectedPoints: 62.3,
    opponent: '@ CAR',
    gameTime: 'Thu 7:10 PM',
    status: 'questionable',
  },
  {
    id: 'afl-d8',
    name: 'Dane Rampe',
    team: 'SYD',
    position: 'DEF',
    sport: 'AFL',
    salary: 7100,
    projectedPoints: 58.9,
    opponent: '@ MEL',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  // MIDFIELDERS
  {
    id: 'afl-m1',
    name: 'Marcus Bontempelli',
    team: 'WBD',
    position: 'MID',
    sport: 'AFL',
    salary: 11800,
    projectedPoints: 118.5,
    opponent: '@ COL',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m2',
    name: 'Clayton Oliver',
    team: 'MEL',
    position: 'MID',
    sport: 'AFL',
    salary: 11200,
    projectedPoints: 112.3,
    opponent: 'vs SYD',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m3',
    name: 'Patrick Cripps',
    team: 'CAR',
    position: 'MID',
    sport: 'AFL',
    salary: 11500,
    projectedPoints: 115.8,
    opponent: 'vs RIC',
    gameTime: 'Thu 7:10 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m4',
    name: 'Christian Petracca',
    team: 'MEL',
    position: 'MID',
    sport: 'AFL',
    salary: 10800,
    projectedPoints: 108.2,
    opponent: 'vs SYD',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m5',
    name: 'Zach Merrett',
    team: 'ESS',
    position: 'MID',
    sport: 'AFL',
    salary: 10500,
    projectedPoints: 105.4,
    opponent: 'vs HAW',
    gameTime: 'Sat 7:25 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m6',
    name: 'Lachie Neale',
    team: 'BRI',
    position: 'MID',
    sport: 'AFL',
    salary: 10900,
    projectedPoints: 109.7,
    opponent: 'vs GEE',
    gameTime: 'Sat 1:45 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m7',
    name: 'Josh Dunkley',
    team: 'BRI',
    position: 'MID',
    sport: 'AFL',
    salary: 9800,
    projectedPoints: 98.3,
    opponent: 'vs GEE',
    gameTime: 'Sat 1:45 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m8',
    name: 'Callum Mills',
    team: 'SYD',
    position: 'MID',
    sport: 'AFL',
    salary: 9200,
    projectedPoints: 92.1,
    opponent: '@ MEL',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m9',
    name: 'Tim Taranto',
    team: 'RIC',
    position: 'MID',
    sport: 'AFL',
    salary: 9500,
    projectedPoints: 94.8,
    opponent: '@ CAR',
    gameTime: 'Thu 7:10 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m10',
    name: 'Andrew Brayshaw',
    team: 'FRE',
    position: 'MID',
    sport: 'AFL',
    salary: 10200,
    projectedPoints: 102.5,
    opponent: '@ WCE',
    gameTime: 'Sun 4:10 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m11',
    name: 'Nick Daicos',
    team: 'COL',
    position: 'MID',
    sport: 'AFL',
    salary: 11000,
    projectedPoints: 110.2,
    opponent: 'vs WBD',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-m12',
    name: 'Tom Green',
    team: 'GWS',
    position: 'MID',
    sport: 'AFL',
    salary: 9600,
    projectedPoints: 96.4,
    opponent: '@ GCS',
    gameTime: 'Sat 4:35 PM',
    status: 'healthy',
  },
  // RUCKMEN
  {
    id: 'afl-r1',
    name: 'Max Gawn',
    team: 'MEL',
    position: 'RUC',
    sport: 'AFL',
    salary: 10200,
    projectedPoints: 102.8,
    opponent: 'vs SYD',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-r2',
    name: 'Brodie Grundy',
    team: 'SYD',
    position: 'RUC',
    sport: 'AFL',
    salary: 9800,
    projectedPoints: 98.5,
    opponent: '@ MEL',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-r3',
    name: 'Oscar McInerney',
    team: 'BRI',
    position: 'RUC',
    sport: 'AFL',
    salary: 8500,
    projectedPoints: 85.2,
    opponent: 'vs GEE',
    gameTime: 'Sat 1:45 PM',
    status: 'healthy',
  },
  {
    id: 'afl-r4',
    name: 'Toby Nankervis',
    team: 'RIC',
    position: 'RUC',
    sport: 'AFL',
    salary: 8800,
    projectedPoints: 88.4,
    opponent: '@ CAR',
    gameTime: 'Thu 7:10 PM',
    status: 'healthy',
  },
  {
    id: 'afl-r5',
    name: 'Sean Darcy',
    team: 'FRE',
    position: 'RUC',
    sport: 'AFL',
    salary: 9200,
    projectedPoints: 92.1,
    opponent: '@ WCE',
    gameTime: 'Sun 4:10 PM',
    status: 'healthy',
  },
  {
    id: 'afl-r6',
    name: 'Tim English',
    team: 'WBD',
    position: 'RUC',
    sport: 'AFL',
    salary: 8900,
    projectedPoints: 89.3,
    opponent: '@ COL',
    gameTime: 'Fri 7:50 PM',
    status: 'questionable',
  },
  // FORWARDS
  {
    id: 'afl-f1',
    name: 'Charlie Curnow',
    team: 'CAR',
    position: 'FWD',
    sport: 'AFL',
    salary: 10500,
    projectedPoints: 92.4,
    opponent: 'vs RIC',
    gameTime: 'Thu 7:10 PM',
    status: 'healthy',
  },
  {
    id: 'afl-f2',
    name: 'Jeremy Cameron',
    team: 'GEE',
    position: 'FWD',
    sport: 'AFL',
    salary: 9800,
    projectedPoints: 86.7,
    opponent: '@ BRI',
    gameTime: 'Sat 1:45 PM',
    status: 'healthy',
  },
  {
    id: 'afl-f3',
    name: 'Tom Hawkins',
    team: 'GEE',
    position: 'FWD',
    sport: 'AFL',
    salary: 8200,
    projectedPoints: 72.3,
    opponent: '@ BRI',
    gameTime: 'Sat 1:45 PM',
    status: 'healthy',
  },
  {
    id: 'afl-f4',
    name: 'Jesse Hogan',
    team: 'GWS',
    position: 'FWD',
    sport: 'AFL',
    salary: 9100,
    projectedPoints: 80.5,
    opponent: '@ GCS',
    gameTime: 'Sat 4:35 PM',
    status: 'healthy',
  },
  {
    id: 'afl-f5',
    name: 'Isaac Heeney',
    team: 'SYD',
    position: 'FWD',
    sport: 'AFL',
    salary: 9400,
    projectedPoints: 83.2,
    opponent: '@ MEL',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-f6',
    name: 'Jamie Elliott',
    team: 'COL',
    position: 'FWD',
    sport: 'AFL',
    salary: 7800,
    projectedPoints: 68.9,
    opponent: 'vs WBD',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-f7',
    name: 'Toby Marshall',
    team: 'ESS',
    position: 'FWD',
    sport: 'AFL',
    salary: 7200,
    projectedPoints: 63.4,
    opponent: 'vs HAW',
    gameTime: 'Sat 7:25 PM',
    status: 'healthy',
  },
  {
    id: 'afl-f8',
    name: 'Shai Bolton',
    team: 'RIC',
    position: 'FWD',
    sport: 'AFL',
    salary: 8600,
    projectedPoints: 76.8,
    opponent: '@ CAR',
    gameTime: 'Thu 7:10 PM',
    status: 'healthy',
  },
  {
    id: 'afl-f9',
    name: 'Aaron Naughton',
    team: 'WBD',
    position: 'FWD',
    sport: 'AFL',
    salary: 8400,
    projectedPoints: 74.2,
    opponent: '@ COL',
    gameTime: 'Fri 7:50 PM',
    status: 'healthy',
  },
  {
    id: 'afl-f10',
    name: 'Joe Daniher',
    team: 'BRI',
    position: 'FWD',
    sport: 'AFL',
    salary: 7600,
    projectedPoints: 67.1,
    opponent: 'vs GEE',
    gameTime: 'Sat 1:45 PM',
    status: 'out',
  },
];

// Mock User
export const mockUser: User = {
  id: 'user-1',
  username: 'FootyFan99',
  email: 'footyfan@clanger.com',
  balance: 247.50,
  totalWinnings: 1842.00,
  contestsEntered: 156,
  contestsWon: 23,
};

// Mock User Entries
export const mockUserEntries: UserEntry[] = [
  {
    id: 'entry-1',
    contestId: 'afl-r1-friday',
    contestName: 'Friday Night Fever',
    sport: 'AFL',
    entryFee: 3,
    potentialWin: 50,
    picks: mockPlayers.slice(0, 8),
    currentRank: 127,
    totalEntrants: 890,
    points: 542.5,
    status: 'live',
  },
  {
    id: 'entry-2',
    contestId: 'afl-r1-classic',
    contestName: 'Round 1 Classic',
    sport: 'AFL',
    entryFee: 5,
    potentialWin: 100,
    picks: [],
    points: 0,
    status: 'upcoming',
  },
];

// Mock Leagues
export const mockLeagues: League[] = [
  {
    id: 'league-1',
    name: 'The Footy Fanatics',
    commissioner: 'user-1',
    members: [
      { userId: 'user-1', username: 'FootyFan99', isCommissioner: true, draftPosition: 1, roster: [] },
      { userId: 'user-2', username: 'BigMarks', isCommissioner: false, draftPosition: 2, roster: [] },
      { userId: 'user-3', username: 'GoalKicker', isCommissioner: false, draftPosition: 3, roster: [] },
      { userId: 'user-4', username: 'TackleKing', isCommissioner: false, draftPosition: 4, roster: [] },
      { userId: 'user-5', username: 'SpeccyMaster', isCommissioner: false, draftPosition: 5, roster: [] },
      { userId: 'user-6', username: 'HandballHero', isCommissioner: false, draftPosition: 6, roster: [] },
      { userId: 'user-7', username: 'RuckRover', isCommissioner: false, draftPosition: 7, roster: [] },
      { userId: 'user-8', username: 'WingWizard', isCommissioner: false, draftPosition: 8, roster: [] },
    ],
    maxMembers: 10,
    entryFee: 50,
    prizePool: 500,
    draftStatus: 'waiting',
    draftStartTime: '2025-03-10T18:00:00+11:00',
    rosterConfig: SEASON_LONG_ROSTER_CONFIG,
    pickTimeLimit: DEFAULT_PICK_TIME,
  },
];

// Helper functions
export const getContestById = (id: string): Contest | undefined =>
  mockContests.find((c) => c.id === id);

export const getLeagueById = (id: string): League | undefined =>
  mockLeagues.find((l) => l.id === id);

export const getPlayersBySport = (sport: 'AFL'): Player[] =>
  mockPlayers.filter((p) => p.sport === sport);

export const getPlayersByPosition = (position: AFLPosition): Player[] =>
  mockPlayers.filter((p) => p.position === position);

export const getContestsByType = (type: Contest['type']): Contest[] =>
  mockContests.filter((c) => c.type === type);

export const getContestsByStatus = (status: Contest['status']): Contest[] =>
  mockContests.filter((c) => c.status === status);

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);

export const formatNumber = (num: number): string =>
  new Intl.NumberFormat('en-AU').format(num);

export const formatSalary = (salary: number): string =>
  `$${(salary / 1000).toFixed(1)}K`;

// Generate snake draft order for a given number of rounds and teams
export const generateSnakeDraftOrder = (
  teamCount: number,
  totalRounds: number
): number[][] => {
  const order: number[][] = [];
  for (let round = 0; round < totalRounds; round++) {
    const roundOrder = Array.from({ length: teamCount }, (_, i) => i);
    if (round % 2 === 1) {
      roundOrder.reverse(); // Snake - reverse every other round
    }
    order.push(roundOrder);
  }
  return order;
};

// Get current pick info from overall pick number
export const getPickInfo = (
  pickNumber: number,
  teamCount: number
): { round: number; pickInRound: number; teamIndex: number } => {
  const round = Math.floor(pickNumber / teamCount);
  const pickInRound = pickNumber % teamCount;
  const isReversed = round % 2 === 1;
  const teamIndex = isReversed ? teamCount - 1 - pickInRound : pickInRound;
  return { round: round + 1, pickInRound: pickInRound + 1, teamIndex };
};

// Mock Matchups
export const mockMatchups: Matchup[] = [
  {
    id: 'matchup-1',
    leagueId: 'league-1',
    leagueName: 'AFL Season League 2025',
    round: 1,
    status: 'live',
    gameTime: '2025-03-14T19:50:00+11:00',
    homeTeam: {
      id: 'team-1',
      userId: 'user-1',
      username: 'ClangerKing',
      totalPoints: 842.5,
      projectedTotal: 1650,
      players: [
        { ...mockPlayers[0], livePoints: 45.2, isPlaying: false, gameStatus: 'completed' },
        { ...mockPlayers[1], livePoints: 62.8, isPlaying: true, gameStatus: 'live' },
        { ...mockPlayers[8], livePoints: 98.4, isPlaying: true, gameStatus: 'live' },
        { ...mockPlayers[9], livePoints: 88.2, isPlaying: false, gameStatus: 'completed' },
        { ...mockPlayers[10], livePoints: 72.1, isPlaying: true, gameStatus: 'live' },
        { ...mockPlayers[16], livePoints: 112.5, isPlaying: false, gameStatus: 'completed' },
        { ...mockPlayers[20], livePoints: 78.3, isPlaying: true, gameStatus: 'live' },
        { ...mockPlayers[24], livePoints: 65.0, isPlaying: false, gameStatus: 'upcoming' },
        { ...mockPlayers[28], livePoints: 55.2, isPlaying: false, gameStatus: 'upcoming' },
        { ...mockPlayers[32], livePoints: 82.4, isPlaying: true, gameStatus: 'live' },
        { ...mockPlayers[2], livePoints: 48.6, isPlaying: false, gameStatus: 'completed' },
        { ...mockPlayers[12], livePoints: 33.8, isPlaying: false, gameStatus: 'upcoming' },
      ],
    },
    awayTeam: {
      id: 'team-2',
      userId: 'user-2',
      username: 'FootyFanatic',
      totalPoints: 798.3,
      projectedTotal: 1580,
      players: [
        { ...mockPlayers[3], livePoints: 58.4, isPlaying: false, gameStatus: 'completed' },
        { ...mockPlayers[4], livePoints: 72.1, isPlaying: true, gameStatus: 'live' },
        { ...mockPlayers[11], livePoints: 85.6, isPlaying: true, gameStatus: 'live' },
        { ...mockPlayers[13], livePoints: 92.3, isPlaying: false, gameStatus: 'completed' },
        { ...mockPlayers[14], livePoints: 68.9, isPlaying: true, gameStatus: 'live' },
        { ...mockPlayers[17], livePoints: 98.2, isPlaying: false, gameStatus: 'completed' },
        { ...mockPlayers[21], livePoints: 71.5, isPlaying: true, gameStatus: 'live' },
        { ...mockPlayers[25], livePoints: 42.0, isPlaying: false, gameStatus: 'upcoming' },
        { ...mockPlayers[29], livePoints: 48.7, isPlaying: false, gameStatus: 'upcoming' },
        { ...mockPlayers[33], livePoints: 76.8, isPlaying: true, gameStatus: 'live' },
        { ...mockPlayers[5], livePoints: 52.3, isPlaying: false, gameStatus: 'completed' },
        { ...mockPlayers[15], livePoints: 31.5, isPlaying: false, gameStatus: 'upcoming' },
      ],
    },
  },
  {
    id: 'matchup-2',
    leagueId: 'league-1',
    leagueName: 'AFL Season League 2025',
    round: 1,
    status: 'upcoming',
    gameTime: '2025-03-15T13:45:00+11:00',
    homeTeam: {
      id: 'team-3',
      userId: 'user-3',
      username: 'MidfielderMaster',
      totalPoints: 0,
      projectedTotal: 1720,
      players: [
        { ...mockPlayers[6], livePoints: 0, isPlaying: false, gameStatus: 'upcoming' },
        { ...mockPlayers[7], livePoints: 0, isPlaying: false, gameStatus: 'upcoming' },
        { ...mockPlayers[18], livePoints: 0, isPlaying: false, gameStatus: 'upcoming' },
        { ...mockPlayers[19], livePoints: 0, isPlaying: false, gameStatus: 'upcoming' },
      ],
    },
    awayTeam: {
      id: 'team-4',
      userId: 'user-4',
      username: 'DefensiveWall',
      totalPoints: 0,
      projectedTotal: 1680,
      players: [
        { ...mockPlayers[22], livePoints: 0, isPlaying: false, gameStatus: 'upcoming' },
        { ...mockPlayers[23], livePoints: 0, isPlaying: false, gameStatus: 'upcoming' },
        { ...mockPlayers[26], livePoints: 0, isPlaying: false, gameStatus: 'upcoming' },
        { ...mockPlayers[27], livePoints: 0, isPlaying: false, gameStatus: 'upcoming' },
      ],
    },
  },
];

export const getMatchupById = (id: string): Matchup | undefined =>
  mockMatchups.find((m) => m.id === id);

export const getMatchupsByLeague = (leagueId: string): Matchup[] =>
  mockMatchups.filter((m) => m.leagueId === leagueId);

// Mock League Standings
export const mockLeagueStandings: LeagueStandings[] = [
  {
    leagueId: 'league-1',
    leagueName: 'AFL Season League 2025',
    currentRound: 3,
    totalRounds: 23,
    standings: [
      {
        rank: 1,
        userId: 'user-1',
        username: 'ClangerKing',
        wins: 3,
        losses: 0,
        ties: 0,
        pointsFor: 4892.5,
        pointsAgainst: 4125.3,
        streak: 'W3',
        lastFive: ['W', 'W', 'W'],
        isCurrentUser: true,
      },
      {
        rank: 2,
        userId: 'user-3',
        username: 'MidfielderMaster',
        wins: 2,
        losses: 1,
        ties: 0,
        pointsFor: 4650.2,
        pointsAgainst: 4280.1,
        streak: 'W2',
        lastFive: ['W', 'W', 'L'],
      },
      {
        rank: 3,
        userId: 'user-5',
        username: 'RuckRoyalty',
        wins: 2,
        losses: 1,
        ties: 0,
        pointsFor: 4520.8,
        pointsAgainst: 4390.5,
        streak: 'L1',
        lastFive: ['L', 'W', 'W'],
      },
      {
        rank: 4,
        userId: 'user-2',
        username: 'FootyFanatic',
        wins: 2,
        losses: 1,
        ties: 0,
        pointsFor: 4480.3,
        pointsAgainst: 4320.7,
        streak: 'W1',
        lastFive: ['W', 'L', 'W'],
      },
      {
        rank: 5,
        userId: 'user-6',
        username: 'ForwardFlash',
        wins: 1,
        losses: 2,
        ties: 0,
        pointsFor: 4350.1,
        pointsAgainst: 4520.9,
        streak: 'L2',
        lastFive: ['L', 'L', 'W'],
      },
      {
        rank: 6,
        userId: 'user-4',
        username: 'DefensiveWall',
        wins: 1,
        losses: 2,
        ties: 0,
        pointsFor: 4280.6,
        pointsAgainst: 4590.2,
        streak: 'L1',
        lastFive: ['L', 'W', 'L'],
      },
      {
        rank: 7,
        userId: 'user-7',
        username: 'BenchBoss',
        wins: 1,
        losses: 2,
        ties: 0,
        pointsFor: 4150.4,
        pointsAgainst: 4480.8,
        streak: 'W1',
        lastFive: ['W', 'L', 'L'],
      },
      {
        rank: 8,
        userId: 'user-8',
        username: 'TradeMaster',
        wins: 0,
        losses: 3,
        ties: 0,
        pointsFor: 3890.2,
        pointsAgainst: 4720.5,
        streak: 'L3',
        lastFive: ['L', 'L', 'L'],
      },
    ],
  },
];

export const getStandingsByLeagueId = (leagueId: string): LeagueStandings | undefined =>
  mockLeagueStandings.find((s) => s.leagueId === leagueId);

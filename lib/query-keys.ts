// Centralized query key factory for React Query

export const queryKeys = {
  // AFL Data
  afl: {
    all: ['afl'] as const,
    teams: {
      all: ['afl', 'teams'] as const,
      list: () => [...queryKeys.afl.teams.all, 'list'] as const,
    },
    players: {
      all: ['afl', 'players'] as const,
      list: (filters?: { position?: string; team_id?: string; status?: string }) =>
        [...queryKeys.afl.players.all, 'list', filters] as const,
      detail: (id: string) => [...queryKeys.afl.players.all, 'detail', id] as const,
    },
    stats: {
      all: ['afl', 'stats'] as const,
      byPlayer: (playerId: string, round?: number) =>
        [...queryKeys.afl.stats.all, 'player', playerId, round] as const,
    },
    fixtures: {
      all: ['afl', 'fixtures'] as const,
      list: (round?: number) => [...queryKeys.afl.fixtures.all, 'list', round] as const,
    },
  },

  // Contests
  contests: {
    all: ['contests'] as const,
    list: (filters?: { type?: string; status?: string; sport?: string }) =>
      [...queryKeys.contests.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.contests.all, 'detail', id] as const,
    entries: {
      all: (contestId: string) => [...queryKeys.contests.detail(contestId), 'entries'] as const,
      list: (contestId: string) => [...queryKeys.contests.entries.all(contestId), 'list'] as const,
    },
  },

  // Leagues
  leagues: {
    all: ['leagues'] as const,
    list: () => [...queryKeys.leagues.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.leagues.all, 'detail', id] as const,
    members: {
      all: (leagueId: string) => [...queryKeys.leagues.detail(leagueId), 'members'] as const,
      list: (leagueId: string) => [...queryKeys.leagues.members.all(leagueId), 'list'] as const,
    },
    draftPicks: {
      all: (leagueId: string) => [...queryKeys.leagues.detail(leagueId), 'draftPicks'] as const,
      list: (leagueId: string) => [...queryKeys.leagues.draftPicks.all(leagueId), 'list'] as const,
    },
  },

  // User Teams
  userTeams: {
    all: ['userTeams'] as const,
    byUser: (userId: string) => [...queryKeys.userTeams.all, 'user', userId] as const,
    detail: (id: string) => [...queryKeys.userTeams.all, 'detail', id] as const,
    roster: {
      all: (teamId: string) => [...queryKeys.userTeams.detail(teamId), 'roster'] as const,
      list: (teamId: string) => [...queryKeys.userTeams.roster.all(teamId), 'list'] as const,
    },
  },

  // Wallet
  wallet: {
    all: ['wallet'] as const,
    byUser: (userId: string) => [...queryKeys.wallet.all, 'user', userId] as const,
    transactions: {
      all: (walletId: string) => [...queryKeys.wallet.all, 'transactions', walletId] as const,
      list: (walletId: string) => [...queryKeys.wallet.transactions.all(walletId), 'list'] as const,
    },
  },

  // Matchups
  matchups: {
    all: ['matchups'] as const,
    byLeague: (leagueId: string, round?: number) =>
      [...queryKeys.matchups.all, 'league', leagueId, round] as const,
    detail: (id: string) => [...queryKeys.matchups.all, 'detail', id] as const,
    teams: {
      all: (matchupId: string) => [...queryKeys.matchups.detail(matchupId), 'teams'] as const,
      list: (matchupId: string) => [...queryKeys.matchups.teams.all(matchupId), 'list'] as const,
    },
  },

  // Standings
  standings: {
    all: ['standings'] as const,
    byLeague: (leagueId: string) => [...queryKeys.standings.all, 'league', leagueId] as const,
  },
};


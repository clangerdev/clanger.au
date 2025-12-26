// Extended Player Stats for Draft - AFL Fantasy Statistics

import { AFLPosition } from './mockData';

export type ClangerSauceTag = 
  | 'rocket'       // 🚀 Boom potential - likely to break out this year
  | 'nomad'        // 🏃 Team switcher - moved clubs
  | 'greenhorn'    // 🌱 Rookie - first or second year player  
  | 'ironman'      // 💪 Durability king - rarely misses games
  | 'glassman'     // 🩹 Injury prone - watch out
  | 'captain'      // ©️ Team leader - consistent performer
  | 'brownlow'     // 🏆 Brownlow contender
  | 'sneaky'       // 🦊 Underrated pick - under the radar
  | 'risky'        // ⚠️ High ceiling, low floor
  | 'bargain';     // 💰 Value pick for the price

export interface PlayerDetailedStats {
  playerId: string;
  // Core stats that contribute to fantasy points
  disposals: number;
  disposalEfficiency: number; // percentage
  kicks: number;
  handballs: number;
  marks: number;
  tackles: number;
  hitouts: number;
  contestedPossessions: number;
  uncontestedPossessions: number;
  clearances: number;
  inside50s: number;
  rebound50s: number;
  goals: number;
  behinds: number;
  goalAssists: number;
  // Form indicators
  last3Avg: number;
  seasonAvg: number;
  // Clanger Sauce - Aussie jargon tags
  clangerSauce: ClangerSauceTag[];
}

// Clanger Sauce tag display config
export const CLANGER_SAUCE_CONFIG: Record<ClangerSauceTag, { emoji: string; label: string; description: string; color: string }> = {
  rocket: { emoji: '🚀', label: 'Rocket', description: 'Set to blast off this season', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  nomad: { emoji: '🏃', label: 'Nomad', description: 'Changed clubs this year', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  greenhorn: { emoji: '🌱', label: 'Greenhorn', description: 'Fresh face, big upside', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  ironman: { emoji: '💪', label: 'Ironman', description: 'Built different, never misses', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  glassman: { emoji: '🩹', label: 'Glassman', description: 'Made of fine china', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  captain: { emoji: '©️', label: 'Skipper', description: 'Leads from the front', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  brownlow: { emoji: '🏆', label: 'Charlie', description: 'Brownlow fancy', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  sneaky: { emoji: '🦊', label: 'Sneaky', description: 'Under the radar gem', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  risky: { emoji: '⚠️', label: 'Risky', description: 'Ceiling or floor, no middle', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  bargain: { emoji: '💰', label: 'Bargain', description: 'Cheap as chips', color: 'bg-lime-500/20 text-lime-400 border-lime-500/30' },
};

// Mock detailed stats for each player
export const mockPlayerStats: PlayerDetailedStats[] = [
  // DEFENDERS
  { playerId: 'afl-d1', disposals: 18.2, disposalEfficiency: 72, kicks: 11.4, handballs: 6.8, marks: 7.2, tackles: 3.1, hitouts: 0, contestedPossessions: 5.2, uncontestedPossessions: 13.0, clearances: 0.8, inside50s: 2.1, rebound50s: 4.8, goals: 0.2, behinds: 0.3, goalAssists: 0.4, last3Avg: 74.2, seasonAvg: 72.5, clangerSauce: ['ironman', 'captain'] },
  { playerId: 'afl-d2', disposals: 19.8, disposalEfficiency: 78, kicks: 13.2, handballs: 6.6, marks: 8.4, tackles: 2.8, hitouts: 0, contestedPossessions: 4.8, uncontestedPossessions: 15.0, clearances: 0.5, inside50s: 1.8, rebound50s: 5.2, goals: 0.1, behinds: 0.2, goalAssists: 0.6, last3Avg: 81.3, seasonAvg: 78.2, clangerSauce: ['rocket', 'brownlow'] },
  { playerId: 'afl-d3', disposals: 16.5, disposalEfficiency: 74, kicks: 10.8, handballs: 5.7, marks: 6.8, tackles: 3.4, hitouts: 0, contestedPossessions: 5.8, uncontestedPossessions: 10.7, clearances: 0.6, inside50s: 1.5, rebound50s: 4.2, goals: 0.1, behinds: 0.1, goalAssists: 0.3, last3Avg: 69.8, seasonAvg: 68.4, clangerSauce: ['sneaky'] },
  { playerId: 'afl-d4', disposals: 20.4, disposalEfficiency: 76, kicks: 14.1, handballs: 6.3, marks: 9.2, tackles: 2.5, hitouts: 0, contestedPossessions: 4.2, uncontestedPossessions: 16.2, clearances: 0.4, inside50s: 2.4, rebound50s: 6.1, goals: 0.3, behinds: 0.4, goalAssists: 0.8, last3Avg: 84.5, seasonAvg: 82.1, clangerSauce: ['captain', 'ironman'] },
  { playerId: 'afl-d5', disposals: 24.8, disposalEfficiency: 81, kicks: 17.2, handballs: 7.6, marks: 7.8, tackles: 3.2, hitouts: 0, contestedPossessions: 5.5, uncontestedPossessions: 19.3, clearances: 1.2, inside50s: 3.8, rebound50s: 7.4, goals: 0.4, behinds: 0.5, goalAssists: 1.2, last3Avg: 98.2, seasonAvg: 95.3, clangerSauce: ['brownlow', 'rocket'] },
  { playerId: 'afl-d6', disposals: 18.9, disposalEfficiency: 73, kicks: 12.4, handballs: 6.5, marks: 7.6, tackles: 3.8, hitouts: 0, contestedPossessions: 6.2, uncontestedPossessions: 12.7, clearances: 0.9, inside50s: 2.2, rebound50s: 5.1, goals: 0.2, behinds: 0.3, goalAssists: 0.5, last3Avg: 77.4, seasonAvg: 75.8, clangerSauce: ['bargain'] },
  { playerId: 'afl-d7', disposals: 15.2, disposalEfficiency: 68, kicks: 9.8, handballs: 5.4, marks: 5.9, tackles: 2.9, hitouts: 0, contestedPossessions: 4.8, uncontestedPossessions: 10.4, clearances: 0.5, inside50s: 1.2, rebound50s: 3.8, goals: 0.1, behinds: 0.2, goalAssists: 0.2, last3Avg: 58.6, seasonAvg: 62.3, clangerSauce: ['glassman', 'risky'] },
  { playerId: 'afl-d8', disposals: 14.8, disposalEfficiency: 71, kicks: 9.2, handballs: 5.6, marks: 5.4, tackles: 2.6, hitouts: 0, contestedPossessions: 4.2, uncontestedPossessions: 10.6, clearances: 0.4, inside50s: 1.0, rebound50s: 3.5, goals: 0.1, behinds: 0.1, goalAssists: 0.3, last3Avg: 56.2, seasonAvg: 58.9, clangerSauce: ['bargain'] },
  
  // MIDFIELDERS
  { playerId: 'afl-m1', disposals: 28.4, disposalEfficiency: 77, kicks: 15.2, handballs: 13.2, marks: 5.8, tackles: 5.4, hitouts: 0, contestedPossessions: 12.8, uncontestedPossessions: 15.6, clearances: 6.2, inside50s: 5.8, rebound50s: 2.4, goals: 0.8, behinds: 0.6, goalAssists: 1.2, last3Avg: 122.4, seasonAvg: 118.5, clangerSauce: ['brownlow', 'captain', 'ironman'] },
  { playerId: 'afl-m2', disposals: 29.8, disposalEfficiency: 72, kicks: 13.6, handballs: 16.2, marks: 4.2, tackles: 6.8, hitouts: 0, contestedPossessions: 14.2, uncontestedPossessions: 15.6, clearances: 7.8, inside50s: 4.2, rebound50s: 1.8, goals: 0.4, behinds: 0.4, goalAssists: 0.8, last3Avg: 108.6, seasonAvg: 112.3, clangerSauce: ['risky', 'brownlow'] },
  { playerId: 'afl-m3', disposals: 27.2, disposalEfficiency: 74, kicks: 14.8, handballs: 12.4, marks: 5.2, tackles: 6.2, hitouts: 0, contestedPossessions: 13.4, uncontestedPossessions: 13.8, clearances: 6.8, inside50s: 5.2, rebound50s: 2.1, goals: 0.6, behinds: 0.5, goalAssists: 1.0, last3Avg: 118.2, seasonAvg: 115.8, clangerSauce: ['captain', 'brownlow', 'ironman'] },
  { playerId: 'afl-m4', disposals: 26.4, disposalEfficiency: 76, kicks: 15.8, handballs: 10.6, marks: 5.6, tackles: 4.8, hitouts: 0, contestedPossessions: 11.2, uncontestedPossessions: 15.2, clearances: 5.4, inside50s: 6.4, rebound50s: 1.6, goals: 1.2, behinds: 0.8, goalAssists: 1.4, last3Avg: 105.8, seasonAvg: 108.2, clangerSauce: ['glassman', 'rocket'] },
  { playerId: 'afl-m5', disposals: 26.8, disposalEfficiency: 78, kicks: 14.2, handballs: 12.6, marks: 4.8, tackles: 5.6, hitouts: 0, contestedPossessions: 12.4, uncontestedPossessions: 14.4, clearances: 6.4, inside50s: 4.8, rebound50s: 2.2, goals: 0.5, behinds: 0.4, goalAssists: 0.9, last3Avg: 108.2, seasonAvg: 105.4, clangerSauce: ['captain', 'ironman'] },
  { playerId: 'afl-m6', disposals: 28.2, disposalEfficiency: 75, kicks: 14.6, handballs: 13.6, marks: 4.4, tackles: 6.4, hitouts: 0, contestedPossessions: 13.8, uncontestedPossessions: 14.4, clearances: 7.2, inside50s: 4.6, rebound50s: 1.4, goals: 0.6, behinds: 0.5, goalAssists: 1.1, last3Avg: 112.4, seasonAvg: 109.7, clangerSauce: ['brownlow', 'sneaky'] },
  { playerId: 'afl-m7', disposals: 24.6, disposalEfficiency: 73, kicks: 12.8, handballs: 11.8, marks: 4.2, tackles: 5.8, hitouts: 0, contestedPossessions: 11.8, uncontestedPossessions: 12.8, clearances: 5.8, inside50s: 4.2, rebound50s: 1.8, goals: 0.4, behinds: 0.3, goalAssists: 0.7, last3Avg: 96.8, seasonAvg: 98.3, clangerSauce: ['nomad', 'bargain'] },
  { playerId: 'afl-m8', disposals: 23.4, disposalEfficiency: 76, kicks: 13.2, handballs: 10.2, marks: 4.8, tackles: 4.6, hitouts: 0, contestedPossessions: 10.2, uncontestedPossessions: 13.2, clearances: 4.8, inside50s: 4.4, rebound50s: 2.4, goals: 0.3, behinds: 0.3, goalAssists: 0.6, last3Avg: 94.2, seasonAvg: 92.1, clangerSauce: ['glassman', 'risky'] },
  { playerId: 'afl-m9', disposals: 24.2, disposalEfficiency: 74, kicks: 13.4, handballs: 10.8, marks: 4.6, tackles: 5.2, hitouts: 0, contestedPossessions: 11.4, uncontestedPossessions: 12.8, clearances: 5.6, inside50s: 4.0, rebound50s: 1.6, goals: 0.4, behinds: 0.4, goalAssists: 0.8, last3Avg: 92.4, seasonAvg: 94.8, clangerSauce: ['nomad', 'rocket'] },
  { playerId: 'afl-m10', disposals: 26.2, disposalEfficiency: 79, kicks: 14.8, handballs: 11.4, marks: 5.2, tackles: 5.4, hitouts: 0, contestedPossessions: 11.8, uncontestedPossessions: 14.4, clearances: 5.8, inside50s: 5.2, rebound50s: 2.0, goals: 0.5, behinds: 0.4, goalAssists: 1.0, last3Avg: 104.8, seasonAvg: 102.5, clangerSauce: ['captain', 'brownlow'] },
  { playerId: 'afl-m11', disposals: 28.6, disposalEfficiency: 82, kicks: 16.2, handballs: 12.4, marks: 5.4, tackles: 5.2, hitouts: 0, contestedPossessions: 11.2, uncontestedPossessions: 17.4, clearances: 5.4, inside50s: 6.2, rebound50s: 3.8, goals: 0.6, behinds: 0.5, goalAssists: 1.3, last3Avg: 114.6, seasonAvg: 110.2, clangerSauce: ['rocket', 'brownlow', 'greenhorn'] },
  { playerId: 'afl-m12', disposals: 24.8, disposalEfficiency: 75, kicks: 13.6, handballs: 11.2, marks: 4.4, tackles: 5.6, hitouts: 0, contestedPossessions: 11.6, uncontestedPossessions: 13.2, clearances: 5.6, inside50s: 4.4, rebound50s: 1.8, goals: 0.4, behinds: 0.3, goalAssists: 0.7, last3Avg: 98.2, seasonAvg: 96.4, clangerSauce: ['sneaky'] },
  
  // RUCKMEN
  { playerId: 'afl-r1', disposals: 16.4, disposalEfficiency: 68, kicks: 8.2, handballs: 8.2, marks: 5.2, tackles: 3.8, hitouts: 42.6, contestedPossessions: 10.4, uncontestedPossessions: 6.0, clearances: 4.2, inside50s: 2.8, rebound50s: 1.2, goals: 0.4, behinds: 0.3, goalAssists: 0.6, last3Avg: 106.4, seasonAvg: 102.8, clangerSauce: ['captain', 'ironman', 'brownlow'] },
  { playerId: 'afl-r2', disposals: 15.8, disposalEfficiency: 66, kicks: 7.8, handballs: 8.0, marks: 4.8, tackles: 4.2, hitouts: 38.4, contestedPossessions: 9.8, uncontestedPossessions: 6.0, clearances: 3.8, inside50s: 2.4, rebound50s: 1.0, goals: 0.3, behinds: 0.2, goalAssists: 0.5, last3Avg: 96.2, seasonAvg: 98.5, clangerSauce: ['nomad', 'bargain'] },
  { playerId: 'afl-r3', disposals: 14.2, disposalEfficiency: 64, kicks: 6.8, handballs: 7.4, marks: 4.2, tackles: 3.6, hitouts: 32.8, contestedPossessions: 8.4, uncontestedPossessions: 5.8, clearances: 3.2, inside50s: 2.0, rebound50s: 0.8, goals: 0.2, behinds: 0.2, goalAssists: 0.4, last3Avg: 82.6, seasonAvg: 85.2, clangerSauce: ['sneaky'] },
  { playerId: 'afl-r4', disposals: 15.2, disposalEfficiency: 65, kicks: 7.4, handballs: 7.8, marks: 4.6, tackles: 4.0, hitouts: 35.2, contestedPossessions: 9.2, uncontestedPossessions: 6.0, clearances: 3.6, inside50s: 2.2, rebound50s: 0.9, goals: 0.3, behinds: 0.2, goalAssists: 0.5, last3Avg: 86.8, seasonAvg: 88.4, clangerSauce: ['ironman'] },
  { playerId: 'afl-r5', disposals: 16.0, disposalEfficiency: 67, kicks: 8.0, handballs: 8.0, marks: 5.0, tackles: 3.6, hitouts: 40.2, contestedPossessions: 10.0, uncontestedPossessions: 6.0, clearances: 4.0, inside50s: 2.6, rebound50s: 1.1, goals: 0.3, behinds: 0.3, goalAssists: 0.5, last3Avg: 94.6, seasonAvg: 92.1, clangerSauce: ['rocket'] },
  { playerId: 'afl-r6', disposals: 15.4, disposalEfficiency: 69, kicks: 8.4, handballs: 7.0, marks: 5.2, tackles: 3.4, hitouts: 36.8, contestedPossessions: 8.8, uncontestedPossessions: 6.6, clearances: 3.4, inside50s: 2.4, rebound50s: 1.0, goals: 0.4, behinds: 0.3, goalAssists: 0.6, last3Avg: 87.4, seasonAvg: 89.3, clangerSauce: ['glassman', 'risky'] },
  
  // FORWARDS
  { playerId: 'afl-f1', disposals: 14.8, disposalEfficiency: 62, kicks: 9.4, handballs: 5.4, marks: 6.8, tackles: 2.4, hitouts: 0, contestedPossessions: 5.2, uncontestedPossessions: 9.6, clearances: 0.6, inside50s: 1.2, rebound50s: 0.4, goals: 3.2, behinds: 1.4, goalAssists: 0.8, last3Avg: 96.2, seasonAvg: 92.4, clangerSauce: ['brownlow', 'captain'] },
  { playerId: 'afl-f2', disposals: 13.2, disposalEfficiency: 64, kicks: 8.6, handballs: 4.6, marks: 5.8, tackles: 2.2, hitouts: 0, contestedPossessions: 4.6, uncontestedPossessions: 8.6, clearances: 0.4, inside50s: 1.0, rebound50s: 0.3, goals: 2.8, behinds: 1.2, goalAssists: 0.6, last3Avg: 88.4, seasonAvg: 86.7, clangerSauce: ['nomad', 'ironman'] },
  { playerId: 'afl-f3', disposals: 11.4, disposalEfficiency: 60, kicks: 7.2, handballs: 4.2, marks: 5.2, tackles: 1.8, hitouts: 0, contestedPossessions: 4.0, uncontestedPossessions: 7.4, clearances: 0.3, inside50s: 0.8, rebound50s: 0.2, goals: 2.2, behinds: 1.0, goalAssists: 0.5, last3Avg: 70.6, seasonAvg: 72.3, clangerSauce: ['bargain', 'risky'] },
  { playerId: 'afl-f4', disposals: 12.8, disposalEfficiency: 61, kicks: 8.0, handballs: 4.8, marks: 6.2, tackles: 2.0, hitouts: 0, contestedPossessions: 4.8, uncontestedPossessions: 8.0, clearances: 0.4, inside50s: 1.0, rebound50s: 0.3, goals: 2.6, behinds: 1.2, goalAssists: 0.7, last3Avg: 82.4, seasonAvg: 80.5, clangerSauce: ['rocket'] },
  { playerId: 'afl-f5', disposals: 15.6, disposalEfficiency: 68, kicks: 10.2, handballs: 5.4, marks: 5.4, tackles: 3.2, hitouts: 0, contestedPossessions: 6.2, uncontestedPossessions: 9.4, clearances: 1.2, inside50s: 2.4, rebound50s: 0.6, goals: 1.8, behinds: 0.8, goalAssists: 1.2, last3Avg: 86.8, seasonAvg: 83.2, clangerSauce: ['brownlow', 'rocket'] },
  { playerId: 'afl-f6', disposals: 12.4, disposalEfficiency: 65, kicks: 8.2, handballs: 4.2, marks: 4.6, tackles: 2.4, hitouts: 0, contestedPossessions: 4.4, uncontestedPossessions: 8.0, clearances: 0.5, inside50s: 1.4, rebound50s: 0.3, goals: 1.6, behinds: 0.8, goalAssists: 0.8, last3Avg: 70.2, seasonAvg: 68.9, clangerSauce: ['sneaky', 'bargain'] },
  { playerId: 'afl-f7', disposals: 11.2, disposalEfficiency: 63, kicks: 7.0, handballs: 4.2, marks: 4.8, tackles: 2.0, hitouts: 0, contestedPossessions: 4.0, uncontestedPossessions: 7.2, clearances: 0.4, inside50s: 1.2, rebound50s: 0.2, goals: 1.4, behinds: 0.6, goalAssists: 0.6, last3Avg: 65.8, seasonAvg: 63.4, clangerSauce: ['greenhorn', 'rocket'] },
  { playerId: 'afl-f8', disposals: 14.2, disposalEfficiency: 66, kicks: 9.2, handballs: 5.0, marks: 4.8, tackles: 2.8, hitouts: 0, contestedPossessions: 5.4, uncontestedPossessions: 8.8, clearances: 0.8, inside50s: 2.0, rebound50s: 0.4, goals: 1.8, behinds: 0.8, goalAssists: 1.0, last3Avg: 78.4, seasonAvg: 76.8, clangerSauce: ['nomad', 'risky'] },
  { playerId: 'afl-f9', disposals: 13.6, disposalEfficiency: 64, kicks: 8.8, handballs: 4.8, marks: 6.4, tackles: 2.2, hitouts: 0, contestedPossessions: 4.8, uncontestedPossessions: 8.8, clearances: 0.4, inside50s: 1.0, rebound50s: 0.3, goals: 2.4, behinds: 1.2, goalAssists: 0.6, last3Avg: 76.8, seasonAvg: 74.2, clangerSauce: ['glassman'] },
  { playerId: 'afl-f10', disposals: 12.0, disposalEfficiency: 62, kicks: 7.6, handballs: 4.4, marks: 5.6, tackles: 1.8, hitouts: 0, contestedPossessions: 4.2, uncontestedPossessions: 7.8, clearances: 0.3, inside50s: 0.9, rebound50s: 0.2, goals: 2.0, behinds: 1.0, goalAssists: 0.5, last3Avg: 64.2, seasonAvg: 67.1, clangerSauce: ['glassman', 'risky'] },
];

// Helper function to get stats for a player
export function getPlayerStats(playerId: string): PlayerDetailedStats | undefined {
  return mockPlayerStats.find((stats) => stats.playerId === playerId);
}

export type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket Keeper';

export type PlayerStatus = 'available' | 'in_auction' | 'sold' | 'unsold';

export type BattingStyle = 'Right-hand bat' | 'Left-hand bat';
export type BowlingStyle = 
  | 'Right-arm fast' 
  | 'Right-arm medium' 
  | 'Left-arm fast' 
  | 'Left-arm medium' 
  | 'Right-arm off-break' 
  | 'Right-arm leg-break' 
  | 'Left-arm orthodox' 
  | 'Left-arm chinaman'
  | 'None';

export interface BidRecord {
  id: string;
  round: number;
  amount: number;
  teamId: string;
  teamName: string;
  teamShortCode: string;
  teamColor: string;
  timestamp: number;
}

export interface PlayerStats {
  matches: number;
  innings: number;
  runs: number;
  highestScore: string;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  wickets: number;
  economy: number;
  bestBowling: string;
}

export interface Player {
  id: string;
  name: string;
  nickname: string;
  image: string;
  role: PlayerRole;
  age: number;
  dob: string;
  city: string;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  basePrice: number;
  stats: PlayerStats;
  bio: string;
  status: PlayerStatus;
  soldToTeamId?: string;
  soldToTeamName?: string;
  soldPrice?: number;
  bidHistory: BidRecord[];
  isFeatured?: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortCode: string;
  logo: string;
  color: string;
  owner: string;
  captain: string;
  startingBudget: number;
  totalSpent: number;
  remainingBudget: number;
  playersBought: number;
  squadPlayerIds: string[];
}

export type AuctionPhase = 'idle' | 'bidding' | 'countdown' | 'sold' | 'unsold' | 'completed';

export interface AuctionState {
  isLive: boolean;
  isPaused: boolean;
  phase: AuctionPhase;
  activePlayerId: string | null;
  currentBid: number;
  highestBidderTeamId: string | null;
  highestBidderTeamName: string | null;
  currentRound: number;
  timerSeconds: number;
  initialTimerSeconds: number;
  bids: BidRecord[];
  recentSoldPlayerId: string | null;
  autoAiBidding: boolean;
}

export type ViewTab = 
  | 'home' 
  | 'live_auction' 
  | 'auction_board' 
  | 'players' 
  | 'player_detail' 
  | 'teams' 
  | 'team_detail' 
  | 'results' 
  | 'leaderboard' 
  | 'admin';

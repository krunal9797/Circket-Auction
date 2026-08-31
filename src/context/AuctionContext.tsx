import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Player, Team, BidRecord, AuctionState, ViewTab, PlayerStatus } from '../types';
import { INITIAL_PLAYERS, INITIAL_TEAMS } from '../data/initialData';
import { sounds } from '../utils/audio';
import { 
  db, 
  initAuth, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch 
} from '../lib/firebase';

interface AuctionContextType {
  players: Player[];
  teams: Team[];
  auctionState: AuctionState;
  activePlayer: Player | null;
  currentTab: ViewTab;
  selectedPlayerId: string | null;
  selectedTeamId: string | null;
  userRole: 'admin' | 'team_bidder' | 'spectator';
  activeBiddingTeamId: string;
  isMuted: boolean;
  isCloudSynced: boolean;
  syncStatus: 'connecting' | 'synced' | 'offline' | 'error';
  lastSyncedAt: Date | null;
  
  // Navigation
  setCurrentTab: (tab: ViewTab) => void;
  viewPlayerDetails: (playerId: string) => void;
  viewTeamDetails: (teamId: string) => void;
  setUserRole: (role: 'admin' | 'team_bidder' | 'spectator') => void;
  setActiveBiddingTeamId: (teamId: string) => void;
  toggleMute: () => void;

  // Auction Controls
  startAuctionForPlayer: (playerId: string) => Promise<void>;
  placeBid: (teamId: string, incrementAmount: number) => Promise<{ success: boolean; message: string }>;
  placeCustomBid: (teamId: string, targetAmount: number) => Promise<{ success: boolean; message: string }>;
  pauseAuction: () => Promise<void>;
  resumeAuction: () => Promise<void>;
  markCurrentPlayerSold: (overrideTeamId?: string, overrideAmount?: number) => Promise<void>;
  markCurrentPlayerUnsold: () => Promise<void>;
  nextPlayerInQueue: () => void;
  resetTimer: (seconds?: number) => Promise<void>;
  toggleAutoAiBidding: () => Promise<void>;

  // CRUD Operations on Firebase Server
  addPlayer: (newPlayerData: Omit<Player, 'id' | 'bidHistory' | 'status'>) => Promise<void>;
  updatePlayer: (playerId: string, updatedData: Partial<Player>) => Promise<void>;
  deletePlayer: (playerId: string) => Promise<void>;
  addTeam: (newTeamData: Omit<Team, 'id' | 'totalSpent' | 'remainingBudget' | 'playersBought' | 'squadPlayerIds'>) => Promise<void>;
  updateTeam: (teamId: string, updatedData: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  resetEntireAuction: () => Promise<void>;
  clearAllServerData: () => Promise<void>;
  reseedDatabase: () => Promise<void>;

  // Metrics
  stats: {
    totalPlayers: number;
    totalTeams: number;
    playersSold: number;
    playersUnsold: number;
    playersAvailable: number;
    totalAuctionValue: number;
    highestSoldPlayer: { player: Player; price: number; teamName: string } | null;
    highestSpendingTeam: Team | null;
    mostPlayersTeam: Team | null;
    averageSoldPrice: number;
  };
}

const DEFAULT_AUCTION_STATE: AuctionState = {
  isLive: false,
  isPaused: false,
  phase: 'idle',
  activePlayerId: null,
  currentBid: 0,
  highestBidderTeamId: null,
  highestBidderTeamName: null,
  currentRound: 1,
  timerSeconds: 20,
  initialTimerSeconds: 20,
  bids: [],
  recentSoldPlayerId: null,
  autoAiBidding: true,
};

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pure server data state - empty initial, real-time populated by Firebase
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [auctionState, setAuctionState] = useState<AuctionState>(DEFAULT_AUCTION_STATE);

  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'team_bidder' | 'spectator'>('team_bidder');
  const [activeBiddingTeamId, setActiveBiddingTeamId] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Firestore sync states
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'connecting' | 'synced' | 'offline' | 'error'>('connecting');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Seed / Reseed Database in Firestore with sample data if user chooses
  const seedDatabase = useCallback(async () => {
    try {
      const batch = writeBatch(db);

      // Seed Players
      INITIAL_PLAYERS.forEach(p => {
        const playerRef = doc(db, 'players', p.id);
        batch.set(playerRef, p, { merge: true });
      });

      // Seed Teams
      INITIAL_TEAMS.forEach(t => {
        const teamRef = doc(db, 'teams', t.id);
        batch.set(teamRef, t, { merge: true });
      });

      // Seed Auction State
      const auctionRef = doc(db, 'auction_state', 'current');
      batch.set(auctionRef, DEFAULT_AUCTION_STATE, { merge: true });

      await batch.commit();
      console.log('Firebase Firestore seeded with sample tournament data.');
    } catch (err) {
      console.error('Error seeding Firestore data:', err);
    }
  }, []);

  // Clear ALL data from Firebase Firestore Server
  const clearAllServerData = useCallback(async () => {
    try {
      setSyncStatus('connecting');
      // Delete players
      const playerSnap = await getDocs(collection(db, 'players'));
      const batch1 = writeBatch(db);
      playerSnap.forEach((docSnap) => {
        batch1.delete(doc(db, 'players', docSnap.id));
      });
      await batch1.commit();

      // Delete teams
      const teamSnap = await getDocs(collection(db, 'teams'));
      const batch2 = writeBatch(db);
      teamSnap.forEach((docSnap) => {
        batch2.delete(doc(db, 'teams', docSnap.id));
      });
      await batch2.commit();

      // Reset auction state
      await setDoc(doc(db, 'auction_state', 'current'), DEFAULT_AUCTION_STATE);

      setPlayers([]);
      setTeams([]);
      setAuctionState(DEFAULT_AUCTION_STATE);
      setActiveBiddingTeamId('');
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error('Error clearing all Firebase data:', err);
      setSyncStatus('error');
    }
  }, []);

  // Initialize Firebase and setup Realtime Listeners directly from server
  useEffect(() => {
    let unsubscribePlayers: (() => void) | null = null;
    let unsubscribeTeams: (() => void) | null = null;
    let unsubscribeAuction: (() => void) | null = null;

    const initFirebaseListeners = async () => {
      try {
        setSyncStatus('connecting');
        await initAuth();

        // 1. Realtime Listener for Players directly from Firebase Firestore
        unsubscribePlayers = onSnapshot(
          collection(db, 'players'),
          (snapshot) => {
            const loadedPlayers: Player[] = [];
            snapshot.forEach((docSnap) => {
              loadedPlayers.push({ id: docSnap.id, ...docSnap.data() } as Player);
            });
            setPlayers(loadedPlayers);
            setIsCloudSynced(true);
            setSyncStatus('synced');
            setLastSyncedAt(new Date());
          },
          (err) => {
            console.error('Firestore players listener error:', err);
            setSyncStatus('error');
          }
        );

        // 2. Realtime Listener for Teams directly from Firebase Firestore
        unsubscribeTeams = onSnapshot(
          collection(db, 'teams'),
          (snapshot) => {
            const loadedTeams: Team[] = [];
            snapshot.forEach((docSnap) => {
              loadedTeams.push({ id: docSnap.id, ...docSnap.data() } as Team);
            });
            setTeams(loadedTeams);
            setActiveBiddingTeamId(prev => {
              if (loadedTeams.some(t => t.id === prev)) return prev;
              return loadedTeams[0]?.id || '';
            });
            setIsCloudSynced(true);
            setSyncStatus('synced');
            setLastSyncedAt(new Date());
          },
          (err) => {
            console.error('Firestore teams listener error:', err);
            setSyncStatus('error');
          }
        );

        // 3. Realtime Listener for Live Auction State from Firebase
        unsubscribeAuction = onSnapshot(
          doc(db, 'auction_state', 'current'),
          (docSnap) => {
            if (docSnap.exists()) {
              const remoteState = docSnap.data() as AuctionState;
              setAuctionState(remoteState);
            } else {
              setDoc(doc(db, 'auction_state', 'current'), DEFAULT_AUCTION_STATE, { merge: true });
            }
            setIsCloudSynced(true);
            setSyncStatus('synced');
            setLastSyncedAt(new Date());
          },
          (err) => {
            console.error('Firestore auction listener error:', err);
            setSyncStatus('error');
          }
        );
      } catch (err) {
        console.error('Failed to initialize Firebase listeners:', err);
        setSyncStatus('offline');
      }
    };

    initFirebaseListeners();

    return () => {
      if (unsubscribePlayers) unsubscribePlayers();
      if (unsubscribeTeams) unsubscribeTeams();
      if (unsubscribeAuction) unsubscribeAuction();
    };
  }, []);

  const activePlayer = players.find(p => p.id === auctionState.activePlayerId) || null;

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    sounds.setMuted(newMuted);
  };

  const viewPlayerDetails = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setCurrentTab('player_detail');
  };

  const viewTeamDetails = (teamId: string) => {
    setSelectedTeamId(teamId);
    setCurrentTab('team_detail');
  };

  // Mark player SOLD (Direct Firebase Firestore write)
  const markCurrentPlayerSold = useCallback(async (overrideTeamId?: string, overrideAmount?: number) => {
    const winningTeamId = overrideTeamId || auctionState.highestBidderTeamId;
    const finalPrice = overrideAmount ?? auctionState.currentBid;
    const playerId = auctionState.activePlayerId;

    if (!playerId || !winningTeamId || finalPrice <= 0) {
      return;
    }

    const winningTeam = teams.find(t => t.id === winningTeamId);
    if (!winningTeam) return;

    sounds.playSoldHammer();
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#3B82F6', '#EF4444', '#10B981', '#ffffff'],
      });
    } catch {
      // Ignore
    }

    const newSpent = winningTeam.totalSpent + finalPrice;
    const updatedTeamData = {
      totalSpent: newSpent,
      remainingBudget: Math.max(0, winningTeam.startingBudget - newSpent),
      playersBought: winningTeam.playersBought + 1,
      squadPlayerIds: [...(winningTeam.squadPlayerIds || []), playerId],
    };

    const newHistory: BidRecord[] = [
      ...auctionState.bids,
      {
        id: `sold-${Date.now()}`,
        round: auctionState.currentRound,
        amount: finalPrice,
        teamId: winningTeam.id,
        teamName: winningTeam.name,
        teamShortCode: winningTeam.shortCode,
        teamColor: winningTeam.color,
        timestamp: Date.now(),
      },
    ];

    const updatedPlayerData = {
      status: 'sold' as PlayerStatus,
      soldToTeamId: winningTeam.id,
      soldToTeamName: winningTeam.name,
      soldPrice: finalPrice,
      bidHistory: newHistory,
    };

    const updatedAuctionState: AuctionState = {
      ...auctionState,
      isLive: false,
      phase: 'sold',
      timerSeconds: 0,
      recentSoldPlayerId: playerId,
    };

    // Update Firebase Firestore
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'teams', winningTeamId), updatedTeamData);
      batch.update(doc(db, 'players', playerId), updatedPlayerData);
      batch.set(doc(db, 'auction_state', 'current'), updatedAuctionState, { merge: true });
      await batch.commit();
    } catch (err) {
      console.error('Firestore error during mark sold:', err);
    }
  }, [auctionState, teams]);

  // Mark player UNSOLD (Direct Firebase Firestore write)
  const markCurrentPlayerUnsold = useCallback(async () => {
    const playerId = auctionState.activePlayerId;
    if (!playerId) return;

    sounds.playUnsoldSound();

    const updatedPlayerData = {
      status: 'unsold' as PlayerStatus,
      bidHistory: auctionState.bids,
    };

    const updatedAuctionState: AuctionState = {
      ...auctionState,
      isLive: false,
      phase: 'unsold',
      timerSeconds: 0,
    };

    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'players', playerId), updatedPlayerData);
      batch.set(doc(db, 'auction_state', 'current'), updatedAuctionState, { merge: true });
      await batch.commit();
    } catch (err) {
      console.error('Firestore error during mark unsold:', err);
    }
  }, [auctionState]);

  // Timer Tick Hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (auctionState.isLive && !auctionState.isPaused && auctionState.phase === 'bidding') {
      interval = setInterval(() => {
        setAuctionState(prev => {
          if (prev.timerSeconds <= 1) {
            if (prev.highestBidderTeamId && prev.currentBid > 0) {
              setTimeout(() => markCurrentPlayerSold(), 0);
            } else {
              setTimeout(() => markCurrentPlayerUnsold(), 0);
            }
            return {
              ...prev,
              timerSeconds: 0,
            };
          }

          const nextSec = prev.timerSeconds - 1;
          if (nextSec <= 5) {
            sounds.playTick(true);
          } else if (nextSec % 5 === 0) {
            sounds.playTick(false);
          }

          return {
            ...prev,
            timerSeconds: nextSec,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [auctionState.isLive, auctionState.isPaused, auctionState.phase, markCurrentPlayerSold, markCurrentPlayerUnsold]);

  // AI Bidding Simulation Engine
  const aiBidTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      auctionState.isLive &&
      !auctionState.isPaused &&
      auctionState.phase === 'bidding' &&
      auctionState.autoAiBidding &&
      auctionState.activePlayerId
    ) {
      const player = players.find(p => p.id === auctionState.activePlayerId);
      if (!player) return;

      const maxValuation = Math.min(
        player.basePrice * 3.5,
        player.role === 'All-Rounder' ? 45000 : 38000
      );

      const delay = Math.floor(Math.random() * 2500) + 2200;

      aiBidTimeoutRef.current = setTimeout(() => {
        const eligibleTeams = teams.filter(t => {
          if (t.id === auctionState.highestBidderTeamId) return false;
          const nextBid = (auctionState.currentBid || player.basePrice) + (auctionState.currentBid > 25000 ? 5000 : 2000);
          return t.remainingBudget >= nextBid && nextBid <= maxValuation;
        });

        if (eligibleTeams.length > 0 && Math.random() > 0.25) {
          const randomTeam = eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)];
          const increment = auctionState.currentBid > 25000 ? 5000 : (auctionState.currentBid > 15000 ? 2000 : 1000);
          placeBid(randomTeam.id, increment);
        }
      }, delay);
    }

    return () => {
      if (aiBidTimeoutRef.current) {
        clearTimeout(aiBidTimeoutRef.current);
      }
    };
  }, [auctionState.isLive, auctionState.isPaused, auctionState.currentBid, auctionState.autoAiBidding, auctionState.phase, auctionState.highestBidderTeamId, players, teams]);

  // Start auction for a player (Firestore update)
  const startAuctionForPlayer = async (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const newState: AuctionState = {
      isLive: true,
      isPaused: false,
      phase: 'bidding',
      activePlayerId: playerId,
      currentBid: player.basePrice,
      highestBidderTeamId: null,
      highestBidderTeamName: null,
      currentRound: 1,
      timerSeconds: 20,
      initialTimerSeconds: 20,
      bids: [],
      recentSoldPlayerId: null,
      autoAiBidding: auctionState.autoAiBidding,
    };

    setCurrentTab('live_auction');

    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'players', playerId), { status: 'in_auction' });
      batch.set(doc(db, 'auction_state', 'current'), newState, { merge: true });
      await batch.commit();
    } catch (err) {
      console.error('Firestore error during startAuctionForPlayer:', err);
    }
  };

  // Place increment bid (Firestore update)
  const placeBid = async (teamId: string, incrementAmount: number): Promise<{ success: boolean; message: string }> => {
    const team = teams.find(t => t.id === teamId);
    if (!team) {
      return { success: false, message: 'Team not found' };
    }

    if (!auctionState.isLive || auctionState.phase !== 'bidding') {
      return { success: false, message: 'No live auction in progress' };
    }

    const currentBid = auctionState.currentBid;
    let nextBid: number;

    if (auctionState.highestBidderTeamId === null) {
      nextBid = currentBid > 0 ? currentBid : (activePlayer?.basePrice || 5000);
    } else {
      nextBid = currentBid + incrementAmount;
    }

    if (nextBid > team.remainingBudget) {
      return {
        success: false,
        message: `${team.name} cannot bid ₹${nextBid.toLocaleString('en-IN')}. Remaining purse is only ₹${team.remainingBudget.toLocaleString('en-IN')}.`,
      };
    }

    if (auctionState.highestBidderTeamId === team.id) {
      return {
        success: false,
        message: `${team.name} is already the highest bidder at ₹${currentBid.toLocaleString('en-IN')}!`,
      };
    }

    sounds.playBidSound();

    const newBidRecord: BidRecord = {
      id: `bid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      round: auctionState.bids.length + 1,
      amount: nextBid,
      teamId: team.id,
      teamName: team.name,
      teamShortCode: team.shortCode,
      teamColor: team.color,
      timestamp: Date.now(),
    };

    const updatedState: AuctionState = {
      ...auctionState,
      currentBid: nextBid,
      highestBidderTeamId: team.id,
      highestBidderTeamName: team.name,
      timerSeconds: Math.max(auctionState.timerSeconds, 15),
      bids: [newBidRecord, ...auctionState.bids],
    };

    try {
      await setDoc(doc(db, 'auction_state', 'current'), updatedState, { merge: true });
    } catch (err) {
      console.error('Firestore error placing bid:', err);
    }

    return {
      success: true,
      message: `Bid of ₹${nextBid.toLocaleString('en-IN')} placed by ${team.name}!`,
    };
  };

  // Place custom target bid (Firestore update)
  const placeCustomBid = async (teamId: string, targetAmount: number): Promise<{ success: boolean; message: string }> => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return { success: false, message: 'Team not found' };

    if (!auctionState.isLive || auctionState.phase !== 'bidding') {
      return { success: false, message: 'No live auction in progress' };
    }

    if (targetAmount <= auctionState.currentBid && auctionState.highestBidderTeamId !== null) {
      return {
        success: false,
        message: `Bid must be higher than current bid of ₹${auctionState.currentBid.toLocaleString('en-IN')}`,
      };
    }

    if (targetAmount > team.remainingBudget) {
      return {
        success: false,
        message: `Exceeds ${team.name}'s remaining budget of ₹${team.remainingBudget.toLocaleString('en-IN')}`,
      };
    }

    sounds.playBidSound();

    const newBidRecord: BidRecord = {
      id: `bid-${Date.now()}`,
      round: auctionState.bids.length + 1,
      amount: targetAmount,
      teamId: team.id,
      teamName: team.name,
      teamShortCode: team.shortCode,
      teamColor: team.color,
      timestamp: Date.now(),
    };

    const updatedState: AuctionState = {
      ...auctionState,
      currentBid: targetAmount,
      highestBidderTeamId: team.id,
      highestBidderTeamName: team.name,
      timerSeconds: 20,
      bids: [newBidRecord, ...auctionState.bids],
    };

    try {
      await setDoc(doc(db, 'auction_state', 'current'), updatedState, { merge: true });
    } catch (err) {
      console.error('Firestore error placing custom bid:', err);
    }

    return { success: true, message: `Custom bid of ₹${targetAmount.toLocaleString('en-IN')} placed!` };
  };

  const pauseAuction = async () => {
    const updated = { ...auctionState, isPaused: true };
    try {
      await setDoc(doc(db, 'auction_state', 'current'), updated, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  const resumeAuction = async () => {
    const updated = { ...auctionState, isPaused: false };
    try {
      await setDoc(doc(db, 'auction_state', 'current'), updated, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  const resetTimer = async (seconds: number = 20) => {
    const updated = {
      ...auctionState,
      timerSeconds: seconds,
      initialTimerSeconds: seconds,
    };
    try {
      await setDoc(doc(db, 'auction_state', 'current'), updated, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAutoAiBidding = async () => {
    const updated = { ...auctionState, autoAiBidding: !auctionState.autoAiBidding };
    try {
      await setDoc(doc(db, 'auction_state', 'current'), updated, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  const nextPlayerInQueue = () => {
    const availablePlayers = players.filter(p => p.status === 'available');
    if (availablePlayers.length > 0) {
      startAuctionForPlayer(availablePlayers[0].id);
    } else {
      const unsoldPlayers = players.filter(p => p.status === 'unsold');
      if (unsoldPlayers.length > 0) {
        startAuctionForPlayer(unsoldPlayers[0].id);
      } else {
        const completedState: AuctionState = {
          ...auctionState,
          isLive: false,
          phase: 'completed',
          activePlayerId: null,
        };
        setDoc(doc(db, 'auction_state', 'current'), completedState, { merge: true }).catch(console.error);
      }
    }
  };

  // CRUD Operations directly modifying Firebase Server
  const addPlayer = async (newPlayerData: Omit<Player, 'id' | 'bidHistory' | 'status'>) => {
    const newId = `p-${Date.now()}`;
    const newPlayer: Player = {
      ...newPlayerData,
      id: newId,
      status: 'available',
      bidHistory: [],
    };
    try {
      await setDoc(doc(db, 'players', newId), newPlayer);
    } catch (err) {
      console.error('Firestore error adding player:', err);
    }
  };

  const updatePlayer = async (playerId: string, updatedData: Partial<Player>) => {
    try {
      await updateDoc(doc(db, 'players', playerId), updatedData);
    } catch (err) {
      console.error('Firestore error updating player:', err);
    }
  };

  const deletePlayer = async (playerId: string) => {
    try {
      await deleteDoc(doc(db, 'players', playerId));
    } catch (err) {
      console.error('Firestore error deleting player:', err);
    }
  };

  const addTeam = async (newTeamData: Omit<Team, 'id' | 'totalSpent' | 'remainingBudget' | 'playersBought' | 'squadPlayerIds'>) => {
    const newId = `team-${Date.now()}`;
    const newTeam: Team = {
      ...newTeamData,
      id: newId,
      totalSpent: 0,
      remainingBudget: newTeamData.startingBudget,
      playersBought: 0,
      squadPlayerIds: [],
    };
    try {
      await setDoc(doc(db, 'teams', newId), newTeam);
    } catch (err) {
      console.error('Firestore error adding team:', err);
    }
  };

  const updateTeam = async (teamId: string, updatedData: Partial<Team>) => {
    try {
      await updateDoc(doc(db, 'teams', teamId), updatedData);
    } catch (err) {
      console.error('Firestore error updating team:', err);
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      await deleteDoc(doc(db, 'teams', teamId));
    } catch (err) {
      console.error('Firestore error deleting team:', err);
    }
  };

  const resetEntireAuction = async () => {
    try {
      // Reset all player statuses to 'available' on server
      const batch = writeBatch(db);
      players.forEach(p => {
        batch.update(doc(db, 'players', p.id), {
          status: 'available',
          soldToTeamId: undefined,
          soldToTeamName: undefined,
          soldPrice: undefined,
          bidHistory: [],
        });
      });

      // Reset team budgets and squads on server
      teams.forEach(t => {
        batch.update(doc(db, 'teams', t.id), {
          totalSpent: 0,
          remainingBudget: t.startingBudget,
          playersBought: 0,
          squadPlayerIds: [],
        });
      });

      // Reset auction state on server
      batch.set(doc(db, 'auction_state', 'current'), DEFAULT_AUCTION_STATE, { merge: true });
      await batch.commit();
    } catch (err) {
      console.error('Firestore error during full reset:', err);
    }
  };

  // Derived Statistics Calculation
  const soldPlayersList = players.filter(p => p.status === 'sold' && p.soldPrice);
  const totalPlayers = players.length;
  const totalTeams = teams.length;
  const playersSold = soldPlayersList.length;
  const playersUnsold = players.filter(p => p.status === 'unsold').length;
  const playersAvailable = players.filter(p => p.status === 'available').length;
  const totalAuctionValue = soldPlayersList.reduce((acc, p) => acc + (p.soldPrice || 0), 0);

  let highestSoldPlayer: { player: Player; price: number; teamName: string } | null = null;
  if (soldPlayersList.length > 0) {
    const sorted = [...soldPlayersList].sort((a, b) => (b.soldPrice || 0) - (a.soldPrice || 0));
    highestSoldPlayer = {
      player: sorted[0],
      price: sorted[0].soldPrice || 0,
      teamName: sorted[0].soldToTeamName || 'Unknown',
    };
  }

  const sortedTeamsBySpent = [...teams].sort((a, b) => b.totalSpent - a.totalSpent);
  const highestSpendingTeam = sortedTeamsBySpent.length > 0 && sortedTeamsBySpent[0].totalSpent > 0 ? sortedTeamsBySpent[0] : null;

  const sortedTeamsByPlayers = [...teams].sort((a, b) => b.playersBought - a.playersBought);
  const mostPlayersTeam = sortedTeamsByPlayers.length > 0 && sortedTeamsByPlayers[0].playersBought > 0 ? sortedTeamsByPlayers[0] : null;

  const averageSoldPrice = playersSold > 0 ? Math.round(totalAuctionValue / playersSold) : 0;

  const stats = {
    totalPlayers,
    totalTeams,
    playersSold,
    playersUnsold,
    playersAvailable,
    totalAuctionValue,
    highestSoldPlayer,
    highestSpendingTeam,
    mostPlayersTeam,
    averageSoldPrice,
  };

  return (
    <AuctionContext.Provider
      value={{
        players,
        teams,
        auctionState,
        activePlayer,
        currentTab,
        selectedPlayerId,
        selectedTeamId,
        userRole,
        activeBiddingTeamId,
        isMuted,
        isCloudSynced,
        syncStatus,
        lastSyncedAt,
        setCurrentTab,
        viewPlayerDetails,
        viewTeamDetails,
        setUserRole,
        setActiveBiddingTeamId,
        toggleMute,
        startAuctionForPlayer,
        placeBid,
        placeCustomBid,
        pauseAuction,
        resumeAuction,
        markCurrentPlayerSold,
        markCurrentPlayerUnsold,
        nextPlayerInQueue,
        resetTimer,
        toggleAutoAiBidding,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addTeam,
        updateTeam,
        deleteTeam,
        resetEntireAuction,
        clearAllServerData,
        reseedDatabase: seedDatabase,
        stats,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};

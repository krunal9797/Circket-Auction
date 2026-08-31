import React, { useState } from 'react';
import { 
  Gavel, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Play, 
  Pause, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Unlock, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Upload,
  Sparkles,
  Eye,
  Cloud,
  RefreshCw,
  Database,
  Copy,
  Check,
  KeyRound
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { Player, Team, PlayerRole, BattingStyle, BowlingStyle, Sponsor, SponsorTier } from '../types';
import { formatINR } from '../utils/formatters';
import { SponsorSlideshow } from './SponsorSlideshow';

export const AdminPanel: React.FC = () => {
  const {
    players,
    teams,
    sponsors,
    auctionState,
    activePlayer,
    stats,
    startAuctionForPlayer,
    pauseAuction,
    resumeAuction,
    markCurrentPlayerSold,
    markCurrentPlayerUnsold,
    resetTimer,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addTeam,
    updateTeam,
    deleteTeam,
    addSponsor,
    updateSponsor,
    deleteSponsor,
    reseedSponsors,
    resetEntireAuction,
    clearAllServerData,
    reseedDatabase,
    placeBid,
    setCurrentTab,
    viewPlayerDetails,
    syncStatus,
    isCloudSynced,
    lastSyncedAt
  } = useAuction();

  const [isReseeding, setIsReseeding] = useState(false);

  // Admin authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default true for frictionless testing, with unlock UI
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'control_room' | 'players' | 'teams' | 'sponsors' | 'add_player' | 'add_team'>('control_room');

  // Player Form State
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playerForm, setPlayerForm] = useState({
    name: '',
    nickname: '',
    image: '',
    role: 'Batsman' as PlayerRole,
    age: 26,
    dob: '15 Aug 1998',
    city: 'Mumbai',
    battingStyle: 'Right-hand bat' as BattingStyle,
    bowlingStyle: 'Right-arm medium' as BowlingStyle,
    basePrice: 10000,
    matches: 45,
    innings: 42,
    runs: 1250,
    highestScore: '89*',
    average: 34.5,
    strikeRate: 142.5,
    fifties: 8,
    hundreds: 1,
    wickets: 12,
    economy: 8.2,
    bestBowling: '3/24',
    bio: 'Dynamic aggressive player with strong tournament record.',
  });

  // Team Form State
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [copiedTeamId, setCopiedTeamId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    shortCode: 'NEW',
    logo: '🏏',
    color: '#F59E0B',
    owner: '',
    captain: '',
    accessPin: '1234',
    ownerEmail: '',
    ownerPhone: '',
    startingBudget: 100000,
  });

  // Sponsor Form State
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [sponsorForm, setSponsorForm] = useState<{
    name: string;
    tagline: string;
    tier: SponsorTier;
    logoUrl: string;
    bannerUrl: string;
    website: string;
    active: boolean;
    displayOrder: number;
  }>({
    name: '',
    tagline: '',
    tier: 'Title Sponsor',
    logoUrl: '',
    bannerUrl: '',
    website: '',
    active: true,
    displayOrder: 1,
  });

  // Force Bid in Control Room State
  const [selectedBidderTeamId, setSelectedBidderTeamId] = useState<string>('team-tigers');
  const [forceBidAmount, setForceBidAmount] = useState<string>('');

  // Authentication check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'admin123' || pinInput === 'admin' || pinInput === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin PIN. (Hint: Use admin123 or click Quick Demo Access)');
    }
  };

  // Populate Player Form for Edit
  const handleEditPlayer = (player: Player) => {
    setEditingPlayerId(player.id);
    setPlayerForm({
      name: player.name,
      nickname: player.nickname,
      image: player.image,
      role: player.role,
      age: player.age,
      dob: player.dob,
      city: player.city,
      battingStyle: player.battingStyle,
      bowlingStyle: player.bowlingStyle,
      basePrice: player.basePrice,
      matches: player.stats.matches,
      innings: player.stats.innings,
      runs: player.stats.runs,
      highestScore: player.stats.highestScore,
      average: player.stats.average,
      strikeRate: player.stats.strikeRate,
      fifties: player.stats.fifties,
      hundreds: player.stats.hundreds,
      wickets: player.stats.wickets,
      economy: player.stats.economy,
      bestBowling: player.stats.bestBowling,
      bio: player.bio,
    });
    setAdminTab('add_player');
  };

  // Submit Player Form (Add or Update)
  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerForm.name.trim()) return;

    const defaultImg = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80';
    const finalImage = playerForm.image.trim() || defaultImg;

    const formattedData = {
      name: playerForm.name,
      nickname: playerForm.nickname || playerForm.name.split(' ')[0],
      image: finalImage,
      role: playerForm.role,
      age: Number(playerForm.age),
      dob: playerForm.dob,
      city: playerForm.city,
      battingStyle: playerForm.battingStyle,
      bowlingStyle: playerForm.bowlingStyle,
      basePrice: Number(playerForm.basePrice),
      stats: {
        matches: Number(playerForm.matches),
        innings: Number(playerForm.innings),
        runs: Number(playerForm.runs),
        highestScore: playerForm.highestScore,
        average: Number(playerForm.average),
        strikeRate: Number(playerForm.strikeRate),
        fifties: Number(playerForm.fifties),
        hundreds: Number(playerForm.hundreds),
        wickets: Number(playerForm.wickets),
        economy: Number(playerForm.economy),
        bestBowling: playerForm.bestBowling,
      },
      bio: playerForm.bio,
    };

    if (editingPlayerId) {
      updatePlayer(editingPlayerId, formattedData);
      setEditingPlayerId(null);
    } else {
      addPlayer(formattedData);
    }

    setAdminTab('players');
  };

  // Submit Team Form
  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return;

    if (editingTeamId) {
      updateTeam(editingTeamId, {
        name: teamForm.name,
        shortCode: teamForm.shortCode,
        logo: teamForm.logo,
        color: teamForm.color,
        owner: teamForm.owner,
        captain: teamForm.captain,
        accessPin: teamForm.accessPin || '1234',
        ownerEmail: teamForm.ownerEmail,
        ownerPhone: teamForm.ownerPhone,
        startingBudget: Number(teamForm.startingBudget),
      });
      setEditingTeamId(null);
    } else {
      addTeam({
        name: teamForm.name,
        shortCode: teamForm.shortCode || teamForm.name.substring(0, 3).toUpperCase(),
        logo: teamForm.logo || '🏏',
        color: teamForm.color,
        owner: teamForm.owner || 'Franchise Group',
        captain: teamForm.captain || 'Lead Player',
        accessPin: teamForm.accessPin || '1234',
        ownerEmail: teamForm.ownerEmail,
        ownerPhone: teamForm.ownerPhone,
        startingBudget: Number(teamForm.startingBudget) || 100000,
      });
    }

    setTeamForm({
      name: '',
      shortCode: 'NEW',
      logo: '🏏',
      color: '#F59E0B',
      owner: '',
      captain: '',
      accessPin: '1234',
      ownerEmail: '',
      ownerPhone: '',
      startingBudget: 100000,
    });
    setAdminTab('teams');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-sports text-3xl font-bold text-white tracking-wide uppercase">
              ADMIN CONTROL ROOM
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter auctioneer security credentials to access the admin deck.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Admin Password / PIN</label>
              <input
                type="password"
                id="admin-pin-input"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter admin123"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              id="admin-login-submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase tracking-wider transition cursor-pointer"
            >
              Unlock Admin Desk
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsAuthenticated(true)}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              ⚡ Instant Demo Access (Click to bypass PIN)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Admin Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>AUTHENTICATED AUCTIONEER DECK</span>
          </div>
          <h1 className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">
            ADMIN CONTROL PANEL
          </h1>
          <p className="text-sm text-slate-400">
            Manage live auction phases, hammer resolutions, player draft rosters, and franchise accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={async () => {
              if (window.confirm('WARNING: Are you sure you want to completely WIPE ALL PLAYERS AND TEAMS from Cloud Firestore server? This will delete all current records so only your new data will exist.')) {
                setIsReseeding(true);
                await clearAllServerData();
                setIsReseeding(false);
              }
            }}
            disabled={isReseeding}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-red-500/50 hover:bg-red-950/50 text-slate-300 hover:text-red-300 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            title="Delete all data from Firestore and start from zero"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Wipe Server Data (0 DB)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset current auction bids and restore all team budgets?')) {
                resetEntireAuction();
              }
            }}
            className="px-4 py-2 rounded-xl bg-red-950/80 border border-red-500/40 hover:bg-red-900/80 text-red-300 text-xs font-bold transition flex items-center gap-1.5"
            title="Reset all bids and restore purses"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Bids & Purses</span>
          </button>
        </div>
      </div>

      {/* Cloud Firestore Status Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            syncStatus === 'synced' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : syncStatus === 'connecting'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Cloud Firestore Live Database</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                syncStatus === 'synced'
                  ? 'bg-emerald-500 text-black'
                  : syncStatus === 'connecting'
                  ? 'bg-amber-500 text-black animate-pulse'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {syncStatus === 'synced' ? 'Realtime Connected' : syncStatus}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Only real data entered by you is stored and synced live across all connected devices.
              {lastSyncedAt && ` (Last sync: ${lastSyncedAt.toLocaleTimeString()})`}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Quick Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Players</span>
          <strong className="text-2xl font-bold text-white font-digital">{stats.totalPlayers}</strong>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Teams</span>
          <strong className="text-2xl font-bold text-blue-400 font-digital">{stats.totalTeams}</strong>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Sold Players</span>
          <strong className="text-2xl font-bold text-emerald-400 font-digital">{stats.playersSold}</strong>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Unsold Players</span>
          <strong className="text-2xl font-bold text-red-400 font-digital">{stats.playersUnsold}</strong>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Value</span>
          <strong className="text-lg font-bold text-amber-400 font-digital truncate block">
            {formatINR(stats.totalAuctionValue)}
          </strong>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Highest Bid</span>
          <strong className="text-lg font-bold text-yellow-300 font-digital truncate block">
            {formatINR(stats.highestSoldPlayer?.price || auctionState.currentBid)}
          </strong>
        </div>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setAdminTab('control_room')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'control_room'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Auctioneer Control Deck</span>
        </button>

        <button
          onClick={() => setAdminTab('players')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'players'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Players ({players.length})</span>
        </button>

        <button
          onClick={() => {
            setEditingPlayerId(null);
            setPlayerForm({
              name: '',
              nickname: '',
              image: '',
              role: 'Batsman',
              age: 25,
              dob: '12 Jan 1999',
              city: 'Mumbai',
              battingStyle: 'Right-hand bat',
              bowlingStyle: 'Right-arm medium',
              basePrice: 10000,
              matches: 30,
              innings: 28,
              runs: 850,
              highestScore: '75*',
              average: 32.5,
              strikeRate: 138.2,
              fifties: 5,
              hundreds: 0,
              wickets: 8,
              economy: 8.4,
              bestBowling: '2/18',
              bio: '',
            });
            setAdminTab('add_player');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'add_player'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{editingPlayerId ? 'Edit Player' : 'Add New Player'}</span>
        </button>

        <button
          onClick={() => setAdminTab('teams')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'teams'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Manage Teams ({teams.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('sponsors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'sponsors'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Sponsors & Slideshow ({sponsors.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: LIVE AUCTIONEER CONTROL DECK */}
      {adminTab === 'control_room' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Auction Control Room */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  AUCTIONEER CONSOLE
                </span>
                <h3 className="font-sports text-2xl font-bold text-white uppercase">
                  ACTIVE LOT CONTROLS
                </h3>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                auctionState.isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}>
                {auctionState.isLive ? 'LIVE ON HAMMER' : 'IDLE'}
              </span>
            </div>

            {/* Current Active Player Info */}
            {activePlayer ? (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activePlayer.image}
                    alt={activePlayer.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">{activePlayer.name}</h4>
                    <span className="text-xs text-amber-400 font-semibold">{activePlayer.role} • Base: {formatINR(activePlayer.basePrice)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Current High Bid</span>
                  <span className="font-digital text-xl font-black text-amber-400">
                    {formatINR(auctionState.currentBid)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                No active player on the hammer. Select a player below to start!
              </div>
            )}

            {/* Quick Gavel Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={auctionState.isPaused ? resumeAuction : pauseAuction}
                disabled={!auctionState.isLive}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex flex-col items-center justify-center gap-1 disabled:opacity-40"
              >
                {auctionState.isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5 text-amber-400" />}
                <span>{auctionState.isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={() => resetTimer(20)}
                disabled={!auctionState.isLive}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex flex-col items-center justify-center gap-1 disabled:opacity-40"
              >
                <RotateCcw className="w-5 h-5 text-blue-400" />
                <span>Reset 20s</span>
              </button>

              <button
                onClick={() => markCurrentPlayerSold()}
                disabled={!auctionState.highestBidderTeamId}
                className="p-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex flex-col items-center justify-center gap-1 disabled:opacity-40"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Mark SOLD</span>
              </button>

              <button
                onClick={markCurrentPlayerUnsold}
                disabled={!activePlayer}
                className="p-3 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-300 font-bold text-xs flex flex-col items-center justify-center gap-1 disabled:opacity-40"
              >
                <XCircle className="w-5 h-5 text-red-400" />
                <span>Mark UNSOLD</span>
              </button>
            </div>

            {/* Force Manual Bid Insertion */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <label className="text-xs text-slate-300 font-bold uppercase block">
                Force Bidding Action (Auctioneer Override)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <select
                    value={selectedBidderTeamId}
                    onChange={(e) => setSelectedBidderTeamId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-bold text-white"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} (Purse: {formatINR(t.remainingBudget)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-6 flex gap-2">
                  <button
                    onClick={() => placeBid(selectedBidderTeamId, 2000)}
                    disabled={!activePlayer}
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase disabled:opacity-40"
                  >
                    +₹2,000 Bid
                  </button>
                  <button
                    onClick={() => placeBid(selectedBidderTeamId, 5000)}
                    disabled={!activePlayer}
                    className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black text-xs font-black uppercase disabled:opacity-40"
                  >
                    +₹5,000 Bid
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Player Launcher Queue */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-sports text-2xl font-bold text-white uppercase">
                START DRAFT FOR PLAYER
              </h4>
              <span className="text-xs text-slate-400 font-digital">{players.filter(p => p.status === 'available').length} In Queue</span>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {players.filter(p => p.status === 'available').map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-amber-500/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <strong className="text-xs font-bold text-white block">{p.name}</strong>
                      <span className="text-[10px] text-amber-400">{p.role} • Base: {formatINR(p.basePrice)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      startAuctionForPlayer(p.id);
                      setCurrentTab('live_auction');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider shadow"
                  >
                    Start Bid
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PLAYER MANAGEMENT LIST */}
      {adminTab === 'players' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-sports text-2xl font-bold text-white uppercase">
              REGISTERED PLAYERS ROSTER
            </h3>
            <button
              onClick={() => {
                setEditingPlayerId(null);
                setAdminTab('add_player');
              }}
              className="px-3.5 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Player</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Sold Price</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {players.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <strong className="text-white block">{p.name}</strong>
                        <span className="text-[10px] text-slate-400">{p.city} • Age {p.age}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-semibold">{p.role}</td>
                    <td className="py-3 px-4 font-digital font-bold text-slate-200">{formatINR(p.basePrice)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'sold'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : p.status === 'unsold'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-digital font-bold text-emerald-400">
                      {p.soldPrice ? formatINR(p.soldPrice) : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditPlayer(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                          title="Edit Player"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${p.name}?`)) {
                              deletePlayer(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900 text-red-400"
                          title="Delete Player"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PLAYER ADD / EDIT FORM (Section 11) */}
      {adminTab === 'add_player' && (
        <form onSubmit={handleSavePlayer} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                PLAYER REGISTRATION DESK
              </span>
              <h3 className="font-sports text-3xl font-bold text-white uppercase">
                {editingPlayerId ? 'UPDATE PLAYER PROFILE' : 'REGISTER NEW CRICKET PLAYER'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setAdminTab('players')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel & Return
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Player Name */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Player Name *</label>
              <input
                type="text"
                required
                value={playerForm.name}
                onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                placeholder="e.g. Virat Patel"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Nickname */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Nickname</label>
              <input
                type="text"
                value={playerForm.nickname}
                onChange={(e) => setPlayerForm({ ...playerForm, nickname: e.target.value })}
                placeholder="e.g. King"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Profile Image URL */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Profile Photo URL</label>
              <input
                type="url"
                value={playerForm.image}
                onChange={(e) => setPlayerForm({ ...playerForm, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Player Role *</label>
              <select
                value={playerForm.role}
                onChange={(e) => setPlayerForm({ ...playerForm, role: e.target.value as PlayerRole })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket Keeper">Wicket Keeper</option>
              </select>
            </div>

            {/* Base Price */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Base Price (₹) *</label>
              <input
                type="number"
                required
                step="500"
                min="1000"
                max="100000"
                value={playerForm.basePrice}
                onChange={(e) => setPlayerForm({ ...playerForm, basePrice: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-amber-400 font-digital font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Age */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Age</label>
              <input
                type="number"
                value={playerForm.age}
                onChange={(e) => setPlayerForm({ ...playerForm, age: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Date of Birth</label>
              <input
                type="text"
                value={playerForm.dob}
                onChange={(e) => setPlayerForm({ ...playerForm, dob: e.target.value })}
                placeholder="e.g. 15 Aug 1995"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* City */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">City / Origin</label>
              <input
                type="text"
                value={playerForm.city}
                onChange={(e) => setPlayerForm({ ...playerForm, city: e.target.value })}
                placeholder="e.g. Delhi"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Batting Style */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Batting Style</label>
              <select
                value={playerForm.battingStyle}
                onChange={(e) => setPlayerForm({ ...playerForm, battingStyle: e.target.value as BattingStyle })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
              >
                <option value="Right-hand bat">Right-hand bat</option>
                <option value="Left-hand bat">Left-hand bat</option>
              </select>
            </div>

            {/* Bowling Style */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Bowling Style</label>
              <select
                value={playerForm.bowlingStyle}
                onChange={(e) => setPlayerForm({ ...playerForm, bowlingStyle: e.target.value as BowlingStyle })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
              >
                <option value="Right-arm fast">Right-arm fast</option>
                <option value="Right-arm medium">Right-arm medium</option>
                <option value="Left-arm fast">Left-arm fast</option>
                <option value="Left-arm medium">Left-arm medium</option>
                <option value="Right-arm off-break">Right-arm off-break</option>
                <option value="Right-arm leg-break">Right-arm leg-break</option>
                <option value="Left-arm orthodox">Left-arm orthodox</option>
                <option value="Left-arm chinaman">Left-arm chinaman</option>
                <option value="None">None</option>
              </select>
            </div>

            {/* Career Stats: Matches */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Matches</label>
              <input
                type="number"
                value={playerForm.matches}
                onChange={(e) => setPlayerForm({ ...playerForm, matches: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
              />
            </div>

            {/* Career Stats: Runs */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Total Runs</label>
              <input
                type="number"
                value={playerForm.runs}
                onChange={(e) => setPlayerForm({ ...playerForm, runs: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
              />
            </div>

            {/* Highest Score */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Highest Score</label>
              <input
                type="text"
                value={playerForm.highestScore}
                onChange={(e) => setPlayerForm({ ...playerForm, highestScore: e.target.value })}
                placeholder="e.g. 113*"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
              />
            </div>

            {/* Strike Rate */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Strike Rate</label>
              <input
                type="number"
                step="0.01"
                value={playerForm.strikeRate}
                onChange={(e) => setPlayerForm({ ...playerForm, strikeRate: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
              />
            </div>

            {/* Wickets */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Wickets</label>
              <input
                type="number"
                value={playerForm.wickets}
                onChange={(e) => setPlayerForm({ ...playerForm, wickets: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs text-slate-300 font-bold block mb-1">Player Bio / Summary</label>
            <textarea
              rows={3}
              value={playerForm.bio}
              onChange={(e) => setPlayerForm({ ...playerForm, bio: e.target.value })}
              placeholder="Short description of playing style and achievements..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setAdminTab('players')}
              className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg"
            >
              {editingPlayerId ? 'UPDATE PLAYER' : 'SAVE PLAYER'}
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 4: TEAM MANAGEMENT (Section 12) */}
      {adminTab === 'teams' && (
        <div className="space-y-6">
          {/* Add Team Form */}
          <form onSubmit={handleSaveTeam} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-sports text-2xl font-bold text-white uppercase">
              {editingTeamId ? 'EDIT FRANCHISE' : 'CREATE NEW FRANCHISE'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="e.g. Katasvan Titans"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Team Logo Emoji / Crest</label>
                <input
                  type="text"
                  value={teamForm.logo}
                  onChange={(e) => setTeamForm({ ...teamForm, logo: e.target.value })}
                  placeholder="e.g. 🦁, ⚡, 🐅"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Starting Budget (₹)</label>
                <input
                  type="number"
                  value={teamForm.startingBudget}
                  onChange={(e) => setTeamForm({ ...teamForm, startingBudget: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-amber-400 font-digital font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Owner Name</label>
                <input
                  type="text"
                  value={teamForm.owner}
                  onChange={(e) => setTeamForm({ ...teamForm, owner: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Captain Name</label>
                <input
                  type="text"
                  value={teamForm.captain}
                  onChange={(e) => setTeamForm({ ...teamForm, captain: e.target.value })}
                  placeholder="e.g. Rohit Gamit"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-amber-400 font-bold flex items-center gap-1 mb-1">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Franchise Secret Access PIN *</span>
                </label>
                <input
                  type="text"
                  required
                  value={teamForm.accessPin}
                  onChange={(e) => setTeamForm({ ...teamForm, accessPin: e.target.value })}
                  placeholder="e.g. 1234, 7788"
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-xl p-3 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {editingTeamId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTeamId(null);
                    setTeamForm({ name: '', shortCode: 'NEW', logo: '🏏', color: '#F59E0B', owner: '', captain: '', accessPin: '1234', ownerEmail: '', ownerPhone: '', startingBudget: 100000 });
                  }}
                  className="px-4 py-2 bg-slate-800 text-xs font-bold text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow"
              >
                {editingTeamId ? 'Update Team' : 'Add Team'}
              </button>
            </div>
          </form>

          {/* Teams Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-sports text-2xl font-bold text-white uppercase">
                REGISTERED FRANCHISES
              </h4>
              <span className="text-xs text-slate-400">Total {teams.length} Teams</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Team</th>
                    <th className="py-3 px-4">Owner & Captain</th>
                    <th className="py-3 px-4">Secret Access PIN</th>
                    <th className="py-3 px-4">Starting Budget</th>
                    <th className="py-3 px-4">Spent</th>
                    <th className="py-3 px-4">Remaining</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {teams.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <span className="text-2xl">{t.logo}</span>
                        <div>
                          <strong className="text-white block text-sm">{t.name}</strong>
                          <span className="text-[10px] text-amber-400 font-digital">{t.shortCode}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div>Own: {t.owner}</div>
                        <div className="text-slate-400">Cap: {t.captain}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                            {t.accessPin || '1234'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`Team: ${t.name}\nPIN: ${t.accessPin || '1234'}`);
                              setCopiedTeamId(t.id);
                              setTimeout(() => setCopiedTeamId(null), 2500);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition"
                            title="Copy Team Credentials"
                          >
                            {copiedTeamId === t.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-digital font-bold text-slate-300">{formatINR(t.startingBudget)}</td>
                      <td className="py-3 px-4 font-digital font-bold text-red-400">{formatINR(t.totalSpent)}</td>
                      <td className="py-3 px-4 font-digital font-extrabold text-amber-400">{formatINR(t.remainingBudget)}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTeamId(t.id);
                              setTeamForm({
                                name: t.name,
                                shortCode: t.shortCode,
                                logo: t.logo,
                                color: t.color,
                                owner: t.owner,
                                captain: t.captain,
                                accessPin: t.accessPin || '1234',
                                ownerEmail: t.ownerEmail || '',
                                ownerPhone: t.ownerPhone || '',
                                startingBudget: t.startingBudget,
                              });
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                            title="Edit Team"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${t.name}?`)) {
                                deleteTeam(t.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900 text-red-400"
                            title="Delete Team"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* SUB-TAB 5: SPONSORS & BROADCAST SLIDESHOW MANAGER */}
      {adminTab === 'sponsors' && (
        <div className="space-y-8">
          {/* Top Banner & Live Preview */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  BROADCAST BRANDING & SPONSORSHIPS
                </span>
                <h3 className="font-sports text-2xl sm:text-3xl font-bold text-white uppercase">
                  LIVE AUCTION SPONSOR SLIDESHOW MANAGER
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload and manage sponsor photos, logo banners, taglines, and tier priorities that rotate in real-time during live bidding.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={reseedSponsors}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  title="Reseed standard tournament sponsor graphics"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Sponsors</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Slideshow Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Live Auction Slideshow Preview</span>
                </span>
                <span className="text-[11px] text-slate-400 font-digital">
                  {sponsors.filter(s => s.active).length} Active Sponsors in Queue
                </span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80">
                <SponsorSlideshow variant="broadcast" autoPlayInterval={3500} />
              </div>
            </div>
          </div>

          {/* 2-Column: Left = Add/Edit Form, Right = Sponsor Inventory List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                  {editingSponsorId ? 'EDIT SPONSOR PHOTO' : 'ADD NEW SPONSOR PHOTO'}
                </h4>
                {editingSponsorId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSponsorId(null);
                      setSponsorForm({
                        name: '',
                        tagline: '',
                        tier: 'Title Sponsor',
                        logoUrl: '',
                        bannerUrl: '',
                        website: '',
                        active: true,
                        displayOrder: sponsors.length + 1,
                      });
                    }}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {/* Preset Quick Images */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Quick Preset Brands (Click to autofill)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Tata Motors', tier: 'Title Sponsor' as SponsorTier, tagline: 'Connecting Aspirations & Powering Cricket', logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Dream11', tier: 'Powered By' as SponsorTier, tagline: 'Official Fantasy Sports & Cricket Partner', logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80' },
                    { name: 'JioCinema', tier: 'Digital Media Partner' as SponsorTier, tagline: 'Live Streaming in 4K Ultra HD', logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80' },
                    { name: 'MRF Tyres', tier: 'Associate Sponsor' as SponsorTier, tagline: 'Pace & Performance on Every Pitch', logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80' },
                    { name: 'Red Bull Energy', tier: 'Beverage Partner' as SponsorTier, tagline: 'Gives You Wings on the 22 Yards', logo: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setSponsorForm(prev => ({
                          ...prev,
                          name: preset.name,
                          tier: preset.tier,
                          tagline: preset.tagline,
                          logoUrl: preset.logo,
                        }));
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-[10px] font-semibold border border-slate-800"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!sponsorForm.name.trim()) return;

                  if (editingSponsorId) {
                    updateSponsor(editingSponsorId, sponsorForm);
                    setEditingSponsorId(null);
                  } else {
                    addSponsor(sponsorForm);
                  }

                  // Reset form
                  setSponsorForm({
                    name: '',
                    tagline: '',
                    tier: 'Associate Sponsor',
                    logoUrl: '',
                    bannerUrl: '',
                    website: '',
                    active: true,
                    displayOrder: sponsors.length + 1,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Sponsor / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={sponsorForm.name}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                    placeholder="e.g. Tata Motors, Jio, Dream11"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Tagline / Slogan</label>
                  <input
                    type="text"
                    value={sponsorForm.tagline}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, tagline: e.target.value })}
                    placeholder="e.g. Official Tournament Title Partner"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1">Sponsorship Tier</label>
                    <select
                      value={sponsorForm.tier}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, tier: e.target.value as SponsorTier })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Title Sponsor">Title Sponsor</option>
                      <option value="Powered By">Powered By</option>
                      <option value="Associate Sponsor">Associate Sponsor</option>
                      <option value="Beverage Partner">Beverage Partner</option>
                      <option value="Kit Partner">Kit Partner</option>
                      <option value="Digital Media Partner">Digital Media Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1">Display Order</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={sponsorForm.displayOrder}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, displayOrder: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Photo / Logo Image URL *</label>
                  <input
                    type="url"
                    required
                    value={sponsorForm.logoUrl}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, logoUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Live Image Preview */}
                {sponsorForm.logoUrl && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                    <img
                      src={sponsorForm.logoUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-700 bg-slate-900"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="text-xs">
                      <span className="text-slate-400 block font-bold">Image Preview:</span>
                      <strong className="text-white">{sponsorForm.name || 'Brand Name'}</strong>
                      <span className="text-amber-400 block text-[11px]">{sponsorForm.tier}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Website / Social Link (Optional)</label>
                  <input
                    type="text"
                    value={sponsorForm.website}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, website: e.target.value })}
                    placeholder="https://brand.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="sponsor-active-checkbox"
                    checked={sponsorForm.active}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, active: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                  />
                  <label htmlFor="sponsor-active-checkbox" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Enable in Live Auction Slideshow
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg transition"
                >
                  {editingSponsorId ? '✓ Save Sponsor Changes' : '+ Add Sponsor to Slideshow'}
                </button>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                  SPONSORS IN SLIDESHOW ({sponsors.length})
                </h4>
                <span className="text-xs text-slate-400 font-digital">
                  Auto-rotates during live auction
                </span>
              </div>

              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                {sponsors.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No sponsors configured yet. Click "Reset Default Sponsors" above or add a new sponsor photo.
                  </div>
                ) : (
                  sponsors.map((s, idx) => (
                    <div
                      key={s.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition ${
                        s.active
                          ? 'bg-slate-950/80 border-slate-800 hover:border-amber-500/40'
                          : 'bg-slate-950/30 border-slate-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          #{s.displayOrder || idx + 1}
                        </span>

                        <img
                          src={s.logoUrl}
                          alt={s.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-900 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&auto=format&fit=crop&q=80';
                          }}
                        />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-sports text-lg font-bold text-white truncate">{s.name}</h5>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              s.tier === 'Title Sponsor'
                                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                                : s.tier === 'Powered By'
                                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                                : 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                            }`}>
                              {s.tier}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">{s.tagline}</p>
                          {s.website && (
                            <span className="text-[10px] text-slate-500 block truncate">{s.website}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Toggle Active Button */}
                        <button
                          type="button"
                          onClick={() => updateSponsor(s.id, { active: !s.active })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                            s.active
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {s.active ? 'Active' : 'Hidden'}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSponsorId(s.id);
                            setSponsorForm({
                              name: s.name,
                              tagline: s.tagline,
                              tier: s.tier,
                              logoUrl: s.logoUrl,
                              bannerUrl: s.bannerUrl || '',
                              website: s.website || '',
                              active: s.active,
                              displayOrder: s.displayOrder || idx + 1,
                            });
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                          title="Edit Sponsor"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete sponsor "${s.name}"?`)) {
                              deleteSponsor(s.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400"
                          title="Delete Sponsor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

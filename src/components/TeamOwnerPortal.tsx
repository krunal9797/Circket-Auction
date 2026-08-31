import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  KeyRound, 
  Users, 
  DollarSign, 
  Gavel, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  LogOut, 
  Flame, 
  TrendingUp, 
  Briefcase, 
  UserCheck, 
  Clock, 
  Eye, 
  EyeOff, 
  Award, 
  FileText,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { Team, Player } from '../types';

export const TeamOwnerPortal: React.FC = () => {
  const { 
    teams, 
    players,
    authenticatedTeamId, 
    authenticatedTeam, 
    loginTeamOwner, 
    logoutTeamOwner, 
    auctionState, 
    activePlayer, 
    placeBid, 
    placeCustomBid,
    setCurrentTab,
    viewPlayerDetails
  } = useAuction();

  // Login form state
  const [selectedTeamForLogin, setSelectedTeamForLogin] = useState<string>(teams[0]?.id || '');
  const [pinInput, setPinInput] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Custom bid input in war room
  const [customBidAmount, setCustomBidAmount] = useState<string>('');
  const [bidFeedback, setBidFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Squad view filter
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!selectedTeamForLogin) {
      setErrorMessage('Please choose your franchise.');
      setIsSubmitting(false);
      return;
    }

    if (!pinInput.trim()) {
      setErrorMessage('Please enter your 4-digit franchise Security PIN.');
      setIsSubmitting(false);
      return;
    }

    const result = loginTeamOwner(selectedTeamForLogin, pinInput);
    if (result.success) {
      setSuccessMessage(result.message);
      setPinInput('');
    } else {
      setErrorMessage(result.message);
    }
    setIsSubmitting(false);
  };

  const handlePlaceIncrementBid = async (increment: number) => {
    if (!authenticatedTeam) return;
    setBidFeedback(null);
    const res = await placeBid(authenticatedTeam.id, increment);
    if (res.success) {
      setBidFeedback({ type: 'success', message: res.message });
    } else {
      setBidFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setBidFeedback(null), 5000);
  };

  const handlePlaceCustomBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatedTeam) return;
    const amount = parseInt(customBidAmount.replace(/\D/g, ''), 10);
    if (isNaN(amount) || amount <= 0) {
      setBidFeedback({ type: 'error', message: 'Please enter a valid numeric bid amount.' });
      return;
    }

    if (amount > authenticatedTeam.remainingBudget) {
      setBidFeedback({ 
        type: 'error', 
        message: `Insufficient Purse: Bid of ${formatINR(amount)} exceeds ${authenticatedTeam.name}'s remaining purse of ${formatINR(authenticatedTeam.remainingBudget)}.` 
      });
      return;
    }

    setBidFeedback(null);
    const res = await placeCustomBid(authenticatedTeam.id, amount);
    if (res.success) {
      setBidFeedback({ type: 'success', message: res.message });
      setCustomBidAmount('');
    } else {
      setBidFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setBidFeedback(null), 5000);
  };

  // If no team is authenticated, display the Luxury Secure Authentication Portal
  if (!authenticatedTeam || !authenticatedTeamId) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>KPL 2026 FRANCHISE WAR ROOM ACCESS</span>
          </div>
          <h1 className="font-sports text-4xl sm:text-5xl font-black text-white tracking-wide uppercase">
            Team Owner <span className="text-amber-400">Secure Portal</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Authenticate to access your franchise war room, monitor real-time purse balance, and submit live bids securely restricted to your team.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {teams.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Teams Registered Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No franchises exist in the database. Please go to the Admin Desk to add teams or initialize tournament data.
              </p>
              <button
                onClick={() => setCurrentTab('admin')}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition"
              >
                Go to Admin Desk
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              {/* Franchise Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                  <span>Select Your Franchise</span>
                  <span className="text-[11px] text-amber-400 font-semibold">{teams.length} Teams Available</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {teams.map((t) => {
                    const isSelected = (selectedTeamForLogin || teams[0]?.id) === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTeamForLogin(t.id)}
                        className={`p-4 rounded-2xl border text-left transition relative flex items-center gap-3 ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border"
                          style={{ backgroundColor: `${t.color}25`, borderColor: t.color }}
                        >
                          {t.logo || '🏏'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-sports font-bold text-sm text-white truncate">{t.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 block truncate">Owner: {t.owner}</span>
                          <span className="text-[10px] text-amber-400 font-semibold font-digital">
                            Purse: {formatINR(t.remainingBudget)}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Security PIN input */}
              <div className="max-w-md mx-auto pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Franchise Security PIN / Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter 4-digit PIN (e.g. 1234)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-12 py-3.5 text-white font-mono tracking-widest text-center text-lg placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                  <span>Default PIN: <strong className="text-amber-400">1234</strong> (or Admin configured)</span>
                  <span className="text-slate-500">Encrypted session</span>
                </div>
              </div>

              {/* Error/Success alerts */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 max-w-md mx-auto">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 max-w-md mx-auto">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="max-w-md mx-auto pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-[0.99]"
                >
                  <Lock className="w-4 h-4" />
                  <span>Unlock War Room Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Security Note Footer */}
              <div className="text-center pt-4 border-t border-slate-800/80 text-xs text-slate-500 space-y-1">
                <p className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>KPL Official War Room Security Protocol</span>
                </p>
                <p className="text-[11px]">
                  Team owners can only place bids on behalf of their authenticated franchise. Multi-franchise bidding spoofing is strictly prevented.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // TEAM OWNER IS AUTHENTICATED -> RENDER THE DEDICATED TEAM WAR ROOM DASHBOARD
  const squadPlayers = players.filter(p => authenticatedTeam.squadPlayerIds?.includes(p.id));
  const filteredSquad = roleFilter === 'all' 
    ? squadPlayers 
    : squadPlayers.filter(p => p.role.toLowerCase() === roleFilter.toLowerCase());

  // Role counts
  const batsmenCount = squadPlayers.filter(p => p.role === 'Batsman').length;
  const bowlersCount = squadPlayers.filter(p => p.role === 'Bowler').length;
  const allRoundersCount = squadPlayers.filter(p => p.role === 'All-Rounder').length;
  const wkCount = squadPlayers.filter(p => p.role === 'Wicket Keeper').length;

  const spentPercentage = Math.round((authenticatedTeam.totalSpent / authenticatedTeam.startingBudget) * 100) || 0;
  const isHighestBidder = auctionState.highestBidderTeamId === authenticatedTeam.id;
  const nextMinBid = auctionState.highestBidderTeamId === null
    ? (auctionState.currentBid > 0 ? auctionState.currentBid : (activePlayer?.basePrice || 5000))
    : auctionState.currentBid + 1000;

  return (
    <div className="space-y-8 pb-16">
      {/* War Room Header & Authentication Status Bar */}
      <div className="bg-slate-900 border-2 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        style={{ borderColor: authenticatedTeam.color || '#f59e0b' }}
      >
        <div 
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: authenticatedTeam.color || '#f59e0b' }}
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl border-2 shadow-2xl flex-shrink-0"
              style={{ 
                backgroundColor: `${authenticatedTeam.color}30`, 
                borderColor: authenticatedTeam.color 
              }}
            >
              {authenticatedTeam.logo || '🏏'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  AUTHENTICATED WAR ROOM
                </span>
                <span className="text-xs text-slate-400 font-mono">[{authenticatedTeam.shortCode}]</span>
              </div>
              <h1 className="font-sports text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-wide">
                {authenticatedTeam.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span>Owner: <strong className="text-amber-400">{authenticatedTeam.owner}</strong></span>
                <span>•</span>
                <span>Captain: <strong className="text-white">{authenticatedTeam.captain}</strong></span>
                <span>•</span>
                <span>Squad: <strong className="text-white">{authenticatedTeam.playersBought} Players</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setCurrentTab('live_auction')}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Gavel className="w-4 h-4" />
              <span>Full Auction Arena</span>
            </button>
            <button
              onClick={logoutTeamOwner}
              className="px-4 py-2.5 bg-slate-800 hover:bg-red-500/20 hover:border-red-500/40 border border-slate-700 text-slate-300 hover:text-red-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit War Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Health & Purse Allocation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Remaining Purse Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-bold mb-2">
            <span>Remaining Purse</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-digital text-3xl sm:text-4xl font-black text-emerald-400">
            {formatINR(authenticatedTeam.remainingBudget)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Starting: {formatINR(authenticatedTeam.startingBudget)}
          </p>
          <div className="w-full bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${100 - spentPercentage}%` }}
            />
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-bold mb-2">
            <span>Total Spent</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-digital text-3xl sm:text-4xl font-black text-amber-400">
            {formatINR(authenticatedTeam.totalSpent)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {spentPercentage}% of total purse utilized
          </p>
          <div className="w-full bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${spentPercentage}%` }}
            />
          </div>
        </div>

        {/* Squad Count */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-bold mb-2">
            <span>Players Acquired</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-sports text-3xl sm:text-4xl font-black text-white">
            {authenticatedTeam.playersBought} <span className="text-xs text-slate-400 font-sans font-normal">Players</span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-300 font-bold">
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">BAT: {batsmenCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">BOWL: {bowlersCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">AR: {allRoundersCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">WK: {wkCount}</span>
          </div>
        </div>

        {/* Average Acquisition Price */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-bold mb-2">
            <span>Avg. Cost / Player</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-digital text-3xl sm:text-4xl font-black text-purple-300">
            {authenticatedTeam.playersBought > 0 
              ? formatINR(Math.round(authenticatedTeam.totalSpent / authenticatedTeam.playersBought))
              : '₹0'}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Estimated Max Single Bid: <strong className="text-amber-400">{formatINR(authenticatedTeam.remainingBudget)}</strong>
          </p>
        </div>
      </div>

      {/* DEDICATED TEAM-LOCKED LIVE BIDDING CONSOLE */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                EXCLUSIVE FRANCHISE BIDDING CONSOLE
              </span>
            </div>
            <h2 className="font-sports text-2xl sm:text-3xl font-black text-white uppercase">
              Live Auction Hammer Desk
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Bids locked strictly to: <strong className="text-white">{authenticatedTeam.shortCode}</strong></span>
            </div>
          </div>
        </div>

        {/* Active Lot Status */}
        {auctionState.isLive && activePlayer ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Player Info Box */}
            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
              <img
                src={activePlayer.photo}
                alt={activePlayer.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover border-2 border-amber-500/50 shadow-md"
              />
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                  {activePlayer.role} • {activePlayer.category}
                </span>
                <h3 className="font-sports text-2xl font-bold text-white uppercase truncate">
                  {activePlayer.name}
                </h3>
                <p className="text-xs text-slate-400">{activePlayer.battingStyle} | {activePlayer.bowlingStyle}</p>
                <p className="text-xs font-digital text-amber-400 font-bold">
                  Base: {formatINR(activePlayer.basePrice)}
                </p>
              </div>
            </div>

            {/* Current Bid Display */}
            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center space-y-2">
              <span className="text-xs text-slate-400 uppercase font-bold block">Current Hammer Bid</span>
              <div className="font-digital text-4xl sm:text-5xl font-black text-amber-400">
                {formatINR(auctionState.currentBid || activePlayer.basePrice)}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="text-slate-400">Leading Franchise:</span>
                {auctionState.highestBidderTeamName ? (
                  <span className={`font-bold ${isHighestBidder ? 'text-emerald-400' : 'text-white'}`}>
                    {auctionState.highestBidderTeamName} {isHighestBidder && '(YOU! 👑)'}
                  </span>
                ) : (
                  <span className="text-slate-500 italic">No bids yet</span>
                )}
              </div>
            </div>

            {/* Bidding Status Indicator */}
            <div className="lg:col-span-4 space-y-3">
              {isHighestBidder ? (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/80 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-sm uppercase">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>You Hold The Winning Bid!</span>
                  </div>
                  <p className="text-[11px] text-emerald-300">
                    Waiting for timer countdown or rival franchise raises.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm uppercase">
                    <Flame className="w-4 h-4" />
                    <span>Raise Bid for {authenticatedTeam.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Next minimum bid: <strong className="text-white font-digital">{formatINR(nextMinBid)}</strong>
                  </p>
                </div>
              )}

              {/* Countdown Timer */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Hammer Countdown:
                </span>
                <span className="font-digital text-lg font-black text-amber-400">
                  {auctionState.timerSeconds}s
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
            <Gavel className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Active Lot in Auction</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              The auctioneer has not started bidding on a player. Stand by for the next lot to be presented on the hammer.
            </p>
          </div>
        )}

        {/* Live Bidding Buttons - Strictly Executed for Authenticated Team */}
        {auctionState.isLive && activePlayer && (
          <div className="space-y-4 pt-2">
            {bidFeedback && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                bidFeedback.type === 'success' 
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' 
                  : 'bg-red-500/20 border border-red-500/50 text-red-300'
              }`}>
                {bidFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{bidFeedback.message}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1000, 2000, 5000, 10000].map((inc) => {
                const projectedBid = auctionState.highestBidderTeamId === null
                  ? (auctionState.currentBid > 0 ? auctionState.currentBid : (activePlayer?.basePrice || 5000))
                  : (auctionState.currentBid + inc);
                const isAffordable = projectedBid <= authenticatedTeam.remainingBudget;
                const isDisabled = isHighestBidder || !isAffordable;

                return (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => handlePlaceIncrementBid(inc)}
                    disabled={isDisabled}
                    className={`py-3.5 px-4 rounded-xl border font-black text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition active:scale-95 ${
                      isDisabled
                        ? 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white cursor-pointer'
                    }`}
                    title={
                      isHighestBidder
                        ? 'You are already leading the bidding!'
                        : !isAffordable
                        ? `Exceeds your remaining purse of ${formatINR(authenticatedTeam.remainingBudget)}`
                        : `Bid ${formatINR(projectedBid)}`
                    }
                  >
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ {formatINR(inc)}</span>
                    </div>
                    <span className="text-[10px] font-digital font-normal opacity-75">
                      {isHighestBidder ? 'Leading' : !isAffordable ? 'Over Budget' : formatINR(projectedBid)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Big Primary Place Bid Button */}
            {(() => {
              const primaryProjectedBid = nextMinBid;
              const isAffordable = primaryProjectedBid <= authenticatedTeam.remainingBudget;
              const isDisabled = isHighestBidder || !isAffordable;

              return (
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handlePlaceIncrementBid(1000)}
                    disabled={isDisabled}
                    className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 transition active:scale-[0.99] ${
                      isHighestBidder
                        ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 cursor-default shadow-none'
                        : !isAffordable
                        ? 'bg-slate-900 border-2 border-red-500/40 text-red-400 opacity-60 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black shadow-amber-500/30 cursor-pointer'
                    }`}
                  >
                    <Gavel className="w-5 h-5" />
                    <span>
                      {isHighestBidder 
                        ? `👑 You Are Leading at ${formatINR(auctionState.currentBid)}` 
                        : !isAffordable
                        ? `⚠️ Insufficient Purse for ${formatINR(primaryProjectedBid)}`
                        : `Bid ${formatINR(primaryProjectedBid)} as ${authenticatedTeam.name}`}
                    </span>
                  </button>
                  {!isAffordable && !isHighestBidder && (
                    <p className="text-[11px] text-red-400 text-center font-medium">
                      Cannot place bid: Minimum next bid of {formatINR(primaryProjectedBid)} exceeds your available purse of {formatINR(authenticatedTeam.remainingBudget)}.
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Custom Bid Input Form */}
            <form onSubmit={handlePlaceCustomBid} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative flex-1 w-full">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  value={customBidAmount}
                  onChange={(e) => setCustomBidAmount(e.target.value)}
                  placeholder={`Custom Bid Amount (Min > ${formatINR(auctionState.currentBid || 0)})`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-xl transition border border-slate-700 whitespace-nowrap"
              >
                Submit Custom Bid
              </button>
            </form>
          </div>
        )}
      </div>

      {/* SQUAD ACQUISITION ROSTER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-sports text-2xl font-black text-white uppercase tracking-wide">
              {authenticatedTeam.name} • Official Squad ({squadPlayers.length})
            </h2>
            <p className="text-xs text-slate-400">
              Complete roster of players acquired in the KPL 2026 Live Auction.
            </p>
          </div>

          {/* Role Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['all', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  roleFilter === r 
                    ? 'bg-amber-500 text-black' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {filteredSquad.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Players Bought in this Category</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {squadPlayers.length === 0 
                ? 'Your franchise has not acquired any players yet. Bid actively in the live auction arena!'
                : 'No players match the selected role filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSquad.map((player) => (
              <div
                key={player.id}
                onClick={() => viewPlayerDetails(player.id)}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition group cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={player.photo}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700 group-hover:scale-105 transition"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {player.role}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">#{player.jerseyNumber || '🏏'}</span>
                    </div>
                    <h4 className="font-sports text-lg font-bold text-white uppercase truncate group-hover:text-amber-400 transition">
                      {player.name}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                      <span>{player.city}</span>
                      <span className="font-digital text-emerald-400 font-bold">
                        {formatINR(player.soldPrice || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STRATEGIC DRAFT WISHLIST / TARGET NOTES */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <h3 className="font-sports text-xl font-black text-white uppercase flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              <span>Franchise Draft Radar & Available Pool</span>
            </h3>
            <p className="text-xs text-slate-400">
              Browse upcoming available players in the auction pool to plan your purse bidding strategy.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('players')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition"
          >
            View Full Database
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {players.filter(p => p.status === 'available').slice(0, 8).map((p) => (
            <div
              key={p.id}
              onClick={() => viewPlayerDetails(p.id)}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition text-xs space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <img 
                  src={p.photo} 
                  alt={p.name} 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover" 
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-amber-400">{p.role}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900 text-slate-400 font-digital">
                <span>Base Price:</span>
                <span className="text-white font-bold">{formatINR(p.basePrice)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

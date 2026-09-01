import React, { useState } from 'react';
import { 
  Gavel, 
  Clock, 
  Trophy, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Bot, 
  Volume2, 
  VolumeX, 
  AlertCircle,
  Lock,
  KeyRound
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatINR, formatTimer } from '../utils/formatters';
import { SponsorSlideshow } from './SponsorSlideshow';

export const LiveAuctionPage: React.FC = () => {
  const {
    players,
    teams,
    auctionState,
    activePlayer,
    activeBiddingTeamId,
    setActiveBiddingTeamId,
    authenticatedTeamId,
    authenticatedTeam,
    placeBid,
    placeCustomBid,
    pauseAuction,
    resumeAuction,
    markCurrentPlayerSold,
    markCurrentPlayerUnsold,
    nextPlayerInQueue,
    startAuctionForPlayer,
    resetTimer,
    toggleAutoAiBidding,
    viewPlayerDetails,
    setCurrentTab
  } = useAuction();

  const [customBidAmount, setCustomBidAmount] = useState<string>('');
  const [bidNotification, setBidNotification] = useState<{ text: string; isError: boolean } | null>(null);

  const effectiveBiddingTeamId = authenticatedTeamId || activeBiddingTeamId;
  const activeTeam = teams.find(t => t.id === effectiveBiddingTeamId) || teams[0];
  const highestBidderTeam = teams.find(t => t.id === auctionState.highestBidderTeamId);

  const availablePlayers = players.filter(p => p.status === 'available');

  const showNotification = (text: string, isError: boolean = false) => {
    setBidNotification({ text, isError });
    setTimeout(() => {
      setBidNotification(null);
    }, 4000);
  };

  const handleIncrementBid = async (increment: number) => {
    if (!activePlayer) return;
    const res = await placeBid(effectiveBiddingTeamId, increment);
    showNotification(res.message, !res.success);
  };

  const handleCustomBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customBidAmount.replace(/\D/g, ''), 10);
    if (isNaN(parsed) || parsed <= 0) {
      showNotification('Please enter a valid bid amount', true);
      return;
    }
    const res = await placeCustomBid(effectiveBiddingTeamId, parsed);
    showNotification(res.message, !res.success);
    if (res.success) {
      setCustomBidAmount('');
    }
  };

  // Determine dynamic broadcast caption
  const getBroadcastCaption = () => {
    if (!activePlayer) return 'Select a player to begin live bidding!';
    if (auctionState.phase === 'sold') {
      return `SOLD! 🔨 Welcome to ${highestBidderTeam?.name || 'the Team'}!`;
    }
    if (auctionState.phase === 'unsold') {
      return 'No Winning Bid — Player Goes Unsold.';
    }
    if (auctionState.currentBid > (activePlayer.basePrice * 2.5)) {
      return '🔥 The Battle Is Heating Up! Skyrocketing Bids!';
    }
    if (auctionState.bids.length > 0) {
      return '⚡ The Bid Is LIVE! Teams are competing!';
    }
    return 'Next Superstar Up for Auction 🔥 Place the opening bid!';
  };

  // Timer color calculation
  const isTimerCritical = auctionState.timerSeconds <= 5 && auctionState.isLive;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Broadcast Headline Ticker */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
              LIVE BROADCAST FEED
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white font-sports tracking-wider text-xl uppercase">
              {getBroadcastCaption()}
            </h2>
          </div>
        </div>

        {/* Live Controls Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Simulation Toggle */}
          <button
            id="btn-toggle-ai-bid"
            onClick={toggleAutoAiBidding}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              auctionState.autoAiBidding
                ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="When active, competing AI teams place organic bids automatically"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>AI Bidding: {auctionState.autoAiBidding ? 'ON' : 'OFF'}</span>
          </button>

          {/* Pause / Resume Button */}
          {auctionState.isLive && (
            <button
              id="btn-pause-resume-auction"
              onClick={auctionState.isPaused ? resumeAuction : pauseAuction}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5"
            >
              {auctionState.isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause</span>
                </>
              )}
            </button>
          )}

          {/* Reset Timer */}
          {auctionState.isLive && (
            <button
              id="btn-reset-timer-live"
              onClick={() => resetTimer(20)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5"
              title="Reset timer to 20 seconds"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
              <span>+20s</span>
            </button>
          )}

          {/* Next Player */}
          <button
            id="btn-next-player-queue"
            onClick={nextPlayerInQueue}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 shadow"
          >
            <span>Next Player</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notifications Toast */}
      {bidNotification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-3 text-sm font-semibold shadow-lg transition-all animate-bounce ${
            bidNotification.isError
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
          }`}
        >
          {bidNotification.isError ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{bidNotification.text}</span>
        </div>
      )}

      {/* Live Auction Sponsor Ticker */}
      <SponsorSlideshow variant="ticker" autoPlayInterval={4000} className="rounded-xl shadow-md" />

      {/* NO ACTIVE PLAYER IN AUCTION - SELECTOR HERO */}
      {!activePlayer ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center space-y-6">
          {/* Active Sponsor Slideshow Banner during Standby */}
          <div className="max-w-4xl mx-auto text-left">
            <SponsorSlideshow variant="banner" autoPlayInterval={4000} />
          </div>

          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🏏
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-sports text-3xl sm:text-4xl font-bold text-white tracking-wide">
              NO PLAYER ON THE HAMMER
            </h3>
            <p className="text-sm text-slate-400">
              Select an available cricket player from the draft pool below to initiate the live IPL bidding auction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4 text-left">
            {availablePlayers.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{p.name}</h4>
                    <span className="text-[11px] text-amber-400 block font-semibold">{p.role}</span>
                    <span className="text-[10px] text-slate-400">Base: {formatINR(p.basePrice)}</span>
                  </div>
                </div>
                <button
                  onClick={() => startAuctionForPlayer(p.id)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider"
                >
                  Auction
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentTab('players')}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            Or Browse Complete Player Database ({availablePlayers.length} available) →
          </button>
        </div>
      ) : (
        /* ACTIVE PLAYER AUCTION GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: LARGE PLAYER AUCTION CARD */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
              {/* Sold / Unsold Banner Overlay */}
              {auctionState.phase === 'sold' && (
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 p-4 text-center text-black font-extrabold shadow-lg flex items-center justify-center gap-3">
                  <span className="text-2xl">🔨</span>
                  <div className="font-sports text-2xl sm:text-3xl tracking-wider uppercase">
                    SOLD TO {highestBidderTeam?.name?.toUpperCase() || 'WINNING TEAM'} FOR {formatINR(auctionState.currentBid)}!
                  </div>
                </div>
              )}

              {auctionState.phase === 'unsold' && (
                <div className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 p-4 text-center text-white font-extrabold shadow-lg flex items-center justify-center gap-3">
                  <span className="text-2xl">❌</span>
                  <div className="font-sports text-2xl sm:text-3xl tracking-wider uppercase">
                    PLAYER UNSOLD — NO BIDS MET BASE PRICE
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-6 sm:p-8">
                {/* Large Player Image */}
                <div className="sm:col-span-5 relative">
                  <div className="relative h-72 sm:h-full min-h-[280px] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner group">
                    <img
                      src={activePlayer.image}
                      alt={activePlayer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                    {/* Role Badge */}
                    <div className="absolute top-3 left-3 bg-amber-500 text-black font-black text-xs px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                      {activePlayer.role}
                    </div>

                    {/* Age / City Tag */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] text-slate-300 font-medium">{activePlayer.city}</span>
                      <div className="text-xs text-amber-400 font-semibold font-digital">Age: {activePlayer.age} Years</div>
                    </div>
                  </div>
                </div>

                {/* Player Information Details */}
                <div className="sm:col-span-7 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
                        Draft Lot #{activePlayer.id.replace('p-', '')}
                      </span>
                      <button
                        onClick={() => viewPlayerDetails(activePlayer.id)}
                        className="text-xs text-slate-400 hover:text-amber-400 font-medium transition"
                      >
                        Full Profile ↗
                      </button>
                    </div>

                    <h1 className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide mt-1">
                      {activePlayer.name}
                    </h1>
                    <p className="text-xs text-slate-400 italic -mt-1 font-medium">
                      “{activePlayer.nickname}”
                    </p>

                    {/* Style Badges */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Batting Style</span>
                        <strong className="text-slate-200">{activePlayer.battingStyle}</strong>
                      </div>
                      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Bowling Style</span>
                        <strong className="text-slate-200">{activePlayer.bowlingStyle}</strong>
                      </div>
                    </div>

                    {/* Bio Summary */}
                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {activePlayer.bio}
                    </p>
                  </div>

                  {/* Base Price Strip */}
                  <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Base Price:</span>
                    <span className="text-lg font-extrabold text-amber-400 font-digital">
                      {formatINR(activePlayer.basePrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* PLAYER STATISTICS SECTION */}
              <div className="bg-slate-950/90 border-t border-slate-800 p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>CAREER T20 STATISTICS</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Official Tournament Record</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-center">
                  <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Matches</span>
                    <strong className="text-base font-bold text-white font-digital">{activePlayer.stats.matches}</strong>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Runs</span>
                    <strong className="text-base font-bold text-amber-400 font-digital">{activePlayer.stats.runs}</strong>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Wickets</span>
                    <strong className="text-base font-bold text-emerald-400 font-digital">{activePlayer.stats.wickets}</strong>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Strike Rate</span>
                    <strong className="text-base font-bold text-cyan-400 font-digital">{activePlayer.stats.strikeRate}</strong>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Economy</span>
                    <strong className="text-base font-bold text-purple-400 font-digital">{activePlayer.stats.economy || 'N/A'}</strong>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Best Score</span>
                    <strong className="text-base font-bold text-yellow-300 font-digital">{activePlayer.stats.highestScore}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Sponsor Banner Slideshow running during auction */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>KPL LIVE SPONSOR SPOTLIGHT</span>
                </span>
                <span className="text-[10px] text-slate-400">Rotating Partner Showcase</span>
              </div>
              <SponsorSlideshow variant="banner" autoPlayInterval={4500} />
            </div>
          </div>

          {/* RIGHT: AUCTION BIDDING ARENA */}
          <div className="lg:col-span-5 space-y-6">
            {/* MAIN BIDDING STATUS CARD */}
            <div className="bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden animate-glow-gold">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none" />

              {/* Countdown Timer Display */}
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Clock className={`w-6 h-6 ${isTimerCritical ? 'text-red-500 animate-spin' : 'text-amber-400'}`} />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AUCTION TIMER</span>
                    <span className="text-xs text-slate-300 font-medium">Auto-hammer at 00:00</span>
                  </div>
                </div>
                
                {/* Big Animated Digital Timer */}
                <div
                  className={`font-digital text-4xl sm:text-5xl font-black px-4 py-1.5 rounded-xl border tracking-widest ${
                    isTimerCritical
                      ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
                      : 'bg-slate-900 border-amber-500/50 text-amber-400'
                  }`}
                >
                  {formatTimer(auctionState.timerSeconds)}
                </div>
              </div>

              {/* Current Bid & Highest Bidder Header */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/90 p-5 rounded-2xl border border-slate-800/90">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
                    CURRENT BID
                  </span>
                  <div className="font-digital text-3xl sm:text-4xl font-extrabold text-amber-400 mt-1">
                    {formatINR(auctionState.currentBid)}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Base: {formatINR(activePlayer.basePrice)}
                  </span>
                </div>

                <div className="border-l border-slate-800 pl-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
                      HIGHEST BIDDER
                    </span>
                    <div className="font-sports text-2xl sm:text-3xl font-bold text-white mt-0.5 truncate flex items-center gap-1.5">
                      {highestBidderTeam ? (
                        <>
                          <span>{highestBidderTeam.logo}</span>
                          <span className="text-amber-300 truncate">{highestBidderTeam.name}</span>
                        </>
                      ) : (
                        <span className="text-slate-400 text-lg">No Bids Yet</span>
                      )}
                    </div>
                  </div>
                  {highestBidderTeam && (
                    <span className="text-[11px] text-slate-400">
                      Purse Left: <strong className="text-emerald-400 font-digital">{formatINR(highestBidderTeam.remainingBudget - auctionState.currentBid)}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* ACTIVE BIDDER TEAM SELECTOR / AUTHENTICATED FRANCHISE LOCK */}
              {authenticatedTeam ? (
                <div className="bg-amber-500/10 border-2 border-amber-500/50 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      AUTHENTICATED WAR ROOM LOCK
                    </span>
                    <button
                      onClick={() => setCurrentTab('team_portal')}
                      className="text-[11px] text-amber-400 hover:underline font-bold"
                    >
                      Open War Room ↗
                    </button>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/20">
                    <span className="text-2xl">{authenticatedTeam.logo || '🏏'}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sports font-bold text-white text-base truncate">{authenticatedTeam.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">Owner: {authenticatedTeam.owner}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Remaining Purse</span>
                      <span className="font-digital text-amber-400 font-bold text-sm">
                        {formatINR(authenticatedTeam.remainingBudget)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    🔒 All bids placed from this console are strictly submitted on behalf of <strong>{authenticatedTeam.name}</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Place Bid As:
                    </span>
                    <span className="text-slate-400">
                      Remaining Purse: <strong className="text-amber-400 font-digital">{formatINR(activeTeam.remainingBudget)}</strong>
                    </span>
                  </div>
                  <select
                    id="live-auction-team-selector"
                    value={activeBiddingTeamId}
                    onChange={(e) => setActiveBiddingTeamId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white font-bold text-sm rounded-xl p-3 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                        {t.name} • Purse: {formatINR(t.remainingBudget)} • Players: {t.playersBought}
                      </option>
                    ))}
                  </select>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Franchise Owner?</span>
                    <button
                      onClick={() => setCurrentTab('team_portal')}
                      className="text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Login to Team War Room</span>
                    </button>
                  </div>
                </div>
              )}

              {/* QUICK BID INCREMENT BUTTONS */}
              {auctionState.phase === 'bidding' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold uppercase tracking-wider">QUICK BID INCREMENTS</span>
                    <span className="text-[11px] text-amber-400">
                      Purse: <strong>{formatINR(activeTeam.remainingBudget)}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[1000, 2000, 5000, 10000].map((inc) => {
                      const projectedBid = auctionState.highestBidderTeamId === null
                        ? (auctionState.currentBid > 0 ? auctionState.currentBid : (activePlayer?.basePrice || 5000))
                        : (auctionState.currentBid + inc);
                      const isAffordable = projectedBid <= activeTeam.remainingBudget;
                      const isLeading = auctionState.highestBidderTeamId === activeTeam.id;
                      const isDisabled = !isAffordable || isLeading;

                      return (
                        <button
                          key={inc}
                          id={`btn-bid-plus-${inc}`}
                          type="button"
                          onClick={() => handleIncrementBid(inc)}
                          disabled={isDisabled}
                          className={`py-3 rounded-xl border font-digital font-extrabold text-sm sm:text-base transition active:scale-95 shadow flex flex-col items-center justify-center relative ${
                            isDisabled
                              ? 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                              : 'bg-slate-800 hover:bg-amber-500/20 border-slate-700 hover:border-amber-400 text-white hover:text-amber-400 cursor-pointer'
                          }`}
                          title={
                            isLeading
                              ? `${activeTeam.name} is already leading!`
                              : !isAffordable
                              ? `Exceeds remaining purse (${formatINR(activeTeam.remainingBudget)})`
                              : `Bid ${formatINR(projectedBid)}`
                          }
                        >
                          <span>+{formatINR(inc)}</span>
                          <span className="text-[9px] font-sans font-normal opacity-75">
                            {isLeading ? 'Leading' : !isAffordable ? 'Over Budget' : formatINR(projectedBid)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Main Large PLACE BID Button */}
                  {(() => {
                    const mainInc = auctionState.currentBid > 25000 ? 5000 : 2000;
                    const mainProjectedBid = auctionState.highestBidderTeamId === null
                      ? (auctionState.currentBid > 0 ? auctionState.currentBid : (activePlayer?.basePrice || 5000))
                      : (auctionState.currentBid + mainInc);
                    const canAffordMainBid = mainProjectedBid <= activeTeam.remainingBudget;
                    const isAlreadyWinning = auctionState.highestBidderTeamId === activeTeam.id;

                    return (
                      <div className="space-y-1.5 mt-2">
                        <button
                          id="btn-place-main-bid"
                          type="button"
                          onClick={() => handleIncrementBid(mainInc)}
                          disabled={!canAffordMainBid || isAlreadyWinning}
                          className={`w-full py-4 rounded-2xl font-extrabold text-lg sm:text-xl font-sports tracking-wider uppercase shadow-xl transition flex items-center justify-center gap-2 ${
                            isAlreadyWinning
                              ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 cursor-default shadow-none'
                              : !canAffordMainBid
                              ? 'bg-slate-900 border-2 border-red-500/40 text-red-400 opacity-60 cursor-not-allowed shadow-none'
                              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-amber-500/25 active:scale-98 cursor-pointer'
                          }`}
                        >
                          <Gavel className="w-6 h-6" />
                          {isAlreadyWinning ? (
                            <span>👑 {activeTeam.name} IS CURRENT LEADER • {formatINR(auctionState.currentBid)}</span>
                          ) : !canAffordMainBid ? (
                            <span>⚠️ INSUFFICIENT PURSE FOR {formatINR(mainProjectedBid)}</span>
                          ) : (
                            <span>PLACE BID • {formatINR(mainProjectedBid)}</span>
                          )}
                        </button>
                        {!canAffordMainBid && !isAlreadyWinning && (
                          <p className="text-[11px] text-red-400 text-center font-medium">
                            Cannot place bid: Next bid of {formatINR(mainProjectedBid)} exceeds {activeTeam.name}'s remaining purse of {formatINR(activeTeam.remainingBudget)}.
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  {/* Custom Bid Input */}
                  <form onSubmit={handleCustomBidSubmit} className="flex gap-2 pt-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        id="input-custom-bid-amount"
                        placeholder="Enter custom amount..."
                        value={customBidAmount || ''}
                        onChange={(e) => setCustomBidAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white font-digital font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      type="submit"
                      id="btn-submit-custom-bid"
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 border border-slate-700 whitespace-nowrap"
                    >
                      Custom Bid
                    </button>
                  </form>
                </div>
              ) : (
                /* AUCTION RESOLUTION ACTIONS (SOLD / UNSOLD STATE) */
                <div className="space-y-4 pt-2">
                  <div className="text-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Lot Status</span>
                    <h3 className="font-sports text-3xl font-bold uppercase text-white">
                      {auctionState.phase === 'sold' ? '🔨 SOLD OUT' : '❌ UNSOLD'}
                    </h3>
                  </div>

                  <button
                    id="btn-next-player-after-sold"
                    onClick={nextPlayerInQueue}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-lg uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Bring Next Player to Hammer</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Auctioneer Quick Force Hammer Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold uppercase">Auctioneer Desk:</span>
                <div className="flex gap-2">
                  <button
                    id="btn-force-sold"
                    onClick={() => markCurrentPlayerSold()}
                    disabled={!auctionState.highestBidderTeamId}
                    className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/40 font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    🔨 Sold
                  </button>
                  <button
                    id="btn-force-unsold"
                    onClick={markCurrentPlayerUnsold}
                    className="px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/40 font-bold flex items-center gap-1"
                  >
                    ❌ Unsold
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE BID HISTORY CARD */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <h4 className="font-sports text-2xl font-bold text-white tracking-wide uppercase">
                    LIVE BID HISTORY
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-digital">{auctionState.bids.length} Bids Logged</span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {auctionState.bids.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">
                    No bids recorded yet. Bids placed by teams will stream live here in real-time.
                  </div>
                ) : (
                  auctionState.bids.map((b, index) => (
                    <div
                      key={b.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        index === 0
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-md scale-[1.01]'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                          #{b.round}
                        </span>
                        <div>
                          <strong className="text-sm font-bold text-white block">{b.teamName}</strong>
                          <span className="text-[10px] text-slate-400">
                            {new Date(b.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-digital text-base font-extrabold text-amber-400 block">
                          {formatINR(b.amount)}
                        </span>
                        {index === 0 && (
                          <span className="text-[9px] font-black text-amber-300 uppercase tracking-wider bg-amber-500/20 px-1.5 py-0.5 rounded">
                            HIGHEST
                          </span>
                        )}
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

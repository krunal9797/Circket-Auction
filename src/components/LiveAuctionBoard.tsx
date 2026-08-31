import React from 'react';
import { 
  Radio, 
  Clock, 
  ShieldCheck, 
  Gavel, 
  Trophy, 
  TrendingUp, 
  Flame, 
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  RotateCcw
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatINR, formatTimer } from '../utils/formatters';

export const LiveAuctionBoard: React.FC = () => {
  const {
    activePlayer,
    auctionState,
    teams,
    placeBid,
    activeBiddingTeamId,
    setActiveBiddingTeamId,
    startAuctionForPlayer,
    players,
    nextPlayerInQueue,
    resetTimer,
    setCurrentTab
  } = useAuction();

  const highestBidderTeam = teams.find(t => t.id === auctionState.highestBidderTeamId);
  const availablePlayers = players.filter(p => p.status === 'available');

  const handleQuickBid = (inc: number) => {
    if (activeBiddingTeamId) {
      placeBid(activeBiddingTeamId, inc);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-[1400px] mx-auto">
      {/* Broadcast Header Bar */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border border-amber-500/30 rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-lg flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>LIVE BROADCAST FEED</span>
          </div>
          <span className="text-sm font-bold text-slate-200 font-sports text-xl tracking-wider uppercase">
            IPL MEGA AUCTION ARENA • OFFICIAL WAR ROOM
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('live_auction')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition flex items-center gap-1.5"
          >
            <Gavel className="w-4 h-4" />
            <span>Auction Cockpit</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Broadcast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: CURRENT PLAYER PROFILE & STATS */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                PLAYER PROFILE
              </span>
              <span className="text-[10px] text-slate-400 font-digital">
                {activePlayer ? `LOT #${activePlayer.id.replace('p-', '')}` : 'STANDBY'}
              </span>
            </div>

            {activePlayer ? (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-sports text-3xl font-bold text-white tracking-wide">
                    {activePlayer.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold">{activePlayer.role} • {activePlayer.city}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Batting:</span>
                    <span className="text-slate-200 font-medium">{activePlayer.battingStyle}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Bowling:</span>
                    <span className="text-slate-200 font-medium">{activePlayer.bowlingStyle}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Age / DOB:</span>
                    <span className="text-slate-200 font-medium">{activePlayer.age} Yrs ({activePlayer.dob})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Base Price:</span>
                    <span className="text-amber-400 font-bold font-digital">{formatINR(activePlayer.basePrice)}</span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-2">
                    CAREER NUMBERS
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Matches</span>
                      <strong className="text-base text-white font-digital">{activePlayer.stats.matches}</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Runs</span>
                      <strong className="text-base text-amber-400 font-digital">{activePlayer.stats.runs}</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Wickets</span>
                      <strong className="text-base text-emerald-400 font-digital">{activePlayer.stats.wickets}</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Strike Rate</span>
                      <strong className="text-base text-cyan-400 font-digital">{activePlayer.stats.strikeRate}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-400">
                <p>No active player in the center arena.</p>
                {availablePlayers.length > 0 && (
                  <button
                    onClick={() => startAuctionForPlayer(availablePlayers[0].id)}
                    className="mt-4 px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold"
                  >
                    Start with {availablePlayers[0].name}
                  </button>
                )}
              </div>
            )}
          </div>

          {activePlayer && (
            <button
              onClick={nextPlayerInQueue}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-1"
            >
              <span>Next In Draft</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* CENTER COLUMN: LARGE PLAYER PHOTO + LIVE BID GAUGE + COUNTDOWN TIMER */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5 backdrop-blur-xl relative overflow-hidden">
            {/* Player Visual Banner */}
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl">
              {activePlayer ? (
                <>
                  <img
                    src={activePlayer.image}
                    alt={activePlayer.name}
                    className="w-full h-full object-cover brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                  {/* Role & Base Price Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-amber-500 text-black font-black text-xs px-3 py-1 rounded-full shadow uppercase">
                      {activePlayer.role}
                    </span>
                    <span className="bg-black/70 backdrop-blur-md text-slate-200 text-xs px-3 py-1 rounded-full border border-slate-600 font-digital">
                      Base: {formatINR(activePlayer.basePrice)}
                    </span>
                  </div>

                  {/* Digital Countdown Timer Overlay */}
                  <div className="absolute top-4 right-4">
                    <div className={`font-digital text-3xl sm:text-4xl font-black px-4 py-1.5 rounded-2xl border shadow-2xl ${
                      auctionState.timerSeconds <= 5 && auctionState.isLive
                        ? 'bg-red-950/90 border-red-500 text-red-400 animate-pulse'
                        : 'bg-black/80 backdrop-blur-md border-amber-500/60 text-amber-400'
                    }`}>
                      {formatTimer(auctionState.timerSeconds)}
                    </div>
                  </div>

                  {/* Player Name and Highest Bid Banner */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/90 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest block">
                        CURRENT ON THE FLOOR
                      </span>
                      <h2 className="font-sports text-3xl sm:text-4xl font-bold text-white tracking-wide">
                        {activePlayer.name}
                      </h2>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                        CURRENT BID
                      </span>
                      <span className="font-digital text-2xl sm:text-4xl font-black text-amber-400">
                        {formatINR(auctionState.currentBid)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 font-sports text-2xl">
                  NO ACTIVE PLAYER IN DRAFT
                </div>
              )}
            </div>

            {/* Highest Bidder Display */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{highestBidderTeam?.logo || '🏏'}</div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    HIGHEST BIDDER
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-white">
                    {highestBidderTeam ? highestBidderTeam.name : 'Waiting for Opening Bid...'}
                  </span>
                </div>
              </div>

              {highestBidderTeam && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Team Purse Left</span>
                  <span className="font-digital text-sm font-bold text-emerald-400">
                    {formatINR(highestBidderTeam.remainingBudget - auctionState.currentBid)}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Live Board Bidding Bar */}
            {activePlayer && auctionState.phase === 'bidding' && (
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold uppercase">Quick Bidding Controls:</span>
                  <select
                    value={activeBiddingTeamId}
                    onChange={(e) => setActiveBiddingTeamId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-amber-400 font-bold text-xs rounded-lg px-2 py-1"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({formatINR(t.remainingBudget)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[1000, 2000, 5000, 10000].map(inc => (
                    <button
                      key={inc}
                      onClick={() => handleQuickBid(inc)}
                      className="py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-400 text-white hover:text-amber-400 font-digital font-bold text-xs sm:text-sm transition active:scale-95"
                    >
                      +{formatINR(inc)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: 8 LIVE TEAMS & REMAINING BUDGETS */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>LIVE TEAM PURSES</span>
            </span>
            <span className="text-[10px] text-slate-400">Cap: ₹1,00,000</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {teams.map((t) => {
              const isHighest = t.id === auctionState.highestBidderTeamId;
              const budgetPercent = Math.round((t.remainingBudget / t.startingBudget) * 100);

              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isHighest
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.logo}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white truncate max-w-[110px]">{t.name}</h4>
                        <span className="text-[9px] text-slate-400">{t.playersBought} Squad</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-digital text-xs font-extrabold text-amber-400 block">
                        {formatINR(t.remainingBudget)}
                      </span>
                      <span className="text-[9px] text-slate-400">Spent: {formatINR(t.totalSpent)}</span>
                    </div>
                  </div>

                  {/* Purse Usage Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        budgetPercent > 50 ? 'bg-emerald-500' : budgetPercent > 20 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${budgetPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: LIVE REAL-TIME BID HISTORY STREAM */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h3 className="font-sports text-2xl font-bold text-white tracking-wide uppercase">
              LIVE BROADCAST BID HISTORY
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-digital">
            {auctionState.bids.length} Bid Actions Recorded
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
          {auctionState.bids.length === 0 ? (
            <div className="col-span-full text-center py-6 text-xs text-slate-500">
              No live bids recorded yet for this session.
            </div>
          ) : (
            auctionState.bids.map((b, index) => (
              <div
                key={b.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  index === 0
                    ? 'bg-amber-500/15 border-amber-500/60 shadow animate-pulse'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div>
                  <span className="text-[10px] text-slate-400 block font-digital">
                    Round #{b.round} • {new Date(b.timestamp).toLocaleTimeString()}
                  </span>
                  <strong className="text-xs font-bold text-white">{b.teamName}</strong>
                </div>

                <div className="text-right">
                  <span className="font-digital text-sm font-extrabold text-amber-400 block">
                    {formatINR(b.amount)}
                  </span>
                  {index === 0 && (
                    <span className="text-[8px] font-black text-black bg-amber-400 px-1 py-0.2 rounded uppercase">
                      LATEST
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

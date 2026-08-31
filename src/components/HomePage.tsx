import React from 'react';
import { 
  Play, 
  Users, 
  Trophy, 
  Gavel, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatINR } from '../utils/formatters';
import { SponsorSlideshow } from './SponsorSlideshow';

export const HomePage: React.FC = () => {
  const { 
    setCurrentTab, 
    stats, 
    players, 
    teams, 
    startAuctionForPlayer, 
    auctionState,
    viewPlayerDetails 
  } = useAuction();

  const featuredPlayers = players.filter(p => p.isFeatured || p.basePrice >= 12000).slice(0, 4);
  const availablePlayers = players.filter(p => p.status === 'available');

  const handleStartAuction = () => {
    if (auctionState.isLive && auctionState.activePlayerId) {
      setCurrentTab('live_auction');
    } else if (availablePlayers.length > 0) {
      startAuctionForPlayer(availablePlayers[0].id);
    } else {
      setCurrentTab('live_auction');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-slate-900 via-[#0B101D] to-[#090D16] shadow-2xl p-6 sm:p-10 lg:p-14">
        {/* Ambient Stadium Lighting Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Stadium Silhouette Grid Pattern */}
        <div className="absolute inset-0 stadium-grid-bg opacity-40 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>KPL • KATASVAN PREMIER LEAGUE 2026</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold">
                <span className="text-amber-400 font-bold">Er. Krunal Gamit</span>
                <span className="text-[10px] text-slate-400">(Creator & Lead Architect)</span>
              </div>
            </div>

            {/* Main Title & Slogan */}
            <div className="space-y-2">
              <h1 className="font-sports text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-wider leading-none text-white uppercase drop-shadow-md">
                CRICKET AUCTION <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">PRO</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-amber-400 rounded-full" />
                <p className="font-sports text-2xl sm:text-3xl lg:text-4xl text-amber-400 tracking-wider font-semibold uppercase">
                  “Bid. Build. Conquer.”
                </p>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Build your dream cricket team with a <strong className="text-white font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">₹1,00,000 auction budget</strong>. Experience lightning-fast live bidding, hammer strikes, real-time purse analytics, and broadcast leaderboard graphics.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="btn-hero-start-auction"
                onClick={handleStartAuction}
                className="px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold text-base tracking-wider uppercase shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer group"
              >
                <Gavel className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>START AUCTION</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-view-players"
                onClick={() => setCurrentTab('players')}
                className="px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base tracking-wide border border-slate-700 hover:border-amber-400/50 shadow-lg transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <Users className="w-5 h-5 text-amber-400" />
                <span>VIEW PLAYERS ({stats.totalPlayers})</span>
              </button>
            </div>

            {/* Caption Message */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 font-medium italic">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>“Build Your Dream XI. One Bid at a Time.”</span>
            </div>
          </div>

          {/* Hero Right Visuals: Stadium Cards & 3D Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Background Glow Card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-blue-500/20 rounded-3xl blur-xl transform rotate-3" />
              
              {/* Main Visual Display Card */}
              <div className="relative bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
                {/* Stadium Graphics Header */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-5 border border-slate-700/50 group">
                  <img
                    src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80"
                    alt="Cricket Stadium Lights"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-amber-500/40 px-3 py-1 rounded-full text-[11px] font-bold text-amber-400 flex items-center gap-1.5 shadow-lg">
                    <span>🏏</span>
                    <span>KPL War Room</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Standard Budget</span>
                      <h4 className="text-xl font-extrabold text-white font-digital">₹1,00,000 / Team</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-sports text-2xl font-bold shadow-lg">
                      🔨
                    </div>
                  </div>
                </div>

                {/* Quick 3-Pillar Highlight */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                    <span className="text-xl block mb-1">🏏</span>
                    <span className="text-[11px] text-slate-400 block font-medium">Captains</span>
                    <strong className="text-sm font-bold text-slate-100">{stats.totalTeams} Franchises</strong>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                    <span className="text-xl block mb-1">💰</span>
                    <span className="text-[11px] text-slate-400 block font-medium">Total Purse</span>
                    <strong className="text-sm font-bold text-amber-400">{formatINR(stats.totalTeams * 100000)}</strong>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                    <span className="text-xl block mb-1">⚡</span>
                    <span className="text-[11px] text-slate-400 block font-medium">Speed Bids</span>
                    <strong className="text-sm font-bold text-emerald-400">Live Timer</strong>
                  </div>
                </div>

                {/* Live Status Ticker */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {stats.playersAvailable} Players Available
                  </span>
                  <button 
                    onClick={() => setCurrentTab('auction_board')}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                  >
                    Open Live Board →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STATISTICS COUNTERS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Total Players */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Players</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide">
            {stats.totalPlayers}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{stats.playersAvailable} in pool</span> • {stats.playersSold} sold
          </p>
        </div>

        {/* Stat 2: Total Teams */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Teams</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide">
            {stats.totalTeams}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-blue-400 font-semibold">₹1,00,000 Purse</span> / team
          </p>
        </div>

        {/* Stat 3: Players Sold */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Players Sold</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide">
            {stats.playersSold}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {stats.playersUnsold > 0 ? `${stats.playersUnsold} unsold currently` : '100% clearance rate'}
          </p>
        </div>

        {/* Stat 4: Total Auction Value */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden group hover:border-yellow-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Auction Value</span>
            <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-sports text-3xl sm:text-4xl font-bold text-amber-400 tracking-wide font-digital">
            {formatINR(stats.totalAuctionValue)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Avg: <span className="text-slate-200 font-medium">{formatINR(stats.averageSoldPrice)}</span> / player
          </p>
        </div>
      </section>

      {/* FEATURED SUPERSTARS READY FOR AUCTION */}
      <section className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Flame className="w-4 h-4" />
              <span>Marquee Set</span>
            </div>
            <h2 className="font-sports text-3xl sm:text-4xl font-bold text-white tracking-wide">
              TOP CRICKET SUPERSTARS
            </h2>
          </div>
          <button
            id="btn-view-all-players-section"
            onClick={() => setCurrentTab('players')}
            className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
          >
            <span>View All {stats.totalPlayers} Players</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {featuredPlayers.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-2xl">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-white">No Players in Firebase Database</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Add your auction players from the Admin Panel or import a roster to begin live bidding.
            </p>
            <button
              onClick={() => setCurrentTab('admin')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition inline-flex items-center gap-2"
            >
              <span>Go to Admin Panel</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredPlayers.map((player) => {
              const isSold = player.status === 'sold';
              const isInAuction = player.status === 'in_auction';

              return (
                <div
                  key={player.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {/* Photo & Tag */}
                    <div className="relative h-56 overflow-hidden bg-slate-950">
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Role Pill */}
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-400 border border-amber-500/30">
                        {player.role}
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {isSold ? (
                          <span className="bg-emerald-500 text-black font-black text-[10px] px-2.5 py-1 rounded-full shadow uppercase">
                            SOLD • {formatINR(player.soldPrice)}
                          </span>
                        ) : isInAuction ? (
                          <span className="bg-red-500 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow animate-pulse uppercase">
                            ON THE HAMMER
                          </span>
                        ) : (
                          <span className="bg-blue-600/80 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-400/40">
                            AVAILABLE
                          </span>
                        )}
                      </div>

                      {/* Player Name Overlay */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[11px] text-slate-300 font-medium">{player.city} • Age {player.age}</span>
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                          {player.name}
                        </h3>
                      </div>
                    </div>

                    {/* Player Key Metrics */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Matches</span>
                          <strong className="text-white font-semibold">{player.stats.matches}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Runs/Wkt</span>
                          <strong className="text-amber-400 font-semibold">
                            {player.role === 'Bowler' ? `${player.stats.wickets} W` : player.stats.runs}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Strike Rate</span>
                          <strong className="text-emerald-400 font-semibold">{player.stats.strikeRate}</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-400">Base Price:</span>
                        <span className="text-amber-400 font-bold font-digital text-sm">
                          {formatINR(player.basePrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => viewPlayerDetails(player.id)}
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                    >
                      Profile
                    </button>
                    {isSold ? (
                      <button
                        onClick={() => viewPlayerDetails(player.id)}
                        className="w-full py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold"
                      >
                        {player.soldToTeamName}
                      </button>
                    ) : (
                      <button
                        onClick={() => startAuctionForPlayer(player.id)}
                        className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                        <span>BID NOW</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PARTICIPATING FRANCHISES MARQUEE */}
      <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white font-sports text-2xl tracking-wider uppercase">
              Participating Teams (₹1,00,000 Budget)
            </h3>
          </div>
          <button 
            onClick={() => setCurrentTab('teams')}
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            View All Squads →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                setCurrentTab('teams');
              }}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 text-center transition group flex flex-col items-center justify-between"
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                {team.logo}
              </div>
              <div className="font-bold text-xs text-slate-200 group-hover:text-amber-400 truncate w-full">
                {team.name}
              </div>
              <div className="text-[10px] text-amber-400/90 font-digital font-semibold mt-1">
                {formatINR(team.remainingBudget)}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* OFFICIAL TOURNAMENT SPONSORS CAROUSEL */}
      <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sports tracking-wider uppercase">
                OFFICIAL TOURNAMENT SPONSORS & PARTNERS
              </h3>
              <p className="text-xs text-slate-400">
                Powering Katasvan Premier League 2026 Season
              </p>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            ★ Title & Powered By Partners
          </span>
        </div>

        <SponsorSlideshow variant="broadcast" autoPlayInterval={4500} />
      </section>

      {/* RULES / BROADCAST SYSTEM INFO */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            1
          </div>
          <h4 className="font-bold text-white text-base">₹1,00,000 Starting Purse</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every team starts with exactly ₹1,00,000. Real-time balance deductions occur automatically upon final sold hammer strike.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            2
          </div>
          <h4 className="font-bold text-white text-base">Fast Interactive Bidding</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use +₹1,000, +₹2,000, +₹5,000 or +₹10,000 quick buttons. Real-time countdown resets to 15s whenever a higher bid arrives.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            3
          </div>
          <h4 className="font-bold text-white text-base">Admin & Broadcast Deck</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full auctioneer gavel controls, custom player/team additions, AI competitor bidding simulation, and complete result exports.
          </p>
        </div>
      </section>
    </div>
  );
};

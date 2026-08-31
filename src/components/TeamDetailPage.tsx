import React from 'react';
import { 
  ArrowLeft, 
  Wallet, 
  Users, 
  Trophy, 
  ShieldCheck, 
  Crown, 
  Gavel, 
  Sparkles,
  PieChart,
  Eye
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatINR } from '../utils/formatters';

export const TeamDetailPage: React.FC = () => {
  const { 
    teams, 
    players, 
    selectedTeamId, 
    setCurrentTab, 
    viewPlayerDetails, 
    setActiveBiddingTeamId 
  } = useAuction();

  const team = teams.find(t => t.id === selectedTeamId) || teams[0];

  if (!team) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Team not found</p>
        <button onClick={() => setCurrentTab('teams')} className="text-amber-400 mt-2">
          Back to Teams Roster
        </button>
      </div>
    );
  }

  // Get players in squad
  const squadPlayers = players.filter(p => p.soldToTeamId === team.id || team.squadPlayerIds.includes(p.id));

  // Role Breakdown
  const roleCounts = {
    Batsman: squadPlayers.filter(p => p.role === 'Batsman').length,
    Bowler: squadPlayers.filter(p => p.role === 'Bowler').length,
    'All-Rounder': squadPlayers.filter(p => p.role === 'All-Rounder').length,
    'Wicket Keeper': squadPlayers.filter(p => p.role === 'Wicket Keeper').length,
  };

  const budgetPercent = Math.round((team.remainingBudget / team.startingBudget) * 100);

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Back Button & Action Strip */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => setCurrentTab('teams')}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Teams</span>
        </button>

        <button
          onClick={() => {
            setActiveBiddingTeamId(team.id);
            setCurrentTab('live_auction');
          }}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider transition shadow flex items-center gap-2"
        >
          <Gavel className="w-4 h-4" />
          <span>Bid As {team.name}</span>
        </button>
      </div>

      {/* Team Header Hero Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-bl-full pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Logo & Identity */}
          <div className="md:col-span-4 flex items-center gap-5">
            <div className="w-24 h-24 rounded-3xl bg-slate-950 border-2 border-amber-500/40 flex items-center justify-center text-5xl shadow-2xl shadow-black">
              {team.logo}
            </div>
            <div>
              <span className="bg-amber-500/20 text-amber-400 font-digital text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase">
                {team.shortCode} FRANCHISE
              </span>
              <h1 className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide mt-1">
                {team.name}
              </h1>
              <p className="text-xs text-slate-400">
                Owner: <strong className="text-slate-200">{team.owner}</strong>
              </p>
              <p className="text-xs text-slate-400">
                Captain: <strong className="text-slate-200">{team.captain}</strong>
              </p>
            </div>
          </div>

          {/* Budget Progress Box */}
          <div className="md:col-span-8 bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Starting Budget</span>
                <strong className="text-sm sm:text-base font-digital font-bold text-slate-200">
                  {formatINR(team.startingBudget)}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Spent</span>
                <strong className="text-sm sm:text-base font-digital font-bold text-red-400">
                  {formatINR(team.totalSpent)}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Remaining Purse</span>
                <strong className="text-sm sm:text-base font-digital font-extrabold text-amber-400">
                  {formatINR(team.remainingBudget)}
                </strong>
              </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Purse Utilization</span>
                <span className="font-digital font-bold text-slate-200">{100 - budgetPercent}% Spent ({team.playersBought} Players)</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                  style={{ width: `${100 - budgetPercent}%` }}
                />
              </div>
            </div>

            {/* Squad Role Distribution Chips */}
            <div className="grid grid-cols-4 gap-2 text-center pt-1 text-xs">
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Batsmen</span>
                <strong className="text-white">{roleCounts.Batsman}</strong>
              </div>
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Bowlers</span>
                <strong className="text-white">{roleCounts.Bowler}</strong>
              </div>
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-400 block">All-Rounders</span>
                <strong className="text-white">{roleCounts['All-Rounder']}</strong>
              </div>
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Wicket Keepers</span>
                <strong className="text-white">{roleCounts['Wicket Keeper']}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MY SQUAD SECTION */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Users className="w-4 h-4" />
              <span>OFFICIAL FRANCHISE SQUAD</span>
            </div>
            <h3 className="font-sports text-3xl font-bold text-white tracking-wide uppercase">
              MY SQUAD ({squadPlayers.length} PLAYERS)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-digital">
            Total Squad Value: <strong className="text-amber-400">{formatINR(team.totalSpent)}</strong>
          </span>
        </div>

        {squadPlayers.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="text-4xl">🏏</div>
            <h4 className="text-lg font-bold text-white">No Players Purchased Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {team.name} currently has all ₹1,00,000 available to bid on players in the live auction.
            </p>
            <button
              onClick={() => {
                setActiveBiddingTeamId(team.id);
                setCurrentTab('live_auction');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider"
            >
              Start Bidding in Live Auction
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {squadPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Photo */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    
                    {/* Role */}
                    <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-400 border border-amber-500/30">
                      {player.role}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                        {player.name}
                      </h4>
                      <span className="text-[11px] text-slate-300">{player.city}</span>
                    </div>
                  </div>

                  {/* Bought Price Banner */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Bought Price:</span>
                      <span className="font-digital font-extrabold text-emerald-400 text-sm">
                        {formatINR(player.soldPrice || player.basePrice)}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-slate-400">
                      <div>Matches: <strong className="text-white">{player.stats.matches}</strong></div>
                      <div>Runs: <strong className="text-amber-400">{player.stats.runs}</strong></div>
                      <div>Wkts: <strong className="text-emerald-400">{player.stats.wickets}</strong></div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 pt-0">
                  <button
                    onClick={() => viewPlayerDetails(player.id)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Career Stats</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

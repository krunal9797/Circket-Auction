import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Wallet, 
  Trophy, 
  ArrowRight, 
  Crown, 
  Flame,
  Plus
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatINR } from '../utils/formatters';

export const TeamsPage: React.FC = () => {
  const { 
    teams, 
    viewTeamDetails, 
    setActiveBiddingTeamId, 
    setCurrentTab,
    setUserRole 
  } = useAuction();

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>FRANCHISE ROSTER</span>
          </div>
          <h1 className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">
            PARTICIPATING TEAMS
          </h1>
          <p className="text-sm text-slate-400">
            Every team starts with a standard auction purse of <strong className="text-white">₹1,00,000 points</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setUserRole('admin');
              setCurrentTab('admin');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 text-xs font-bold transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add / Manage Teams</span>
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-3xl">
            🏏
          </div>
          <h3 className="text-xl font-bold text-white">No Teams on Cloud Database</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You haven't added any teams yet. Create franchise teams in the Admin Panel or seed sample teams.
          </p>
          <button
            onClick={() => {
              setUserRole('admin');
              setCurrentTab('admin');
            }}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Team</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team) => {
            const budgetPercent = Math.round((team.remainingBudget / team.startingBudget) * 100);

            return (
              <div
                key={team.id}
                onClick={() => viewTeamDetails(team.id)}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

                <div>
                  {/* Team Crest & Name */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                      {team.logo}
                    </div>
                    <span className="bg-slate-950 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-400 border border-slate-800 font-digital uppercase">
                      {team.shortCode}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Owner: <span className="text-slate-300 font-medium">{team.owner}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Captain: <span className="text-slate-300 font-medium">{team.captain}</span>
                  </p>

                  {/* Budget Section */}
                  <div className="mt-5 space-y-2 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Remaining Purse:</span>
                      <span className="font-digital font-bold text-amber-400 text-sm">
                        {formatINR(team.remainingBudget)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          budgetPercent > 50 ? 'bg-emerald-500' : budgetPercent > 20 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${budgetPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>Spent: <strong className="text-slate-200">{formatINR(team.totalSpent)}</strong></span>
                      <span>Squad: <strong className="text-white">{team.playersBought}</strong> Players</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTab('team_portal');
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition"
                    title="Franchise Owner War Room Login"
                  >
                    <span>🔐 War Room</span>
                  </button>
                  
                  <span className="text-xs text-slate-400 group-hover:text-white font-medium flex items-center gap-1">
                    <span>View Squad</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

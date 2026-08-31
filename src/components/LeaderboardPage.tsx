import React from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Medal,
  Award
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatINR } from '../utils/formatters';

export const LeaderboardPage: React.FC = () => {
  const { teams, stats, viewTeamDetails, viewPlayerDetails } = useAuction();

  // Rank teams by total spent (squad value) and secondarily by players bought
  const rankedTeams = [...teams].sort((a, b) => {
    if (b.totalSpent !== a.totalSpent) {
      return b.totalSpent - a.totalSpent;
    }
    return b.playersBought - a.playersBought;
  });

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
          <Trophy className="w-4 h-4" />
          <span>OFFICIAL STANDINGS & LEADERBOARD</span>
        </div>
        <h1 className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">
          AUCTION STANDINGS
        </h1>
        <p className="text-sm text-slate-400">
          Real-time tournament franchise standings ranked by total squad investment and acquired player volume.
        </p>
      </div>

      {/* 3 SPECIAL SPOTLIGHT AWARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Spotlight 1: Highest Spending Team */}
        <div className="bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              <span>HIGHEST SPENDING TEAM</span>
            </span>
            <span className="text-2xl">🏆</span>
          </div>

          {stats.highestSpendingTeam ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center justify-center text-2xl">
                  {stats.highestSpendingTeam.logo}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{stats.highestSpendingTeam.name}</h3>
                  <span className="text-xs text-slate-400">Owner: {stats.highestSpendingTeam.owner}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs text-slate-400 block">Total Purse Spent</span>
                <span className="font-digital text-3xl font-extrabold text-amber-400">
                  {formatINR(stats.highestSpendingTeam.totalSpent)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Remaining: {formatINR(stats.highestSpendingTeam.remainingBudget)}
                </span>
              </div>

              <button
                onClick={() => viewTeamDetails(stats.highestSpendingTeam!.id)}
                className="w-full mt-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>View Team Squad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-slate-500 text-sm italic py-4">No team has spent purse points yet</div>
          )}
        </div>

        {/* Spotlight 2: Most Expensive Player */}
        <div className="bg-gradient-to-b from-blue-500/15 via-slate-900 to-slate-900 border-2 border-blue-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              <span>MOST EXPENSIVE PLAYER</span>
            </span>
            <span className="text-2xl">💰</span>
          </div>

          {stats.highestSoldPlayer ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={stats.highestSoldPlayer.player.image}
                  alt={stats.highestSoldPlayer.player.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-blue-500/40"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{stats.highestSoldPlayer.player.name}</h3>
                  <span className="text-xs text-amber-400 font-semibold">{stats.highestSoldPlayer.player.role}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs text-slate-400 block">Hammer Sold Price</span>
                <span className="font-digital text-3xl font-extrabold text-emerald-400">
                  {formatINR(stats.highestSoldPlayer.price)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Bought by: <strong className="text-slate-200">{stats.highestSoldPlayer.teamName}</strong>
                </span>
              </div>

              <button
                onClick={() => viewPlayerDetails(stats.highestSoldPlayer!.player.id)}
                className="w-full mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>View Player Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-slate-500 text-sm italic py-4">No player sold yet in this session</div>
          )}
        </div>

        {/* Spotlight 3: Most Players Purchased */}
        <div className="bg-gradient-to-b from-purple-500/15 via-slate-900 to-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>MOST PLAYERS ACQUIRED</span>
            </span>
            <span className="text-2xl">🔥</span>
          </div>

          {stats.mostPlayersTeam ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-purple-500/40 flex items-center justify-center text-2xl">
                  {stats.mostPlayersTeam.logo}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{stats.mostPlayersTeam.name}</h3>
                  <span className="text-xs text-slate-400">Captain: {stats.mostPlayersTeam.captain}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs text-slate-400 block">Squad Roster Size</span>
                <span className="font-digital text-3xl font-extrabold text-purple-300">
                  {stats.mostPlayersTeam.playersBought} <span className="text-sm font-normal text-slate-400">Players</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Remaining Purse: {formatINR(stats.mostPlayersTeam.remainingBudget)}
                </span>
              </div>

              <button
                onClick={() => viewTeamDetails(stats.mostPlayersTeam!.id)}
                className="w-full mt-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>View Complete Squad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-slate-500 text-sm italic py-4">No team has acquired players yet</div>
          )}
        </div>
      </div>

      {/* COMPLETE RANKED TEAMS TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-sports text-2xl font-bold text-white tracking-wide uppercase">
            COMPLETE FRANCHISE RANKINGS
          </h3>
          <span className="text-xs text-slate-400 font-digital">{teams.length} Franchises Participating</span>
        </div>

        <div className="overflow-x-auto">
          {rankedTeams.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p className="text-base font-semibold text-slate-300">No teams found on Firestore database.</p>
              <p className="text-xs text-slate-500 mt-1">Add your tournament teams in the Admin Desk to see standings.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-5 text-center">Rank</th>
                  <th className="py-4 px-5">Team Franchise</th>
                  <th className="py-4 px-5">Captain & Owner</th>
                  <th className="py-4 px-5 text-center">Squad Size</th>
                  <th className="py-4 px-5 text-right">Total Spent</th>
                  <th className="py-4 px-5 text-right">Remaining Budget</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {rankedTeams.map((team, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;

                  return (
                    <tr key={team.id} className="hover:bg-slate-800/40 transition">
                      {/* Rank Badge */}
                      <td className="py-4 px-5 text-center">
                        <span className={`w-8 h-8 rounded-xl font-digital font-black text-sm inline-flex items-center justify-center ${
                          rank === 1
                            ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30'
                            : rank === 2
                            ? 'bg-slate-300 text-black shadow'
                            : rank === 3
                            ? 'bg-amber-700 text-white shadow'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                        </span>
                      </td>

                      {/* Team Name + Logo */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{team.logo}</span>
                          <div>
                            <strong className="text-white font-bold block text-base">{team.name}</strong>
                            <span className="text-xs text-amber-400 font-digital">{team.shortCode}</span>
                          </div>
                        </div>
                      </td>

                      {/* Captain & Owner */}
                      <td className="py-4 px-5 text-xs text-slate-300">
                        <div>Cap: <strong className="text-slate-100">{team.captain}</strong></div>
                        <div className="text-slate-400 text-[11px]">Own: {team.owner}</div>
                      </td>

                      {/* Squad Count */}
                      <td className="py-4 px-5 text-center font-digital font-bold text-base text-white">
                        {team.playersBought}
                      </td>

                      {/* Spent */}
                      <td className="py-4 px-5 text-right font-digital text-base font-extrabold text-red-400">
                        {formatINR(team.totalSpent)}
                      </td>

                      {/* Remaining */}
                      <td className="py-4 px-5 text-right font-digital text-base font-extrabold text-amber-400">
                        {formatINR(team.remainingBudget)}
                      </td>

                      {/* View Squad Action */}
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => viewTeamDetails(team.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                        >
                          Squad Roster
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

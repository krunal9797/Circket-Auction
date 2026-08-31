import React, { useState } from 'react';
import { 
  PieChart, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Printer, 
  Users,
  Eye,
  Gavel
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatINR } from '../utils/formatters';

type ResultTab = 'SOLD' | 'UNSOLD' | 'ALL';

export const AuctionResultPage: React.FC = () => {
  const { players, stats, viewPlayerDetails, startAuctionForPlayer } = useAuction();
  const [activeTab, setActiveTab] = useState<ResultTab>('SOLD');

  const soldPlayers = players.filter(p => p.status === 'sold');
  const unsoldPlayers = players.filter(p => p.status === 'unsold');
  
  const displayedPlayers = 
    activeTab === 'SOLD' 
      ? soldPlayers 
      : activeTab === 'UNSOLD' 
      ? unsoldPlayers 
      : players;

  const exportCSV = () => {
    const headers = ['Player ID', 'Name', 'Role', 'Status', 'Base Price', 'Sold Price', 'Winning Team', 'Matches', 'Runs', 'Wickets'];
    const rows = players.map(p => [
      p.id,
      `"${p.name}"`,
      p.role,
      p.status,
      p.basePrice,
      p.soldPrice || 0,
      `"${p.soldToTeamName || 'N/A'}"`,
      p.stats.matches,
      p.stats.runs,
      p.stats.wickets
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cricket_auction_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <PieChart className="w-4 h-4" />
            <span>FINAL TOURNAMENT TALLY</span>
          </div>
          <h1 className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">
            AUCTION RESULTS SUMMARY
          </h1>
          <p className="text-sm text-slate-400">
            Complete transaction ledger of sold and unsold cricket players with comprehensive financial analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 text-xs font-bold transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Calculation KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Players Sold */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Total Players Sold</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-sports text-4xl font-bold text-white font-digital">
            {stats.playersSold} <span className="text-sm font-normal text-slate-400">/ {stats.totalPlayers}</span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            {stats.playersUnsold} unsold • {stats.playersAvailable} available
          </span>
        </div>

        {/* Metric 2: Total Auction Amount */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Total Auction Amount</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-sports text-3xl sm:text-4xl font-bold text-amber-400 font-digital">
            {formatINR(stats.totalAuctionValue)}
          </div>
          <span className="text-[11px] text-slate-400 block">
            From ₹8,00,000 total franchise purse
          </span>
        </div>

        {/* Metric 3: Highest Sold Player */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Highest Sold Player</span>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          {stats.highestSoldPlayer ? (
            <div>
              <div className="text-base font-bold text-white truncate">
                {stats.highestSoldPlayer.player.name}
              </div>
              <div className="font-digital font-extrabold text-emerald-400 text-lg">
                {formatINR(stats.highestSoldPlayer.price)}
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                To: {stats.highestSoldPlayer.teamName}
              </span>
            </div>
          ) : (
            <div className="text-sm text-slate-500 italic py-2">No player sold yet</div>
          )}
        </div>

        {/* Metric 4: Average Sold Price */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Average Sold Price</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-sports text-3xl sm:text-4xl font-bold text-blue-400 font-digital">
            {formatINR(stats.averageSoldPrice)}
          </div>
          <span className="text-[11px] text-slate-400 block">
            Per purchased squad member
          </span>
        </div>
      </div>

      {/* Results Tab Filter */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('SOLD')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition border ${
            activeTab === 'SOLD'
              ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          SOLD PLAYERS ({soldPlayers.length})
        </button>
        <button
          onClick={() => setActiveTab('UNSOLD')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition border ${
            activeTab === 'UNSOLD'
              ? 'bg-red-500 text-white border-red-400 shadow-md shadow-red-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          UNSOLD PLAYERS ({unsoldPlayers.length})
        </button>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition border ${
            activeTab === 'ALL'
              ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          ALL PLAYERS ({players.length})
        </button>
      </div>

      {/* Results Table & Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {displayedPlayers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No players currently in this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Player</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Base Price</th>
                  <th className="py-4 px-6">Winning Team</th>
                  <th className="py-4 px-6 text-right">Sold Price</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {displayedPlayers.map((player) => {
                  const isSold = player.status === 'sold';
                  const isUnsold = player.status === 'unsold';

                  return (
                    <tr key={player.id} className="hover:bg-slate-800/40 transition">
                      {/* Player Photo + Name */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <strong className="text-white font-bold block">{player.name}</strong>
                          <span className="text-xs text-slate-400">{player.city} • Age {player.age}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        <span className="bg-slate-950 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-400 border border-slate-800">
                          {player.role}
                        </span>
                      </td>

                      {/* Base Price */}
                      <td className="py-4 px-6 font-digital text-slate-300 font-bold">
                        {formatINR(player.basePrice)}
                      </td>

                      {/* Winning Team */}
                      <td className="py-4 px-6">
                        {isSold && player.soldToTeamName ? (
                          <strong className="text-emerald-400 font-bold">{player.soldToTeamName}</strong>
                        ) : (
                          <span className="text-slate-500 italic">—</span>
                        )}
                      </td>

                      {/* Sold Price */}
                      <td className="py-4 px-6 text-right font-digital text-base font-extrabold">
                        {isSold && player.soldPrice ? (
                          <span className="text-emerald-400">{formatINR(player.soldPrice)}</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        {isSold ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            SOLD
                          </span>
                        ) : isUnsold ? (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            UNSOLD
                          </span>
                        ) : (
                          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            AVAILABLE
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => viewPlayerDetails(player.id)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isSold && (
                            <button
                              onClick={() => startAuctionForPlayer(player.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold"
                              title="Start Auction"
                            >
                              Auction
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

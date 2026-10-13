import React, { useState, useMemo } from 'react';
import { useAuction } from '../context/AuctionContext';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Gavel, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Eye, 
  Calculator,
  Search,
  Share2,
  AlertTriangle,
  Info,
  ChevronRight,
  Shield,
  Layers,
  UserCheck
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { Team, Player, PlayerRole } from '../types';
import { SponsorSlideshow } from './SponsorSlideshow';

export const TeamOwnerPortal: React.FC = () => {
  const { 
    teams, 
    players, 
    auctionState, 
    activePlayer, 
    setCurrentTab,
    viewPlayerDetails,
    viewTeamDetails
  } = useAuction();

  // Target squad size for calculation (default 11 for standard cricket squad)
  const [targetSquadSize, setTargetSquadSize] = useState<number>(11);
  const [selectedTeamTab, setSelectedTeamTab] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Standard tournament base price
  const basePricePerSlot = 1000;

  // Calculate Base Cut and Max Bid for a team
  const calculateTeamStrategy = (team: Team) => {
    const bought = team.playersBought || (team.squadPlayerIds?.length || 0);
    const remainingPurse = team.remainingBudget;
    const slotsNeeded = Math.max(0, targetSquadSize - bought);

    // If slots needed is > 1, to buy next player they must keep (slotsNeeded - 1) * 1000 reserved
    const subsequentSlotsNeeded = Math.max(0, slotsNeeded - 1);
    const reservedForSubsequent = subsequentSlotsNeeded * basePricePerSlot;
    
    // Max single bid they can place on next player without going bankrupt for remaining squad
    const maxNextBid = Math.max(0, remainingPurse - reservedForSubsequent);

    // Balance remaining if next player is bought at minimum base price (₹1,000)
    const balanceAfterBaseCut = Math.max(0, remainingPurse - basePricePerSlot);

    return {
      bought,
      remainingPurse,
      slotsNeeded,
      subsequentSlotsNeeded,
      reservedForSubsequent,
      maxNextBid,
      balanceAfterBaseCut
    };
  };

  // Map squad players for a team
  const getSquadForTeam = (team: Team) => {
    return players.filter(p => team.squadPlayerIds?.includes(p.id) || p.soldToTeamId === team.id);
  };

  // Currently inspected team if tab is not 'all'
  const activeSingleTeam = useMemo(() => {
    return teams.find(t => t.id === selectedTeamTab);
  }, [teams, selectedTeamTab]);

  // Share war room summary
  const handleShareSummary = () => {
    if (typeof navigator !== 'undefined') {
      const summaryText = `🏏 *KPL 2026 MOBILE WAR ROOM UPDATE*\n\n` +
        teams.map(t => {
          const strat = calculateTeamStrategy(t);
          return `🔹 *${t.name}* [${t.shortCode}]\n` +
                 `• Squad: ${strat.bought}/${targetSquadSize} Players\n` +
                 `• Remaining Purse: ${formatINR(strat.remainingPurse)}\n` +
                 `• Next Player Max Bid: ${formatINR(strat.maxNextBid)}\n` +
                 `• Balance After Base (-₹1,000): ${formatINR(strat.balanceAfterBaseCut)}\n`;
        }).join('\n') +
        `\n📊 Live view link: ${window.location.origin}/?tab=team_portal`;

      if (navigator.share) {
        navigator.share({
          title: 'KPL 2026 War Room Strategy',
          text: summaryText
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(summaryText);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Live Auction Sponsor Ticker */}
      <SponsorSlideshow variant="ticker" autoPlayInterval={4500} className="shadow-lg" />

      {/* MOBILE WAR ROOM HERO HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Eye className="w-3.5 h-3.5 animate-pulse" />
                <span>મોબાઇલ વોર રૂમ (VIEW ONLY)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                6 TEAMS LIVE MONITOR
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                BASE PRICE: ₹1,000
              </span>
            </div>

            <h1 className="font-sports text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-wide">
              KPL 2026 <span className="text-amber-400">Mobile War Room</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              તમામ 6 ટીમોના ખરીદેલા ખેલાડીઓ, બાકી રહેલું પર્સ બેલેન્સ, અને નેક્સ્ટ પ્લેયર માટે બેઝ કટ કરીને મહત્તમ બિડ રકમનું રીઅલ-ટાઇમ લાઇવ કેલ્ક્યુલેશન. (આ પેજ ફક્ત વ્યૂ માટે છે, કોઈ બિડ અહીંથી લાગશે નહીં).
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleShareSummary}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>{copiedLink ? 'કૉપી થઈ ગયું! ✓' : 'વોટ્સએપ સમરી શેર'}</span>
            </button>
            <button
              onClick={() => setCurrentTab('live_auction')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg active:scale-95"
            >
              <Gavel className="w-4 h-4" />
              <span>ઓક્શન એરેના ↗</span>
            </button>
          </div>
        </div>

        {/* STRICT VIEW-ONLY NOTICE BANNER */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>
              <strong className="text-amber-400">🛡️ સેફ સ્ટ્રેટેજી મોડ:</strong> આ વોર રૂમમાં કોઈ બિડિંગ બટન નથી જેથી ઓક્શન દરમિયાન ભૂલથી કોઈ બિડ ના લાગી જાય.
            </span>
          </div>

          {/* Target Squad Size Controller */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              સ્ક્વોડ ટાર્ગેટ:
            </span>
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
              {[10, 11, 12, 13, 15].map((num) => (
                <button
                  key={num}
                  onClick={() => setTargetSquadSize(num)}
                  className={`px-2 py-1 text-xs font-bold rounded transition ${
                    targetSquadSize === num
                      ? 'bg-amber-500 text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LIVE AUCTION HAMMER STATUS TICKER (READ-ONLY) */}
      {auctionState.isLive && activePlayer && (
        <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/40 border-2 border-red-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={activePlayer.image || (activePlayer as unknown as { photo?: string }).photo || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200'}
                alt={activePlayer.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border-2 border-amber-500/50 shadow-md shrink-0"
              />
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                    LIVE HAMMER ON
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">{activePlayer.role}</span>
                </div>
                <h3 className="font-sports text-xl sm:text-2xl font-bold text-white uppercase truncate">
                  {activePlayer.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-digital">
                  Base Price: <strong className="text-white">{formatINR(activePlayer.basePrice || 1000)}</strong>
                </p>
              </div>
            </div>

            {/* Current Hammer Amount & Leading Team */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Highest Bid</span>
                <span className="font-digital text-2xl sm:text-3xl font-black text-amber-400">
                  {formatINR(auctionState.currentBid || activePlayer.basePrice || 1000)}
                </span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2 text-center min-w-[130px]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Leading Franchise</span>
                <span className="font-bold text-sm text-emerald-400 block truncate">
                  {auctionState.highestBidderTeamName || 'કોઈ બિડ નથી (Open)'}
                </span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TEAM NAVIGATION TABS (TOUCH OPTIMIZED FOR MOBILE) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedTeamTab('all')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 transition flex items-center gap-2 ${
              selectedTeamTab === 'all'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>તમામ 6 ટીમો (All 6 Teams)</span>
          </button>

          {teams.map((team) => {
            const strat = calculateTeamStrategy(team);
            const isSelected = selectedTeamTab === team.id;

            return (
              <button
                key={team.id}
                onClick={() => setSelectedTeamTab(team.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500 text-white shadow-md'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
                style={{ borderLeftColor: team.color || '#f59e0b', borderLeftWidth: '4px' }}
              >
                <span className="text-base">{team.logo || '🏏'}</span>
                <div className="text-left">
                  <div className="font-sports tracking-wide leading-tight">{team.shortCode}</div>
                  <div className="text-[10px] font-digital text-emerald-400 font-normal">
                    {formatINR(strat.remainingPurse)}
                  </div>
                </div>
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">
                  {strat.bought}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STRATEGY FORMULA EXPLAINER CARD */}
      <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-4 text-xs text-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-white uppercase tracking-wider block">
              કેવી રીતે કેલ્ક્યુલેટ થાય છે "Next Player Base Cut Amount"?
            </span>
            <p className="text-slate-300 leading-relaxed">
              ટીમનો ટાર્ગેટ સ્ક્વોડ પૂરો કરવા માટે ({targetSquadSize} ખેલાડીઓ), આવનારા બાકીના તમામ સ્લોટ્સ માટે ઓછામાં ઓછી ₹1,000 બેઝ પ્રાઇસ રિઝર્વ રાખીને બાકી બચેલી રકમ જ નેક્સ્ટ પ્લેયર માટે મેક્સિમમ વાપરી શકાય. જેથી ટીમ કોઈ પણ સંજોગોમાં ડિસક્વોલિફાય ના થાય.
            </p>
          </div>
        </div>
      </div>

      {/* VIEW 1: ALL 6 TEAMS GRID COMPARISON */}
      {selectedTeamTab === 'all' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teams.map((team) => {
              const strat = calculateTeamStrategy(team);
              const squad = getSquadForTeam(team);
              const spentPercent = Math.min(100, Math.round((team.totalSpent / (team.startingBudget || 100000)) * 100));

              // Roles breakdown
              const batCount = squad.filter(p => p.role === 'Batsman').length;
              const bowlCount = squad.filter(p => p.role === 'Bowler').length;
              const arCount = squad.filter(p => p.role === 'All-Rounder').length;
              const wkCount = squad.filter(p => p.role === 'Wicket Keeper').length;

              return (
                <div
                  key={team.id}
                  className="bg-slate-900/90 border-2 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between transition hover:border-amber-500/70"
                  style={{ borderColor: team.color ? `${team.color}50` : '#334155' }}
                >
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 pointer-events-none"
                    style={{ backgroundColor: team.color || '#f59e0b' }}
                  />

                  <div className="space-y-4">
                    {/* Team Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-13 h-13 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-inner shrink-0"
                          style={{ 
                            backgroundColor: `${team.color || '#f59e0b'}20`, 
                            borderColor: team.color || '#f59e0b' 
                          }}
                        >
                          {team.logo || '🏏'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-slate-400">[{team.shortCode}]</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-amber-400 font-bold">
                              {strat.bought} / {targetSquadSize} Players
                            </span>
                          </div>
                          <h3 className="font-sports text-xl font-black text-white uppercase tracking-wide truncate max-w-[200px]">
                            {team.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Owner & Captain info */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/80">
                      <span>Owner: <strong className="text-slate-200">{team.owner || '—'}</strong></span>
                      <span>Cap: <strong className="text-white">{team.captain || '—'}</strong></span>
                    </div>

                    {/* PURSE METRICS & NEXT PLAYER BASE CUT BOX */}
                    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
                      {/* Metric 1: Remaining Purse */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          બાકી બેલેન્સ (Remaining Purse):
                        </span>
                        <span className="font-digital text-2xl font-black text-emerald-400">
                          {formatINR(strat.remainingPurse)}
                        </span>
                      </div>

                      {/* Purse Progress Bar */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all"
                          style={{ width: `${Math.max(0, 100 - spentPercent)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                        <span>કુલ ખર્ચ: <strong className="text-amber-400 font-digital">{formatINR(team.totalSpent)}</strong></span>
                        <span>શરૂઆત: <strong className="text-slate-300 font-digital">{formatINR(team.startingBudget || 100000)}</strong></span>
                      </div>

                      {/* Metric 2: NEXT PLAYER BASE CUT AMOUNT (Crucial Highlight) */}
                      <div className="mt-3 pt-3 border-t border-slate-800/90 space-y-2">
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                              Next Player Max Bid (Base Reserved)
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (બાકી {strat.subsequentSlotsNeeded} ખેલાડીઓ માટે ₹1,000 અનામત)
                            </span>
                          </div>
                          <div className="font-digital text-xl font-black text-amber-400">
                            {formatINR(strat.maxNextBid)}
                          </div>
                        </div>

                        {/* Metric 3: Balance after -₹1,000 Base Buy */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2.5 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
                              -₹1,000 બેઝ કટ પછી બેલેન્સ
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (નેક્સ્ટ પ્લેયર બેઝ પ્રાઇસમાં આવે તો)
                            </span>
                          </div>
                          <div className="font-digital text-base font-bold text-blue-300">
                            {formatINR(strat.balanceAfterBaseCut)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SQUAD PLAYERS SUMMARY LIST */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-400" />
                          <span>ખરીદેલા ખેલાડીઓ ({squad.length}):</span>
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                          <span className="text-blue-300">BAT:{batCount}</span> •
                          <span className="text-red-300">BOWL:{bowlCount}</span> •
                          <span className="text-amber-300">AR:{arCount}</span> •
                          <span className="text-purple-300">WK:{wkCount}</span>
                        </div>
                      </div>

                      {squad.length === 0 ? (
                        <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
                          હજુ સુધી કોઈ ખેલાડી ખરીદ્યો નથી (0/{targetSquadSize})
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                          {squad.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => viewPlayerDetails(p.id)}
                              className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between text-xs transition cursor-pointer group"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={p.image || (p as unknown as { photo?: string }).photo || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=80'}
                                  alt={p.name}
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-700"
                                />
                                <div className="min-w-0">
                                  <div className="font-sports font-bold text-white uppercase truncate group-hover:text-amber-400">
                                    {p.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {p.role} {p.jerseyNumber && `• #${p.jerseyNumber}`}
                                  </div>
                                </div>
                              </div>
                              <span className="font-digital text-xs font-bold text-emerald-400 shrink-0 ml-2">
                                {formatINR(p.soldPrice || 0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedTeamTab(team.id)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
                    >
                      <span>આ ટીમનો સ્ક્વોડ વિસ્તૃત જુઓ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-500">
                      બાકી સ્લોટ્સ: <strong className="text-slate-300">{strat.slotsNeeded}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: SINGLE TEAM DEEP DIVE ROSTER & STRATEGY */}
      {selectedTeamTab !== 'all' && activeSingleTeam && (() => {
        const strat = calculateTeamStrategy(activeSingleTeam);
        const fullSquad = getSquadForTeam(activeSingleTeam);
        const filteredSquad = fullSquad.filter(p => {
          const matchRole = roleFilter === 'all' || p.role.toLowerCase() === roleFilter.toLowerCase();
          const matchSearch = !searchQuery || 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase()));
          return matchRole && matchSearch;
        });

        const batCount = fullSquad.filter(p => p.role === 'Batsman').length;
        const bowlCount = fullSquad.filter(p => p.role === 'Bowler').length;
        const arCount = fullSquad.filter(p => p.role === 'All-Rounder').length;
        const wkCount = fullSquad.filter(p => p.role === 'Wicket Keeper').length;

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Active Single Team Banner */}
            <div 
              className="bg-slate-900 border-2 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              style={{ borderColor: activeSingleTeam.color || '#f59e0b' }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl border-2 shadow-2xl shrink-0"
                    style={{ 
                      backgroundColor: `${activeSingleTeam.color || '#f59e0b'}30`, 
                      borderColor: activeSingleTeam.color || '#f59e0b' 
                    }}
                  >
                    {activeSingleTeam.logo || '🏏'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                        {activeSingleTeam.shortCode}
                      </span>
                      <span className="text-xs text-slate-400">
                        Squad: <strong className="text-white">{strat.bought} / {targetSquadSize} Players</strong>
                      </span>
                    </div>
                    <h2 className="font-sports text-3xl sm:text-4xl font-black text-white uppercase">
                      {activeSingleTeam.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>Owner: <strong className="text-amber-400">{activeSingleTeam.owner}</strong></span>
                      <span>•</span>
                      <span>Captain: <strong className="text-white">{activeSingleTeam.captain}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTeamTab('all')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition flex items-center gap-1.5"
                >
                  <span>← તમામ 6 ટીમો જુઓ</span>
                </button>
              </div>
            </div>

            {/* Strategy Highlights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Remaining Purse */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                  <span>બાકી બેલેન્સ (Remaining)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-digital text-3xl font-black text-emerald-400">
                  {formatINR(strat.remainingPurse)}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  શરૂઆતનું પર્સ: {formatINR(activeSingleTeam.startingBudget || 100000)}
                </p>
              </div>

              {/* Card 2: Total Spent */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                  <span>કુલ ખર્ચ (Spent)</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-digital text-3xl font-black text-amber-400">
                  {formatINR(activeSingleTeam.totalSpent)}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {Math.round((activeSingleTeam.totalSpent / (activeSingleTeam.startingBudget || 100000)) * 100)}% બજેટ વપરાયું
                </p>
              </div>

              {/* Card 3: Next Player Max Bid */}
              <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-2">
                  <span>Next Player Max Bid</span>
                  <Calculator className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-digital text-3xl font-black text-amber-400">
                  {formatINR(strat.maxNextBid)}
                </div>
                <p className="text-[11px] text-slate-300 mt-2">
                  બાકી {strat.subsequentSlotsNeeded} ખેલાડીઓ માટે ₹1,000 બેઝ રિઝર્વ રાખીને
                </p>
              </div>

              {/* Card 4: Balance After ₹1,000 Base Buy */}
              <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-xs text-blue-300 font-bold mb-2">
                  <span>-₹1,000 Base Cut Balance</span>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <div className="font-digital text-3xl font-black text-blue-300">
                  {formatINR(strat.balanceAfterBaseCut)}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  નેક્સ્ટ ખેલાડી ₹1,000 બેઝ પ્રાઇસમાં આવે તો
                </p>
              </div>
            </div>

            {/* SQUAD PLAYERS TABLE / LIST */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-sports text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                    <Users className="w-6 h-6 text-amber-400" />
                    <span>ખરીદેલા ખેલાડીઓનું લિસ્ટ ({fullSquad.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    આ ટીમ દ્વારા લાઈવ ઓક્શનમાં ખરીદવામાં આવેલા તમામ ખેલાડીઓની સંપૂર્ણ યાદી.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="ખેલાડી શોધો..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                    {['all', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRoleFilter(r)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                          roleFilter === r
                            ? 'bg-amber-500 text-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {r === 'all' ? 'All' : r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Role Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-blue-300 font-bold">Batsmen (બેટ્સમેન):</span>
                  <span className="font-sports text-lg font-bold text-white">{batCount}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-red-300 font-bold">Bowlers (બોલર):</span>
                  <span className="font-sports text-lg font-bold text-white">{bowlCount}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-amber-300 font-bold">All-Rounders (ઓલરાઉન્ડર):</span>
                  <span className="font-sports text-lg font-bold text-white">{arCount}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-purple-300 font-bold">WK (વિકેટકીપર):</span>
                  <span className="font-sports text-lg font-bold text-white">{wkCount}</span>
                </div>
              </div>

              {/* Players Grid */}
              {filteredSquad.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                  <Users className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">કોઈ ખેલાડી મળ્યો નથી</h4>
                  <p className="text-xs text-slate-400">
                    {fullSquad.length === 0 
                      ? 'આ ટીમે હજુ સુધી ઓક્શનમાં કોઈ ખેલાડી ખરીદ્યો નથી.' 
                      : 'પસંદ કરેલા ફિલ્ટરમાં કોઈ ખેલાડી નથી.'}
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
                          src={player.image || (player as unknown as { photo?: string }).photo || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120'}
                          alt={player.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700 group-hover:scale-105 transition shrink-0"
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
                            <span className="truncate">{player.city || player.faliyu || 'Katasvan'}</span>
                            <span className="font-digital text-emerald-400 font-bold text-sm">
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
          </div>
        );
      })()}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Gavel, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  ArrowUpDown,
  Plus,
  Eye,
  UserPlus,
  Share2,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { PlayerRole, PlayerStatus } from '../types';
import { formatINR } from '../utils/formatters';
import { getShareableUrl, getWhatsAppShareText, openWhatsAppShare, copyToClipboard } from '../utils/shareUtils';
import { ShareLinksModal } from './ShareLinksModal';

type FilterType = 'All' | PlayerRole | 'Available' | 'Sold' | 'Unsold';

export const PlayerDatabase: React.FC = () => {
  const { 
    players, 
    viewPlayerDetails, 
    startAuctionForPlayer, 
    setCurrentTab,
    setUserRole,
    userRole
  } = useAuction();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [sortBy, setSortBy] = useState<'name' | 'basePrice' | 'runs' | 'wickets'>('basePrice');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const playerRegUrl = getShareableUrl('register_player');

  const handleCopyLink = async () => {
    const success = await copyToClipboard(playerRegUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const filterTabs: FilterType[] = [
    'All',
    'Batsman',
    'Bowler',
    'All-Rounder',
    'Wicket Keeper',
    'Available',
    'Sold',
    'Unsold',
  ];

  const filteredPlayers = useMemo(() => {
    return players
      .filter((p) => {
        // Search match
        const matchesSearch = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.soldToTeamName && p.soldToTeamName.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        // Filter match
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Available') return p.status === 'available';
        if (activeFilter === 'Sold') return p.status === 'sold';
        if (activeFilter === 'Unsold') return p.status === 'unsold';
        return p.role === activeFilter;
      })
      .sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;

        if (sortBy === 'name') {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          return sortOrder === 'asc' 
            ? (valA < valB ? -1 : 1) 
            : (valA > valB ? -1 : 1);
        } else if (sortBy === 'basePrice') {
          valA = a.basePrice;
          valB = b.basePrice;
        } else if (sortBy === 'runs') {
          valA = a.stats.runs;
          valB = b.stats.runs;
        } else if (sortBy === 'wickets') {
          valA = a.stats.wickets;
          valB = b.stats.wickets;
        }

        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [players, searchQuery, activeFilter, sortBy, sortOrder]);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Users className="w-4 h-4" />
            <span>PLAYER POOL & ROSTER</span>
          </div>
          <h1 className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">
            CRICKET PLAYER DATABASE
          </h1>
          <p className="text-sm text-slate-400">
            Browse, search and filter all registered cricket players available for auction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('register_player')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-950/40"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register as Player (ફોર્મ ભરો)</span>
          </button>

          <button
            onClick={() => openWhatsAppShare(getWhatsAppShareText('player_reg', playerRegUrl))}
            className="px-3.5 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-bold transition flex items-center gap-1.5"
            title="Share Player Registration URL on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">WhatsApp Share</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
            title="Copy Registration Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied URL!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={() => {
              setUserRole('admin');
              setCurrentTab('admin');
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin Desk</span>
          </button>
        </div>
      </div>

      {/* Share Links Modal */}
      <ShareLinksModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onNavigateTab={setCurrentTab}
      />

      {/* Search & Filter Controls */}
      <div className="space-y-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-search-players"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by player name, nickname, city, team..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-4 flex items-center gap-2">
            <div className="relative flex-1">
              <select
                id="select-sort-players"
                value={sortBy || 'basePrice'}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="basePrice">Sort by Base Price</option>
                <option value="runs">Sort by Career Runs</option>
                <option value="wickets">Sort by Career Wickets</option>
                <option value="name">Sort by Player Name</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-3 bg-slate-950 border border-slate-700 rounded-2xl text-amber-400 hover:bg-slate-800"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
          {filterTabs.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                id={`filter-pill-${filter.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition border ${
                  isActive
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Players Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing <strong>{filteredPlayers.length}</strong> of {players.length} players</span>
          {activeFilter !== 'All' && <span>Filtered by: <strong className="text-amber-400">{activeFilter}</strong></span>}
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-2xl">
              🏏
            </div>
            <p className="text-lg font-bold text-white">
              {players.length === 0 ? 'No Players on Firebase Cloud Database' : 'No players found matching your criteria'}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {players.length === 0
                ? 'Your tournament roster is currently empty. Click below to add new players or import via CSV.'
                : 'Try adjusting your search query or reset filter pills.'}
            </p>
            {players.length === 0 ? (
              <button
                onClick={() => {
                  setUserRole('admin');
                  setCurrentTab('admin');
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Players in Admin</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('All');
                }}
                className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-semibold text-amber-400"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => {
              const isSold = player.status === 'sold';
              const isUnsold = player.status === 'unsold';
              const isInAuction = player.status === 'in_auction';

              return (
                <div
                  key={player.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image & Status Badges */}
                    <div className="relative h-60 overflow-hidden bg-slate-950">
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Role Pill */}
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                        {player.role}
                      </div>

                      {/* Status Tag */}
                      <div className="absolute top-3 right-3">
                        {isSold ? (
                          <span className="bg-emerald-500 text-black font-black text-[10px] px-2.5 py-1 rounded-full shadow uppercase">
                            SOLD • {formatINR(player.soldPrice)}
                          </span>
                        ) : isUnsold ? (
                          <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow uppercase">
                            UNSOLD
                          </span>
                        ) : isInAuction ? (
                          <span className="bg-amber-500 text-black font-black text-[10px] px-2 py-0.5 rounded-full shadow animate-pulse uppercase">
                            LIVE IN BID
                          </span>
                        ) : (
                          <span className="bg-blue-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-400/40 uppercase">
                            AVAILABLE
                          </span>
                        )}
                      </div>

                      {/* Name & Origin */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[11px] text-slate-300 font-medium">{player.city} • Age {player.age}</span>
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                          {player.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 italic font-medium">“{player.nickname}”</p>
                      </div>
                    </div>

                    {/* Styles & Specs */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Batting</span>
                          <span className="text-slate-200 font-medium truncate block">{player.battingStyle}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Bowling</span>
                          <span className="text-slate-200 font-medium truncate block">{player.bowlingStyle}</span>
                        </div>
                      </div>

                      {/* Key Stats Bar */}
                      <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-950/50 p-2 rounded-xl border border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Matches</span>
                          <strong className="text-white font-digital">{player.stats.matches}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Runs</span>
                          <strong className="text-amber-400 font-digital">{player.stats.runs}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Wickets</span>
                          <strong className="text-emerald-400 font-digital">{player.stats.wickets}</strong>
                        </div>
                      </div>

                      {/* Base Price & Sold Banner */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-400">Base Price:</span>
                        <span className="text-amber-400 font-extrabold font-digital text-sm">
                          {formatINR(player.basePrice)}
                        </span>
                      </div>

                      {isSold && player.soldToTeamName && (
                        <div className="bg-emerald-950/50 border border-emerald-500/30 p-2 rounded-xl text-center text-xs">
                          <span className="text-slate-400 text-[10px] block">Acquired By:</span>
                          <strong className="text-emerald-300 font-bold">{player.soldToTeamName}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      id={`btn-view-profile-${player.id}`}
                      onClick={() => viewPlayerDetails(player.id)}
                      className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Profile</span>
                    </button>

                    {isSold ? (
                      <button
                        onClick={() => viewPlayerDetails(player.id)}
                        className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold"
                      >
                        Sold Detail
                      </button>
                    ) : (
                      <button
                        id={`btn-auction-player-${player.id}`}
                        onClick={() => startAuctionForPlayer(player.id)}
                        className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow transition active:scale-95"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                        <span>Bid Now</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

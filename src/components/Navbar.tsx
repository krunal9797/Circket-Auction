import React, { useState } from 'react';
import { 
  Gavel, 
  Users, 
  Trophy, 
  Radio, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Play, 
  PieChart, 
  Layers, 
  Menu, 
  X,
  Wallet,
  Sparkles,
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { ViewTab } from '../types';
import { formatINR } from '../utils/formatters';

export const Navbar: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    auctionState, 
    userRole, 
    setUserRole, 
    teams, 
    activeBiddingTeamId, 
    setActiveBiddingTeamId,
    isMuted,
    toggleMute,
    stats,
    syncStatus,
    isCloudSynced
  } = useAuction();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeTeam = teams.find(t => t.id === activeBiddingTeamId) || teams[0];

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { 
      id: 'live_auction', 
      label: 'Live Auction', 
      icon: <Radio className={`w-4 h-4 ${auctionState.isLive ? 'text-red-400 animate-pulse' : ''}`} />,
      badge: auctionState.isLive ? 'LIVE' : undefined
    },
    { id: 'auction_board', label: 'Broadcast Board', icon: <Layers className="w-4 h-4" /> },
    { id: 'players', label: 'Players', icon: <Users className="w-4 h-4" />, badge: stats.playersAvailable },
    { id: 'teams', label: 'Teams', icon: <ShieldCheck className="w-4 h-4" />, badge: stats.totalTeams },
    { id: 'results', label: 'Results', icon: <PieChart className="w-4 h-4" />, badge: stats.playersSold },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin Desk', icon: <Gavel className="w-4 h-4 text-amber-400" /> },
  ];

  const handleTabClick = (tabId: ViewTab) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#090D16]/95 backdrop-blur-md border-b border-amber-500/20 shadow-xl shadow-black/50">
      {/* Top Ticker Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-black py-1 px-4 text-xs font-bold tracking-wider flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="font-sports text-sm tracking-wide uppercase">IPL STYLE MEGA CRICKET AUCTION 2026</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] font-semibold tracking-normal">
          <span>Starting Budget: <strong className="font-bold">₹1,00,000 / Team</strong></span>
          <span>•</span>
          <span>Sold Players: <strong className="font-bold">{stats.playersSold}</strong></span>
          <span>•</span>
          <span>Total Spent: <strong className="font-bold">{formatINR(stats.totalAuctionValue)}</strong></span>
          <span>•</span>
          <span>Purse Left: <strong className="font-bold">{formatINR((stats.totalTeams * 100000) - stats.totalAuctionValue)}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          {auctionState.isLive && (
            <span className="bg-black text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
              AUCTION IN PROGRESS
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button 
            id="nav-brand-logo"
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 text-left group transition"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform border border-amber-300/40">
              <Gavel className="w-5 h-5 text-black transform -rotate-12" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#090D16] flex items-center justify-center text-[8px] font-black text-black">
                🏏
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sports text-2xl font-bold tracking-wider text-white group-hover:text-amber-400 transition-colors">
                  CRICKET AUCTION
                </span>
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-amber-400/80 -mt-1 tracking-widest uppercase font-semibold">
                Bid • Build • Conquer
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      item.badge === 'LIVE'
                        ? 'bg-red-500 text-white animate-pulse'
                        : isActive
                        ? 'bg-amber-400 text-black'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Cloud Sync, Team Selector & Sound Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Cloud Firestore Sync Status Badge */}
            <div 
              id="cloud-sync-status-badge"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold ${
                syncStatus === 'synced'
                  ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                  : syncStatus === 'connecting'
                  ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title={
                syncStatus === 'synced'
                  ? 'Cloud Firestore Realtime Sync Active'
                  : syncStatus === 'connecting'
                  ? 'Connecting to Firestore...'
                  : 'Operating in Local Mode'
              }
            >
              {syncStatus === 'synced' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <Cloud className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[11px]">Cloud Live</span>
                </>
              ) : syncStatus === 'connecting' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden xl:inline text-[11px]">Connecting</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[11px]">Offline Cache</span>
                </>
              )}
            </div>

            {/* Quick Bidding Team Selector */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-inner">
              <span className="text-[11px] text-slate-400 mr-2 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                Team:
              </span>
              <select
                id="header-team-selector"
                value={activeBiddingTeamId}
                onChange={(e) => setActiveBiddingTeamId(e.target.value)}
                className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none cursor-pointer pr-1"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                    {t.name} ({formatINR(t.remainingBudget)})
                  </option>
                ))}
              </select>
            </div>

            {/* Mute Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={toggleMute}
              title={isMuted ? 'Unmute Stadium Sounds' : 'Mute Sounds'}
              className={`p-2 rounded-lg border transition ${
                isMuted
                  ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Role Switcher Pill */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-0.5 flex text-xs">
              <button
                id="role-bidder-btn"
                onClick={() => setUserRole('team_bidder')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  userRole === 'team_bidder'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bidder
              </button>
              <button
                id="role-admin-btn"
                onClick={() => {
                  setUserRole('admin');
                  setCurrentTab('admin');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  userRole === 'admin'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="btn-mobile-sound-toggle"
              onClick={toggleMute}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090D16] border-b border-slate-800 px-4 py-4 space-y-2 shadow-2xl">
          {/* Active Team selector */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 mb-3">
            <label className="text-xs text-slate-400 block mb-1">Your Bidding Team:</label>
            <select
              id="mobile-team-selector"
              value={activeBiddingTeamId}
              onChange={(e) => setActiveBiddingTeamId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-amber-400 text-sm font-bold rounded-lg p-2"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} • Purse: {formatINR(t.remainingBudget)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`p-2.5 rounded-lg text-sm font-medium text-left flex items-center justify-between border ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-400 text-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

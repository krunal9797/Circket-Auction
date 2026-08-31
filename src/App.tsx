import React from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LiveAuctionPage } from './components/LiveAuctionPage';
import { LiveAuctionBoard } from './components/LiveAuctionBoard';
import { PlayerDatabase } from './components/PlayerDatabase';
import { PlayerProfileView } from './components/PlayerProfileView';
import { TeamsPage } from './components/TeamsPage';
import { TeamDetailPage } from './components/TeamDetailPage';
import { AuctionResultPage } from './components/AuctionResultPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { AdminPanel } from './components/AdminPanel';
import { 
  Trophy, 
  ShieldCheck, 
  Gavel, 
  Users, 
  Clock, 
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
  Volume2
} from 'lucide-react';
import { formatINR } from './utils/formatters';

const AppContent: React.FC = () => {
  const { currentTab, activePlayer, auctionState, teams, setCurrentTab, nextPlayerInQueue } = useAuction();

  const soldTeam = teams.find(t => t.id === auctionState.highestBidderTeamId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && <HomePage />}
        {currentTab === 'live_auction' && <LiveAuctionPage />}
        {currentTab === 'auction_board' && <LiveAuctionBoard />}
        {currentTab === 'players' && <PlayerDatabase />}
        {currentTab === 'player_profile' && <PlayerProfileView />}
        {currentTab === 'teams' && <TeamsPage />}
        {currentTab === 'team_detail' && <TeamDetailPage />}
        {currentTab === 'results' && <AuctionResultPage />}
        {currentTab === 'leaderboard' && <LeaderboardPage />}
        {currentTab === 'admin' && <AdminPanel />}
      </main>

      {/* SOLD / UNSOLD OVERLAY CELEBRATION MODAL */}
      {auctionState.phase === 'sold' && activePlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl shadow-emerald-500/20 relative overflow-hidden animate-bounceSubtle">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl" />
            
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
              <Gavel className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-emerald-500 text-black font-black text-xs px-4 py-1 rounded-full uppercase tracking-widest">
                HAMMER DOWN • SOLD!
              </span>
              <h2 className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide mt-3 uppercase">
                {activePlayer.name}
              </h2>
              <p className="text-xs text-amber-400 font-semibold">{activePlayer.role} • {activePlayer.city}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-bold block">Acquired By</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{soldTeam?.logo || '🏏'}</span>
                <span className="text-xl font-bold text-white">{soldTeam?.name || 'Winning Franchise'}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Winning Hammer Bid:</span>
                <span className="font-digital text-2xl font-black text-emerald-400">
                  {formatINR(auctionState.currentBid)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setCurrentTab('results')}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
              >
                View Summary
              </button>
              <button
                onClick={nextPlayerInQueue}
                className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition"
              >
                <span>Next Lot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNSOLD MODAL */}
      {auctionState.phase === 'unsold' && activePlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-red-500/80 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl shadow-red-500/20">
            <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto text-red-400">
              <XCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-red-500 text-white font-black text-xs px-4 py-1 rounded-full uppercase tracking-widest">
                NO BIDS RECEIVED
              </span>
              <h2 className="font-sports text-4xl sm:text-5xl font-bold text-white tracking-wide mt-3 uppercase">
                {activePlayer.name}
              </h2>
              <p className="text-xs text-slate-400 font-semibold">Passed into Unsold Pool at {formatINR(activePlayer.basePrice)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setCurrentTab('players')}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
              >
                Player Pool
              </button>
              <button
                onClick={nextPlayerInQueue}
                className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider"
              >
                Draft Next Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Footer */}
      <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/95 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg">
              🏏
            </div>
            <div>
              <span className="font-sports text-xl font-bold text-white tracking-wider block">
                CRICKET AUCTION PRO • KPL
              </span>
              <span className="text-[11px] text-amber-400 font-semibold">
                Katasvan Premier League 2026 • Standard ₹1,00,000 Team Purse
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <button onClick={() => setCurrentTab('home')} className="hover:text-amber-400 transition">Home</button>
            <button onClick={() => setCurrentTab('live_auction')} className="hover:text-amber-400 transition">Live Auction</button>
            <button onClick={() => setCurrentTab('auction_board')} className="hover:text-amber-400 transition">Broadcast Board</button>
            <button onClick={() => setCurrentTab('players')} className="hover:text-amber-400 transition">Players</button>
            <button onClick={() => setCurrentTab('teams')} className="hover:text-amber-400 transition">Teams</button>
            <button onClick={() => setCurrentTab('results')} className="hover:text-amber-400 transition">Results</button>
            <button onClick={() => setCurrentTab('leaderboard')} className="hover:text-amber-400 transition">Standings</button>
            <button onClick={() => setCurrentTab('admin')} className="text-amber-400 hover:underline">Admin Desk</button>
          </div>

          <div className="text-center md:text-right text-xs">
            <div className="text-white font-bold">
              Built & Designed by <span className="text-amber-400">Er. Krunal Gamit</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Live Cloud Firestore Synchronized Auction Platform
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuctionProvider>
      <AppContent />
    </AuctionProvider>
  );
}

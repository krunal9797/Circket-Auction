import React from 'react';
import { 
  ArrowLeft, 
  Gavel, 
  TrendingUp, 
  Award, 
  Calendar, 
  MapPin, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  Sparkles,
  Share2
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatINR, formatTime } from '../utils/formatters';

export const PlayerProfileView: React.FC = () => {
  const { 
    players, 
    selectedPlayerId, 
    setCurrentTab, 
    startAuctionForPlayer,
    teams,
    viewTeamDetails
  } = useAuction();

  const player = players.find(p => p.id === selectedPlayerId) || players[0];

  if (!player) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Player not found</p>
        <button onClick={() => setCurrentTab('players')} className="text-amber-400 mt-2">
          Back to Player Database
        </button>
      </div>
    );
  }

  const isSold = player.status === 'sold';
  const isUnsold = player.status === 'unsold';
  const soldTeam = teams.find(t => t.id === player.soldToTeamId);

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => setCurrentTab('players')}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Players</span>
        </button>

        <div className="flex items-center gap-3">
          {isSold ? (
            <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>SOLD FOR {formatINR(player.soldPrice)}</span>
            </div>
          ) : (
            <button
              onClick={() => startAuctionForPlayer(player.id)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider transition shadow flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              <span>Put on Live Auction</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: LARGE PLAYER PHOTO */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
            <div className="h-[440px]">
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Role Floating Badge */}
            <div className="absolute top-4 left-4 bg-amber-500 text-black font-black text-xs px-3.5 py-1 rounded-full uppercase shadow-lg">
              {player.role}
            </div>

            {/* Status Overlay */}
            <div className="absolute top-4 right-4">
              {isSold ? (
                <span className="bg-emerald-500 text-black font-black text-xs px-3 py-1 rounded-full shadow uppercase">
                  SOLD
                </span>
              ) : isUnsold ? (
                <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow uppercase">
                  UNSOLD
                </span>
              ) : (
                <span className="bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow uppercase">
                  AVAILABLE
                </span>
              )}
            </div>

            {/* Base Price Strip */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">BASE AUCTION PRICE</span>
                <span className="font-digital text-2xl font-extrabold text-amber-400">
                  {formatINR(player.basePrice)}
                </span>
              </div>

              {isSold && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">SOLD PRICE</span>
                  <span className="font-digital text-2xl font-extrabold text-emerald-400">
                    {formatINR(player.soldPrice)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Acquired Franchise Card */}
          {isSold && soldTeam && (
            <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{soldTeam.logo}</span>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Franchise</span>
                  <h4 className="font-bold text-sm text-white">{soldTeam.name}</h4>
                  <span className="text-xs text-slate-400">Captain: {soldTeam.captain}</span>
                </div>
              </div>
              <button
                onClick={() => viewTeamDetails(soldTeam.id)}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                View Squad →
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: PLAYER BIODATA & CAREER STATISTICS */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Info */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-widest">
                <span>Official Draft Record</span>
                <span>•</span>
                <span>ID: {player.id}</span>
              </div>
              <h1 className="font-sports text-5xl font-bold text-white tracking-wide mt-1">
                {player.name}
              </h1>
              <p className="text-sm text-slate-400 italic font-medium -mt-1">
                “{player.nickname}”
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {player.bio}
            </p>

            {/* Biodata Key-Value Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Age / DOB</span>
                <strong className="text-xs text-slate-200">{player.age} Yrs ({player.dob})</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Home City</span>
                <strong className="text-xs text-slate-200">{player.city}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Role Category</span>
                <strong className="text-xs text-amber-400">{player.role}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Batting Style</span>
                <strong className="text-xs text-slate-200">{player.battingStyle}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Bowling Style</span>
                <strong className="text-xs text-slate-200">{player.bowlingStyle}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Base Valuation</span>
                <strong className="text-xs text-amber-400 font-digital">{formatINR(player.basePrice)}</strong>
              </div>
            </div>
          </div>

          {/* CAREER STATISTICS COMPREHENSIVE TABLE */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-sports text-2xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <span>CAREER TOURNAMENT STATISTICS</span>
              </h3>
              <span className="text-xs text-slate-400">All T20 Formats</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Matches</span>
                <strong className="text-xl font-bold text-white font-digital">{player.stats.matches}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Innings</span>
                <strong className="text-xl font-bold text-white font-digital">{player.stats.innings}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Runs</span>
                <strong className="text-xl font-bold text-amber-400 font-digital">{player.stats.runs}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Highest Score</span>
                <strong className="text-xl font-bold text-yellow-300 font-digital">{player.stats.highestScore}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Batting Average</span>
                <strong className="text-xl font-bold text-slate-200 font-digital">{player.stats.average}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Strike Rate</span>
                <strong className="text-xl font-bold text-cyan-400 font-digital">{player.stats.strikeRate}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">50s / 100s</span>
                <strong className="text-xl font-bold text-slate-200 font-digital">{player.stats.fifties} / {player.stats.hundreds}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Wickets</span>
                <strong className="text-xl font-bold text-emerald-400 font-digital">{player.stats.wickets}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Economy</span>
                <strong className="text-xl font-bold text-purple-400 font-digital">{player.stats.economy || 'N/A'}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Best Bowling</span>
                <strong className="text-xl font-bold text-emerald-300 font-digital">{player.stats.bestBowling}</strong>
              </div>
            </div>
          </div>

          {/* AUCTION HISTORY TIMELINE */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-sports text-2xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" />
                <span>AUCTION BIDDING HISTORY</span>
              </h3>
              <span className="text-xs text-slate-400">
                {player.bidHistory.length > 0 ? `${player.bidHistory.length} Bids Logged` : 'No Live Bids Yet'}
              </span>
            </div>

            {player.bidHistory.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                This player has not received any live bids yet. Put on the auction hammer to start!
              </div>
            ) : (
              <div className="space-y-2.5">
                {player.bidHistory.map((b, idx) => {
                  const isFinal = idx === 0;
                  return (
                    <div
                      key={b.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between ${
                        isFinal && isSold
                          ? 'bg-emerald-500/10 border-emerald-500/50 shadow'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center font-digital">
                          #{b.round || idx + 1}
                        </span>
                        <div>
                          <strong className="text-sm font-bold text-white">{b.teamName}</strong>
                          <span className="text-[10px] text-slate-400 block font-digital">
                            {formatTime(b.timestamp)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-digital text-base font-extrabold text-amber-400 block">
                          {formatINR(b.amount)}
                        </span>
                        {isFinal && isSold && (
                          <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-500/20 px-2 py-0.5 rounded">
                            WINNING BID
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

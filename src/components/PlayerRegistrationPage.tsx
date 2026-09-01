import React, { useState } from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Trophy, 
  Flame, 
  Award,
  ChevronRight,
  Image as ImageIcon,
  Phone,
  Calendar,
  MapPin,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { PlayerRole, BattingStyle, BowlingStyle, Player } from '../types';
import { formatINR } from '../utils/formatters';
import { getShareableUrl, getWhatsAppShareText, openWhatsAppShare, copyToClipboard } from '../utils/shareUtils';

// Curated high quality cricket player action photo presets
const PHOTO_PRESETS = [
  {
    label: 'Aggressive Batsman',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    role: 'Batsman'
  },
  {
    label: 'Fast Bowler in Action',
    url: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=800&auto=format&fit=crop&q=80',
    role: 'Bowler'
  },
  {
    label: 'Dynamic All-Rounder',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    role: 'All-Rounder'
  },
  {
    label: 'Wicket Keeper Gloves',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
    role: 'Wicket Keeper'
  },
  {
    label: 'Power Hitter Focus',
    url: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800&auto=format&fit=crop&q=80',
    role: 'Batsman'
  },
  {
    label: 'Spin Wizard Delivery',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    role: 'Bowler'
  }
];

export const PlayerRegistrationPage: React.FC = () => {
  const { addPlayer, setCurrentTab, stats } = useAuction();

  const [form, setForm] = useState({
    name: '',
    nickname: '',
    phone: '',
    whatsapp: '',
    email: '',
    role: 'All-Rounder' as PlayerRole,
    age: 22,
    dob: '',
    city: 'Katasvan',
    battingStyle: 'Right-hand bat' as BattingStyle,
    bowlingStyle: 'Right-arm medium' as BowlingStyle,
    basePrice: 10000,
    matches: 25,
    innings: 20,
    runs: 450,
    highestScore: '68*',
    average: 28.5,
    strikeRate: 135.2,
    fifties: 2,
    hundreds: 0,
    wickets: 18,
    economy: 7.2,
    bestBowling: '4/18',
    jerseyNumber: '18',
    bio: '',
    image: PHOTO_PRESETS[2].url,
    agreeTerms: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPlayer, setSubmittedPlayer] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const directPageUrl = getShareableUrl('register_player');

  const handlePresetSelect = (url: string) => {
    setForm(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsSubmitting(true);
    try {
      const newPlayerData = {
        name: form.name.trim(),
        nickname: form.nickname.trim() || form.name.split(' ')[0],
        image: form.image || PHOTO_PRESETS[0].url,
        role: form.role,
        age: Number(form.age) || 22,
        dob: form.dob || '2004-01-01',
        city: form.city.trim() || 'Katasvan',
        battingStyle: form.battingStyle,
        bowlingStyle: form.bowlingStyle,
        basePrice: Number(form.basePrice) || 10000,
        stats: {
          matches: Number(form.matches) || 0,
          innings: Number(form.innings) || 0,
          runs: Number(form.runs) || 0,
          highestScore: form.highestScore || '0',
          average: Number(form.average) || 0,
          strikeRate: Number(form.strikeRate) || 0,
          fifties: Number(form.fifties) || 0,
          hundreds: Number(form.hundreds) || 0,
          wickets: Number(form.wickets) || 0,
          economy: Number(form.economy) || 0,
          bestBowling: form.bestBowling || '0/0',
        },
        bio: form.bio.trim() || `${form.role} from ${form.city}. Ready for KPL 2026.`,
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim() || form.phone.trim(),
        email: form.email.trim(),
        jerseyNumber: form.jerseyNumber.trim() || '7',
        registeredAt: new Date().toISOString(),
        isFeatured: form.basePrice >= 15000,
      };

      await addPlayer(newPlayerData);

      setSubmittedPlayer({
        ...newPlayerData,
        regId: `KPL-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    } catch (err) {
      console.error('Error submitting player registration:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setSubmittedPlayer(null);
    setForm(prev => ({
      ...prev,
      name: '',
      nickname: '',
      phone: '',
      whatsapp: '',
      dob: '',
      highestScore: '',
      bestBowling: '',
      bio: '',
    }));
  };

  const handleCopyDirectLink = async () => {
    const success = await copyToClipboard(directPageUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const playerShareText = getWhatsAppShareText('player_reg', directPageUrl);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fadeIn">
      {/* Top Banner & Quick Share Bar */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>KPL 2026 • OFFICIAL PLAYER REGISTRATION</span>
            </div>
            <h1 className="font-sports text-3xl sm:text-5xl font-extrabold text-white tracking-wide uppercase">
              ખેલાડી રજીસ્ટ્રેશન ફોર્મ
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Register yourself for the <strong>Katasvan Premier League 2026</strong> live cricket auction. Fill in your playing style, career statistics, and base price.
            </p>
          </div>

          {/* Quick Share This Registration Link Button */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => openWhatsAppShare(playerShareText)}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp પર લિંક મોકલો</span>
            </button>

            <button
              onClick={handleCopyDirectLink}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition border ${
                copiedLink
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>લિંક કોપી થઈ ગઈ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Copy Registration Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS CARD: Registration Completed Pass */}
      {submittedPlayer ? (
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400" />

          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-500 text-black font-black text-xs px-4 py-1 rounded-full uppercase tracking-widest">
              REGISTRATION CONFIRMED
            </span>
            <h2 className="font-sports text-3xl sm:text-4xl font-bold text-white uppercase mt-2">
              Welcome to KPL 2026 Auction Pool!
            </h2>
            <p className="text-sm text-slate-300">
              અભિનંદન <strong>{submittedPlayer.name}</strong>! તમારું રજીસ્ટ્રેશન સફળતાપૂર્વક થઈ ગયેલ છે.
            </p>
          </div>

          {/* Digital Player Auction Card */}
          <div className="max-w-md mx-auto bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-left space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">PASS ID</span>
                <span className="font-mono text-base font-bold text-amber-400">{submittedPlayer.regId}</span>
              </div>
              <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                {submittedPlayer.role}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={submittedPlayer.image}
                alt={submittedPlayer.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-md shrink-0"
              />
              <div>
                <h3 className="font-sports text-2xl font-bold text-white uppercase">{submittedPlayer.name}</h3>
                <p className="text-xs text-slate-400">{submittedPlayer.city} • Age {submittedPlayer.age}</p>
                <div className="mt-2 text-xs font-bold text-emerald-400">
                  Base Price: <span className="font-digital text-base text-amber-400">{formatINR(submittedPlayer.basePrice)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Batting</span>
                <span className="text-white font-semibold">{submittedPlayer.battingStyle}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Bowling</span>
                <span className="text-white font-semibold">{submittedPlayer.bowlingStyle}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => openWhatsAppShare(
                `🏏 *I just registered for KATASVAN PREMIER LEAGUE 2026 Auction!* 🏏\n` +
                `👤 Name: ${submittedPlayer.name} (${submittedPlayer.role})\n` +
                `📍 City: ${submittedPlayer.city}\n` +
                `💰 Base Price: ${formatINR(submittedPlayer.basePrice)}\n` +
                `Registration ID: ${submittedPlayer.regId}\n\n` +
                `👉 Register your name too: ${directPageUrl}`
              )}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Share My Card on WhatsApp</span>
            </button>

            <button
              onClick={() => setCurrentTab('players')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>View In Player Pool</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetForAnother}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Register Another Player
            </button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <UserPlus className="w-5 h-5 text-amber-400" />
              <h2 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                1. Personal Details / વ્યક્તિગત માહિતી
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Full Name (પૂરું નામ) *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Hardik Patel, Rohit Gamit"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Nickname / Jersey Name (ઉપનામ)
                </label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  placeholder="e.g. Harry, Hitman, Bullet"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  WhatsApp / Mobile Number (મોબાઇલ નંબર) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-xs font-mono font-bold">+91</span>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value, whatsapp: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  City / Village / Locality (ગામ / શહેર) *
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Katasvan, Songadh, Vyara, Surat"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Age (ઉંમર) *
                </label>
                <input
                  type="number"
                  min="14"
                  max="60"
                  required
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Preferred Jersey Number (જર્સી નંબર)
                </label>
                <input
                  type="text"
                  value={form.jerseyNumber}
                  onChange={(e) => setForm({ ...form, jerseyNumber: e.target.value })}
                  placeholder="e.g. 7, 18, 45, 99"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Cricket Role & Style */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Activity className="w-5 h-5 text-amber-400" />
              <h2 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                2. Cricket Role & Style / રમતની શૈલી
              </h2>
            </div>

            {/* Role Picker Buttons */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-2">
                Primary Playing Role (મુખ્ય રોલ) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper'] as PlayerRole[]).map((r) => {
                  const isSelected = form.role === r;
                  return (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setForm({ ...form, role: r })}
                      className={`p-3.5 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1.5 border text-center ${
                        isSelected
                          ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                          : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-lg">
                        {r === 'Batsman' ? '🏏' : r === 'Bowler' ? '🎯' : r === 'All-Rounder' ? '⚡' : '🧤'}
                      </span>
                      <span>{r}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Batting Style (બેટિંગ શૈલી) *
                </label>
                <select
                  value={form.battingStyle}
                  onChange={(e) => setForm({ ...form, battingStyle: e.target.value as BattingStyle })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Right-hand bat">Right-hand bat (જમણેરી બેટ્સમેન)</option>
                  <option value="Left-hand bat">Left-hand bat (ડાબોડી બેટ્સમેન)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Bowling Style (બોલિંગ શૈલી) *
                </label>
                <select
                  value={form.bowlingStyle}
                  onChange={(e) => setForm({ ...form, bowlingStyle: e.target.value as BowlingStyle })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Right-arm fast">Right-arm fast (જમણેરી ફાસ્ટ)</option>
                  <option value="Right-arm medium">Right-arm medium (જમણેરી મીડિયમ)</option>
                  <option value="Right-arm off-break">Right-arm off-break (ઓફ સ્પિન)</option>
                  <option value="Right-arm leg-break">Right-arm leg-break (લેગ સ્પિન)</option>
                  <option value="Left-arm fast">Left-arm fast (ડાબોડી ફાસ્ટ)</option>
                  <option value="Left-arm medium">Left-arm medium (ડાબોડી મીડિયમ)</option>
                  <option value="Left-arm orthodox">Left-arm orthodox (ડાબોડી સ્પિન)</option>
                  <option value="None">None / Pure Batsman</option>
                </select>
              </div>
            </div>

            {/* Base Price Selection */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-2">
                Requested Base Price (અપેક્ષિત બેઝ પ્રાઈઝ) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[5000, 10000, 15000, 20000, 25000].map((bp) => {
                  const isSelected = form.basePrice === bp;
                  return (
                    <button
                      type="button"
                      key={bp}
                      onClick={() => setForm({ ...form, basePrice: bp })}
                      className={`p-3 rounded-xl text-xs font-bold font-digital transition border text-center ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm block">{formatINR(bp)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Profile Photo / Action Avatar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <h2 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                3. Player Photo / ફોટો પસંદ કરો
              </h2>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-3">
                Select an action avatar preset or enter your custom photo URL:
              </p>

              {/* Action photo presets */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-3">
                {PHOTO_PRESETS.map((preset, idx) => {
                  const isSelected = form.image === preset.url;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handlePresetSelect(preset.url)}
                      className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition ${
                        isSelected ? 'border-amber-400 scale-105 shadow-lg shadow-amber-500/30' : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white font-bold drop-shadow" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Custom Photo URL (ઓપ્શનલ)</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Statistics & Records */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                4. Cricket Stats & Records / પાછલા રેકોર્ડ્સ
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Matches Played</label>
                <input
                  type="number"
                  value={form.matches}
                  onChange={(e) => setForm({ ...form, matches: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Total Runs</label>
                <input
                  type="number"
                  value={form.runs}
                  onChange={(e) => setForm({ ...form, runs: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Highest Score</label>
                <input
                  type="text"
                  value={form.highestScore}
                  onChange={(e) => setForm({ ...form, highestScore: e.target.value })}
                  placeholder="e.g. 74*"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Total Wickets</label>
                <input
                  type="number"
                  value={form.wickets}
                  onChange={(e) => setForm({ ...form, wickets: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Best Bowling</label>
                <input
                  type="text"
                  value={form.bestBowling}
                  onChange={(e) => setForm({ ...form, bestBowling: e.target.value })}
                  placeholder="e.g. 4/15"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Strike Rate</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.strikeRate}
                  onChange={(e) => setForm({ ...form, strikeRate: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">50s Scored</label>
                <input
                  type="number"
                  value={form.fifties}
                  onChange={(e) => setForm({ ...form, fifties: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Economy Rate</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.economy}
                  onChange={(e) => setForm({ ...form, economy: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1.5">
                Player Bio / Achievements (તમારી સિદ્ધિઓ / નોંધ)
              </label>
              <textarea
                rows={2}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="e.g. Hard-hitting middle-order finisher and death overs specialist. Won Man of the Match in Songadh Cup 2025."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Section 5: Terms & Submit */}
          <div className="pt-2 border-t border-slate-800 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={form.agreeTerms}
                onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                className="w-5 h-5 rounded text-amber-500 bg-slate-950 border-slate-700 mt-0.5"
              />
              <span className="text-xs text-slate-400">
                હું ખાતરી આપું છું કે ઉપર આપેલી તમામ માહિતી સાચી છે અને હું <strong>Katasvan Premier League 2026</strong> ટુર્નામેન્ટના તમામ નિયમોનું પાલન કરીશ. (I agree to tournament rules and player pool auction terms).
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-base uppercase tracking-wider shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2.5 transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>સબમિટ થઈ રહ્યું છે...</span>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>SUBMIT PLAYER REGISTRATION (રજીસ્ટર કરો)</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

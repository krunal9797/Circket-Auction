import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  ArrowRight, 
  Lock, 
  KeyRound, 
  Trophy, 
  Flame, 
  Palette, 
  Users, 
  Wallet,
  Phone,
  Crown
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatINR } from '../utils/formatters';
import { getShareableUrl, getWhatsAppShareText, openWhatsAppShare, copyToClipboard } from '../utils/shareUtils';

const TEAM_EMOJIS = ['🦁', '⚡', '🐅', '🦅', '🔥', '👑', '🚀', '🏏', '🐺', '🛡️', '⚔️', '🌪️'];

const TEAM_COLORS = [
  { label: 'Gold / Amber', value: '#F59E0B' },
  { label: 'Royal Blue', value: '#2563EB' },
  { label: 'Crimson Red', value: '#DC2626' },
  { label: 'Emerald Green', value: '#059669' },
  { label: 'Royal Purple', value: '#7C3AED' },
  { label: 'Cyber Cyan', value: '#06B6D4' },
  { label: 'Sunset Orange', value: '#EA580C' },
  { label: 'Midnight Navy', value: '#1E293B' },
];

export const TeamRegistrationPage: React.FC = () => {
  const { addTeam, setCurrentTab, stats } = useAuction();

  const [form, setForm] = useState({
    name: '',
    shortCode: '',
    logo: '🦁',
    color: '#F59E0B',
    owner: '',
    ownerPhone: '',
    ownerEmail: '',
    captain: '',
    viceCaptain: '',
    managerName: '',
    city: 'Katasvan',
    accessPin: '',
    startingBudget: 100000,
    slogan: '',
    agreeTerms: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTeam, setSubmittedTeam] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const directPageUrl = getShareableUrl('register_team');

  const handleNameChange = (name: string) => {
    // Auto generate shortcode from name if not manually modified
    const words = name.trim().split(' ');
    let code = '';
    if (words.length >= 2) {
      code = words.slice(0, 3).map(w => w[0]?.toUpperCase() || '').join('');
    } else if (words.length === 1 && words[0].length >= 2) {
      code = words[0].slice(0, 3).toUpperCase();
    }
    setForm(prev => ({
      ...prev,
      name,
      shortCode: prev.shortCode ? prev.shortCode : code,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.owner.trim()) return;

    setIsSubmitting(true);
    try {
      const pin = form.accessPin.trim() || String(Math.floor(1000 + Math.random() * 9000));
      const code = (form.shortCode.trim() || form.name.slice(0, 3)).toUpperCase();

      const newTeamData = {
        name: form.name.trim(),
        shortCode: code,
        logo: form.logo.trim() || '🦁',
        color: form.color,
        owner: form.owner.trim(),
        ownerPhone: form.ownerPhone.trim(),
        ownerEmail: form.ownerEmail.trim(),
        captain: form.captain.trim() || form.owner.trim(),
        viceCaptain: form.viceCaptain.trim(),
        managerName: form.managerName.trim(),
        city: form.city.trim() || 'Katasvan',
        accessPin: pin,
        startingBudget: Number(form.startingBudget) || 100000,
        slogan: form.slogan.trim() || `Roar of ${form.name}`,
        registeredAt: new Date().toISOString(),
      };

      await addTeam(newTeamData);

      setSubmittedTeam(newTeamData);
    } catch (err) {
      console.error('Error submitting team registration:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setSubmittedTeam(null);
    setForm({
      name: '',
      shortCode: '',
      logo: '🦁',
      color: '#F59E0B',
      owner: '',
      ownerPhone: '',
      ownerEmail: '',
      captain: '',
      viceCaptain: '',
      managerName: '',
      city: 'Katasvan',
      accessPin: '',
      startingBudget: 100000,
      slogan: '',
      agreeTerms: true,
    });
  };

  const handleCopyDirectLink = async () => {
    const success = await copyToClipboard(directPageUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const teamShareText = getWhatsAppShareText('team_reg', directPageUrl);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fadeIn">
      {/* Top Banner & Quick Share Bar */}
      <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>KPL 2026 • OFFICIAL FRANCHISE REGISTRATION</span>
            </div>
            <h1 className="font-sports text-3xl sm:text-5xl font-extrabold text-white tracking-wide uppercase">
              ટીમ / ફ્રેન્ચાઈઝી રજીસ્ટ્રેશન
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Register your cricket team for <strong>Katasvan Premier League 2026</strong>. Submit franchise details and set your secret 4-Digit PIN for live auction bidding.
            </p>
          </div>

          {/* Quick Share Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => openWhatsAppShare(teamShareText)}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp પર લિંક મોકલો</span>
            </button>

            <button
              onClick={handleCopyDirectLink}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition border ${
                copiedLink
                  ? 'bg-amber-500 text-black border-amber-400'
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
                  <span>Copy Franchise Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS CARD: Team Registration Completed Pass */}
      {submittedTeam ? (
        <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

          <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
            <Crown className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="bg-amber-500 text-black font-black text-xs px-4 py-1 rounded-full uppercase tracking-widest">
              FRANCHISE REGISTERED
            </span>
            <h2 className="font-sports text-3xl sm:text-4xl font-bold text-white uppercase mt-2">
              Welcome {submittedTeam.name}!
            </h2>
            <p className="text-sm text-slate-300">
              અભિનંદન <strong>{submittedTeam.owner}</strong>! તમારી ટીમનું રજીસ્ટ્રેશન KPL 2026 માં થઈ ગયેલ છે.
            </p>
          </div>

          {/* Franchise Pass Card */}
          <div className="max-w-md mx-auto bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-left space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow"
                  style={{ backgroundColor: `${submittedTeam.color}25`, borderColor: submittedTeam.color }}
                >
                  {submittedTeam.logo}
                </div>
                <div>
                  <h3 className="font-sports text-2xl font-bold text-white uppercase">{submittedTeam.name}</h3>
                  <span className="text-xs font-mono font-bold text-amber-400">Code: {submittedTeam.shortCode}</span>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                Active Franchise
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Owner</span>
                <span className="text-white font-semibold text-sm">{submittedTeam.owner}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Captain</span>
                <span className="text-white font-semibold text-sm">{submittedTeam.captain}</span>
              </div>
            </div>

            {/* Secret PIN Box */}
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-[10px] text-amber-400/80 font-bold uppercase block">Your Secret Bidding PIN</span>
                  <span className="text-xs text-slate-300">Used to log in to War Room</span>
                </div>
              </div>
              <span className="font-mono text-xl font-black text-amber-400 bg-black/60 px-3 py-1 rounded-lg border border-amber-500/40 tracking-widest">
                {submittedTeam.accessPin}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Starting Purse:</span>
              <span className="font-digital text-base font-bold text-emerald-400">{formatINR(submittedTeam.startingBudget)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentTab('team_portal')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
            >
              <KeyRound className="w-4 h-4" />
              <span>Launch Team War Room Portal</span>
            </button>

            <button
              onClick={() => openWhatsAppShare(
                `🏆 *${submittedTeam.name} (${submittedTeam.shortCode}) is registered for KPL 2026!* 🏆\n` +
                `👑 Owner: ${submittedTeam.owner}\n` +
                `🏏 Captain: ${submittedTeam.captain}\n` +
                `💰 Starting Purse: ${formatINR(submittedTeam.startingBudget)}\n\n` +
                `👉 Register your team too: ${directPageUrl}`
              )}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Share Franchise on WhatsApp</span>
            </button>

            <button
              onClick={handleResetForAnother}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Register Another Team
            </button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Section 1: Team Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h2 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                1. Team Identity / ટીમનું નામ અને લોગો
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Franchise / Team Name (ટીમનું નામ) *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Katasvan Super Kings, Tapi Titans, Royal Challengers Songadh"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Short Code (શોર્ટ કોડ 2-4 અક્ષર) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={form.shortCode}
                  onChange={(e) => setForm({ ...form, shortCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. KSK, TT, RCS"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white uppercase font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Home City / Village (ગામ / વિસ્તાર) *
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Katasvan, Vyara, Songadh"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Team Crest Emoji Selector */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-2">
                Team Mascot / Crest Emoji (ટીમ લોગો) *
              </label>
              <div className="flex flex-wrap gap-2.5">
                {TEAM_EMOJIS.map((emoji) => {
                  const isSelected = form.logo === emoji;
                  return (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setForm({ ...form, logo: emoji })}
                      className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition border ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Team Theme Color */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-2">
                Team Theme Color (ટીમ કલર)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {TEAM_COLORS.map((col) => {
                  const isSelected = form.color === col.value;
                  return (
                    <button
                      type="button"
                      key={col.value}
                      onClick={() => setForm({ ...form, color: col.value })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                        isSelected
                          ? 'border-white bg-slate-800 text-white shadow-md'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: col.value }} />
                      <span>{col.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Owner & Leadership */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                2. Owner & Leadership / ઓનર અને કેપ્ટન
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Franchise Owner Name (માલિકનું નામ) *
                </label>
                <input
                  type="text"
                  required
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  placeholder="e.g. Mukesh Patel, Sanjay Gamit"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Owner WhatsApp / Phone (મોબાઇલ નંબર) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-xs font-mono font-bold">+91</span>
                  <input
                    type="tel"
                    required
                    value={form.ownerPhone}
                    onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Captain Name (કેપ્ટનનું નામ) *
                </label>
                <input
                  type="text"
                  required
                  value={form.captain}
                  onChange={(e) => setForm({ ...form, captain: e.target.value })}
                  placeholder="e.g. Rahul Gamit"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Vice-Captain / Coach (વાઇસ કેપ્ટન / કોચ)
                </label>
                <input
                  type="text"
                  value={form.viceCaptain}
                  onChange={(e) => setForm({ ...form, viceCaptain: e.target.value })}
                  placeholder="e.g. Amit Patel"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Bidding Security PIN & Purse */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Lock className="w-5 h-5 text-amber-400" />
              <h2 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                3. Bidding Security PIN & Purse / ઓક્શન સિક્યોરિટી
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  4-Digit Secret War Room Access PIN (સિક્રેટ PIN) *
                </label>
                <input
                  type="text"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  required
                  value={form.accessPin}
                  onChange={(e) => setForm({ ...form, accessPin: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="e.g. 7788 or 1234"
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-xl p-3.5 text-base text-amber-400 font-mono font-black tracking-widest focus:outline-none focus:border-amber-400"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  આ 4-Digit PIN વડે તમે લાઈવ ઓક્શનમાં બોલી લગાવવા માટે War Room માં લોગિન કરી શકશો.
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Team Starting Purse (ઓક્શન પર્સ બજેટ)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={form.startingBudget}
                    onChange={(e) => setForm({ ...form, startingBudget: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-3.5 text-sm text-emerald-400 font-digital font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Standard KPL Budget: ₹1,00,000 / Team
                </span>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Team War Cry / Slogan (ટીમ સ્લોગન)
                </label>
                <input
                  type="text"
                  value={form.slogan}
                  onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                  placeholder="e.g. Roar of Katasvan! One Team, One Dream."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Terms & Submit */}
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
                અમે ખાતરી આપીએ છીએ કે અમારી ટીમ <strong>Katasvan Premier League 2026</strong> ટુર્નામેન્ટના નિયમો, ઓક્શન નિયમાવલી અને ખેલદિલીનું સંપૂર્ણ પાલન કરશે.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-base uppercase tracking-wider shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2.5 transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>ટીમ સબમિટ થઈ રહી છે...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>REGISTER TEAM FRANCHISE (ટીમ રજીસ્ટર કરો)</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

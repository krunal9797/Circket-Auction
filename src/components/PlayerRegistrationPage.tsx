import React, { useState, useRef } from 'react';
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
  Image as ImageIcon,
  Phone,
  Calendar,
  MapPin,
  Activity,
  Zap,
  Upload,
  Camera,
  X,
  Shirt,
  CreditCard,
  Receipt,
  FileCheck,
  FileSpreadsheet
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { PlayerRole, BattingStyle, BowlingStyle, Player } from '../types';
import { formatINR } from '../utils/formatters';
import { ExcelImportModal } from './ExcelImportModal';
import { getShareableUrl, getWhatsAppShareText, openWhatsAppShare, copyToClipboard } from '../utils/shareUtils';

const JERSEY_SIZES = ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)', '3XL (46)'];

export const PlayerRegistrationPage: React.FC = () => {
  const { addPlayer, setCurrentTab, stats } = useAuction();

  const [form, setForm] = useState({
    name: '',
    nickname: '', // Jersey Name
    faliyu: '',   // Faliyu (ફળિયું)
    jerseySize: 'M (38)', // Jersey Size
    phone: '',
    whatsapp: '',
    email: '',
    role: 'All-Rounder' as PlayerRole,
    age: 22,
    city: 'Katasvan',
    battingStyle: 'Right-hand bat' as BattingStyle,
    bowlingStyle: 'Right-arm medium' as BowlingStyle,
    jerseyNumber: '7',
    image: '',
    paymentScreenshot: '',
    transactionId: '',
    agreeTerms: true,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPlayer, setSubmittedPlayer] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const paymentFileInputRef = useRef<HTMLInputElement>(null);

  const directPageUrl = getShareableUrl('register_player');

  // Single Player Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ફોટોની સાઈઝ 5MB કરતાં ઓછી હોવી જોઈએ (Please upload an image smaller than 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setForm(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setImagePreview(null);
    setForm(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Payment Screenshot Upload Handler
  const handlePaymentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('પેમેન્ટ સ્ક્રીનશોટની સાઈઝ 5MB કરતાં ઓછી હોવી જોઈએ (Please upload an image smaller than 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPaymentPreview(result);
      setForm(prev => ({ ...prev, paymentScreenshot: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePayment = () => {
    setPaymentPreview(null);
    setForm(prev => ({ ...prev, paymentScreenshot: '' }));
    if (paymentFileInputRef.current) {
      paymentFileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsSubmitting(true);
    try {
      // Default standard tournament base price is ₹1,000
      const standardBasePrice = 1000;
      
      const defaultImage = form.image || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80';

      const newPlayerData: Partial<Player> = {
        name: form.name.trim(),
        nickname: form.nickname.trim() || form.name.split(' ')[0], // Jersey Name
        image: defaultImage,
        role: form.role,
        age: Number(form.age) || 22,
        dob: '2004-01-01',
        city: form.city.trim() || 'Katasvan',
        faliyu: form.faliyu.trim() || '',
        jerseySize: form.jerseySize,
        battingStyle: form.battingStyle,
        bowlingStyle: form.bowlingStyle,
        basePrice: standardBasePrice,
        paymentScreenshot: form.paymentScreenshot || undefined,
        transactionId: form.transactionId.trim() || undefined,
        paymentStatus: form.paymentScreenshot ? 'pending' : 'unpaid',
        stats: {
          matches: 12,
          innings: 10,
          runs: 180,
          highestScore: '42*',
          average: 20.0,
          strikeRate: 120.0,
          fifties: 0,
          hundreds: 0,
          wickets: 6,
          economy: 7.2,
          bestBowling: '2/18',
        },
        bio: `${form.role} from ${form.faliyu ? form.faliyu + ', ' : ''}${form.city}. Ready for KPL 2026.`,
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim() || form.phone.trim(),
        email: form.email.trim(),
        jerseyNumber: form.jerseyNumber.trim() || '7',
        registeredAt: new Date().toISOString(),
        isFeatured: false,
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
    setImagePreview(null);
    setPaymentPreview(null);
    setForm({
      name: '',
      nickname: '',
      faliyu: '',
      jerseySize: 'M (38)',
      phone: '',
      whatsapp: '',
      email: '',
      role: 'All-Rounder',
      age: 22,
      city: 'Katasvan',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      jerseyNumber: '7',
      image: '',
      paymentScreenshot: '',
      transactionId: '',
      agreeTerms: true,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (paymentFileInputRef.current) paymentFileInputRef.current.value = '';
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
              Register yourself for the <strong>Katasvan Premier League 2026</strong> live cricket auction. Fill in your personal details, playing style, and payment proof.
            </p>
          </div>

          {/* Quick Share This Registration Link Button */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => openWhatsAppShare(playerShareText)}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp પર લિંક મોકલો</span>
            </button>

            <button
              onClick={handleCopyDirectLink}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition border cursor-pointer ${
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

            {/* Quick Excel / Forms Import button for Organizers */}
            <button
              onClick={() => setIsExcelModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import Excel / Forms</span>
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
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-md shrink-0 bg-slate-800"
              />
              <div>
                <h3 className="font-sports text-2xl font-bold text-white uppercase">{submittedPlayer.name}</h3>
                {submittedPlayer.nickname && (
                  <p className="text-xs text-amber-400 font-bold">Jersey: "{submittedPlayer.nickname}" #{submittedPlayer.jerseyNumber}</p>
                )}
                <p className="text-xs text-slate-400">
                  {submittedPlayer.faliyu ? `${submittedPlayer.faliyu}, ` : ''}{submittedPlayer.city} • Age {submittedPlayer.age}
                </p>
                {submittedPlayer.jerseySize && (
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    Size: {submittedPlayer.jerseySize}
                  </p>
                )}
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

            {/* Payment Proof Confirmation Pill */}
            {submittedPlayer.paymentScreenshot && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-emerald-400">
                  <img src={submittedPlayer.paymentScreenshot} alt="Receipt" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>પેમેન્ટ સ્ક્રીનશોટ અપલોડ થયો છે</span>
                  </span>
                  {submittedPlayer.transactionId && (
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Ref: {submittedPlayer.transactionId}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => openWhatsAppShare(
                `🏏 *I just registered for KATASVAN PREMIER LEAGUE 2026 Auction!* 🏏\n` +
                `👤 Name: ${submittedPlayer.name} (${submittedPlayer.role})\n` +
                `🎽 Jersey: ${submittedPlayer.nickname || submittedPlayer.name} #${submittedPlayer.jerseyNumber} (Size: ${submittedPlayer.jerseySize})\n` +
                `📍 Faliyu & City: ${submittedPlayer.faliyu ? submittedPlayer.faliyu + ', ' : ''}${submittedPlayer.city}\n` +
                `🎫 Registration ID: ${submittedPlayer.regId}\n\n` +
                `👉 Register your name too: ${directPageUrl}`
              )}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Share My Card on WhatsApp</span>
            </button>

            <button
              onClick={() => setCurrentTab('players')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>View In Player Pool</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetForAnother}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
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
              {/* Full Name */}
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

              {/* Jersey Name (ઉપનામ) */}
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Jersey Name (ઉપનામ) *
                </label>
                <input
                  type="text"
                  required
                  value={form.nickname}
                  onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  placeholder="e.g. Harry, Hitman, Bullet"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Faliyu (ફળિયું / ફળિયાનું નામ) */}
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Faliyu (ફળિયું / ફળિયાનું નામ) *
                </label>
                <input
                  type="text"
                  required
                  value={form.faliyu}
                  onChange={(e) => setForm({ ...form, faliyu: e.target.value })}
                  placeholder="e.g. પટેલ ફળિયું, નિશાળ ફળિયું, તળાવ ફળિયું"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* City / Village */}
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Village / City (ગામ / શહેર) *
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

              {/* WhatsApp / Mobile Number */}
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

              {/* Age */}
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
            </div>

            {/* Jersey Details Row: Jersey Size + Jersey Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Jersey Size */}
              <div>
                <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5 mb-1.5">
                  <Shirt className="w-3.5 h-3.5 text-amber-400" />
                  <span>Jersey Size (જર્સી સાઈઝ) *</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {JERSEY_SIZES.map((size) => {
                    const isSelected = form.jerseySize === size;
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setForm({ ...form, jerseySize: size })}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold transition border cursor-pointer text-center ${
                          isSelected
                            ? 'bg-amber-500 text-black border-amber-400 shadow-md font-black'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Jersey Number */}
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Preferred Jersey Number (જર્સી નંબર) *
                </label>
                <input
                  type="text"
                  required
                  value={form.jerseyNumber}
                  onChange={(e) => setForm({ ...form, jerseyNumber: e.target.value })}
                  placeholder="e.g. 7, 18, 45, 99"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono font-bold"
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
                      className={`p-3.5 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1.5 border text-center cursor-pointer ${
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
          </div>

          {/* Section 3: Profile Photo Upload (Single Upload) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <h2 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                3. Player Photo / ફોટો અપલોડ કરો
              </h2>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <p className="text-xs text-slate-300">
                તમારો એક સ્પષ્ટ પાસપોર્ટ સાઇઝ અથવા ક્રિકેટ ડ્રેસ વાળો ફોટો અપલોડ કરો (Upload single player photo from your mobile or computer):
              </p>

              {/* Hidden File Input for Player Photo */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="player-photo-input"
              />

              {imagePreview ? (
                /* Uploaded Photo Preview Card */
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-900 border border-emerald-500/50 rounded-2xl">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Uploaded Player Photo"
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl"
                    />
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                      Selected
                    </span>
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 font-bold text-xs">
                      <Check className="w-4 h-4" />
                      <span>ફોટો સફળતાપૂર્વક સિલેક્ટ થયો છે</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      This photo will appear on your live auction bidding card and big screen broadcast.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>બીજો ફોટો બદલો</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>હટાવો</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Upload Trigger Dropzone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-400 bg-slate-900/60 hover:bg-slate-900 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition group space-y-3"
                >
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition shadow">
                    <Upload className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">
                      Click to Upload Photo / ફોટો પસંદ કરવા અહી ક્લિક કરો
                    </h3>
                    <p className="text-xs text-slate-400">
                      Supports JPG, PNG, WEBP (Max 5MB). Mobile camera photo supported.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-amber-400 font-semibold border border-slate-700">
                    <Camera className="w-3.5 h-3.5" />
                    <span>કેમેરા અથવા ગેલેરીમાંથી ફોટો લો</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Registration Fee Payment & Screenshot Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <h2 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                  4. Registration Fee Payment / પેમેન્ટ સ્ક્રીનશોટ
                </h2>
              </div>
              <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase">
                Payment Proof
              </span>
            </div>

            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Google Pay, PhonePe, Paytm અથવા UPI પેમેન્ટ સ્ક્રીનશોટ અપલોડ કરો:</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  ટુર્નામેન્ટ રજીસ્ટ્રેશન ફી જમા કરાવીને તેની પહોંચ/ટ્રાન્ઝેક્શનનો સ્ક્રીનશોટ નીચે અપલોડ કરો જેથી ઓર્ગેનાઇઝર તમારી ફી વેરિફાય કરી શકે.
                </p>
              </div>

              {/* Hidden File Input for Payment Screenshot */}
              <input
                type="file"
                ref={paymentFileInputRef}
                accept="image/*"
                onChange={handlePaymentUpload}
                className="hidden"
                id="player-payment-input"
              />

              {paymentPreview ? (
                /* Uploaded Payment Screenshot Preview Card */
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-900 border border-emerald-500/60 rounded-2xl shadow-lg">
                  <div className="relative">
                    <img
                      src={paymentPreview}
                      alt="Uploaded Payment Receipt"
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl"
                    />
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                      Paid Proof
                    </span>
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 font-bold text-xs">
                      <FileCheck className="w-4 h-4" />
                      <span>પેમેન્ટ સ્ક્રીનશોટ જોડાઈ ગયો છે (Screenshot Uploaded)</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Receipt attached with your application for committee verification.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => paymentFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        <span>બીજો સ્ક્રીનશોટ બદલો</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePayment}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>હટાવો</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Payment Upload Trigger Dropzone */
                <div
                  onClick={() => paymentFileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/10 hover:bg-emerald-950/20 rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition group space-y-2.5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition shadow">
                    <Receipt className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">
                      Upload Payment Screenshot / પેમેન્ટ સ્ક્રીનશોટ અપલોડ કરો *
                    </h3>
                    <p className="text-xs text-slate-400">
                      GPay, PhonePe, Paytm transaction screenshot (JPG / PNG / WEBP)
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-[11px] text-emerald-400 font-semibold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>સ્ક્રીનશોટ સિલેક્ટ કરવા અહી ક્લિક કરો</span>
                  </div>
                </div>
              )}

              {/* Optional UPI Reference / UTR Number Input */}
              <div className="pt-2">
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  UPI UTR / Ref No. (ટ્રાન્ઝેક્શન નંબર - ઓપ્શનલ)
                </label>
                <input
                  type="text"
                  value={form.transactionId}
                  onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                  placeholder="e.g. 402819284721 or UPI Ref ID"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                />
              </div>
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
                className="w-5 h-5 rounded text-amber-500 bg-slate-950 border-slate-700 mt-0.5 cursor-pointer"
              />
              <span className="text-xs text-slate-400">
                હું ખાતરી આપું છું કે ઉપર આપેલી તમામ માહિતી અને પેમેન્ટ સ્ક્રીનશોટ સાચા છે અને હું <strong>Katasvan Premier League 2026</strong> ટુર્નામેન્ટના તમામ નિયમોનું પાલન કરીશ. (I agree to tournament rules and player pool auction terms).
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-base uppercase tracking-wider shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2.5 transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
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

      {/* Excel / Google Forms Import Modal */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
      />
    </div>
  );
};

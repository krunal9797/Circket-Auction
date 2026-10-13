import React, { useState, useEffect } from 'react';
import { Player, Team } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck, 
  X, 
  Gavel, 
  User, 
  Sparkles,
  Info
} from 'lucide-react';

interface AuctionResolutionModalProps {
  isOpen: boolean;
  type: 'sold' | 'unsold';
  player: Player | null;
  teams: Team[];
  defaultWinningTeamId?: string | null;
  defaultAmount?: number;
  onConfirmSold: (teamId: string, amount: number) => Promise<void> | void;
  onConfirmUnsold: () => Promise<void> | void;
  onClose: () => void;
}

export const AuctionResolutionModal: React.FC<AuctionResolutionModalProps> = ({
  isOpen,
  type,
  player,
  teams,
  defaultWinningTeamId,
  defaultAmount,
  onConfirmSold,
  onConfirmUnsold,
  onClose,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [amountInputStr, setAmountInputStr] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen && player) {
      const initialTeamId = defaultWinningTeamId || (teams.length > 0 ? teams[0].id : '');
      const initialAmount = defaultAmount && defaultAmount > 0 ? defaultAmount : (player.basePrice || 1000);
      setSelectedTeamId(initialTeamId);
      setCustomAmount(initialAmount);
      setAmountInputStr(initialAmount.toLocaleString('en-IN'));
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, player, defaultWinningTeamId, defaultAmount, teams]);

  if (!isOpen || !player) return null;

  const targetTeam = teams.find(t => t.id === selectedTeamId);
  const isOverBudget = targetTeam ? targetTeam.remainingBudget < customAmount : false;

  const handleAmountChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '');
    const num = parseInt(digitsOnly, 10) || 0;
    setCustomAmount(num);
    setAmountInputStr(num > 0 ? num.toLocaleString('en-IN') : '');
    setErrorMsg('');
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;

    if (type === 'sold') {
      if (!selectedTeamId) {
        setErrorMsg('કૃપા કરીને ખરીદનાર ટીમ પસંદ કરો (Please select a team).');
        return;
      }
      if (customAmount <= 0) {
        setErrorMsg('કૃપા કરીને માન્ય રકમ દાખલ કરો (Please enter a valid amount).');
        return;
      }
      if (targetTeam && customAmount > targetTeam.remainingBudget) {
        setErrorMsg(`ચેતવણી: આ રકમ ${targetTeam.name} ના બાકી પર્સ (₹${targetTeam.remainingBudget.toLocaleString('en-IN')}) કરતાં વધુ છે.`);
        return;
      }

      setIsSubmitting(true);
      try {
        await onConfirmSold(selectedTeamId, customAmount);
        onClose();
      } catch (err) {
        console.error('Error confirming sold:', err);
        setErrorMsg('Failed to complete sale. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      try {
        await onConfirmUnsold();
        onClose();
      } catch (err) {
        console.error('Error confirming unsold:', err);
        setErrorMsg('Failed to mark unsold. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className={`p-5 flex items-center justify-between border-b ${
          type === 'sold' 
            ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-emerald-500/40 text-emerald-400' 
            : 'bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-red-500/40 text-red-400'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
              type === 'sold' 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                : 'bg-red-500/20 border-red-500/50 text-red-400'
            }`}>
              {type === 'sold' ? <Gavel className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-sports text-xl sm:text-2xl font-bold tracking-wide uppercase text-white">
                {type === 'sold' ? 'Confirm Sale / વેચાણ કન્ફર્મ' : 'Confirm UNSOLD / અનસોલ્ડ કન્ફર્મ'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {type === 'sold' ? 'Finalize lot & deduct team purse' : 'Pass player to unsold pool'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Player Snapshot Card */}
          <div className="flex items-center gap-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900 flex-shrink-0">
              {player.photoUrl ? (
                <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                  <User className="w-8 h-8" />
                </div>
              )}
              {player.jerseyNumber && (
                <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-black px-1 rounded text-amber-400">
                  #{player.jerseyNumber}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                {player.category || 'Player'} • {player.role || 'All-Rounder'}
              </span>
              <h4 className="font-sports text-lg sm:text-xl font-bold text-white truncate">
                {player.name}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>Base: ₹{(player.basePrice || 1000).toLocaleString('en-IN')}</span>
                {player.city && <span>• {player.city}</span>}
              </div>
            </div>
          </div>

          {/* Type-Specific Body */}
          {type === 'sold' ? (
            <div className="space-y-4">
              {/* Winning Team Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1.5 flex items-center justify-between">
                  <span>Buying Team (ખરીદનાર ટીમ)</span>
                  {targetTeam && (
                    <span className="text-[11px] text-amber-400 font-medium">
                      Purse: ₹{targetTeam.remainingBudget.toLocaleString('en-IN')}
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.shortCode}) — Remaining Purse: ₹{t.remainingBudget.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Final Amount Input */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1.5 flex items-center justify-between">
                  <span>Final Sold Price / વેચાણ રકમ (₹)</span>
                  <span className="text-[11px] text-slate-400">Type or pick amount</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-lg text-emerald-400">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={amountInputStr}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-lg font-black text-white focus:outline-none focus:border-emerald-500 font-digital"
                    placeholder="Enter final price..."
                  />
                </div>

                {/* Quick Increment suggestions */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[1000, 2000, 5000, 10000].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => {
                        const newAmt = customAmount + inc;
                        setCustomAmount(newAmt);
                        setAmountInputStr(newAmt.toLocaleString('en-IN'));
                      }}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    >
                      +₹{inc.toLocaleString('en-IN')}
                    </button>
                  ))}
                  {defaultAmount && defaultAmount > 0 && defaultAmount !== customAmount && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAmount(defaultAmount);
                        setAmountInputStr(defaultAmount.toLocaleString('en-IN'));
                      }}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                    >
                      Reset to Highest Bid (₹{defaultAmount.toLocaleString('en-IN')})
                    </button>
                  )}
                </div>
              </div>

              {/* Warning if over budget */}
              {isOverBudget && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>
                    આ ટીમ પાસે આ રકમ ચૂકવવા માટે પૂરતું પર્સ નથી (Selected team does not have enough purse).
                  </span>
                </div>
              )}

              {/* Confirmation Summary Card */}
              {targetTeam && customAmount > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Sold To Team:</span>
                    <strong className="text-white font-bold">{targetTeam.name}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Final Amount:</span>
                    <strong className="text-emerald-400 font-extrabold text-sm font-digital">
                      ₹{customAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1 border-t border-emerald-500/20 text-[11px]">
                    <span>Team Purse After Sale:</span>
                    <span className="font-semibold text-slate-200">
                      ₹{Math.max(0, targetTeam.remainingBudget - customAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-2 text-sm text-red-200">
                <div className="flex items-center gap-2 font-bold text-red-400">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>શું તમે ખરેખર અનસોલ્ડ કરવા માંગો છો?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  આ ખેલાડીને <strong>UNSOLD</strong> જાહેર કરવામાં આવશે. કોઈ પણ ટીમને સોંપવામાં આવશે નહીં અને કોઈ રકમ કાપવામાં આવશે નહીં. આ ખેલાડીને પછીથી Round 2 માં ફરીથી ઓક્શનમાં લાવી શકાય છે.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>જો ભૂલથી બટન દબાયું હોય તો 'Cancel' દબાવો.</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950 border border-red-600 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition"
          >
            Cancel / રદ કરો
          </button>

          {type === 'sold' ? (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting || !selectedTeamId || customAmount <= 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-extrabold text-sm uppercase tracking-wide flex items-center gap-2 shadow-lg disabled:opacity-40 transition"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm SOLD / વેચાણ કન્ફર્મ</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-sm uppercase tracking-wide flex items-center gap-2 shadow-lg disabled:opacity-40 transition"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Yes, Mark UNSOLD / અનસોલ્ડ કરો</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  UserPlus, 
  ShieldCheck, 
  Radio, 
  KeyRound, 
  Sparkles,
  ExternalLink,
  MessageCircle,
  QrCode
} from 'lucide-react';
import { ViewTab } from '../types';
import { getShareableUrl, getWhatsAppShareText, openWhatsAppShare, copyToClipboard } from '../utils/shareUtils';

interface ShareLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: ViewTab) => void;
}

export const ShareLinksModal: React.FC<ShareLinksModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const playerRegUrl = getShareableUrl('register_player');
  const teamRegUrl = getShareableUrl('register_team');
  const liveAuctionUrl = getShareableUrl('live_auction');
  const teamPortalUrl = getShareableUrl('team_portal');

  const handleCopy = async (key: string, url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const links = [
    {
      id: 'player_reg',
      tab: 'register_player' as ViewTab,
      badge: 'Most Popular',
      badgeColor: 'bg-emerald-500 text-black',
      title: 'Player Registration URL',
      titleGujarati: 'ખેલાડી રજીસ્ટ્રેશન લિંક',
      description: 'Send this link to cricket players to register in the KPL 2026 auction pool with role, stats & base price.',
      url: playerRegUrl,
      icon: <UserPlus className="w-5 h-5 text-emerald-400" />,
      border: 'border-emerald-500/40 hover:border-emerald-500',
      bg: 'bg-emerald-950/20',
      whatsappType: 'player_reg' as const
    },
    {
      id: 'team_reg',
      tab: 'register_team' as ViewTab,
      badge: 'Franchises',
      badgeColor: 'bg-amber-500 text-black',
      title: 'Team / Franchise Registration URL',
      titleGujarati: 'ટીમ / ફ્રેન્ચાઈઝી રજીસ્ટ્રેશન લિંક',
      description: 'Send this link to Team Owners and Captains to register their franchise and set their 4-digit War Room PIN.',
      url: teamRegUrl,
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      border: 'border-amber-500/40 hover:border-amber-500',
      bg: 'bg-amber-950/20',
      whatsappType: 'team_reg' as const
    },
    {
      id: 'live_auction',
      tab: 'live_auction' as ViewTab,
      badge: 'Spectators',
      badgeColor: 'bg-red-500 text-white',
      title: 'Live Auction Watch Link',
      titleGujarati: 'લાઈવ ઓક્શન જોવા માટેની લિંક',
      description: 'Share with fans, village groups, and audiences to watch the real-time live bidding and hammer strikes.',
      url: liveAuctionUrl,
      icon: <Radio className="w-5 h-5 text-red-400" />,
      border: 'border-red-500/40 hover:border-red-500',
      bg: 'bg-red-950/20',
      whatsappType: 'live_auction' as const
    },
    {
      id: 'team_portal',
      tab: 'team_portal' as ViewTab,
      badge: 'Bidders',
      badgeColor: 'bg-cyan-500 text-black',
      title: 'Team Owner Bidding War Room Link',
      titleGujarati: 'ટીમ ઓનર લાઈવ બિડિંગ પોર્ટલ લિંક',
      description: 'Direct access link for registered franchise owners to enter their 4-digit PIN and place live bids.',
      url: teamPortalUrl,
      icon: <KeyRound className="w-5 h-5 text-cyan-400" />,
      border: 'border-cyan-500/40 hover:border-cyan-500',
      bg: 'bg-cyan-950/20',
      whatsappType: 'team_portal' as const
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/30 border border-amber-300/40">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sports text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
                  Share Tournament URLs & Links
                </h2>
              </div>
              <p className="text-xs text-amber-400 font-semibold">
                રજીસ્ટ્રેશન અને લાઈવ ઓક્શનની લિંક બધાને મોકલો • Katasvan Premier League 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Links Cards */}
        <div className="py-4 space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-xs text-amber-300">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>1-Click WhatsApp Share:</strong> Click the WhatsApp button on any link to instantly share with pre-formatted Gujarati & English details in your groups!
            </span>
          </div>

          <div className="space-y-3.5">
            {links.map((link) => {
              const isCopied = copiedKey === link.id;
              const waText = getWhatsAppShareText(link.whatsappType, link.url);

              return (
                <div
                  key={link.id}
                  className={`rounded-2xl border p-4 transition-all ${link.bg} ${link.border}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
                        {link.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-sports text-base font-bold text-white tracking-wide">
                            {link.title}
                          </h3>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${link.badgeColor}`}>
                            {link.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-400/90 font-medium">
                          {link.titleGujarati}
                        </p>
                      </div>
                    </div>

                    {/* Open Direct View Button */}
                    {onNavigateTab && (
                      <button
                        onClick={() => {
                          onNavigateTab(link.tab);
                          onClose();
                        }}
                        className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 self-start sm:self-center"
                      >
                        <span>Open Form</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mb-3">
                    {link.description}
                  </p>

                  {/* URL Box & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 truncate select-all">
                      {link.url}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopy(link.id, link.url)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 min-w-[105px] ${
                          isCopied
                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-amber-400" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      {/* WhatsApp Share Button */}
                      <button
                        onClick={() => openWhatsAppShare(waText)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="text-center sm:text-left">
            <span>Tournament Platform: <strong className="text-white">Katasvan Premier League 2026</strong></span>
            <span className="block text-[11px] text-slate-500">Developer & Architect: Er. Krunal Gamit</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

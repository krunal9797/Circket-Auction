import { ViewTab } from '../types';

/**
 * Get absolute public URL for a specific tab or route
 */
export function getShareableUrl(tab: ViewTab | string, extraParams?: Record<string, string>): string {
  if (typeof window === 'undefined') return '';

  const origin = window.location.origin;
  const pathname = window.location.pathname || '/';
  
  // Format tab to clean parameter and hash
  let tabParam = tab;
  let hash = tab.replace('_', '-');

  const url = new URL(pathname, origin);
  url.searchParams.set('tab', tabParam);

  if (extraParams) {
    Object.entries(extraParams).forEach(([key, val]) => {
      url.searchParams.set(key, val);
    });
  }

  url.hash = hash;
  return url.toString();
}

/**
 * Generate formatted WhatsApp share messages (in Gujarati and English)
 */
export function getWhatsAppShareText(type: 'player_reg' | 'team_reg' | 'live_auction' | 'team_portal' | 'general', targetUrl?: string): string {
  const url = targetUrl || (typeof window !== 'undefined' ? window.location.href : '');

  switch (type) {
    case 'player_reg':
      return `🏏 *KATASVAN PREMIER LEAGUE (KPL 2026)* 🏏\n` +
        `📢 *OFFICIAL PLAYER REGISTRATION IS NOW OPEN!* 🔥\n\n` +
        `નમસ્કાર મિત્રો,\n` +
        `Katasvan Premier League 2026 ક્રિકેટ ઓક્શન માટે ખેલાડીઓનું રજીસ્ટ્રેશન શરૂ થઈ ગયેલ છે.\n` +
        `જે ખેલાડીઓ ઓક્શન પૂલમાં ભાગ લેવા માંગતા હોય તેઓ નીચે આપેલી લિંક પર ક્લિક કરીને પોતાનું રજીસ્ટ્રેશન ફોર્મ ભરો.\n\n` +
        `👉 *પ્લેયર રજીસ્ટ્રેશન લિંક:* \n${url}\n\n` +
        `✨ *ખાસિયતો:*\n` +
        `• Base Price & Role પસંદગી\n` +
        `• Live Cloud Firestore Auction\n` +
        `• Standard ₹1,00,000 Team Purse\n` +
        `• Digital Auction Player Card & Live Broadcast\n\n` +
        `👑 *Organized by:* KPL Tournament Committee\n` +
        `💻 *Platform Developed by:* Er. Krunal Gamit\n` +
        `_અત્યારે જ રજીસ્ટર કરો અને તમારા ક્રિકેટ ગ્રૂપમાં શેર કરો!_ 🏏⚡`;

    case 'team_reg':
      return `🏆 *KATASVAN PREMIER LEAGUE (KPL 2026)* 🏆\n` +
        `📢 *TEAM / FRANCHISE REGISTRATION OPEN!* 🦁⚡\n\n` +
        `નમસ્કાર ટીમ ઓનર્સ અને કેપ્ટન મિત્રો,\n` +
        `KPL 2026 ટુર્નામેન્ટ માટે નવી ફ્રેન્ચાઈઝી/ટીમનું રજીસ્ટ્રેશન શરૂ છે!\n` +
        `તમારી ટીમનું નામ, લોગો અને ઓનર વિગતો સબમિટ કરો અને લાઈવ ઓક્શન માટે સિક્યોર 4-Digit War Room Bidding PIN મેળવો.\n\n` +
        `👉 *ટીમ રજીસ્ટ્રેશન લિંક:* \n${url}\n\n` +
        `💰 *Team Starting Purse:* ₹1,00,000\n` +
        `🔒 *Live Bidding War Room Access with Secret PIN*\n\n` +
        `💻 *Platform by:* Er. Krunal Gamit\n` +
        `_તમારી ટીમ રજીસ્ટર કરવા માટે ઉપરની લિંક ઓપન કરો._ 🏆🏏`;

    case 'live_auction':
      return `🔴 *LIVE CRICKET AUCTION • KPL 2026* 🔴\n` +
        `🔥 Katasvan Premier League Live Player Bidding Auction is LIVE right now!\n\n` +
        `ખેલાડીઓ પર લાગતી લાઈવ બોલી, ટીમ સ્ક્વોડ અને હેમર સ્ટ્રાઈક રિયલ ટાઈમમાં જુઓ:\n` +
        `👉 *Watch Live Auction:* \n${url}\n\n` +
        `⚡ Realtime Cloud Broadcast | Developer: Er. Krunal Gamit`;

    case 'team_portal':
      return `⚡ *KPL 2026 - TEAM OWNER BIDDING PORTAL* ⚡\n` +
        `ટીમ માલિકો લાઈવ ઓક્શનમાં બોલી લગાવવા માટે નીચેની લિંક પરથી તમારા 4-Digit PIN સાથે War Room માં લોગિન કરો:\n\n` +
        `👉 *Team Login Link:* \n${url}\n\n` +
        `KPL Auction Platform by Er. Krunal Gamit`;

    default:
      return `🏏 *KATASVAN PREMIER LEAGUE (KPL 2026)* 🏏\n` +
        `Live Cricket Auction Platform & Tournament Hub!\n` +
        `👉 ${url}`;
  }
}

/**
 * Open WhatsApp Share directly
 */
export function openWhatsAppShare(text: string) {
  const encoded = encodeURIComponent(text);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
}

/**
 * Copy text to clipboard with modern fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Formats a number to Indian Rupee standard format (e.g. ₹1,00,000 or ₹25,000 or ₹5,500)
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  // Use en-IN locale for Indian numbering system (lakhs, crores)
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);

  return `₹${formatted}`;
}

/**
 * Formats short INR (e.g. ₹1L, ₹50K, ₹1.5Cr)
 */
export function formatShortINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)} K`;
  }
  return `₹${amount}`;
}

/**
 * Format timestamp into readable time
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Format timer seconds into MM:SS (e.g., 00:18)
 */
export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

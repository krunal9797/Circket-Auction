import * as XLSX from 'xlsx';
import { PlayerRole, BattingStyle, BowlingStyle, Player } from '../types';

export interface ParsedPlayerRow {
  name: string;
  nickname?: string;
  faliyu?: string;
  city?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  age?: number;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  jerseyNumber?: string;
  jerseySize?: string;
  image?: string;
  paymentScreenshot?: string;
  transactionId?: string;
  basePrice?: number;
  originalData?: Record<string, any>;
  errors?: string[];
  isValid: boolean;
}

/**
 * Transforms Google Drive file links to direct previewable thumbnail/image URLs
 * Supports formats:
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/file/d/FILE_ID/view...
 * - https://drive.google.com/uc?id=FILE_ID
 */
export const convertGoogleDriveLink = (url: string | undefined): string => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Match /open?id=FILE_ID or ?id=FILE_ID or &id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  // Match /file/d/FILE_ID/
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  return trimmed;
};

// Match role strings from Google Forms (e.g. "ALL ROUNDER", "Batsman", "Wicket Keeper")
export const normalizePlayerRole = (rawRole: any): PlayerRole => {
  if (!rawRole) return 'All-Rounder';
  const val = String(rawRole).trim().toLowerCase();

  if (val.includes('round')) return 'All-Rounder';
  if (val.includes('keeper') || val.includes('wk') || val.includes('કીપર')) return 'Wicket Keeper';
  if (val.includes('bowl') || val.includes('બોલ')) return 'Bowler';
  if (val.includes('bat') || val.includes('બેટ')) return 'Batsman';

  return 'All-Rounder';
};

// Match batting styles
export const normalizeBattingStyle = (rawBat: any): BattingStyle => {
  if (!rawBat) return 'Right-hand bat';
  const val = String(rawBat).trim().toLowerCase();

  if (val.includes('left') || val.includes('ડાબો')) return 'Left-hand bat';
  return 'Right-hand bat';
};

// Match bowling styles
export const normalizeBowlingStyle = (rawBowl: any, role: PlayerRole): BowlingStyle => {
  if (!rawBowl) {
    if (role === 'Bowler') return 'Right-arm medium';
    if (role === 'All-Rounder') return 'Right-arm medium';
    return 'None';
  }
  const val = String(rawBowl).trim().toLowerCase();

  if (val.includes('left') && val.includes('fast')) return 'Left-arm fast';
  if (val.includes('left') && val.includes('med')) return 'Left-arm medium';
  if (val.includes('left') && (val.includes('spin') || val.includes('ortho'))) return 'Left-arm orthodox';
  if (val.includes('fast')) return 'Right-arm fast';
  if (val.includes('leg') || val.includes('લેગ')) return 'Right-arm leg-break';
  if (val.includes('off') || val.includes('ઓફ')) return 'Right-arm off-break';
  if (val.includes('med') || val.includes('મીડ')) return 'Right-arm medium';
  if (val.includes('none') || val === '-' || val === 'no') return 'None';

  return 'Right-arm medium';
};

// Normalize Jersey Size
export const normalizeJerseySize = (rawSize: any): string => {
  if (!rawSize) return 'M (38)';
  const val = String(rawSize).trim().toUpperCase();

  if (val.includes('3XL') || val.includes('XXXL')) return '3XL (46)';
  if (val.includes('XXL') || val.includes('2XL')) return 'XXL (44)';
  if (val.includes('XL') && !val.includes('XXL')) return 'XL (42)';
  if (val.includes('L') && !val.includes('XL')) return 'L (40)';
  if (val.includes('M')) return 'M (38)';
  if (val.includes('S')) return 'S (36)';

  return val;
};

// Normalize string value
const cleanStr = (val: any): string => {
  if (val === undefined || val === null) return '';
  return String(val).trim();
};

/**
 * Maps raw row object keys (from Excel or Google Forms) to standard fields.
 * Inspects all possible naming variations including English and Gujarati labels.
 */
export const mapRowToPlayer = (row: Record<string, any>, rowIndex: number): ParsedPlayerRow => {
  const keys = Object.keys(row);

  const findValue = (matchers: string[]): any => {
    for (const key of keys) {
      const lowerKey = key.trim().toLowerCase();
      for (const m of matchers) {
        if (lowerKey.includes(m.toLowerCase())) {
          return row[key];
        }
      }
    }
    return undefined;
  };

  // Full Name
  const rawName = findValue(['full name', 'પૂરું નામ', 'player name', 'name', 'નામ']);
  const name = cleanStr(rawName);

  // Nickname / Jersey Name
  const rawNickname = findValue(['jersey name', 'ઉપનામ', 'nickname', 'short name']);
  const nickname = cleanStr(rawNickname) || name.split(' ')[0] || '';

  // Faliyu
  const rawFaliyu = findValue(['faliyu', 'ફળિયું', 'ફળિયાનું નામ', 'street', 'area']);
  const faliyu = cleanStr(rawFaliyu);

  // Village / City
  const rawCity = findValue(['village', 'city', 'ગામ', 'શહેર', 'town', 'address']);
  const city = cleanStr(rawCity) || 'Katasvan';

  // WhatsApp / Mobile Number
  const rawPhone = findValue(['whatsapp', 'mob', 'mobile', 'phone', 'મોબાઇલ', 'નંબર', 'contact']);
  let phone = cleanStr(rawPhone);
  // Clean phone number from non-digit characters except +
  phone = phone.replace(/[^0-9+]/g, '');

  // Email
  const rawEmail = findValue(['email', 'ઇમેઇલ', 'mail']);
  const email = cleanStr(rawEmail);

  // Age
  const rawAge = findValue(['age', 'ઉંમર']);
  const parsedAge = rawAge ? parseInt(String(rawAge), 10) : 22;
  const age = isNaN(parsedAge) || parsedAge <= 0 ? 22 : parsedAge;

  // Primary Role
  const rawRole = findValue(['primary playing role', 'મુખ્ય રોલ', 'role', 'playing role', 'player role']);
  const role = normalizePlayerRole(rawRole);

  // Batting Style
  const rawBat = findValue(['batting style', 'બેટિંગ શૈલી', 'batting']);
  const battingStyle = normalizeBattingStyle(rawBat);

  // Bowling Style
  const rawBowl = findValue(['bowling style', 'બોલિંગ શૈલી', 'bowling']);
  const bowlingStyle = normalizeBowlingStyle(rawBowl, role);

  // Jersey Number
  const rawJerseyNum = findValue(['preferred jersey number', 'જર્સી નંબર', 'jersey number', 'jersey no', 'number']);
  const jerseyNumber = cleanStr(rawJerseyNum) || String((rowIndex % 99) + 1);

  // Jersey Size
  const rawJerseySize = findValue(['jersey size', 'જર્સી સાઈઝ', 'size']);
  const jerseySize = normalizeJerseySize(rawJerseySize);

  // Player Photo
  const rawPhoto = findValue(['player photo', 'ફોટો અપલોડ', 'photo', 'image', 'picture', 'ફોટો']);
  const rawPhotoStr = cleanStr(rawPhoto);
  const image = rawPhotoStr 
    ? convertGoogleDriveLink(rawPhotoStr) 
    : 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80';

  // Payment Screenshot
  const rawPayment = findValue(['registration fee payment', 'પેમેન્ટ સ્ક્રીનશોટ', 'payment screenshot', 'payment', 'fee proof', 'પેમેન્ટ']);
  const rawPaymentStr = cleanStr(rawPayment);
  const paymentScreenshot = rawPaymentStr ? convertGoogleDriveLink(rawPaymentStr) : undefined;

  // UPI UTR / Ref No.
  const rawTxn = findValue(['upi utr', 'ref no', 'ટ્રાન્ઝેક્શન નંબર', 'transaction id', 'utr', 'column 13', 'ref']);
  const transactionId = cleanStr(rawTxn) || undefined;

  // Base price
  const rawBase = findValue(['base price', 'base', 'કિંમત', 'બેઝ પ્રાઈઝ']);
  const basePrice = rawBase ? parseInt(String(rawBase).replace(/[^0-9]/g, ''), 10) : 1000;

  const errors: string[] = [];
  if (!name) {
    errors.push('Player Name is missing');
  }

  return {
    name,
    nickname,
    faliyu,
    city,
    phone,
    whatsapp: phone,
    email,
    age,
    role,
    battingStyle,
    bowlingStyle,
    jerseyNumber,
    jerseySize,
    image,
    paymentScreenshot,
    transactionId,
    basePrice: isNaN(basePrice) || basePrice <= 0 ? 1000 : basePrice,
    originalData: row,
    errors,
    isValid: errors.length === 0,
  };
};

/**
 * Parses an Excel or CSV file buffer and returns parsed players
 */
export const parseExcelFile = async (file: File): Promise<ParsedPlayerRow[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  // Use the first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to JSON array of objects
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
  });

  return rawRows.map((row, idx) => mapRowToPlayer(row, idx + 1));
};

/**
 * Parses copied tab-separated or comma-separated text from Google Sheets / Excel
 */
export const parsePastedTableText = (text: string): ParsedPlayerRow[] => {
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Determine delimiter: tab (\t) or comma (,)
  const firstLine = lines[0];
  const delimiter = firstLine.includes('\t') ? '\t' : ',';

  const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));

  const rawRows: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
    const rowObj: Record<string, any> = {};
    headers.forEach((header, colIdx) => {
      rowObj[header] = values[colIdx] || '';
    });
    rawRows.push(rowObj);
  }

  return rawRows.map((row, idx) => mapRowToPlayer(row, idx + 1));
};

/**
 * Generates and downloads a pre-formatted sample Excel file matching the Google Form
 */
export const downloadSampleExcelTemplate = () => {
  const sampleData = [
    {
      'Timestamp': '13-10-2026 10:45:51',
      'Email Address': 'gamitakash1521@gmail.com',
      'Full Name (પૂરું નામ)': 'Akash Gamit',
      'Faliyu (ફળિયું / ફળિયાનું નામ)': 'Patel faliyu',
      'WhatsApp / Mob': '9081639491',
      'Jersey Name (ઉપનામ)': 'Akash',
      'Jersey Size (જર્સી સાઈઝ) *': 'XL',
      'Preferred Jersey Number (જર્સી નંબર)': '15',
      'Primary Playing Role (મુખ્ય રોલ)': 'ALL ROUNDER',
      'Batting Style (બેટિંગ શૈલી)': 'RIGHT HAND',
      'Player Photo / ફોટો અપલોડ કરો': 'https://drive.google.com/open?id=1examplePhotoId',
      'Registration Fee Payment / પેમેન્ટ સ્ક્રીનશોટ': 'https://drive.google.com/open?id=1weKLPfufA3h0KWtD82Gi6WOmL_6gQN7B',
      'UPI UTR / Ref No. (ટ્રાન્ઝેક્શન નંબર - ઓપ્શનલ)': '402819284721',
    },
    {
      'Timestamp': '13-10-2026 11:20:10',
      'Email Address': 'hardik.patel@gmail.com',
      'Full Name (પૂરું નામ)': 'Hardik Patel',
      'Faliyu (ફળિયું / ફળિયાનું નામ)': 'Nishal faliyu',
      'WhatsApp / Mob': '9876543210',
      'Jersey Name (ઉપનામ)': 'Harry',
      'Jersey Size (જર્સી સાઈઝ) *': 'L',
      'Preferred Jersey Number (જર્સી નંબર)': '7',
      'Primary Playing Role (મુખ્ય રોલ)': 'BATSMAN',
      'Batting Style (બેટિંગ શૈલી)': 'RIGHT HAND',
      'Player Photo / ફોટો અપલોડ કરો': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
      'Registration Fee Payment / પેમેન્ટ સ્ક્રીનશોટ': 'https://drive.google.com/open?id=1sampleReceiptId',
      'UPI UTR / Ref No. (ટ્રાન્ઝેક્શન નંબર - ઓપ્શનલ)': '402899120485',
    },
    {
      'Timestamp': '13-10-2026 12:05:33',
      'Email Address': 'rohit.kpl@gmail.com',
      'Full Name (પૂરું નામ)': 'Rohit Chaudhary',
      'Faliyu (ફળિયું / ફળિયાનું નામ)': 'Talav faliyu',
      'WhatsApp / Mob': '9825012345',
      'Jersey Name (ઉપનામ)': 'Hitman',
      'Jersey Size (જર્સી સાઈઝ) *': 'M',
      'Preferred Jersey Number (જર્સી નંબર)': '45',
      'Primary Playing Role (મુખ્ય રોલ)': 'BOWLER',
      'Batting Style (બેટિંગ શૈલી)': 'RIGHT HAND',
      'Player Photo / ફોટો અપલોડ કરો': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
      'Registration Fee Payment / પેમેન્ટ સ્ક્રીનશોટ': '',
      'UPI UTR / Ref No. (ટ્રાન્ઝેક્શન નંબર - ઓપ્શનલ)': '402833182941',
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'KPL Players');

  // Trigger download
  XLSX.writeFile(workbook, 'KPL_Player_Registration_Template.xlsx');
};

/**
 * Converts a ParsedPlayerRow into full Player object ready for Firestore insertion
 */
export const convertParsedRowToPlayer = (
  row: ParsedPlayerRow,
  defaultBasePrice: number = 1000
): Omit<Player, 'id' | 'bidHistory' | 'status'> => {
  return {
    name: row.name,
    nickname: row.nickname || row.name.split(' ')[0],
    image: row.image || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    role: row.role,
    age: row.age || 22,
    dob: '2004-01-01',
    city: row.city || 'Katasvan',
    faliyu: row.faliyu || '',
    jerseySize: row.jerseySize || 'M (38)',
    battingStyle: row.battingStyle,
    bowlingStyle: row.bowlingStyle,
    basePrice: row.basePrice || defaultBasePrice,
    paymentScreenshot: row.paymentScreenshot || undefined,
    transactionId: row.transactionId || undefined,
    paymentStatus: row.paymentScreenshot ? 'pending' : 'unpaid',
    stats: {
      matches: 12,
      innings: 10,
      runs: 180,
      highestScore: '42*',
      average: 20.0,
      strikeRate: 120.0,
      fifties: 0,
      hundreds: 0,
      wickets: row.role === 'Bowler' || row.role === 'All-Rounder' ? 8 : 1,
      economy: 7.2,
      bestBowling: '2/18',
    },
    bio: `${row.role} from ${row.faliyu ? row.faliyu + ', ' : ''}${row.city || 'Katasvan'}. KPL 2026.`,
    phone: row.phone || '',
    whatsapp: row.whatsapp || row.phone || '',
    email: row.email || '',
    jerseyNumber: row.jerseyNumber || '7',
    registeredAt: new Date().toISOString(),
    isFeatured: false,
  };
};

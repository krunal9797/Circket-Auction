import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  Check,
  Receipt,
  Users,
  Image as ImageIcon,
  ArrowRight,
  ClipboardPaste,
  RefreshCw,
  Eye,
  Shirt,
  Sparkles
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { 
  parseExcelFile, 
  parsePastedTableText, 
  downloadSampleExcelTemplate, 
  convertParsedRowToPlayer,
  ParsedPlayerRow 
} from '../utils/excelImportUtils';
import { formatINR } from '../utils/formatters';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addPlayersBatch, players } = useAuction();

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedPlayerRow[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [defaultBasePrice, setDefaultBasePrice] = useState<number>(1000);
  const [importResult, setImportResult] = useState<{ total: number } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsParsing(true);
    try {
      const rows = await parseExcelFile(selectedFile);
      setParsedRows(rows);
      // Select all valid rows by default
      const validIndices = new Set<number>();
      rows.forEach((r, idx) => {
        if (r.isValid) validIndices.add(idx);
      });
      setSelectedIndices(validIndices);
    } catch (err) {
      console.error('Error parsing Excel file:', err);
      alert('એક્સેલ ફાઇલ વાંચવામાં ભૂલ આવી. કૃપા કરીને યોગ્ય .xlsx અથવા .csv ફાઇલ અપલોડ કરો.');
    } finally {
      setIsParsing(false);
    }
  };

  const handlePasteParse = () => {
    if (!pastedText.trim()) return;

    setIsParsing(true);
    try {
      const rows = parsePastedTableText(pastedText);
      setParsedRows(rows);
      const validIndices = new Set<number>();
      rows.forEach((r, idx) => {
        if (r.isValid) validIndices.add(idx);
      });
      setSelectedIndices(validIndices);
    } catch (err) {
      console.error('Error parsing pasted data:', err);
      alert('ડેટા વાંચવામાં ભૂલ આવી. કૃપા કરીને કોપી કરેલ રો બરાબર પેસ્ટ કરો.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleToggleSelect = (index: number) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedIndices(next);
  };

  const handleSelectAll = () => {
    if (selectedIndices.size === parsedRows.filter(r => r.isValid).length) {
      setSelectedIndices(new Set());
    } else {
      const allValid = new Set<number>();
      parsedRows.forEach((r, idx) => {
        if (r.isValid) allValid.add(idx);
      });
      setSelectedIndices(allValid);
    }
  };

  const handleImport = async () => {
    const playersToImport = parsedRows
      .filter((_, idx) => selectedIndices.has(idx))
      .map(row => convertParsedRowToPlayer(row, defaultBasePrice));

    if (playersToImport.length === 0) {
      alert('કૃપા કરીને ઓછામાં ઓછો એક ખેલાડી સિલેક્ટ કરો.');
      return;
    }

    setIsImporting(true);
    try {
      await addPlayersBatch(playersToImport);
      setImportResult({ total: playersToImport.length });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error batch importing players:', err);
      alert('ખેલાડીઓ ઇમ્પોર્ટ કરતી વખતે સર્વર પર ભૂલ આવી.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPastedText('');
    setParsedRows([]);
    setSelectedIndices(new Set());
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3 h-3" />
                <span>Google Sheets & Excel Import Tool</span>
              </div>
              <h2 className="font-sports text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
                Excel / Google Forms ડેટા ઇમ્પોર્ટ કરો
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadSampleExcelTemplate}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 cursor-pointer"
              title="Download Sample Format"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>સેમ્પલ ટેમ્પલેટ (.xlsx)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* SUCCESS SCREEN */}
          {importResult ? (
            <div className="py-10 text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="bg-emerald-500 text-black font-black text-xs px-4 py-1 rounded-full uppercase tracking-widest">
                  IMPORT COMPLETE
                </span>
                <h3 className="font-sports text-3xl font-bold text-white uppercase">
                  {importResult.total} ખેલાડીઓ સફળતાપૂર્વક ઉમેરાયા!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  બધા ખેલાડીઓ ડેટાબેઝમાં આવી ગયા છે અને હવે લાઈવ હરાજી પુલ અને પ્રોજેક્ટર સ્ક્રીન પર ઉપલબ્ધ છે.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  OK / Done
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                >
                  Import More
                </button>
              </div>
            </div>
          ) : parsedRows.length === 0 ? (
            /* Upload / Paste Area */
            <div className="space-y-6">
              
              {/* Google Form Column Mapping Notice */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-xs text-slate-300 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <FileCheck className="w-4 h-4" />
                  <span>તમારા Google Form / Excel શીટ સાથે ઓટોમેટિક સેટિંગ:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  આ ટૂલ તમારા Google Form ની બધી કોલમ ઓટોમેટિક ઓળખી લે છે:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Full Name (પૂરું નામ)',
                    'Faliyu (ફળિયું)',
                    'WhatsApp / Mob',
                    'Jersey Name (ઉપનામ)',
                    'Jersey Size (જર્સી સાઈઝ)',
                    'Jersey Number (જર્સી નંબર)',
                    'Primary Playing Role (મુખ્ય રોલ)',
                    'Batting Style (બેટિંગ શૈલી)',
                    'Player Photo (Google Drive Link)',
                    'Payment Screenshot Link',
                    'UPI UTR / Ref No.'
                  ].map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-amber-300 font-mono">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold pt-1">
                  💡 ગૂગલ ડ્રાઇવ ફોટો લિંક (<code className="text-white font-mono">drive.google.com/open?id=...</code>) આપમેળે પ્લેયર કાર્ડ માટે ડિરેક્ટ ફોટોમાં કન્વર્ટ થઈ જશે!
                </p>
              </div>

              {/* Tabs for File vs Paste */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Excel / CSV ફાઇલ અપલોડ</span>
                </button>

                <button
                  onClick={() => setActiveTab('paste')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'paste'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <ClipboardPaste className="w-4 h-4" />
                  <span>Google Sheets માંથી Copy-Paste</span>
                </button>
              </div>

              {activeTab === 'upload' ? (
                /* FILE DROPZONE */
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-file-upload-input"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-slate-950/60 hover:bg-slate-950 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition group space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition shadow-lg">
                      <FileSpreadsheet className="w-8 h-8" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-sports text-xl font-bold text-white uppercase">
                        {isParsing ? 'ફાઇલ સ્કેન થઈ રહી છે...' : 'Click or Drag & Drop Excel / CSV File'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Supports <strong className="text-amber-400">.xlsx, .xls, .csv</strong> files exported from Google Forms or Microsoft Excel.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow">
                      <Upload className="w-4 h-4" />
                      <span>Select File From Computer / Mobile</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* COPY PASTE TAB */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-bold block">
                      Google Sheet માંથી બધી રો (હેડર સહિત) સિલેક્ટ કરીને અહી Paste (Ctrl + V) કરો:
                    </label>
                    <textarea
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Timestamp&#9;Email Address&#9;Full Name (પૂરું નામ)&#9;Faliyu...&#10;9-8-2026 10:45&#9;gamit@gmail.com&#9;Akash&#9;Patel faliyu..."
                      rows={8}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Supports direct copy from Google Sheets or Excel table.
                    </span>

                    <button
                      type="button"
                      onClick={handlePasteParse}
                      disabled={!pastedText.trim() || isParsing}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                      {isParsing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ClipboardPaste className="w-4 h-4" />}
                      <span>Parse Data / ડેટા ચકાસો</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* DATA PREVIEW & SELECTION TABLE */
            <div className="space-y-5 animate-fadeIn">
              
              {/* Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="text-xs">
                    <span className="text-slate-400 block">Total Detected</span>
                    <strong className="text-white text-base font-sports">{parsedRows.length} Players</strong>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div className="text-xs">
                    <span className="text-emerald-400 block font-semibold">Valid</span>
                    <strong className="text-emerald-400 text-base">{validCount}</strong>
                  </div>
                  {invalidCount > 0 && (
                    <>
                      <div className="h-8 w-px bg-slate-800" />
                      <div className="text-xs">
                        <span className="text-rose-400 block font-semibold">Errors</span>
                        <strong className="text-rose-400 text-base">{invalidCount}</strong>
                      </div>
                    </>
                  )}
                  <div className="h-8 w-px bg-slate-800" />
                  <div className="text-xs">
                    <span className="text-amber-400 block font-semibold">Selected for Import</span>
                    <strong className="text-amber-400 text-base">{selectedIndices.size}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Default Base Price selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">Base Price:</span>
                    <select
                      value={defaultBasePrice}
                      onChange={(e) => setDefaultBasePrice(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold"
                    >
                      <option value="1000">₹1,000 (Default)</option>
                      <option value="2000">₹2,000</option>
                      <option value="5000">₹5,000</option>
                      <option value="10000">₹10,000</option>
                      <option value="15000">₹15,000</option>
                      <option value="20000">₹20,000</option>
                    </select>
                  </div>

                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Upload Different</span>
                  </button>
                </div>
              </div>

              {/* Table of Parsed Players */}
              <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/60 max-h-[48vh]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIndices.size === validCount && validCount > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-3">Player Info</th>
                      <th className="py-3 px-3">Role & Style</th>
                      <th className="py-3 px-3">Faliyu / City</th>
                      <th className="py-3 px-3">Jersey</th>
                      <th className="py-3 px-3">Phone</th>
                      <th className="py-3 px-3 text-center">Photo</th>
                      <th className="py-3 px-3 text-center">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {parsedRows.map((row, idx) => {
                      const isSelected = selectedIndices.has(idx);
                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-900/50 transition ${
                            !row.isValid
                              ? 'bg-rose-950/20 text-rose-300'
                              : isSelected
                              ? 'bg-amber-500/5'
                              : 'opacity-70'
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              disabled={!row.isValid}
                              checked={isSelected}
                              onChange={() => handleToggleSelect(idx)}
                              className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 cursor-pointer disabled:opacity-30"
                            />
                          </td>

                          {/* Player Name */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              {row.image ? (
                                <img
                                  src={row.image}
                                  alt={row.name}
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-800"
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800';
                                  }}
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 shrink-0">
                                  {row.name.charAt(0) || 'P'}
                                </div>
                              )}
                              <div>
                                <strong className="text-white block font-sports text-sm">{row.name}</strong>
                                {row.nickname && (
                                  <span className="text-[10px] text-amber-400 block font-semibold">
                                    "{row.nickname}"
                                  </span>
                                )}
                                {!row.isValid && row.errors && (
                                  <span className="text-[10px] text-rose-400 block font-bold">
                                    {row.errors.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Role & Style */}
                          <td className="py-3 px-3">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[11px] mb-0.5">
                              {row.role}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {row.battingStyle}
                            </span>
                          </td>

                          {/* Faliyu / City */}
                          <td className="py-3 px-3">
                            <span className="text-white font-medium block">
                              {row.faliyu || '—'}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {row.city || 'Katasvan'}
                            </span>
                          </td>

                          {/* Jersey */}
                          <td className="py-3 px-3">
                            <span className="text-white font-mono font-bold block">
                              #{row.jerseyNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Size: {row.jerseySize}
                            </span>
                          </td>

                          {/* Phone */}
                          <td className="py-3 px-3 font-mono text-slate-300">
                            {row.phone || '—'}
                          </td>

                          {/* Photo Preview Button */}
                          <td className="py-3 px-3 text-center">
                            {row.image ? (
                              <button
                                type="button"
                                onClick={() => setPreviewImage(row.image || null)}
                                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white transition cursor-pointer"
                                title="View Photo"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-slate-600 text-[10px]">None</span>
                            )}
                          </td>

                          {/* Payment Screenshot Preview Button */}
                          <td className="py-3 px-3 text-center">
                            {row.paymentScreenshot ? (
                              <button
                                type="button"
                                onClick={() => setPreviewImage(row.paymentScreenshot || null)}
                                className="p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition cursor-pointer"
                                title={row.transactionId ? `Ref: ${row.transactionId}` : 'View Payment'}
                              >
                                <Receipt className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-slate-600 text-[10px]">Unpaid</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!importResult && parsedRows.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-400">
              Selected <strong>{selectedIndices.size}</strong> of {validCount} valid players for batch insertion into database.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleImport}
                disabled={selectedIndices.size === 0 || isImporting}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition cursor-pointer"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ઇમ્પોર્ટ થઈ રહ્યું છે...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>IMPORT {selectedIndices.size} PLAYERS TO DATABASE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Image Preview Pop-up Modal */}
        {previewImage && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full overflow-hidden p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white font-bold">Image Preview</span>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-auto rounded-xl bg-black p-2 flex items-center justify-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-h-[55vh] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="text-center pt-1">
                <a
                  href={previewImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-400 hover:underline font-mono break-all inline-block"
                >
                  Open Original Link in New Tab ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

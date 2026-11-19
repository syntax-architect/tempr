import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileCheck2,
  Download,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  FileText,
  Check,
  Copy,
  MessageSquare,
  HelpCircle,
  Send,
  Calendar,
  Building2,
  Anchor,
  Package,
  Flame,
  Scale,
  FileSpreadsheet,
  FileArchive,
  QrCode,
  RefreshCw,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ApiService, BuyerDossier, PublicDossierResponse } from '../services/api';

export const SharePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dossier, setDossier] = useState<BuyerDossier | null>(null);

  // Passcode gate state
  const [requiresPasscode, setRequiresPasscode] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isVerifyingPasscode, setIsVerifyingPasscode] = useState<boolean>(false);

  // Buyer actions state
  const [activeModal, setActiveModal] = useState<'ACCEPT' | 'QUESTION' | 'REQUEST_DOC' | 'QR' | null>(null);
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string>('');
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  // UI state
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [expandedHeat, setExpandedHeat] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadDossier(token);
    }
  }, [token]);

  const loadDossier = async (shareToken: string, codeToPass?: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp: PublicDossierResponse = await ApiService.getPublicDossier(shareToken, codeToPass);
      if (resp.requires_passcode) {
        setRequiresPasscode(true);
        setLoading(false);
        return;
      }

      if (resp.valid && resp.dossier) {
        setDossier(resp.dossier);
        setRequiresPasscode(false);
      } else {
        setError(resp.error || 'The requested share link is invalid, expired, or has been revoked.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to the HeatLedger compliance network.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !passcode.trim()) return;

    setIsVerifyingPasscode(true);
    setPasscodeError(null);
    try {
      const resp = await ApiService.verifyPortalPasscode(token, passcode.trim());
      if (resp.valid && resp.dossier) {
        setDossier(resp.dossier);
        setRequiresPasscode(false);
      } else {
        setPasscodeError(resp.error || 'Incorrect passcode. Please check with the exporter.');
      }
    } catch (err: any) {
      setPasscodeError(err?.message || 'Passcode verification failed.');
    } finally {
      setIsVerifyingPasscode(false);
    }
  };

  const handleBuyerActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeModal || activeModal === 'QR') return;
    if (!buyerName.trim()) {
      alert('Please enter your name or organization.');
      return;
    }

    setIsSubmittingAction(true);
    try {
      const resp = await ApiService.submitBuyerAction(token, {
        action_type: activeModal,
        buyer_name: buyerName.trim(),
        buyer_email: buyerEmail.trim() || undefined,
        message: actionMessage.trim() || undefined,
      });

      if (activeModal === 'ACCEPT') {
        setIsAccepted(true);
        setActionSuccess('Shipment officially approved for EU customs clearance. Exporter QA & Dispatch alerted.');
      } else if (activeModal === 'QUESTION') {
        setActionSuccess('Technical inquiry dispatched to Exporter Metallurgical QA team.');
      } else if (activeModal === 'REQUEST_DOC') {
        setActionSuccess('Document request registered and prioritized for Dispatch.');
      }

      setTimeout(() => {
        setActiveModal(null);
        setActionMessage('');
      }, 1800);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit buyer action. Please retry.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const copyShareUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Helper for generating download URLs
  const getDownloadUrl = (fileType: 'zip' | 'cbam' | 'pdf') => {
    if (!token) return '#';
    return ApiService.getPortalDownloadUrl(token, fileType);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation & Status Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 group text-white hover:text-emerald-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  HEATLEDGER <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">PORTAL</span>
                </span>
                <span className="text-[10px] text-slate-400">EU CBAM &amp; EN 10204 Clearance Gateway</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyShareUrl}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
              title="Copy secure link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
            </button>

            {dossier && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                VERIFIED READY
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <p className="text-sm font-mono text-slate-400">Verifying tamper-proof token &amp; loading compliance dossier...</p>
          </div>
        )}

        {/* Passcode Required Gate */}
        {!loading && requiresPasscode && (
          <div className="max-w-md mx-auto my-12 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center space-y-3 mb-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Passcode Protected Dossier</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                The exporter has restricted access to this customs compliance packet. Please enter the authorized passcode provided by your supplier.
              </p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Enter Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. EuroStahl2026"
                  autoFocus
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {passcodeError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passcodeError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifyingPasscode || !passcode.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isVerifyingPasscode ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Unlock Dossier</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Error / Revoked State */}
        {!loading && !requiresPasscode && error && (
          <div className="max-w-lg mx-auto my-12 bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">Dossier Unavailable</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{error}</p>
            <div className="pt-4 border-t border-slate-800">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to HeatLedger Home
              </Link>
            </div>
          </div>
        )}

        {/* Unlocked Dossier Presentation */}
        {!loading && !requiresPasscode && dossier && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Exporter & Compliance Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      OFFICIAL CBAM COMPLIANCE PACKET
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      TOKEN: {dossier.token.slice(0, 10)}...
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Shipment {dossier.shipment_id}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                    <Building2 className="w-4 h-4 text-slate-400 inline" />
                    <span className="font-semibold text-white">{dossier.exporter_name}</span>
                    <span className="text-slate-500">·</span>
                    <span>Origin: <strong className="text-emerald-400">{dossier.exporter_country}</strong></span>
                    <span className="text-slate-500">·</span>
                    <span>Destination: <strong className="text-cyan-400">{dossier.destination_port}</strong></span>
                  </p>
                </div>

                {/* Acceptance status chip / primary action button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {isAccepted ? (
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-inner">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>ACCEPTED FOR CUSTOMS CLEARANCE</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveModal('ACCEPT')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept for Customs Clearance</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveModal('QR')}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                    title="View Verification QR Code"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span className="sm:inline">QR Code</span>
                  </button>
                </div>
              </div>

              {/* Shipment Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Scale className="w-3.5 h-3.5 text-slate-400" /> Net Weight
                  </div>
                  <div className="text-lg font-bold text-white font-mono">{dossier.net_weight_mt.toFixed(3)} MT</div>
                  <div className="text-[10px] text-slate-400 font-mono">Gross: {dossier.gross_weight_mt.toFixed(3)} MT</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Package className="w-3.5 h-3.5 text-slate-400" /> Commodity &amp; CN
                  </div>
                  <div className="text-xs font-bold text-white truncate font-mono" title={dossier.cn_code}>
                    {dossier.cn_code}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">EN 10204 Clause 6 Active</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Anchor className="w-3.5 h-3.5 text-slate-400" /> Containers
                  </div>
                  <div className="text-xs font-bold text-white font-mono truncate" title={dossier.containers.join(', ')}>
                    {dossier.containers.join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{dossier.containers.length} FCL Sealed Units</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Flame className="w-3.5 h-3.5 text-emerald-400" /> Carbon Intensity
                  </div>
                  <div className="text-lg font-bold text-emerald-400 font-mono">
                    {dossier.emissions_summary.specific_embedded_emissions_tco2_per_t} <span className="text-xs text-slate-300 font-normal">tCO₂/t</span>
                  </div>
                  <div className="text-[10px] text-emerald-300 font-mono">
                    -{dossier.emissions_summary.emissions_saving_pct}% vs EU Default
                  </div>
                </div>
              </div>

              {/* Custom Exporter Note if Present */}
              {dossier.custom_note && (
                <div className="mt-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Exporter Dispatch Note: </span>
                    <span>{dossier.custom_note}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Downloads Action Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    Download Customs &amp; Verification Assets
                  </h2>
                  <p className="text-xs text-slate-400">
                    Byte-identical original mill certificates and tamper-locked EN 10204 Clause 6 packages.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  Token expires: {new Date(dossier.expires_at).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* 1. Complete Dossier ZIP */}
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <FileArchive className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono group-hover:text-emerald-400 transition-colors">
                        Complete Dossier ZIP
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Contains Cover PDF, Untouched Mill MTC Annex A &amp; SHA-256 Manifest
                      </div>
                    </div>
                  </div>
                  <a
                    href={getDownloadUrl('zip')}
                    download
                    className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Package (ZIP)</span>
                  </a>
                </div>

                {/* 2. Official EU CBAM Data Sheet XML */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">
                        EU CBAM XML Data Sheet
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Official EU Communication template format for importer CBAM registry upload
                      </div>
                    </div>
                  </div>
                  <a
                    href={getDownloadUrl('cbam')}
                    download
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export XML Data Sheet</span>
                  </a>
                </div>

                {/* 3. Clause 6 Cover PDF */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono group-hover:text-purple-400 transition-colors">
                        Clause 6 Exporter Cover
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Digitally signed EN 10204 cover sheet with verifiable Ed25519 QR seal
                      </div>
                    </div>
                  </div>
                  <a
                    href={getDownloadUrl('pdf')}
                    download
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Cover PDF</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Heats & Melt-and-Pour Crude Steel Origin Ledger */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-emerald-400" />
                    Melt-and-Pour Crude Steel Origin by Heat
                  </h2>
                  <p className="text-xs text-slate-400">
                    Preserves complete traceability back to crude steel casting per Regulation (EU) 2026/1963.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                  {dossier.heats.length} Verified Heats
                </span>
              </div>

              {/* Heats List */}
              <div className="space-y-3 pt-2">
                {dossier.heats.map((heat) => {
                  const isExpanded = expandedHeat === heat.heat_number;
                  return (
                    <div
                      key={heat.heat_number}
                      className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden transition-all"
                    >
                      <div
                        onClick={() => setExpandedHeat(isExpanded ? null : heat.heat_number)}
                        className="p-4 cursor-pointer hover:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-mono text-xs font-bold shrink-0">
                            HT
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-white text-sm">{heat.heat_number}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {heat.melt_country}
                              </span>
                              <span className="text-xs text-slate-400 font-sans">{heat.mill_name}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                              <span>Grade: <strong className="text-slate-200">{heat.steel_grade}</strong></span>
                              <span>·</span>
                              <span>Process: <strong className="text-slate-200">{heat.crude_steel_process}</strong></span>
                              <span>·</span>
                              <span>Quantity: <strong className="text-emerald-400">{heat.tonnes} MT</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-white">CEV {heat.cev.toFixed(3)}</div>
                            <div className="text-[10px] text-emerald-400 font-mono">In Spec (IIW &le; 0.450)</div>
                          </div>
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            aria-label="Toggle ladle chemistry details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Ladle Chemistry Table */}
                      {isExpanded && (
                        <div className="p-4 bg-slate-900/80 border-t border-slate-800 space-y-3">
                          <div className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                            <span>Ladle Chemical Composition (% Weight):</span>
                            <span className="text-[11px] text-slate-400">EN 10204 Type 3.1 Certified</span>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center font-mono">
                            {Object.entries(heat.chemistry).map(([elem, val]) => (
                              <div key={elem} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                                <div className="text-[10px] text-slate-400">{elem}</div>
                                <div className="text-xs font-bold text-white mt-0.5">{val.toFixed(3)}%</div>
                              </div>
                            ))}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono pt-1 flex items-center justify-between">
                            <span>Upstream Mill MTC: <strong>{heat.mtc_number}</strong></span>
                            <span className="text-emerald-400">Physical Test &amp; Chemistry Verified</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cryptographic Seal & Verification Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Cryptographic Ed25519 Digital Seal
                    </h2>
                    <p className="text-xs text-slate-400">
                      Tamper-evident verification guaranteeing EN 10204 Clause 6 byte-identity.
                    </p>
                  </div>
                </div>

                <Link
                  to={dossier.digital_signature.verification_url}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify on Public Chain</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-slate-400 text-[11px]">AUTHORIZED SIGNER &amp; TIME</div>
                  <div className="text-white font-bold">{dossier.digital_signature.signer_name}</div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Signed at: {dossier.digital_signature.signed_at}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-slate-400 text-[11px]">ANNEX A ORIGINAL MTC SHA-256</div>
                  <div className="text-emerald-400 text-[11px] break-all font-mono">
                    {dossier.digital_signature.annex_a_sha256}
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Algorithm: {dossier.digital_signature.algorithm} · Key: {dossier.digital_signature.public_key_fingerprint}
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer Interactive Actions Footer Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    Buyer &amp; Customs Broker Actions
                  </h2>
                  <p className="text-xs text-slate-400">
                    Need additional documents or have a technical question? Direct link to exporter QA &amp; dispatch.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveModal('ACCEPT')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAccepted ? 'Update Acceptance' : 'Accept for Customs Clearance'}</span>
                </button>

                <button
                  onClick={() => setActiveModal('QUESTION')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>Raise a Technical Question</span>
                </button>

                <button
                  onClick={() => setActiveModal('REQUEST_DOC')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Request Missing Document</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Action Modal (ACCEPT / QUESTION / REQUEST_DOC) */}
      {activeModal && activeModal !== 'QR' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {activeModal === 'ACCEPT' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {activeModal === 'QUESTION' && <HelpCircle className="w-5 h-5 text-cyan-400" />}
                {activeModal === 'REQUEST_DOC' && <FileText className="w-5 h-5 text-purple-400" />}
                <span>
                  {activeModal === 'ACCEPT' && 'Accept Shipment for Customs Clearance'}
                  {activeModal === 'QUESTION' && 'Ask Exporter QA a Question'}
                  {activeModal === 'REQUEST_DOC' && 'Request Missing Document'}
                </span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {actionSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-sm text-emerald-300 font-medium">{actionSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleBuyerActionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Your Name &amp; Company / Customs Broker *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Hans Gruber (EuroStahl Logistics Rotterdam)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Your Email (for notification of replies)
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="e.g. h.gruber@eurostahl.de"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    {activeModal === 'ACCEPT' && 'Customs Clearance Notes / Reference (Optional)'}
                    {activeModal === 'QUESTION' && 'Your Question for QA &amp; Metallurgy *'}
                    {activeModal === 'REQUEST_DOC' && 'Specific Document Details (e.g. Spectrometer calibration) *'}
                  </label>
                  <textarea
                    rows={3}
                    required={activeModal !== 'ACCEPT'}
                    value={actionMessage}
                    onChange={(e) => setActionMessage(e.target.value)}
                    placeholder={
                      activeModal === 'ACCEPT'
                        ? 'e.g. Customs declaration reference DE-HAM-2026-9912 authorized.'
                        : 'Please provide full details for the exporter dispatch team...'
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAction}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    {isSubmittingAction ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {activeModal === 'ACCEPT' ? 'Confirm Acceptance' : 'Send to Exporter'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QR Code Inspection Modal */}
      {activeModal === 'QR' && dossier && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Verification QR Code</span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Stylized high-contrast SVG QR Code Matrix */}
            <div className="p-4 bg-white rounded-xl inline-block shadow-inner mx-auto">
              <svg className="w-48 h-48" viewBox="0 0 100 100" fill="black">
                {/* 3 Corner Positioning Targets */}
                <rect x="5" y="5" width="28" height="28" rx="4" />
                <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="13" width="12" height="12" fill="black" />

                <rect x="67" y="5" width="28" height="28" rx="4" />
                <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="75" y="13" width="12" height="12" fill="black" />

                <rect x="5" y="67" width="28" height="28" rx="4" />
                <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="75" width="12" height="12" fill="black" />

                {/* Simulated Data Pattern Grid */}
                <rect x="38" y="10" width="5" height="5" />
                <rect x="48" y="10" width="5" height="5" />
                <rect x="58" y="10" width="5" height="5" />
                <rect x="38" y="20" width="5" height="5" />
                <rect x="58" y="20" width="5" height="5" />
                <rect x="38" y="30" width="15" height="5" />

                <rect x="10" y="38" width="5" height="5" />
                <rect x="20" y="38" width="5" height="5" />
                <rect x="38" y="38" width="10" height="10" />
                <rect x="52" y="38" width="8" height="8" />
                <rect x="68" y="38" width="6" height="6" />
                <rect x="80" y="38" width="8" height="8" />

                <rect x="10" y="48" width="8" height="5" />
                <rect x="25" y="48" width="5" height="5" />
                <rect x="45" y="50" width="10" height="6" />
                <rect x="65" y="48" width="10" height="5" />
                <rect x="82" y="48" width="8" height="5" />

                <rect x="10" y="58" width="5" height="5" />
                <rect x="22" y="58" width="6" height="5" />
                <rect x="38" y="58" width="8" height="8" />
                <rect x="55" y="58" width="5" height="5" />
                <rect x="75" y="58" width="15" height="5" />

                <rect x="38" y="72" width="6" height="6" />
                <rect x="50" y="72" width="8" height="8" />
                <rect x="68" y="70" width="10" height="5" />
                <rect x="85" y="70" width="6" height="6" />
                <rect x="42" y="84" width="8" height="6" />
                <rect x="60" y="82" width="8" height="8" />
                <rect x="75" y="82" width="15" height="6" />
              </svg>
            </div>

            <div className="text-xs text-slate-300 font-mono">
              Scannable by customs tablet / smartphone
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Direct verification link:{' '}
              <span className="text-emerald-400 font-mono">
                {dossier.digital_signature.verification_url}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Growth Loop Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Prepared with HeatLedger AI</span>
            <span>·</span>
            <span>EN 10204 Clause 6 &amp; CBAM Verification Engine</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <Link to="/" className="text-emerald-400 hover:underline flex items-center gap-1">
              <span>Are you an Exporter? Learn More</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SharePage;

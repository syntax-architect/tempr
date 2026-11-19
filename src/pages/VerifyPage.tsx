import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  FileText,
  AlertTriangle,
  Search,
  Upload,
  XCircle,
  KeyRound,
  FileCheck2,
  Copy,
  Check,
} from 'lucide-react';
import { ApiService, VerificationRecord, FileTamperCheckResult } from '../services/api';

export const VerifyPage: React.FC = () => {
  const { code: routeCode } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState<string>(routeCode || '');
  const [record, setRecord] = useState<VerificationRecord | null>(null);
  const [tamperResult, setTamperResult] = useState<FileTamperCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  useEffect(() => {
    if (routeCode) {
      handleLookup(routeCode);
    }
  }, [routeCode]);

  const handleLookup = async (lookupCode: string) => {
    if (!lookupCode.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setTamperResult(null);

    try {
      const res = await ApiService.lookupVerification(lookupCode.trim());
      setRecord(res);
    } catch (err: any) {
      setRecord(null);
      setErrorMsg(err.message || 'No registered certificate found for this verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      navigate(`/verify/${encodeURIComponent(inputCode.trim())}`);
      handleLookup(inputCode.trim());
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await ApiService.verifyCheckFile(file);
      setTamperResult(result);
      if (result.verification_code) {
        setInputCode(result.verification_code);
        const res = await ApiService.lookupVerification(result.verification_code).catch(() => null);
        if (res) setRecord(res);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'File verification error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyPublicKey = () => {
    if (record?.public_key_b64) {
      navigator.clipboard.writeText(record.public_key_b64);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl space-y-6">
        {/* Navigation Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to HeatLedger Home
          </Link>
          <span className="text-xs font-mono text-slate-500">
            Open Cryptographic Verification Gateway · Ed25519
          </span>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  record?.status === 'VALID'
                    ? 'bg-emerald-400 animate-pulse'
                    : record?.status === 'SUPERSEDED'
                      ? 'bg-amber-400'
                      : record?.status === 'REVOKED' || tamperResult?.tampered
                        ? 'bg-rose-400'
                        : 'bg-slate-500'
                }`}
              />
              <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                EN 10204 Clause 6 · Public Verifier
              </span>
            </div>

            {record && (
              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                  record.status === 'VALID'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : record.status === 'SUPERSEDED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                STATUS: {record.status} (v{record.version})
              </span>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="block text-xs font-mono text-slate-300 font-semibold">
              Enter Verification Code or Document SHA-256 Hash
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="e.g. HL-2026-A1B2 or SHA-256 hash"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputCode.trim()}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Verify</span>
              </button>
            </div>
          </form>

          {/* Tamper Check Dropzone */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 hover:border-slate-700 transition-colors text-center space-y-2">
            <Upload className="w-5 h-5 text-slate-400 mx-auto" />
            <div className="text-xs text-slate-300 font-medium">
              Verify an exported PDF file against the published Ed25519 public key
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Checks byte-level SHA-256 match and cryptographic signature integrity.
            </p>
            <label className="inline-block px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-xs cursor-pointer border border-slate-700">
              <span>Choose PDF File</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tamper Warning if File Tampered */}
          {tamperResult && tamperResult.tampered && (
            <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 space-y-1 font-mono text-xs">
              <div className="font-bold flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4" />
                <span>SECURITY ALERT: DOCUMENT MODIFIED OR TAMPERED</span>
              </div>
              <p className="text-xs text-rose-300/90 leading-relaxed">
                {tamperResult.error ||
                  'The uploaded file hash does not match the registered Ed25519 digital signature.'}
              </p>
              {tamperResult.computed_sha256 && (
                <div className="text-xs text-slate-400 break-all pt-1">
                  Computed SHA-256: {tamperResult.computed_sha256}
                </div>
              )}
            </div>
          )}

          {/* Verified Document Details */}
          {record && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block mb-0.5 uppercase tracking-wider text-xs">
                    ORGANIZATION
                  </span>
                  <span className="text-white font-bold">{record.organization_name}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block mb-0.5 uppercase tracking-wider text-xs">
                    EXPORT INVOICE REF
                  </span>
                  <span className="text-cyan-300 font-bold">{record.invoice_number}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block mb-0.5 uppercase tracking-wider text-xs">
                    AUTHORISED SIGNER
                  </span>
                  <span className="text-emerald-300 font-bold">{record.signer_name}</span>
                  <span className="text-slate-400 text-xs block">Role: {record.signer_role}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block mb-0.5 uppercase tracking-wider text-xs">
                    SIGNATURE TIMESTAMP (UTC)
                  </span>
                  <span className="text-amber-300 font-bold">{record.signed_at}</span>
                  <span className="text-slate-400 text-xs block">Version: v{record.version}</span>
                </div>
              </div>

              {/* Superseded Notice if Version > 1 or Superseded */}
              {record.status === 'SUPERSEDED' && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-mono space-y-0.5">
                  <span className="font-bold flex items-center gap-1.5 text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Notice: Version Superseded
                  </span>
                  <p className="text-xs text-slate-300">
                    This certificate (v{record.version}) has been superseded by a newer signed
                    amendment.
                  </p>
                </div>
              )}

              {/* Cryptographic Proof Block */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Ed25519 ASYMMETRIC SIGNATURE CONFIRMED</span>
                  </div>
                  <span className="text-xs text-slate-500">Key ID: {record.key_id}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-400">
                    <span className="text-slate-500">Cover PDF SHA-256: </span>
                    <span className="text-slate-300 break-all">{record.pdf_sha256}</span>
                  </div>
                  {record.upstream_sha256 && record.upstream_sha256 !== 'none' && (
                    <div className="text-slate-400">
                      <span className="text-slate-500">Upstream Mill MTC SHA-256: </span>
                      <span className="text-slate-300 break-all">{record.upstream_sha256}</span>
                    </div>
                  )}
                  <div className="text-slate-400">
                    <span className="text-slate-500">Ed25519 Signature (Base64): </span>
                    <span className="text-emerald-400 break-all">{record.signature_b64}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Published Public Key:</span>
                  <button
                    onClick={copyPublicKey}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedKey ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedKey ? 'Copied Public Key' : 'Copy Ed25519 Public Key'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 text-center text-xs font-mono text-slate-500 border-t border-slate-800/80">
            Compliant with EN 10204:2004 Clause 6 · European Union Regulation 2026/1963 · UK CDS
            Origin Standard
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;

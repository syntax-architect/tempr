import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  X,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../ui/ToastContext';
import { triggerCustomsApprovalConfetti } from '../../effects/ConfettiTrigger';

interface InspectorPinChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentSha256?: string;
  invoiceNumber?: string;
  onSuccess?: (signatureData?: any) => void;
}

export const InspectorPinChallengeModal: React.FC<InspectorPinChallengeModalProps> = ({
  isOpen,
  onClose,
  documentSha256 = '8d7ae83f7d88f1f2790afd433986c97ea2990a578b771f5bf672c3ff52e58d6b',
  invoiceNumber = 'EXP-2026-109',
  onSuccess,
}) => {
  const { loginWithPin, verifyStepUp, isQaInspector, user } = useAuth();
  const toast = useToast();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setErrorMsg(null);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMsg(null);

    // Auto-advance
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const arr = pasted.split('');
      setDigits(arr);
      inputRefs.current[5]?.focus();
      handleSubmitWithPin(pasted);
    }
  };

  const handleAutoFillDemoPin = () => {
    const demoPin = ['4', '4', '0', '9', '2', '6'];
    setDigits(demoPin);
    setErrorMsg(null);
    inputRefs.current[5]?.focus();
    handleSubmitWithPin('440926');
  };

  const handleSubmitWithPin = async (fullPin: string) => {
    if (fullPin.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the security PIN.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      let success = false;
      if (user && isQaInspector) {
        // Authenticated inspector performing 10-minute step-up MFA
        success = await verifyStepUp(fullPin);
      } else {
        // Floor PIN login activating QA Inspector session
        success = await loginWithPin(fullPin);
      }

      if (success) {
        triggerCustomsApprovalConfetti();
        toast.success(
          '10-Minute Step-Up MFA Verified',
          'QA Inspector identity confirmed. EN 10204 3.1 signing authorized for the next 10 minutes (600s).'
        );
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        setErrorMsg('Invalid Security Code / PIN. (Demo default: 440926)');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pinStr = digits.join('');
    handleSubmitWithPin(pinStr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-950 rounded-2xl max-w-xl w-full border border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.15)] text-white relative overflow-hidden">
        {/* Top Accent Security Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>EN 10204 Clause 6 · Cryptographic 2FA Sign-Off</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Authorised QA Inspector Security Challenge</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              To apply a legally-binding European EN 10204 3.1 inspection certificate stamp, verify
              the Authorised Inspection Representative security passkey.
            </p>
          </div>

          {/* Inspector ID & Accreditation Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 block uppercase">AUTHORISED SIGNATORY</span>
              <span className="font-bold text-slate-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                R. K. Chatterjee
              </span>
              <span className="text-slate-400 text-xs block">
                Head of QA &amp; Metallurgy (#QA-04)
              </span>
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-3">
              <span className="text-xs text-slate-500 block uppercase">FACTORY ACCREDITATION</span>
              <span className="font-bold text-emerald-400">QA Lab (Declared by plant)</span>
              <span className="text-slate-400 text-xs block">
                Howrah Precision Forgings (IN-WB-4409)
              </span>
            </div>
          </div>

          {/* Document Fingerprint SHA-256 Box */}
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                <span>Target Document SHA-256 Fingerprint:</span>
              </span>
              <span className="text-amber-300 font-bold">{invoiceNumber}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 break-all select-all flex items-center justify-between gap-2">
              <span className="truncate">{documentSha256}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(documentSha256);
                  setCopiedHash(true);
                  setTimeout(() => setCopiedHash(false), 2000);
                }}
                className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors p-1"
                title="Copy SHA-256"
              >
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Form: 6-Digit PIN Inputs */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enter 6-Digit Inspector Security PIN / Passkey:</span>
                </label>

                {/* Subtle Auto-fill Demo PIN Pill */}
                <button
                  type="button"
                  onClick={handleAutoFillDemoPin}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Auto-Fill Demo Inspector PIN (440926)</span>
                </button>
              </div>

              {/* 6 Digit Input Grid */}
              <div className="grid grid-cols-6 gap-2 sm:gap-3 py-1">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    className="w-full h-12 text-center text-lg font-mono font-bold bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-xs font-mono text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs font-mono text-slate-500">Stateless HMAC-SHA256 JWT</span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading || digits.join('').length !== 6}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-obsidian-950 font-bold text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Passkey...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Verify &amp; Authenticate Session</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

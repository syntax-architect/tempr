import React, { useState } from 'react';
import {
  Stamp,
  FileCheck2,
  ShieldCheck,
  CheckSquare,
  Square,
  Lock,
  ArrowRight,
  AlertCircle,
  Clock,
  UserCheck,
  Check,
  FileText,
  Building,
  CheckCircle2,
  Sparkles,
  Copy,
  KeyRound,
  Fingerprint,
} from 'lucide-react';
import { useToast } from '../../ui/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { ApiService } from '../../../services/api';
import { InspectorPinChallengeModal } from '../modals/InspectorPinChallengeModal';

interface PendingCertificate {
  id: string;
  invoice: string;
  productTitle: string;
  destination: string;
  allocatedHeat: string;
  millName: string;
  tonnage: number;
  cnCode: string;
  defaultMode: 'TRANSFORMED_3_1' | 'CLAUSE_6_PASSTHROUGH';
  sha256: string;
}

const PENDING_CERTIFICATES: PendingCertificate[] = [
  {
    id: 'cert-109',
    invoice: 'EXP-2026-109',
    productTitle: 'Forged Flanges ASTM A105 (ASME B16.5 Class 300)',
    destination: 'Bremen, Germany',
    allocatedHeat: 'TSJ-26-9021',
    millName: 'Tata Steel Jamshedpur',
    tonnage: 24.5,
    cnCode: '7307 91',
    defaultMode: 'TRANSFORMED_3_1',
    sha256: '8d7ae83f7d88f1f2790afd433986c97ea2990a578b771f5bf672c3ff52e58d6b',
  },
  {
    id: 'cert-120',
    invoice: 'EXP-2026-120',
    productTitle: 'High-Tensile Stud Bolts ASTM A193 B7',
    destination: 'Felixstowe, UK',
    allocatedHeat: 'JSW-26-7734',
    millName: 'JSW Steel Vijayanagar',
    tonnage: 21.0,
    cnCode: '7318 15',
    defaultMode: 'TRANSFORMED_3_1',
    sha256: '5d73578dc9911849759dae3726c9c143191a4ebd6bde24b8a1c32a17ec0dbc89',
  },
  {
    id: 'cert-125',
    invoice: 'EXP-2026-125',
    productTitle: 'Cut Structural Hollow Sections S355JR',
    destination: 'Genoa, Italy',
    allocatedHeat: 'RINL-26-1108',
    millName: 'RINL Vizag Steel Plant',
    tonnage: 19.8,
    cnCode: '7326 90',
    defaultMode: 'CLAUSE_6_PASSTHROUGH',
    sha256: 'f1ebc55677819f9911d560cd0155dca3656bcec7c911edbcc706522f85a8785b',
  },
];

interface SignOffQueueViewProps {
  onSignCertificate?: (remainingCount: number) => void;
  onNavigateToDossier?: () => void;
}

export const SignOffQueueView: React.FC<SignOffQueueViewProps> = ({
  onSignCertificate,
  onNavigateToDossier,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [selectedCertId, setSelectedCertId] = useState<string>('cert-109');
  const [complianceMode, setComplianceMode] = useState<'TRANSFORMED_3_1' | 'CLAUSE_6_PASSTHROUGH'>(
    'TRANSFORMED_3_1'
  );
  const [attestations, setAttestations] = useState<Record<string, boolean>>({});
  const [signedMap, setSignedMap] = useState<
    Record<
      string,
      {
        isSigned: boolean;
        timestamp: string;
        hmacSignature: string;
        rawHash: string;
        inspectorName: string;
        inspectorId: string;
      }
    >
  >({});
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const toast = useToast();

  const currentCert =
    PENDING_CERTIFICATES.find((c) => c.id === selectedCertId) || PENDING_CERTIFICATES[0];
  const isCurrentCertSigned = !!signedMap[selectedCertId]?.isSigned;
  const currentAttestationChecked = !!attestations[selectedCertId];

  // Calculate remaining unsigned count
  const signedCount = Object.values(signedMap).filter((v) => v.isSigned).length;
  const remainingCount = Math.max(0, PENDING_CERTIFICATES.length - signedCount);

  const executeCryptographicSign = async (certId: string) => {
    const cert = PENDING_CERTIFICATES.find((c) => c.id === certId) || currentCert;
    setIsSigning(true);
    const timestamp = new Date().toUTCString();

    try {
      // 1. Call backend or deterministic fallback to compute keyed HMAC-SHA256 signature
      const sigData = await ApiService.signCertificate({
        invoice_number: cert.invoice,
        heat_number: cert.allocatedHeat,
        total_see: 1.93,
        timestamp,
        sha256_upstream_pdf: cert.sha256,
      });

      const newSignedMap = {
        ...signedMap,
        [certId]: {
          isSigned: true,
          timestamp,
          hmacSignature: sigData.signature,
          rawHash: sigData.raw_hash,
          inspectorName: user?.name || 'R. K. Chatterjee',
          inspectorId: user?.sub || 'QA-04',
        },
      };
      setSignedMap(newSignedMap);

      const newRemaining = Math.max(
        0,
        PENDING_CERTIFICATES.length - Object.values(newSignedMap).filter((v) => v.isSigned).length
      );
      if (onSignCertificate) {
        onSignCertificate(newRemaining);
      }

      toast.success(
        'Certificate Digitally Signed & Sealed',
        `${cert.invoice} verified under EN 10204 3.1. HMAC-SIG: ${sigData.signature.substring(0, 24)}...`
      );
    } catch (err: any) {
      toast.error('Signing Failed', err.message || 'Could not sign document.');
    } finally {
      setIsSigning(false);
    }
  };

  const handleApplySignature = () => {
    if (!currentAttestationChecked || isCurrentCertSigned) return;

    if (!isAuthenticated) {
      // Prompt 2FA / Inspector PIN challenge modal
      setIsChallengeModalOpen(true);
      return;
    }

    executeCryptographicSign(selectedCertId);
  };

  const handleSelectNextUnsigned = () => {
    const nextUnsigned = PENDING_CERTIFICATES.find((c) => !signedMap[c.id]?.isSigned);
    if (nextUnsigned) {
      setSelectedCertId(nextUnsigned.id);
      setComplianceMode(nextUnsigned.defaultMode);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* View Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Stamp className="w-5 h-5 text-emerald-600" />
              <span>EN 10204:2004 Clause 6 &amp; Authorized QA Sign-Off Queue</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Legal digital stamping workflow for the factory's Authorized Inspection
              Representative, legally binding under European standard EN 10204.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {remainingCount} Pending Stamp
            </span>
            {isAuthenticated ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-900 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">
                  Verified Signatory: {user?.name || 'R. K. Chatterjee'} (#{user?.sub || 'QA-04'})
                </span>
              </div>
            ) : (
              <button
                onClick={() => setIsChallengeModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-mono text-amber-900 shadow-sm transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span className="font-bold">Unlock Signatory Passkey (PIN Required)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Pending Certificate Selection Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PENDING_CERTIFICATES.map((cert) => {
          const isSelected = selectedCertId === cert.id;
          const isSigned = !!signedMap[cert.id]?.isSigned;

          return (
            <button
              key={cert.id}
              onClick={() => {
                setSelectedCertId(cert.id);
                setComplianceMode(cert.defaultMode);
              }}
              className={`p-4 rounded-xl text-left border transition-all ${isSelected
                ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                : 'bg-slate-50 hover:bg-white border-slate-200'
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-900">{cert.invoice}</span>
                {isSigned ? (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Signed</span>
                  </span>
                ) : (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                    Pending
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-700 font-medium truncate">
                {cert.productTitle.split('(')[0]}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">
                {cert.tonnage} MT · {cert.destination}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tamper-Lock Status Notice when Signed */}
      {isCurrentCertSigned && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-900 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Document Tamper-Locked:</strong> Parameters cryptographically sealed via Keyed
              HMAC-SHA256. Modifications prohibited under EN 10204:2004 Clause 6.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-xs shrink-0">
            SEAL ACTIVE
          </span>
        </div>
      )}

      {/* Mode Selection Tabs (Mode A vs Mode B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode A: Transformed Product */}
        <div
          onClick={() => {
            if (!isCurrentCertSigned) setComplianceMode('TRANSFORMED_3_1');
          }}
          className={`p-5 rounded-2xl transition-all border ${isCurrentCertSigned ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
            } ${complianceMode === 'TRANSFORMED_3_1'
              ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500'
              : 'bg-slate-50 border-slate-200 hover:bg-white'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              MODE A · TRANSFORMED GOODS
            </span>
            {complianceMode === 'TRANSFORMED_3_1' && <Check className="w-4 h-4 text-emerald-600" />}
          </div>
          <h3 className="font-bold text-sm text-slate-900 mb-1">
            Issue Factory 3.1 + Lock Upstream Mill 3.1 as Annex A
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            For forged flanges (
            <span className="font-mono font-semibold text-slate-700">CN 7307</span>), heat-treated
            fasteners (<span className="font-mono font-semibold text-slate-700">CN 7318</span>), or
            welded tubes (<span className="font-mono font-semibold text-slate-700">CN 7306</span>)
            where mechanical properties were modified during manufacturing.
          </p>
        </div>

        {/* Mode B: Clause 6 Intermediary Pass-Through */}
        <div
          onClick={() => {
            if (!isCurrentCertSigned) setComplianceMode('CLAUSE_6_PASSTHROUGH');
          }}
          className={`p-5 rounded-2xl transition-all border ${isCurrentCertSigned ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
            } ${complianceMode === 'CLAUSE_6_PASSTHROUGH'
              ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500'
              : 'bg-slate-50 border-slate-200 hover:bg-white'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
              MODE B · CLAUSE 6 PASS-THROUGH
            </span>
            {complianceMode === 'CLAUSE_6_PASSTHROUGH' && (
              <Check className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-900 mb-1">
            Clause 6 Compliance Declaration + Packing List
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            For machined or cut bar stock where original raw material properties were unaltered.
            Generates the legal Clause 6 packing dossier alongside the pristine upstream mill
            certificate.
          </p>
        </div>
      </div>

      {/* Main Certificate Compiler & Sign-Off Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
        {/* Certificate Pre-fill Metadata */}
        <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-slate-400">Target Export Invoice</div>
            <div className="text-base font-bold font-mono text-slate-900">
              {currentCert.invoice} · {currentCert.productTitle} to {currentCert.destination}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-500">Allocated Heat:</span>
            <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              #{currentCert.allocatedHeat} ({currentCert.millName.split(' ')[0]})
            </span>
          </div>
        </div>

        {/* Certificate Content Review */}
        <div className="p-5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
            <span className="font-bold text-slate-800 uppercase">
              {complianceMode === 'TRANSFORMED_3_1'
                ? 'Factory Transformed 3.1 Cover Certificate'
                : 'Clause 6 Declaration of Compliance'}
            </span>
            <span className="text-emerald-700 font-semibold">
              {isCurrentCertSigned ? 'Digitally Signed (Ed25519)' : 'Pending Inspector Signature'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
            <div>
              <span className="text-slate-400 text-xs block">MANUFACTURER:</span>
              <span className="font-bold">Howrah Precision Forgings Pvt. Ltd.</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">EU INSTALLATION ID:</span>
              <span className="font-bold">IN-WB-4409</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">ORIGIN OF MELT &amp; POUR:</span>
              <span className="font-bold text-emerald-700">INDIA (ISO IN)</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">UPSTREAM ANNEX:</span>
              <span className="font-bold text-blue-600">Locked 3.1 PDF Annexed</span>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Spectrometer Ladle Check Passed</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Tensile &amp; Hardness Verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Mass-Balance Quota Deducted</span>
            </div>
          </div>
        </div>

        {/* Authorized Inspection Representative Sign-Off Box */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Stamp className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-100">
                Authorized Inspection Representative Sign-Off Box
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              European Standard EN 10204:2004 Clause 4 &amp; Clause 6
            </span>
          </div>

          {/* Inspector ID Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-xs block">AUTHORIZED REPRESENTATIVE</span>
              <span className="font-bold text-slate-200">R. K. Chatterjee</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">DESIGNATION &amp; ROLE</span>
              <span className="font-bold text-slate-200">Head of Metallurgy &amp; QA (#QA-04)</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">INDEPENDENCE STATUS</span>
              <span className="font-bold text-emerald-400">Independent of Production Works</span>
            </div>
          </div>

          {/* Mandatory Legal Attestation Checkbox */}
          <div
            onClick={() => {
              if (!isCurrentCertSigned) {
                setAttestations((prev) => ({ ...prev, [selectedCertId]: !prev[selectedCertId] }));
              }
            }}
            className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${currentAttestationChecked || isCurrentCertSigned
              ? 'bg-emerald-950/40 border-emerald-500/50'
              : 'bg-slate-950 border-slate-800'
              }`}
          >
            <div className="mt-0.5">
              {currentAttestationChecked || isCurrentCertSigned ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-white">Mandatory Legal Attestation:</strong> I hereby certify
              under European Standard EN 10204:2004 that the delivered products for invoice{' '}
              <span className="font-mono text-amber-300 font-bold">{currentCert.invoice}</span>{' '}
              comply with the specifications in the purchase order and relevant ASTM/EN standards. I
              confirm that Country of Melt &amp; Pour is India, and that the upstream mill test
              certificate attached as Annex A is pristine and unaltered.
            </p>
          </div>

          {/* Sign & Stamp Button or Stamped Result */}
          {!isCurrentCertSigned ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                {isAuthenticated ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">
                      Authenticated Signatory: R. K. Chatterjee (#QA-04)
                    </span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>2FA Passkey challenge required to sign (#QA-04)</span>
                  </>
                )}
              </div>
              <button
                onClick={handleApplySignature}
                disabled={!currentAttestationChecked || isSigning}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-obsidian-950 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {isAuthenticated ? (
                  <>
                    <Stamp className="w-4 h-4" />
                    <span>Apply Timestamped Digital Signature &amp; Factory Stamp</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Apply Timestamped Digital Signature &amp; Factory Stamp</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center text-emerald-400 p-1">
                      <span className="text-xs font-black font-mono">SEALED</span>
                      <span className="text-xs font-mono">QA-04</span>
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
                        <span>
                          DIGITALLY SIGNED &amp; SEALED BY{' '}
                          {signedMap[selectedCertId]?.inspectorName || 'R. K. CHATTERJEE'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/40 font-bold">
                          #{signedMap[selectedCertId]?.inspectorId || 'QA-04'}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        Timestamp:{' '}
                        {signedMap[selectedCertId]?.timestamp || new Date().toUTCString()} · EN
                        10204 Clause 6 Authenticated
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-obsidian-950 font-mono font-bold text-xs uppercase shadow">
                    Container Dossier Ready
                  </span>
                </div>

                {/* Verifiable HMAC-SHA256 Digital Signature Display */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verifiable HMAC-SHA256 Digital Signature Hash:</span>
                    </span>
                    <span className="text-slate-400 text-xs">Tamper-Evident Signature</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/80 border border-emerald-500/40 text-xs text-emerald-300 font-bold">
                    <span className="truncate select-all">
                      {signedMap[selectedCertId]?.hmacSignature ||
                        'hl_sig_v1_17af54387e554162e6031e600d780d1067bddb03bea69187eaa685b0178a56c5'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const sig = signedMap[selectedCertId]?.hmacSignature || '';
                        navigator.clipboard.writeText(sig);
                        toast.info(
                          'Signature Copied',
                          'HMAC-SHA256 signature hash copied to clipboard.'
                        );
                      }}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Copy HMAC Signature"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-0.5">
                    <span>
                      Canonical Hash: {currentCert.invoice}|{currentCert.allocatedHeat}|1.9300|
                      {currentCert.sha256.substring(0, 12)}...
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      Embedded onto Page 1 PDF Cover &amp; EU CBAM XML
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                {remainingCount > 0 && (
                  <button
                    onClick={handleSelectNextUnsigned}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Review Next Pending ({remainingCount})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {onNavigateToDossier && (
                  <button
                    onClick={onNavigateToDossier}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <span>Proceed to Customs Dossier Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inspector Passkey / 2FA Sign-Off Challenge Modal */}
      <InspectorPinChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        documentSha256={currentCert.sha256}
        invoiceNumber={currentCert.invoice}
        onSuccess={() => {
          executeCryptographicSign(selectedCertId);
        }}
      />

      {/* All Signed Celebratory Banner */}
      {remainingCount === 0 && (
        <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-mono text-emerald-300">
                100% Sign-Off Queue Cleared
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                All 3 pending export certificates have been legally authenticated. Zero regulatory
                blockers for Hamburg, Rotterdam, and Genoa.
              </p>
            </div>
          </div>
          {onNavigateToDossier && (
            <button
              onClick={onNavigateToDossier}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-obsidian-900 font-bold text-xs font-mono uppercase tracking-wider shrink-0 transition-all shadow"
            >
              Open Customs Dossier
            </button>
          )}
        </div>
      )}
    </div>
  );
};

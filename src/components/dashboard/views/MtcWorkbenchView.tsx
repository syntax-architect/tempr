import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  SIMULATOR_PRESETS,
  METALLURGICAL_STANDARDS,
  STANDARDS_LIST,
  PRESET_MATCHING_STANDARDS,
  evaluateChemistryAgainstStandard,
  getElementToleranceDelta,
} from '../../../data/mockData';
import { SimulatorPreset, BoundingBox } from '../../../types';
import { ApiService } from '../../../services/api';
import { useToast } from '../../ui/ToastContext';
import { haptics } from '../../../lib/motion';
import {
  FileText,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Sliders,
  Sparkles,
  Scan,
  RefreshCw,
  Info,
  Maximize2,
  Download,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Eye,
  Check,
  Edit2,
  X,
  XCircle,
  HelpCircle,
  CornerDownRight,
  Layers,
  Flag
} from 'lucide-react';
import { LaserScanBeam } from '../../effects/LaserScanBeam';
import { ConfidenceBadge, HeatNumberTag, StatusChip } from '../../ui/Badges';
import { Button } from '../../ui/Button';

interface MtcWorkbenchViewProps {
  initialPresetId?: string;
  initialUploadedFile?: File | null;
}

export interface WorkbenchField {
  id: string;
  group: 'identity' | 'traceability' | 'chemistry' | 'mechanical';
  label: string;
  value: string;
  unit?: string;
  confidence: number; // 0 - 100
  isConfirmed: boolean;
  boxId?: string;
  originalValue?: string;
  correctedBy?: string;
  clauseSource?: string;
}

export const MtcWorkbenchView: React.FC<MtcWorkbenchViewProps> = ({
  initialPresetId,
  initialUploadedFile,
}) => {
  const toast = useToast();

  // Active Preset Selection
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(() => {
    const idx = SIMULATOR_PRESETS.findIndex((p) => p.id === initialPresetId);
    return idx >= 0 ? idx : 0;
  });
  const selectedPreset = SIMULATOR_PRESETS[selectedPresetIndex];

  // Mobile Tabs: 'document' vs 'fields'
  const [mobileTab, setMobileTab] = useState<'document' | 'fields'>('document');

  // Zoom and Rotate State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotationDeg, setRotationDeg] = useState<number>(0);

  // Active Highlighted Bounding Box
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);

  // Target Standard Selection
  const [selectedStandard, setSelectedStandard] = useState<string>(() => {
    return PRESET_MATCHING_STANDARDS[selectedPreset.id] || STANDARDS_LIST[0];
  });

  // Keep target standard aligned when preset changes
  useEffect(() => {
    setSelectedStandard(PRESET_MATCHING_STANDARDS[selectedPreset.id] || STANDARDS_LIST[0]);
    // Reset fields on preset switch
    initializeFields(selectedPreset);
  }, [selectedPreset.id]);

  // Document Metadata State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState<boolean>(false);
  const [ocrSuccessMessage, setOcrSuccessMessage] = useState<string | null>(null);
  const [sha256Hash, setSha256Hash] = useState<string>('d9b7a18e209f48ac77198e3100ba38e1');
  const uploadTimestamp = '12-Feb-2026 10:45 AM UTC';

  // Modal States
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Editable Fields Registry with Confidence & Audit Trail
  const [fields, setFields] = useState<WorkbenchField[]>([]);

  function initializeFields(preset: SimulatorPreset) {
    const list: WorkbenchField[] = [
      // Identity
      {
        id: 'mill_name',
        group: 'identity',
        label: 'Manufacturer Mill',
        value: preset.mill,
        confidence: 99,
        isConfirmed: true,
        boxId: 'b1',
        clauseSource: 'EN 10204:2004 Clause 3.1.A',
      },
      {
        id: 'cert_number',
        group: 'identity',
        label: 'MTC Reference Number',
        value: preset.certNumber,
        confidence: 97,
        isConfirmed: true,
        boxId: 'b1',
        clauseSource: 'EN 10204:2004 Clause 3.1.B',
      },
      {
        id: 'issue_date',
        group: 'identity',
        label: 'Inspection Issue Date',
        value: preset.issueDate,
        confidence: 96,
        isConfirmed: true,
        boxId: 'b1',
        clauseSource: 'EN 10204:2004 Clause 3.1.C',
      },
      // Traceability
      {
        id: 'heat_number',
        group: 'traceability',
        label: 'Heat / Cast Number',
        value: preset.heatNumber,
        confidence: 99,
        isConfirmed: true,
        boxId: 'b1',
        clauseSource: 'EN 10204:2004 Clause 6 (Traceability)',
      },
      {
        id: 'melt_country',
        group: 'traceability',
        label: 'Country of Melt & Pour',
        value: preset.meltCountry,
        confidence: 98,
        isConfirmed: true,
        boxId: 'b1',
        clauseSource: 'EU Reg 2026/1963 Mandatory Origin',
      },
      {
        id: 'melt_route',
        group: 'traceability',
        label: 'Primary Steelmaking Process',
        value: preset.meltRoute,
        confidence: 94,
        isConfirmed: true,
        boxId: 'b1',
        clauseSource: 'Regulation (EU) 2023/956 Annex III',
      },
      // Chemistry
      ...preset.chemistry.map((el) => ({
        id: `chem_${el.symbol}`,
        group: 'chemistry' as const,
        label: `${el.name} (${el.symbol})`,
        value: el.measured.toString(),
        unit: el.unit,
        confidence: el.symbol === 'Mo' ? 82 : el.symbol === 'Cr' ? 84 : 96, // Flag Mo & Cr for verification review
        isConfirmed: el.symbol !== 'Mo' && el.symbol !== 'Cr',
        boxId: 'b2',
        clauseSource: 'EN 10025-2 Table 2 Spectrometry',
      })),
      // Mechanical
      ...preset.mechanics.map((m, idx) => ({
        id: `mech_${idx}`,
        group: 'mechanical' as const,
        label: m.property,
        value: m.measured,
        confidence: idx === 3 ? 79 : 95, // Flag impact test for review
        isConfirmed: idx !== 3,
        boxId: 'b3',
        clauseSource: 'EN 10025-2 Table 7 Mechanical',
      })),
    ];
    setFields(list);
  }

  // Initial load
  useEffect(() => {
    initializeFields(selectedPreset);
  }, []);

  // Compute unconfirmed fields count
  const unconfirmedFields = useMemo(() => {
    return fields.filter((f) => !f.isConfirmed || f.confidence < 85);
  }, [fields]);

  const canApprove = unconfirmedFields.length === 0;

  // Jump to next flagged field (One-thumb mobile workflow)
  const handleJumpToNextFlaggedField = () => {
    haptics.tap();
    if (unconfirmedFields.length === 0) {
      toast.success('All Confirmed', 'All extracted fields have been verified by the inspector.');
      return;
    }
    const nextField = unconfirmedFields[0];
    setMobileTab('fields');
    if (nextField.boxId) {
      setActiveHighlightId(nextField.boxId);
    }
    const el = document.getElementById(`field-${nextField.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-amber-500');
      setTimeout(() => el.classList.remove('ring-2', 'ring-amber-500'), 1500);
    }
  };

  // Field confirmation
  const handleConfirmField = (fieldId: string) => {
    haptics.tap();
    setFields((prev) =>
      prev.map((f) => {
        if (f.id === fieldId) {
          return { ...f, isConfirmed: true, confidence: 100 };
        }
        return f;
      })
    );
    toast.success('Field Confirmed', 'Verified by QA Inspector');
  };

  // Field Edit modal trigger
  const handleStartEdit = (field: WorkbenchField) => {
    setEditingFieldId(field.id);
    setEditValue(field.value);
  };

  const handleSaveEdit = () => {
    if (!editingFieldId) return;
    setFields((prev) =>
      prev.map((f) => {
        if (f.id === editingFieldId) {
          return {
            ...f,
            value: editValue,
            isConfirmed: true,
            confidence: 100,
            originalValue: f.originalValue || f.value,
            correctedBy: 'QA Inspector (R. K. Chatterjee)',
          };
        }
        return f;
      })
    );
    toast.info('Value Corrected', `Updated field value to ${editValue}`);
    setEditingFieldId(null);
  };

  // Chemistry Evaluation against active standard
  const activeChemistry = useMemo(() => {
    return evaluateChemistryAgainstStandard(selectedPreset.chemistry, selectedStandard);
  }, [selectedPreset, selectedStandard]);

  const failedElements = useMemo(() => {
    return activeChemistry.filter((el) => el.status !== 'PASS');
  }, [activeChemistry]);

  const isOffSpec = failedElements.length > 0;

  // Navigation between certificates (Swipe/Next)
  const handleNextCertificate = () => {
    haptics.tap();
    setSelectedPresetIndex((prev) => (prev + 1) % SIMULATOR_PRESETS.length);
  };

  const handlePrevCertificate = () => {
    haptics.tap();
    setSelectedPresetIndex((prev) => (prev - 1 + SIMULATOR_PRESETS.length) % SIMULATOR_PRESETS.length);
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Sample Data Demo Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            Sample Data
          </span>
          <span className="text-xs font-medium">
            MTC simulator loaded with vector OCR coordinate bounding boxes. PyMuPDF word bounds active.
          </span>
        </div>
        <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold hidden sm:inline">
          DEMO_MODE ACTIVE
        </span>
      </div>

      {/* Header Bar & Target Standard Selector */}
      <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-emerald-400 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text">
              EN 10204 3.1 Certificate Review Workbench
            </h2>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Human-in-the-loop verification with real PyMuPDF word bounding boxes and standard tolerance checking.
          </p>
        </div>

        {/* Certificate Switcher & Target Standard */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Certificate Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-2 border border-border">
            <button
              onClick={handlePrevCertificate}
              className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors"
              title="Previous Certificate"
              aria-label="Previous Certificate"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-text">
              {selectedPresetIndex + 1} / {SIMULATOR_PRESETS.length} ({selectedPreset.mill.split(' ')[0]})
            </span>
            <button
              onClick={handleNextCertificate}
              className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors"
              title="Next Certificate"
              aria-label="Next Certificate"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Standard Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono font-bold text-text-muted uppercase hidden sm:inline">
              Standard:
            </label>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {STANDARDS_LIST.map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher (< lg) */}
      <div className="lg:hidden flex items-center p-1 rounded-xl bg-surface-2 border border-border">
        <button
          onClick={() => setMobileTab('document')}
          className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            mobileTab === 'document'
              ? 'bg-surface text-emerald-400 shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Document View</span>
        </button>
        <button
          onClick={() => setMobileTab('fields')}
          className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            mobileTab === 'fields'
              ? 'bg-surface text-emerald-400 shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Extracted Fields ({fields.length})</span>
          {unconfirmedFields.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-obsidian-950 font-bold text-[10px] flex items-center justify-center">
              {unconfirmedFields.length}
            </span>
          )}
        </button>
      </div>

      {/* 2-COLUMN SPLIT WORKBENCH GRID (Desktop Split / Mobile Tabbed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN (lg:col-span-6): Interactive Document & Bounding Box Viewer */}
        {/* ========================================================================= */}
        <div className={`lg:col-span-6 space-y-4 ${mobileTab === 'document' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-surface rounded-2xl border border-border p-4 sm:p-5 shadow-sm space-y-4">
            
            {/* Document Controls Strip: Zoom, Rotate & File Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-mono text-text-muted bg-surface-2 px-2.5 py-1 rounded-lg border border-border">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]" title={sha256Hash}>
                    {sha256Hash.slice(0, 12)}…
                  </span>
                </span>
                <span className="text-[11px] font-mono text-text-muted hidden sm:inline">
                  {uploadTimestamp}
                </span>
              </div>

              {/* Viewer Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface text-text-muted hover:text-text border border-border"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-text-muted px-1.5">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface text-text-muted hover:text-text border border-border"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotationDeg((r) => (r + 90) % 360)}
                  className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface text-text-muted hover:text-text border border-border ml-1"
                  title="Rotate 90°"
                  aria-label="Rotate 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setRotationDeg(0);
                  }}
                  className="px-2 py-1 rounded-lg bg-surface-2 hover:bg-surface text-text-muted hover:text-text border border-border text-xs font-mono"
                  title="Reset View"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Document Render Container (Interactive Canvas / Mockup) */}
            <div 
              className="relative rounded-xl bg-[#FAF8F5] text-slate-900 p-5 shadow-inner border border-slate-300 min-h-[580px] overflow-hidden select-none transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotationDeg}deg)`,
                transformOrigin: 'top center',
              }}
              onDoubleClick={() => setZoomLevel((z) => (z > 1 ? 1 : 1.75))}
            >
              {/* Laser Scan Beam effect during processing */}
              <LaserScanBeam isScanning={isProcessingOcr} />

              {/* Watermark Tag */}
              <div className="absolute right-4 top-2 text-[10px] font-mono text-slate-400">
                PYMUPDF VECTOR PARSED · PAGE 1
              </div>

              {/* MTC Header */}
              <div className="border-b-2 border-slate-900 pb-2 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-sm uppercase text-slate-900 tracking-tight">
                      {selectedPreset.mill}
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Metallurgical Quality Assurance Laboratory · EN 10204:2004 Type 3.1
                    </p>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <div className="font-bold text-slate-900">
                      CERT NO: {selectedPreset.certNumber}
                    </div>
                    <div className="text-slate-500">Date: {selectedPreset.issueDate}</div>
                  </div>
                </div>
              </div>

              {/* Document Identity & Heat Section */}
              <div className="grid grid-cols-2 gap-3 p-2.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 block">HEAT / CAST NUMBER</span>
                  <span className="font-bold text-amber-900 text-sm">#{selectedPreset.heatNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">COUNTRY OF MELT &amp; POUR</span>
                  <span className="font-bold text-emerald-800">{selectedPreset.meltCountry} (ISO: IN)</span>
                </div>
              </div>

              {/* Simulated Spectrometry Chemistry Ladle Grid */}
              <div className="mb-4">
                <div className="text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Chemical Analysis (Ladle Spectrometry %)
                </div>
                <div className="grid grid-cols-5 gap-1 text-[11px] font-mono">
                  {selectedPreset.chemistry.map((el) => (
                    <div key={el.symbol} className="p-1.5 rounded bg-white border border-slate-300 text-center">
                      <span className="block text-[10px] font-bold text-slate-500">{el.symbol}</span>
                      <span className="font-bold text-slate-900">{el.measured}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mechanical Properties Block */}
              <div className="mb-4">
                <div className="text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Mechanical Test Results (Ambient 23°C)
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                  {selectedPreset.mechanics.map((m, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-white border border-slate-300 flex justify-between">
                      <span className="text-slate-600">{m.property}:</span>
                      <span className="font-bold text-slate-900">{m.measured}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal EN 10204 Clause 6 Seal Notice */}
              <div className="mt-8 pt-3 border-t-2 border-slate-900 flex justify-between items-end text-[10px] font-mono text-slate-600">
                <div>
                  <span>Works Inspector Stamp: </span>
                  <span className="font-bold text-slate-900">QA-04 / INDEPENDENT</span>
                </div>
                <div className="border border-slate-800 px-2 py-1 font-bold text-slate-900 uppercase">
                  EN 10204 3.1 CERTIFIED
                </div>
              </div>

              {/* Interactive PyMuPDF Vector Bounding Boxes Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {selectedPreset.boundingBoxes.map((box) => {
                  const isActive = activeHighlightId === box.id;
                  const strokeColor = box.type === 'amber' ? '#F59E0B' : box.type === 'emerald' ? '#10B981' : '#3B82F6';
                  return (
                    <rect
                      key={box.id}
                      x={`${box.coords.x}%`}
                      y={`${box.coords.y}%`}
                      width={`${box.coords.width}%`}
                      height={`${box.coords.height}%`}
                      fill={isActive ? `${strokeColor}22` : 'transparent'}
                      stroke={strokeColor}
                      strokeWidth={isActive ? '2.5' : '1.5'}
                      strokeDasharray={isActive ? 'none' : '4 2'}
                      className="transition-all duration-200 pointer-events-auto cursor-pointer"
                      onClick={() => {
                        haptics.tap();
                        setActiveHighlightId(box.id);
                        setMobileTab('fields');
                      }}
                    >
                      <title>{box.label}: {box.fieldValue}</title>
                    </rect>
                  );
                })}
              </svg>
            </div>

            {/* Document Thumbnails & Help Note */}
            <div className="flex items-center justify-between text-xs font-mono text-text-muted pt-1">
              <span>Page 1 of 1 · Double-tap to zoom toggle</span>
              <span className="text-emerald-400 font-semibold">100% OCR Accuracy</span>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (lg:col-span-6): Grouped Fields, Confidence & Tolerance Math */}
        {/* ========================================================================= */}
        <div className={`lg:col-span-6 space-y-5 ${mobileTab === 'fields' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Off-Spec Warning Banner if active standard fails */}
          {isOffSpec && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold font-mono text-xs text-rose-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>OFF-SPEC REJECTION: {failedElements.length} ELEMENT(S) VIOLATE {selectedStandard.split(' ')[0]}</span>
                </div>
                <button
                  onClick={() => setSelectedStandard(PRESET_MATCHING_STANDARDS[selectedPreset.id])}
                  className="text-xs font-mono underline hover:text-white"
                >
                  Reset Standard
                </button>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Measured mill ladle chemistry violates limits for <strong className="text-text">{selectedStandard}</strong>. EU customs will reject mismatched grades.
              </p>
            </div>
          )}

          {/* Group 1: Identity */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
              <span>1. Certificate &amp; Mill Identity</span>
              <span className="text-emerald-400 font-normal">3 Fields</span>
            </h3>

            <div className="divide-y divide-border">
              {fields.filter(f => f.group === 'identity').map((field) => (
                <div
                  key={field.id}
                  id={`field-${field.id}`}
                  className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
                >
                  <div>
                    <span className="text-text-muted block text-[11px]">{field.label}</span>
                    <span className="font-bold text-text text-sm">{field.value}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ConfidenceBadge confidence={field.confidence} />
                    {field.boxId && (
                      <button
                        onClick={() => {
                          haptics.tap();
                          setActiveHighlightId(field.boxId!);
                          setMobileTab('document');
                        }}
                        className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface text-text-muted hover:text-text border border-border"
                        title="Show on Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: Traceability */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
              <span>2. Traceability &amp; Melt Origin</span>
              <span className="text-emerald-400 font-normal">EU 2026/1963</span>
            </h3>

            <div className="divide-y divide-border">
              {fields.filter(f => f.group === 'traceability').map((field) => (
                <div
                  key={field.id}
                  id={`field-${field.id}`}
                  className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
                >
                  <div>
                    <span className="text-text-muted block text-[11px]">{field.label}</span>
                    {field.id === 'heat_number' ? (
                      <HeatNumberTag heatNumber={field.value} />
                    ) : (
                      <span className="font-bold text-text text-sm">{field.value}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <ConfidenceBadge confidence={field.confidence} />
                    {field.boxId && (
                      <button
                        onClick={() => {
                          haptics.tap();
                          setActiveHighlightId(field.boxId!);
                          setMobileTab('document');
                        }}
                        className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface text-text-muted hover:text-text border border-border"
                        title="Show on Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 3: Chemistry & Metallurgy */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
              <span>3. Spectrometric Chemistry (Ladle %)</span>
              <span className="text-text-muted font-normal">{selectedStandard.split(' ')[0]} Limits</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {fields.filter(f => f.group === 'chemistry').map((field) => {
                const elemSymbol = field.label.split('(')[1]?.replace(')', '') || '';
                const activeEl = activeChemistry.find(e => e.symbol === elemSymbol);
                const isPass = activeEl ? activeEl.status === 'PASS' : true;
                const isFlagged = !field.isConfirmed || field.confidence < 85;

                return (
                  <div
                    key={field.id}
                    id={`field-${field.id}`}
                    className={`p-3 rounded-xl border transition-all text-xs font-mono ${
                      isFlagged
                        ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30'
                        : !isPass
                        ? 'bg-rose-500/10 border-rose-500/40'
                        : 'bg-surface-2/60 border-border hover:bg-surface-2'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text">{field.label}</span>
                      <ConfidenceBadge confidence={field.confidence} />
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-base font-bold text-text">{field.value}</span>
                        <span className="text-text-muted text-xs ml-1">{field.unit}</span>
                      </div>

                      {field.originalValue && (
                        <span className="text-[10px] text-text-muted line-through">
                          {field.originalValue}
                        </span>
                      )}
                    </div>

                    {/* Standard limit spec note */}
                    {activeEl && (
                      <div className="mt-1 text-[11px] text-text-muted">
                        Limit: {activeEl.min > 0 ? `${activeEl.min} - ` : '≤ '}{activeEl.max}%
                      </div>
                    )}

                    {/* Actions: Confirm or Edit */}
                    <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleStartEdit(field)}
                        className="text-text-muted hover:text-text flex items-center gap-1 text-[11px]"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {isFlagged ? (
                        <button
                          onClick={() => handleConfirmField(field.id)}
                          className="px-2 py-0.5 rounded bg-amber-500 text-obsidian-950 font-bold text-[10px] flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Confirm</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group 4: Mechanical Properties */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
              <span>4. Mechanical &amp; Tensile Properties</span>
              <span className="text-emerald-400 font-normal">Passed</span>
            </h3>

            <div className="divide-y divide-border">
              {fields.filter(f => f.group === 'mechanical').map((field) => {
                const isFlagged = !field.isConfirmed || field.confidence < 85;
                return (
                  <div
                    key={field.id}
                    id={`field-${field.id}`}
                    className={`py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
                      isFlagged ? 'bg-amber-500/10 p-2 rounded-xl my-1' : ''
                    }`}
                  >
                    <div>
                      <span className="text-text-muted block text-[11px]">{field.label}</span>
                      <span className="font-bold text-text text-sm">{field.value}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ConfidenceBadge confidence={field.confidence} />
                      {isFlagged ? (
                        <button
                          onClick={() => handleConfirmField(field.id)}
                          className="px-2.5 py-1 rounded bg-amber-500 text-obsidian-950 font-bold text-xs flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Confirm</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(field)}
                          className="p-1 rounded text-text-muted hover:text-text"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* FLOATING ACTION STRIP FOR MOBILE: Jump to Next Flagged Field */}
      {/* ========================================================================= */}
      {unconfirmedFields.length > 0 && (
        <div className="lg:hidden fixed bottom-20 right-4 z-40 animate-bounce">
          <button
            onClick={handleJumpToNextFlaggedField}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 text-obsidian-950 font-bold text-xs font-mono shadow-2xl active:scale-95 border border-amber-400"
          >
            <Flag className="w-4 h-4 fill-current" />
            <span>Next Flagged Field ({unconfirmedFields.length})</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STICKY BOTTOM ACTION BAR (Both Desktop and Mobile) */}
      {/* ========================================================================= */}
      <div className="sticky bottom-0 z-30 p-4 bg-surface/95 border-t border-border backdrop-blur-xl rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono">
            <span className="text-text-muted">Review Status: </span>
            {canApprove ? (
              <span className="text-emerald-400 font-bold">100% Verified · Ready to Sign</span>
            ) : (
              <span className="text-amber-400 font-bold">{unconfirmedFields.length} field(s) require inspector review</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsRejectModalOpen(true)}
            className="flex-1 sm:flex-initial"
          >
            Reject with Reason
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              toast.info('Upload Requested', 'Request sent to mill supplier for fresh high-resolution scan.');
            }}
            className="flex-1 sm:flex-initial"
          >
            Request New Upload
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={!canApprove}
            onClick={() => {
              toast.success(
                'Certificate Approved',
                `Heat #${selectedPreset.heatNumber} approved for export customs sign-off queue.`
              );
            }}
            className="flex-1 sm:flex-initial min-w-[140px]"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            <span>Approve MTC</span>
          </Button>
        </div>
      </div>

      {/* Quick Edit Modal */}
      {editingFieldId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-left">
            <h4 className="text-sm font-bold text-text">Edit Extracted Value</h4>
            <p className="text-xs text-text-muted">
              Audit log will record your name and the original extracted value.
            </p>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text font-mono text-sm focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setEditingFieldId(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                Save &amp; Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Reject Certificate with Formal Audit Reason</span>
            </div>
            <p className="text-xs text-text-muted">
              Select or type the non-compliance reason. This notification will be delivered to the raw material supplier.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Molybdenum below minimum spec of 0.15% per ASTM A193 B7"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-rose-500 resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  toast.error('Certificate Rejected', rejectReason || 'Rejected for metallurgical non-compliance.');
                  setIsRejectModalOpen(false);
                }}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

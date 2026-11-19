import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Mail,
  Copy,
  Check,
  Search,
  Filter,
  Scale,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  FileText,
  HelpCircle,
  X,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
  Calculator,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '../../ui/ToastContext';
import { haptics } from '../../../lib/motion';
import { SupplierDataRequestsTracker } from './SupplierDataRequestsTracker';

export interface SupplierItem {
  id: string;
  name: string;
  plant_location: string;
  supplier_type: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  typical_grades: string[];
  rating_grade: 'A' | 'B' | 'C' | 'D';
  total_certs_processed: number;
  missing_melt_pour_pct: number;
  low_confidence_ocr_pct: number;
  out_of_spec_pct: number;
  avg_turnaround_days: number;
  repeat_defects: string[];
  trend_monthly_defect_pct: number[];
  layout_fingerprint: string;
}

export interface LearnedTemplate {
  mill_id: string;
  mill_name: string;
  fingerprint: string;
  layout_type: string;
  header_labels: string[];
  chemistry_table_bbox: { top: number; left: number; width: number; height: number };
  melt_origin_marker: string;
  confidence_score: number;
  review_time_reduction_pct: number;
  last_seen: string;
}

const MOCK_SUPPLIERS: SupplierItem[] = [
  {
    id: 'sup_tata_steel',
    name: 'Tata Steel Limited',
    plant_location: 'Jamshedpur & Kalinganagar, India',
    supplier_type: 'PRIMARY_MILL',
    contact_person: 'V. K. Mehta (QA & Dispatch)',
    contact_email: 'tc.dispatch@tatasteel.com',
    contact_phone: '+91 657 664 4000',
    typical_grades: ['ASTM A106 Gr. B', 'ASTM A105', 'API 5L X52', 'IS 2062 E250'],
    rating_grade: 'A',
    total_certs_processed: 142,
    missing_melt_pour_pct: 2.1,
    low_confidence_ocr_pct: 3.5,
    out_of_spec_pct: 0.7,
    avg_turnaround_days: 1.8,
    repeat_defects: ['Occasional faint tensile elongation stamp'],
    trend_monthly_defect_pct: [6.2, 4.8, 3.5, 2.8, 2.1],
    layout_fingerprint: 'tata_tsj_rev4_bof_cc'
  },
  {
    id: 'sup_sail_bokaro',
    name: 'Steel Authority of India Limited (SAIL)',
    plant_location: 'Bokaro Steel Plant, Jharkhand, India',
    supplier_type: 'PRIMARY_MILL',
    contact_person: 'A. K. Sharma (Technical Services)',
    contact_email: 'mtc.bokaro@sail.in',
    contact_phone: '+91 6542 240 331',
    typical_grades: ['IS 2062 E250BR', 'ASTM A36', 'SAILMA 350HI'],
    rating_grade: 'C',
    total_certs_processed: 98,
    missing_melt_pour_pct: 28.6,
    low_confidence_ocr_pct: 24.5,
    out_of_spec_pct: 4.1,
    avg_turnaround_days: 4.2,
    repeat_defects: [
      'Missing ISO 3166 Melt-and-Pour origin line',
      'Faded dot-matrix carbon equivalent print'
    ],
    trend_monthly_defect_pct: [34.0, 31.5, 30.0, 29.2, 28.6],
    layout_fingerprint: 'sail_bsp_dotmatrix_v2'
  },
  {
    id: 'sup_jsw_steel',
    name: 'JSW Steel Limited',
    plant_location: 'Vijayanagar Works, Karnataka, India',
    supplier_type: 'PRIMARY_MILL',
    contact_person: 'P. R. Hegde (Commercial Operations)',
    contact_email: 'exports.quality@jsw.in',
    contact_phone: '+91 8395 250 120',
    typical_grades: ['ASTM A105', 'ASTM A516 Gr. 70', 'EN 10222-2 16Mo3'],
    rating_grade: 'A',
    total_certs_processed: 116,
    missing_melt_pour_pct: 3.4,
    low_confidence_ocr_pct: 4.2,
    out_of_spec_pct: 1.2,
    avg_turnaround_days: 2.1,
    repeat_defects: ['Non-standard date formatting (MM/DD/YY vs DD-MM-YYYY)'],
    trend_monthly_defect_pct: [7.0, 5.5, 4.2, 3.8, 3.4],
    layout_fingerprint: 'jsw_vy_digital_signed_v3'
  },
  {
    id: 'sup_jspl_angul',
    name: 'Jindal Steel & Power (JSPL)',
    plant_location: 'Angul & Raigarh, India',
    supplier_type: 'PRIMARY_MILL',
    contact_person: 'S. Patnaik (Customer Quality)',
    contact_email: 'quality.angul@jindalsteel.com',
    contact_phone: '+91 6761 254 000',
    typical_grades: ['ASTM A572 Gr. 50', 'IS 2062 E350', 'EN 10025-2 S355J2'],
    rating_grade: 'B',
    total_certs_processed: 74,
    missing_melt_pour_pct: 10.8,
    low_confidence_ocr_pct: 8.1,
    out_of_spec_pct: 2.7,
    avg_turnaround_days: 2.9,
    repeat_defects: ['Missing silicon content on structural billets'],
    trend_monthly_defect_pct: [15.0, 13.2, 12.0, 11.4, 10.8],
    layout_fingerprint: 'jspl_angul_eaf_v1'
  },
  {
    id: 'sup_apex_traders',
    name: 'Apex Steel Intermediaries & Stockholders',
    plant_location: 'Strand Road, Kolkata, West Bengal, India',
    supplier_type: 'TRADER_STOCKIST',
    contact_person: 'M. K. Agarwal (Managing Partner)',
    contact_email: 'sales@apexsteelkolkata.com',
    contact_phone: '+91 33 2230 8911',
    typical_grades: ['Commercial Mild Steel', 'ASTM A106 Seamless Secondary'],
    rating_grade: 'D',
    total_certs_processed: 42,
    missing_melt_pour_pct: 52.4,
    low_confidence_ocr_pct: 45.2,
    out_of_spec_pct: 9.5,
    avg_turnaround_days: 6.5,
    repeat_defects: [
      'Re-typed certificates without Clause 6 untouched original Annex',
      'Mismatched delivery note weights vs physical scale receipt'
    ],
    trend_monthly_defect_pct: [58.0, 56.5, 54.0, 53.2, 52.4],
    layout_fingerprint: 'apex_trader_scan_unstructured'
  }
];

const MOCK_TEMPLATES: LearnedTemplate[] = [
  {
    mill_id: 'sup_tata_steel',
    mill_name: 'Tata Steel Limited',
    fingerprint: 'tata_tsj_rev4_bof_cc',
    layout_type: 'PRIMARY_MILL_VECTOR_PDF',
    header_labels: ['TATA STEEL', 'TEST CERTIFICATE', 'EN 10204 3.1', 'JAMSHEDPUR'],
    chemistry_table_bbox: { top: 0.38, left: 0.05, width: 0.9, height: 0.18 },
    melt_origin_marker: 'STEEL MELTED AND MANUFACTURED IN INDIA (BOF-LF-CC)',
    confidence_score: 98.5,
    review_time_reduction_pct: 75,
    last_seen: '2026-11-18T10:30:00Z'
  },
  {
    mill_id: 'sup_sail_bokaro',
    mill_name: 'Steel Authority of India Limited (SAIL)',
    fingerprint: 'sail_bsp_dotmatrix_v2',
    layout_type: 'LEGACY_DOTMATRIX_SCAN',
    header_labels: ['SAIL', 'BOKARO STEEL PLANT', 'INSPECTION CERTIFICATE', 'IS 2062'],
    chemistry_table_bbox: { top: 0.42, left: 0.08, width: 0.84, height: 0.22 },
    melt_origin_marker: 'BHARAT / INDIA MELT LOCATION',
    confidence_score: 82.0,
    review_time_reduction_pct: 40,
    last_seen: '2026-11-17T14:15:00Z'
  },
  {
    mill_id: 'sup_jsw_steel',
    mill_name: 'JSW Steel Limited',
    fingerprint: 'jsw_vy_digital_signed_v3',
    layout_type: 'DIGITAL_VECTOR_SECURE_QR',
    header_labels: ['JSW STEEL', 'VIJAYANAGAR', 'EN 10204:2004 TYPE 3.1', 'MILL TEST CERTIFICATE'],
    chemistry_table_bbox: { top: 0.35, left: 0.06, width: 0.88, height: 0.2 },
    melt_origin_marker: 'CRUDE STEEL MELTED AND ROLLED AT TORANAGALLU, BELLARY, INDIA',
    confidence_score: 99.1,
    review_time_reduction_pct: 85,
    last_seen: '2026-11-19T09:00:00Z'
  },
  {
    mill_id: 'sup_jspl_angul',
    mill_name: 'Jindal Steel & Power (JSPL)',
    fingerprint: 'jspl_angul_eaf_v1',
    layout_type: 'EAF_HYBRID_DIGITAL',
    header_labels: ['JINDAL STEEL & POWER', 'ANGUL PLANT', '3.1 TEST CERTIFICATE'],
    chemistry_table_bbox: { top: 0.4, left: 0.07, width: 0.86, height: 0.19 },
    melt_origin_marker: 'COUNTRY OF CRUDE STEEL MELT: INDIA',
    confidence_score: 94.0,
    review_time_reduction_pct: 65,
    last_seen: '2026-11-16T16:45:00Z'
  }
];

// SVG Sparkline Component
const Sparkline: React.FC<{ data: number[]; color?: string }> = ({ data, color }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const padding = 3;

  const points = data
    .map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const isImproving = data[data.length - 1] < data[0];
  const strokeColor = color || (isImproving ? '#34d399' : '#f87171');

  return (
    <div className="inline-flex items-center gap-1.5" title={`5-Month Defect Trend: ${data.join('% → ')}%`}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Final data point dot */}
        {data.length > 0 && (
          <circle
            cx={width - padding}
            cy={height - padding - ((data[data.length - 1] - min) / range) * (height - 2 * padding)}
            r="3"
            fill={strokeColor}
          />
        )}
      </svg>
      {isImproving ? (
        <TrendingDown className="w-3 h-3 text-emerald-400 shrink-0" />
      ) : (
        <TrendingUp className="w-3 h-3 text-rose-400 shrink-0" />
      )}
    </div>
  );
};

export const SupplierIntelligenceView: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'scorecards' | 'templates' | 'po-matcher' | 'data-requests'>('scorecards');
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(MOCK_SUPPLIERS);
  const [templates, setTemplates] = useState<LearnedTemplate[]>(MOCK_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'ALL' | 'A' | 'B' | 'C' | 'D'>('ALL');

  // "Ask Supplier to Fix" Modal State
  const [selectedSupplierForFix, setSelectedSupplierForFix] = useState<SupplierItem | null>(null);
  const [fixModalOpen, setFixModalOpen] = useState(false);
  const [fixDefectType, setFixDefectType] = useState('MISSING_MELT_COUNTRY');
  const [fixCertNumber, setFixCertNumber] = useState('MTC-IN-2026-9041');
  const [fixHeatNumber, setFixHeatNumber] = useState('TSJ-26-9021');
  const [copiedType, setCopiedType] = useState<'whatsapp' | 'email' | null>(null);

  // PO Matcher State
  const [poNumber, setPoNumber] = useState('PO-2026-IND-8840');
  const [poSupplierId, setPoSupplierId] = useState('sup_tata_steel');
  const [poHeatNumber, setPoHeatNumber] = useState('TSJ-26-9021');
  const [poGrade, setPoGrade] = useState('ASTM A106 Gr. B');
  const [expectedWeightKg, setExpectedWeightKg] = useState<number>(25000);
  const [receivedWeightKg, setReceivedWeightKg] = useState<number>(25220);
  const [tolerancePct, setTolerancePct] = useState<number>(2.0);
  const [poMatchResult, setPoMatchResult] = useState<{
    status: 'MATCHED' | 'DISCREPANCY_FLAGGED';
    discrepancy_kg: number;
    discrepancy_pct: number;
    message: string;
  } | null>(null);

  // Load from backend if available
  useEffect(() => {
    let isMounted = true;
    fetch('/api/suppliers')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.suppliers && isMounted) {
          setSuppliers(data.suppliers);
        }
      })
      .catch(() => {});

    fetch('/api/suppliers/templates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.templates && isMounted) {
          setTemplates(data.templates);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.plant_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.typical_grades.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesGrade = gradeFilter === 'ALL' || s.rating_grade === gradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [suppliers, searchQuery, gradeFilter]);

  const handleOpenFixModal = (sup: SupplierItem) => {
    haptics.tap();
    setSelectedSupplierForFix(sup);
    setFixCertNumber(`MTC-${sup.name.split(' ')[0].toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setFixHeatNumber(`${sup.name.slice(0, 3).toUpperCase()}-26-${Math.floor(1000 + Math.random() * 9000)}`);
    setFixModalOpen(true);
  };

  const defectExplanation = useMemo(() => {
    switch (fixDefectType) {
      case 'MISSING_MELT_COUNTRY':
        return 'Missing ISO 3166 Melt-and-Pour Country of Origin attestation. Per EU Regulation 2026/1963 and UK CBAM rules, customs clearance cannot proceed without verified crude steel melt location.';
      case 'BLURRY_DOT_MATRIX_OCR':
        return 'Faint or clipped dot-matrix printed chemistry table. Carbon (C) and Manganese (Mn) ladle analysis values are illegible for automated customs verification.';
      case 'OFF_SPEC_CHEMISTRY':
        return 'Silicon or Phosphorous levels appear outside ASTM ordered standard thresholds.';
      case 'PO_QTY_MISMATCH':
        return 'Net delivered coil tonnage on invoice deviates from purchase order weight limits by more than allowable rolling tolerance.';
      default:
        return 'Documentation exception requires immediate technical correction.';
    }
  }, [fixDefectType]);

  const generatedWhatsAppMsg = useMemo(() => {
    if (!selectedSupplierForFix) return '';
    return (
      `🚨 *URGENT: Mill Test Certificate Correction Request*\n\n` +
      `Dear ${selectedSupplierForFix.contact_person} (${selectedSupplierForFix.name}),\n\n` +
      `Our customs compliance inspection gate flagged an issue with the certificate for export shipment:\n` +
      `• *MTC Number:* ${fixCertNumber}\n` +
      `• *Heat Number:* ${fixHeatNumber}\n` +
      `• *Exception:* ${defectExplanation}\n\n` +
      `EU customs import clearance is currently on hold. Please upload an amended/digitally re-certified 3.1 MTC immediately using our secure portal:\n` +
      `👉 https://heatledger.ai/upload?cert=${fixCertNumber}&heat=${fixHeatNumber}\n\n` +
      `Thank you,\n` +
      `Quality Assurance & Customs Compliance,\n` +
      `*Howrah Precision Forgings Pvt. Ltd.*`
    );
  }, [selectedSupplierForFix, fixCertNumber, fixHeatNumber, defectExplanation]);

  const generatedEmailBody = useMemo(() => {
    if (!selectedSupplierForFix) return '';
    return (
      `Dear ${selectedSupplierForFix.contact_person},\n\n` +
      `We are writing to request an urgent amendment to Mill Test Certificate ${fixCertNumber} (Heat #${fixHeatNumber}) ` +
      `supplied to Howrah Precision Forgings Pvt. Ltd.\n\n` +
      `During pre-shipment CBAM definitive regime verification under European Regulation (EU) 2026/1963, ` +
      `our automated inspection gate identified the following defect:\n\n` +
      `DEFECT DETAILS:\n` +
      `--------------------------------------------------\n` +
      `${defectExplanation}\n` +
      `--------------------------------------------------\n\n` +
      `To prevent detention and demurrage at Rotterdam/Hamburg port of entry, please issue an amended EN 10204 3.1 ` +
      `certificate containing the authenticated Melt-and-Pour declaration.\n\n` +
      `You may submit the corrected document directly via our secure vendor intake portal:\n` +
      `https://heatledger.ai/upload?cert=${fixCertNumber}&heat=${fixHeatNumber}\n\n` +
      `Sincerely,\n` +
      `Head of Metallurgy & Quality Assurance\n` +
      `Howrah Precision Forgings Pvt. Ltd.`
    );
  }, [selectedSupplierForFix, fixCertNumber, fixHeatNumber, defectExplanation]);

  const handleCopyText = (text: string, type: 'whatsapp' | 'email') => {
    haptics.tap();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast.success('Copied to Clipboard', `Correction ${type === 'whatsapp' ? 'WhatsApp message' : 'formal email'} copied.`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleMatchPo = () => {
    haptics.tap();
    const discrepancy = +(receivedWeightKg - expectedWeightKg).toFixed(2);
    const diffPct = expectedWeightKg > 0 ? +(Math.abs(discrepancy) / expectedWeightKg * 100).toFixed(2) : 0;
    const isDiscrepancy = diffPct > tolerancePct;

    setPoMatchResult({
      status: isDiscrepancy ? 'DISCREPANCY_FLAGGED' : 'MATCHED',
      discrepancy_kg: discrepancy,
      discrepancy_pct: diffPct,
      message: isDiscrepancy
        ? `Weight discrepancy of ${Math.abs(discrepancy).toLocaleString()} kg (${diffPct}%) exceeds ±${tolerancePct}% allowable rolling margin.`
        : `Weight reconciled within allowable ±${tolerancePct}% margin (+${discrepancy} kg, ${diffPct}%).`
    });

    if (isDiscrepancy) {
      toast.warning('PO Weight Discrepancy Flagged', `Difference exceeds ±${tolerancePct}% allowable rolling tolerance.`);
    } else {
      toast.success('PO Matched Successfully', 'Received weight matches purchase order within tolerance.');
    }
  };

  const getRatingBadge = (rating: SupplierItem['rating_grade']) => {
    switch (rating) {
      case 'A':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            GRADE A · VERIFIED
          </span>
        );
      case 'B':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
            GRADE B · STANDARD
          </span>
        );
      case 'C':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            GRADE C · DEFECT PRONE
          </span>
        );
      case 'D':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            GRADE D · HIGH RISK
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Header Bar */}
      <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text">
              Supplier &amp; Mill Intelligence
            </h2>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PROMPT P2
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Track certificate defect rates by mill, learn template layout fingerprints, and send one-tap correction notices.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-2 border border-border self-start md:self-center">
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('scorecards');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'scorecards'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Scorecards
          </button>
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('templates');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Learned Templates
          </button>
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('po-matcher');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'po-matcher'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            PO Matcher
          </button>
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('data-requests');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'data-requests'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            CBAM Precursor Tracker
          </button>
        </div>
      </div>

      {/* VIEW 1: SUPPLIER SCORECARDS */}
      {activeTab === 'scorecards' && (
        <div className="space-y-4">
          {/* Controls Strip: Search + Grade Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search mills, locations, grades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-text placeholder-text-muted focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-text-muted mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {(['ALL', 'A', 'B', 'C', 'D'] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setGradeFilter(grade)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    gradeFilter === grade
                      ? 'bg-slate-700 text-white font-bold border border-slate-600'
                      : 'bg-surface-2 text-text-muted hover:text-text border border-border'
                  }`}
                >
                  {grade === 'ALL' ? 'All' : `Grade ${grade}`}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Card View (< md) */}
          <div className="md:hidden space-y-3">
            {filteredSuppliers.map((sup) => (
              <div key={sup.id} className="p-4 rounded-2xl bg-surface border border-border shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-text">{sup.name}</h3>
                    <p className="text-xs text-text-muted font-mono">{sup.plant_location}</p>
                  </div>
                  {getRatingBadge(sup.rating_grade)}
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-surface-2 border border-border text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-text-muted block">Missing Origin</span>
                    <span
                      className={`font-bold ${
                        sup.missing_melt_pour_pct > 10 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {sup.missing_melt_pour_pct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Low OCR</span>
                    <span
                      className={`font-bold ${
                        sup.low_confidence_ocr_pct > 15 ? 'text-amber-400' : 'text-text'
                      }`}
                    >
                      {sup.low_confidence_ocr_pct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Turnaround</span>
                    <span className="font-bold text-text">{sup.avg_turnaround_days}d</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-text-muted text-[11px]">Monthly Defect Trend:</span>
                  <Sparkline data={sup.trend_monthly_defect_pct} />
                </div>

                <button
                  onClick={() => handleOpenFixModal(sup)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-text font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask Supplier to Fix MTC</span>
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-text-muted font-mono uppercase text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Supplier &amp; Mill</th>
                  <th className="py-3.5 px-3 font-bold">Rating</th>
                  <th className="py-3.5 px-3 font-bold">Processed</th>
                  <th className="py-3.5 px-3 font-bold">Missing Melt/Pour</th>
                  <th className="py-3.5 px-3 font-bold">Low OCR (&lt;85%)</th>
                  <th className="py-3.5 px-3 font-bold">Avg Lead Time</th>
                  <th className="py-3.5 px-4 font-bold">5-Mo Trend</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSuppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-text text-sm">{sup.name}</div>
                      <div className="text-[11px] text-text-muted font-mono">{sup.plant_location}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Template: <span className="text-slate-400">{sup.layout_fingerprint}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">{getRatingBadge(sup.rating_grade)}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-text">{sup.total_certs_processed} certs</td>
                    <td className="py-3.5 px-3 font-mono">
                      <span
                        className={`font-bold ${
                          sup.missing_melt_pour_pct > 10 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {sup.missing_melt_pour_pct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <span
                        className={`font-bold ${
                          sup.low_confidence_ocr_pct > 15 ? 'text-amber-400' : 'text-text'
                        }`}
                      >
                        {sup.low_confidence_ocr_pct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-text">{sup.avg_turnaround_days} days</td>
                    <td className="py-3.5 px-4">
                      <Sparkline data={sup.trend_monthly_defect_pct} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenFixModal(sup)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-text font-mono text-xs font-bold border border-slate-700 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-amber-400" />
                        <span>Ask to Fix</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: LEARNED MILL LAYOUT FINGERPRINTS */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-text">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Deterministic Layout Fingerprints &amp; OCR Field Maps</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              When a certificate matches a learned mill layout fingerprint, HeatLedger automatically routes OCR parsing
              to dedicated bounding-box models. Review time drops by up to 85% on repeat mills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.fingerprint}
                className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-3.5 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-text">{tpl.mill_name}</h3>
                    <div className="inline-block mt-1 px-2 py-0.5 rounded bg-surface-2 border border-border text-[10px] font-mono text-cyan-400 font-bold">
                      {tpl.fingerprint}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {tpl.confidence_score}% Confidence
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-surface-2 border border-border space-y-1">
                    <span className="text-[10px] text-text-muted block font-semibold uppercase">
                      Header Match Labels:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tpl.header_labels.map((lbl, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-2 border border-border space-y-1">
                    <span className="text-[10px] text-text-muted block font-semibold uppercase">
                      Melt-and-Pour Origin Marker:
                    </span>
                    <div className="text-[11px] text-emerald-300 font-bold truncate">
                      {tpl.melt_origin_marker}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-text-muted text-[11px]">Review Time Reduction:</span>
                    <span className="text-xs font-bold text-emerald-400">
                      -{tpl.review_time_reduction_pct}% Faster
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: PO WEIGHT RECONCILER */}
      {activeTab === 'po-matcher' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Scale className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-text">Purchase Order Weight Reconciler</h3>
                <p className="text-xs text-text-muted">
                  Reconciles ordered tonnage vs physical delivery scale receipt within rolling tolerance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-text-muted font-mono block mb-1">Purchase Order (PO) Number</label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-text-muted font-mono block mb-1">Supplier Mill</label>
                <select
                  value={poSupplierId}
                  onChange={(e) => setPoSupplierId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-emerald-500"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-text-muted font-mono block mb-1">Heat / Cast Number</label>
                <input
                  type="text"
                  value={poHeatNumber}
                  onChange={(e) => setPoHeatNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-text-muted font-mono block mb-1">Steel Grade</label>
                <input
                  type="text"
                  value={poGrade}
                  onChange={(e) => setPoGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-text-muted font-mono block mb-1">Expected PO Weight (kg)</label>
                <input
                  type="number"
                  value={expectedWeightKg}
                  onChange={(e) => setExpectedWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-text-muted font-mono block mb-1">Received MTC / Scale Weight (kg)</label>
                <input
                  type="number"
                  value={receivedWeightKg}
                  onChange={(e) => setReceivedWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-mono text-text-muted">
                Allowable Rolling Margin: <span className="text-text font-bold">±{tolerancePct}%</span>
              </div>
              <button
                onClick={handleMatchPo}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Reconcile Weights</span>
              </button>
            </div>

            {/* PO Reconcile Output Result Card */}
            {poMatchResult && (
              <div
                className={`p-4 rounded-xl border mt-3 space-y-2 ${
                  poMatchResult.status === 'MATCHED'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs flex items-center gap-1.5">
                    {poMatchResult.status === 'MATCHED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    {poMatchResult.status === 'MATCHED' ? 'TOLERANCE VERIFIED' : 'DISCREPANCY FLAGGED'}
                  </span>
                  <span className="text-xs font-mono font-bold">
                    Δ {poMatchResult.discrepancy_kg > 0 ? `+${poMatchResult.discrepancy_kg}` : poMatchResult.discrepancy_kg} kg (
                    {poMatchResult.discrepancy_pct}%)
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{poMatchResult.message}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: CBAM PRECURSOR DATA REQUESTS TRACKER (Prompt P5) */}
      {activeTab === 'data-requests' && <SupplierDataRequestsTracker />}

      {/* 'Ask Supplier to Fix' Modal (Prompt P2) */}
      {fixModalOpen && selectedSupplierForFix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-text">
                  Ask Supplier to Fix: {selectedSupplierForFix.name}
                </h3>
              </div>
              <button
                onClick={() => setFixModalOpen(false)}
                className="text-text-muted hover:text-text p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-text-muted font-mono block mb-1">Defect Category to Correct</label>
                <select
                  value={fixDefectType}
                  onChange={(e) => setFixDefectType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="MISSING_MELT_COUNTRY">Missing ISO 3166 Melt-and-Pour Country of Origin</option>
                  <option value="BLURRY_DOT_MATRIX_OCR">Faint / Illegible Dot-Matrix Ladle Analysis</option>
                  <option value="OFF_SPEC_CHEMISTRY">Out-of-Spec Chemistry (Silicon/Phosphorus)</option>
                  <option value="PO_QTY_MISMATCH">Delivered Weight Exceeds PO Tolerance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted font-mono block mb-1">MTC Reference</label>
                  <input
                    type="text"
                    value={fixCertNumber}
                    onChange={(e) => setFixCertNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-text-muted font-mono block mb-1">Heat Number</label>
                  <input
                    type="text"
                    value={fixHeatNumber}
                    onChange={(e) => setFixHeatNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* WhatsApp Generated Notice */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp Direct Notice:
                  </span>
                  <button
                    onClick={() => handleCopyText(generatedWhatsAppMsg, 'whatsapp')}
                    className="text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    {copiedType === 'whatsapp' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedType === 'whatsapp' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={4}
                  value={generatedWhatsAppMsg}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-750 font-mono text-[11px] text-slate-300 leading-relaxed focus:outline-none"
                />
              </div>

              {/* Email Generated Template */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sky-400 font-mono flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Formal Email Template:
                  </span>
                  <button
                    onClick={() => handleCopyText(generatedEmailBody, 'email')}
                    className="text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    {copiedType === 'email' ? (
                      <Check className="w-3 h-3 text-sky-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedType === 'email' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={4}
                  value={generatedEmailBody}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-750 font-mono text-[11px] text-slate-300 leading-relaxed focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setFixModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface text-text font-mono text-xs font-bold transition-colors"
              >
                Close
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(generatedWhatsAppMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open in WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

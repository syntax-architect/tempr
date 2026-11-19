import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Send,
  FileSpreadsheet,
  Building2,
  Calendar,
  Layers,
  Flame,
  Zap,
  RefreshCw,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import {
  ApiService,
  SupplierRequestItem,
  CreateSupplierRequestInput,
  VersionedPrecursorItem,
} from '../../../services/api';

interface SupplierDataRequestsTrackerProps {
  onRefreshParent?: () => void;
}

export const SupplierDataRequestsTracker: React.FC<SupplierDataRequestsTrackerProps> = ({
  onRefreshParent,
}) => {
  const [requests, setRequests] = useState<SupplierRequestItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({
    REQUESTED: 0,
    REMINDED: 0,
    RECEIVED: 0,
    IN_REVIEW: 0,
    ACCEPTED: 0,
    OVERDUE: 0,
    TOTAL: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createdRequestResult, setCreatedRequestResult] = useState<any | null>(null);

  const [reviewModalRequest, setReviewModalRequest] = useState<SupplierRequestItem | null>(null);
  const [reviewAction, setReviewAction] = useState<'Accepted' | 'Returned'>('Accepted');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [linkedHeatsText, setLinkedHeatsText] = useState<string>('TSJ-26-9021, TSJ-26-9022');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const [reminderModalData, setReminderModalData] = useState<{
    requestId: string;
    supplierName: string;
    productName: string;
    deadline: string;
    token: string;
    whatsappMsg?: string;
  } | null>(null);

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // New Request Form State
  const [supplierId, setSupplierId] = useState<string>('sup_tata_01');
  const [supplierName, setSupplierName] = useState<string>('Tata Steel Limited (Jamshedpur)');
  const [productName, setProductName] = useState<string>('Continuously Cast Billets (150x150 mm)');
  const [cnCode, setCnCode] = useState<string>('7207 11 00');
  const [reportingPeriod, setReportingPeriod] = useState<string>('2026-Q1');
  const [dueDate, setDueDate] = useState<string>('2026-12-15');
  const [supplierEmail, setSupplierEmail] = useState<string>('cbam.desk@tatasteel.com');
  const [supplierPhone, setSupplierPhone] = useState<string>('+919830112233');
  const [customNote, setCustomNote] = useState<string>('Required for EU CBAM export batch EXP-2026-109');
  const [isSubmittingCreate, setIsSubmittingCreate] = useState<boolean>(false);

  const supplierPresets = [
    {
      id: 'sup_tata_01',
      name: 'Tata Steel Limited (Jamshedpur)',
      email: 'cbam.desk@tatasteel.com',
      phone: '+919830112233',
      defaultProduct: 'Continuously Cast Billets (150x150 mm)',
      defaultCn: '7207 11 00',
    },
    {
      id: 'sup_sail_02',
      name: 'Steel Authority of India Limited (Durgapur)',
      email: 'cbam.durgapur@sail.in',
      phone: '+919831998877',
      defaultProduct: 'Hot Rolled Steel Rounds (Dia 80mm)',
      defaultCn: '7214 99 10',
    },
    {
      id: 'sup_jsw_03',
      name: 'JSW Steel Limited (Vijayanagar)',
      email: 'cbam@jsw.in',
      phone: '+919845112233',
      defaultProduct: 'Carbon Steel Blooms & Billets',
      defaultCn: '7207 11 00',
    },
    {
      id: 'sup_jspl_04',
      name: 'Jindal Steel & Power Limited (Angul)',
      email: 'quality.angul@jindalsteel.com',
      phone: '+919861001122',
      defaultProduct: 'Alloy Round Billets (ASTM A105)',
      defaultCn: '7228 30 20',
    },
  ];

  useEffect(() => {
    loadRequests();
  }, [activeFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await ApiService.listSupplierRequests(activeFilter);
      if (res) {
        setRequests(res.requests || []);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err: any) {
      console.error('Failed to load supplier requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierSelect = (id: string) => {
    const s = supplierPresets.find((p) => p.id === id);
    if (s) {
      setSupplierId(s.id);
      setSupplierName(s.name);
      setSupplierEmail(s.email);
      setSupplierPhone(s.phone);
      setProductName(s.defaultProduct);
      setCnCode(s.defaultCn);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCreate(true);
    try {
      const payload: CreateSupplierRequestInput = {
        supplier_id: supplierId,
        supplier_name: supplierName,
        product_name: productName,
        cn_code: cnCode,
        reporting_period: reportingPeriod,
        due_date: dueDate,
        data_needed: [
          'production_route',
          'direct_fuel_consumption',
          'electricity_consumption',
          'electricity_source',
          'scrap_content_pct',
          'precursor_emissions_tco2_per_t',
          'evidence_doc',
        ],
        supplier_email: supplierEmail || undefined,
        supplier_phone: supplierPhone || undefined,
        custom_note: customNote || undefined,
      };

      const result = await ApiService.createSupplierRequest(payload);
      setCreatedRequestResult(result);
      loadRequests();
      if (onRefreshParent) onRefreshParent();
    } catch (err: any) {
      alert(err?.message || 'Failed to create request');
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleSendReminder = async (requestId: string) => {
    try {
      const res = await ApiService.sendSupplierReminder(requestId, 'WHATSAPP');
      const req = requests.find((r) => r.id === requestId);
      setReminderModalData({
        requestId,
        supplierName: req?.supplier_name || 'Mill Partner',
        productName: req?.product_name || 'Precursor Material',
        deadline: req?.deadline || req?.due_date || 'Upcoming',
        token: req?.token || '',
        whatsappMsg: res?.whatsapp_message,
      });
      loadRequests();
    } catch (err: any) {
      alert(err?.message || 'Failed to send reminder');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalRequest) return;
    setIsSubmittingReview(true);
    try {
      const heats = linkedHeatsText
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean);

      await ApiService.reviewSupplierRequest(reviewModalRequest.id, {
        action: reviewAction,
        comment: reviewComment || (reviewAction === 'Accepted' ? 'Precursor verified by QA.' : 'Returned for revision.'),
        linked_heats: reviewAction === 'Accepted' ? heats : undefined,
      });

      alert(
        reviewAction === 'Accepted'
          ? 'Precursor data accepted and linked to heats successfully!'
          : 'Data returned to supplier with review notes.'
      );
      setReviewModalRequest(null);
      loadRequests();
      if (onRefreshParent) onRefreshParent();
    } catch (err: any) {
      alert(err?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const filteredRequests = requests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.supplier_name.toLowerCase().includes(q) ||
      r.product_name.toLowerCase().includes(q) ||
      r.cn_code.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ACCEPTED · LINKED
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            IN REVIEW
          </span>
        );
      case 'RECEIVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            RECEIVED
          </span>
        );
      case 'REMINDED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            REMINDED
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
            OVERDUE
          </span>
        );
      case 'RETURNED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            RETURNED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            REQUESTED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Supplier CBAM Precursor Tracker Board</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Collect, track, and verify actual precursor emissions data from primary steel mills without chasing by phone.
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedRequestResult(null);
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Supplier Request</span>
        </button>
      </div>

      {/* Pipeline Status Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
        {[
          { key: 'ALL', label: 'All Requests', count: counts.TOTAL || 0, color: 'text-slate-200' },
          { key: 'REQUESTED', label: 'Requested', count: counts.REQUESTED || 0, color: 'text-slate-300' },
          { key: 'REMINDED', label: 'Reminded', count: counts.REMINDED || 0, color: 'text-amber-400' },
          { key: 'RECEIVED', label: 'Received', count: counts.RECEIVED || 0, color: 'text-cyan-400' },
          { key: 'IN_REVIEW', label: 'In Review', count: counts.IN_REVIEW || 0, color: 'text-purple-400' },
          { key: 'ACCEPTED', label: 'Accepted', count: counts.ACCEPTED || 0, color: 'text-emerald-400' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeFilter === tab.key
                ? 'bg-slate-800 border-emerald-500/50 shadow-md'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{tab.label}</div>
            <div className={`text-xl font-bold font-mono mt-0.5 ${tab.color}`}>{tab.count}</div>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by mill (Tata, SAIL, JSW), product, or CN code..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="text-xs font-mono text-slate-400 self-center sm:self-auto">
          Showing {filteredRequests.length} active requests
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {loading && (
          <div className="py-12 text-center text-slate-400 text-xs font-mono">
            <RefreshCw className="w-5 h-5 mx-auto animate-spin text-emerald-400 mb-2" />
            Loading precursor request pipeline...
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
          <div className="py-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
            <Layers className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs text-slate-400 font-mono">No supplier data requests found in this category.</p>
          </div>
        )}

        {!loading &&
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
            >
              {/* Left Info */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-bold text-white text-sm">{req.supplier_name}</span>
                  {getStatusBadge(req.status)}
                  <span className="text-[11px] font-mono text-slate-400">
                    Period: <strong className="text-white">{req.reporting_period}</strong>
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono flex items-center gap-2 flex-wrap">
                  <span className="text-emerald-400 font-semibold">{req.product_name}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">CN: {req.cn_code}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">Deadline: <strong className="text-white">{req.due_date || req.deadline}</strong></span>
                </div>

                {/* Submitter & Evidence pill if received */}
                {req.precursor_emissions_tco2_per_t != null && (
                  <div className="pt-1 flex items-center gap-3 text-xs font-mono flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      SEE: <strong>{req.precursor_emissions_tco2_per_t} tCO₂e/t</strong>
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Submitted by: {req.submitter_name || 'Mill Respondent'}
                    </span>
                    {req.evidence_file_name && (
                      <span className="text-purple-400 text-[11px] flex items-center gap-1">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>{req.evidence_file_name}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                {/* Copy public link */}
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/supplier-request/${req.token}`,
                      req.id
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors flex items-center gap-1.5"
                  title="Copy supplier direct form link"
                >
                  {copiedToken === req.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedToken === req.id ? 'Copied' : 'Link'}</span>
                </button>

                {/* Direct link to public form in new tab */}
                <a
                  href={`/supplier-request/${req.token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
                  title="Open Mobile Supplier Form"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Reminder button */}
                <button
                  onClick={() => handleSendReminder(req.id)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Reminder</span>
                </button>

                {/* Review button if Received or In Review */}
                {['RECEIVED', 'IN_REVIEW'].includes(req.status.toUpperCase()) && (
                  <button
                    onClick={() => {
                      setReviewModalRequest(req);
                      setReviewAction('Accepted');
                      setReviewComment('Precursor verified against third-party mill statement.');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Review</span>
                  </button>
                )}

                {/* If already accepted */}
                {req.status.toUpperCase() === 'ACCEPTED' && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Create New Request Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>New Supplier CBAM Data Request</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {createdRequestResult ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Secure Request Link Generated</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto font-sans">
                  The request for <strong className="text-white">{createdRequestResult.product_name}</strong> is live. Share this mobile link with your supplier's QA or decarbonization desk:
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-left">
                  <span className="text-xs font-mono text-emerald-400 truncate">
                    {window.location.origin}/supplier-request/{createdRequestResult.token}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/supplier-request/${createdRequestResult.token}`,
                        'modal'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-mono text-xs font-bold shrink-0"
                  >
                    {copiedToken === 'modal' ? 'Copied' : 'Copy Link'}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-left text-xs font-sans text-slate-300 space-y-2">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Invitation Preview:</span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-400 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-lg">
                    {createdRequestResult.whatsapp_invitation}
                  </pre>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono transition-colors"
                >
                  Done &amp; Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateRequest} className="space-y-4">
                {/* Mill Presets */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Select Upstream Steel Mill *
                  </label>
                  <select
                    value={supplierId}
                    onChange={(e) => handleSupplierSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  >
                    {supplierPresets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      CN Code (Combined Nomenclature) *
                    </label>
                    <input
                      type="text"
                      required
                      value={cnCode}
                      onChange={(e) => setCnCode(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Reporting Period *
                    </label>
                    <select
                      value={reportingPeriod}
                      onChange={(e) => setReportingPeriod(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    >
                      <option value="2026-Q1">2026-Q1 (Jan - Mar 2026)</option>
                      <option value="2026-Q2">2026-Q2 (Apr - Jun 2026)</option>
                      <option value="2025-Annual">2025-Annual (Full Year)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Target Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Supplier Contact Email
                    </label>
                    <input
                      type="email"
                      value={supplierEmail}
                      onChange={(e) => setSupplierEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Supplier Contact Phone (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={supplierPhone}
                      onChange={(e) => setSupplierPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Custom Note / Batch Context
                  </label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Precursor billets for export batch EXP-2026-109."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCreate}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    {isSubmittingCreate ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Link...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Create &amp; Generate Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                <span>Review Precursor Data Submission</span>
              </h3>
              <button
                onClick={() => setReviewModalRequest(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">SUPPLIER:</span>
                <span className="text-white font-bold">{reviewModalRequest.supplier_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">PRODUCT / CN:</span>
                <span className="text-white">
                  {reviewModalRequest.product_name} ({reviewModalRequest.cn_code})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">REPORTED SEE:</span>
                <span className="text-emerald-400 font-bold">
                  {reviewModalRequest.precursor_emissions_tco2_per_t || 1.825} tCO₂e / t
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">DATA ORIGIN:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px]">
                  SUPPLIER_REPORTED (Unverified until Accepted)
                </span>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  QA Verification Action *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewAction('Accepted')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      reviewAction === 'Accepted'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    ✓ Accept &amp; Link to Heats
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction('Returned')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      reviewAction === 'Returned'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    ✕ Return with Comments
                  </button>
                </div>
              </div>

              {reviewAction === 'Accepted' && (
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Link to Heat Numbers (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={linkedHeatsText}
                    onChange={(e) => setLinkedHeatsText(e.target.value)}
                    placeholder="e.g. TSJ-26-9021, TSJ-26-9022"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Precursor record will be versioned and linked to these active heats in the traceability ledger.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Reviewer Audit Note *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={
                    reviewAction === 'Accepted'
                      ? 'Verified against mill ISO 14064 statement.'
                      : 'Please provide third-party electricity verification statement.'
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReviewModalRequest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg ${
                    reviewAction === 'Accepted'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-rose-500 hover:bg-rose-400 text-white'
                  }`}
                >
                  {isSubmittingReview ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{reviewAction === 'Accepted' ? 'Confirm Acceptance' : 'Return to Supplier'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminder Notice Modal */}
      {reminderModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span>Supplier Reminder Dispatched</span>
              </h3>
              <button
                onClick={() => setReminderModalData(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              A reminder timestamp has been recorded. You can also copy and send this message directly via WhatsApp:
            </p>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {reminderModalData.whatsappMsg}
            </pre>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  if (reminderModalData.whatsappMsg) {
                    copyToClipboard(reminderModalData.whatsappMsg, 'whatsapp');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5"
              >
                {copiedToken === 'whatsapp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToken === 'whatsapp' ? 'Copied' : 'Copy WhatsApp Message'}</span>
              </button>
              <button
                onClick={() => setReminderModalData(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDataRequestsTracker;

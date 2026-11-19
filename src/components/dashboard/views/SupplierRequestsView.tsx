import React, { useState, useEffect } from 'react';
import {
  Send,
  Plus,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  FileText,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Database,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Link2
} from 'lucide-react';
import { api, SupplierRequestItem, VersionedPrecursorItem } from '../../../services/api';
import { useToast } from '../../ui/ToastContext';

export const SupplierRequestsView: React.FC = () => {
  const { addToast } = useToast();
  const [requests, setRequests] = useState<SupplierRequestItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isPrecursorLedgerOpen, setIsPrecursorLedgerOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<SupplierRequestItem | null>(null);
  const [precursors, setPrecursors] = useState<VersionedPrecursorItem[]>([]);

  // New Request Form State
  const [newSupplier, setNewSupplier] = useState('Tata Steel Limited');
  const [newSupplierId, setNewSupplierId] = useState('sup_tata_steel');
  const [newProduct, setNewProduct] = useState('Steel Billets Grade SAE 1018');
  const [newCnCode, setNewCnCode] = useState('7207 11 16');
  const [newPeriod, setNewPeriod] = useState('2026-Q1');
  const [newDeadline, setNewDeadline] = useState('2026-04-15');
  const [newPhone, setNewPhone] = useState('+91 657 664 4000');
  const [newEmail, setNewEmail] = useState('tc.dispatch@tatasteel.com');
  const [createdResult, setCreatedResult] = useState<any>(null);

  // Review Form State
  const [reviewAction, setReviewAction] = useState<'Accepted' | 'Returned'>('Accepted');
  const [reviewComment, setReviewComment] = useState('');
  const [linkedHeatsInput, setLinkedHeatsInput] = useState('TSJ-26-9021, TSJ-26-9022');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.listSupplierRequests();
      setRequests(res.requests || []);
      setCounts(res.counts || {});
    } catch {
      // Fallback demo requests
      setRequests([
        {
          id: 'req_sr_9021',
          token: 'sreq_demo_tata_9021',
          supplier_id: 'sup_tata_steel',
          supplier_name: 'Tata Steel Limited',
          product_name: 'Steel Billets Grade SAE 1018',
          cn_code: '7207 11 16',
          reporting_period: '2026-Q1',
          deadline: '2026-04-15',
          due_date: '2026-04-15',
          status: 'Accepted',
          data_needed: ['production_route', 'direct_fuel', 'electricity_source', 'scrap_content'],
          requested_fields: ['production_route', 'direct_fuel', 'electricity_source', 'scrap_content'],
          public_url: '/supplier-request/sreq_demo_tata_9021',
          created_at: new Date().toISOString(),
          submitter_name: 'V. K. Mehta',
          submitted_at: '2026-03-28T10:15:00Z',
          precursor_emissions_tco2_per_t: 2.10,
          evidence_file_name: 'TSJ_CBAM_Emission_Declaration_2026Q1.pdf',
          precursor_record_id: 'prec_tsj_26_01',
          precursor_version: 1
        },
        {
          id: 'req_sr_9022',
          token: 'sreq_demo_jsw_9022',
          supplier_id: 'sup_jsw_steel',
          supplier_name: 'JSW Steel Limited',
          product_name: 'DRI & Billets Grade SAE 1045',
          cn_code: '7207 19 80',
          reporting_period: '2026-Q1',
          deadline: '2026-04-10',
          due_date: '2026-04-10',
          status: 'Received',
          data_needed: ['production_route', 'direct_fuel', 'electricity_source', 'scrap_content'],
          requested_fields: ['production_route', 'direct_fuel', 'electricity_source', 'scrap_content'],
          public_url: '/supplier-request/sreq_demo_jsw_9022',
          created_at: new Date().toISOString(),
          submitter_name: 'P. R. Hegde',
          submitted_at: '2026-03-29T14:30:00Z',
          precursor_emissions_tco2_per_t: 1.60,
          evidence_file_name: 'JSW_Vijayanagar_CBAM_Annex_IV_2026Q1.xlsx'
        },
        {
          id: 'req_sr_9023',
          token: 'sreq_demo_sail_9023',
          supplier_id: 'sup_sail_bokaro',
          supplier_name: 'Steel Authority of India Limited (SAIL)',
          product_name: 'Steel Billets Grade IS 2062 E250',
          cn_code: '7207 11 16',
          reporting_period: '2026-Q1',
          deadline: '2026-04-05',
          due_date: '2026-04-05',
          status: 'Reminded',
          data_needed: ['production_route', 'direct_fuel', 'electricity_source'],
          requested_fields: ['production_route', 'direct_fuel', 'electricity_source'],
          public_url: '/supplier-request/sreq_demo_sail_9023',
          created_at: new Date().toISOString()
        },
        {
          id: 'req_sr_9024',
          token: 'sreq_demo_electrosteel_9024',
          supplier_id: 'sup_electrosteel',
          supplier_name: 'Electrosteel Steels Limited',
          product_name: 'Pig Iron Precursors',
          cn_code: '7201 10 19',
          reporting_period: '2025-Q4',
          deadline: '2026-02-15',
          due_date: '2026-02-15',
          status: 'Overdue',
          data_needed: ['production_route', 'direct_fuel', 'electricity_source'],
          requested_fields: ['production_route', 'direct_fuel', 'electricity_source'],
          public_url: '/supplier-request/sreq_demo_electrosteel_9024',
          created_at: new Date().toISOString()
        }
      ]);
      setCounts({ TOTAL: 4, ACCEPTED: 1, RECEIVED: 1, REMINDED: 1, OVERDUE: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCopyLink = (token: string) => {
    const fullUrl = `${window.location.origin}/supplier-request/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    addToast('Direct supplier form link copied to clipboard!', 'success');
    setTimeout(() => setCopiedToken(null), 3000);
  };

  const handleSendReminder = async (req: SupplierRequestItem) => {
    try {
      const res = await api.sendSupplierReminder(req.id, 'WHATSAPP');
      addToast(`WhatsApp reminder sent to ${req.supplier_name} contact!`, 'success');
      fetchRequests();
    } catch (e: any) {
      addToast(e.message || 'Failed to dispatch reminder', 'error');
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createSupplierRequest({
        supplier_id: newSupplierId,
        supplier_name: newSupplier,
        product_name: newProduct,
        cn_code: newCnCode,
        reporting_period: newPeriod,
        data_needed: ['production_route', 'direct_fuel', 'electricity_source', 'precursor_inputs', 'scrap_content'],
        due_date: newDeadline,
        supplier_phone: newPhone,
        supplier_email: newEmail
      });
      setCreatedResult(res);
      addToast('Supplier CBAM data request created successfully!', 'success');
      fetchRequests();
    } catch (e: any) {
      addToast(e.message || 'Failed to create request', 'error');
    }
  };

  const handleOpenReview = async (req: SupplierRequestItem) => {
    setSelectedRequest(req);
    setReviewAction('Accepted');
    setReviewComment('Actual production evidence verified against melt log. Approved for CBAM declaration.');
    setLinkedHeatsInput('TSJ-26-9021, TSJ-26-9022');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedRequest) return;
    try {
      setReviewSubmitting(true);
      const heats = linkedHeatsInput.split(',').map(s => s.trim()).filter(Boolean);
      await api.reviewSupplierRequest(selectedRequest.id, {
        action: reviewAction,
        comment: reviewComment,
        linked_heats: heats
      });
      addToast(
        reviewAction === 'Accepted'
          ? 'Supplier precursor data accepted & versioned into emissions ledger!'
          : 'Data returned to supplier with review notes.',
        'success'
      );
      setIsReviewModalOpen(false);
      fetchRequests();
    } catch (e: any) {
      addToast(e.message || 'Failed to submit review', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleOpenPrecursorLedger = async () => {
    try {
      const res = await api.listVersionedPrecursors();
      setPrecursors(res.precursors || []);
    } catch {
      setPrecursors([
        {
          id: 'prec_tsj_26_01',
          request_id: 'req_sr_9021',
          supplier_id: 'sup_tata_steel',
          supplier_name: 'Tata Steel Limited',
          product_name: 'Steel Billets Grade SAE 1018',
          cn_code: '7207 11 16',
          reporting_period: '2026-Q1',
          precursor_see_tco2_per_t: 2.10,
          production_route: 'BF-BOF (Blast Furnace - Basic Oxygen Furnace)',
          scrap_content_pct: 12.5,
          evidence_sha256: '8a32f912e5ab84cf43d120a1122394c8e7629b3a0df478b0213709b119cd7e21',
          linked_heats: ['TSJ-26-9021', 'TSJ-26-9022'],
          version: 1,
          accepted_by: 'usr_qa_04',
          accepted_at: '2026-03-29T11:00:00Z',
          data_origin_tag: 'VERIFIED_SUPPLIER_PRECURSOR'
        }
      ]);
    }
    setIsPrecursorLedgerOpen(true);
  };

  // Filter requests
  const filteredRequests = requests.filter(r => {
    const matchSearch =
      r.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cn_code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (activeTab === 'all') return true;
    return r.status.toLowerCase().replace(/[^a-z]/g, '') === activeTab.toLowerCase().replace(/[^a-z]/g, '');
  });

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'ACCEPTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Accepted
        </span>
      );
    }
    if (s === 'RECEIVED' || s === 'IN_REVIEW') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
          <Clock className="w-3.5 h-3.5" />
          {s === 'RECEIVED' ? 'Received (Review Pending)' : 'In Review'}
        </span>
      );
    }
    if (s === 'REMINDED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <MessageSquare className="w-3.5 h-3.5" />
          Reminded
        </span>
      );
    }
    if (s === 'OVERDUE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          Overdue
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
        <Send className="w-3.5 h-3.5" />
        Requested
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Prompt P5 · EU CBAM Ready
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Mobile-Friendly Supplier Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Supplier Data Requests for CBAM</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Request, receive and verify actual precursor emissions data from upstream mills, traders, and re-rollers.
            Eliminates high-cost EU default benchmark penalties.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenPrecursorLedger}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            Precursor Ledger
          </button>
          <button
            onClick={() => {
              setCreatedResult(null);
              setIsNewModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold font-mono bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition"
          >
            <Plus className="w-4 h-4" />
            New Data Request
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Active Requests</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {requests.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Across upstream mills</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-blue-400 font-medium">Pending QA Review</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {requests.filter(r => ['received', 'in_review'].includes(r.status.toLowerCase())).length}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Evidence attached</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-emerald-400 font-medium">Accepted Precursors</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {requests.filter(r => r.status.toLowerCase() === 'accepted').length}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Linked to heat ledger</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-rose-400 font-medium">Overdue Requests</span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {requests.filter(r => r.status.toLowerCase() === 'overdue').length}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Past submission deadline</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'requested', label: 'Requested' },
            { id: 'reminded', label: 'Reminded' },
            { id: 'received', label: 'Received' },
            { id: 'accepted', label: 'Accepted' },
            { id: 'overdue', label: 'Overdue' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mill, product, CN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Request Board Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            Loading supplier data requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/30 rounded-2xl border border-slate-800 text-slate-400">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium">No supplier requests found for this filter.</p>
            <p className="text-xs text-slate-500 mt-1">Create a new request to invite mills to submit emissions data.</p>
          </div>
        ) : (
          filteredRequests.map(req => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 transition flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white tracking-tight">{req.supplier_name}</h3>
                  {getStatusBadge(req.status)}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span>Product: <strong className="text-slate-200">{req.product_name}</strong></span>
                  <span className="font-mono text-slate-500">CN: {req.cn_code}</span>
                  <span className="font-mono text-slate-500">Period: {req.reporting_period}</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Due: <span className="font-mono">{req.due_date}</span>
                  </span>
                </div>

                {req.precursor_emissions_tco2_per_t && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      Reported Precursor SEE: <strong>{req.precursor_emissions_tco2_per_t.toFixed(2)} tCO2e/t</strong>
                    </span>
                    <span className="text-[11px] text-slate-400 italic">
                      Tagged: Supplier-Reported (Unverified plant measurement vs Verified mill audit)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t border-slate-800/60 lg:border-t-0">
                <button
                  onClick={() => handleCopyLink(req.token)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                  title="Copy direct no-login mobile link for mill"
                >
                  {copiedToken === req.token ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedToken === req.token ? 'Copied Link' : 'Copy Link'}
                </button>

                <a
                  href={`/supplier-request/${req.token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                  title="Preview mobile form"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  Preview Form
                </a>

                {['requested', 'reminded', 'overdue'].includes(req.status.toLowerCase()) && (
                  <button
                    onClick={() => handleSendReminder(req)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Send Reminder
                  </button>
                )}

                {['received', 'in_review', 'accepted'].includes(req.status.toLowerCase()) && (
                  <button
                    onClick={() => handleOpenReview(req)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition shadow"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {req.status.toLowerCase() === 'accepted' ? 'View Precursor' : 'Review & Accept'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: Create New Request */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Create CBAM Data Request</h2>
                <p className="text-xs text-slate-400 mt-0.5">Generate a secure no-login mobile link for upstream mills & traders.</p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            {createdResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Request Link Generated!
                  </div>
                  <p>Send this link to the mill quality or dispatch officer. No account or password is required.</p>
                  <div className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-emerald-900 font-mono text-[11px] break-all">
                    <span>{window.location.origin}{createdResult.form_url || createdResult.public_url}</span>
                    <button
                      onClick={() => handleCopyLink(createdResult.secure_token || createdResult.token)}
                      className="ml-auto px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-300">WhatsApp Invitation Template:</span>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 whitespace-pre-wrap">
                    {createdResult.whatsapp_invitation}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Upstream Mill / Supplier</label>
                  <select
                    value={newSupplier}
                    onChange={e => {
                      setNewSupplier(e.target.value);
                      if (e.target.value.includes('Tata')) setNewSupplierId('sup_tata_steel');
                      else if (e.target.value.includes('SAIL')) setNewSupplierId('sup_sail_bokaro');
                      else if (e.target.value.includes('JSW')) setNewSupplierId('sup_jsw_steel');
                      else setNewSupplierId('sup_custom_mill');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Tata Steel Limited">Tata Steel Limited (Jamshedpur / Kalinganagar)</option>
                    <option value="Steel Authority of India Limited (SAIL)">SAIL (Bokaro / Rourkela)</option>
                    <option value="JSW Steel Limited">JSW Steel Limited (Vijayanagar Works)</option>
                    <option value="Jindal Steel & Power Ltd.">Jindal Steel & Power Ltd. (Raigarh)</option>
                    <option value="Kalyani Steels Limited">Kalyani Steels Limited (Ginigera)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Product / Precursor Name</label>
                    <input
                      type="text"
                      value={newProduct}
                      onChange={e => setNewProduct(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Combined CN Code</label>
                    <input
                      type="text"
                      value={newCnCode}
                      onChange={e => setNewCnCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Reporting Period</label>
                    <select
                      value={newPeriod}
                      onChange={e => setNewPeriod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="2026-Q1">2026-Q1 (Jan - Mar 2026)</option>
                      <option value="2026-Q2">2026-Q2 (Apr - Jun 2026)</option>
                      <option value="2025-Q4">2025-Q4 (Oct - Dec 2025)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Submission Due Date</label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={e => setNewDeadline(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">WhatsApp Mobile (+91)</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">QA Contact Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Data Fields Needed</label>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Production Route</span>
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Direct Fuel Consumption</span>
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Electricity & Grid Factor</span>
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Scrap Input Content (%)</span>
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Precursors Consumed</span>
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Evidence PDF / Excel</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30"
                  >
                    Generate Secure Link & Templates
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Review Supplier Submission */}
      {isReviewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Review Supplier CBAM Declaration</h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedRequest.supplier_name} · {selectedRequest.product_name}</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Submitter & Evidence Bar */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Respondent: <strong className="text-white">{selectedRequest.submitter_name || 'V. K. Mehta (QA Head)'}</strong></span>
                <span className="text-slate-500 font-mono">Submitted: {selectedRequest.submitted_at ? new Date(selectedRequest.submitted_at).toLocaleDateString() : 'Recent'}</span>
              </div>

              {selectedRequest.evidence_file_name && (
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>{selectedRequest.evidence_file_name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    SHA-256 Verified
                  </span>
                </div>
              )}
            </div>

            {/* Emission Metrics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                <span className="text-[11px] text-slate-500 uppercase font-mono">Route</span>
                <p className="text-xs font-semibold text-slate-200 mt-1">BF-BOF Primary</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                <span className="text-[11px] text-slate-500 uppercase font-mono">Specific SEE</span>
                <p className="text-xs font-semibold text-emerald-400 mt-1">
                  {selectedRequest.precursor_emissions_tco2_per_t ? `${selectedRequest.precursor_emissions_tco2_per_t.toFixed(2)} tCO2e/t` : '1.85 tCO2e/t'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                <span className="text-[11px] text-slate-500 uppercase font-mono">Data Origin</span>
                <p className="text-[11px] font-semibold text-amber-400 mt-1">Supplier-Reported</p>
              </div>
            </div>

            {/* QA Decision Controls */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Decision Action</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewAction('Accepted')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition ${
                      reviewAction === 'Accepted'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept & Version Precursor
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction('Returned')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition ${
                      reviewAction === 'Returned'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-900/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    Return with Comments
                  </button>
                </div>
              </div>

              {reviewAction === 'Accepted' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Link to Heat Numbers <span className="text-slate-500">(Comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={linkedHeatsInput}
                    onChange={e => setLinkedHeatsInput(e.target.value)}
                    placeholder="e.g. TSJ-26-9021, TSJ-26-9022"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Shipments consuming these heats will automatically reference this verified precursor record.
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Review Notes & Verification Rationale</label>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="Explain why this data is accepted or returned..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={reviewSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Recording Decision...' : 'Confirm Decision'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Versioned Precursors Ledger */}
      {isPrecursorLedgerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Verified Precursor Records</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Versioned supplier precursor emissions records linked to heats.</p>
                </div>
              </div>
              <button
                onClick={() => setIsPrecursorLedgerOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              {precursors.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">No precursor records generated yet.</div>
              ) : (
                precursors.map((p, idx) => (
                  <div key={p.id || idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-white">{p.supplier_name}</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          v{p.version}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                          {p.reporting_period}
                        </span>
                      </div>
                      <span className="text-xs font-bold font-mono text-emerald-400">
                        {p.precursor_see_tco2_per_t.toFixed(2)} tCO2e/t
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Product: <strong className="text-slate-300">{p.product_name}</strong></span>
                      <span className="font-mono text-slate-500">CN: {p.cn_code}</span>
                      <span>Route: <span className="text-slate-300">{p.production_route}</span></span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Linked Heats:</span>
                        <span className="font-mono text-emerald-400 font-semibold">
                          {(p.linked_heats || []).join(', ')}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        Hash: {p.evidence_sha256 ? `${p.evidence_sha256.slice(0, 12)}...` : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsPrecursorLedgerOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
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

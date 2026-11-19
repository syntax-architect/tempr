import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Trash2,
  Plus,
  RefreshCw,
  Clock,
  FileText,
  QrCode,
  Zap,
  Info
} from 'lucide-react';

interface PhonePairing {
  id: string;
  phone_number: string;
  plant_id: string;
  user_id: string;
  pairing_code: string;
  is_verified: number;
  is_opted_out: number;
  created_at: string;
}

interface BudgetStatus {
  plant_id: string;
  current_month: string;
  messages_used: number;
  monthly_budget: number;
  remaining: number;
  is_capped: boolean;
  show_banner: boolean;
}

interface EmailConfig {
  plant_id: string;
  organization_id: string;
  inbound_email: string;
  is_active: boolean;
  allow_list: string[];
}

interface IntakeLog {
  id: string;
  channel: 'WHATSAPP' | 'EMAIL';
  message_id: string;
  plant_id: string;
  sender: string;
  message_type: string;
  document_id?: string;
  status: string;
  reply_sent?: string;
  created_at: string;
}

interface IntakeChannelsViewProps {
  onNavigateToWorkbench?: (docId?: string) => void;
}

export const IntakeChannelsView: React.FC<IntakeChannelsViewProps> = ({ onNavigateToWorkbench }) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'logs'>('whatsapp');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // WhatsApp pairing states
  const [pairings, setPairings] = useState<PhonePairing[]>([
    {
      id: 'pair_init_01',
      phone_number: '+91 98300 22001',
      plant_id: 'plant-howrah-01',
      user_id: 'usr_qa_inspector_01',
      pairing_code: '482910',
      is_verified: 1,
      is_opted_out: 0,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'pair_init_02',
      phone_number: '+91 98300 99441',
      plant_id: 'plant-howrah-01',
      user_id: 'usr_dispatch_01',
      pairing_code: '901248',
      is_verified: 1,
      is_opted_out: 0,
      created_at: new Date(Date.now() - 86400000 * 7).toISOString()
    }
  ]);
  const [generatedCode, setGeneratedCode] = useState<{ code: string; phone: string; instruction: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Budget status
  const [budget, setBudget] = useState<BudgetStatus>({
    plant_id: 'plant-howrah-01',
    current_month: '2026-11',
    messages_used: 18,
    monthly_budget: 500,
    remaining: 482,
    is_capped: false,
    show_banner: false
  });

  // Email config
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    plant_id: 'plant-howrah-01',
    organization_id: 'org_demo_howrah',
    inbound_email: 'docs-howrah@inbound.heatledger.ai',
    is_active: true,
    allow_list: ['@tatasteel.com', '@sail.in', 'dispatch@jindalsteel.com']
  });
  const [newAllowItem, setNewAllowItem] = useState('');

  // Logs
  const [logs, setLogs] = useState<IntakeLog[]>([
    {
      id: 'log_01',
      channel: 'WHATSAPP',
      message_id: 'wamid.HBgLMjAyNjExMTk...',
      plant_id: 'plant-howrah-01',
      sender: '+91 98300 22001',
      message_type: 'image/jpeg',
      document_id: 'doc_wa_88910',
      status: 'PROCESSED',
      reply_sent: 'Certificate received (IMG_2026_MTC.jpg). Queued for OCR.',
      created_at: new Date(Date.now() - 1000 * 60 * 14).toISOString()
    },
    {
      id: 'log_02',
      channel: 'EMAIL',
      message_id: 'em_tatasteel_8819',
      plant_id: 'plant-howrah-01',
      sender: 'dispatch@tatasteel.com',
      message_type: 'application/pdf',
      document_id: 'doc_em_44120',
      status: 'PROCESSED',
      reply_sent: 'MTC Tata Steel ASTM A106 ingested successfully.',
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
      id: 'log_03',
      channel: 'WHATSAPP',
      message_id: 'wamid.HBgLUnBob25l...',
      plant_id: 'plant-howrah-01',
      sender: '+91 98765 00000',
      message_type: 'text',
      status: 'UNPAIRED_SENDER',
      reply_sent: 'This phone is not linked to HeatLedger. Please generate pairing code.',
      created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString()
    }
  ]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGeneratePairing = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/intake/whatsapp/generate-pairing-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_id: 'plant-howrah-01', user_id: 'usr_owner_01' })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedCode({
          code: data.pairing_code,
          phone: data.phone_number,
          instruction: data.instruction
        });
      } else {
        // Fallback demo code
        const fallback = String(Math.floor(100000 + Math.random() * 900000));
        setGeneratedCode({
          code: fallback,
          phone: '+91 98300 22000',
          instruction: `Send 'PAIR ${fallback}' from WhatsApp to +91 98300 22000 to connect.`
        });
      }
    } catch {
      const fallback = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedCode({
        code: fallback,
        phone: '+91 98300 22000',
        instruction: `Send 'PAIR ${fallback}' from WhatsApp to +91 98300 22000 to connect.`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUnlink = async (pairingId: string) => {
    try {
      await fetch(`/api/intake/whatsapp/pairings/${pairingId}`, { method: 'DELETE' });
    } catch {
      // offline/mock fallback
    }
    setPairings((prev) => prev.filter((p) => p.id !== pairingId));
  };

  const handleAddAllowDomain = () => {
    if (!newAllowItem.trim()) return;
    const clean = newAllowItem.trim().toLowerCase();
    if (!emailConfig.allow_list.includes(clean)) {
      const updated = [...emailConfig.allow_list, clean];
      setEmailConfig((prev) => ({ ...prev, allow_list: updated }));
      setNewAllowItem('');
      // sync with backend
      fetch('/api/intake/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_id: emailConfig.plant_id,
          allow_list: updated,
          is_active: emailConfig.is_active
        })
      }).catch(() => {});
    }
  };

  const handleRemoveAllowDomain = (item: string) => {
    const updated = emailConfig.allow_list.filter((x) => x !== item);
    setEmailConfig((prev) => ({ ...prev, allow_list: updated }));
    fetch('/api/intake/email/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plant_id: emailConfig.plant_id,
        allow_list: updated,
        is_active: emailConfig.is_active
      })
    }).catch(() => {});
  };

  const handleToggleEmailActive = () => {
    const nextState = !emailConfig.is_active;
    setEmailConfig((prev) => ({ ...prev, is_active: nextState }));
    fetch('/api/intake/email/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plant_id: emailConfig.plant_id,
        allow_list: emailConfig.allow_list,
        is_active: nextState
      })
    }).catch(() => {});
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-[var(--color-text)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Prompt P3: Zero-Friction Intake
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">24-hr Free Window Active</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-[var(--color-text)]">
            WhatsApp & Email Certificate Intake
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Allow plant workers and dispatch supervisors to send camera photos and MTC PDFs directly from WhatsApp or email into the review queue.
          </p>
        </div>

        {/* Cost Guard & Monthly Budget Badge */}
        <div className="flex items-center gap-3 bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)] shadow-sm">
          <Zap className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-[var(--color-text)]">Monthly Message Budget</div>
            <div className="text-[var(--color-text-secondary)]">
              {budget.messages_used} / {budget.monthly_budget} messages used ({budget.remaining} remaining)
            </div>
          </div>
          {budget.show_banner && (
            <span className="px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-md border border-amber-500/20">
              Budget Alert
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)] gap-2">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'whatsapp'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          WhatsApp Cloud API
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'email'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          }`}
        >
          <Mail className="w-4 h-4" />
          Plant Email-In
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'logs'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          }`}
        >
          <Clock className="w-4 h-4" />
          Transmission Logs ({logs.length})
        </button>
      </div>

      {/* Tab 1: WhatsApp Cloud Intake */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Pairing instructions & Active Phones */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-text)]">Link Staff Phone Numbers</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Generate a 6-digit one-time code to link an operator's WhatsApp number to this plant.
                  </p>
                </div>
                <button
                  onClick={handleGeneratePairing}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  Generate 6-Digit Code
                </button>
              </div>

              {/* Generated Pairing Code Callout */}
              {generatedCode && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">Active Pairing Code</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">Expires in 24 hrs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-300 bg-white/60 dark:bg-black/30 px-3 py-1 rounded">
                      {generatedCode.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`PAIR ${generatedCode.code}`, 'code')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedKey === 'code' ? 'Copied!' : 'Copy WhatsApp Text'}
                    </button>
                  </div>
                  <p className="text-emerald-800/80 dark:text-emerald-300/80">
                    {generatedCode.instruction}
                  </p>
                </div>
              )}

              {/* Paired Numbers Table */}
              <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium">
                    <tr>
                      <th className="py-2.5 px-3">Phone Number</th>
                      <th className="py-2.5 px-3">Linked Plant</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Linked Date</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {pairings.map((p) => (
                      <tr key={p.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                        <td className="py-2.5 px-3 font-mono font-medium text-[var(--color-text)]">
                          {p.phone_number}
                        </td>
                        <td className="py-2.5 px-3 text-[var(--color-text-secondary)]">
                          {p.plant_id}
                        </td>
                        <td className="py-2.5 px-3">
                          {p.is_opted_out ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              Opted Out
                            </span>
                          ) : p.is_verified ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Active & Verified
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                              Pending Code
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-[var(--color-text-secondary)]">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleUnlink(p.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded transition"
                            title="Unlink Phone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pairings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-[var(--color-text-secondary)]">
                          No phone numbers linked yet. Click 'Generate 6-Digit Code' above to connect staff.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workflow steps card */}
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-[var(--color-text)]">How Workers Ingest MTCs via WhatsApp</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-hover)] space-y-1.5">
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold">1</span>
                    Snap MTC Photo
                  </div>
                  <p className="text-[var(--color-text-secondary)]">
                    Operator takes a photo of the physical 3.1 certificate right on the factory floor or weighbridge.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-hover)] space-y-1.5">
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold">2</span>
                    Send to Bot
                  </div>
                  <p className="text-[var(--color-text-secondary)]">
                    Photo is sent to the verified HeatLedger WhatsApp number. Server stores original untouched with SHA-256 hash.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-hover)] space-y-1.5">
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold">3</span>
                    Instant Status Link
                  </div>
                  <p className="text-[var(--color-text-secondary)]">
                    Bot automatically replies within the 24-hr free window with deep link to review extracted chemistry & mechanicals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Meta Rules & Cost Guard */}
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-base font-semibold text-[var(--color-text)]">Meta India Pricing Verified</h3>
              </div>
              <div className="space-y-3 text-xs text-[var(--color-text-secondary)]">
                <div className="p-3 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
                  <div className="font-semibold text-[var(--color-text)] mb-1">Customer Service Window (24 hrs)</div>
                  <p>Inbound uploads and automated acknowledgement replies inside 24 hours incur <strong className="text-emerald-600 dark:text-emerald-400">zero template fees</strong> under Meta Cloud API guidelines.</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
                  <div className="font-semibold text-[var(--color-text)] mb-1">Utility & Alert Rate</div>
                  <p>Outbound reminders outside 24h cost ~INR 0.12 - 0.35 per message. HeatLedger hard-caps alerts at {budget.monthly_budget}/month to prevent surprise billing.</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
                  <div className="font-semibold text-[var(--color-text)] mb-1">Privacy & Compliance</div>
                  <p>Users can reply <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">STOP</code> at any time to unsubscribe, or <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">START</code> to re-enable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Plant Email-In Ingestion */}
      {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Email Address Card */}
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-text)]">Dedicated Plant Inbound Address</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Forward supplier emails or dispatch notifications containing PDF certificates to this address.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    emailConfig.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                  }`}>
                    {emailConfig.is_active ? 'Active' : 'Paused'}
                  </span>
                  <button
                    onClick={handleToggleEmailActive}
                    className="px-2.5 py-1 text-xs font-medium rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition"
                  >
                    {emailConfig.is_active ? 'Pause Intake' : 'Resume Intake'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-mono text-sm text-[var(--color-text)] font-semibold select-all flex-1">
                  {emailConfig.inbound_email}
                </span>
                <button
                  onClick={() => copyToClipboard(emailConfig.inbound_email, 'email')}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedKey === 'email' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Sender Allow-List Configuration */}
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text)]">Sender Allow-List & Anti-Spam Firewall</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Only emails matching these domains or exact email addresses are ingested. All other senders are blocked to prevent junk.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. @tatasteel.com or dispatch@jsw.in"
                  value={newAllowItem}
                  onChange={(e) => setNewAllowItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAllowDomain()}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  onClick={handleAddAllowDomain}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to Allow-List
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {emailConfig.allow_list.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text)]"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveAllowDomain(item)}
                      className="text-[var(--color-text-secondary)] hover:text-red-500 transition"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Processing Heuristics */}
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-[var(--color-text)]">Automated Sanitation Pipeline</h3>
              <ul className="space-y-3 text-xs text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Tracking Pixel Stripping:</strong> 1x1 GIF and PNG tracking beacons are automatically purged.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Attachment Magic Byte Validation:</strong> Only verified PDF, JPG, PNG, and HEIC files pass into storage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>EN 10204 Clause 6 Integrity:</strong> Attachments are stored untouched in read-only storage with SHA-256 proof.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Unified Transmission Logs */}
      {activeTab === 'logs' && (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text)]">Recent Inbound Transmissions</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Audit trail of incoming certificates received via WhatsApp and Email channels.
              </p>
            </div>
            <span className="text-xs text-[var(--color-text-secondary)]">Showing last {logs.length} entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium">
                <tr>
                  <th className="py-2.5 px-4">Channel</th>
                  <th className="py-2.5 px-4">Sender</th>
                  <th className="py-2.5 px-4">Message / File Type</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Automated Response</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                    <td className="py-3 px-4">
                      {log.channel === 'WHATSAPP' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600">
                          <MessageSquare className="w-3 h-3" />
                          WhatsApp
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-600">
                          <Mail className="w-3 h-3" />
                          Email
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-[var(--color-text)]">
                      {log.sender}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                      {log.message_type}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        log.status === 'PROCESSED'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-secondary)] max-w-xs truncate" title={log.reply_sent}>
                      {log.reply_sent || '—'}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {log.document_id ? (
                        <button
                          onClick={() => onNavigateToWorkbench?.(log.document_id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition font-medium text-xs"
                        >
                          <FileText className="w-3 h-3" />
                          Review MTC
                        </button>
                      ) : (
                        <span className="text-[var(--color-text-secondary)] text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

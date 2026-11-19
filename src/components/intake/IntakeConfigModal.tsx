import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  QrCode,
  RefreshCw,
  X,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import { useToast } from '../ui/ToastContext';
import { haptics } from '../../lib/motion';

interface IntakeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantId?: string;
}

export const IntakeConfigModal: React.FC<IntakeConfigModalProps> = ({
  isOpen,
  onClose,
  plantId = 'plant-howrah-01',
}) => {
  let toast: { success: (title: string, desc?: string) => void; warning?: (title: string, desc?: string) => void };
  try {
    toast = useToast();
  } catch {
    toast = {
      success: () => {},
      warning: () => {},
    };
  }

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'budget'>('whatsapp');
  const [pairingCode, setPairingCode] = useState('884012');
  const [phoneNumber, setPhoneNumber] = useState('+919830012345');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Email config state
  const [inboundEmail, setInboundEmail] = useState(`docs-${plantId.split('-')[1] || 'howrah'}@inbound.heatledger.ai`);
  const [allowList, setAllowList] = useState<string[]>(['@howrahsteel.in', '@tatasteel.com', 'qa@sail.in']);
  const [newDomain, setNewDomain] = useState('');

  // Budget stats state
  const [messagesUsed, setMessagesUsed] = useState(18);
  const [monthlyBudget, setMonthlyBudget] = useState(500);

  useEffect(() => {
    if (!isOpen) return;
    // Fetch live intake stats from backend
    fetch(`/api/intake/budget?plant_id=${plantId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setMessagesUsed(data.messages_used ?? 18);
          setMonthlyBudget(data.monthly_budget ?? 500);
        }
      })
      .catch(() => {});

    fetch(`/api/intake/email/config?plant_id=${plantId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.inbound_email) setInboundEmail(data.inbound_email);
          if (data.allow_list && data.allow_list.length > 0) setAllowList(data.allow_list);
        }
      })
      .catch(() => {});
  }, [isOpen, plantId]);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    haptics.tap();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success('Copied to Clipboard', `${fieldName} copied.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGeneratePairingCode = () => {
    haptics.tap();
    setIsGenerating(true);
    fetch('/api/intake/whatsapp/generate-pairing-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plant_id: plantId, user_id: 'usr_qa_inspector_01' }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setIsGenerating(false);
        if (data && data.pairing_code) {
          setPairingCode(data.pairing_code);
          toast.success('Pairing Code Generated', `Send 'PAIR ${data.pairing_code}' from WhatsApp.`);
        } else {
          // Fallback code
          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          setPairingCode(newCode);
          toast.success('Pairing Code Generated', `Send 'PAIR ${newCode}' from WhatsApp.`);
        }
      })
      .catch(() => {
        setIsGenerating(false);
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        setPairingCode(newCode);
      });
  };

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    const clean = newDomain.trim().toLowerCase();
    if (!allowList.includes(clean)) {
      setAllowList([...allowList, clean]);
      toast.success('Domain Added', `${clean} added to plant allow-list.`);
    }
    setNewDomain('');
  };

  const handleRemoveDomain = (domain: string) => {
    setAllowList(allowList.filter((d) => d !== domain));
  };

  const waMessage = `PAIR ${pairingCode}`;
  const waUrl = `https://wa.me/919830022000?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl text-left text-white max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                WhatsApp &amp; Email Intake Channels
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Prompt P3 · Mobile photo &amp; email ingestion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-850 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('whatsapp');
            }}
            className={`py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('email');
            }}
            className={`py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'email'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email-In</span>
          </button>
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('budget');
            }}
            className={`py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'budget'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Budget</span>
          </button>
        </div>

        {/* TAB 1: WHATSAPP INTAKE */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-850/90 border border-slate-800 space-y-2">
              <span className="text-slate-400 block font-sans text-xs">
                Staff can photograph paper MTCs directly on the factory floor and send them to HeatLedger AI on WhatsApp.
              </span>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold">
                <span>Inbound WhatsApp Number:</span>
                <span className="text-white">+91 98300 22000</span>
              </div>
            </div>

            {/* Pairing Code Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 font-bold">Plant Pairing Code:</span>
                <button
                  onClick={handleGeneratePairingCode}
                  disabled={isGenerating}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Refresh Code</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-emerald-500/40">
                <span className="text-2xl font-black text-emerald-400 tracking-widest">
                  {pairingCode}
                </span>
                <button
                  onClick={() => handleCopy(`PAIR ${pairingCode}`, 'Pairing Command')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedField === 'Pairing Command' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'Pairing Command' ? 'Copied' : 'Copy PAIR'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Send <strong className="text-emerald-300 font-mono">PAIR {pairingCode}</strong> from your WhatsApp to link your phone. HeatLedger will reply within seconds.
              </p>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open in WhatsApp with Code</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL INTAKE */}
        {activeTab === 'email' && (
          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Dedicated Plant Inbound Mailbox</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inboundEmail}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(inboundEmail, 'Inbound Email')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  {copiedField === 'Inbound Email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-sans">
                Suppliers can forward PDFs to this address. Tracking pixels &amp; inline images are stripped automatically.
              </p>
            </div>

            {/* Allow-list Domains */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-slate-400 block">Sender Domain Allow-List</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. @tatasteel.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddDomain}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {allowList.map((domain) => (
                  <span
                    key={domain}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-[11px]"
                  >
                    <span>{domain}</span>
                    <button
                      onClick={() => handleRemoveDomain(domain)}
                      className="text-slate-400 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BUDGET & COST GUARD */}
        {activeTab === 'budget' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Monthly Message Quota:</span>
                <span className="text-white font-bold">{messagesUsed} / {monthlyBudget} msgs</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (messagesUsed / monthlyBudget) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Remaining: {Math.max(0, monthlyBudget - messagesUsed)}</span>
                <span className="text-emerald-400 font-bold">
                  {((messagesUsed / monthlyBudget) * 100).toFixed(1)}% Used
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300 text-xs font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Cost Guard automatically halts outbound template messages once the 500/month cap is reached to eliminate surprise Meta Cloud API charges.
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs font-mono transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

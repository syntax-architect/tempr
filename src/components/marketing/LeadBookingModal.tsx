import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Loader2,
  WifiOff,
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface LeadBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadBookingModal: React.FC<LeadBookingModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlyContainers, setMonthlyContainers] = useState<number>(2);
  const [notes, setNotes] = useState('');

  // Honeypot spam trap (must remain empty for human submission)
  const [website, setWebsite] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isOfflineQueued, setIsOfflineQueued] = useState(false);

  // Lock background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsSuccess(false);
      setErrorMsg('');
      setIsOfflineQueued(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !company.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const payload = {
      name,
      email,
      company,
      phone,
      monthly_containers: monthlyContainers,
      notes,
      website, // Honeypot field
    };

    // Offline awareness
    if (!navigator.onLine) {
      try {
        const queued = JSON.parse(localStorage.getItem('hl_queued_leads') || '[]');
        queued.push({ ...payload, queued_at: new Date().toISOString() });
        localStorage.setItem('hl_queued_leads', JSON.stringify(queued));
        setIsOfflineQueued(true);
        setIsSuccess(true);
      } catch {
        setErrorMsg('Network offline. Please try again when reconnected.');
      }
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error(
            'Too many requests. Please wait a few minutes before submitting another audit.'
          );
        }
        throw new Error(`Submission error: ${res.statusText}`);
      }

      setIsSuccess(true);
    } catch (err: any) {
      // Fallback offline queue on network failure
      try {
        const queued = JSON.parse(localStorage.getItem('hl_queued_leads') || '[]');
        queued.push({ ...payload, queued_at: new Date().toISOString() });
        localStorage.setItem('hl_queued_leads', JSON.stringify(queued));
        setIsOfflineQueued(true);
        setIsSuccess(true);
      } catch {
        setErrorMsg(err.message || 'Failed to submit request.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Book a Free Shipment Audit</h3>
              <p className="text-xs text-slate-400">
                100% confidential. Zero-data-retention guarantee.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">
                {isOfflineQueued ? 'Audit Request Saved Offline!' : 'Audit Request Confirmed!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                {isOfflineQueued ? (
                  <>
                    <span className="flex items-center justify-center gap-1 text-amber-400 font-mono mb-1">
                      <WifiOff className="w-3.5 h-3.5" />
                      Saved locally in browser offline queue
                    </span>
                    Your request has been securely cached and will automatically sync when your
                    connection restores.
                  </>
                ) : (
                  <>
                    Our metallurgical compliance engineer will review your mill certificate and
                    contact you at <strong className="text-white">{email}</strong> within 4 business
                    hours with your preliminary CBAM savings forecast.
                  </>
                )}
              </p>

              <div className="pt-4 flex justify-center">
                <Button variant="primary" size="md" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Honeypot hidden input */}
              <div className="hidden" aria-hidden="true">
                <label>Do not fill this</label>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">
                    Your Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">
                    Company Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Forgings Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">
                    Work Email <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="r.sharma@apexforgings.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">
                  Approx. Monthly EU Export Containers (25t FCL)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 5, 10, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMonthlyContainers(num)}
                      className={`flex-1 py-2 rounded-lg border text-center transition-all ${
                        monthlyContainers === num
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {num} {num === 20 ? '+' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">
                  Notes / Primary CN Codes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 7307 9100 flanges using SAIL and Tata raw material heats"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isLoading}
                  className="w-full justify-center min-h-[44px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Confidential Audit Request</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Data-Retention: Certificates never used for AI training</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

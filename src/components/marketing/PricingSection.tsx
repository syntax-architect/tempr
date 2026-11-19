import React, { useState } from 'react';
import { Check, Zap, Tag, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PRICING_CONFIG, PricingPlan } from '../../config/pricing';

export interface PricingSectionProps {
  onSelectPlan: (planId: string) => void;
  onOpenBookingModal: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  onOpenBookingModal,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPct: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const found = PRICING_CONFIG.coupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
    );
    if (found) {
      setAppliedCoupon({ code: found.code, discountPct: found.discountPct });
    } else {
      setCouponError('Invalid coupon code. Try EEPC_INDIA_20 or HOWRAH_MSME');
      setAppliedCoupon(null);
    }
  };

  const calculateDisplayPrice = (plan: PricingPlan) => {
    const raw = billingCycle === 'annual' ? plan.priceAnnualInr / 12 : plan.priceMonthlyInr;
    if (!appliedCoupon) return Math.round(raw);
    const discounted = raw * (1 - appliedCoupon.discountPct / 100);
    return Math.round(discounted);
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-[#0A0F1D] border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-4">
            <Tag className="w-3.5 h-3.5" />
            <span>Industrial Packaging &amp; Indian GST</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Predictable Factory Compliance Licensing
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Transparent pricing for steel mills, foundries, and trade consultants. Billed in INR with official GST Tax Invoices.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`py-2 px-4 rounded-lg font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual Billing · Save ~17%
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`py-2 px-4 rounded-lg font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
          </div>
        </motion.div>

        {/* Coupon Bar */}
        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              placeholder="Promo coupon (e.g. EEPC_INDIA_20)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 uppercase font-mono focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-colors"
            >
              Apply
            </button>
          </form>
          {appliedCoupon && (
            <p className="mt-2 text-xs text-emerald-400 font-mono text-center">
              ✓ Applied: {appliedCoupon.code} ({appliedCoupon.discountPct}% Discount)
            </p>
          )}
          {couponError && (
            <p className="mt-2 text-xs text-rose-400 font-mono text-center">{couponError}</p>
          )}
        </div>

        {/* 4 Plans Grid: 3 Tiers + Consultant */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_CONFIG.plans.map((plan) => {
            const displayMonthly = calculateDisplayPrice(plan);
            return (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl flex flex-col justify-between transition-all relative ${
                  plan.highlighted
                    ? 'bg-slate-900/95 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {plan.badge && (
                    <span className="inline-block text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-3">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-4 h-10 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mb-4 pb-4 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                        ₹{displayMonthly.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">/month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Billed annually (₹{(displayMonthly * 12).toLocaleString('en-IN')}/yr + 18% GST)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => {
                      if (plan.tier === 'enterprise') {
                        onOpenBookingModal();
                      } else {
                        onSelectPlan(plan.id);
                      }
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                      plan.highlighted
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>{plan.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* GST Statutory Disclaimer */}
        <div className="mt-12 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto text-xs text-slate-400 font-mono">
          <p>
            Service Accounting Code (SAC): <strong>{PRICING_CONFIG.sacCode}</strong> ({PRICING_CONFIG.sacDescription}).
            Subject to statutory <strong>{PRICING_CONFIG.gstRatePct}% Indian GST</strong>. Formal B2B Tax Invoices with GSTIN matching issued on checkout.
          </p>
        </div>
      </div>
    </section>
  );
};

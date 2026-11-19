import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingDown,
  Clock,
  Check,
  ArrowRight,
  Zap,
  Building,
  Coins,
  ShieldCheck,
  FileCode,
  Scale,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '../effects/AnimatedNumber';

interface RoiCalculatorProps {
  onSelectPlan: (planName: string) => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onSelectPlan }) => {
  const [tonnage, setTonnage] = useState<number>(200);
  const [containers, setContainers] = useState<number>(8);
  const [euEtsPrice, setEuEtsPrice] = useState<number>(75.36);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const calculations = useMemo(() => {
    // Sourced defaults: Hot rolled bar (CN 7214) default 2.65 tCO2e/t + 10% markup (2026) = 2.915 vs 1.78
    const actualEmission = 1.78;
    const defaultWithMarkup = 2.915; // Official 2026 default baseline with 10% markup
    const emissionSavedPerTonne = Math.max(0, defaultWithMarkup - actualEmission);
    const totalCarbonSavedTonnes = tonnage * emissionSavedPerTonne;
    const euroTaxSaved = totalCarbonSavedTonnes * euEtsPrice;
    const hoursSaved = Math.round(containers * 3.5);
    const inrValueSaved = Math.round(euroTaxSaved * 90.5);

    return {
      euroTaxSaved: Math.round(euroTaxSaved),
      inrValueSaved,
      hoursSaved,
      totalCarbonSavedTonnes: Math.round(totalCarbonSavedTonnes),
    };
  }, [tonnage, containers, euEtsPrice]);

  return (
    <section
      id="roi-calculator"
      className="py-20 sm:py-24 lg:py-28 bg-[#0C1425] border-b border-slate-700/60 relative overflow-hidden"
    >
      {/* Background Lighting Accents */}
      <div className="absolute top-1/4 -left-36 w-[650px] h-[500px] bg-emerald-500/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 -right-36 w-[600px] h-[500px] bg-blue-600/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-tech-grid-bright opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Motion Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-mono mb-4 shadow-sm">
            <Calculator className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wide">Interactive Financial Model</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] leading-tight">
            Calculate Your European Buyer's Cost Difference
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            European steel importers face a 10% to 30% markup under Implementing Regulation (EU)
            2025/2621 if relying on default values. Estimate your commercial cost difference versus
            default values.
          </p>
        </motion.div>

        {/* Sliders & Live Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Sliders Input Column */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 bg-slate-850/90 rounded-2xl border border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Factory Monthly Export Parameters</span>
            </h3>

            {/* Tonnage Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-slate-200 font-semibold">
                  Monthly Export Tonnage to EU/UK:
                </label>
                <span className="text-emerald-300 font-extrabold text-sm bg-slate-900 px-3 py-1 rounded-md border border-slate-700 shadow-inner">
                  {tonnage.toLocaleString()} MT
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={tonnage}
                onChange={(e) => setTonnage(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-slate-700"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 font-medium">
                <span>20 MT (1 FCL)</span>
                <span>500 MT</span>
                <span>1,000 MT (Primary Mill)</span>
              </div>
            </div>

            {/* Containers Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-slate-200 font-semibold">
                  Monthly Export Containers (20ft/40ft):
                </label>
                <span className="text-amber-300 font-extrabold text-sm bg-slate-900 px-3 py-1 rounded-md border border-slate-700 shadow-inner">
                  {containers} Containers
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={containers}
                onChange={(e) => setContainers(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-700"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 font-medium">
                <span>1 Container</span>
                <span>20 Containers</span>
                <span>40 Containers</span>
              </div>
            </div>

            {/* ETS Carbon Benchmark */}
            <div className="pt-4 border-t border-slate-750 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-medium">EU ETS Carbon Benchmark Price:</span>
              <span className="text-white font-bold bg-slate-900 px-3 py-1 rounded-md border border-slate-700">
                €{euEtsPrice} / tCO₂e
              </span>
            </div>
          </motion.div>

          {/* Live Financial Outputs Column */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 bg-gradient-to-br from-slate-850 via-slate-850 to-emerald-950/40 rounded-2xl border border-emerald-500/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                Net Monthly Commercial Advantage
              </span>
              <h3 className="text-xl font-bold text-white mb-6">Direct Landed Cost Reduction</h3>

              <div className="space-y-4">
                {/* Euro Cost Difference */}
                <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-750 shadow-inner">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                      Estimated Cost Difference vs Official Defaults:
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                      Estimate for planning
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-mono tracking-tight flex items-baseline drop-shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                      €<AnimatedNumber value={calculations.euroTaxSaved} duration={0.6} />
                    </span>
                    <span className="text-xs text-slate-300 font-mono font-medium">
                      / month (~₹
                      <AnimatedNumber
                        value={calculations.inrValueSaved / 100000}
                        decimals={2}
                        duration={0.6}
                      />{' '}
                      Lakhs)
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-200">
                    Estimated landed difference of{' '}
                    <strong className="text-emerald-300">
                      €{(calculations.euroTaxSaved / tonnage).toFixed(0)}/MT
                    </strong>{' '}
                    versus official default values.
                  </p>
                </div>

                {/* Engineering Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-750">
                    <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
                      QA Engineering Time:
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-xl font-bold font-mono text-white">
                        <AnimatedNumber
                          value={calculations.hoursSaved}
                          duration={0.5}
                          suffix=" hrs"
                        />
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">Saved every month</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-750">
                    <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
                      Carbon Defended:
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                      <span className="text-xl font-bold font-mono text-white">
                        <AnimatedNumber
                          value={calculations.totalCarbonSavedTonnes}
                          duration={0.5}
                          suffix=" t"
                        />
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      tCO₂e difference vs default
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-750 text-xs font-mono text-slate-300">
              <span className="text-amber-400 font-bold block mb-1">Mathematical Formula (Estimate):</span>
              <code>(Default Emission Factor - Actual Verified SEE) × Monthly Tonnage × EU ETS Benchmark Price (€{euEtsPrice}/tCO₂e)</code>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-750 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold">
                ESTIMATE ONLY
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Deterministic Calculation Model</span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Enterprise Pricing Architecture */}
        <div id="pricing" className="pt-8 border-t border-slate-750">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-mono mb-4 shadow-sm">
              <Coins className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wide">Transparent Industrial Licensing</span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] leading-tight">
              Predictable Exporter Packaging
            </h3>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Zero enterprise lock-in. Deploy the complete Single-Plant Operating System or purchase
              on-demand container compliance credits for immediate vessel clearance.
            </p>
          </motion.div>

          {/* Clean 2-Tier Structured Packaging */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* TIER 1: Single Factory Plant OS */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-850/95 border-2 border-emerald-400 shadow-glow-emerald flex flex-col justify-between relative backdrop-blur-xl">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono uppercase text-emerald-300 font-bold px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/40">
                    Factory Operating System
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    Unlimited Monthly Shipments
                  </span>
                </div>

                <h4 className="text-2xl font-bold text-white">Single-Plant Operating System</h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Full shop-floor automation for active steel pipe, flange, fitting, and fastener
                  manufacturers. Unlimited scale with zero per-container metering.
                </p>

                {/* Billing Cycle Toggle */}
                <div className="mt-6 flex items-center justify-center p-1 rounded-xl bg-slate-900 border border-slate-750 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all text-center ${
                      billingCycle === 'annual'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Annual (₹8,333/mo) · Save ₹20,000
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all text-center ${
                      billingCycle === 'monthly'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Monthly (₹9,999/mo)
                  </button>
                </div>

                {/* Price Display */}
                <div className="mt-4 mb-6 p-5 rounded-xl bg-slate-900 border border-slate-750 shadow-inner">
                  {billingCycle === 'annual' ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold font-mono text-emerald-300">
                          ₹8,333
                        </span>
                        <span className="text-xs text-slate-400 font-mono">/ month</span>
                        <span className="text-xs text-slate-500 line-through font-mono ml-auto">
                          ₹1,19,988
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-300 mt-1 flex justify-between">
                        <span>Billed ₹99,999 annually</span>
                        <span className="text-amber-400 font-bold">2 Months Free</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold font-mono text-emerald-300">
                          ₹9,999
                        </span>
                        <span className="text-xs text-slate-400 font-mono">/ month</span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-1">
                        Billed monthly with zero lock-in
                      </div>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white font-semibold">
                        Unlimited 3.1 MTC Vision extractions:
                      </strong>{' '}
                      Optical spectrometry processing from SAIL, Tata Steel, JSW, and JSPL
                      certificates.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white font-semibold">
                        Anti-Phantom Mass-Balance Ledger:
                      </strong>{' '}
                      Strict PostgreSQL database constraint prevents reusing upstream heat quota
                      across multiple lots.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white font-semibold">
                        Authorized Sign-off Queue:
                      </strong>{' '}
                      Timestamped digital signature and official factory stamp for Works QA
                      Managers.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white font-semibold">
                        Full EU/UK CBAM XML generator:
                      </strong>{' '}
                      One-click compliant communication XML accepted across Rotterdam, Hamburg, and
                      Genoa customs portals.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      Multi-seat plant access for QA Managers, Dispatch Clerks, and Export
                      Directors.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-750">
                <button
                  onClick={() => onSelectPlan('Single-Plant OS')}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                >
                  Deploy Plant OS {billingCycle === 'annual' ? '(₹99,999/yr)' : '(₹9,999/mo)'}
                </button>
              </div>
            </div>

            {/* TIER 2: FastTag Container Compliance Pack */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-850/90 border border-slate-700/80 hover:border-slate-600 flex flex-col justify-between shadow-xl backdrop-blur-xl">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono uppercase text-blue-300 font-bold px-3 py-1 rounded bg-blue-500/20 border border-blue-500/30">
                    On-Demand FastTag
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-medium">
                    Credits Valid for 12 Months
                  </span>
                </div>

                <h4 className="text-2xl font-bold text-white">FastTag Compliance Pack</h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Ideal for seasonal exporters shipping 1 to 3 containers per month, or for
                  completing a single urgent container audit without a monthly software
                  subscription.
                </p>

                {/* Pricing Options */}
                <div className="mt-6 mb-6 grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-750">
                    <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
                      5-Container Pack
                    </span>
                    <span className="text-2xl font-bold font-mono text-blue-300 block mt-1">
                      ₹12,495
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      ₹2,499 / container
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-750">
                    <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
                      Single Fast Audit
                    </span>
                    <span className="text-2xl font-bold font-mono text-white block mt-1">
                      ₹4,999
                    </span>
                    <span className="text-xs font-mono text-slate-400">1 Urgent Shipment</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white font-semibold">
                        Zero recurring commitment:
                      </strong>{' '}
                      Burn credits on-demand; credits never expire during the 12-month period.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white font-semibold">
                        Complete Compliance Bundles:
                      </strong>{' '}
                      Signed EN 10204 Clause 6 PDFs, Melt-and-Pour origin declarations, and official
                      EU CBAM XML files.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white font-semibold">
                        Watermarked draft preview for ₹0:
                      </strong>{' '}
                      Inspect extraction accuracy and metallurgy compliance before paying.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      100% credited back toward your Single-Plant OS subscription if you upgrade
                      within 60 days.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      1-on-1 customs declarant review call with metallurgical compliance specialist.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-750">
                <button
                  onClick={() => onSelectPlan('FastTag Pack')}
                  className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs uppercase tracking-wider transition-all border border-slate-700 shadow-md"
                >
                  Activate FastTag Pack (₹12,495)
                </button>
              </div>
            </div>
          </div>

          {/* Industrial Capability Specification Table */}
          <div className="rounded-2xl bg-slate-850/90 border border-slate-700/80 overflow-hidden shadow-xl mb-12 backdrop-blur-xl">
            <div className="p-5 border-b border-slate-750 bg-slate-900/60">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                Detailed Capability &amp; Compliance Matrix
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-750 text-slate-300 font-mono">
                    <th className="py-3.5 px-6 font-semibold">Compliance Feature</th>
                    <th className="py-3.5 px-6 font-semibold">FastTag Credit Pack</th>
                    <th className="py-3.5 px-6 font-semibold">Single-Plant OS</th>
                    <th className="py-3.5 px-6 font-semibold">Multi-Plant Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-750 text-slate-200">
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-white">
                      EN 10204 3.1 OCR Extractions
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-300">5 Shipments</td>
                    <td className="py-3.5 px-6 font-mono text-emerald-400 font-bold">Unlimited</td>
                    <td className="py-3.5 px-6 font-mono text-emerald-400 font-bold">Unlimited</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-white">
                      Clause 6 Immutable Annex A Lock
                    </td>
                    <td className="py-3.5 px-6">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </td>
                    <td className="py-3.5 px-6">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </td>
                    <td className="py-3.5 px-6">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-white">
                      Anti-Phantom Mass Balance Ledger
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-300">Per container</td>
                    <td className="py-3.5 px-6 font-mono text-emerald-400 font-bold">
                      Plant-Wide PostgreSQL
                    </td>
                    <td className="py-3.5 px-6 font-mono text-emerald-400 font-bold">
                      Multi-Site SAP/ERP
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-white">
                      EU CBAM Communication XML
                    </td>
                    <td className="py-3.5 px-6">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </td>
                    <td className="py-3.5 px-6">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </td>
                    <td className="py-3.5 px-6">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-white">
                      Authorized Inspector Digital Stamp
                    </td>
                    <td className="py-3.5 px-6">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </td>
                    <td className="py-3.5 px-6">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </td>
                    <td className="py-3.5 px-6">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-white">
                      Multi-Plant Inter-Site Routing
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">—</td>
                    <td className="py-3.5 px-6 text-slate-400">—</td>
                    <td className="py-3.5 px-6">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Enterprise Support Callout */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-850/90 border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Building className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">
                  Multi-Plant Conglomerate or Merchant Trading House?
                </h5>
                <p className="text-xs text-slate-300 mt-1">
                  Custom SAP &amp; ERP mass-balance API integration, multi-supplier upstream heat
                  portals, and multi-site Liluah/Howrah/Dankuni routing available.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectPlan('Multi-Plant Enterprise')}
              className="whitespace-nowrap px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 font-mono text-xs font-bold transition-all border border-slate-700 hover:border-slate-500 shrink-0 shadow-md"
            >
              Contact Enterprise Team &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

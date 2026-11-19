import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'What happens if our mill test certificate does not declare the Country of Melt and Pour?',
    a: 'Under Council Regulation (EU) 2023/1214 (Article 3g), European customs authorities prohibit the import of steel processed in third countries if incorporating Russian crude steel inputs. Importers must produce mill test certificates identifying the country where the crude steel was melted and poured. If missing, shipments are impounded at port of entry until conclusive origin documentation is provided.',
  },
  {
    q: 'Can our factory re-type mill test certificates onto our own company letterhead?',
    a: 'No. European Standard EN 10204:2004 Clause 6 explicitly specifies that intermediaries and fabricators must pass on inspection certificates without any alteration to the original document. HeatLedger AI preserves the original upstream mill certificate byte-for-byte, generating a signed cover sheet and an immutable SHA-256 cryptographic linkage.',
  },
  {
    q: 'How does HeatLedger AI calculate CBAM specific embedded emissions (SEE)?',
    a: 'HeatLedger implements the exact deterministic formulas established in Commission Implementing Regulation (EU) 2023/1773 and Regulation (EU) 2023/956 Annex IV. It accounts for direct emissions from fuel combustion, indirect emissions from electricity consumption, and precursor carbon intensities across production routes (BF-BOF or DRI-EAF) with a complete mathematical audit trace.',
  },
  {
    q: 'What are the statutory penalty markups on CBAM default values?',
    a: 'Under Commission Implementing Regulation (EU) 2025/2621, default values for embedded emissions are subject to progressive statutory penalty markups: 0% in 2026, +10% in 2027, and +20% in 2028. Relying on default values substantially increases the carbon certificate cost European buyers must pay, creating a strong commercial incentive for actual verified data.',
  },
  {
    q: 'Does HeatLedger AI replace our third-party CBAM verification auditor?',
    a: 'No. HeatLedger AI is an industrial compliance operating system that organizes, reconciles, and calculates your carbon data into audit-ready packages. Final CBAM declarations submitted to the European Commission transitional registry or definitive registry must be verified by an accredited independent verifier as specified under Article 8 of Regulation (EU) 2023/956.',
  },
  {
    q: 'Can shop-floor operators use HeatLedger without an internet connection in the plant?',
    a: 'Yes. The HeatLedger mobile application works as an installable Progressive Web App (PWA). Floor staff can capture certificates with phone cameras in noisy or low-signal workshop areas. Captures are queued securely in local IndexedDB storage and automatically upload when connectivity is restored.',
  },
  {
    q: 'How are subscription payments and Indian GST handled?',
    a: 'HeatLedger AI is billed under Service Accounting Code (SAC) 998313 (Information Technology Software Services) with statutory 18.0% Indian GST. Businesses enter their GSTIN during checkout to receive automatic CGST/SGST (for West Bengal) or IGST tax invoices for input tax credit (ITC) reconciliation.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // Schema.org FAQPage JSON-LD
  useEffect(() => {
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-jsonld';
    script.text = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('faq-jsonld');
      if (el) el.remove();
    };
  }, []);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#0B1120] border-b border-slate-800 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Statutory &amp; Technical Clarifications</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Answers to common compliance, legal, and operational questions regarding EU CBAM and EN 10204.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-emerald-400 transition-colors focus:outline-none"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

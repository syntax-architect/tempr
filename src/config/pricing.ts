/**
 * HEATLEDGER AI: Pricing Configuration
 * Prompt D7 / B9: 3 Commercial SaaS Tiers + Consultant License
 * Service Accounting Code (SAC): 998313 (Information technology software services)
 * Statutory GST: 18.0%
 */

export interface PricingPlan {
  id: string;
  name: string;
  tier: 'starter' | 'growth' | 'enterprise' | 'consultant';
  badge?: string;
  priceMonthlyInr: number;
  priceAnnualInr: number;
  certificateLimitMonthly: number | 'Unlimited';
  maxPlants: number | 'Unlimited';
  maxUsers: number | 'Unlimited';
  description: string;
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
}

export interface CouponCode {
  code: string;
  discountPct: number;
  description: string;
}

export const PRICING_CONFIG = {
  sacCode: '998313',
  sacDescription: 'Information technology and software services',
  gstRatePct: 18.0,
  currency: 'INR',
  plans: [
    {
      id: 'EXPORTER_STARTER',
      name: 'Exporter Starter',
      tier: 'starter',
      priceMonthlyInr: 9999,
      priceAnnualInr: 99990,
      certificateLimitMonthly: 50,
      maxPlants: 1,
      maxUsers: 2,
      description: 'Essential compliance automation for single-plant steel exporters and casting foundries.',
      features: [
        'Up to 50 certificates per month',
        'Deterministic Vector OCR extraction',
        'Chemical & mechanical grade verification',
        'Untouched EN 10204 Clause 6 original locking',
        'DRAFT watermarked audit packages',
        'Standard email support',
      ],
      ctaLabel: 'Start Free Shipment Audit',
      highlighted: false,
    },
    {
      id: 'GROWTH_MULTI_PLANT',
      name: 'Multi-Plant Growth',
      tier: 'growth',
      badge: 'MOST POPULAR',
      priceMonthlyInr: 19999,
      priceAnnualInr: 199990,
      certificateLimitMonthly: 200,
      maxPlants: 3,
      maxUsers: 10,
      description: 'Full-featured compliance operating system for expanding exporters with multiple shop floors.',
      features: [
        'Up to 200 certificates per month',
        'All 3 shop-floor plants included',
        'Ed25519 cryptographic digital signing',
        'Mass-balance anti-phantom ledger',
        'Precursor & supplier emissions portal',
        'Full CBAM SEE calculation trace & draft XML',
        'Priority WhatsApp & phone onboarding',
      ],
      ctaLabel: 'Deploy Growth OS',
      highlighted: true,
    },
    {
      id: 'ENTERPRISE_CUSTOM',
      name: 'Industrial Enterprise',
      tier: 'enterprise',
      priceMonthlyInr: 49999,
      priceAnnualInr: 499990,
      certificateLimitMonthly: 'Unlimited',
      maxPlants: 'Unlimited',
      maxUsers: 'Unlimited',
      description: 'Dedicated infrastructure, custom ERP integration, and unlimited container throughput for large steel mills.',
      features: [
        'Unlimited certificates & containers',
        'Unlimited production plants & users',
        'SAP / Oracle / ERP database connectors',
        'Dedicated EU verification auditor support',
        'Custom sovereign cloud or on-prem deployment',
        'Contractual 99.9% uptime SLA',
        'Custom legal & trade advisory review',
      ],
      ctaLabel: 'Contact Sales',
      highlighted: false,
    },
    {
      id: 'CONSULTANT_AUDITOR',
      name: 'Consultant & Verifier',
      tier: 'consultant',
      badge: 'FOR AGENCIES',
      priceMonthlyInr: 14999,
      priceAnnualInr: 149990,
      certificateLimitMonthly: 300,
      maxPlants: 'Unlimited',
      maxUsers: 5,
      description: 'Specialized toolkit for trade consultants, customs brokers, and third-party CBAM auditors managing multiple exporters.',
      features: [
        'Multi-client organization switcher',
        'White-labeled / co-branded verification packages',
        'Batch certificate verification tool',
        'Client document intake links without login',
        'Audit-ready proof export for European declarants',
        'Dedicated compliance helpline',
      ],
      ctaLabel: 'Get Consultant Pack',
      highlighted: false,
    },
  ] as PricingPlan[],

  coupons: [
    {
      code: 'EEPC_INDIA_20',
      discountPct: 20.0,
      description: 'Engineering Export Promotion Council (EEPC) Member 20% Subsidy',
    },
    {
      code: 'HOWRAH_MSME',
      discountPct: 25.0,
      description: 'Howrah Foundry & Forging Cluster 25% Onboarding Incentive',
    },
    {
      code: 'CBAM2026',
      discountPct: 15.0,
      description: 'Early Definitive Period 15% Onboarding Discount',
    },
  ] as CouponCode[],
};

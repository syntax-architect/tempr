/**
 * HeatLedger AI: Canonical Regulatory Dates & Timelines
 * Sourced directly from European Commission and UK HMRC publications.
 * Last Verified: 19 November 2026
 */

export interface RegulatoryMilestone {
  id: string;
  jurisdiction: 'EU' | 'UK';
  title: string;
  effectiveDate: string;
  summary: string;
  legalSource: string;
  sourceUrl: string;
  lastVerified: string;
  status: 'IN_FORCE' | 'UPCOMING' | 'PROPOSED';
}

export const REGULATORY_MILESTONES: RegulatoryMilestone[] = [
  {
    id: 'EU_CBAM_DEFINITIVE_START',
    jurisdiction: 'EU',
    title: 'EU CBAM Definitive Regime In Force',
    effectiveDate: '2026-01-01',
    summary:
      'Transitional period ends; actual verified emissions and default markup rules enter force.',
    legalSource: 'Regulation (EU) 2023/956, Article 36',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R0956',
    lastVerified: '2026-11-19',
    status: 'IN_FORCE',
  },
  {
    id: 'EU_MELT_POUR_EVIDENCE_APPLIES',
    jurisdiction: 'EU',
    title: 'EU Melt-and-Pour Mandatory Origin Attestation Rules Apply',
    effectiveDate: '2026-10-01',
    summary:
      'Importers must provide evidence of country of melt and pour on customs declarations for steel goods.',
    legalSource: 'Commission Implementing Regulation (EU) 2026/1963',
    sourceUrl: 'https://taxation-customs.ec.europa.eu/customs-4/rules-origin_en',
    lastVerified: '2026-11-19',
    status: 'UPCOMING',
  },
  {
    id: 'EU_NON_MTC_CUTOFF',
    jurisdiction: 'EU',
    title: 'Cutoff for Non-MTC Documents Under Melt-and-Pour Rules',
    effectiveDate: '2027-10-01',
    summary:
      'Other trade documents stop being accepted on their own as sole proof of melt and pour without mill test certificates.',
    legalSource: 'Commission Guidance on Origin Documentation for Steel Imports',
    sourceUrl: 'https://taxation-customs.ec.europa.eu/customs-4/rules-origin_en',
    lastVerified: '2026-11-19',
    status: 'UPCOMING',
  },
  {
    id: 'EU_CBAM_CERT_SALES',
    jurisdiction: 'EU',
    title: 'Sale of EU CBAM Certificates Begins',
    effectiveDate: '2027-02-01',
    summary:
      'European Commission commences sale of CBAM certificates to authorized declarants via common central platform.',
    legalSource: 'Regulation (EU) 2023/956, Article 20',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R0956',
    lastVerified: '2026-11-19',
    status: 'UPCOMING',
  },
  {
    id: 'EU_CBAM_FIRST_ANNUAL_DECLARATION',
    jurisdiction: 'EU',
    title: 'First Annual CBAM Declaration Due',
    effectiveDate: '2027-09-30',
    summary:
      'First annual declaration and surrender of certificates for goods imported during calendar year 2026.',
    legalSource: 'Regulation (EU) 2023/956, Article 6',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R0956',
    lastVerified: '2026-11-19',
    status: 'UPCOMING',
  },
  {
    id: 'UK_CBAM_START',
    jurisdiction: 'UK',
    title: 'UK CBAM Enactment',
    effectiveDate: '2027-01-01',
    summary:
      'United Kingdom Carbon Border Adjustment Mechanism enters into force for imported iron, steel, and aluminum.',
    legalSource: 'UK HM Treasury Consultation Outcome (March 2024)',
    sourceUrl:
      'https://www.gov.uk/government/consultations/introduction-of-a-uk-carbon-border-adjustment-mechanism-cbam',
    lastVerified: '2026-11-19',
    status: 'UPCOMING',
  },
  {
    id: 'UK_MELT_POUR_MANDATORY',
    jurisdiction: 'UK',
    title: 'UK Mandatory Melt and Pour Country Reporting',
    effectiveDate: '2027-07-01',
    summary:
      'Voluntary reporting from 1 April 2027; becomes mandatory under UK Customs Declaration Service (CDS) from 1 July 2027.',
    legalSource: 'UK Department for Business & Trade Notice',
    sourceUrl: 'https://www.gov.uk/guidance/importing-steel-sanctions-and-origin',
    lastVerified: '2026-11-19',
    status: 'UPCOMING',
  },
];

export const STANDARD_DISCLAIMER =
  'HeatLedger supports compliance preparation. It is not legal advice and not an accredited verification body.';

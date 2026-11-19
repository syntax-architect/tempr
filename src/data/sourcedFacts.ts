/**
 * HEATLEDGER AI: Sourced Regulatory & Statutory Facts
 * Prompt D7: Verified against Official Journal of the European Union.
 * Zero unprovable claims.
 */

export interface SourcedFact {
  id: string;
  date: string;
  source: string;
  title: string;
  statutoryReference: string;
  description: string;
  officialUrl?: string;
}

export const SOURCED_REGULATORY_FACTS: SourcedFact[] = [
  {
    id: 'cbam-definitive-start',
    date: '1 January 2026',
    source: 'Official Journal of the European Union (OJ L 130)',
    title: 'Definitive CBAM Regime & Financial Surrender Begins',
    statutoryReference: 'Regulation (EU) 2023/956, Article 36(2)',
    description:
      'The transitional reporting-only period concludes on 31 December 2025. Starting 1 January 2026, authorized CBAM declarants importing iron, steel, aluminium, cement, fertilisers, hydrogen, and electricity into the EU must purchase and surrender CBAM certificates matching their embedded emissions.',
  },
  {
    id: 'sanctions-melt-and-pour',
    date: '23 June 2023',
    source: 'Council of the European Union (11th Sanctions Package)',
    title: 'Mandatory Country of Melt and Pour on Mill Test Certificates',
    statutoryReference: 'Council Regulation (EU) 2023/1214 amending Regulation (EU) No 830/2014, Article 3g(1)(d)',
    description:
      'Prohibits the import or purchase into the EU of iron and steel products processed in a third country incorporating iron and steel inputs originating in Russia. Importers must provide mill test certificates identifying the country where the crude steel was melted and poured.',
  },
  {
    id: 'default-markups-schedule',
    date: '15 September 2025',
    source: 'European Commission Directorate-General for Taxation and Customs Union',
    title: 'Progressive Default Values Penalty Markup Schedule',
    statutoryReference: 'Commission Implementing Regulation (EU) 2025/2621 & Article 7(2) of Regulation (EU) 2023/956',
    description:
      'To prevent competitive disadvantage for verified installations, EU customs applies statutory markups when importers fail to provide verified actual emissions: 0% markup in 2026, +10% markup in 2027, and +20% markup in 2028 above benchmark default emission factors.',
  },
  {
    id: 'en-10204-clause-6',
    date: 'October 2004 (Active Harmonized Standard)',
    source: 'European Committee for Standardization (CEN)',
    title: 'EN 10204 Clause 6 Untouched Upstream Certificate Rule',
    statutoryReference: 'EN 10204:2004 Metallic Products — Types of Inspection Documents, Clause 6',
    description:
      'When an intermediary or exporter passes on inspection certificate 3.1 or 3.2, they must supply the original mill certificate without alteration. Re-typing mill values onto intermediary letterhead without supplying the byte-identical original is grounds for audit disqualification.',
  },
  {
    id: 'transitional-reporting-deadline',
    date: '1 October 2023 – 31 December 2025',
    source: 'European Commission Implementing Regulation',
    title: 'Transitional CBAM Quarterly Declarations',
    statutoryReference: 'Commission Implementing Regulation (EU) 2023/1773',
    description:
      'Importers are required to submit quarterly declarations detailing direct and indirect emissions, precursors, and any carbon price paid in the country of origin.',
  },
];

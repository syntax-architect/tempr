import {
  SimulatorPreset,
  CnCodeItem,
  ShipmentRecord,
  HeatInventoryItem,
  ChemicalElement,
  MetallurgicalStandardDef,
} from '../types';

/**
 * Deterministic Metallurgical Standards Dictionary matching backend/schema.sql
 */
export const METALLURGICAL_STANDARDS: Record<string, MetallurgicalStandardDef> = {
  'ASTM A105 Carbon Steel Forgings': {
    standardCode: 'ASTM A105',
    title: 'ASTM A105 Carbon Steel Forgings',
    description:
      'Standard Specification for Carbon Steel Forgings for Piping Applications (ASME B16.5)',
    cnCodes: ['7307', '7326'],
    matchingPresetId: 'preset-b',
    chemistry: {
      C: { min: 0.0, max: 0.35, unit: '%' },
      Mn: { min: 0.6, max: 1.05, unit: '%' },
      Si: { min: 0.1, max: 0.35, unit: '%' },
      P: { min: 0.0, max: 0.035, unit: '%' },
      S: { min: 0.0, max: 0.04, unit: '%' },
      Cr: { min: 0.0, max: 0.3, unit: '%' },
      Ni: { min: 0.0, max: 0.4, unit: '%' },
      Mo: { min: 0.0, max: 0.12, unit: '%' },
      CEV: { min: 0.0, max: 0.47, unit: 'IIW' },
    },
    mechanics: [
      { property: 'Tensile Strength (Rm)', requirement: '485 - 720 MPa', min: 485, max: 720 },
      { property: 'Yield Strength (0.2%)', requirement: '≥ 250 MPa', min: 250, max: 500 },
      { property: 'Elongation in 50mm', requirement: '≥ 22.0 %', min: 22.0 },
      { property: 'Hardness (Brinell)', requirement: '≤ 187 HBW', min: 137, max: 187 },
    ],
  },
  'ASTM A193 Grade B7 Alloy Fasteners': {
    standardCode: 'ASTM A193 Grade B7',
    title: 'ASTM A193 Grade B7 Alloy Fasteners',
    description:
      'High-Tensile Chromium-Molybdenum Alloy Steel Bolting for Pressure Vessels & Flanges',
    cnCodes: ['7318'],
    matchingPresetId: 'preset-c',
    chemistry: {
      C: { min: 0.37, max: 0.49, unit: '%' },
      Mn: { min: 0.65, max: 1.1, unit: '%' },
      Si: { min: 0.15, max: 0.35, unit: '%' },
      P: { min: 0.0, max: 0.035, unit: '%' },
      S: { min: 0.0, max: 0.04, unit: '%' },
      Cr: { min: 0.75, max: 1.2, unit: '%' },
      Ni: { min: 0.0, max: 0.4, unit: '%' },
      Mo: { min: 0.15, max: 0.25, unit: '%' },
      CEV: { min: 0.0, max: 0.9, unit: 'IIW' },
    },
    mechanics: [
      { property: 'Tensile Strength (Rm)', requirement: '≥ 860 MPa', min: 860, max: 1100 },
      { property: 'Yield Strength (0.2%)', requirement: '≥ 725 MPa', min: 725, max: 950 },
      { property: 'Elongation in 4D', requirement: '≥ 16.0 %', min: 16.0 },
      { property: 'Hardness (Brinell)', requirement: '220 - 321 HBW', min: 220, max: 321 },
    ],
  },
  'EN 10217-1 / ASTM A53 Welded Pipe': {
    standardCode: 'EN 10217-1 / ASTM A53',
    title: 'EN 10217-1 / ASTM A53 Welded Pipe',
    description: 'Welded Steel Tubes for Pressure Purposes & Welded Line Pipe',
    cnCodes: ['7306', '7305'],
    matchingPresetId: 'preset-a',
    chemistry: {
      C: { min: 0.0, max: 0.22, unit: '%' },
      Mn: { min: 0.9, max: 1.4, unit: '%' },
      Si: { min: 0.1, max: 0.35, unit: '%' },
      P: { min: 0.0, max: 0.03, unit: '%' },
      S: { min: 0.0, max: 0.025, unit: '%' },
      Cr: { min: 0.0, max: 0.25, unit: '%' },
      Ni: { min: 0.0, max: 0.2, unit: '%' },
      Mo: { min: 0.0, max: 0.08, unit: '%' },
      CEV: { min: 0.0, max: 0.43, unit: 'IIW' },
    },
    mechanics: [
      { property: 'Yield Strength (ReH)', requirement: '≥ 290 MPa', min: 290 },
      { property: 'Tensile Strength (Rm)', requirement: '430 - 580 MPa', min: 430, max: 580 },
      { property: 'Elongation (A5)', requirement: '≥ 21.0 %', min: 21.0 },
      { property: 'Impact Test (KV at 0°C)', requirement: '≥ 27 Joules', min: 27 },
    ],
  },
  'EN 10216-2 Alloy Steel Tubes (16Mo3)': {
    standardCode: 'EN 10216-2 16Mo3',
    title: 'EN 10216-2 Alloy Steel Tubes (16Mo3)',
    description: 'Seamless Steel Tubes for Pressure Purposes - Elevated Temperature Alloy Steel',
    cnCodes: ['7304'],
    chemistry: {
      C: { min: 0.12, max: 0.2, unit: '%' },
      Mn: { min: 0.4, max: 0.9, unit: '%' },
      Si: { min: 0.1, max: 0.35, unit: '%' },
      P: { min: 0.0, max: 0.025, unit: '%' },
      S: { min: 0.0, max: 0.015, unit: '%' },
      Cr: { min: 0.0, max: 0.3, unit: '%' },
      Ni: { min: 0.0, max: 0.3, unit: '%' },
      Mo: { min: 0.25, max: 0.35, unit: '%' },
      CEV: { min: 0.0, max: 0.45, unit: 'IIW' },
    },
    mechanics: [
      { property: 'Tensile Strength (Rm)', requirement: '450 - 600 MPa', min: 450, max: 600 },
      { property: 'Yield Strength (ReH)', requirement: '≥ 280 MPa', min: 280 },
      { property: 'Elongation (A5)', requirement: '≥ 22.0 %', min: 22.0 },
      { property: 'Hardness (Brinell)', requirement: '130 - 180 HBW', min: 130, max: 180 },
    ],
  },
  'EN 10025 S355JR Structural Steel': {
    standardCode: 'EN 10025 S355JR',
    title: 'EN 10025 S355JR Structural Steel',
    description:
      'Hot Rolled Structural Steel for Fabrications, Towers, Bridges and Engineered Structures',
    cnCodes: ['7308', '7214'],
    chemistry: {
      C: { min: 0.0, max: 0.24, unit: '%' },
      Mn: { min: 0.0, max: 1.6, unit: '%' },
      Si: { min: 0.0, max: 0.55, unit: '%' },
      P: { min: 0.0, max: 0.035, unit: '%' },
      S: { min: 0.0, max: 0.035, unit: '%' },
      Cr: { min: 0.0, max: 0.3, unit: '%' },
      Ni: { min: 0.0, max: 0.3, unit: '%' },
      Mo: { min: 0.0, max: 0.1, unit: '%' },
      CEV: { min: 0.0, max: 0.45, unit: 'IIW' },
    },
    mechanics: [
      { property: 'Tensile Strength (Rm)', requirement: '470 - 630 MPa', min: 470, max: 630 },
      { property: 'Yield Strength (ReH)', requirement: '≥ 355 MPa', min: 355 },
      { property: 'Elongation (A5)', requirement: '≥ 22.0 %', min: 22.0 },
      { property: 'Hardness (Brinell)', requirement: '140 - 190 HBW', min: 140, max: 190 },
    ],
  },
};

export const STANDARDS_LIST = Object.keys(METALLURGICAL_STANDARDS);

export const PRESET_MATCHING_STANDARDS: Record<string, string> = {
  'preset-a': 'EN 10217-1 / ASTM A53 Welded Pipe',
  'preset-b': 'ASTM A105 Carbon Steel Forgings',
  'preset-c': 'ASTM A193 Grade B7 Alloy Fasteners',
};

/**
 * Calculates IIW Carbon Equivalent Value:
 * CEV = C + (Mn / 6) + ((Cr + Mo + V) / 5) + ((Ni + Cu) / 15)
 */
export function calculateIIWCEV(chemistry: Record<string, number>): number {
  const c = chemistry['C'] ?? 0;
  const mn = chemistry['Mn'] ?? 0;
  const cr = chemistry['Cr'] ?? 0;
  const mo = chemistry['Mo'] ?? 0;
  const v = chemistry['V'] ?? 0;
  const ni = chemistry['Ni'] ?? 0;
  const cu = chemistry['Cu'] ?? 0;

  const cev = c + mn / 6.0 + (cr + mo + v) / 5.0 + (ni + cu) / 15.0;
  return Number(cev.toFixed(3));
}

/**
 * Deterministically re-evaluates chemical elements against a selected target standard.
 * Recalculates each element's min, max, status (PASS, FAIL_LOW, FAIL_HIGH), and dynamic IIW CEV.
 */
export function evaluateChemistryAgainstStandard(
  baseChemistry: ChemicalElement[],
  standardName: string
): ChemicalElement[] {
  const standard = METALLURGICAL_STANDARDS[standardName];
  if (!standard) return baseChemistry;

  // Extract raw values map for CEV calculation
  const rawMap: Record<string, number> = {};
  baseChemistry.forEach((el) => {
    rawMap[el.symbol] = el.measured;
  });

  const calculatedCev = calculateIIWCEV(rawMap);

  return baseChemistry.map((el) => {
    const isCev = el.symbol === 'CEV';
    const measuredVal = isCev ? calculatedCev : el.measured;
    const limit = standard.chemistry[el.symbol];

    if (!limit) {
      return {
        ...el,
        measured: measuredVal,
        status: 'PASS' as const,
      };
    }

    let status: 'PASS' | 'FAIL_LOW' | 'FAIL_HIGH' = 'PASS';
    if (measuredVal < limit.min) {
      status = 'FAIL_LOW';
    } else if (measuredVal > limit.max) {
      status = 'FAIL_HIGH';
    }

    return {
      ...el,
      measured: measuredVal,
      min: limit.min,
      max: limit.max,
      unit: limit.unit || el.unit,
      status,
    };
  });
}

/**
 * Formats the exact delta string for out-of-spec elements (e.g. "Cr: 0.04% — Below min 0.75%")
 */
export function getElementToleranceDelta(el: ChemicalElement): string {
  const isSpecial = el.symbol === 'P' || el.symbol === 'S' || el.symbol === 'CEV';
  const decimals = isSpecial ? 3 : 2;
  const measuredStr = el.measured.toFixed(decimals);
  const minStr = el.min.toFixed(decimals);
  const maxStr = el.max.toFixed(decimals);
  const unitSuffix = el.unit === '%' ? '%' : ` ${el.unit}`;

  if (el.status === 'FAIL_LOW') {
    return `${el.symbol}: ${measuredStr}${unitSuffix} — Below min ${minStr}${unitSuffix}`;
  }
  if (el.status === 'FAIL_HIGH') {
    return `${el.symbol}: ${measuredStr}${unitSuffix} — Exceeds max ${maxStr}${unitSuffix}`;
  }
  return '';
}

export const SIMULATOR_PRESETS: SimulatorPreset[] = [
  {
    id: 'preset-a',
    code: 'CN 7306',
    title: 'Welded Steel Tubes (EN 10217-1 / ASTM A53)',
    route: 'Howrah Mill → Hamburg, Germany',
    heatNumber: 'BOK-26-4910',
    mill: 'SAIL Bokaro Steel Plant',
    productType: 'Hot Rolled Carbon Steel Coil / Slit Strip',
    meltRoute: 'Basic Oxygen Furnace (BOF) / CC',
    meltCountry: 'INDIA',
    certNumber: 'BSP/MTC/2026/8841-A',
    issueDate: '12-Feb-2026',
    actualEmissions: 1.82,
    defaultEmissions: 3.15,
    tonnage: 25.0,
    euroSavings: 4980,
    chemistry: [
      {
        symbol: 'C',
        name: 'Carbon',
        measured: 0.17,
        min: 0.0,
        max: 0.22,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Mn',
        name: 'Manganese',
        measured: 1.18,
        min: 0.9,
        max: 1.4,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Si',
        name: 'Silicon',
        measured: 0.22,
        min: 0.1,
        max: 0.35,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'P',
        name: 'Phosphorus',
        measured: 0.018,
        min: 0.0,
        max: 0.03,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'S',
        name: 'Sulphur',
        measured: 0.012,
        min: 0.0,
        max: 0.025,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Cr',
        name: 'Chromium',
        measured: 0.04,
        min: 0.0,
        max: 0.25,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Ni',
        name: 'Nickel',
        measured: 0.03,
        min: 0.0,
        max: 0.2,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Mo',
        name: 'Molybdenum',
        measured: 0.01,
        min: 0.0,
        max: 0.08,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'CEV',
        name: 'Carbon Equiv.',
        measured: 0.378,
        min: 0.0,
        max: 0.43,
        unit: 'IIW',
        status: 'PASS',
      },
    ],
    mechanics: [
      {
        property: 'Yield Strength (ReH)',
        measured: '342 MPa',
        requirement: '≥ 290 MPa',
        status: 'PASS',
      },
      {
        property: 'Tensile Strength (Rm)',
        measured: '488 MPa',
        requirement: '430 - 580 MPa',
        status: 'PASS',
      },
      { property: 'Elongation (A5)', measured: '26.4 %', requirement: '≥ 21 %', status: 'PASS' },
      {
        property: 'Impact Test (KV at 0°C)',
        measured: '48 Joules',
        requirement: '≥ 27 Joules',
        status: 'PASS',
      },
    ],
    boundingBoxes: [
      {
        id: 'b1',
        label: 'Heat # & Origin',
        type: 'amber',
        coords: { x: 8, y: 19, width: 38, height: 11 },
        fieldName: 'Heat Number & Country',
        fieldValue: '#BOK-26-4910 | INDIA',
      },
      {
        id: 'b2',
        label: 'Chemical Ladle Analysis',
        type: 'cobalt',
        coords: { x: 8, y: 38, width: 84, height: 18 },
        fieldName: 'Ladle Chemistry',
        fieldValue: 'C:0.17 Mn:1.18 P:0.018 S:0.012',
      },
      {
        id: 'b3',
        label: 'Mechanical Test Suite',
        type: 'emerald',
        coords: { x: 8, y: 62, width: 84, height: 16 },
        fieldName: 'Tensile & Elongation',
        fieldValue: 'YS: 342 MPa | TS: 488 MPa | Elong: 26.4%',
      },
      {
        id: 'b4',
        label: 'EN 10204 3.1 Certification Stamp',
        type: 'emerald',
        coords: { x: 55, y: 81, width: 37, height: 13 },
        fieldName: 'Inspection Dept Seal',
        fieldValue: 'SAIL Independent QA Inspector',
      },
    ],
  },
  {
    id: 'preset-b',
    code: 'CN 7307',
    title: 'Forged Carbon Steel Flanges (ASTM A105 / ASME B16.5)',
    route: 'Liluah Forge → Rotterdam, Netherlands',
    heatNumber: 'TSJ-26-9021',
    mill: 'Tata Steel Jamshedpur',
    productType: 'Round Steel Billets & Forging Blooms',
    meltRoute: 'Blast Furnace - BOF / Ladle Refining',
    meltCountry: 'INDIA',
    certNumber: 'TSL/QA/MTC/26-9021',
    issueDate: '18-Jan-2026',
    actualEmissions: 1.76,
    defaultEmissions: 3.28,
    tonnage: 24.5,
    euroSavings: 5320,
    chemistry: [
      {
        symbol: 'C',
        name: 'Carbon',
        measured: 0.22,
        min: 0.0,
        max: 0.35,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Mn',
        name: 'Manganese',
        measured: 0.88,
        min: 0.6,
        max: 1.05,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Si',
        name: 'Silicon',
        measured: 0.25,
        min: 0.1,
        max: 0.35,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'P',
        name: 'Phosphorus',
        measured: 0.015,
        min: 0.0,
        max: 0.035,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'S',
        name: 'Sulphur',
        measured: 0.01,
        min: 0.0,
        max: 0.04,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Cr',
        name: 'Chromium',
        measured: 0.12,
        min: 0.0,
        max: 0.3,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Ni',
        name: 'Nickel',
        measured: 0.08,
        min: 0.0,
        max: 0.4,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Mo',
        name: 'Molybdenum',
        measured: 0.02,
        min: 0.0,
        max: 0.12,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'CEV',
        name: 'Carbon Equiv.',
        measured: 0.392,
        min: 0.0,
        max: 0.47,
        unit: 'IIW',
        status: 'PASS',
      },
    ],
    mechanics: [
      {
        property: 'Tensile Strength',
        measured: '512 MPa',
        requirement: '≥ 485 MPa',
        status: 'PASS',
      },
      {
        property: 'Yield Strength (0.2%)',
        measured: '310 MPa',
        requirement: '≥ 250 MPa',
        status: 'PASS',
      },
      {
        property: 'Elongation in 50mm',
        measured: '28.5 %',
        requirement: '≥ 22.0 %',
        status: 'PASS',
      },
      {
        property: 'Hardness (Brinell)',
        measured: '156 HBW',
        requirement: '≤ 187 HBW',
        status: 'PASS',
      },
    ],
    boundingBoxes: [
      {
        id: 'b1',
        label: 'Heat # & Melt-and-Pour',
        type: 'amber',
        coords: { x: 7, y: 17, width: 42, height: 12 },
        fieldName: 'Heat Number & Country',
        fieldValue: '#TSJ-26-9021 | INDIA',
      },
      {
        id: 'b2',
        label: 'OES Chemistry Grid',
        type: 'cobalt',
        coords: { x: 7, y: 36, width: 86, height: 19 },
        fieldName: 'Ladle Analysis',
        fieldValue: 'C:0.22 Mn:0.88 Si:0.25 S:0.010',
      },
      {
        id: 'b3',
        label: 'Tensile & Hardness Test',
        type: 'emerald',
        coords: { x: 7, y: 60, width: 86, height: 16 },
        fieldName: 'Mechanical Properties',
        fieldValue: 'TS: 512 MPa | YS: 310 MPa | HBW: 156',
      },
      {
        id: 'b4',
        label: 'Tata Steel ISO 17025 Seal',
        type: 'emerald',
        coords: { x: 52, y: 80, width: 41, height: 14 },
        fieldName: 'Authorized Inspection Representative',
        fieldValue: 'Tata Steel Metallurgy Lab - Jamshedpur',
      },
    ],
  },
  {
    id: 'preset-c',
    code: 'CN 7318',
    title: 'High-Tensile Stud Bolts & Fasteners (ASTM A193 Grade B7)',
    route: 'Dankuni Fasteners → Felixstowe, UK',
    heatNumber: 'JSW-26-7734',
    mill: 'JSW Steel Vijayanagar / Salem Alloy',
    productType: 'Alloy Steel Rolled Round Bar 4140 / AISI 4140',
    meltRoute: 'EAF / Ladle Degassing / Vacuum',
    meltCountry: 'INDIA',
    certNumber: 'JSW/VJN/2026/MTC-7734',
    issueDate: '24-Jan-2026',
    actualEmissions: 1.68,
    defaultEmissions: 3.1,
    tonnage: 21.0,
    euroSavings: 4210,
    chemistry: [
      {
        symbol: 'C',
        name: 'Carbon',
        measured: 0.41,
        min: 0.37,
        max: 0.49,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Mn',
        name: 'Manganese',
        measured: 0.82,
        min: 0.65,
        max: 1.1,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Si',
        name: 'Silicon',
        measured: 0.28,
        min: 0.15,
        max: 0.35,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'P',
        name: 'Phosphorus',
        measured: 0.012,
        min: 0.0,
        max: 0.035,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'S',
        name: 'Sulphur',
        measured: 0.009,
        min: 0.0,
        max: 0.04,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Cr',
        name: 'Chromium',
        measured: 0.98,
        min: 0.75,
        max: 1.2,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Ni',
        name: 'Nickel',
        measured: 0.09,
        min: 0.0,
        max: 0.25,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'Mo',
        name: 'Molybdenum',
        measured: 0.22,
        min: 0.15,
        max: 0.25,
        unit: '%',
        status: 'PASS',
      },
      {
        symbol: 'CEV',
        name: 'Carbon Equiv.',
        measured: 0.78,
        min: 0.0,
        max: 0.9,
        unit: 'IIW',
        status: 'PASS',
      },
    ],
    mechanics: [
      {
        property: 'Tensile Strength',
        measured: '915 MPa',
        requirement: '≥ 860 MPa',
        status: 'PASS',
      },
      {
        property: 'Yield Strength (0.2%)',
        measured: '775 MPa',
        requirement: '≥ 725 MPa',
        status: 'PASS',
      },
      { property: 'Elongation in 4D', measured: '18.2 %', requirement: '≥ 16.0 %', status: 'PASS' },
      {
        property: 'Reduction of Area',
        measured: '54.5 %',
        requirement: '≥ 50.0 %',
        status: 'PASS',
      },
    ],
    boundingBoxes: [
      {
        id: 'b1',
        label: 'Heat & Melt Route',
        type: 'amber',
        coords: { x: 7, y: 16, width: 44, height: 13 },
        fieldName: 'Heat Number & Country',
        fieldValue: '#JSW-26-7734 | INDIA (EAF)',
      },
      {
        id: 'b2',
        label: 'Cr-Mo Alloy Ladle Analysis',
        type: 'cobalt',
        coords: { x: 7, y: 35, width: 86, height: 20 },
        fieldName: 'Chemical Composition',
        fieldValue: 'C:0.41 Cr:0.98 Mo:0.22 Mn:0.82',
      },
      {
        id: 'b3',
        label: 'Heat Treated Mechanicals',
        type: 'emerald',
        coords: { x: 7, y: 59, width: 86, height: 17 },
        fieldName: 'Tensile & Yield Limits',
        fieldValue: 'TS: 915 MPa | YS: 775 MPa | El: 18.2%',
      },
      {
        id: 'b4',
        label: 'JSW Certified Metallurgist',
        type: 'emerald',
        coords: { x: 50, y: 80, width: 43, height: 14 },
        fieldName: 'Clause 3.1 Validation',
        fieldValue: 'JSW Steel QA & Testing Centre',
      },
    ],
  },
];

export const CN_CODES_DATA: CnCodeItem[] = [
  {
    code: '7304',
    title: 'Seamless Tubes, Pipes & Hollow Profiles (Iron/Steel)',
    category: 'Pipes & Tubes',
    euMeltPourDeadline: 'Mandatory Now (EU Oct 1, 2026 / Oct 1, 2027)',
    ukMeltPourDeadline: 'Mandatory Apr / Jul 2027',
    euCbamStatus: 'MANDATORY_NOW',
    ukCbamStatus: 'Mandatory Jan 1, 2027',
    mtcProofRequired: true,
    precursorTraceability: true,
    notes:
      'Requires original upstream seamless billet EN 10204 3.1 certificate with explicit Country of Melt and Pour stated as INDIA.',
  },
  {
    code: '7306',
    title: 'Other Tubes, Pipes & Hollow Profiles (e.g. Welded ERW)',
    category: 'Pipes & Tubes',
    euMeltPourDeadline: 'Mandatory Now (EU Oct 1, 2026 / Oct 1, 2027)',
    ukMeltPourDeadline: 'Mandatory Apr / Jul 2027',
    euCbamStatus: 'MANDATORY_NOW',
    ukCbamStatus: 'Mandatory Jan 1, 2027',
    mtcProofRequired: true,
    precursorTraceability: true,
    notes:
      'Hot rolled coil slit precursor heat numbers must be locked and mapped to each pipe batch.',
  },
  {
    code: '7305',
    title: 'Other Tubes & Pipes having circular cross-section, ext. dia > 406.4 mm',
    category: 'Pipes & Tubes',
    euMeltPourDeadline: 'Mandatory Now (EU Oct 1, 2026 / Oct 1, 2027)',
    ukMeltPourDeadline: 'Mandatory Apr / Jul 2027',
    euCbamStatus: 'MANDATORY_NOW',
    ukCbamStatus: 'Mandatory Jan 1, 2027',
    mtcProofRequired: true,
    precursorTraceability: true,
    notes:
      'Large diameter submerged arc welded pipe. Requires heavy plate upstream MTC verification.',
  },
  {
    code: '7214',
    title: 'Other Bars & Rods of Iron or Non-Alloy Steel (Forged / Hot-Rolled)',
    category: 'Bars & Rods',
    euMeltPourDeadline: 'Mandatory Now (EU Oct 1, 2026 / Oct 1, 2027)',
    ukMeltPourDeadline: 'Mandatory Apr / Jul 2027',
    euCbamStatus: 'MANDATORY_NOW',
    ukCbamStatus: 'Mandatory Jan 1, 2027',
    mtcProofRequired: true,
    precursorTraceability: true,
    notes: 'Direct mill shipment. Upstream bloom/billet heat traceability mandatory.',
  },
  {
    code: '7228',
    title: 'Other Bars & Rods of Other Alloy Steel; Hollow Drill Bars',
    category: 'Bars & Rods',
    euMeltPourDeadline: 'Mandatory Now (EU Oct 1, 2026 / Oct 1, 2027)',
    ukMeltPourDeadline: 'Mandatory Apr / Jul 2027',
    euCbamStatus: 'MANDATORY_NOW',
    ukCbamStatus: 'Mandatory Jan 1, 2027',
    mtcProofRequired: true,
    precursorTraceability: true,
    notes: 'Alloy bar stock (4140, 8620, EN24). High scrutiny on Melt and Pour proof.',
  },
  {
    code: '7307',
    title: 'Tube or Pipe Fittings (e.g. Couplings, Elbows, Sleeves, Flanges)',
    category: 'Flanges & Fittings',
    euMeltPourDeadline: 'Enforced via Precursor Traceability',
    ukMeltPourDeadline: 'Enforced Jan 2027',
    euCbamStatus: 'MANDATORY_2026',
    ukCbamStatus: 'Mandatory Jan 1, 2027',
    mtcProofRequired: true,
    precursorTraceability: true,
    notes:
      'ASTM A105 / A350. Transformed product: Exporter issues own 3.1 certificate and must lock upstream mill 3.1 MTC as Annex A.',
  },
  {
    code: '7318',
    title: 'Screws, Bolts, Nuts, Coach Screws, Screw Hooks, Rivets, Washers',
    category: 'Fasteners',
    euMeltPourDeadline: 'Enforced via Precursor Traceability',
    ukMeltPourDeadline: 'Enforced Jan 2027',
    euCbamStatus: 'MANDATORY_2026',
    ukCbamStatus: 'Mandatory Jan 1, 2027',
    mtcProofRequired: true,
    precursorTraceability: true,
    notes:
      'High volume, multi-heat shipments. Requires mass-balance batch allocation to prevent phantom heat reuse.',
  },
  {
    code: '7308',
    title: 'Structures & Parts of Structures (Bridges, Towers, Roofs, Doors)',
    category: 'Structures & Fabrications',
    euMeltPourDeadline: 'Enforced via Structural Steel Precursors',
    ukMeltPourDeadline: 'Enforced Jan 2027',
    euCbamStatus: 'MANDATORY_2026',
    ukCbamStatus: 'Mandatory Jan 1, 2027',
    mtcProofRequired: true,
    precursorTraceability: true,
    notes:
      'EN 1090 / EN 10025 structural shapes. Heavy CBAM liability without actual upstream mill emissions data.',
  },
  {
    code: '7326',
    title: 'Other Articles of Iron or Steel (Forged or Stamped)',
    category: 'Engineered Forgings',
    euMeltPourDeadline: 'Enforced via Precursor Traceability',
    ukMeltPourDeadline: 'Enforced Jan 2027',
    euCbamStatus: 'MANDATORY_2026',
    ukCbamStatus: 'Mandatory Jan 1, 2027',
    mtcProofRequired: true,
    precursorTraceability: true,
    notes: 'Machined and forged machine components. Requires Clause 6 Declaration or Factory 3.1.',
  },
  {
    code: '7303',
    title: 'Tubes, Pipes and Hollow Profiles, of Cast Iron',
    category: 'Cast Iron',
    euMeltPourDeadline: 'Subject to Foundry Scope Check',
    ukMeltPourDeadline: 'Phase 2 (2027)',
    euCbamStatus: 'MANDATORY_2026',
    ukCbamStatus: 'Phase 2',
    mtcProofRequired: true,
    precursorTraceability: false,
    notes: 'Ductile iron vs grey iron classification dictates CBAM embedded calculation route.',
  },
  {
    code: '7325',
    title: 'Other Cast Articles of Iron or Steel (Non-Malleable Cast Iron)',
    category: 'Foundry Castings',
    euMeltPourDeadline: 'Exempt until 2028 Downstream Expansion',
    ukMeltPourDeadline: 'Exempt until 2028',
    euCbamStatus: 'EXEMPT_UNTIL_2028',
    ukCbamStatus: 'Exempt until 2028',
    mtcProofRequired: false,
    precursorTraceability: false,
    notes:
      'EXEMPT: Non-malleable cast iron counterweights & municipal castings are not in Annex I scope until the 2028 EU downstream expansion.',
  },
];

export const MOCK_SHIPMENTS: ShipmentRecord[] = [
  {
    id: 'shp-101',
    containerInvoice: 'EXP-2026-109 / MSKU-882190-2',
    buyerName: 'Krupp & Thyssen Stahl GmbH',
    destinationPort: 'Hamburg, Germany',
    country: 'DE',
    cnCode: '7306',
    netTonnage: 25.4,
    linkedHeatNumbers: ['BOK-26-4910', 'BOK-26-4912'],
    metallurgyStatus: '100% WITHIN SPEC',
    meltAndPourStatus: 'VERIFIED_INDIA',
    cbamXmlStatus: 'GENERATED_VALID',
    specificEmissions: 1.82,
    complianceMode: 'TRANSFORMED_3_1',
    qaSigned: true,
  },
  {
    id: 'shp-102',
    containerInvoice: 'EXP-2026-114 / CMAU-749102-5',
    buyerName: 'Rotterdam Piping & Valves B.V.',
    destinationPort: 'Rotterdam, Netherlands',
    country: 'NL',
    cnCode: '7307',
    netTonnage: 24.5,
    linkedHeatNumbers: ['TSJ-26-9021'],
    metallurgyStatus: '100% WITHIN SPEC',
    meltAndPourStatus: 'VERIFIED_INDIA',
    cbamXmlStatus: 'GENERATED_VALID',
    specificEmissions: 1.76,
    complianceMode: 'TRANSFORMED_3_1',
    qaSigned: true,
  },
  {
    id: 'shp-103',
    containerInvoice: 'EXP-2026-120 / HLXU-410928-1',
    buyerName: 'Apex Fastener Distribution Ltd',
    destinationPort: 'Felixstowe, UK',
    country: 'GB',
    cnCode: '7318',
    netTonnage: 21.0,
    linkedHeatNumbers: ['JSW-26-7734'],
    metallurgyStatus: '100% WITHIN SPEC',
    meltAndPourStatus: 'VERIFIED_INDIA',
    cbamXmlStatus: 'GENERATED_VALID',
    specificEmissions: 1.68,
    complianceMode: 'TRANSFORMED_3_1',
    qaSigned: false,
  },
  {
    id: 'shp-104',
    containerInvoice: 'EXP-2026-125 / MSCU-309481-9',
    buyerName: 'Brembo Engineering S.p.A.',
    destinationPort: 'Genoa, Italy',
    country: 'IT',
    cnCode: '7326',
    netTonnage: 19.8,
    linkedHeatNumbers: ['RINL-26-1108'],
    metallurgyStatus: '100% WITHIN SPEC',
    meltAndPourStatus: 'VERIFIED_INDIA',
    cbamXmlStatus: 'PENDING_INPUTS',
    specificEmissions: 1.85,
    complianceMode: 'CLAUSE_6_PASSTHROUGH',
    qaSigned: false,
  },
  {
    id: 'shp-105',
    containerInvoice: 'EXP-2026-128 / OOCU-519203-0',
    buyerName: 'Antwerp Heavy Flange N.V.',
    destinationPort: 'Antwerp, Belgium',
    country: 'BE',
    cnCode: '7307',
    netTonnage: 26.2,
    linkedHeatNumbers: ['TSJ-26-9021', 'TSJ-26-9025'],
    metallurgyStatus: '100% WITHIN SPEC',
    meltAndPourStatus: 'VERIFIED_INDIA',
    cbamXmlStatus: 'GENERATED_VALID',
    specificEmissions: 1.78,
    complianceMode: 'TRANSFORMED_3_1',
    qaSigned: true,
  },
];

export const MOCK_HEAT_INVENTORY: HeatInventoryItem[] = [
  {
    heatNumber: 'BOK-26-4910',
    supplierMill: 'SAIL Bokaro Steel Plant',
    grade: 'IS 2062 E250 / ASTM A53 Gr B',
    totalPurchasedMT: 50.0,
    consumedExportMT: 32.5,
    remainingMT: 17.5,
    precursorSee: 1.65,
    status: 'HEALTHY',
    certRef: 'BSP/MTC/2026/8841-A',
    receivedDate: '02-Jan-2026',
  },
  {
    heatNumber: 'TSJ-26-9021',
    supplierMill: 'Tata Steel Jamshedpur',
    grade: 'ASTM A105 Forging Round',
    totalPurchasedMT: 80.0,
    consumedExportMT: 50.7,
    remainingMT: 29.3,
    precursorSee: 1.58,
    status: 'HEALTHY',
    certRef: 'TSL/QA/MTC/26-9021',
    receivedDate: '10-Jan-2026',
  },
  {
    heatNumber: 'JSW-26-7734',
    supplierMill: 'JSW Steel Vijayanagar',
    grade: 'AISI 4140 / ASTM A193 B7',
    totalPurchasedMT: 45.0,
    consumedExportMT: 39.0,
    remainingMT: 6.0,
    precursorSee: 1.52,
    status: 'LOW_BALANCE',
    certRef: 'JSW/VJN/2026/MTC-7734',
    receivedDate: '15-Jan-2026',
  },
  {
    heatNumber: 'RINL-26-1108',
    supplierMill: 'RINL Vizag Steel Plant',
    grade: 'EN 10025 S355JR',
    totalPurchasedMT: 60.0,
    consumedExportMT: 19.8,
    remainingMT: 40.2,
    precursorSee: 1.69,
    status: 'HEALTHY',
    certRef: 'RINL/VSP/MTC-1108',
    receivedDate: '28-Jan-2026',
  },
  {
    heatNumber: 'DSP-26-8841',
    supplierMill: 'SAIL Durgapur Steel Plant',
    grade: 'EN 10216-2 16Mo3',
    totalPurchasedMT: 35.0,
    consumedExportMT: 35.0,
    remainingMT: 0.0,
    precursorSee: 1.72,
    status: 'EXHAUSTED',
    certRef: 'DSP/QA/2026/8841',
    receivedDate: '12-Dec-2025',
  },
];

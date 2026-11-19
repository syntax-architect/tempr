export type AppMode = 'marketing' | 'dashboard';

export type DashboardView =
  | 'command-center'
  | 'mtc-workbench'
  | 'heat-inventory'
  | 'sign-off-queue'
  | 'cbam-dossier'
  | 'supplier-intelligence'
  | 'supplier-requests'
  | 'intake-channels'
  | 'settings';

export interface ChemicalElement {
  symbol: 'C' | 'Mn' | 'Si' | 'P' | 'S' | 'Cr' | 'Ni' | 'Mo' | 'CEV' | string;
  name: string;
  measured: number;
  min: number;
  max: number;
  unit: string;
  status: 'PASS' | 'FAIL_HIGH' | 'FAIL_LOW';
}

export interface ElementLimit {
  min: number;
  max: number;
  unit?: string;
}

export interface StandardMechanicalLimit {
  property: string;
  requirement: string;
  min?: number;
  max?: number;
}

export interface MetallurgicalStandardDef {
  standardCode: string;
  title: string;
  description: string;
  cnCodes: string[];
  matchingPresetId?: string;
  chemistry: Record<string, ElementLimit>;
  mechanics?: StandardMechanicalLimit[];
}

export interface MechanicalProperty {
  property: string;
  measured: string;
  requirement: string;
  status: 'PASS' | 'FAIL';
}

export interface BoundingBox {
  id: string;
  label: string;
  type: 'amber' | 'cobalt' | 'emerald';
  coords: { x: number; y: number; width: number; height: number }; // percentage 0-100
  fieldName: string;
  fieldValue: string;
}

export interface SimulatorPreset {
  id: string;
  code: string;
  title: string;
  route: string;
  heatNumber: string;
  mill: string;
  productType: string;
  meltRoute: string;
  meltCountry: string;
  certNumber: string;
  issueDate: string;
  actualEmissions: number;
  defaultEmissions: number;
  tonnage: number;
  euroSavings: number;
  chemistry: ChemicalElement[];
  mechanics: MechanicalProperty[];
  boundingBoxes: BoundingBox[];
}

export interface CnCodeItem {
  code: string;
  title: string;
  category: string;
  euMeltPourDeadline: string;
  ukMeltPourDeadline: string;
  euCbamStatus: 'MANDATORY_NOW' | 'MANDATORY_2026' | 'EXEMPT_UNTIL_2028';
  ukCbamStatus: string;
  mtcProofRequired: boolean;
  precursorTraceability: boolean;
  notes: string;
}

export interface ShipmentRecord {
  id: string;
  containerInvoice: string;
  buyerName: string;
  destinationPort: string;
  country: string;
  cnCode: string;
  netTonnage: number;
  linkedHeatNumbers: string[];
  metallurgyStatus: '100% WITHIN SPEC' | 'OFF_SPEC_ALERT';
  meltAndPourStatus: 'VERIFIED_INDIA' | 'UNVERIFIED_DEFECT';
  cbamXmlStatus: 'GENERATED_VALID' | 'PENDING_INPUTS';
  specificEmissions: number;
  complianceMode: 'TRANSFORMED_3_1' | 'CLAUSE_6_PASSTHROUGH';
  qaSigned: boolean;
}

export interface HeatInventoryItem {
  heatNumber: string;
  supplierMill: string;
  grade: string;
  totalPurchasedMT: number;
  consumedExportMT: number;
  remainingMT: number;
  precursorSee: number; // tCO2e/t
  status: 'HEALTHY' | 'LOW_BALANCE' | 'EXHAUSTED';
  certRef: string;
  receivedDate: string;
}

export interface ReadinessCheck {
  rule_id: string;
  name: string;
  severity: 'BLOCK' | 'WARN' | 'INFO';
  passed: boolean;
  message: string;
  fix_hint: string;
  field_link: string;
}

export interface ReadinessEvaluation {
  shipment_id: string;
  score: number;
  status: 'READY' | 'FIX_NEEDED' | 'BLOCKED';
  can_release: boolean;
  checks: ReadinessCheck[];
  blocking_failures: number;
  warning_failures: number;
  total_rules: number;
}

export interface ReleaseGateStatus {
  shipment_id: string;
  status: 'DRAFT' | 'RELEASE_REQUESTED' | 'RELEASE_APPROVED' | 'RELEASE_REJECTED';
  readiness_score: number;
  requested_by?: string;
  requested_at?: string;
  approved_by?: string;
  approved_at?: string;
  override_applied?: boolean;
  override_reason?: string;
  evaluation?: ReadinessEvaluation;
}

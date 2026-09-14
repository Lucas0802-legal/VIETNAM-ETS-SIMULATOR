// Facility types
export type SectorType = 'Thermal power' | 'Iron & steel' | 'Cement' | 'Other';
export type FacilityCategory = 'Thermal power' | 'Industrial production' | 'Freight transport' | 'Commercial building' | 'Solid waste treatment' | 'Other';

export interface Facility {
  id: string;
  name: string;
  sector: SectorType;
  sector_vi: string;
  product: string;
  product_vi: string;
  product_unit: string;
  tax_id: string;
  address: string;
  representative: string;
  allocation_2025: number;
  allocation_2026: number;
  allocation_total: number;
  legal_source: string;
  is_in_qd699: boolean;
}

export interface LegalRule {
  id: string;
  topic: string;
  rule: string;
  legal_basis: string;
  article: string;
  issue_date: string;
  effective_status: string;
  source_url: string;
  simulator_use: string;
  caution: string;
}

export interface RegulatoryRule {
  rule_id: string;
  module: string;
  category: string;
  trigger: string;
  threshold: string;
  result: string;
  legal_basis: string;
  effective_scope: string;
  source_url: string;
  notes: string;
}

export type InventoryStatusType = 
  | 'YES'
  | 'MEETS_CRITERIA'
  | 'UNDETERMINED'
  | 'NO_EVIDENCE';

export type ComplianceStatusType =
  | 'SURPLUS'
  | 'DEFICIT'
  | 'BALANCED'
  | 'MISSING_DIRECT_EMISSIONS'
  | 'NOT_APPLICABLE'
  | 'INVALID_CREDITS'
  | 'INVALID_BORROWING';

export type CalculationStatusType =
  | 'READY'
  | 'MISSING_HISTORICAL'
  | 'BENCHMARK_UNAVAILABLE'
  | 'MISSING_GR'
  | 'NOT_READY';

export type DataReadiness = 'READY' | 'PARTIAL' | 'MISSING' | 'UNVERIFIED';

export interface SimulatorState {
  // Screen 1: Identity & Date
  assessment_date: string; // YYYY-MM-DD
  facility_id: string; // 'F001' - 'F110' or ''
  manual_facility_name: string;
  manual_tax_id: string;
  facility_type: FacilityCategory;
  sector: SectorType;
  is_manual: boolean;

  // Screen 2: Inventory Inputs
  inventory_list_match: 'Yes' | 'No' | 'Unknown';
  annual_ghg: number | null;
  annual_toe: number | null;
  waste_capacity: number | null;

  // Screen 4: Allocation Inputs
  allocation_year: 2025 | 2026;
  prod_y3: number | null;
  prod_y2: number | null;
  prod_y1: number | null;
  emis_y3: number | null;
  emis_y2: number | null;
  emis_y1: number | null;
  g: number | null; // percentage e.g. 3.5
  r: number | null; // percentage e.g. 2.0
  benchmark_override: number | null;

  // Screen 5: Compliance Inputs
  direct_emis_2025: number | null;
  direct_emis_2026: number | null;
  credits_used: number | null;
  net_allowance_trades: number | null;
  borrowed_allowances: number | null;
}

export interface PresetScenario extends Partial<SimulatorState> {
  id: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
}

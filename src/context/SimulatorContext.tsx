import React, { createContext, useContext, useEffect, useRef, useState, useMemo, ReactNode } from 'react';
import facilitiesData from '../data/facilities.json';
import legalRulesData from '../data/legalRules.json';
import regulatoryScopeData from '../data/regulatoryScope.json';
import defaultPresetsData from '../data/defaultPresets.json';
import { Facility, LegalRule, PresetScenario, RegulatoryRule, SimulatorState } from '../types';
import { assessInventoryObligation, InventoryAssessmentResult } from '../engine/inventoryEngine';
import { calculateAllocation, AllocationCalculationResult } from '../engine/allocationEngine';
import { calculateCompliance, ComplianceCalculationResult } from '../engine/complianceEngine';
import { evaluateDataQuality, DataQualityReport } from '../engine/dataQualityEngine';
import { normalizeSearchText } from '../utils/search';

interface SimulatorContextType {
  state: SimulatorState;
  facilities: Facility[];
  legalRules: LegalRule[];
  regulatoryRules: RegulatoryRule[];
  presets: PresetScenario[];
  selectedFacility: Facility | null;
  manualQuotaMatches: Facility[];
  
  // Engine Results
  inventoryResult: InventoryAssessmentResult;
  allocationResult: AllocationCalculationResult;
  complianceResult: ComplianceCalculationResult;
  dataQualityReport: DataQualityReport;

  // Navigation & Drawer
  currentScreen: number;
  setCurrentScreen: (screen: number) => void;
  activeLegalRule: LegalRule | null;
  openLegalDrawer: (ruleIdOrLegalRule: string | LegalRule) => void;
  closeLegalDrawer: () => void;
  isLegalDrawerOpen: boolean;

  // Actions
  updateField: <K extends keyof SimulatorState>(field: K, value: SimulatorState[K]) => void;
  selectFacility: (id: string) => void;
  setManualMode: (isManual: boolean) => void;
  loadPreset: (presetId: string) => void;
  resetSimulation: () => void;

  // Modals
  isPrintModalOpen: boolean;
  setIsPrintModalOpen: (open: boolean) => void;
  isTestModalOpen: boolean;
  setIsTestModalOpen: (open: boolean) => void;
}

const defaultState: SimulatorState = {
  assessment_date: '2026-09-13',
  facility_id: 'F001',
  manual_facility_name: '',
  manual_tax_id: '',
  facility_type: 'Thermal power',
  sector: 'Thermal power',
  is_manual: false,

  inventory_list_match: 'Unknown',
  annual_ghg: 1050000,
  annual_toe: 280000,
  waste_capacity: null,

  allocation_year: 2025,
  prod_y3: 650000000,
  prod_y2: 680000000,
  prod_y1: 690000000,
  emis_y3: 1010000,
  emis_y2: 1040000,
  emis_y1: 1050000,
  g: 3.5,
  r: 2.0,
  benchmark_override: 0.00151,

  direct_emis_2025: 1020000,
  direct_emis_2026: 1050000,
  credits_used: 50000,
  net_allowance_trades: 0,
  borrowed_allowances: 0,
};

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);
const STORAGE_KEY = 'vietnam-ets-simulator:draft:v1';
const SCREEN_STORAGE_KEY = 'vietnam-ets-simulator:screen:v1';

const clearFacilityInputs = (state: SimulatorState): SimulatorState => ({
  ...state,
  annual_ghg: null,
  annual_toe: null,
  waste_capacity: null,
  prod_y3: null,
  prod_y2: null,
  prod_y1: null,
  emis_y3: null,
  emis_y2: null,
  emis_y1: null,
  g: null,
  r: null,
  benchmark_override: null,
  direct_emis_2025: null,
  direct_emis_2026: null,
  credits_used: 0,
  net_allowance_trades: 0,
  borrowed_allowances: 0,
});

const loadStoredState = (): SimulatorState => {
  if (typeof window === 'undefined') return defaultState;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
};

export const SimulatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimulatorState>(loadStoredState);
  const [currentScreen, setCurrentScreen] = useState<number>(() => {
    const saved = Number(window.localStorage.getItem(SCREEN_STORAGE_KEY));
    return Number.isInteger(saved) && saved >= 1 && saved <= 8 ? saved : 1;
  });
  const [activeLegalRule, setActiveLegalRule] = useState<LegalRule | null>(null);
  const [isLegalDrawerOpen, setIsLegalDrawerOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  const facilities = useMemo(() => facilitiesData as Facility[], []);
  const legalRules = useMemo(() => legalRulesData as LegalRule[], []);
  const regulatoryRules = useMemo(() => regulatoryScopeData as RegulatoryRule[], []);
  const presets = useMemo(() => defaultPresetsData as PresetScenario[], []);
  const lastOfficialFacilityId = useRef(state.is_manual ? 'F001' : state.facility_id || 'F001');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    window.localStorage.setItem(SCREEN_STORAGE_KEY, String(currentScreen));
  }, [currentScreen]);

  // Selected Facility
  const selectedFacility = useMemo(() => {
    if (state.is_manual || !state.facility_id) return null;
    return facilities.find(f => f.id === state.facility_id) || null;
  }, [facilities, state.is_manual, state.facility_id]);

  const manualQuotaMatches = useMemo(() => {
    if (!state.is_manual) return [];
    const taxId = state.manual_tax_id.replace(/\D/g, '');
    const name = normalizeSearchText(state.manual_facility_name.trim());
    if (!taxId && !name) return [];
    return facilities.filter(facility => {
      const facilityTaxId = facility.tax_id.replace(/\D/g, '');
      const facilityName = normalizeSearchText(facility.name);
      return (!!taxId && facilityTaxId === taxId) || (!!name && facilityName === name);
    });
  }, [facilities, state.is_manual, state.manual_facility_name, state.manual_tax_id]);

  // Inventory Engine Assessment
  const inventoryResult = useMemo(() => {
    return assessInventoryObligation({
      assessmentDate: state.assessment_date,
      isInQd699: !!selectedFacility?.is_in_qd699,
      inventoryListMatch: state.inventory_list_match,
      facilityType: state.facility_type,
      annualGhg: state.annual_ghg,
      annualToe: state.annual_toe,
      wasteCapacity: state.waste_capacity,
    });
  }, [state, selectedFacility]);

  // Allocation Engine Calculation
  const allocationResult = useMemo(() => {
    const officialAlloc = selectedFacility
      ? (state.allocation_year === 2025 ? selectedFacility.allocation_2025 : selectedFacility.allocation_2026)
      : null;

    return calculateAllocation({
      allocationYear: state.allocation_year,
      prodY3: state.prod_y3,
      prodY2: state.prod_y2,
      prodY1: state.prod_y1,
      emisY3: state.emis_y3,
      emisY2: state.emis_y2,
      emisY1: state.emis_y1,
      g: state.g,
      r: state.r,
      benchmarkOverride: state.benchmark_override,
      officialAllocation: officialAlloc,
      sector: selectedFacility ? selectedFacility.sector : state.sector,
    });
  }, [state, selectedFacility]);

  // Compliance Engine Calculation
  const complianceResult = useMemo(() => {
    const phaseTotal = selectedFacility ? selectedFacility.allocation_total : 0;
    return calculateCompliance({
      isInQd699: !!selectedFacility?.is_in_qd699,
      phaseAllocationTotal: phaseTotal,
      directEmis2025: state.direct_emis_2025,
      directEmis2026: state.direct_emis_2026,
      creditsUsed: state.credits_used,
      netAllowanceTrades: state.net_allowance_trades,
      borrowedAllowances: state.borrowed_allowances,
    });
  }, [state, selectedFacility]);

  // Data Quality Engine Evaluation
  const dataQualityReport = useMemo(() => {
    return evaluateDataQuality(state, !!selectedFacility, {
      allocation: allocationResult.status,
      compliance: complianceResult.status,
      inventory: inventoryResult.overallStatus,
    });
  }, [state, selectedFacility, allocationResult.status, complianceResult.status, inventoryResult.overallStatus]);

  // Actions
  const updateField = <K extends keyof SimulatorState>(field: K, value: SimulatorState[K]) => {
    setState(prev => {
      if (field === 'allocation_year' && prev.allocation_year !== value) {
        return {
          ...prev,
          allocation_year: value as SimulatorState['allocation_year'],
          prod_y3: null,
          prod_y2: null,
          prod_y1: null,
          emis_y3: null,
          emis_y2: null,
          emis_y1: null,
          g: null,
          r: null,
          benchmark_override: null,
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const selectFacility = (id: string) => {
    const fac = facilities.find(f => f.id === id);
    if (fac) {
      lastOfficialFacilityId.current = fac.id;
      setState(prev => {
        if (!prev.is_manual && prev.facility_id === fac.id) return prev;
        return clearFacilityInputs({
        ...prev,
        facility_id: fac.id,
        is_manual: false,
        manual_facility_name: '',
        manual_tax_id: '',
        sector: fac.sector,
        facility_type: fac.sector === 'Thermal power' ? 'Thermal power' : 'Industrial production',
        inventory_list_match: 'Unknown',
      });
      });
    }
  };

  const setManualMode = (isManual: boolean) => {
    setState(prev => {
      if (prev.is_manual === isManual) return prev;
      if (isManual) {
        if (prev.facility_id) lastOfficialFacilityId.current = prev.facility_id;
        return clearFacilityInputs({
          ...prev,
          is_manual: true,
          facility_id: '',
          manual_facility_name: '',
          manual_tax_id: '',
          sector: 'Other',
          facility_type: 'Other',
          inventory_list_match: 'Unknown',
        });
      }

      const facility = facilities.find(f => f.id === lastOfficialFacilityId.current) ?? facilities[0];
      return clearFacilityInputs({
        ...prev,
        is_manual: false,
        facility_id: facility.id,
        manual_facility_name: '',
        manual_tax_id: '',
        sector: facility.sector,
        facility_type: facility.sector === 'Thermal power' ? 'Thermal power' : 'Industrial production',
        inventory_list_match: 'Unknown',
      });
    });
  };

  const loadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    const presetState = Object.fromEntries(
      Object.entries(preset).filter(([key]) => key in defaultState)
    ) as Partial<SimulatorState>;
    const facility = presetState.facility_id
      ? facilities.find(f => f.id === presetState.facility_id)
      : null;
    if (facility) lastOfficialFacilityId.current = facility.id;
    setState({
      ...defaultState,
      ...presetState,
      sector: facility?.sector ?? presetState.sector ?? 'Other',
      facility_type: facility
        ? (facility.sector === 'Thermal power' ? 'Thermal power' : 'Industrial production')
        : presetState.facility_type ?? 'Other',
      manual_facility_name: presetState.is_manual ? presetState.manual_facility_name ?? '' : '',
      manual_tax_id: presetState.is_manual ? presetState.manual_tax_id ?? '' : '',
    });
  };

  const resetSimulation = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(SCREEN_STORAGE_KEY);
    lastOfficialFacilityId.current = 'F001';
    setState(defaultState);
    setCurrentScreen(1);
  };

  const openLegalDrawer = (ruleIdOrLegalRule: string | LegalRule) => {
    if (typeof ruleIdOrLegalRule === 'string') {
      const found = legalRules.find(r => r.id === ruleIdOrLegalRule || r.legal_basis.includes(ruleIdOrLegalRule));
      if (found) {
        setActiveLegalRule(found);
      } else {
        // Fallback default consolidated law L001
        setActiveLegalRule(legalRules[0]);
      }
    } else {
      setActiveLegalRule(ruleIdOrLegalRule);
    }
    setIsLegalDrawerOpen(true);
  };

  const closeLegalDrawer = () => {
    setIsLegalDrawerOpen(false);
  };

  return (
    <SimulatorContext.Provider
      value={{
        state,
        facilities,
        legalRules,
        regulatoryRules,
        presets,
        selectedFacility,
        manualQuotaMatches,
        inventoryResult,
        allocationResult,
        complianceResult,
        dataQualityReport,
        currentScreen,
        setCurrentScreen,
        activeLegalRule,
        openLegalDrawer,
        closeLegalDrawer,
        isLegalDrawerOpen,
        updateField,
        selectFacility,
        setManualMode,
        loadPreset,
        resetSimulation,
        isPrintModalOpen,
        setIsPrintModalOpen,
        isTestModalOpen,
        setIsTestModalOpen,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};

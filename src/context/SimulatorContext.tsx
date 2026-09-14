import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import facilitiesData from '../data/facilities.json';
import legalRulesData from '../data/legalRules.json';
import regulatoryScopeData from '../data/regulatoryScope.json';
import defaultPresetsData from '../data/defaultPresets.json';
import { Facility, LegalRule, PresetScenario, RegulatoryRule, SimulatorState } from '../types';
import { assessInventoryObligation, InventoryAssessmentResult } from '../engine/inventoryEngine';
import { calculateAllocation, AllocationCalculationResult } from '../engine/allocationEngine';
import { calculateCompliance, ComplianceCalculationResult } from '../engine/complianceEngine';
import { evaluateDataQuality, DataQualityReport } from '../engine/dataQualityEngine';

interface SimulatorContextType {
  state: SimulatorState;
  facilities: Facility[];
  legalRules: LegalRule[];
  regulatoryRules: RegulatoryRule[];
  presets: PresetScenario[];
  selectedFacility: Facility | null;
  
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

  inventory_list_match: 'Yes',
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

export const SimulatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimulatorState>(defaultState);
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [activeLegalRule, setActiveLegalRule] = useState<LegalRule | null>(null);
  const [isLegalDrawerOpen, setIsLegalDrawerOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  const facilities = useMemo(() => facilitiesData as Facility[], []);
  const legalRules = useMemo(() => legalRulesData as LegalRule[], []);
  const regulatoryRules = useMemo(() => regulatoryScopeData as RegulatoryRule[], []);
  const presets = useMemo(() => defaultPresetsData as PresetScenario[], []);

  // Selected Facility
  const selectedFacility = useMemo(() => {
    if (state.is_manual || !state.facility_id) return null;
    return facilities.find(f => f.id === state.facility_id) || null;
  }, [facilities, state.is_manual, state.facility_id]);

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
    return evaluateDataQuality(state, !!selectedFacility);
  }, [state, selectedFacility]);

  // Actions
  const updateField = <K extends keyof SimulatorState>(field: K, value: SimulatorState[K]) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const selectFacility = (id: string) => {
    const fac = facilities.find(f => f.id === id);
    if (fac) {
      setState(prev => ({
        ...prev,
        facility_id: fac.id,
        is_manual: false,
        sector: fac.sector,
        facility_type: fac.sector === 'Thermal power' ? 'Thermal power' : 'Industrial production',
        inventory_list_match: 'Yes',
      }));
    }
  };

  const setManualMode = (isManual: boolean) => {
    setState(prev => ({
      ...prev,
      is_manual: isManual,
      facility_id: isManual ? '' : 'F001',
      inventory_list_match: isManual ? 'Unknown' : 'Yes',
    }));
  };

  const loadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    setState(prev => ({
      ...prev,
      ...preset,
    }));
  };

  const resetSimulation = () => {
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

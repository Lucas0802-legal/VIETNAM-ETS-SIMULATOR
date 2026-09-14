import facilities from './src/data/facilities.json';
import legalRules from './src/data/legalRules.json';
import { assessInventoryObligation } from './src/engine/inventoryEngine';
import { calculateAllocation } from './src/engine/allocationEngine';
import { calculateCompliance } from './src/engine/complianceEngine';
import { evaluateDataQuality } from './src/engine/dataQualityEngine';
import type { SimulatorState } from './src/types';

console.log('=====================================================');
console.log('VIETNAM ETS SIMULATOR — COMPREHENSIVE VERIFICATION TEST');
console.log('=====================================================\n');

let allPassed = true;
function assert(condition: boolean, testName: string, detail?: any) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    if (detail) console.error('  Detail:', detail);
    allPassed = false;
  }
}

// 1. DATASET INTEGRITY
assert(facilities.length === 110, 'Dataset contains exactly 110 facilities');
const thermalCount = facilities.filter(f => f.sector === 'Thermal power').length;
const steelCount = facilities.filter(f => f.sector === 'Iron & steel').length;
const cementCount = facilities.filter(f => f.sector === 'Cement').length;
assert(thermalCount === 34, `Thermal power facilities = 34 (got ${thermalCount})`);
assert(steelCount === 25, `Iron & steel facilities = 25 (got ${steelCount})`);
assert(cementCount === 51, `Cement facilities = 51 (got ${cementCount})`);

const totalAlloc2025 = facilities.reduce((sum, f) => sum + f.allocation_2025, 0);
const totalAlloc2026 = facilities.reduce((sum, f) => sum + f.allocation_2026, 0);
assert(totalAlloc2025 === 243082392, `National Cap 2025 = 243,082,392 (got ${totalAlloc2025})`);
assert(totalAlloc2026 === 268391454, `National Cap 2026 = 268,391,454 (got ${totalAlloc2026})`);

assert(legalRules.length === 18, `Legal rules count = 18 (got ${legalRules.length})`);

// 2. INVENTORY ASSESSMENT ENGINE
// Case A: Quota facility in QD699 -> Status YES
const invA = assessInventoryObligation({
  assessmentDate: '2026-09-13',
  isInQd699: true,
  inventoryListMatch: 'Yes',
  facilityType: 'Thermal power',
  annualGhg: 1050000,
  annualToe: 280000,
  wasteCapacity: null,
});
assert(invA.overallStatus === 'YES', 'QD699 facility gets YES for inventory');
assert(invA.applicableList.includes('13/2024'), 'Assessment date before 25/09/2026 selects QD 13/2024');

// Case B: Future assessment date from 25/09/2026 -> Selects QD 42/2026
const invB = assessInventoryObligation({
  assessmentDate: '2026-09-26',
  isInQd699: false,
  inventoryListMatch: 'Unknown',
  facilityType: 'Industrial production',
  annualGhg: 4500, // >= 3000
  annualToe: 1200,
  wasteCapacity: null,
});
assert(invB.applicableList.includes('42/2026'), 'Assessment date >= 25/09/2026 selects QD 42/2026');
assert(invB.overallStatus === 'MEETS_CRITERIA', 'Unlisted facility with 4,500 tCO2e gets MEETS_CRITERIA');

// Case C: Missing data -> UNDETERMINED (never guess!)
const invC = assessInventoryObligation({
  assessmentDate: '2026-09-13',
  isInQd699: false,
  inventoryListMatch: 'Unknown',
  facilityType: 'Industrial production',
  annualGhg: null,
  annualToe: null,
  wasteCapacity: null,
});
assert(invC.overallStatus === 'UNDETERMINED', 'Missing threshold inputs yields UNDETERMINED');

// 3. ALLOCATION ENGINE (METHOD 01)
// F001 Simulation
const f001 = facilities.find(f => f.id === 'F001')!;
assert(f001.allocation_2025 === 1035566, 'F001 2025 official allocation = 1,035,566');
assert(f001.allocation_2026 === 1134493, 'F001 2026 official allocation = 1,134,493');

// Test Missing g/r guardrail: DO NOT DEFAULT TO 0%
const allocMissingGR = calculateAllocation({
  allocationYear: 2025,
  prodY3: 650000000,
  prodY2: 680000000,
  prodY1: 690000000,
  emisY3: 1010000,
  emisY2: 1040000,
  emisY1: 1050000,
  g: null, // missing!
  r: 2.0,
  benchmarkOverride: 0.00151,
  officialAllocation: f001.allocation_2025,
  sector: 'Thermal power',
});
assert(allocMissingGR.status === 'MISSING_GR', 'Missing g yields status MISSING_GR');
assert(allocMissingGR.calculatedA === null, 'Calculated A is null when g or r is missing (Never defaults to 0%)');

// Test Complete Calculation
const allocComplete = calculateAllocation({
  allocationYear: 2025,
  prodY3: 650000000,
  prodY2: 680000000,
  prodY1: 690000000,
  emisY3: 1010000,
  emisY2: 1040000,
  emisY1: 1050000,
  g: 3.5,
  r: 2.0,
  benchmarkOverride: 0.00151,
  officialAllocation: f001.allocation_2025,
  sector: 'Thermal power',
});
assert(allocComplete.status === 'READY', 'Complete inputs yield READY status');
assert(allocComplete.pAvg !== null && Math.round(allocComplete.pAvg) === 673333333, 'P_avg correct');
assert(allocComplete.factorT !== null && Math.abs(allocComplete.factorT - (1.035 * 0.98)) < 0.0001, 'Factor T correct: (1+g)*(1-r)');
assert(allocComplete.calculatedA !== null && allocComplete.calculatedA > 0, 'Calculated A > 0');

// 4. COMPLIANCE POSITION & CAP ENFORCEMENT
// F001 Phase allocation = 2,170,059
const phaseTotal = f001.allocation_total;
assert(phaseTotal === 2170059, 'F001 phase total = 2,170,059');

// Test 30% Credit Cap
const creditCap = phaseTotal * 0.30;
assert(Math.abs(creditCap - 651017.7) < 0.1, `30% credit cap = 651,017.7 (got ${creditCap})`);

// Surplus Scenario
const compSurplus = calculateCompliance({
  isInQd699: true,
  phaseAllocationTotal: phaseTotal,
  directEmis2025: 1000000,
  directEmis2026: 1020000,
  creditsUsed: 50000,
  netAllowanceTrades: 0,
  borrowedAllowances: 0,
});
assert(compSurplus.status === 'SURPLUS', 'Compliance status is SURPLUS');
assert(compSurplus.complianceGap !== null && compSurplus.complianceGap > 0, 'Compliance gap is positive for surplus');
assert(compSurplus.surrenderDeadline === '31/12/2027', 'Surrender deadline is 31/12/2027');

// Deficit Scenario
const compDeficit = calculateCompliance({
  isInQd699: true,
  phaseAllocationTotal: phaseTotal,
  directEmis2025: 1200000,
  directEmis2026: 1300000, // total 2.5m > 2.17m
  creditsUsed: 0,
  netAllowanceTrades: 0,
  borrowedAllowances: 0,
});
assert(compDeficit.status === 'DEFICIT', 'Compliance status is DEFICIT');
assert(compDeficit.complianceGap !== null && compDeficit.complianceGap < 0, 'Compliance gap is negative for deficit');

// Excess Credit Cap Validation (> 30%)
const compExcessCredit = calculateCompliance({
  isInQd699: true,
  phaseAllocationTotal: phaseTotal,
  directEmis2025: 1000000,
  directEmis2026: 1000000,
  creditsUsed: 700000, // > 651,017.7 cap!
  netAllowanceTrades: 0,
  borrowedAllowances: 0,
});
assert(compExcessCredit.isCreditExceeded === true, 'Flags credit exceeded when > 30% cap');
assert(compExcessCredit.status === 'INVALID_CREDITS', 'Status is INVALID_CREDITS when exceeding cap');

// Excess Borrowing Cap Validation (> 15%)
const compExcessBorrowing = calculateCompliance({
  isInQd699: true,
  phaseAllocationTotal: phaseTotal,
  directEmis2025: 1000000,
  directEmis2026: 1000000,
  creditsUsed: 0,
  netAllowanceTrades: 0,
  borrowedAllowances: 400000, // > 325,508.85 (15% cap)
});
assert(compExcessBorrowing.isBorrowingExceeded === true, 'Flags borrowing exceeded when > 15% cap');
assert(compExcessBorrowing.status === 'INVALID_BORROWING', 'Status is INVALID_BORROWING when exceeding cap');

// 5. DATA QUALITY EVALUATION
const dummyState: SimulatorState = {
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

const quality = evaluateDataQuality(dummyState, true);
assert(quality.totalDimensions === 6, 'Evaluates exactly 6 dimensions');
assert(quality.overallScorePercent === 100, `Fully populated state has 100% readiness (got ${quality.overallScorePercent}%)`);

console.log('\n=====================================================');
if (allPassed) {
  console.log('ALL TESTS PASSED PERFECTLY! [100% SUCCESS]');
} else {
  console.error('SOME TESTS FAILED! Check error log above.');
}
console.log('=====================================================');

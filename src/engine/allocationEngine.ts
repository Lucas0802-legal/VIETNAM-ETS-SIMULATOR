import { CalculationStatusType, SectorType } from '../types';

export interface AllocationCalculationResult {
  allocationYear: 2025 | 2026;
  windowYears: [number, number, number];
  pAvg: number | null;
  eAvg: number | null;
  benchmarkB: number | null;
  isBenchmarkOverride: boolean;
  factorT: number | null;
  calculatedA: number | null;
  officialAllocation: number | null;
  difference: number | null;
  differencePercent: number | null;
  status: CalculationStatusType;
  statusTextVi: string;
  statusTextEn: string;
  badgeColor: 'emerald' | 'amber' | 'slate' | 'rose';
  isValid: boolean;
  validationErrorsVi: string[];
  validationErrorsEn: string[];
  formulaBreakdown: {
    pAvgFormula: string;
    eAvgFormula: string;
    tFormula: string;
    aFormula: string;
  };
  legalBasis: {
    title: string;
    article: string;
    url: string;
  };
}

export function calculateAllocation(params: {
  allocationYear: 2025 | 2026;
  prodY3: number | null;
  prodY2: number | null;
  prodY1: number | null;
  emisY3: number | null;
  emisY2: number | null;
  emisY1: number | null;
  g: number | null; // percentage e.g. 3.5
  r: number | null; // percentage e.g. 2.0
  benchmarkOverride: number | null;
  officialAllocation: number | null;
  sector: SectorType;
}): AllocationCalculationResult {
  const {
    allocationYear,
    prodY3,
    prodY2,
    prodY1,
    emisY3,
    emisY2,
    emisY1,
    g,
    r,
    benchmarkOverride,
    officialAllocation,
  } = params;

  const windowYears: [number, number, number] = allocationYear === 2025 
    ? [2022, 2023, 2024] 
    : [2023, 2024, 2025];

  const validationErrorsVi: string[] = [];
  const validationErrorsEn: string[] = [];
  const addError = (vi: string, en: string) => {
    validationErrorsVi.push(vi);
    validationErrorsEn.push(en);
  };
  const validateNonNegative = (labelVi: string, labelEn: string, value: number | null) => {
    if (value !== null && (!Number.isFinite(value) || value < 0)) {
      addError(`${labelVi} phải là số hữu hạn không âm.`, `${labelEn} must be a finite, non-negative number.`);
    }
  };

  [prodY3, prodY2, prodY1].forEach((value, index) =>
    validateNonNegative(`Sản lượng năm ${windowYears[index]}`, `Production for ${windowYears[index]}`, value)
  );
  [emisY3, emisY2, emisY1].forEach((value, index) =>
    validateNonNegative(`Phát thải năm ${windowYears[index]}`, `Emissions for ${windowYears[index]}`, value)
  );
  if (g !== null && (!Number.isFinite(g) || g <= -100)) {
    addError('Tỷ lệ tăng trưởng g phải là số hữu hạn lớn hơn -100%.', 'Growth rate g must be finite and greater than -100%.');
  }
  if (r !== null && (!Number.isFinite(r) || r < 0 || r > 100)) {
    addError('Tỷ lệ giảm phát thải r phải nằm trong khoảng 0% đến 100%.', 'Reduction rate r must be between 0% and 100%.');
  }
  if (benchmarkOverride !== null && (!Number.isFinite(benchmarkOverride) || benchmarkOverride <= 0)) {
    addError('Benchmark B phải là số hữu hạn lớn hơn 0.', 'Benchmark B must be a finite number greater than 0.');
  }
  validateNonNegative('Hạn ngạch chính thức', 'Official allocation', officialAllocation);
  const isValid = validationErrorsVi.length === 0;

  // 1. P_avg
  const has3YearsProd = [prodY3, prodY2, prodY1].every(value => value !== null && Number.isFinite(value) && value >= 0);
  const pAvg = isValid && has3YearsProd ? ((prodY3 as number) + (prodY2 as number) + (prodY1 as number)) / 3 : null;

  // 2. E_avg
  const has3YearsEmis = [emisY3, emisY2, emisY1].every(value => value !== null && Number.isFinite(value) && value >= 0);
  const eAvg = isValid && has3YearsEmis ? ((emisY3 as number) + (emisY2 as number) + (emisY1 as number)) / 3 : null;

  // 3. Benchmark B
  const isBenchmarkOverride = isValid && benchmarkOverride !== null && Number.isFinite(benchmarkOverride) && benchmarkOverride > 0;
  const benchmarkB = isBenchmarkOverride ? benchmarkOverride : null;

  // 4. Factor T = (1 + g) * (1 - r)
  // Strict rule: do not assume 0% if missing
  const hasGR = isValid && g !== null && r !== null;
  const factorT = hasGR ? (1 + g / 100) * (1 - r / 100) : null;

  // 5. Calculated Allowance A = P_avg * B * T
  const canCalculateA = isValid && pAvg !== null && eAvg !== null && benchmarkB !== null && factorT !== null && factorT >= 0;
  const calculatedA = canCalculateA ? pAvg * benchmarkB * factorT : null;

  // 6. Difference vs Official
  const difference = (calculatedA !== null && officialAllocation !== null) 
    ? calculatedA - officialAllocation 
    : null;
  const differencePercent = (difference !== null && officialAllocation && officialAllocation > 0)
    ? (difference / officialAllocation) * 100
    : null;

  // 7. Status determination
  let status: CalculationStatusType;
  let statusTextVi = '';
  let statusTextEn = '';
  let badgeColor: 'emerald' | 'amber' | 'slate' | 'rose' = 'slate';

  if (!isValid) {
    status = 'INVALID_INPUT';
    statusTextVi = validationErrorsVi.join(' ');
    statusTextEn = validationErrorsEn.join(' ');
    badgeColor = 'rose';
  } else if (!has3YearsProd || !has3YearsEmis) {
    status = 'MISSING_HISTORICAL';
    statusTextVi = 'Thiếu dữ liệu sản lượng hoặc phát thải lịch sử 3 năm (' + windowYears.join(', ') + ')';
    statusTextEn = 'Missing 3-year historical production or emissions data (' + windowYears.join(', ') + ')';
    badgeColor = 'amber';
  } else if (benchmarkB === null) {
    status = 'BENCHMARK_UNAVAILABLE';
    statusTextVi = 'Chưa có Benchmark B ngành chính thức hoặc giá trị kịch bản mô phỏng';
    statusTextEn = 'Sector Benchmark B unavailable — incomplete full-sector dataset or missing scenario override';
    badgeColor = 'slate';
  } else if (!hasGR) {
    status = 'MISSING_GR';
    statusTextVi = 'Thiếu tham số chính sách g (tăng trưởng) hoặc r (giảm phát thải) — Không được mặc định 0%';
    statusTextEn = 'Missing verified policy parameters g/r — do not assume 0%';
    badgeColor = 'rose';
  } else if (calculatedA === null) {
    status = 'NOT_READY';
    statusTextVi = 'Chưa sẵn sàng tính toán hạn ngạch';
    statusTextEn = 'Calculation not ready';
    badgeColor = 'slate';
  } else {
    status = 'READY';
    statusTextVi = 'Mô phỏng thành công theo Phương pháp 01 (Phụ lục I)';
    statusTextEn = 'Successfully simulated via Method No. 01 (Appendix I)';
    badgeColor = 'emerald';
  }

  const pAvgFormula = has3YearsProd 
    ? `(${prodY3?.toLocaleString()} + ${prodY2?.toLocaleString()} + ${prodY1?.toLocaleString()}) / 3 = ${pAvg?.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : '(P_y3 + P_y2 + P_y1) / 3 [Đang chờ nhập 3 năm]';

  const eAvgFormula = has3YearsEmis 
    ? `(${emisY3?.toLocaleString()} + ${emisY2?.toLocaleString()} + ${emisY1?.toLocaleString()}) / 3 = ${eAvg?.toLocaleString(undefined, { maximumFractionDigits: 2 })} tCO2e`
    : '(E_y3 + E_y2 + E_y1) / 3 [Đang chờ nhập 3 năm]';

  const tFormula = hasGR 
    ? `(1 + ${g}%) × (1 - ${r}%) = ${(1 + (g as number)/100).toFixed(4)} × ${(1 - (r as number)/100).toFixed(4)} = ${factorT?.toFixed(4)}`
    : '(1 + g) × (1 - r) [Thiếu tham số chính sách]';

  const aFormula = canCalculateA
    ? `${pAvg?.toLocaleString(undefined, { maximumFractionDigits: 1 })} × ${benchmarkB} × ${factorT?.toFixed(4)} = ${calculatedA?.toLocaleString(undefined, { maximumFractionDigits: 0 })} tCO2e`
    : 'P̄ × B × T [Chưa đủ điều kiện tính]';

  return {
    allocationYear,
    windowYears,
    pAvg,
    eAvg,
    benchmarkB,
    isBenchmarkOverride,
    factorT,
    calculatedA,
    officialAllocation,
    difference,
    differencePercent,
    status,
    statusTextVi,
    statusTextEn,
    badgeColor,
    isValid,
    validationErrorsVi,
    validationErrorsEn,
    formulaBreakdown: {
      pAvgFormula,
      eAvgFormula,
      tFormula,
      aFormula
    },
    legalBasis: {
      title: 'Nghị định 06/2022/NĐ-CP (sửa đổi), Phụ lục I - Phương pháp 01',
      article: 'Công thức phân bổ A = P̄ × B × T cho giai đoạn 2025-2026',
      url: 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/6/10-vbhn-bnnmt-kem.pdf'
    }
  };
}

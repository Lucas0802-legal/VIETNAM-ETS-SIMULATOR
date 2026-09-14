import { FacilityCategory, InventoryStatusType } from '../types';

const toLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isValidIsoDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

export interface InventoryAssessmentResult {
  applicableList: string;
  listEffectivePeriod: string;
  listEffectivePeriodEn: string;
  dateWarning: string;
  dateWarningEn: string;
  isDateWarning: boolean;
  criteriaTest: 'MEETS_CRITERIA' | 'DOES_NOT_MEET_CRITERIA' | 'INSUFFICIENT_DATA';
  criteriaDetails: {
    ghgMet: boolean;
    toeMet: boolean;
    wasteMet: boolean;
  };
  overallStatus: InventoryStatusType;
  statusLabelVi: string;
  statusLabelEn: string;
  statusDescriptionVi: string;
  statusDescriptionEn: string;
  badgeColor: 'emerald' | 'amber' | 'slate' | 'rose';
  isAssessmentDateSupported: boolean;
  isInputValid: boolean;
  validationErrorsVi: string[];
  validationErrorsEn: string[];
  legalBasis: {
    title: string;
    article: string;
    url: string;
  };
}

export function assessInventoryObligation(params: {
  assessmentDate: string;
  isInQd699: boolean;
  inventoryListMatch: 'Yes' | 'No' | 'Unknown';
  facilityType: FacilityCategory;
  annualGhg: number | null;
  annualToe: number | null;
  wasteCapacity: number | null;
  currentDate?: string;
}): InventoryAssessmentResult {
  const {
    assessmentDate,
    inventoryListMatch,
    facilityType,
    annualGhg,
    annualToe,
    wasteCapacity,
    currentDate
  } = params;

  const validationErrorsVi: string[] = [];
  const validationErrorsEn: string[] = [];
  const addError = (vi: string, en: string) => {
    validationErrorsVi.push(vi);
    validationErrorsEn.push(en);
  };
  const isIsoDate = isValidIsoDate(assessmentDate);
  const isAssessmentDateSupported = isIsoDate && assessmentDate >= '2024-10-01';
  if (!isIsoDate) {
    addError('Ngày đánh giá không hợp lệ.', 'Assessment date is invalid.');
  } else if (!isAssessmentDateSupported) {
    addError('Simulator chỉ hỗ trợ ngày đánh giá từ 01/10/2024.', 'The simulator supports assessment dates from 1 October 2024.');
  }
  const validateNonNegative = (labelVi: string, labelEn: string, value: number | null) => {
    if (value !== null && (!Number.isFinite(value) || value < 0)) {
      addError(`${labelVi} phải là số hữu hạn không âm.`, `${labelEn} must be a finite, non-negative number.`);
    }
  };
  validateNonNegative('Phát thải KNK hằng năm', 'Annual GHG emissions', annualGhg);
  validateNonNegative('Mức tiêu thụ năng lượng', 'Annual energy consumption', annualToe);
  validateNonNegative('Công suất xử lý chất thải', 'Waste treatment capacity', wasteCapacity);
  const isInputValid = validationErrorsVi.length === 0;

  // 1. Determine effective inventory list based on assessment date
  // Cutoff is 2026-09-25
  const isAfterSept25_2026 = isAssessmentDateSupported && assessmentDate >= '2026-09-25';
  const applicableList = !isAssessmentDateSupported
    ? 'Chưa xác định'
    : isAfterSept25_2026
    ? 'Quyết định 42/2026/QĐ-TTg'
    : 'Quyết định 13/2024/QĐ-TTg';
  const listEffectivePeriod = !isAssessmentDateSupported
    ? 'Ngoài phạm vi ngày được hỗ trợ'
    : isAfterSept25_2026
    ? 'Có hiệu lực từ 25/09/2026 (Thay thế QĐ 13/2024)'
    : 'Có hiệu lực từ 01/10/2024 đến hết 24/09/2026';
  const listEffectivePeriodEn = !isAssessmentDateSupported
    ? 'Outside the supported assessment-date range'
    : isAfterSept25_2026
    ? 'Effective from 25/09/2026 (replaces Decision 13/2024)'
    : 'Effective from 01/10/2024 through 24/09/2026';

  let dateWarning = 'OK';
  let dateWarningEn = 'OK';
  let isDateWarning = false;
  const todayStr = currentDate ?? toLocalIsoDate(new Date());
  if (isAssessmentDateSupported && assessmentDate < '2026-09-25' && todayStr >= '2026-09-25') {
    dateWarning = 'Ngày đánh giá sử dụng danh mục kiểm kê đã hết hiệu lực (QĐ 13).';
    dateWarningEn = 'The assessment date uses an inventory list that is no longer effective (Decision 13).';
    isDateWarning = true;
  } else if (isAssessmentDateSupported && assessmentDate >= '2026-09-25' && todayStr < '2026-09-25') {
    dateWarning = 'Ngày đánh giá trong tương lai; Quyết định 42 đã ban hành nhưng chưa đến ngày hiệu lực (25/09/2026).';
    dateWarningEn = 'The assessment date is in the future; Decision 42 has been issued but is not effective until 25/09/2026.';
    isDateWarning = true;
  }

  // 2. Article 6 criteria test (48/VBHN-BNNMT Điều 6)
  const ghgMet = isInputValid && annualGhg !== null && annualGhg >= 3000;
  
  let toeMet = false;
  if (isInputValid && annualToe !== null && annualToe >= 1000) {
    if (
      facilityType === 'Thermal power' || 
      facilityType === 'Industrial production' || 
      facilityType === 'Freight transport' || 
      facilityType === 'Commercial building'
    ) {
      toeMet = true;
    }
  }

  let wasteMet = false;
  if (isInputValid && facilityType === 'Solid waste treatment' && wasteCapacity !== null && wasteCapacity >= 65000) {
    wasteMet = true;
  }

  let criteriaTest: 'MEETS_CRITERIA' | 'DOES_NOT_MEET_CRITERIA' | 'INSUFFICIENT_DATA' = 'INSUFFICIENT_DATA';
  const requiresToe = ['Thermal power', 'Industrial production', 'Freight transport', 'Commercial building'].includes(facilityType);
  const requiresWasteCapacity = facilityType === 'Solid waste treatment';
  const hasAllRelevantCriteria = annualGhg !== null
    && (!requiresToe || annualToe !== null)
    && (!requiresWasteCapacity || wasteCapacity !== null);

  if (!isInputValid) {
    criteriaTest = 'INSUFFICIENT_DATA';
  } else if (ghgMet || toeMet || wasteMet) {
    criteriaTest = 'MEETS_CRITERIA';
  } else if (!facilityType) {
    criteriaTest = 'INSUFFICIENT_DATA';
  } else if (hasAllRelevantCriteria) {
    criteriaTest = 'DOES_NOT_MEET_CRITERIA';
  } else {
    criteriaTest = 'INSUFFICIENT_DATA';
  }

  // 3. Overall Inventory Obligation Status
  let overallStatus: InventoryStatusType;
  let statusLabelVi = '';
  let statusLabelEn = '';
  let statusDescriptionVi = '';
  let statusDescriptionEn = '';
  let badgeColor: 'emerald' | 'amber' | 'slate' | 'rose' = 'slate';

  if (!isAssessmentDateSupported) {
    overallStatus = 'INVALID_DATE';
    statusLabelVi = 'KHÔNG THỂ ĐÁNH GIÁ — NGÀY KHÔNG HỢP LỆ HOẶC NGOÀI PHẠM VI';
    statusLabelEn = 'ASSESSMENT UNAVAILABLE — INVALID OR UNSUPPORTED DATE';
    statusDescriptionVi = validationErrorsVi.join(' ');
    statusDescriptionEn = validationErrorsEn.join(' ');
    badgeColor = 'rose';
  } else if (!isInputValid) {
    overallStatus = 'UNDETERMINED';
    statusLabelVi = 'CHƯA XÁC ĐỊNH — ĐẦU VÀO KHÔNG HỢP LỆ';
    statusLabelEn = 'UNDETERMINED — INVALID INPUT';
    statusDescriptionVi = validationErrorsVi.join(' ');
    statusDescriptionEn = validationErrorsEn.join(' ');
    badgeColor = 'rose';
  } else if (inventoryListMatch === 'Yes') {
    overallStatus = 'YES';
    statusLabelVi = 'CÓ NGHĨA VỤ KIỂM KÊ (ĐỐI CHIẾU DANH MỤC)';
    statusLabelEn = 'YES — OFFICIAL LIST MATCH';
    statusDescriptionVi = 'Đã xác nhận cơ sở có tên trong Danh mục cơ sở phát thải KNK phải thực hiện kiểm kê KNK của Thủ tướng Chính phủ.';
    statusDescriptionEn = 'Confirmed match in the effective Prime Minister inventory list.';
    badgeColor = 'emerald';
  } else if (criteriaTest === 'MEETS_CRITERIA') {
    overallStatus = 'MEETS_CRITERIA';
    statusLabelVi = 'ĐẠT TIÊU CHÍ ĐIỀU 6 — CẦN ĐỐI CHIẾU DANH MỤC';
    statusLabelEn = 'MEETS ARTICLE 6 CRITERIA — VERIFY OFFICIAL LIST';
    statusDescriptionVi = 'Số liệu nhập đạt ngưỡng quy định tại Điều 6 (phát thải >= 3,000 tCO2e hoặc năng lượng >= 1,000 TOE). Cần kiểm tra tên trong danh mục chính thức có hiệu lực của Thủ tướng.';
    statusDescriptionEn = 'Entered data exceeds Article 6 statutory thresholds. Requires verification against effective official list.';
    badgeColor = 'amber';
  } else if (inventoryListMatch === 'Unknown' || criteriaTest === 'INSUFFICIENT_DATA') {
    overallStatus = 'UNDETERMINED';
    statusLabelVi = 'CHƯA XÁC ĐỊNH — THIẾU DỮ LIỆU HOẶC CHƯA TRA CỨU';
    statusLabelEn = 'UNDETERMINED — MISSING DATA OR UNCHECKED LIST';
    statusDescriptionVi = 'Hệ thống không tự suy đoán. Cần nhập đầy đủ mức tiêu thụ năng lượng/phát thải hoặc xác nhận tình trạng tra cứu trong danh mục của Thủ tướng.';
    statusDescriptionEn = 'Simulator does not infer without data. Please input emission/energy data or confirm official list status.';
    badgeColor = 'slate';
  } else {
    overallStatus = 'NO_EVIDENCE';
    statusLabelVi = 'CHƯA CÓ BẰNG CHỨNG THUỘC DIỆN KIỂM KÊ';
    statusLabelEn = 'NO EVIDENCE FROM ENTERED DATA';
    statusDescriptionVi = 'Số liệu nhập dưới các ngưỡng quy định tại Điều 6 và không có tên trong các danh mục chính thức hiện hành.';
    statusDescriptionEn = 'Entered figures are below Article 6 criteria and not found on loaded official lists.';
    badgeColor = 'rose';
  }

  return {
    applicableList,
    listEffectivePeriod,
    listEffectivePeriodEn,
    dateWarning,
    dateWarningEn,
    isDateWarning,
    criteriaTest,
    criteriaDetails: {
      ghgMet,
      toeMet,
      wasteMet
    },
    overallStatus,
    statusLabelVi,
    statusLabelEn,
    statusDescriptionVi,
    statusDescriptionEn,
    badgeColor,
    isAssessmentDateSupported,
    isInputValid,
    validationErrorsVi,
    validationErrorsEn,
    legalBasis: {
      title: 'Văn bản hợp nhất 48/VBHN-BNNMT, Điều 6 & ' + applicableList,
      article: 'Điều 6 quy định tiêu chí kiểm kê KNK; QĐ 13/QĐ 42 ban hành danh mục',
      url: isAfterSept25_2026 
        ? 'https://vanban.chinhphu.vn/?classid=1&docid=219154&pageid=27160&typegroupid=5'
        : 'https://vanban.chinhphu.vn/?classid=1&docid=210939&pageid=27160&typegroupid=5'
    }
  };
}

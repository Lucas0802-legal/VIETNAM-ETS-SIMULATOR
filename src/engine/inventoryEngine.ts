import { FacilityCategory, InventoryStatusType } from '../types';

export interface InventoryAssessmentResult {
  applicableList: string;
  listEffectivePeriod: string;
  dateWarning: string;
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
}): InventoryAssessmentResult {
  const {
    assessmentDate,
    isInQd699,
    inventoryListMatch,
    facilityType,
    annualGhg,
    annualToe,
    wasteCapacity
  } = params;

  // 1. Determine effective inventory list based on assessment date
  // Cutoff is 2026-09-25
  const isAfterSept25_2026 = assessmentDate >= '2026-09-25';
  const applicableList = isAfterSept25_2026 
    ? 'Quyết định 42/2026/QĐ-TTg' 
    : 'Quyết định 13/2024/QĐ-TTg';
  const listEffectivePeriod = isAfterSept25_2026
    ? 'Có hiệu lực từ 25/09/2026 (Thay thế QĐ 13/2024)'
    : 'Có hiệu lực từ 01/10/2024 đến hết 24/09/2026';

  let dateWarning = 'OK';
  let isDateWarning = false;
  // Compare with current actual date: 2026-09-14
  const todayStr = '2026-09-14';
  if (assessmentDate < '2026-09-25' && todayStr >= '2026-09-25') {
    dateWarning = 'Ngày đánh giá sử dụng danh mục kiểm kê đã hết hiệu lực (QĐ 13).';
    isDateWarning = true;
  } else if (assessmentDate >= '2026-09-25' && todayStr < '2026-09-25') {
    dateWarning = 'Ngày đánh giá trong tương lai; Quyết định 42 đã ban hành nhưng chưa đến ngày hiệu lực (25/09/2026).';
    isDateWarning = true;
  }

  // 2. Article 6 criteria test (48/VBHN-BNNMT Điều 6)
  const ghgMet = annualGhg !== null && annualGhg >= 3000;
  
  let toeMet = false;
  if (annualToe !== null && annualToe >= 1000) {
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
  if (facilityType === 'Solid waste treatment' && wasteCapacity !== null && wasteCapacity >= 65000) {
    wasteMet = true;
  }

  let criteriaTest: 'MEETS_CRITERIA' | 'DOES_NOT_MEET_CRITERIA' | 'INSUFFICIENT_DATA' = 'INSUFFICIENT_DATA';
  if (ghgMet || toeMet || wasteMet) {
    criteriaTest = 'MEETS_CRITERIA';
  } else if (!facilityType) {
    criteriaTest = 'INSUFFICIENT_DATA';
  } else if (annualGhg !== null || annualToe !== null || wasteCapacity !== null) {
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

  if (isInQd699) {
    overallStatus = 'YES';
    statusLabelVi = 'CÓ NGHĨA VỤ KIỂM KÊ (CHÍNH THỨC)';
    statusLabelEn = 'YES — OFFICIAL INVENTORY OBLIGATION';
    statusDescriptionVi = 'Cơ sở thuộc danh mục QĐ 699/QĐ-BNNMT, nằm trong phạm vi danh mục kiểm kê quốc gia làm cơ sở phân bổ hạn ngạch giai đoạn 2025-2026.';
    statusDescriptionEn = 'Facility listed in Decision 699/QĐ-BNNMT and within the national inventory list basis for 2025-2026 allocation.';
    badgeColor = 'emerald';
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
    dateWarning,
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
    legalBasis: {
      title: 'Văn bản hợp nhất 48/VBHN-BNNMT, Điều 6 & ' + applicableList,
      article: 'Điều 6 quy định tiêu chí kiểm kê KNK; QĐ 13/QĐ 42 ban hành danh mục',
      url: isAfterSept25_2026 
        ? 'https://vanban.chinhphu.vn/?classid=1&docid=219154&pageid=27160&typegroupid=5'
        : 'https://vanban.chinhphu.vn/?classid=1&docid=210939&pageid=27160&typegroupid=5'
    }
  };
}

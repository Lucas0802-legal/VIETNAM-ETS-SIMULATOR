import { ComplianceStatusType } from '../types';

export interface ComplianceCalculationResult {
  isInQd699: boolean;
  phaseAllocationTotal: number;
  directEmis2025: number | null;
  directEmis2026: number | null;
  directEmisTotal: number | null;
  hasDirectEmissions: boolean;
  
  // Caps & Flexibility
  creditCap30Percent: number;
  creditsUsed: number;
  eligibleCredits: number;
  isCreditExceeded: boolean;
  
  borrowingCap15Percent: number;
  borrowedAllowances: number;
  eligibleBorrowed: number;
  isBorrowingExceeded: boolean;
  
  netAllowanceTrades: number;

  // Surrender & Available
  requiredSurrender: number | null;
  availableAllowances: number;
  
  // Position
  complianceGap: number | null; // Available - Required (Positive = Surplus, Negative = Deficit)
  status: ComplianceStatusType;
  statusTextVi: string;
  statusTextEn: string;
  badgeColor: 'emerald' | 'rose' | 'amber' | 'slate';
  
  surrenderDeadline: string;
  legalBasis: {
    title: string;
    article: string;
    url: string;
  };
}

export function calculateCompliance(params: {
  isInQd699: boolean;
  phaseAllocationTotal: number;
  directEmis2025: number | null;
  directEmis2026: number | null;
  creditsUsed: number | null;
  netAllowanceTrades: number | null;
  borrowedAllowances: number | null;
}): ComplianceCalculationResult {
  const {
    isInQd699,
    phaseAllocationTotal,
    directEmis2025,
    directEmis2026,
    creditsUsed = 0,
    netAllowanceTrades = 0,
    borrowedAllowances = 0,
  } = params;

  const rawCredits = creditsUsed || 0;
  const rawTrades = netAllowanceTrades || 0;
  const rawBorrowed = borrowedAllowances || 0;

  // Caps
  const creditCap30Percent = phaseAllocationTotal * 0.30;
  const isCreditExceeded = rawCredits > creditCap30Percent;
  const eligibleCredits = Math.min(rawCredits, creditCap30Percent);

  const borrowingCap15Percent = phaseAllocationTotal * 0.15;
  const isBorrowingExceeded = rawBorrowed > borrowingCap15Percent;
  const eligibleBorrowed = Math.min(rawBorrowed, borrowingCap15Percent);

  // Direct emissions
  const hasDirectEmissions = directEmis2025 !== null && directEmis2026 !== null;
  const directEmisTotal = hasDirectEmissions 
    ? (directEmis2025 || 0) + (directEmis2026 || 0) 
    : null;

  // Surrender & Available
  // Article 19(5)(a): Surrender must be at least direct emissions minus carbon credits used
  const requiredSurrender = directEmisTotal !== null
    ? Math.max(0, directEmisTotal - eligibleCredits)
    : null;

  const availableAllowances = phaseAllocationTotal + rawTrades + eligibleBorrowed;

  // Gap = Available - Required
  const complianceGap = requiredSurrender !== null
    ? availableAllowances - requiredSurrender
    : null;

  // Status
  let status: ComplianceStatusType;
  let statusTextVi = '';
  let statusTextEn = '';
  let badgeColor: 'emerald' | 'rose' | 'amber' | 'slate' = 'slate';

  if (!isInQd699 || phaseAllocationTotal <= 0) {
    status = 'NOT_APPLICABLE';
    statusTextVi = 'KHÔNG ÁP DỤNG — Cơ sở không có hạn ngạch chính thức trong QĐ 699';
    statusTextEn = 'NOT APPLICABLE — No QD699 quota allocation assigned';
    badgeColor = 'slate';
  } else if (!hasDirectEmissions) {
    status = 'MISSING_DIRECT_EMISSIONS';
    statusTextVi = 'CHƯA ĐỦ SỐ LIỆU — Cần nhập phát thải trực tiếp đã thẩm định của cả 2 năm (2025 & 2026)';
    statusTextEn = 'MISSING DIRECT EMISSIONS — Enter verified emissions for both 2025 and 2026';
    badgeColor = 'amber';
  } else if (isCreditExceeded) {
    status = 'INVALID_CREDITS';
    statusTextVi = `LỖI GIỚI HẠN — Tín chỉ carbon (${rawCredits.toLocaleString()} tCO2e) vượt trần 30% (${creditCap30Percent.toLocaleString()} tCO2e)`;
    statusTextEn = `INVALID — Carbon credits exceed statutory 30% cap (${creditCap30Percent.toLocaleString()} tCO2e)`;
    badgeColor = 'rose';
  } else if (isBorrowingExceeded) {
    status = 'INVALID_BORROWING';
    statusTextVi = `LỖI GIỚI HẠN — Vay mượn (${rawBorrowed.toLocaleString()} tCO2e) vượt trần 15% (${borrowingCap15Percent.toLocaleString()} tCO2e)`;
    statusTextEn = `INVALID — Borrowed allowances exceed statutory 15% cap (${borrowingCap15Percent.toLocaleString()} tCO2e)`;
    badgeColor = 'rose';
  } else if (complianceGap !== null && complianceGap > 0) {
    status = 'SURPLUS';
    statusTextVi = `DƯ THỪA HẠN NGẠCH (+${complianceGap.toLocaleString(undefined, { maximumFractionDigits: 0 })} tCO2e)`;
    statusTextEn = `SURPLUS (+${complianceGap.toLocaleString(undefined, { maximumFractionDigits: 0 })} tCO2e)`;
    badgeColor = 'emerald';
  } else if (complianceGap !== null && complianceGap < 0) {
    status = 'DEFICIT';
    statusTextVi = `THÂM HỤT HẠN NGẠCH (${complianceGap.toLocaleString(undefined, { maximumFractionDigits: 0 })} tCO2e)`;
    statusTextEn = `DEFICIT (${complianceGap.toLocaleString(undefined, { maximumFractionDigits: 0 })} tCO2e)`;
    badgeColor = 'rose';
  } else {
    status = 'BALANCED';
    statusTextVi = 'CÂN BẰNG HOÀN TOÀN (0 tCO2e)';
    statusTextEn = 'BALANCED (0 tCO2e)';
    badgeColor = 'emerald';
  }

  return {
    isInQd699,
    phaseAllocationTotal,
    directEmis2025,
    directEmis2026,
    directEmisTotal,
    hasDirectEmissions,
    creditCap30Percent,
    creditsUsed: rawCredits,
    eligibleCredits,
    isCreditExceeded,
    borrowingCap15Percent,
    borrowedAllowances: rawBorrowed,
    eligibleBorrowed,
    isBorrowingExceeded,
    netAllowanceTrades: rawTrades,
    requiredSurrender,
    availableAllowances,
    complianceGap,
    status,
    statusTextVi,
    statusTextEn,
    badgeColor,
    surrenderDeadline: '31/12/2027',
    legalBasis: {
      title: 'Văn bản hợp nhất 48/VBHN-BNNMT, Điều 19 & Quyết định 699/QĐ-BNNMT',
      article: 'Điều 19 quy định về nộp bù hạn ngạch, trần bù trừ tín chỉ 30% và vay mượn 15%',
      url: 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/4/48-vbhn-bnnmt.pdf'
    }
  };
}

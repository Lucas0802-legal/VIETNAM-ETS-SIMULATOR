import { DataReadiness, SimulatorState } from '../types';

export interface DataQualityDimension {
  id: string;
  nameVi: string;
  nameEn: string;
  status: DataReadiness;
  detailVi: string;
  detailEn: string;
  legalNote: string;
}

export interface DataQualityReport {
  overallScorePercent: number;
  readyCount: number;
  totalDimensions: number;
  dimensions: DataQualityDimension[];
}

export function evaluateDataQuality(state: SimulatorState, isQuotaFacility: boolean): DataQualityReport {
  const dimensions: DataQualityDimension[] = [];

  // 1. Facility Identity
  const hasIdentity = isQuotaFacility || !!state.manual_facility_name.trim();
  dimensions.push({
    id: 'identity',
    nameVi: 'Nhận diện cơ sở & Mã số thuế',
    nameEn: 'Facility Identity & Tax ID',
    status: hasIdentity ? 'READY' : 'MISSING',
    detailVi: isQuotaFacility
      ? `Đã nhận diện trong danh mục chính thức QĐ 699 (${state.facility_id})`
      : state.manual_facility_name
        ? `Cơ sở tự khai: ${state.manual_facility_name}`
        : 'Chưa chọn cơ sở hoặc chưa nhập tên cơ sở',
    detailEn: isQuotaFacility
      ? `Resolved in official Decision 699 list (${state.facility_id})`
      : state.manual_facility_name
        ? `Manual facility: ${state.manual_facility_name}`
        : 'No facility selected or name provided',
    legalNote: 'Quyết định 699/QĐ-BNNMT & Đăng ký kinh doanh'
  });

  // 2. Inventory Obligation Inputs
  const hasInventoryData = state.inventory_list_match !== 'Unknown' || (state.annual_ghg !== null || state.annual_toe !== null);
  dimensions.push({
    id: 'inventory',
    nameVi: 'Dữ liệu Thẩm định Kiểm kê KNK',
    nameEn: 'GHG Inventory Assessment Data',
    status: state.inventory_list_match === 'Yes' 
      ? 'READY' 
      : hasInventoryData 
        ? 'PARTIAL' 
        : 'MISSING',
    detailVi: state.inventory_list_match === 'Yes'
      ? 'Đã xác nhận có tên trong Danh mục của Thủ tướng Chính phủ'
      : state.annual_ghg !== null
        ? `Đã nhập phát thải kiểm kê: ${state.annual_ghg.toLocaleString()} tCO2e (Cần tra cứu danh mục chính thức)`
        : 'Chưa nhập số liệu kiểm kê KNK hoặc đối chiếu danh mục QĐ 13/QĐ 42',
    detailEn: state.inventory_list_match === 'Yes'
      ? 'Confirmed match in official Prime Minister inventory list'
      : state.annual_ghg !== null
        ? `Entered inventory emission: ${state.annual_ghg.toLocaleString()} tCO2e (Requires official list lookup)`
        : 'No inventory emissions or PM list verification entered',
    legalNote: 'VBHN 48/VBHN-BNNMT Điều 6 & QĐ 13/2024, QĐ 42/2026'
  });

  // 3. Historical Production & Emissions (3 years)
  const prodFilled = [state.prod_y3, state.prod_y2, state.prod_y1].filter(v => v !== null).length;
  const emisFilled = [state.emis_y3, state.emis_y2, state.emis_y1].filter(v => v !== null).length;
  const totalHistFilled = prodFilled + emisFilled;

  dimensions.push({
    id: 'historical',
    nameVi: 'Số liệu Sản lượng & Phát thải lịch sử (3 năm)',
    nameEn: '3-Year Historical Production & Emissions',
    status: totalHistFilled === 6 ? 'READY' : totalHistFilled > 0 ? 'PARTIAL' : 'MISSING',
    detailVi: totalHistFilled === 6
      ? 'Đầy đủ số liệu sản lượng và phát thải chu kỳ 3 năm phục vụ tính P̄ và Ē'
      : totalHistFilled > 0
        ? `Đã điền ${totalHistFilled}/6 giá trị lịch sử. Còn thiếu ${6 - totalHistFilled} trường dữ liệu`
        : 'Chưa có số liệu lịch sử 3 năm (Hệ thống không tự bịa đặt số liệu phát thải)',
    detailEn: totalHistFilled === 6
      ? 'Complete 3-year production and emissions data for P_avg and E_avg'
      : totalHistFilled > 0
        ? `Filled ${totalHistFilled}/6 historical values. Missing ${6 - totalHistFilled} fields`
        : 'No 3-year historical data (Simulator will not fabricate facility emissions)',
    legalNote: 'Nghị định 06/2022/NĐ-CP (sửa đổi), Phụ lục I - Phương pháp 01'
  });

  // 4. Sector Benchmark B
  dimensions.push({
    id: 'benchmark',
    nameVi: 'Định mức phát thải ngành (Benchmark B)',
    nameEn: 'Sector Emission Benchmark (B)',
    status: state.benchmark_override !== null && state.benchmark_override > 0 ? 'READY' : 'MISSING',
    detailVi: state.benchmark_override !== null && state.benchmark_override > 0
      ? `Đang sử dụng giá trị kịch bản: ${state.benchmark_override} (Giá trị mô phỏng — Không phải benchmark chính thức của Bộ)`
      : 'Chưa công bố Benchmark chính thức cấp ngành cho kỳ 2025-2026. Có thể bật ô Kịch bản để thử nghiệm.',
    detailEn: state.benchmark_override !== null && state.benchmark_override > 0
      ? `Using scenario testing value: ${state.benchmark_override} (Scenario value — Not official ministry benchmark)`
      : 'Official sector benchmark not yet promulgated. Use scenario override to test.',
    legalNote: 'Bộ TN&MT chưa ban hành Benchmark B chính thức từng ngành'
  });

  // 5. Policy Parameters g / r
  const hasGR = state.g !== null && state.r !== null;
  dimensions.push({
    id: 'policy_gr',
    nameVi: 'Tham số chính sách Tăng trưởng & Giảm phát thải (g, r)',
    nameEn: 'Policy Parameters: Sector Growth & Reduction (g, r)',
    status: hasGR ? 'READY' : 'UNVERIFIED',
    detailVi: hasGR
      ? `Đã nạp tham số kịch bản: g = ${state.g}%, r = ${state.r}% (Hệ số điều chỉnh T = ${((1 + (state.g || 0)/100)*(1 - (state.r || 0)/100)).toFixed(4)})`
      : 'Chưa có thông số g/r được công bố chính thức. Nguyên tắc: Không được tự mặc định = 0%.',
    detailEn: hasGR
      ? `Scenario parameters loaded: g = ${state.g}%, r = ${state.r}% (T factor = ${((1 + (state.g || 0)/100)*(1 - (state.r || 0)/100)).toFixed(4)})`
      : 'Official g/r parameters not published. Core guardrail: Never default to 0%.',
    legalNote: 'Thông tư chuyên ngành & Quyết định giao mục tiêu NDC'
  });

  // 6. Direct Compliance Emissions
  const hasComplianceEmis = state.direct_emis_2025 !== null && state.direct_emis_2026 !== null;
  dimensions.push({
    id: 'compliance',
    nameVi: 'Phát thải trực tiếp tuân thủ (Năm 2025 & 2026)',
    nameEn: 'Verified Direct Compliance Emissions (2025 & 2026)',
    status: hasComplianceEmis ? 'READY' : (state.direct_emis_2025 !== null || state.direct_emis_2026 !== null) ? 'PARTIAL' : 'MISSING',
    detailVi: hasComplianceEmis
      ? `Đã nhập phát thải thẩm định 2025 (${state.direct_emis_2025?.toLocaleString()} tCO2e) và 2026 (${state.direct_emis_2026?.toLocaleString()} tCO2e)`
      : 'Thiếu số liệu phát thải trực tiếp đã thẩm định của giai đoạn phân bổ (Không dùng phát thải lịch sử thay thế)',
    detailEn: hasComplianceEmis
      ? `Verified direct emissions entered for 2025 (${state.direct_emis_2025?.toLocaleString()}) and 2026 (${state.direct_emis_2026?.toLocaleString()})`
      : 'Missing verified direct emissions for the compliance phase (Historical E_avg cannot be substituted)',
    legalNote: 'VBHN 48/VBHN-BNNMT Điều 19(5)'
  });

  const readyCount = dimensions.filter(d => d.status === 'READY').length;
  const overallScorePercent = Math.round((readyCount / dimensions.length) * 100);

  return {
    overallScorePercent,
    readyCount,
    totalDimensions: dimensions.length,
    dimensions
  };
}

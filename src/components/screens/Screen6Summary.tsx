import React from 'react';
import { 
  Printer, 
  Download, 
  ShieldCheck, 
  RotateCcw,
  FileCheck2
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';
import { COMPLIANCE_STATUS_VI } from '../../utils/labels';
import { downloadCsv } from '../../utils/csv';

export const Screen6Summary: React.FC = () => {
  const { 
    state, 
    selectedFacility, 
    inventoryResult, 
    allocationResult, 
    complianceResult, 
    dataQualityReport, 
    setIsPrintModalOpen,
    resetSimulation 
  } = useSimulator();
  const { t } = useLanguage();

  // Export CSV function
  const handleExportCSV = () => {
    const missing = t('Thiếu dữ liệu', 'N/A');
    const valueOrMissing = (value: number | null) => value === null ? missing : value;
    const rows = [
      [t('VIETNAM ETS SIMULATOR - BÁO CÁO TỔNG HỢP', 'VIETNAM ETS SIMULATOR - EXECUTIVE SUMMARY REPORT'), ''],
      [t('Ngày đánh giá', 'Assessment Date'), state.assessment_date],
      [t('Mã cơ sở', 'Facility ID'), selectedFacility?.id ?? 'MANUAL'],
      [t('Tên cơ sở', 'Facility Name'), selectedFacility ? t(selectedFacility.name, selectedFacility.name_en) : state.manual_facility_name],
      [t('Mã số thuế', 'Tax ID'), selectedFacility?.tax_id ?? state.manual_tax_id],
      [t('Lĩnh vực', 'Sector'), selectedFacility ? t(selectedFacility.sector_vi, selectedFacility.sector) : state.sector],
      ['', ''],
      [t('PHÂN HỆ 1: NGHĨA VỤ KIỂM KÊ', 'MODULE 1: INVENTORY OBLIGATION'), ''],
      [t('Trạng thái kiểm kê', 'Inventory Status'), inventoryResult.overallStatus],
      [t('Danh mục áp dụng', 'Applicable List'), inventoryResult.applicableList],
      [t('Phát thải KNK hằng năm (tCO2e)', 'Annual GHG (tCO2e)'), valueOrMissing(state.annual_ghg)],
      [t('Năng lượng hằng năm (TOE)', 'Annual Energy (TOE)'), valueOrMissing(state.annual_toe)],
      ['', ''],
      [t('PHÂN HỆ 2: NGHĨA VỤ HẠN NGẠCH ETS', 'MODULE 2: ETS QUOTA OBLIGATION'), ''],
      [t('Có trong QĐ 699', 'In Decision 699 List'), selectedFacility ? t('CÓ', 'YES') : t('CHƯA XÁC MINH', 'UNVERIFIED')],
      [t('Hạn ngạch chính thức 2025 (tCO2e)', 'Official Allocation 2025 (tCO2e)'), selectedFacility?.allocation_2025 ?? missing],
      [t('Hạn ngạch chính thức 2026 (tCO2e)', 'Official Allocation 2026 (tCO2e)'), selectedFacility?.allocation_2026 ?? missing],
      [t('Tổng hạn ngạch giai đoạn (tCO2e)', 'Phase Allocation Total (tCO2e)'), selectedFacility?.allocation_total ?? missing],
      ['', ''],
      [t('PHÂN HỆ 3: MÔ PHỎNG PHÂN BỔ (PHƯƠNG PHÁP 01)', 'MODULE 3: ALLOCATION SIMULATION (METHOD 01)'), ''],
      [t('Trạng thái tính toán', 'Calculation Status'), allocationResult.status],
      [t('Năm mô phỏng', 'Simulation Year'), state.allocation_year],
      [t('Sản lượng lịch sử bình quân (P_avg)', 'Average Historical Production (P_avg)'), valueOrMissing(allocationResult.pAvg)],
      [t('Phát thải lịch sử bình quân (E_avg)', 'Average Historical Emissions (E_avg)'), valueOrMissing(allocationResult.eAvg)],
      [t('Benchmark ngành (B)', 'Sector Benchmark (B)'), valueOrMissing(allocationResult.benchmarkB)],
      [t('Mục tiêu tăng trưởng g (%)', 'Growth target g (%)'), valueOrMissing(state.g)],
      [t('Mục tiêu giảm phát thải r (%)', 'Reduction target r (%)'), valueOrMissing(state.r)],
      [t('Hệ số điều chỉnh T', 'Adjustment Factor T'), valueOrMissing(allocationResult.factorT)],
      [t('Hạn ngạch mô phỏng A (tCO2e)', 'Calculated Allocation A (tCO2e)'), valueOrMissing(allocationResult.calculatedA)],
      [t('Chênh lệch so với chính thức (tCO2e)', 'Difference vs Official (tCO2e)'), valueOrMissing(allocationResult.difference)],
      [t('Chênh lệch (%)', 'Difference %'), allocationResult.differencePercent === null ? missing : `${allocationResult.differencePercent.toFixed(2)}%`],
      ['', ''],
      [t('PHÂN HỆ 4: VỊ THẾ TUÂN THỦ', 'MODULE 4: COMPLIANCE POSITION'), ''],
      [t('Phát thải trực tiếp 2025 (tCO2e)', 'Verified Direct Emissions 2025 (tCO2e)'), valueOrMissing(state.direct_emis_2025)],
      [t('Phát thải trực tiếp 2026 (tCO2e)', 'Verified Direct Emissions 2026 (tCO2e)'), valueOrMissing(state.direct_emis_2026)],
      [t('Tổng phát thải trực tiếp (tCO2e)', 'Direct Emissions Total (tCO2e)'), valueOrMissing(complianceResult.directEmisTotal)],
      [t('Tín chỉ đã sử dụng (tCO2e)', 'Carbon Credits Used (tCO2e)'), complianceResult.creditsUsed],
      [t('Tín chỉ đủ điều kiện (tCO2e)', 'Eligible Credits (tCO2e)'), complianceResult.eligibleCredits],
      [t('Trần tín chỉ 30% (tCO2e)', '30% Credit Cap (tCO2e)'), complianceResult.creditCap30Percent],
      [t('Giao dịch hạn ngạch ròng (tCO2e)', 'Net Allowance Trades (tCO2e)'), complianceResult.netAllowanceTrades],
      [t('Hạn ngạch vay mượn (tCO2e)', 'Borrowed Allowances (tCO2e)'), complianceResult.borrowedAllowances],
      [t('Trần vay mượn 15% (tCO2e)', '15% Borrowing Cap (tCO2e)'), complianceResult.borrowingCap15Percent],
      [t('Nghĩa vụ phải nộp (tCO2e)', 'Required Surrender (tCO2e)'), valueOrMissing(complianceResult.requiredSurrender)],
      [t('Hạn ngạch khả dụng (tCO2e)', 'Available Allowances (tCO2e)'), valueOrMissing(complianceResult.availableAllowances)],
      [t('Chênh lệch tuân thủ (tCO2e)', 'Compliance Gap (tCO2e)'), valueOrMissing(complianceResult.complianceGap)],
      [t('Trạng thái vị thế', 'Compliance Position Status'), complianceResult.status],
      [t('Hạn nộp bù', 'Surrender Deadline'), complianceResult.surrenderDeadline],
      ['', ''],
      [t('PHÂN HỆ 5: ĐỘ ĐẦY ĐỦ, HỢP LỆ VÀ XÁC MINH DỮ LIỆU', 'MODULE 5: DATA COMPLETENESS, VALIDITY & VERIFICATION'), ''],
      [t('Mức độ điền đủ dữ liệu', 'Data Completeness'), `${dataQualityReport.overallScorePercent}%`],
      [t('Trạng thái hợp lệ', 'Validity Status'), dataQualityReport.validityStatus],
      [t('Mức độ xác minh nguồn', 'Source Verification'), dataQualityReport.verificationStatus],
    ];

    downloadCsv(`ETS_Summary_${selectedFacility?.id ?? 'Manual'}_${state.assessment_date}.csv`, rows);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Export Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2 border border-slate-200">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('Phân hệ 06: Hồ sơ Tổng kết & Báo cáo Thẩm định Doanh nghiệp', 'Module 06: Executive Summary & Audit Report')}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('Báo cáo Tổng kết Vị thế ETS & Đánh giá Tuân thủ', 'ETS Executive Summary & Compliance Dossier')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {t(
              'Tất cả kết quả từ danh tính, nghĩa vụ kiểm kê, hạn ngạch được cấp, tính toán mô phỏng đến vị thế thâm hụt/dư thừa và căn cứ pháp lý được tổng hợp hoàn chỉnh.',
              'All findings across identity, inventory obligation, quota allocation, formula simulation, compliance position, and statutory legal evidence assembled.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{t('Xuất tệp CSV', 'Export CSV')}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('In / Tải PDF Báo cáo', 'Print / Download PDF')}</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE DOSSIER CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Dossier Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center font-extrabold font-mono text-sm border border-brand-dark shadow-xs">
              {selectedFacility?.id || 'F-NEW'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {selectedFacility ? t(selectedFacility.name, selectedFacility.name_en) : (state.manual_facility_name || t('Cơ sở tự nhập', 'Manual Facility'))}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('Lĩnh vực:', 'Sector:')} <strong className="text-slate-800">{selectedFacility ? t(selectedFacility.sector_vi, selectedFacility.sector) : state.sector}</strong> • {t('Mã số thuế:', 'Tax ID:')} <span className="font-mono text-slate-800">{selectedFacility?.tax_id || state.manual_tax_id || 'N/A'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {t('Ngày lập báo cáo:', 'Report Date:')} <strong className="text-slate-800">{state.assessment_date}</strong>
            </span>
          </div>
        </div>

        {/* 4 Pillars Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1: Inventory */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t('1. Nghĩa vụ Kiểm kê', '1. GHG Inventory')}
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {inventoryResult.overallStatus === 'YES' ? t('CÓ NGHĨA VỤ', 'MANDATORY') : inventoryResult.overallStatus}
            </div>
            <div className="text-[11px] text-slate-500">
              {inventoryResult.applicableList}
            </div>
          </div>

          {/* Pillar 2: Quota Status */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t('2. Hạn ngạch QĐ 699', '2. Decision 699 Quota')}
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {selectedFacility ? t('THUỘC DIỆN PHÂN BỔ', 'INCLUDED') : t('CHƯA PHÂN BỔ', 'NOT LISTED')}
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              {selectedFacility ? `${selectedFacility.allocation_total.toLocaleString()} tCO2e` : t('Không có số liệu', 'No quota')}
            </div>
          </div>

          {/* Pillar 3: Simulated A vs Official */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t('3. Mô phỏng (A)', '3. Simulated (A)')}
            </div>
            <div className="text-sm font-extrabold text-brand font-mono">
              {allocationResult.calculatedA !== null ? `${allocationResult.calculatedA.toLocaleString(undefined, { maximumFractionDigits: 0 })} tCO2e` : '—'}
            </div>
            <div className="text-[11px] text-slate-500">
              {allocationResult.differencePercent !== null ? `${t('Lệch:', 'Var:')} ${allocationResult.differencePercent.toFixed(1)}%` : t('Chờ tham số', 'Pending params')}
            </div>
          </div>

          {/* Pillar 4: Compliance Gap */}
          <div className={`rounded-xl p-4 border space-y-2 ${
            complianceResult.status === 'SURPLUS'
              ? 'bg-emerald-50 border-emerald-300'
              : complianceResult.status === 'DEFICIT'
                ? 'bg-rose-50 border-rose-300'
                : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {t('4. Vị thế Tuân thủ', '4. Compliance Gap')}
            </div>
            <div className={`text-base font-black font-mono ${
              complianceResult.status === 'SURPLUS'
                ? 'text-emerald-700'
                : complianceResult.status === 'DEFICIT'
                  ? 'text-rose-700'
                  : 'text-slate-700'
            }`}>
              {complianceResult.status === 'SURPLUS' && `+${complianceResult.complianceGap?.toLocaleString()} tCO2e`}
              {complianceResult.status === 'DEFICIT' && `${complianceResult.complianceGap?.toLocaleString()} tCO2e`}
              {complianceResult.status !== 'SURPLUS' && complianceResult.status !== 'DEFICIT' && t(COMPLIANCE_STATUS_VI[complianceResult.status] ?? 'N/A', complianceResult.status || 'N/A')}
            </div>
            <div className="text-[11px] text-slate-500">
              {t('Hạn nộp:', 'Deadline:')} {complianceResult.surrenderDeadline}
            </div>
          </div>

        </div>

        {/* Detailed Table breakdown */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-50 px-4 py-3 font-bold text-slate-800 border-b border-slate-200">
            {t('Chi tiết Bảng cân đối Tuân thủ Hạn ngạch', 'Surrender Balance Sheet Details')}
          </div>
          
          <div className="divide-y divide-slate-100">
            <div className="px-4 py-2.5 flex justify-between">
              <span className="text-slate-600">{t('Tổng hạn ngạch được cấp chính thức (QĐ 699)', 'Official Allocated Allowances (Dec 699)')}</span>
              <span className="font-mono font-bold text-slate-900">{complianceResult.phaseAllocationTotal.toLocaleString()} tCO2e</span>
            </div>

            <div className="px-4 py-2.5 flex justify-between">
              <span className="text-slate-600">{t('Giao dịch hạn ngạch ròng (+Mua / -Bán)', 'Net Allowance Trades (+Buy / -Sell)')}</span>
              <span className="font-mono font-semibold text-slate-800">
                {(complianceResult.netAllowanceTrades || 0) > 0 ? '+' : ''}{complianceResult.netAllowanceTrades.toLocaleString()} tCO2e
              </span>
            </div>

            <div className="px-4 py-2.5 flex justify-between">
              <span className="text-slate-600">{t('Hạn ngạch vay mượn từ chu kỳ sau (Tối đa 15%)', 'Borrowed Allowances from Next Phase (Max 15%)')}</span>
              <span className="font-mono font-semibold text-slate-800">
                +{complianceResult.eligibleBorrowed.toLocaleString()} tCO2e
              </span>
            </div>

            <div className="px-4 py-2.5 flex justify-between bg-emerald-50/50 font-bold">
              <span className="text-blue-950">{t('TỔNG HẠN NGẠCH KHẢ DỤNG', 'TOTAL AVAILABLE ALLOWANCES')}</span>
              <span className="font-mono text-brand">{complianceResult.availableAllowances !== null ? `${complianceResult.availableAllowances.toLocaleString()} tCO2e` : '—'}</span>
            </div>

            <div className="px-4 py-2.5 flex justify-between">
              <span className="text-slate-600">{t('Tổng phát thải trực tiếp giai đoạn tuân thủ (2025 + 2026)', 'Total Verified Direct Emissions (2025 + 2026)')}</span>
              <span className="font-mono font-semibold text-slate-800">
                {complianceResult.directEmisTotal !== null ? `${complianceResult.directEmisTotal.toLocaleString()} tCO2e` : '—'}
              </span>
            </div>

            <div className="px-4 py-2.5 flex justify-between">
              <span className="text-slate-600">{t('Tín chỉ carbon bù trừ đủ điều kiện (Tối đa 30%)', 'Eligible Carbon Credits for Offset (Max 30%)')}</span>
              <span className="font-mono font-semibold text-emerald-700">
                -{complianceResult.eligibleCredits.toLocaleString()} tCO2e
              </span>
            </div>

            <div className="px-4 py-2.5 flex justify-between bg-slate-100 font-bold">
              <span className="text-slate-900">{t('NGHĨA VỤ NỘP BÙ THỰC TẾ', 'REQUIRED SURRENDER')}</span>
              <span className="font-mono text-slate-900">
                {complianceResult.requiredSurrender !== null ? `${complianceResult.requiredSurrender.toLocaleString()} tCO2e` : '—'}
              </span>
            </div>

            <div className={`px-4 py-3 flex justify-between text-sm font-extrabold ${
              complianceResult.status === 'SURPLUS' ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
            }`}>
              <span>{t('CHÊNH LỆCH TUÂN THỦ (COMPLIANCE GAP)', 'COMPLIANCE GAP')}</span>
              <span className="font-mono">
                {complianceResult.complianceGap !== null ? `${complianceResult.complianceGap >= 0 ? '+' : ''}${complianceResult.complianceGap.toLocaleString()} tCO2e` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Legal citations list */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t('Các căn cứ pháp lý cốt lõi áp dụng trong Báo cáo:', 'Governing Legal Authorities Cited in this Dossier:')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <div>• <strong>VBHN 48/VBHN-BNNMT</strong>: Nghị định 06/2022 sửa đổi (Điều 6, 12, 19)</div>
            <div>• <strong>Quyết định 699/QĐ-BNNMT</strong>: Phân bổ 110 cơ sở thí điểm</div>
            <div>• <strong>Quyết định 263/QĐ-TTg</strong>: Phê duyệt tổng hạn ngạch KNK quốc gia</div>
            <div>• <strong>Quyết định 13 & 42/QĐ-TTg</strong>: Danh mục kiểm kê KNK quốc gia</div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={resetSimulation}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('Đặt lại toàn bộ và bắt đầu phiên mới', 'Reset and start new session')}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {t('Xuất bảng CSV', 'Download CSV')}
            </button>

            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('In Báo cáo Thẩm định', 'Print Official Dossier')}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

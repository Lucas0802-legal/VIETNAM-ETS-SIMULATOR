import React from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Building2, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  RotateCcw,
  Layers,
  FileBadge,
  FileCheck2
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';
import { LegalButton } from '../legal/LegalButton';

export const Screen8Summary: React.FC = () => {
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
  const { language, t } = useLanguage();

  // Export CSV function
  const handleExportCSV = () => {
    const rows = [
      ['VIETNAM ETS SIMULATOR - EXECUTIVE SUMMARY REPORT', ''],
      ['Assessment Date', state.assessment_date],
      ['Facility ID', selectedFacility?.id || 'MANUAL'],
      ['Facility Name', selectedFacility?.name || state.manual_facility_name],
      ['Tax ID', selectedFacility?.tax_id || state.manual_tax_id],
      ['Sector', selectedFacility?.sector || state.sector],
      ['', ''],
      ['MODULE 1: INVENTORY OBLIGATION', ''],
      ['Inventory Status', inventoryResult.overallStatus],
      ['Applicable List', inventoryResult.applicableList],
      ['Annual GHG (tCO2e)', state.annual_ghg || 'N/A'],
      ['Annual Energy (TOE)', state.annual_toe || 'N/A'],
      ['', ''],
      ['MODULE 2: ETS QUOTA OBLIGATION', ''],
      ['In Decision 699 List', selectedFacility ? 'YES' : 'NO'],
      ['Official Allocation 2025 (tCO2e)', selectedFacility?.allocation_2025 || 0],
      ['Official Allocation 2026 (tCO2e)', selectedFacility?.allocation_2026 || 0],
      ['Phase Allocation Total (tCO2e)', selectedFacility?.allocation_total || 0],
      ['', ''],
      ['MODULE 3: ALLOCATION SIMULATION (METHOD 01)', ''],
      ['Simulation Year', state.allocation_year],
      ['Average Historical Production (P_avg)', allocationResult.pAvg || 'N/A'],
      ['Average Historical Emissions (E_avg)', allocationResult.eAvg || 'N/A'],
      ['Sector Benchmark (B)', allocationResult.benchmarkB || 'N/A'],
      ['Growth target g (%)', state.g || 'N/A'],
      ['Reduction target r (%)', state.r || 'N/A'],
      ['Adjustment Factor T', allocationResult.factorT || 'N/A'],
      ['Calculated Allocation A (tCO2e)', allocationResult.calculatedA || 'N/A'],
      ['Difference vs Official (tCO2e)', allocationResult.difference || 'N/A'],
      ['Difference %', allocationResult.differencePercent ? `${allocationResult.differencePercent.toFixed(2)}%` : 'N/A'],
      ['', ''],
      ['MODULE 4: COMPLIANCE POSITION', ''],
      ['Verified Direct Emissions 2025 (tCO2e)', state.direct_emis_2025 || 0],
      ['Verified Direct Emissions 2026 (tCO2e)', state.direct_emis_2026 || 0],
      ['Direct Emissions Total (tCO2e)', complianceResult.directEmisTotal || 0],
      ['Carbon Credits Used (tCO2e)', complianceResult.creditsUsed],
      ['Eligible Credits (tCO2e)', complianceResult.eligibleCredits],
      ['30% Credit Cap (tCO2e)', complianceResult.creditCap30Percent],
      ['Net Allowance Trades (tCO2e)', complianceResult.netAllowanceTrades],
      ['Borrowed Allowances (tCO2e)', complianceResult.borrowedAllowances],
      ['15% Borrowing Cap (tCO2e)', complianceResult.borrowingCap15Percent],
      ['Required Surrender (tCO2e)', complianceResult.requiredSurrender || 'N/A'],
      ['Available Allowances (tCO2e)', complianceResult.availableAllowances],
      ['Compliance Gap (tCO2e)', complianceResult.complianceGap || 'N/A'],
      ['Compliance Position Status', complianceResult.status],
      ['Surrender Deadline', complianceResult.surrenderDeadline],
      ['', ''],
      ['MODULE 5: DATA READINESS & AUDIT', ''],
      ['Data Readiness Score', `${dataQualityReport.overallScorePercent}%`],
      ['Ready Dimensions', `${dataQualityReport.readyCount}/${dataQualityReport.totalDimensions}`],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.map(cell => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ETS_Summary_${selectedFacility?.id || 'Manual'}_${state.assessment_date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Export Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2 border border-slate-200">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('Phân hệ 08: Hồ sơ Tổng kết & Báo cáo Thẩm định Doanh nghiệp', 'Module 08: Executive Summary & Audit Report')}
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
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold font-mono text-sm border border-slate-800 shadow-xs">
              {selectedFacility?.id || 'F-NEW'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {selectedFacility?.name || state.manual_facility_name || t('Cơ sở tự nhập', 'Manual Facility')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('Lĩnh vực:', 'Sector:')} <strong className="text-slate-800">{selectedFacility?.sector_vi || state.sector}</strong> • {t('Mã số thuế:', 'Tax ID:')} <span className="font-mono text-slate-800">{selectedFacility?.tax_id || state.manual_tax_id || 'N/A'}</span>
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
            <div className="text-sm font-extrabold text-blue-700 font-mono">
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
              {complianceResult.status !== 'SURPLUS' && complianceResult.status !== 'DEFICIT' && (complianceResult.status || 'N/A')}
            </div>
            <div className="text-[11px] text-slate-500">
              {t('Hạn nộp:', 'Deadline:')} {complianceResult.surrenderDeadline}
            </div>
          </div>

        </div>

        {/* Detailed Table breakdown */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-50 px-4 py-3 font-bold text-slate-800 border-b border-slate-200">
            {t('Chi tiết Bảng cân đối Tuân thủ Hạn ngạch (Surrender Balance Sheet)', 'Surrender Balance Sheet Details')}
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

            <div className="px-4 py-2.5 flex justify-between bg-blue-50/50 font-bold">
              <span className="text-blue-950">{t('TỔNG HẠN NGẠCH KHẢ DỤNG (Available Allowances)', 'TOTAL AVAILABLE ALLOWANCES')}</span>
              <span className="font-mono text-blue-700">{complianceResult.availableAllowances.toLocaleString()} tCO2e</span>
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
              <span className="text-slate-900">{t('NGHĨA VỤ NỘP BÙ THỰC TẾ (Required Surrender)', 'REQUIRED SURRENDER')}</span>
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

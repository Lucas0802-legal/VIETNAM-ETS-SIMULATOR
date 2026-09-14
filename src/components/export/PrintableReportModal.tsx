import React, { useEffect, useRef } from 'react';
import { X, Printer } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';
import { COMPLIANCE_STATUS_VI } from '../../utils/labels';

export const PrintableReportModal: React.FC = () => {
  const { 
    isPrintModalOpen, 
    setIsPrintModalOpen, 
    selectedFacility, 
    state, 
    inventoryResult,
    allocationResult,
    complianceResult,
    dataQualityReport 
  } = useSimulator();
  const { t } = useLanguage();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key & lock background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPrintModalOpen(false);
      }
    };
    if (isPrintModalOpen) {
      const previouslyFocused = document.activeElement as HTMLElement | null;
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previouslyFocused?.focus();
      };
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isPrintModalOpen, setIsPrintModalOpen]);

  if (!isPrintModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-report-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:inset-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsPrintModalOpen(false);
      }}
    >
      
      {/* Modal Container with max-height and flex-col to prevent header overflow */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:overflow-visible print:border-none print:shadow-none print:rounded-none animate-in zoom-in-95 duration-150">
        
        {/* Top Screen Action Header (Sticky, always visible, hidden in print) */}
        <div className="sticky top-0 z-20 shrink-0 bg-brand text-white px-5 sm:px-6 py-3.5 flex items-center justify-between border-b border-brand-dark print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span id="print-report-title" className="font-bold text-sm block leading-tight">
                {t('Bản in Báo cáo Thẩm định Doanh nghiệp', 'Executive Printable Report Preview')}
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                DOC-ETS-{selectedFacility?.id || 'MAN'}-{state.assessment_date.replace(/-/g, '')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('In / Lưu PDF', 'Print / Save PDF')}</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] bg-emerald-800 text-emerald-100 rounded font-mono font-normal">Ctrl+P</kbd>
            </button>
            
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsPrintModalOpen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-dark hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title={t('Đóng bản xem trước (Esc)', 'Close Preview (Esc)')}
            >
              <X className="w-4 h-4" />
              <span>{t('Đóng', 'Close')}</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] bg-slate-700 text-slate-300 rounded font-mono font-normal">Esc</kbd>
            </button>
          </div>
        </div>

        {/* Printable Paper Content (Scrollable inside modal, 100% visible on print) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-slate-900 print:p-0 print:overflow-visible">
          
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                VIETNAM EMISSION TRADING SCHEME (ETS) SIMULATOR
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
                {t('BÁO CÁO THẨM ĐỊNH HẠN NGẠCH & VỊ THẾ TUÂN THỦ ETS', 'ETS ALLOWANCE ASSESSMENT & COMPLIANCE POSITION REPORT')}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(
                  'Căn cứ Nghị định 06/2022/NĐ-CP (sửa đổi theo VBHN 48) và Quyết định 699/QĐ-BNNMT',
                  'Pursuant to Decree 06/2022/NĐ-CP (as consolidated in 48/VBHN-BNNMT) and Decision 699/QĐ-BNNMT'
                )}
              </p>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold font-mono">DOC-ETS-{selectedFacility?.id || 'MAN'}-{state.assessment_date.replace(/-/g, '')}</div>
              <div className="text-slate-500">{t('Ngày lập:', 'Date:')} {state.assessment_date}</div>
              <div className="text-amber-700 font-bold">{t('Bản nháp mô phỏng', 'Simulation draft')}</div>
            </div>
          </div>

          {/* Section 1: Facility Profile */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              {t('I. THÔNG TIN NHẬN DIỆN CƠ SỞ PHÁT THẢI', 'I. EMITTING FACILITY IDENTIFICATION')}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">{t('Tên cơ sở / Doanh nghiệp:', 'Facility / Company name:')}</span>
                <span className="font-bold text-sm text-slate-900">
                  {selectedFacility ? t(selectedFacility.name, selectedFacility.name_en) : (state.manual_facility_name || t('Cơ sở tự do', 'Manual facility'))}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">{t('Mã số thuế & Mã cơ sở:', 'Tax ID & Facility ID:')}</span>
                <span className="font-bold text-sm font-mono text-slate-900">
                  {selectedFacility?.tax_id || state.manual_tax_id || 'N/A'} [{selectedFacility?.id || 'MANUAL'}]
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">{t('Lĩnh vực sản xuất & Đơn vị sản phẩm:', 'Sector & Product unit:')}</span>
                <span className="font-semibold text-slate-800">
                  {selectedFacility ? t(selectedFacility.sector_vi, selectedFacility.sector) : state.sector} ({selectedFacility?.product_unit || 'N/A'})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">{t('Địa chỉ hoạt động:', 'Operating address:')}</span>
                <span className="text-slate-700">{selectedFacility ? t(selectedFacility.address, selectedFacility.address_en) : t('Khai báo theo thực tế', 'As declared')}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Assessment Findings */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              {t('II. KẾT QUẢ THẨM ĐỊNH NGHĨA VỤ PHÁP LÝ', 'II. STATUTORY OBLIGATION ASSESSMENT')}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="text-slate-500 font-bold mb-1">{t('1. Nghĩa vụ Kiểm kê Khí nhà kính (Điều 6):', '1. GHG Inventory Obligation (Article 6):')}</div>
                <div className="font-bold text-slate-900">
                  {t(inventoryResult.statusLabelVi, inventoryResult.statusLabelEn)}
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  {t('Danh mục áp dụng:', 'Applicable list:')} {inventoryResult.applicableList}
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="text-slate-500 font-bold mb-1">{t('2. Nghĩa vụ Hạn ngạch ETS Thí điểm (Điều 12, QĐ 699):', '2. Pilot ETS Quota Obligation (Article 12, Decision 699):')}</div>
                <div className="font-bold text-slate-900">
                  {selectedFacility
                    ? t('THUỘC DIỆN PHÂN BỔ HẠN NGẠCH (QĐ 699)', 'SUBJECT TO QUOTA ALLOCATION (DECISION 699)')
                    : t('CHƯA CÓ TRONG DANH SÁCH PHÂN BỔ HIỆN HÀNH', 'NOT IN THE CURRENT ALLOCATION LIST')}
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-mono">
                  {selectedFacility ? `2025: ${selectedFacility.allocation_2025.toLocaleString()} tCO2e | 2026: ${selectedFacility.allocation_2026.toLocaleString()} tCO2e` : t('Không áp dụng', 'Not applicable')}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Allocation simulation assumptions and result */}
          <div className="space-y-2 print:break-inside-avoid">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              {t('III. MÔ PHỎNG PHÂN BỔ HẠN NGẠCH', 'III. ALLOWANCE ALLOCATION SIMULATION')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="border border-slate-200 rounded-lg p-2"><span className="block text-slate-500">{t('Cửa sổ lịch sử', 'Historical window')}</span><strong>{allocationResult.windowYears.join('–')}</strong></div>
              <div className="border border-slate-200 rounded-lg p-2"><span className="block text-slate-500">P̄</span><strong>{allocationResult.pAvg?.toLocaleString() ?? '—'}</strong></div>
              <div className="border border-slate-200 rounded-lg p-2"><span className="block text-slate-500">B</span><strong>{allocationResult.benchmarkB ?? '—'}</strong></div>
              <div className="border border-slate-200 rounded-lg p-2"><span className="block text-slate-500">g / r</span><strong>{state.g ?? '—'}% / {state.r ?? '—'}%</strong></div>
            </div>
            <div className={`rounded-lg border p-3 text-xs ${allocationResult.status === 'READY' ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
              <span className="font-bold">{t('Trạng thái:', 'Status:')} {t(allocationResult.statusTextVi, allocationResult.statusTextEn)}</span>
              <span className="block mt-1 font-mono">A = {allocationResult.calculatedA?.toLocaleString() ?? '—'} tCO2e</span>
            </div>
          </div>

          {/* Section 4: Surrender Balance Sheet */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              {t('IV. BẢNG CÂN ĐỐI NGHĨA VỤ NỘP BÙ HẠN NGẠCH GIAI ĐOẠN 2025–2026', 'IV. 2025–2026 SURRENDER BALANCE SHEET')}
            </h3>

            <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full min-w-[34rem] text-xs border border-slate-300 print:min-w-0">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                <tr>
                  <th className="p-2 text-left">{t('Chỉ tiêu thẩm định', 'Assessed item')}</th>
                  <th className="p-2 text-center w-32">{t('Căn cứ pháp lý', 'Legal basis')}</th>
                  <th className="p-2 text-right w-40">{t('Khối lượng (tCO2e)', 'Volume (tCO2e)')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2">{t('1. Tổng hạn ngạch được phân bổ chính thức (2025 + 2026)', '1. Total officially allocated allowances (2025 + 2026)')}</td>
                  <td className="p-2 text-center text-slate-500">QĐ 699/QĐ-BNNMT</td>
                  <td className="p-2 text-right font-mono font-bold">{complianceResult.phaseAllocationTotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2">{t('2. Giao dịch mua / bán hạn ngạch ròng', '2. Net allowance purchases / sales')}</td>
                  <td className="p-2 text-center text-slate-500">{t('Sàn giao dịch KNK', 'GHG exchange')}</td>
                  <td className="p-2 text-right font-mono">{(complianceResult.netAllowanceTrades || 0) > 0 ? '+' : ''}{complianceResult.netAllowanceTrades.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2">{t('3. Hạn ngạch vay mượn từ kỳ sau (Đủ điều kiện, trần 15%)', '3. Allowances borrowed from next phase (eligible, 15% cap)')}</td>
                  <td className="p-2 text-center text-slate-500">{t('Điều 19.6 VBHN 48', 'Art. 19.6, 48/VBHN')}</td>
                  <td className="p-2 text-right font-mono">+{complianceResult.eligibleBorrowed.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2">{t('TỔNG HẠN NGẠCH KHẢ DỤNG (A + Giao dịch + Vay mượn)', 'TOTAL AVAILABLE ALLOWANCES (A + Trades + Borrowed)')}</td>
                  <td className="p-2 text-center text-slate-500">—</td>
                  <td className="p-2 text-right font-mono text-brand">{complianceResult.availableAllowances?.toLocaleString() ?? '—'}</td>
                </tr>
                <tr>
                  <td className="p-2">{t('4. Phát thải trực tiếp thực tế được thẩm định (2025 + 2026)', '4. Verified actual direct emissions (2025 + 2026)')}</td>
                  <td className="p-2 text-center text-slate-500">{t('Điều 19.5 VBHN 48', 'Art. 19.5, 48/VBHN')}</td>
                  <td className="p-2 text-right font-mono">{complianceResult.directEmisTotal?.toLocaleString() || '—'}</td>
                </tr>
                <tr>
                  <td className="p-2">{t('5. Tín chỉ carbon sử dụng để bù trừ (Đủ điều kiện, trần 30%)', '5. Carbon credits used for offset (eligible, 30% cap)')}</td>
                  <td className="p-2 text-center text-slate-500">{t('Điều 19.8 VBHN 48', 'Art. 19.8, 48/VBHN')}</td>
                  <td className="p-2 text-right font-mono text-emerald-700">-{complianceResult.eligibleCredits.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2">{t('NGHĨA VỤ NỘP BÙ THỰC TẾ (Phát thải trực tiếp − Tín chỉ)', 'REQUIRED SURRENDER (Direct emissions − Credits)')}</td>
                  <td className="p-2 text-center text-slate-500">—</td>
                  <td className="p-2 text-right font-mono">{complianceResult.requiredSurrender?.toLocaleString() || '—'}</td>
                </tr>
                <tr className="bg-brand text-white font-extrabold text-sm">
                  <td className="p-2.5">{t('VỊ THẾ TUÂN THỦ:', 'COMPLIANCE POSITION:')} {t(COMPLIANCE_STATUS_VI[complianceResult.status] ?? complianceResult.status, complianceResult.status)}</td>
                  <td className="p-2.5 text-center text-xs font-normal text-slate-300">{t('Trước 31/12/2027', 'Before 31/12/2027')}</td>
                  <td className="p-2.5 text-right font-mono">
                    {complianceResult.complianceGap !== null ? `${complianceResult.complianceGap >= 0 ? '+' : ''}${complianceResult.complianceGap.toLocaleString()} tCO2e` : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>

          <div className="space-y-2 print:break-inside-avoid">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              {t('V. MA TRẬN CHẤT LƯỢNG DỮ LIỆU', 'V. DATA QUALITY MATRIX')}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {dataQualityReport.dimensions.map(dimension => (
                <div key={dimension.id} className="border border-slate-200 rounded-lg p-2 flex justify-between gap-2">
                  <span>{t(dimension.nameVi, dimension.nameEn)}</span>
                  <strong>{dimension.status}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Sign-off & Audit Seal */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="font-bold text-slate-700 mb-1">{t('XÁC NHẬN CỦA HỆ THỐNG SIMULATOR', 'SIMULATOR SYSTEM ATTESTATION')}</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t(
                  'Bản nháp mô phỏng này được tạo tự động từ dữ liệu người dùng nhập. Kết quả không thay thế hồ sơ thẩm định, xác minh nguồn hoặc kết luận của cơ quan có thẩm quyền.',
                  'This simulation draft is generated from user-entered data. It does not replace verified records, source validation, or an authority’s determination.'
                )}
              </p>
              <div className="mt-2 text-[10px] text-slate-400 font-mono">
                {t('Mức độ điền đủ:', 'Data completeness:')} {dataQualityReport.overallScorePercent}% · {t('Tính hợp lệ:', 'Validity:')} {dataQualityReport.validityStatus} · {t('Xác minh:', 'Verification:')} {dataQualityReport.verificationStatus}
              </div>
            </div>

            <div className="text-center space-y-12">
              <div className="font-bold text-slate-800">
                {t('ĐẠI DIỆN CƠ SỞ / BỘ PHẬN PHÂN TÍCH', 'FACILITY REPRESENTATIVE / ANALYSIS UNIT')}
                <span className="block font-normal text-[10px] text-slate-400">{t('(Ký và ghi rõ họ tên)', '(Signature and full name)')}</span>
              </div>
              <div className="font-bold text-slate-900">
                {selectedFacility?.representative || t('Chưa có dữ liệu nguồn', 'No source data available')}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Screen Action Footer (hidden in print) */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0 print:hidden">
          <span className="text-xs text-slate-500 hidden sm:inline">
            {t('Nhấn phím Esc hoặc click vùng tối bên ngoài để đóng xem trước', 'Press Esc or click outside to close')}
          </span>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              {t('Đóng bản xem trước (Esc)', 'Close Preview (Esc)')}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('In / Lưu PDF', 'Print / Save PDF')}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

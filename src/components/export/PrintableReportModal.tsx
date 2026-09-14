import React, { useEffect } from 'react';
import { X, Printer, Building2, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';

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

  // Close on Escape key & lock background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPrintModalOpen(false);
      }
    };
    if (isPrintModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:inset-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsPrintModalOpen(false);
      }}
    >
      
      {/* Modal Container with max-height and flex-col to prevent header overflow */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:overflow-visible print:border-none print:shadow-none print:rounded-none animate-in zoom-in-95 duration-150">
        
        {/* Top Screen Action Header (Sticky, always visible, hidden in print) */}
        <div className="sticky top-0 z-20 shrink-0 bg-slate-900 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block leading-tight">
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
              type="button"
              onClick={() => setIsPrintModalOpen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
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
                BÁO CÁO THẨM ĐỊNH HẠN NGẠCH & VỊ THẾ TUÂN THỦ ETS
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Căn cứ Nghị định 06/2022/NĐ-CP (sửa đổi theo VBHN 48) và Quyết định 699/QĐ-BNNMT
              </p>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold font-mono">DOC-ETS-{selectedFacility?.id || 'MAN'}-{state.assessment_date.replace(/-/g, '')}</div>
              <div className="text-slate-500">{t('Ngày lập:', 'Date:')} {state.assessment_date}</div>
              <div className="text-emerald-700 font-bold">{t('Bản Thẩm định Kỹ thuật', 'Technical Assessment')}</div>
            </div>
          </div>

          {/* Section 1: Facility Profile */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              I. THÔNG TIN NHẬN DIỆN CƠ SỞ PHÁT THẢI
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Tên cơ sở / Doanh nghiệp:</span>
                <span className="font-bold text-sm text-slate-900">
                  {selectedFacility?.name || state.manual_facility_name || 'Cơ sở tự do'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Mã số thuế & Mã cơ sở:</span>
                <span className="font-bold text-sm font-mono text-slate-900">
                  {selectedFacility?.tax_id || state.manual_tax_id || 'N/A'} [{selectedFacility?.id || 'MANUAL'}]
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Lĩnh vực sản xuất & Đơn vị sản phẩm:</span>
                <span className="font-semibold text-slate-800">
                  {selectedFacility?.sector_vi || state.sector} ({selectedFacility?.product_unit || 'N/A'})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Địa chỉ hoạt động:</span>
                <span className="text-slate-700">{selectedFacility?.address || 'Khai báo theo thực tế'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Assessment Findings */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              II. KẾT QUẢ THẨM ĐỊNH NGHĨA VỤ PHÁP LÝ (LEGAL ASSESSMENT)
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="text-slate-500 font-bold mb-1">1. Nghĩa vụ Kiểm kê Khí nhà kính (Điều 6):</div>
                <div className="font-bold text-slate-900">
                  {inventoryResult.statusLabelVi}
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Danh mục áp dụng: {inventoryResult.applicableList}
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="text-slate-500 font-bold mb-1">2. Nghĩa vụ Hạn ngạch ETS Thí điểm (Điều 12, QĐ 699):</div>
                <div className="font-bold text-slate-900">
                  {selectedFacility ? 'THUỘC DIỆN PHÂN BỔ HẠN NGẠCH (QĐ 699)' : 'CHƯA CÓ TRONG DANH SÁCH PHÂN BỔ HIỆN HÀNH'}
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-mono">
                  {selectedFacility ? `2025: ${selectedFacility.allocation_2025.toLocaleString()} tCO2e | 2026: ${selectedFacility.allocation_2026.toLocaleString()} tCO2e` : 'Không áp dụng'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Surrender Balance Sheet */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              III. BẢNG CÂN ĐỐI NGHĨA VỤ NỘP BÙ HẠN NGẠCH GIAI ĐOẠN 2025–2026 (ARTICLE 19)
            </h3>

            <table className="w-full text-xs border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                <tr>
                  <th className="p-2 text-left">Chỉ tiêu thẩm định</th>
                  <th className="p-2 text-center w-32">Căn cứ pháp lý</th>
                  <th className="p-2 text-right w-40">Khối lượng (tCO2e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2">1. Tổng hạn ngạch được phân bổ chính thức (2025 + 2026)</td>
                  <td className="p-2 text-center text-slate-500">QĐ 699/QĐ-BNNMT</td>
                  <td className="p-2 text-right font-mono font-bold">{complianceResult.phaseAllocationTotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2">2. Giao dịch mua / bán hạn ngạch ròng</td>
                  <td className="p-2 text-center text-slate-500">Sàn giao dịch KNK</td>
                  <td className="p-2 text-right font-mono">{(complianceResult.netAllowanceTrades || 0) > 0 ? '+' : ''}{complianceResult.netAllowanceTrades.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2">3. Hạn ngạch vay mượn từ kỳ sau (Đủ điều kiện, trần 15%)</td>
                  <td className="p-2 text-center text-slate-500">Điều 19.6 VBHN 48</td>
                  <td className="p-2 text-right font-mono">+{complianceResult.eligibleBorrowed.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2">TỔNG HẠN NGẠCH KHẢ DỤNG (A + Trades + Borrowed)</td>
                  <td className="p-2 text-center text-slate-500">—</td>
                  <td className="p-2 text-right font-mono text-blue-700">{complianceResult.availableAllowances.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2">4. Phát thải trực tiếp thực tế được thẩm định (2025 + 2026)</td>
                  <td className="p-2 text-center text-slate-500">Điều 19.5 VBHN 48</td>
                  <td className="p-2 text-right font-mono">{complianceResult.directEmisTotal?.toLocaleString() || '—'}</td>
                </tr>
                <tr>
                  <td className="p-2">5. Tín chỉ carbon sử dụng để bù trừ (Đủ điều kiện, trần 30%)</td>
                  <td className="p-2 text-center text-slate-500">Điều 19.8 VBHN 48</td>
                  <td className="p-2 text-right font-mono text-emerald-700">-{complianceResult.eligibleCredits.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2">NGHĨA VỤ NỘP BÙ THỰC TẾ (Direct Emissions - Credits)</td>
                  <td className="p-2 text-center text-slate-500">—</td>
                  <td className="p-2 text-right font-mono">{complianceResult.requiredSurrender?.toLocaleString() || '—'}</td>
                </tr>
                <tr className="bg-slate-900 text-white font-extrabold text-sm">
                  <td className="p-2.5">VỊ THẾ TUÂN THỦ (COMPLIANCE GAP): {complianceResult.status}</td>
                  <td className="p-2.5 text-center text-xs font-normal text-slate-300">Trước 31/12/2027</td>
                  <td className="p-2.5 text-right font-mono">
                    {complianceResult.complianceGap !== null ? `${complianceResult.complianceGap >= 0 ? '+' : ''}${complianceResult.complianceGap.toLocaleString()} tCO2e` : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Sign-off & Audit Seal */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="font-bold text-slate-700 mb-1">XÁC NHẬN CỦA HỆ THỐNG SIMULATOR</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Bản báo cáo này được tạo tự động từ động cơ tính toán Vietnam ETS Simulator. Mô hình kiểm toán tuân thủ độ chính xác logic Excel và quy chuẩn pháp lý hiện hành của Việt Nam.
              </p>
              <div className="mt-2 text-[10px] text-slate-400 font-mono">
                Mức độ sẵn sàng dữ liệu: {dataQualityReport.overallScorePercent}% (Đạt tiêu chuẩn đánh giá)
              </div>
            </div>

            <div className="text-center space-y-12">
              <div className="font-bold text-slate-800">
                ĐẠI DIỆN CƠ SỞ / BỘ PHẬN PHÂN TÍCH
                <span className="block font-normal text-[10px] text-slate-400">(Ký và ghi rõ họ tên)</span>
              </div>
              <div className="font-bold text-slate-900">
                {selectedFacility?.representative || 'Ban Quản trị ETS'}
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

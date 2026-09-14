import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Info 
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';
import { LegalButton } from '../legal/LegalButton';

export const Screen3Quota: React.FC = () => {
  const { 
    selectedFacility, 
    manualQuotaMatches,
    state, 
    setCurrentScreen,
    selectFacility,
  } = useSimulator();
  const { t } = useLanguage();

  const isIncluded = !!selectedFacility?.is_in_qd699;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold mb-2 border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            {t('Bước 3 trong 6: Thẩm định Nghĩa vụ Hạn ngạch ETS Thí điểm', 'Step 3 of 6: ETS Pilot Quota Allocation Scope')}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('Cơ sở có thuộc diện được phân bổ hạn ngạch phát thải 2025–2026?', 'Is this facility included in the 2025–2026 quota allocation scheme?')}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LegalButton ruleId="L009" labelVi="Điều 12 VBHN 48" labelEn="Article 12 Scope" />
          <LegalButton ruleId="L011" labelVi="QĐ 699/QĐ-BNNMT" labelEn="Decision 699" />
          <LegalButton ruleId="L010" labelVi="QĐ 263/QĐ-TTg" labelEn="Decision 263" />
        </div>
      </div>

      {/* CORE DECISION DISPLAY */}
      {isIncluded && selectedFacility ? (
        /* YES: FACILITY FOUND IN DECISION 699 */
        <div className="bg-emerald-50/50 border border-emerald-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
                {t('XÁC NHẬN CÓ NGHĨA VỤ HẠN NGẠCH ETS', 'OFFICIAL ETS QUOTA OBLIGATION CONFIRMED')}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 pt-1">
                {t(selectedFacility.name, selectedFacility.name_en)}
              </h3>
              <p className="text-xs text-slate-600">
                {t('Mã cơ sở:', 'Facility ID:')} <span className="font-mono font-bold text-slate-800">{selectedFacility.id}</span> • {t('Lĩnh vực:', 'Sector:')} <strong className="text-slate-800">{t(selectedFacility.sector_vi, selectedFacility.sector)}</strong> • {t('Mã số thuế:', 'Tax ID:')} <span className="font-mono text-slate-800">{selectedFacility.tax_id}</span>
              </p>
            </div>

            <div className="bg-white rounded-xl border border-emerald-200 px-4 py-2.5 shadow-2xs text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                {t('Căn cứ pháp lý phân bổ', 'Legal Basis')}
              </div>
              <div className="text-xs font-bold text-emerald-800">
                Quyết định 699/QĐ-BNNMT
              </div>
            </div>
          </div>

          {/* Allocation Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 mb-1">
                {t('Hạn ngạch chính thức Năm 2025', 'Official Allocation 2025')}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {selectedFacility.allocation_2025.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">tCO2e ({t(selectedFacility.product_vi, selectedFacility.product)})</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 mb-1">
                {t('Hạn ngạch chính thức Năm 2026', 'Official Allocation 2026')}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {selectedFacility.allocation_2026.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">tCO2e ({t(selectedFacility.product_vi, selectedFacility.product)})</div>
            </div>

            <div className="bg-brand rounded-xl p-4 text-white shadow-xs border border-brand-dark">
              <div className="text-xs font-semibold text-slate-300 mb-1">
                {t('Tổng hạn ngạch Giai đoạn 2025–2026', 'Phase Allocation Total')}
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
                {selectedFacility.allocation_total.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">tCO2e {t('(Dùng cho Tuân thủ)', '(For Compliance)')}</div>
            </div>
          </div>
        </div>
      ) : (
        /* NO: FACILITY NOT FOUND IN DECISION 699 */
        <div className="bg-slate-50 border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white font-bold text-xs shadow-xs">
                {t('CHƯA XÁC MINH VỚI DANH MỤC', 'NOT YET VERIFIED AGAINST THE LIST')}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {manualQuotaMatches.length > 0
                  ? t('Thông tin tự khai có thể trùng với cơ sở trong QĐ 699', 'Manual details may match a facility in Decision 699')
                  : t('Chưa xác nhận cơ sở trong danh sách phân bổ hiện tại', 'Facility has not been confirmed in the current allocation list')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {state.is_manual
                  ? t(`Chế độ tự khai không tự động đưa ra kết luận phủ định cho "${state.manual_facility_name || 'Cơ sở tự do'}". Hãy chọn một kết quả đối chiếu chính thức nếu phù hợp.`, `Manual mode does not issue a negative official conclusion for "${state.manual_facility_name || 'Manual'}". Select an official match when appropriate.`)
                  : t('Cơ sở đang tra cứu không có tên trong danh sách phân bổ hạn ngạch đợt 1.', 'The facility is not listed in the first phase quota allocation.')}
              </p>

              {manualQuotaMatches.length > 0 && (
                <div className="space-y-2 pt-2">
                  {manualQuotaMatches.map(facility => (
                    <button
                      key={facility.id}
                      type="button"
                      onClick={() => selectFacility(facility.id)}
                      className="w-full min-h-11 rounded-xl border border-amber-300 bg-white px-3 py-2 text-left text-xs hover:bg-amber-50"
                    >
                      <span className="font-bold text-slate-900">[{facility.id}] {t(facility.name, facility.name_en)}</span>
                      <span className="block text-slate-500 mt-0.5">{facility.tax_id}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Legal Guardrail Reminder */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              {t('Ranh giới pháp lý bắt buộc (Guardrail):', 'Mandatory Legal Guardrail:')}
            </div>
            <p className="leading-relaxed">
              {t(
                'Website KHÔNG KẾT LUẬN rằng "Cơ sở không chịu sự điều chỉnh của ETS". Trong các giai đoạn tiếp theo (sau năm 2026), phạm vi phân bổ hạn ngạch có thể mở rộng sang các lĩnh vực khác theo lộ trình của Chính phủ.',
                'The system strictly DOES NOT conclude that "Facility is exempt from ETS". In subsequent phases (post-2026), the quota regime will expand to additional sectors.'
              )}
            </p>
          </div>
        </div>
      )}

      {/* Simulator Bridge Callout */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            {t('Bạn muốn biết con số hạn ngạch này từ đâu ra?', 'Want to understand how this allowance was calculated?')}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'Bước tiếp theo sẽ mở rộng công thức toán học P̄ → Ē → B → T → A để mô phỏng và tái hiện phương pháp luận phân bổ theo luật định.',
              'The next step decomposes the statutory formula P̄ → Ē → B → T → A to simulate and validate the methodology.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentScreen(4)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-semibold text-xs hover:bg-brand-dark shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <span>{t('Mở Mô phỏng Công thức', 'Open Allocation Simulator')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

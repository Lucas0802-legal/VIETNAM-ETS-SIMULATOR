import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  FileText, 
  Scale, 
  Info 
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';
import { LegalButton } from '../legal/LegalButton';

export const Screen3Quota: React.FC = () => {
  const { 
    selectedFacility, 
    state, 
    setCurrentScreen 
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
            {t('Bước 3 trong 8: Thẩm định Nghĩa vụ Hạn ngạch ETS Thí điểm', 'Step 3 of 8: ETS Pilot Quota Allocation Scope')}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('Cơ sở có thuộc diện được phân bổ hạn ngạch phát thải 2025–2026?', 'Is this facility included in the 2025–2026 quota allocation scheme?')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {t(
              'Căn cứ Điều 12 Nghị định 06 (sửa đổi) và Quyết định số 699/QĐ-BNNMT ngày 27/02/2026 của Bộ Nông nghiệp & Môi trường.',
              'Pursuant to Article 12 Decree 06 and Decision 699/QĐ-BNNMT dated 27/02/2026.'
            )}
          </p>
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
                {selectedFacility.name}
              </h3>
              <p className="text-xs text-slate-600">
                {t('Mã cơ sở:', 'Facility ID:')} <span className="font-mono font-bold text-slate-800">{selectedFacility.id}</span> • {t('Lĩnh vực:', 'Sector:')} <strong className="text-slate-800">{selectedFacility.sector_vi}</strong> • {t('Mã số thuế:', 'Tax ID:')} <span className="font-mono text-slate-800">{selectedFacility.tax_id}</span>
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
              <div className="text-[11px] text-slate-400 mt-0.5">tCO2e ({selectedFacility.product_vi})</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 mb-1">
                {t('Hạn ngạch chính thức Năm 2026', 'Official Allocation 2026')}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {selectedFacility.allocation_2026.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">tCO2e ({selectedFacility.product_vi})</div>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 text-white shadow-xs border border-slate-800">
              <div className="text-xs font-semibold text-slate-300 mb-1">
                {t('Tổng hạn ngạch Giai đoạn 2025–2026', 'Phase Allocation Total')}
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
                {selectedFacility.allocation_total.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">tCO2e {t('(Dùng cho Tuân thủ)', '(For Compliance)')}</div>
            </div>
          </div>

          {/* National Pilot Context Note */}
          <div className="bg-white/80 rounded-xl border border-slate-200 p-4 text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-600" />
              {t('Bối cảnh Tổng hạn ngạch Quốc gia (Quyết định 263/QĐ-TTg):', 'National Cap Context (Decision 263/QĐ-TTg):')}
            </div>
            <p className="text-slate-600 leading-relaxed">
              {t(
                'Thủ tướng Chính phủ đã phê duyệt tổng hạn ngạch KNK thí điểm: Năm 2025 là 243,082,392 tCO2e; Năm 2026 là 268,391,454 tCO2e cho 34 nhà máy nhiệt điện, 25 cơ sở sản xuất sắt thép và 51 nhà máy sản xuất clanhke xi măng. Cơ sở này chiếm một tỷ trọng cụ thể trong trần phát thải quốc gia.',
                'Prime Minister approved pilot national caps: 2025 is 243,082,392 tCO2e; 2026 is 268,391,454 tCO2e across 34 thermal, 25 steel, and 51 cement facilities. This facility holds a binding share of this national cap.'
              )}
            </p>
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-600 text-white font-bold text-xs shadow-xs">
                {t('KẾT LUẬN CHÍNH THỨC', 'OFFICIAL CONCLUSION')}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {t('Không tìm thấy cơ sở trong danh sách phân bổ hạn ngạch hiện tại (QĐ 699)', 'No current official quota allocation found in Decision 699')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {state.is_manual
                  ? t(`Cơ sở tự khai "${state.manual_facility_name || 'Cơ sở tự do'}" không nằm trong danh mục 110 nhà máy thí điểm của Quyết định 699/QĐ-BNNMT.`, `Manual facility "${state.manual_facility_name || 'Manual'}" is not in the 110 pilot facilities under Decision 699.`)
                  : t('Cơ sở đang tra cứu không có tên trong danh sách phân bổ hạn ngạch đợt 1.', 'The facility is not listed in the first phase quota allocation.')}
              </p>
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
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <span>{t('Mở Mô phỏng Công thức (Allocation Sim)', 'Open Allocation Simulator')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

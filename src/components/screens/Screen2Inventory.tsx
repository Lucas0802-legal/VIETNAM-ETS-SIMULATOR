import React from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  ArrowRight, 
  ShieldAlert, 
  Calendar, 
  Activity, 
  Gauge, 
  Boxes 
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';
import { LegalButton } from '../legal/LegalButton';

export const Screen2Inventory: React.FC = () => {
  const { 
    state, 
    updateField, 
    inventoryResult, 
    selectedFacility, 
    setCurrentScreen 
  } = useSimulator();
  const { language, t } = useLanguage();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold mb-2 border border-slate-200">
            <ClipboardCheck className="w-3.5 h-3.5 text-slate-600" />
            {t('Bước 2 trong 6: Thẩm định Nghĩa vụ Kiểm kê Khí nhà kính', 'Step 2 of 6: GHG Inventory Obligation Assessment')}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('Cơ sở có thuộc diện phải thực hiện Kiểm kê Khí nhà kính?', 'Does this facility have a GHG inventory obligation?')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {t(
              'Căn cứ theo Điều 6 Văn bản hợp nhất 48/VBHN-BNNMT và Danh mục kiểm kê có hiệu lực của Thủ tướng Chính phủ. Website phân tách rõ ràng giữa kiểm kê và hạn ngạch ETS.',
              'Pursuant to Article 6 Consolidated Decree 48/VBHN and effective Prime Minister lists. We strictly separate inventory from quota obligations.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LegalButton ruleId="L002" labelVi="Điều 6 VBHN 48" labelEn="Article 6 Decree 48" />
          <LegalButton ruleId={inventoryResult.applicableList.includes('42') ? 'L008' : 'L007'} />
        </div>
      </div>

      {/* CORE RESULT DECISION CARD */}
      <div className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${
        inventoryResult.overallStatus === 'YES'
          ? 'bg-emerald-50/50 border-emerald-300'
          : inventoryResult.overallStatus === 'MEETS_CRITERIA'
            ? 'bg-amber-50/50 border-amber-300'
            : inventoryResult.overallStatus === 'UNDETERMINED'
              ? 'bg-slate-50 border-slate-300'
              : 'bg-rose-50/50 border-rose-300'
      }`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {inventoryResult.overallStatus === 'YES' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('XÁC NHẬN CÓ NGHĨA VỤ KIỂM KÊ', 'CONFIRMED INVENTORY OBLIGATION')}
                </span>
              )}
              {inventoryResult.overallStatus === 'MEETS_CRITERIA' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white font-bold text-xs shadow-xs">
                  <AlertTriangle className="w-4 h-4" />
                  {t('ĐẠT TIÊU CHÍ ĐIỀU 6 — CẦN ĐỐI CHIẾU DANH MỤC', 'MEETS CRITERIA — VERIFY OFFICIAL LIST')}
                </span>
              )}
              {inventoryResult.overallStatus === 'UNDETERMINED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-600 text-white font-bold text-xs shadow-xs">
                  <HelpCircle className="w-4 h-4" />
                  {t('CHƯA XÁC ĐỊNH (THIẾU DỮ LIỆU)', 'UNDETERMINED (INSUFFICIENT DATA)')}
                </span>
              )}
              {inventoryResult.overallStatus === 'NO_EVIDENCE' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-xs">
                  <XCircle className="w-4 h-4" />
                  {t('CHƯA CÓ BẰNG CHỨNG THUỘC DIỆN', 'NO EVIDENCE FROM DATA')}
                </span>
              )}

              <span className="text-xs text-slate-500 font-mono">
                {selectedFacility ? `[${selectedFacility.id}] ${t(selectedFacility.name, selectedFacility.name_en)}` : (state.manual_facility_name || t('Cơ sở tự do', 'Manual Facility'))}
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">
              {language === 'vi' ? inventoryResult.statusLabelVi : inventoryResult.statusLabelEn}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
              {language === 'vi' ? inventoryResult.statusDescriptionVi : inventoryResult.statusDescriptionEn}
            </p>
          </div>

          {/* Applicable List Info Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shrink-0 w-full md:w-72 shadow-2xs space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand" />
              {t('Danh mục kiểm kê áp dụng', 'Applicable Inventory List')}
            </div>
            <div className="text-sm font-bold text-slate-900">
              {inventoryResult.applicableList}
            </div>
            <div className="text-[11px] text-slate-500">
              {t(inventoryResult.listEffectivePeriod, inventoryResult.listEffectivePeriodEn)}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Legal Distinction Callout */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
        <ShieldAlert className="w-5 h-5 text-brand shrink-0 mt-0.5" />
        <div className="text-xs text-brand-dark space-y-1">
          <div className="font-bold text-sm">
            {t('Quy tắc then chốt: Kiểm kê KNK không đồng nghĩa với có hạn ngạch ETS!', 'Key Rule: Inventory duty does NOT mean ETS quota obligation!')}
          </div>
          <p className="leading-relaxed text-brand-dark">
            {t(
              'Một doanh nghiệp có thể phát thải trên 3,000 tCO2e và bắt buộc phải nộp báo cáo kiểm kê KNK cho Sở TN&MT, nhưng trong giai đoạn thí điểm 2025–2026, CHỈ CÓ 110 cơ sở thuộc 3 lĩnh vực (Nhiệt điện than, Sản xuất Thép, và Xi măng) trong Quyết định 699/QĐ-BNNMT mới được phân bổ hạn ngạch phát thải chính thức.',
              'A facility may emit over 3,000 tCO2e and have a mandatory duty to conduct GHG inventories, but during the 2025–2026 pilot phase, ONLY 110 facilities across 3 designated sectors in Decision 699 are assigned official emission quotas.'
            )}
          </p>
        </div>
      </div>

      {/* Thresholds & Inputs Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t('Đối chiếu Tiêu chí Định lượng', 'Quantitative Criteria Checklist')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('Hệ thống kiểm tra các ngưỡng phát thải và tiêu thụ năng lượng theo luật định.', 'Simulator checks statutory emission and energy consumption thresholds.')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              inventoryResult.criteriaTest === 'MEETS_CRITERIA'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {inventoryResult.criteriaTest === 'MEETS_CRITERIA' 
                ? t('Đạt tiêu chí định lượng', 'Criteria Met') 
                : t('Chưa đạt hoặc thiếu số liệu', 'Not Met / Incomplete')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Threshold 1: Annual GHG */}
          <div className={`rounded-xl border p-4 space-y-3 transition-all ${
            inventoryResult.criteriaDetails.ghgMet ? 'border-emerald-300 bg-white ring-1 ring-emerald-500/20' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-slate-600" />
                {t('Phát thải KNK hàng năm', 'Annual GHG Emissions')}
              </span>
              <span className="text-[10px] font-semibold font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                ≥ 3,000 tCO2e
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder={t('Nhập số tCO2e', 'Enter tCO2e')}
                value={state.annual_ghg ?? ''}
                onChange={(e) => updateField('annual_ghg', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">{t('tCO2e/năm', 'tCO2e/yr')}</span>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>{t('Tiêu chí chung cho mọi cơ sở', 'General threshold')}</span>
              {inventoryResult.criteriaDetails.ghgMet ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('Đạt ngưỡng', 'Met')}
                </span>
              ) : (
                <span className="text-slate-400 font-medium">{t('Chưa đạt', 'Below')}</span>
              )}
            </div>
          </div>

          {/* Threshold 2: Annual TOE */}
          <div className={`rounded-xl border p-4 space-y-3 transition-all ${
            inventoryResult.criteriaDetails.toeMet ? 'border-emerald-300 bg-white ring-1 ring-emerald-500/20' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-slate-600" />
                {t('Tiêu thụ Năng lượng / Nhiên liệu', 'Energy / Fuel Consumption')}
              </span>
              <span className="text-[10px] font-semibold font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                ≥ 1,000 TOE
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder={t('Nhập số TOE', 'Enter TOE')}
                value={state.annual_toe ?? ''}
                onChange={(e) => updateField('annual_toe', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">{t('TOE/năm', 'TOE/yr')}</span>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>{t('Nhiệt điện, CN, Vận tải, Tòa nhà', 'Thermal, Mfg, Transport, Bldg')}</span>
              {inventoryResult.criteriaDetails.toeMet ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('Đạt ngưỡng', 'Met')}
                </span>
              ) : (
                <span className="text-slate-400 font-medium">{t('Chưa đạt', 'Below')}</span>
              )}
            </div>
          </div>

          {/* Threshold 3: Waste Capacity */}
          <div className={`rounded-xl border p-4 space-y-3 transition-all ${
            inventoryResult.criteriaDetails.wasteMet ? 'border-emerald-300 bg-white ring-1 ring-emerald-500/20' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-slate-600" />
                {t('Công suất xử lý Chất thải rắn', 'Solid Waste Capacity')}
              </span>
              <span className="text-[10px] font-semibold font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                ≥ 65,000 {t('tấn', 'tonnes')}
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder={t('Nhập tấn/năm', 'Enter t/year')}
                value={state.waste_capacity ?? ''}
                onChange={(e) => updateField('waste_capacity', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">{t('tấn/năm', 't/yr')}</span>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>{t('Cơ sở xử lý rác thải', 'Waste facilities')}</span>
              {inventoryResult.criteriaDetails.wasteMet ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('Đạt ngưỡng', 'Met')}
                </span>
              ) : (
                <span className="text-slate-400 font-medium">{t('Chưa đạt', 'Below')}</span>
              )}
            </div>
          </div>

        </div>

        {/* External Prime Minister list lookup selector */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-800">
              {t('Kết quả tra cứu Danh mục chính thức của Thủ tướng Chính phủ:', 'Prime Minister Official Inventory List Match:')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {t('Bạn đã tra cứu mã số thuế cơ sở này trong danh mục QĐ 13/2024 hoặc QĐ 42/2026 chưa?', 'Have you cross-checked this tax ID against Decision 13 or Decision 42?')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(['Yes', 'No', 'Unknown'] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => updateField('inventory_list_match', choice)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  state.inventory_list_match === choice
                    ? 'bg-brand text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {choice === 'Yes' ? t('Có trong danh mục', 'Yes (Listed)') : choice === 'No' ? t('Không có trong danh mục', 'No (Not listed)') : t('Chưa tra cứu', 'Unknown')}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentScreen(1)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 cursor-pointer"
          >
            ← {t('Quay lại: Chọn cơ sở khác', 'Back: Facility Search')}
          </button>

          <button
            type="button"
            onClick={() => setCurrentScreen(3)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs hover:bg-brand-dark shadow-xs transition-all cursor-pointer"
          >
            <span>{t('Tiếp theo: Kiểm tra Nghĩa vụ Hạn ngạch ETS', 'Next: Check ETS Quota Obligation')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};

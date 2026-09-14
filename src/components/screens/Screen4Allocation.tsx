import React from 'react';
import { 
  Calculator, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sliders, 
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';
import { LegalButton } from '../legal/LegalButton';

export const Screen4Allocation: React.FC = () => {
  const { 
    state, 
    updateField, 
    allocationResult, 
    selectedFacility,
    setCurrentScreen 
  } = useSimulator();
  const { language, t } = useLanguage();

  const windowYears = allocationResult.windowYears;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold mb-2 border border-slate-200">
            <Calculator className="w-3.5 h-3.5 text-slate-600" />
            {t('Bước 4 trong 7: Mô phỏng Công thức Phân bổ Hạn ngạch (Method 01)', 'Step 4 of 7: Allocation Formula Simulation')}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('Hạn ngạch phát thải A được hình thành như thế nào?', 'How is allowance allocation A derived?')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {t(
              'Tái hiện minh bạch công thức Phương pháp 01 (Phụ lục I) từ P̄, Ē, B và T. Tuyệt đối không phải công cụ tính hộp đen (black box).',
              'Transparent step-by-step breakdown of Method 01 (Appendix I) from P_avg, E_avg, B and T. No black box calculations.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LegalButton ruleId="L012" labelVi="Phụ lục I - Phương pháp 01" labelEn="Appendix I - Method 01" />
        </div>
      </div>

      {/* Year Selector & Core Status Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">
            {t('Năm mô phỏng:', 'Allocation Year:')}
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => updateField('allocation_year', 2025)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                state.allocation_year === 2025
                  ? 'bg-white text-brand shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('Năm 2025 (Kỳ 2022–2024)', '2025 (Window 2022–2024)')}
            </button>
            <button
              type="button"
              onClick={() => updateField('allocation_year', 2026)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                state.allocation_year === 2026
                  ? 'bg-white text-brand shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('Năm 2026 (Kỳ 2023–2025)', '2026 (Window 2023–2025)')}
            </button>
          </div>
        </div>

        {/* Calculation Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
            allocationResult.status === 'READY'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : allocationResult.status === 'MISSING_GR' || allocationResult.status === 'INVALID_INPUT'
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {allocationResult.status === 'READY' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {(allocationResult.status === 'MISSING_GR' || allocationResult.status === 'INVALID_INPUT') && <AlertTriangle className="w-4 h-4 text-rose-600" />}
            {allocationResult.status !== 'READY' && allocationResult.status !== 'MISSING_GR' && allocationResult.status !== 'INVALID_INPUT' && <HelpCircle className="w-4 h-4 text-amber-600" />}
            <span>{language === 'vi' ? allocationResult.statusTextVi : allocationResult.statusTextEn}</span>
          </span>
        </div>
      </div>

      {/* STEP-BY-STEP FORMULA BREAKDOWN PIPELINE (P -> E -> B -> T -> A) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        
        {/* Step 1: P_avg */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{t('1. Sản lượng TB', '1. Avg Production')}</span>
            <span className="font-mono text-brand font-bold">P̄</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono truncate">
            {allocationResult.pAvg !== null ? allocationResult.pAvg.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono line-clamp-1" title={allocationResult.formulaBreakdown.pAvgFormula}>
            {allocationResult.formulaBreakdown.pAvgFormula}
          </div>
        </div>

        {/* Step 2: E_avg */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{t('2. Phát thải TB', '2. Avg Emissions')}</span>
            <span className="font-mono text-brand font-bold">Ē</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono truncate">
            {allocationResult.eAvg !== null ? allocationResult.eAvg.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono line-clamp-1" title={allocationResult.formulaBreakdown.eAvgFormula}>
            {allocationResult.formulaBreakdown.eAvgFormula}
          </div>
        </div>

        {/* Step 3: Benchmark B */}
        <div className={`rounded-2xl border p-4 shadow-xs space-y-2 ${
          allocationResult.isBenchmarkOverride ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-slate-200'
        }`}>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{t('3. Định mức Ngành', '3. Benchmark')}</span>
            <span className="font-mono text-brand font-bold">B</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono truncate">
            {allocationResult.benchmarkB !== null ? allocationResult.benchmarkB : '—'}
          </div>
          <div className="text-[10px] text-slate-500 line-clamp-1">
            {allocationResult.isBenchmarkOverride ? t('Kịch bản override', 'Scenario override') : t('Chưa có số liệu', 'Unavailable')}
          </div>
        </div>

        {/* Step 4: Adjustment Factor T */}
        <div className={`rounded-2xl border p-4 shadow-xs space-y-2 ${
          allocationResult.factorT === null ? 'bg-rose-50/40 border-rose-300' : 'bg-white border-slate-200'
        }`}>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{t('4. Hệ số Điều chỉnh', '4. Factor T')}</span>
            <span className="font-mono text-brand font-bold">T</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono truncate">
            {allocationResult.factorT !== null ? allocationResult.factorT.toFixed(4) : '—'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono line-clamp-1" title={allocationResult.formulaBreakdown.tFormula}>
            {allocationResult.factorT !== null ? `(1+g)(1-r) = ${allocationResult.factorT.toFixed(4)}` : t('Dừng: Thiếu g/r', 'Stopped: Missing g/r')}
          </div>
        </div>

        {/* Step 5: Calculated Allowance A */}
        <div className="bg-brand rounded-2xl p-4 text-white shadow-xs border border-brand-dark space-y-2">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>{t('5. Hạn ngạch Tính toán', '5. Calculated A')}</span>
            <span className="font-mono font-bold text-emerald-400">A</span>
          </div>
          <div className="text-xl font-extrabold font-mono truncate text-emerald-400 tabular-nums">
            {allocationResult.calculatedA !== null ? allocationResult.calculatedA.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono line-clamp-1">
            tCO2e (P̄ × B × T)
          </div>
        </div>

      </div>

      {/* INPUTS GRID: 3-YEAR PRODUCTION, EMISSIONS & POLICY PARAMETERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Historical Production & Emissions (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t(`Số liệu Lịch sử 3 năm (${windowYears[0]}, ${windowYears[1]}, ${windowYears[2]})`, `3-Year Historical Data (${windowYears.join(', ')})`)}
              </h3>
              <p className="text-xs text-slate-500">
                {t('Sản lượng (P) và Phát thải (E) phục vụ tính mức trung bình P̄ và Ē.', 'Production (P) and Emissions (E) to compute averages.')}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-brand bg-emerald-50 px-2.5 py-1 rounded-lg">
              {selectedFacility?.product_unit || 'Đơn vị sản phẩm'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Year y-3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="text-xs font-bold text-slate-700 text-center">
                {t(`Năm ${windowYears[0]} (y-3)`, `Year ${windowYears[0]} (y-3)`)}
              </div>
              <div>
                <label htmlFor="prod-y3" className="text-[10px] font-semibold text-slate-500 block mb-1">
                  {t('Sản lượng (P)', 'Production (P)')}
                </label>
                <input
                  id="prod-y3"
                  type="number"
                  placeholder="0"
                  value={state.prod_y3 ?? ''}
                  onChange={(e) => updateField('prod_y3', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="emis-y3" className="text-[10px] font-semibold text-slate-500 block mb-1">
                  {t('Phát thải (E)', 'Emissions (E)')}
                </label>
                <input
                  id="emis-y3"
                  type="number"
                  placeholder="0"
                  value={state.emis_y3 ?? ''}
                  onChange={(e) => updateField('emis_y3', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            {/* Year y-2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="text-xs font-bold text-slate-700 text-center">
                {t(`Năm ${windowYears[1]} (y-2)`, `Year ${windowYears[1]} (y-2)`)}
              </div>
              <div>
                <label htmlFor="prod-y2" className="text-[10px] font-semibold text-slate-500 block mb-1">
                  {t('Sản lượng (P)', 'Production (P)')}
                </label>
                <input
                  id="prod-y2"
                  type="number"
                  placeholder="0"
                  value={state.prod_y2 ?? ''}
                  onChange={(e) => updateField('prod_y2', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="emis-y2" className="text-[10px] font-semibold text-slate-500 block mb-1">
                  {t('Phát thải (E)', 'Emissions (E)')}
                </label>
                <input
                  id="emis-y2"
                  type="number"
                  placeholder="0"
                  value={state.emis_y2 ?? ''}
                  onChange={(e) => updateField('emis_y2', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            {/* Year y-1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="text-xs font-bold text-slate-700 text-center">
                {t(`Năm ${windowYears[2]} (y-1)`, `Year ${windowYears[2]} (y-1)`)}
              </div>
              <div>
                <label htmlFor="prod-y1" className="text-[10px] font-semibold text-slate-500 block mb-1">
                  {t('Sản lượng (P)', 'Production (P)')}
                </label>
                <input
                  id="prod-y1"
                  type="number"
                  placeholder="0"
                  value={state.prod_y1 ?? ''}
                  onChange={(e) => updateField('prod_y1', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="emis-y1" className="text-[10px] font-semibold text-slate-500 block mb-1">
                  {t('Phát thải (E)', 'Emissions (E)')}
                </label>
                <input
                  id="emis-y1"
                  type="number"
                  placeholder="0"
                  value={state.emis_y1 ?? ''}
                  onChange={(e) => updateField('emis_y1', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Policy Parameters & Benchmark (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand" />
              {t('Tham số Chính sách & Benchmark', 'Policy & Benchmark Parameters')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('Không tự ý mặc định g hay r = 0% nếu chưa có nguồn kiểm chứng.', 'Never default missing g or r to 0%.')}
            </p>
          </div>

          {/* g & r sliders / inputs */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-700">
                  {t('Mục tiêu tăng trưởng ngành (g):', 'Growth target (g):')}
                </span>
                <span className="font-mono font-bold text-brand">
                  {state.g !== null ? `${state.g}%` : t('Chưa có (Trống)', 'Unverified')}
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                placeholder={t('Nhập % hoặc dùng kịch bản', 'Enter % or scenario')}
                value={state.g ?? ''}
                onChange={(e) => updateField('g', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-700">
                  {t('Mục tiêu giảm phát thải KNK (r):', 'GHG reduction target (r):')}
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  {state.r !== null ? `${state.r}%` : t('Chưa có (Trống)', 'Unverified')}
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                placeholder={t('Nhập % hoặc dùng kịch bản', 'Enter % or scenario')}
                value={state.r ?? ''}
                onChange={(e) => updateField('r', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Benchmark Override input */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  {t('Định mức Benchmark B kịch bản:', 'Benchmark B scenario override:')}
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                    {t('Kịch bản', 'Scenario')}
                  </span>
                </span>
                <span className="font-mono text-xs text-slate-600">
                  {t('tCO2e/đơn vị SP', 'tCO2e/unit')}
                </span>
              </div>
              <input
                type="number"
                step="0.00001"
                placeholder="VD: 0.00151 hoặc 1.21"
                value={state.benchmark_override ?? ''}
                onChange={(e) => updateField('benchmark_override', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-amber-50/30 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="text-[11px] text-amber-800 flex items-center gap-1.5 mt-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{t('Giá trị kịch bản mô phỏng — Không phải định mức benchmark chính thức do Bộ ban hành.', 'Scenario test value — Not an official promulgated benchmark.')}</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* COMPARISON CARD: CALCULATED A VS OFFICIAL ALLOCATION */}
      {selectedFacility && allocationResult.calculatedA !== null && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t('So sánh Hạn ngạch Tính toán (A) với Hạn ngạch Phân bổ Thực tế', 'Comparison: Simulated Allowance A vs Official Allocation')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('Phục vụ phân tích, kiểm thử và tái hiện phương pháp luận của cơ quan quản lý.', 'Used for methodology reproduction, scenario testing, and validation.')}
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {t(`Năm ${allocationResult.allocationYear}`, `Year ${allocationResult.allocationYear}`)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">
                {t('Hạn ngạch Tính toán (A)', 'Calculated Allowance (A)')}
              </div>
              <div className="text-2xl font-extrabold text-brand font-mono">
                {allocationResult.calculatedA?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-slate-400">tCO2e</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">
                {t('Hạn ngạch Phân bổ Thực tế (QĐ 699)', 'Official Allocated (Dec 699)')}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {allocationResult.officialAllocation?.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">tCO2e {t('(Ràng buộc pháp lý)', '(Legally binding)')}</div>
            </div>

            <div className={`rounded-xl p-4 border ${
              (allocationResult.difference || 0) >= 0 ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
            }`}>
              <div className="text-xs text-slate-500 mb-1">
                {t('Chênh lệch', 'Variance')}
              </div>
              <div className={`text-2xl font-extrabold font-mono ${
                (allocationResult.difference || 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {(allocationResult.difference || 0) >= 0 ? '+' : ''}
                {allocationResult.difference?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                {allocationResult.differencePercent !== null ? `${allocationResult.differencePercent > 0 ? '+' : ''}${allocationResult.differencePercent.toFixed(2)}%` : '0%'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setCurrentScreen(3)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 cursor-pointer"
        >
          ← {t('Quay lại: Nghĩa vụ Hạn ngạch', 'Back: Quota Scope')}
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen(5)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs hover:bg-brand-dark shadow-xs transition-all cursor-pointer"
        >
          <span>{t('Tiếp theo: Tính toán Vị thế Tuân thủ', 'Next: Simulate Compliance Position')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

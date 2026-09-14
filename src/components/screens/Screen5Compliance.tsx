import React from 'react';
import { 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  ArrowLeftRight, 
  Clock, 
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';
import { LegalButton } from '../legal/LegalButton';
import { CapMeter } from '../common/CapMeter';

export const Screen5Compliance: React.FC = () => {
  const { 
    state, 
    updateField, 
    complianceResult, 
    selectedFacility,
    setCurrentScreen 
  } = useSimulator();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold mb-2 border border-slate-200">
            <Scale className="w-3.5 h-3.5 text-slate-600" />
            {t('Bước 5 trong 8: Mô phỏng Vị thế Tuân thủ', 'Step 5 of 8: Compliance Position & Surrender Gap')}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('Hạn ngạch hiện có đủ hay thiếu so với phát thải thực tế?', 'Do you have sufficient allowances to cover actual emissions?')}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LegalButton ruleId="L013" labelVi="Điều 19(5) Nộp bù" labelEn="Art 19(5) Surrender" />
          <LegalButton ruleId="L015" labelVi="Trần 30% Tín chỉ" labelEn="30% Credit Cap" />
          <LegalButton ruleId="L016" labelVi="Trần 15% Vay mượn" labelEn="15% Borrowing" />
        </div>
      </div>

      {/* CORE RESULT DASHBOARD CARD */}
      <div className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${
        complianceResult.status === 'SURPLUS'
          ? 'bg-emerald-50/50 border-emerald-300'
          : complianceResult.status === 'DEFICIT' || complianceResult.status.startsWith('INVALID_')
            ? 'bg-rose-50/50 border-rose-300'
            : 'bg-slate-50 border-slate-300'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {complianceResult.status === 'SURPLUS' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs">
                  <TrendingUp className="w-4 h-4" />
                  {t('VỊ THẾ DƯ THỪA HẠN NGẠCH', 'COMPLIANCE SURPLUS')}
                </span>
              )}
              {complianceResult.status === 'DEFICIT' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-xs">
                  <TrendingDown className="w-4 h-4" />
                  {t('VỊ THẾ THÂM HỤT HẠN NGẠCH (DEFICIT)', 'COMPLIANCE DEFICIT')}
                </span>
              )}
              {complianceResult.status === 'BALANCED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white font-bold text-xs shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('CÂN BẰNG HOÀN TOÀN', 'BALANCED')}
                </span>
              )}
              {complianceResult.status === 'MISSING_DIRECT_EMISSIONS' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white font-bold text-xs shadow-xs">
                  <AlertCircle className="w-4 h-4" />
                  {t('CHƯA NHẬP ĐỦ PHÁT THẢI THỰC TẾ', 'INCOMPLETE EMISSIONS DATA')}
                </span>
              )}
              {(complianceResult.status === 'INVALID_CREDITS'
                || complianceResult.status === 'INVALID_BORROWING'
                || complianceResult.status === 'INVALID_INPUT'
                || complianceResult.status === 'NOT_APPLICABLE') && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white font-bold text-xs shadow-xs ${
                  complianceResult.status === 'NOT_APPLICABLE' ? 'bg-slate-600' : 'bg-rose-600'
                }`}>
                  <AlertCircle className="w-4 h-4" />
                  {t(complianceResult.statusTextVi, complianceResult.statusTextEn)}
                </span>
              )}

              <span className="text-xs text-slate-500 font-mono">
                {selectedFacility ? `[${selectedFacility.id}] ${selectedFacility.name}` : (state.manual_facility_name || 'Cơ sở tự do')}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
              {complianceResult.status === 'SURPLUS' && (
                <span className="text-emerald-700">
                  +{complianceResult.complianceGap?.toLocaleString()} tCO2e
                </span>
              )}
              {complianceResult.status === 'DEFICIT' && (
                <span className="text-rose-700">
                  {complianceResult.complianceGap?.toLocaleString()} tCO2e
                </span>
              )}
              {complianceResult.status === 'BALANCED' && (
                <span className="text-emerald-700">0 tCO2e</span>
              )}
              {complianceResult.status === 'MISSING_DIRECT_EMISSIONS' && (
                <span className="text-slate-400 text-2xl">—</span>
              )}
              {(complianceResult.status.startsWith('INVALID_') || complianceResult.status === 'NOT_APPLICABLE') && (
                <span className="text-slate-400 text-2xl">—</span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
              {complianceResult.status === 'SURPLUS' && t(
                'Doanh nghiệp có nhiều hạn ngạch hơn nghĩa vụ nộp bù thực tế. Lượng dư thừa này có thể bán trên sàn giao dịch KNK hoặc chuyển tiếp sang chu kỳ tiếp theo.',
                'The facility holds more allowances than required for surrender. This surplus can be sold on the carbon exchange or banked.'
              )}
              {complianceResult.status === 'DEFICIT' && t(
                'Doanh nghiệp thiếu hạn ngạch so với lượng phát thải thực tế. Cần mua thêm hạn ngạch trên sàn, mua bù trừ tín chỉ carbon (tối đa 30%) hoặc vay mượn từ giai đoạn sau (tối đa 15%).',
                'Facility faces an allowance shortfall. Must purchase allowances on the exchange, acquire carbon offsets (max 30%), or borrow from the next phase (max 15%).'
              )}
              {complianceResult.status === 'MISSING_DIRECT_EMISSIONS' && t(
                'Vui lòng nhập số liệu phát thải trực tiếp đã được thẩm định của cả hai năm 2025 và 2026 bên dưới để tính toán chênh lệch tuân thủ.',
                'Please enter verified direct emissions for both 2025 and 2026 below to compute the compliance gap.'
              )}
              {(complianceResult.status.startsWith('INVALID_') || complianceResult.status === 'NOT_APPLICABLE')
                && t(complianceResult.statusTextVi, complianceResult.statusTextEn)}
            </p>
          </div>

          {/* Surrender Deadline Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shrink-0 w-full lg:w-72 shadow-2xs space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand" />
              {t('Thời hạn nộp bù hạn ngạch', 'Surrender Deadline')}
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {complianceResult.surrenderDeadline}
            </div>
            <div className="text-[11px] text-slate-500">
              {t('Trước 31/12 của năm liền sau giai đoạn phân bổ', 'Before Dec 31 of following year')}
            </div>
          </div>
        </div>

        {/* 4 Metrics Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/60">
          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <div className="text-[11px] text-slate-500">{t('Hạn ngạch phân bổ (A)', 'Total Allocation')}</div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {complianceResult.phaseAllocationTotal.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">tCO2e {t('(Giai đoạn)', '(Phase)')}</div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <div className="text-[11px] text-slate-500">{t('Hạn ngạch khả dụng', 'Available Allowances')}</div>
            <div className="text-lg font-bold text-brand font-mono">
              {complianceResult.availableAllowances !== null ? complianceResult.availableAllowances.toLocaleString() : '—'}
            </div>
            <div className="text-[10px] text-slate-400">{t('A + Giao dịch + Vay mượn', 'A + Trades + Borrowing')}</div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <div className="text-[11px] text-slate-500">{t('Nghĩa vụ phải nộp', 'Required Surrender')}</div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {complianceResult.requiredSurrender !== null ? complianceResult.requiredSurrender.toLocaleString() : '—'}
            </div>
            <div className="text-[10px] text-slate-400">{t('Phát thải trực tiếp − Tín chỉ', 'E_direct − Credits')}</div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <div className="text-[11px] text-slate-500">{t('Chênh lệch', 'Compliance Gap')}</div>
            <div className={`text-lg font-bold font-mono ${
              (complianceResult.complianceGap || 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {complianceResult.complianceGap !== null ? `${complianceResult.complianceGap >= 0 ? '+' : ''}${complianceResult.complianceGap.toLocaleString()}` : '—'}
            </div>
            <div className="text-[10px] text-slate-400">{t('Khả dụng − Phải nộp', 'Available − Required')}</div>
          </div>
        </div>
      </div>

      {/* INPUTS: DIRECT EMISSIONS & COMPLIANCE FLEXIBILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Direct Emissions Inputs (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              {t('Phát thải Trực tiếp đã thẩm định (Năm 2025 & 2026)', 'Verified Direct Emissions (2025 & 2026)')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('Lưu ý: Phát thải tuân thủ bắt buộc phải là phát thải trực tiếp trong kỳ phân bổ (không dùng số lịch sử).', 'Note: Compliance emissions must be verified direct emissions of the phase.')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t('Phát thải trực tiếp 2025 *', 'Direct Emissions 2025 *')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={state.direct_emis_2025 ?? ''}
                  onChange={(e) => updateField('direct_emis_2025', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">tCO2e</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t('Phát thải trực tiếp 2026 *', 'Direct Emissions 2026 *')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={state.direct_emis_2026 ?? ''}
                  onChange={(e) => updateField('direct_emis_2026', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">tCO2e</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">{t('Tổng phát thải 2 năm:', 'Phase Emissions Total:')}</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {complianceResult.directEmisTotal !== null ? `${complianceResult.directEmisTotal.toLocaleString()} tCO2e` : t('Chưa nhập đủ', 'Incomplete')}
            </span>
          </div>

          {/* Net Allowance Trades */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-brand" />
                {t('Giao dịch Hạn ngạch Ròng trên sàn (+Mua / -Bán):', 'Net Allowance Trades (+Buy / -Sell):')}
              </span>
              <span className="font-mono text-slate-600 font-bold">
                {(state.net_allowance_trades || 0) > 0 ? '+' : ''}{(state.net_allowance_trades || 0).toLocaleString()} tCO2e
              </span>
            </label>
            <input
              type="number"
              placeholder="VD: +10000 (mua) hoặc -5000 (bán)"
              value={state.net_allowance_trades ?? ''}
              onChange={(e) => updateField('net_allowance_trades', e.target.value ? parseFloat(e.target.value) : 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              {t('Giao dịch làm tăng/giảm hạn ngạch khả dụng, không làm thay đổi nghĩa vụ nộp bù.', 'Trades adjust available allowances without changing surrender requirement.')}
            </span>
          </div>
        </div>

        {/* Flexibility Instruments & Cap Meters (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Carbon Credit Offset (30% Cap) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {t('1. Tín chỉ Carbon sử dụng để Bù trừ', '1. Carbon Credits Used for Offset')}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {t('Tối đa không quá 30% tổng số hạn ngạch được phân bổ.', 'Capped at 30% of total allocated allowances.')}
                </p>
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={state.credits_used ?? ''}
                onChange={(e) => updateField('credits_used', e.target.value ? parseFloat(e.target.value) : 0)}
                className={`w-full px-3 py-2 rounded-lg border font-mono text-sm font-semibold focus:outline-none focus:ring-1 ${
                  complianceResult.isCreditExceeded
                    ? 'border-red-500 text-red-700 bg-red-50/30 focus:ring-red-500'
                    : 'border-slate-300 text-slate-800 focus:ring-brand'
                }`}
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">tCO2e</span>
            </div>

            <CapMeter
              labelVi="Hạn mức bù trừ tín chỉ KNK"
              labelEn="Carbon Offset Limit"
              currentValue={complianceResult.creditsUsed}
              maxCap={complianceResult.creditCap30Percent}
              capPercentText={t('Trần 30%', '30% cap')}
            />
          </div>

          {/* Borrowing from Next Phase (15% Cap) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {t('2. Vay mượn Hạn ngạch từ Kỳ sau', '2. Borrowing from Next Phase')}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {t('Tối đa không quá 15% tổng hạn ngạch (áp dụng đến hết năm 2030).', 'Capped at 15% of phase allocation through end-2030.')}
                </p>
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={state.borrowed_allowances ?? ''}
                onChange={(e) => updateField('borrowed_allowances', e.target.value ? parseFloat(e.target.value) : 0)}
                className={`w-full px-3 py-2 rounded-lg border font-mono text-sm font-semibold focus:outline-none focus:ring-1 ${
                  complianceResult.isBorrowingExceeded
                    ? 'border-red-500 text-red-700 bg-red-50/30 focus:ring-red-500'
                    : 'border-slate-300 text-slate-800 focus:ring-brand'
                }`}
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">tCO2e</span>
            </div>

            <CapMeter
              labelVi="Hạn mức vay mượn kỳ sau"
              labelEn="Phase Borrowing Limit"
              currentValue={complianceResult.borrowedAllowances}
              maxCap={complianceResult.borrowingCap15Percent}
              capPercentText={t('Trần 15%', '15% cap')}
            />
          </div>

        </div>

      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setCurrentScreen(4)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 cursor-pointer"
        >
          ← {t('Quay lại: Mô phỏng Công thức', 'Back: Allocation Sim')}
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen(6)}
          disabled={complianceResult.status.startsWith('INVALID_')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs hover:bg-brand-dark shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{t('Tiếp theo: Minh bạch Căn cứ Pháp lý', 'Next: Legal Library & Auditability')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

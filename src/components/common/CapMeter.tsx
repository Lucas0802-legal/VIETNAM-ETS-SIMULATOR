import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CapMeterProps {
  labelVi: string;
  labelEn: string;
  currentValue: number;
  maxCap: number;
  capPercentText: string;
  unit?: string;
  className?: string;
}

export const CapMeter: React.FC<CapMeterProps> = ({
  labelVi,
  labelEn,
  currentValue,
  maxCap,
  capPercentText,
  unit = 'tCO2e',
  className = '',
}) => {
  const { t } = useLanguage();
  const isExceeded = maxCap > 0 && currentValue > maxCap;
  const percentUsed = maxCap > 0 ? Math.min(100, Math.round((currentValue / maxCap) * 100)) : 0;
  const actualPercent = maxCap > 0 ? ((currentValue / maxCap) * 100).toFixed(1) : '0';

  return (
    <div className={`bg-slate-50 border rounded-xl p-4 transition-all ${isExceeded ? 'border-red-300 bg-red-50/40' : 'border-slate-200'} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          {t(labelVi, labelEn)}
          <span className="bg-slate-200/80 text-slate-700 text-[11px] px-1.5 py-0.5 rounded font-mono">
            {capPercentText}
          </span>
        </span>
        <span className="text-xs font-mono font-semibold text-slate-600">
          {currentValue.toLocaleString()} / {maxCap.toLocaleString()} {unit}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isExceeded ? 'bg-red-500' : percentUsed > 85 ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(100, percentUsed)}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-xs">
        <div className="flex items-center gap-1">
          {isExceeded ? (
            <span className="text-red-700 font-medium flex items-center gap-1 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              {t(`Vượt trần pháp lý quy định (+${(currentValue - maxCap).toLocaleString()} ${unit})`, `Exceeds legal cap by +${(currentValue - maxCap).toLocaleString()} ${unit}`)}
            </span>
          ) : (
            <span className="text-slate-500 text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t(`Đã sử dụng ${actualPercent}% hạn mức cho phép`, `Used ${actualPercent}% of permitted allowance`)}
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {t('Còn lại:', 'Remaining:')} {Math.max(0, maxCap - currentValue).toLocaleString()} {unit}
        </span>
      </div>
    </div>
  );
};

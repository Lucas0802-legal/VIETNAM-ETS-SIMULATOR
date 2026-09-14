import React, { useEffect, useRef } from 'react';
import { 
  Search, 
  ClipboardCheck, 
  Layers, 
  Calculator, 
  Scale, 
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';

export const StepNavigation: React.FC = () => {
  const { currentScreen, setCurrentScreen, complianceResult } = useSimulator();
  const { t } = useLanguage();
  const activeStepRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentScreen]);

  const steps = [
    {
      number: 1,
      id: 'search',
      titleVi: 'Tìm kiếm Cơ sở',
      titleEn: 'Facility Search',
      icon: Search,
    },
    {
      number: 2,
      id: 'inventory',
      titleVi: 'Nghĩa vụ Kiểm kê',
      titleEn: 'GHG Inventory',
      icon: ClipboardCheck,
    },
    {
      number: 3,
      id: 'quota',
      titleVi: 'Nghĩa vụ Hạn ngạch ETS',
      titleEn: 'ETS Quota Scope',
      icon: Layers,
    },
    {
      number: 4,
      id: 'allocation',
      titleVi: 'Mô phỏng Phân bổ (A)',
      titleEn: 'Allocation Sim',
      icon: Calculator,
    },
    {
      number: 5,
      id: 'compliance',
      titleVi: 'Chênh lệch Tuân thủ',
      titleEn: 'Compliance Gap',
      icon: Scale,
      badge: complianceResult.status === 'SURPLUS' ? t('DƯ THỪA', 'SURPLUS') : complianceResult.status === 'DEFICIT' ? t('THIẾU HỤT', 'DEFICIT') : undefined,
      badgeColor: complianceResult.status === 'SURPLUS' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300',
    },
    {
      number: 6,
      id: 'summary',
      titleVi: 'Báo cáo Tổng hợp',
      titleEn: 'Result Summary',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-3 shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentScreen === step.number;
            const isCompleted = currentScreen > step.number;

            return (
              <button
                ref={isActive ? activeStepRef : undefined}
                key={step.id}
                onClick={() => setCurrentScreen(step.number)}
                className={`flex items-center gap-2 min-h-11 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand text-white shadow-xs'
                    : isCompleted
                      ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {step.number}
                </div>

                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{t(step.titleVi, step.titleEn)}</span>

                {step.badge && (
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded uppercase ${isActive ? 'bg-white/20 text-white' : step.badgeColor}`}>
                    {step.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sub-bar with screen description and Next/Prev buttons */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">
              {t(`Màn hình ${currentScreen}/6:`, `Screen ${currentScreen}/6:`)}
            </span>
            <span className="text-slate-600">
              {t(steps[currentScreen - 1].titleVi, steps[currentScreen - 1].titleEn)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentScreen <= 1}
              onClick={() => setCurrentScreen(currentScreen - 1)}
              className="flex items-center justify-center gap-1 min-h-11 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{t('Trước', 'Prev')}</span>
            </button>

            <button
              type="button"
              disabled={currentScreen >= 6}
              onClick={() => setCurrentScreen(currentScreen + 1)}
              className="flex items-center justify-center gap-1 min-h-11 px-3.5 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-dark disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer font-semibold shadow-2xs"
            >
              <span>{t('Tiếp theo', 'Next')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

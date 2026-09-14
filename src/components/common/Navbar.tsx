import React from 'react';
import { 
  Building2, 
  Calendar, 
  Globe, 
  RotateCcw, 
  Printer, 
  ChevronDown,
  Info,
  ShieldCheck,
  BookmarkCheck,
  Landmark,
  FileText
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { 
    state, 
    updateField, 
    presets, 
    loadPreset, 
    resetSimulation, 
    inventoryResult,
    setIsPrintModalOpen,
    setIsTestModalOpen,
    openLegalDrawer
  } = useSimulator();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17">
          
          {/* Institutional Logo & Platform Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center border border-slate-800 shadow-xs">
              <Landmark className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-950 tracking-tight">
                  VIETNAM ETS SIMULATOR
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  QĐ 699/QĐ-BNNMT
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-normal">
                {t('Nền tảng Thẩm định Pháp lý & Mô phỏng Tuân thủ Hạn ngạch Phát thải', 'Vietnam GHG Emission Trading Scheme Simulation & Compliance Platform')}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Assessment Date Selector */}
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 gap-2 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">
                  {t('Ngày thẩm định:', 'Assessment Date:')}
                </span>
                <input
                  type="date"
                  value={state.assessment_date}
                  onChange={(e) => updateField('assessment_date', e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={() => openLegalDrawer('L007')}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border cursor-pointer transition-colors ${
                  inventoryResult.applicableList.includes('42/2026')
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={inventoryResult.listEffectivePeriod}
              >
                {inventoryResult.applicableList.includes('42/2026') ? 'QĐ 42/2026' : 'QĐ 13/2024'}
              </button>
            </div>

            {/* Test Suite Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsTestModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title={t('Mở bảng kiểm thử tự động 35 test cases', 'Open 35 automated test cases')}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden lg:inline">{t('Kiểm thử (35/35)', 'Test Suite (35/35)')}</span>
            </button>

            {/* Scenario Preset Loader */}
            <div className="relative group">
              <button 
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('Kịch bản mẫu', 'Presets')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div className="absolute right-0 mt-1 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  {t('Chọn kịch bản thẩm định', 'Select evaluation scenario')}
                </div>
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset.id)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 text-xs transition-colors group/item"
                  >
                    <div className="font-semibold text-slate-900 group-hover/item:text-blue-700">
                      {language === 'vi' ? preset.title_vi : preset.title_en}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {language === 'vi' ? preset.desc_vi : preset.desc_en}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Report CTA */}
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer"
              title={t('In hoặc xuất báo cáo PDF chuẩn doanh nghiệp', 'Print or export enterprise PDF report')}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('Xuất Báo cáo', 'Export Report')}</span>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
              title={t('Chuyển đổi ngôn ngữ', 'Toggle language')}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={resetSimulation}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title={t('Đặt lại mặc định', 'Reset to defaults')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

      {/* Date warning banner if applicable */}
      {inventoryResult.isDateWarning && (
        <div className="bg-amber-50 border-t border-amber-200 px-4 py-1.5 text-center text-xs text-amber-800 flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{inventoryResult.dateWarning}</span>
        </div>
      )}
    </header>
  );
};

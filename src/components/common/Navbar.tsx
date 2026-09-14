import React, { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  Globe,
  RotateCcw,
  Printer,
  ChevronDown,
  Info,
  ShieldCheck,
  BookmarkCheck,
  Landmark
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

  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const presetRef = useRef<HTMLDivElement>(null);

  // Touch devices have no hover, so the preset menu opens on tap and needs
  // an explicit outside-click/Escape to dismiss.
  useEffect(() => {
    if (!isPresetOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (presetRef.current && !presetRef.current.contains(e.target as Node)) {
        setIsPresetOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPresetOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isPresetOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 h-17">

          {/* Institutional Logo & Platform Title */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-brand text-white flex items-center justify-center border border-brand-dark shadow-xs">
              <Landmark className="w-5 h-5 text-slate-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-sm sm:text-base lg:text-lg text-slate-950 tracking-tight leading-tight line-clamp-2 block">
                  VIETNAM ETS SIMULATOR
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-normal">
                {t('Nền tảng Thẩm định Pháp lý & Mô phỏng Tuân thủ Hạn ngạch Phát thải', 'Vietnam GHG Emission Trading Scheme Simulation & Compliance Platform')}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">

            {/* Assessment Date Selector */}
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 gap-2 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <div className="flex flex-col">
                <label htmlFor="desktop-assessment-date" className="text-[10px] text-slate-400 font-medium">
                  {t('Ngày thẩm định:', 'Assessment Date:')}
                </label>
                <input
                  id="desktop-assessment-date"
                  type="date"
                  value={state.assessment_date}
                  onChange={(e) => updateField('assessment_date', e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={() => openLegalDrawer(inventoryResult.applicableList.includes('42/2026') ? 'L008' : 'L007')}
                disabled={!inventoryResult.isAssessmentDateSupported}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  inventoryResult.applicableList.includes('42/2026')
                    ? 'bg-emerald-50 text-brand-dark border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={t(inventoryResult.listEffectivePeriod, inventoryResult.listEffectivePeriodEn)}
              >
                {inventoryResult.applicableList.includes('42/2026') ? 'QĐ 42/2026' : inventoryResult.applicableList.includes('13/2024') ? 'QĐ 13/2024' : '—'}
              </button>
            </div>

            {/* Test Suite Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsTestModalOpen(true)}
              className="hidden sm:flex items-center justify-center gap-1.5 min-w-11 min-h-11 px-2 sm:px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title={t('Mở bảng kiểm thử tích hợp', 'Open integrated test suite')}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="hidden lg:inline">{t('Bộ kiểm thử', 'Test Suite')}</span>
            </button>

            {/* Scenario Preset Loader */}
            <div className="relative" ref={presetRef}>
              <button
                type="button"
                onClick={() => setIsPresetOpen(v => !v)}
                aria-expanded={isPresetOpen}
                aria-haspopup="menu"
                className="flex items-center justify-center gap-1.5 min-w-11 min-h-11 px-2 sm:px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                title={t('Chọn kịch bản thẩm định mẫu', 'Load a sample scenario')}
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-brand shrink-0" />
                <span className="hidden lg:inline">{t('Kịch bản mẫu', 'Presets')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              <div
                role="menu"
                className={`absolute right-0 mt-1 w-80 max-sm:fixed max-sm:inset-x-3 max-sm:top-[4.5rem] max-sm:mt-0 max-sm:w-auto bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${isPresetOpen ? 'block' : 'hidden'}`}
              >
                <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  {t('Chọn kịch bản thẩm định', 'Select evaluation scenario')}
                </div>
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    role="menuitem"
                    onClick={() => { loadPreset(preset.id); setIsPresetOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 text-xs transition-colors group/item"
                  >
                    <div className="font-semibold text-slate-900 group-hover/item:text-brand">
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
              className="flex items-center justify-center gap-1.5 min-w-11 min-h-11 px-2 sm:px-3.5 py-2 text-xs font-semibold text-white bg-brand hover:bg-brand-dark rounded-xl shadow-xs transition-all cursor-pointer"
              title={t('In hoặc xuất báo cáo PDF chuẩn doanh nghiệp', 'Print or export enterprise PDF report')}
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline">{t('Xuất Báo cáo', 'Export Report')}</span>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center justify-center gap-1 min-w-11 min-h-11 px-2 sm:px-2.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
              title={t('Chuyển đổi ngôn ngữ', 'Toggle language')}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
              <span>{language === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={resetSimulation}
              className="flex items-center justify-center min-w-11 min-h-11 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title={t('Đặt lại mặc định', 'Reset to defaults')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

      <div className="md:hidden border-t border-slate-100 bg-slate-50 px-3 py-2 flex items-center justify-between gap-2 text-xs">
        <label htmlFor="mobile-assessment-date" className="flex items-center gap-1.5 font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          {t('Ngày thẩm định', 'Assessment date')}
        </label>
        <input
          id="mobile-assessment-date"
          type="date"
          value={state.assessment_date}
          onChange={(e) => updateField('assessment_date', e.target.value)}
          className="min-h-11 min-w-0 rounded-lg border border-slate-300 bg-white px-2 font-semibold text-slate-900"
        />
        <button
          type="button"
          onClick={() => openLegalDrawer(inventoryResult.applicableList.includes('42/2026') ? 'L008' : 'L007')}
          disabled={!inventoryResult.isAssessmentDateSupported}
          className="min-h-11 rounded-lg border border-slate-300 bg-white px-2 font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {inventoryResult.applicableList.includes('42/2026') ? 'QĐ 42' : inventoryResult.applicableList.includes('13/2024') ? 'QĐ 13' : '—'}
        </button>
      </div>

      {/* Date warning banner if applicable */}
      {inventoryResult.isDateWarning && (
        <div className="bg-amber-50 border-t border-amber-200 px-4 py-1.5 text-center text-xs text-amber-800 flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{t(inventoryResult.dateWarning, inventoryResult.dateWarningEn)}</span>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertTriangle, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';

export const LegalDrawer: React.FC = () => {
  const { isLegalDrawerOpen, closeLegalDrawer, activeLegalRule, legalRules, openLegalDrawer } = useSimulator();
  const { t } = useLanguage();

  if (!isLegalDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={closeLegalDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs border border-slate-800">
                {activeLegalRule?.id || 'LAW'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-950">
                  {t('Hồ sơ Pháp lý & Minh bạch', 'Legal & Audit Documentation')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('Cơ sở pháp lý theo Nghị định 06 & Quyết định 699/QĐ-BNNMT', 'Legal authority per Decree 06 & Decision 699')}
                </p>
              </div>
            </div>
            <button
              onClick={closeLegalDrawer}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeLegalRule && (
              <div className="space-y-6">
                {/* Topic Banner */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200/80 px-2.5 py-0.5 rounded font-mono">
                    {activeLegalRule.topic}
                  </span>
                  <h4 className="text-base font-bold text-slate-950 mt-2">
                    {activeLegalRule.legal_basis} — {activeLegalRule.article}
                  </h4>
                </div>

                {/* Rule text */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    {t('Nội dung quy định / Kết luận pháp lý', 'Statutory Rule / Legal Finding')}
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    "{activeLegalRule.rule}"
                  </p>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {t('Ngày ban hành', 'Issue Date')}
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {activeLegalRule.issue_date || t('Đã hợp nhất', 'Consolidated')}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t('Tình trạng hiệu lực', 'Effective Status')}
                    </div>
                    <div className="text-sm font-semibold text-emerald-700">
                      {activeLegalRule.effective_status}
                    </div>
                  </div>
                </div>

                {/* Simulator usage */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    {t('Ứng dụng trong Simulator', 'Simulator Implementation')}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeLegalRule.simulator_use}
                  </p>
                </div>

                {/* Caution note */}
                {activeLegalRule.caution && (
                  <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                    <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      {t('Lưu ý quan trọng & Ranh giới pháp lý', 'Caution & Guardrail')}
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      {activeLegalRule.caution}
                    </p>
                  </div>
                )}

                {/* Source link */}
                {activeLegalRule.source_url && (
                  <div className="pt-2">
                    <a
                      href={activeLegalRule.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{t('Xem văn bản gốc tại Cổng TTĐT Chính phủ', 'View official text on Government Portal')}</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Quick Browse All Rules */}
            <div className="pt-6 border-t border-slate-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {t('Danh mục toàn bộ 18 quy tắc pháp lý', 'All 18 Statutory Legal Rules')}
              </h5>
              <div className="space-y-2">
                {legalRules.map(rule => (
                  <button
                    key={rule.id}
                    onClick={() => openLegalDrawer(rule)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      activeLegalRule?.id === rule.id
                        ? 'bg-blue-50 border-blue-300 font-semibold text-blue-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate pr-2">
                      <span className="font-mono font-bold text-blue-600 mr-2">{rule.id}</span>
                      {rule.legal_basis} — {rule.topic}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{rule.article}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

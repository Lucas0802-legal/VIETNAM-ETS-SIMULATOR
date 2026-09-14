import React from 'react';
import { useSimulator } from './context/SimulatorContext';
import { useLanguage } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { StepNavigation } from './components/common/StepNavigation';
import { Screen1Search } from './components/screens/Screen1Search';
import { Screen2Inventory } from './components/screens/Screen2Inventory';
import { Screen3Quota } from './components/screens/Screen3Quota';
import { Screen4Allocation } from './components/screens/Screen4Allocation';
import { Screen5Compliance } from './components/screens/Screen5Compliance';
import { Screen6Legal } from './components/screens/Screen6Legal';
import { Screen7Quality } from './components/screens/Screen7Quality';
import { Screen8Summary } from './components/screens/Screen8Summary';
import { LegalDrawer } from './components/legal/LegalDrawer';
import { PrintableReportModal } from './components/export/PrintableReportModal';
import { TestSuiteModal } from './components/common/TestSuiteModal';
import { Shield, ExternalLink } from 'lucide-react';

export const App: React.FC = () => {
  const { currentScreen, openLegalDrawer, isTestModalOpen, setIsTestModalOpen } = useSimulator();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      
      {/* Top Corporate Navbar */}
      <Navbar />

      {/* 8-Step Navigation Bar */}
      <StepNavigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentScreen === 1 && <Screen1Search />}
        {currentScreen === 2 && <Screen2Inventory />}
        {currentScreen === 3 && <Screen3Quota />}
        {currentScreen === 4 && <Screen4Allocation />}
        {currentScreen === 5 && <Screen5Compliance />}
        {currentScreen === 6 && <Screen6Legal />}
        {currentScreen === 7 && <Screen7Quality />}
        {currentScreen === 8 && <Screen8Summary />}
      </main>

      {/* Global Legal Drawer */}
      <LegalDrawer />

      {/* Global Printable Report Modal */}
      <PrintableReportModal />

      {/* Global Automated Test Suite Modal */}
      <TestSuiteModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} />

      {/* Enterprise Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Vietnam ETS Simulator Prototype</span>
            <span>—</span>
            <span>{t('Dự án dự thi Đổi mới Sáng tạo 2026', 'Innovation Competition 2026 Submission')}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => openLegalDrawer('L001')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              {t('Cơ sở pháp lý: VBHN 48/VBHN-BNNMT', 'Legal Basis: 48/VBHN-BNNMT')}
            </button>
            <button
              type="button"
              onClick={() => openLegalDrawer('L011')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              {t('Quyết định 699/QĐ-BNNMT (110 Cơ sở)', 'Decision 699 (110 Facilities)')}
            </button>
            <a
              href="https://dcc.mae.gov.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <span>{t('Cục Biến đổi khí hậu', 'DCC Portal')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          {t(
            'Tuyên bố miễn trừ trách nhiệm: Website là công cụ mô phỏng chính sách và thẩm định phương pháp luận phục vụ nghiên cứu & thi đấu, không thay thế văn bản quy phạm pháp luật hay phán quyết của cơ quan nhà nước có thẩm quyền.',
            'Disclaimer: This web prototype is a policy simulation and methodology validation model for research & competition purposes. It does not constitute official legal advice or replace state administrative records.'
          )}
        </div>
      </footer>

    </div>
  );
};

export default App;

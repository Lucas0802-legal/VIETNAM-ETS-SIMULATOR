import React from 'react';
import { BookOpen } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';

interface LegalButtonProps {
  ruleId?: string;
  labelVi?: string;
  labelEn?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const LegalButton: React.FC<LegalButtonProps> = ({
  ruleId = 'L001',
  labelVi = 'Căn cứ pháp lý',
  labelEn = 'Legal basis',
  size = 'sm',
  className = '',
}) => {
  const { openLegalDrawer } = useSimulator();
  const { t } = useLanguage();

  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-1 text-xs gap-1.5' 
    : 'px-3.5 py-1.5 text-sm gap-2';

  return (
    <button
      type="button"
      onClick={() => openLegalDrawer(ruleId)}
      className={`inline-flex items-center font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-colors shadow-2xs cursor-pointer ${sizeClasses} ${className}`}
      title={t('Xem căn cứ pháp lý và nguồn chính thức', 'View legal basis and official source')}
    >
      <BookOpen className={size === 'sm' ? 'w-3.5 h-3.5 text-slate-500' : 'w-4 h-4 text-slate-500'} />
      <span>{t(labelVi, labelEn)}</span>
    </button>
  );
};

import React from 'react';
import { 
  CheckSquare, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';
import { DATA_READINESS_VI } from '../../utils/labels';

export const Screen7Quality: React.FC = () => {
  const { dataQualityReport, setCurrentScreen } = useSimulator();
  const { language, t } = useLanguage();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold mb-2 border border-slate-200">
            <CheckSquare className="w-3.5 h-3.5 text-slate-600" />
            {t('Bước 7 trong 8: Ma trận Chất lượng Dữ liệu & Tính không chắc chắn', 'Step 7 of 8: Data Quality & Uncertainty Matrix')}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('Kiểm toán Độ sẵn sàng & Minh bạch Thiếu sót Dữ liệu', 'Data Readiness & Gap Audit')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {t(
              'Hệ thống công khai minh bạch trạng thái của từng trường thông tin. Thay vì chỉ báo lỗi "Error" chung chung, website giải thích chính xác đang thiếu số liệu gì và căn cứ pháp lý xử lý.',
              'The platform transparently tracks each data dimension. Rather than throwing generic errors, it specifies exactly what is missing and the statutory rationale.'
            )}
          </p>
        </div>
      </div>

      {/* OVERALL READINESS SCORE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('Mức độ điền đủ dữ liệu', 'Data Completeness')}
            </span>
            <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
              {dataQualityReport.overallScorePercent}%
              <span className="text-xs font-normal text-slate-500 font-sans ml-2">
                ({dataQualityReport.completeCount}/{dataQualityReport.totalDimensions} {t('chiều có dữ liệu', 'dimensions populated')})
              </span>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  dataQualityReport.validityStatus === 'INVALID'
                    ? 'bg-rose-500'
                    : dataQualityReport.overallScorePercent >= 80
                    ? 'bg-emerald-500'
                    : dataQualityReport.overallScorePercent >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                }`}
                style={{ width: `${dataQualityReport.overallScorePercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className={`rounded-xl border p-3 ${dataQualityReport.validityStatus === 'INVALID' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            <span className="font-bold">{t('Tính hợp lệ:', 'Validity:')}</span>{' '}
            {dataQualityReport.validityStatus === 'VALID'
              ? t('Hợp lệ trong phạm vi kiểm tra', 'Valid within implemented checks')
              : dataQualityReport.validityStatus === 'INVALID'
                ? t('Có lỗi cần sửa trước khi sử dụng kết quả', 'Errors must be fixed before using results')
                : t('Chưa đủ dữ liệu để kết luận', 'Insufficient data for a conclusion')}
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <span className="font-bold">{t('Xác minh nguồn:', 'Source verification:')}</span>{' '}
            {dataQualityReport.verificationStatus === 'UNVERIFIED'
              ? t('Chưa xác minh', 'Unverified')
              : t('Một phần', 'Partial')}
          </div>
        </div>

        {dataQualityReport.validityIssuesVi.length > 0 && (
          <ul className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 list-disc pl-7">
            {(language === 'vi' ? dataQualityReport.validityIssuesVi : dataQualityReport.validityIssuesEn).map(issue => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        )}

        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
          <span>
            {t(
              'Nguyên tắc bảo vệ dữ liệu: Tuyệt đối không tự ý bịa đặt số liệu phát thải của nhà máy hay mặc định tham số g/r = 0% để ép ra kết quả.',
              'Data integrity safeguard: Simulator never fabricates plant emissions or silently defaults g/r to 0%.'
            )}
          </span>
        </div>
      </div>

      {/* 6 DIMENSIONS DETAILED TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {t('Chi tiết 6 Tiêu chí Thẩm định Dữ liệu', '6 Data Quality Dimensions')}
          </h3>
          <span className="text-xs text-slate-500">
            {t('Tiêu chuẩn ISO 14064 & Thông tư chuyên ngành', 'ISO 14064 & Sectoral Circulars')}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {dataQualityReport.dimensions.map((dim) => {
            const isReady = dim.status === 'READY';
            const isPartial = dim.status === 'PARTIAL';
            const isUnverified = dim.status === 'UNVERIFIED';

            return (
              <div key={dim.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {language === 'vi' ? dim.nameVi : dim.nameEn}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {language === 'vi' ? dim.detailVi : dim.detailEn}
                  </p>

                  <div className="text-[11px] text-slate-400 font-medium">
                    {t('Cơ sở tham chiếu:', 'Reference Basis:')} {t(dim.legalNoteVi, dim.legalNoteEn)}
                  </div>
                </div>

                <div className="shrink-0 sm:text-right">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isReady
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : isPartial
                        ? 'bg-emerald-100 text-brand-dark border border-emerald-200'
                        : isUnverified
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {isReady && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {isPartial && <AlertCircle className="w-3.5 h-3.5 text-brand" />}
                    {isUnverified && <HelpCircle className="w-3.5 h-3.5 text-amber-600" />}
                    {!isReady && !isPartial && !isUnverified && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    <span>{t(DATA_READINESS_VI[dim.status] ?? dim.status, dim.status)}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setCurrentScreen(6)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 cursor-pointer"
        >
          ← {t('Quay lại: Thư viện Pháp lý', 'Back: Legal Library')}
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen(8)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs hover:bg-brand-dark shadow-xs transition-all cursor-pointer"
        >
          <span>{t('Tiếp theo: Báo cáo Tổng kết & Xuất tệp', 'Next: Executive Summary & Export')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

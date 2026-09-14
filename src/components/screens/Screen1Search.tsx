import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Building2, 
  ArrowRight, 
  MapPin, 
  UserCheck, 
  Zap,
  Hammer,
  Layers,
  HelpCircle,
  Edit3,
  Landmark,
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useLanguage } from '../../context/LanguageContext';
import { normalizeSearchText } from '../../utils/search';
import { LegalButton } from '../legal/LegalButton';
import type { SectorType } from '../../types';

export const Screen1Search: React.FC = () => {
  const { 
    facilities, 
    selectedFacility, 
    selectFacility, 
    state, 
    updateField, 
    setManualMode,
    setCurrentScreen 
  } = useSimulator();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<'All' | SectorType>('All');

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    const q = normalizeSearchText(searchQuery);
    return facilities.filter((f) => {
      const matchQuery =
        normalizeSearchText(f.id).includes(q) ||
        normalizeSearchText(f.name).includes(q) ||
        normalizeSearchText(f.name_en).includes(q) ||
        f.tax_id.includes(searchQuery.trim()) ||
        normalizeSearchText(f.address).includes(q) ||
        normalizeSearchText(f.address_en).includes(q);

      const matchSector = selectedSector === 'All' || f.sector === selectedSector;

      return matchQuery && matchSector;
    });
  }, [facilities, searchQuery, selectedSector]);

  const sectorCounts = useMemo(() => {
    return {
      All: facilities.length,
      'Thermal power': facilities.filter(f => f.sector === 'Thermal power').length,
      'Iron & steel': facilities.filter(f => f.sector === 'Iron & steel').length,
      Cement: facilities.filter(f => f.sector === 'Cement').length,
    };
  }, [facilities]);

  return (
    <div className="space-y-6">
      
      {/* Top Professional Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
            <Landmark className="w-3.5 h-3.5 text-slate-600" />
            <span>{t('Phân hệ 01: Nhận diện Cơ sở & Căn cứ Dữ liệu Giai đoạn 2025–2026', 'Module 01: Facility Identification & 2025–2026 Regulatory Scope')}</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
            {t('Tra cứu Cơ sở Thuộc Danh mục Hạn ngạch Quyết định 699', 'Facility Lookup — Official Decision 699 Quota Register')}
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {t(
              'Cơ sở dữ liệu tích hợp toàn bộ 110 cơ sở phát thải thí điểm được phân bổ hạn ngạch KNK chính thức theo Quyết định số 699/QĐ-BNNMT của Bộ Nông nghiệp & Môi trường, phân loại theo 3 ngành: Nhiệt điện (34), Thép (25) và Xi măng (51).',
              'The platform includes all 110 official facilities allocated pilot GHG quotas under Decision 699 across 3 sectors: Thermal Power (34), Iron & Steel (25), and Cement (51).'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <LegalButton ruleId="L011" labelVi="QĐ 699/QĐ-BNNMT" labelEn="Decision 699" />
          <LegalButton ruleId="L010" labelVi="QĐ 263/QĐ-TTg (Tổng hạn ngạch)" labelEn="Decision 263 (National Cap)" />
        </div>
      </div>

      {/* Mode Switcher: Official 110 vs Manual Mode */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-1.5 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setManualMode(false)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !state.is_manual
                ? 'bg-brand text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('110 Cơ sở QĐ 699 (Chính thức)', '110 Official Facilities (Decision 699)')}</span>
          </button>

          <button
            type="button"
            onClick={() => setManualMode(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              state.is_manual
                ? 'bg-brand text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t('Cơ sở tự do', 'Manual Facility Mode')}</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline px-3 font-mono">
          {state.is_manual 
            ? t('Chế độ mô phỏng cho cơ sở ngoài danh mục', 'Sandbox mode for unlisted facilities')
            : t('Bộ TN&MT • Cục Biến đổi khí hậu', 'Ministry of Natural Resources & Env')}
        </span>
      </div>

      {/* MANUAL MODE VIEW */}
      {state.is_manual ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900">
              {t('Khai báo thông tin Cơ sở tự do ngoài danh mục QĐ 699', 'Manual Facility Declaration')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t(
                'Dành cho các nhà máy, doanh nghiệp muốn thẩm định xem mình có thuộc diện phải nộp báo cáo kiểm kê KNK hay không và thử nghiệm tính toán hạn ngạch giả định.',
                'For unlisted facilities to verify GHG inventory statutory criteria and test hypothetical allocations.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="manual-facility-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('Tên cơ sở / Doanh nghiệp *', 'Facility / Company Name *')}
              </label>
              <input
                id="manual-facility-name"
                type="text"
                placeholder={t('Ví dụ: Nhà máy Sản xuất ABC - Chi nhánh Bình Dương', 'e.g. ABC Manufacturing Facility')}
                value={state.manual_facility_name}
                onChange={(e) => updateField('manual_facility_name', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="manual-tax-id" className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('Mã số thuế doanh nghiệp (Tax ID)', 'Tax ID')}
              </label>
              <input
                id="manual-tax-id"
                type="text"
                placeholder={t('Ví dụ: 0102345678', 'e.g. 0102345678')}
                value={state.manual_tax_id}
                onChange={(e) => updateField('manual_tax_id', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="manual-facility-type" className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('Loại hình cơ sở (Theo Điều 6)', 'Facility Type (Article 6 criteria)')}
              </label>
              <select
                id="manual-facility-type"
                value={state.facility_type}
                onChange={(e) => updateField('facility_type', e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:outline-none bg-white"
              >
                <option value="Thermal power">{t('Nhà máy nhiệt điện', 'Thermal power plant')}</option>
                <option value="Industrial production">{t('Cơ sở sản xuất công nghiệp', 'Industrial production facility')}</option>
                <option value="Freight transport">{t('Doanh nghiệp vận tải hàng hóa', 'Freight transport company')}</option>
                <option value="Commercial building">{t('Tòa nhà thương mại', 'Commercial building')}</option>
                <option value="Solid waste treatment">{t('Cơ sở xử lý chất thải rắn', 'Solid waste treatment facility')}</option>
                <option value="Other">{t('Lĩnh vực khác', 'Other sector')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('Lĩnh vực ETS tương ứng', 'Applicable ETS Sector')}
              </label>
              <select
                value={state.sector}
                onChange={(e) => updateField('sector', e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:outline-none bg-white"
              >
                <option value="Thermal power">{t('Nhiệt điện (Điện năng - kWh)', 'Thermal power (Electricity - kWh)')}</option>
                <option value="Iron & steel">{t('Sắt thép (Thép thô - tấn)', 'Iron & steel (Crude steel - tonnes)')}</option>
                <option value="Cement">{t('Xi măng (Clanhke - tấn)', 'Cement (Clinker - tonnes)')}</option>
                <option value="Other">{t('Khác / Chưa có ETS thí điểm', 'Other / Non-pilot sector')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentScreen(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs hover:bg-brand-dark shadow-xs transition-all cursor-pointer"
            >
              <span>{t('Tiếp tục: Kiểm tra Nghĩa vụ Kiểm kê', 'Next: Check Inventory Obligation')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* OFFICIAL 110 LIST SEARCH VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Search & Facility List (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('Tra cứu mã cơ sở (F001–F110), tên nhà máy, mã số thuế...', 'Search by ID (F001–F110), facility name, tax ID, province...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Sector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(['All', 'Thermal power', 'Iron & steel', 'Cement'] as const).map((sector) => {
                const isSelected = selectedSector === sector;
                return (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => setSelectedSector(sector)}
                    className={`min-h-11 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {sector === 'All' && <Layers className="w-3.5 h-3.5 opacity-70" />}
                    {sector === 'Thermal power' && <Zap className="w-3.5 h-3.5 opacity-70" />}
                    {sector === 'Iron & steel' && <Hammer className="w-3.5 h-3.5 opacity-70" />}
                    {sector === 'Cement' && <Building2 className="w-3.5 h-3.5 opacity-70" />}
                    <span>
                      {sector === 'All'
                        ? t('Tất cả', 'All')
                        : sector === 'Thermal power'
                          ? t('Nhiệt điện', 'Thermal power')
                          : sector === 'Iron & steel'
                            ? t('Sắt thép', 'Iron & steel')
                            : t('Xi măng', 'Cement')}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {sectorCounts[sector]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Facilities List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
              {filteredFacilities.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  {t('Không tìm thấy cơ sở phù hợp với từ khóa tra cứu.', 'No facilities found matching your search.')}
                </div>
              ) : (
                filteredFacilities.map((facility) => {
                  const isSelected = selectedFacility?.id === facility.id;

                  return (
                    <button
                      key={facility.id}
                      type="button"
                      onClick={() => selectFacility(facility.id)}
                      className={`w-full text-left p-3.5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-slate-100/80 border-l-4 border-l-slate-900'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-brand text-white'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {facility.id}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {t(facility.name, facility.name_en)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono text-slate-600">MST: {facility.tax_id}</span>
                            <span>•</span>
                            <span className="truncate max-w-xs">{t(facility.address, facility.address_en)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                          {facility.allocation_total.toLocaleString()} tCO2e
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {t(facility.sector_vi, facility.sector)}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Facility Profile Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {selectedFacility ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24 space-y-5">
                
                {/* Header */}
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded mb-1.5 border border-slate-200 font-mono">
                    {selectedFacility.id} • {t(selectedFacility.sector_vi, selectedFacility.sector)}
                  </span>
                  <h3 className="text-base font-bold text-slate-950 leading-snug">
                    {t(selectedFacility.name, selectedFacility.name_en)}
                  </h3>
                </div>

                {/* Meta details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{t(selectedFacility.address, selectedFacility.address_en)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t('Đại diện pháp luật:', 'Representative:')} <strong className="text-slate-800">{selectedFacility.representative}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t('Mã số thuế:', 'Tax ID:')} <strong className="text-slate-900 font-mono">{selectedFacility.tax_id}</strong></span>
                  </div>
                </div>

                {/* Quota Numbers Highlight Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {t('Hạn ngạch phân bổ chính thức (Quyết định 699)', 'Official Allocated Allowances (Decision 699)')}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white rounded-lg p-2.5 border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-medium">{t('Năm 2025', 'Year 2025')}</div>
                      <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                        {selectedFacility.allocation_2025.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">tCO2e</div>
                    </div>

                    <div className="bg-white rounded-lg p-2.5 border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-medium">{t('Năm 2026', 'Year 2026')}</div>
                      <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                        {selectedFacility.allocation_2026.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">tCO2e</div>
                    </div>
                  </div>

                  <div className="bg-brand rounded-lg p-3 text-white flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      {t('Tổng hạn ngạch chu kỳ 2025–2026', 'Phase Total')}
                    </span>
                    <span className="text-sm font-bold font-mono tabular-nums text-white">
                      {selectedFacility.allocation_total.toLocaleString()} tCO2e
                    </span>
                  </div>
                </div>

                {/* Product Unit info */}
                <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span>{t('Sản phẩm căn cứ:', 'Benchmark Product:')}</span>
                  <span className="font-semibold text-slate-800">
                    {t(selectedFacility.product_vi, selectedFacility.product)} ({selectedFacility.product_unit})
                  </span>
                </div>

                {/* Next Step CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen(2)}
                    className="w-full flex items-center justify-center gap-2 min-h-11 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs hover:bg-brand-dark shadow-xs transition-all cursor-pointer"
                  >
                    <span>{t('Tiến hành Thẩm định Nghĩa vụ Kiểm kê', 'Proceed to Assessment')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400 space-y-2">
                <HelpCircle className="w-6 h-6 mx-auto text-slate-300" />
                <p className="text-xs font-medium">
                  {t('Vui lòng chọn một cơ sở từ danh sách bên trái.', 'Please select a facility from the list.')}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

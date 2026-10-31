import React from 'react';
import { MapPin, Sparkles, Check, RefreshCw } from 'lucide-react';
import { MOCK_CROPS, CURRENT_FARMER } from '../../../data/mockData';
import { formatQuintals } from '../../../utils/currency';
import { useLanguage } from '../../../context/LanguageContext';

interface WelcomeSectionProps {
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  selectedCropId,
  onSelectCrop,
  quantity,
  onQuantityChange,
  isRefreshing,
  onRefresh,
}) => {
  const { language, t } = useLanguage();
  const activeCrop = MOCK_CROPS.find((c) => c.id === selectedCropId) || MOCK_CROPS[0];

  return (
    <div className="bg-gradient-to-br from-agri-900 via-agri-800 to-agri-900 rounded-2xl p-5 sm:p-7 text-white shadow-md border border-agri-700/50">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-agri-700/60">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-agri-950/60 text-agri-200 text-xs font-medium mb-2 border border-agri-600/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {language === 'mr'
                ? 'कृषिमित्र - नफा सल्ला व थेट बाजारपेठ'
                : language === 'hi'
                ? 'कृषिमित्र - लाभ सलाहकार और प्रत्यक्ष बाज़ार'
                : 'AI Market & Net-Earning Advisor • Seva First Challenge'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {t('dashboard.welcome')}, {CURRENT_FARMER.fullName} 🙏
          </h1>
          <p className="text-agri-300 text-xs sm:text-sm mt-1">
            {language === 'mr'
              ? 'बाजार समितीत जाण्यापूर्वी निव्वळ नफा आणि वाहतूक खर्चाची तुलना करा.'
              : language === 'hi'
              ? 'मंडी जाने से पहले शुद्ध लाभ और परिवहन लागत की तुलना करें।'
              : 'Compare real in-hand earnings before sending produce to APMC mandis.'}
          </p>
        </div>

        {/* Farmer Location & Refresh */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <div className="bg-agri-950/70 border border-agri-700/60 px-3.5 py-2 rounded-xl text-left">
            <div className="text-[10px] uppercase tracking-wider text-agri-300 font-semibold flex items-center">
              <MapPin className="w-3 h-3 text-amber-400 mr-1" />
              Farmgate Location
            </div>
            <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
              {CURRENT_FARMER.village}, {CURRENT_FARMER.district}
            </div>
            <div className="text-[10px] text-agri-300">
              {CURRENT_FARMER.state}
            </div>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-agri-700/80 hover:bg-agri-700 active:scale-95 text-agri-100 border border-agri-600/60 transition-all cursor-pointer"
            title="Refresh Market Snapshots"
            aria-label="Refresh Market Snapshots"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
          </button>
        </div>
      </div>

      {/* Crop Selection & Quantity Row */}
      <div className="pt-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Crop Selector Tabs */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-agri-200 flex items-center justify-between">
            <span>Select Harvested Produce:</span>
            <span className="text-[11px] text-amber-300 font-normal">Tap to switch analysis</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {MOCK_CROPS.map((crop) => {
              const isSelected = crop.id === selectedCropId;
              return (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => onSelectCrop(crop.id)}
                  className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-agri-900 shadow-md ring-2 ring-amber-400'
                      : 'bg-agri-950/60 text-agri-200 hover:bg-agri-700/60 border border-agri-700/60'
                  }`}
                >
                  <span className="text-base">{crop.icon}</span>
                  <span>{crop.name}</span>
                  <span className="text-[11px] opacity-75 hidden sm:inline">({crop.marathiName.split(' ')[0]})</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-agri-700" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="bg-agri-950/50 border border-agri-700/70 rounded-xl p-3 sm:px-4 sm:py-3 flex items-center justify-between sm:justify-start space-x-4">
          <div>
            <div className="text-[10px] text-agri-300 uppercase tracking-wider font-semibold">
              Produce Ready
            </div>
            <div className="text-base sm:text-lg font-bold text-amber-300">
              {formatQuintals(quantity)}
            </div>
            <div className="text-[10px] text-agri-300">
              {quantity * 100} Kg (Net Load)
            </div>
          </div>

          {/* Quantity adjustment buttons */}
          <div className="flex items-center space-x-1.5 bg-agri-900/90 rounded-lg p-1 border border-agri-700/80">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(10, quantity - 10))}
              className="w-7 h-7 rounded-md bg-agri-800 hover:bg-agri-700 text-white font-bold text-xs flex items-center justify-center transition-colors"
              title="Decrease 10 Qtl"
            >
              -10
            </button>
            <span className="px-2 text-xs font-mono font-bold text-agri-100">{quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(Math.min(500, quantity + 10))}
              className="w-7 h-7 rounded-md bg-agri-800 hover:bg-agri-700 text-white font-bold text-xs flex items-center justify-center transition-colors"
              title="Increase 10 Qtl"
            >
              +10
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


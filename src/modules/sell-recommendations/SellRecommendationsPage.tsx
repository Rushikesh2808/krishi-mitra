import React from 'react';
import { analyzeSellVsWait } from '../../services/advisoryService';
import { useLanguage } from '../../context/LanguageContext';
import { AdvisoryInputControls } from './components/AdvisoryInputControls';
import { AdvisoryHeroCard } from './components/AdvisoryHeroCard';
import { ScenarioComparisonCards } from './components/ScenarioComparisonCards';
import { PartialSellingCard } from './components/PartialSellingCard';
import { AdvisoryComparisonChart } from './components/AdvisoryComparisonChart';
import { Compass, ShieldAlert, Store, TrendingUp, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const SellRecommendationsPage: React.FC = () => {
  const { language, t } = useLanguage();
  // 1. Interactive States
  const [selectedCropId, setSelectedCropId] = React.useState<string>('crop-soybean');
  const [selectedMandiId, setSelectedMandiId] = React.useState<string>('m-lasalgaon');
  const [selectedVillageId, setSelectedVillageId] = React.useState<string>('v-niphad');
  const [quantity, setQuantity] = React.useState<number>(50);
  const [holdingDays, setHoldingDays] = React.useState<number>(5);

  // Storage cost and spoilage defaults
  const [storageRate, setStorageRate] = React.useState<number>(3.0);
  const [spoilagePercent, setSpoilagePercent] = React.useState<number>(0.0);

  // When crop changes, update default storage & spoilage params
  const handleCropChange = (cropId: string) => {
    setSelectedCropId(cropId);
    if (cropId === 'crop-onion') {
      setStorageRate(4.0);
      setSpoilagePercent(4.5);
    } else {
      setStorageRate(3.0);
      setSpoilagePercent(0.0);
    }
  };

  // 2. Perform Sell vs Wait Analysis
  const analysis = React.useMemo(() => {
    return analyzeSellVsWait(
      selectedCropId,
      selectedMandiId,
      selectedVillageId,
      quantity,
      holdingDays,
      storageRate,
      spoilagePercent
    );
  }, [selectedCropId, selectedMandiId, selectedVillageId, quantity, holdingDays, storageRate, spoilagePercent]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Compass className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('advisor.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('advisor.subtitle')}
            </p>
          </div>
        </div>

        {/* Demo Indicator */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-800 self-start sm:self-auto">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Simulated Decision Modeling</span>
        </div>
      </div>

      {/* 1. Interactive Farmer Input Controls */}
      <AdvisoryInputControls
        selectedCropId={selectedCropId}
        onSelectCrop={handleCropChange}
        selectedMandiId={selectedMandiId}
        onSelectMandi={setSelectedMandiId}
        selectedVillageId={selectedVillageId}
        onSelectVillage={setSelectedVillageId}
        quantity={quantity}
        onQuantityChange={setQuantity}
        holdingDays={holdingDays}
        onHoldingDaysChange={setHoldingDays}
        storageRate={storageRate}
        onStorageRateChange={setStorageRate}
        spoilagePercent={spoilagePercent}
        onSpoilagePercentChange={setSpoilagePercent}
      />

      {/* 2. Primary Advisory Hero Recommendation Card */}
      <AdvisoryHeroCard analysis={analysis} />

      {/* 3. Scenario A vs Scenario B Side-by-Side Breakdown Cards */}
      <ScenarioComparisonCards analysis={analysis} />

      {/* 4. Net Realization Bar Chart */}
      <AdvisoryComparisonChart analysis={analysis} />

      {/* 5. Partial / Staggered Selling Alternative Card */}
      {analysis.partialSplit && (
        <PartialSellingCard
          partialSplit={analysis.partialSplit}
          totalQuantity={quantity}
          cropName={analysis.cropName}
        />
      )}

      {/* Cross-Module Navigation Footer */}
      <div className="bg-earth-100/60 rounded-2xl p-4 sm:p-5 border border-earth-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <TrendingUp className="w-4 h-4 text-agri-700 shrink-0" />
          <span>
            Examine the full 10-day price forecast curves and uncertainty bands for {analysis.cropName}.
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <NavLink
            to="/price-forecast"
            className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-semibold transition-all"
          >
            <span>View 10-Day Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

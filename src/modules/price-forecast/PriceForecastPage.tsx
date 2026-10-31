import React from 'react';
import { get10DayCropForecast } from '../../services/forecastService';
import { useLanguage } from '../../context/LanguageContext';
import { ForecastSelector } from './components/ForecastSelector';
import { ForecastChart } from './components/ForecastChart';
import { ForecastSummaryCards } from './components/ForecastSummaryCards';
import { ForecastDayInspector } from './components/ForecastDayInspector';
import { ForecastRiskAdvisory } from './components/ForecastRiskAdvisory';
import { TrendingUp, ShieldAlert, Store, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const PriceForecastPage: React.FC = () => {
  const { language, t } = useLanguage();
  // 1. Interactive States
  const [selectedCropId, setSelectedCropId] = React.useState<string>('crop-soybean');
  const [selectedMandiId, setSelectedMandiId] = React.useState<string>('m-lasalgaon');
  const [selectedDay, setSelectedDay] = React.useState<number>(5);

  // 2. Fetch/Compute 10-Day Forecast Report
  const forecastReport = React.useMemo(() => {
    return get10DayCropForecast(selectedCropId, selectedMandiId);
  }, [selectedCropId, selectedMandiId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('forecast.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('forecast.subtitle')}
            </p>
          </div>
        </div>

        {/* Demo Indicator */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-800 self-start sm:self-auto">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Simulated Demonstration Predictions</span>
        </div>
      </div>

      {/* 1. Crop & Market Selection */}
      <ForecastSelector
        selectedCropId={selectedCropId}
        onSelectCrop={(id) => {
          setSelectedCropId(id);
          setSelectedDay(5);
        }}
        selectedMandiId={selectedMandiId}
        onSelectMandi={(id) => {
          setSelectedMandiId(id);
        }}
        currentPrice={forecastReport.currentPrice}
        overallTrend={forecastReport.overallTrend}
        overallChangePercent={forecastReport.overallChangePercent}
      />

      {/* 2. Forecast Summary Cards (6 Key Milestones) */}
      <ForecastSummaryCards
        report={forecastReport}
        onSelectDay={setSelectedDay}
      />

      {/* 3. Interactive Line Chart (with Area Shading & Dots) */}
      <ForecastChart
        points={forecastReport.points}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        cropName={forecastReport.cropName}
        mandiName={forecastReport.mandiName}
      />

      {/* 4. Interactive Day Inspector */}
      <ForecastDayInspector
        points={forecastReport.points}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        cropName={forecastReport.cropName}
      />

      {/* 5. Confidence, Uncertainty Range & Risk Advisory */}
      <ForecastRiskAdvisory report={forecastReport} />

      {/* Bottom Cross-Module Navigation Footer */}
      <div className="bg-earth-100/60 rounded-2xl p-4 sm:p-5 border border-earth-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <Store className="w-4 h-4 text-agri-700 shrink-0" />
          <span>
            Compare how this forecasted rate affects transportation & net profit across APMC mandis.
          </span>
        </div>

        <NavLink
          to="/market-comparison"
          className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-semibold transition-all self-start sm:self-auto shrink-0"
        >
          <span>Compare Mandi Net Profits</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>
    </div>
  );
};

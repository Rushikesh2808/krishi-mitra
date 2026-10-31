import React from 'react';
import { CropForecastReport } from '../../../services/forecastService';
import { formatINR } from '../../../utils/currency';
import { TrendingUp, TrendingDown, Clock, Award, AlertTriangle } from 'lucide-react';

interface ForecastSummaryCardsProps {
  report: CropForecastReport;
  onSelectDay: (day: number) => void;
}

export const ForecastSummaryCards: React.FC<ForecastSummaryCardsProps> = ({
  report,
  onSelectDay,
}) => {
  const getChangeBadge = (predictedPrice: number) => {
    const diff = predictedPrice - report.currentPrice;
    const pct = ((diff / report.currentPrice) * 100).toFixed(1);

    if (diff === 0) {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
          Baseline
        </span>
      );
    }
    if (diff > 0) {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center space-x-0.5">
          <TrendingUp className="w-3 h-3" />
          <span>+{formatINR(diff)} (+{pct}%)</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center space-x-0.5">
        <TrendingDown className="w-3 h-3" />
        <span>{formatINR(diff)} ({pct}%)</span>
      </span>
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between">
        <span>Forecast Milestones & Summary</span>
        <span className="text-xs font-normal text-slate-500">Tap milestone to inspect</span>
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Card 1: Today's Baseline */}
        <button
          type="button"
          onClick={() => onSelectDay(0)}
          className="text-left p-3.5 rounded-xl bg-white border border-slate-200 shadow-card hover:border-agri-400 hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
              <span>Today (Reference)</span>
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {formatINR(report.currentPrice)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Per Quintal</div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            {getChangeBadge(report.currentPrice)}
          </div>
        </button>

        {/* Card 2: After 3 Days */}
        <button
          type="button"
          onClick={() => onSelectDay(3)}
          className="text-left p-3.5 rounded-xl bg-white border border-slate-200 shadow-card hover:border-agri-400 hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
              <span>After 3 Days</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {formatINR(report.price3Day)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Day 3 (3 Nov)</div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            {getChangeBadge(report.price3Day)}
          </div>
        </button>

        {/* Card 3: After 5 Days */}
        <button
          type="button"
          onClick={() => onSelectDay(5)}
          className="text-left p-3.5 rounded-xl bg-white border border-slate-200 shadow-card hover:border-agri-400 hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
              <span>After 5 Days</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {formatINR(report.price5Day)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Day 5 (5 Nov)</div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            {getChangeBadge(report.price5Day)}
          </div>
        </button>

        {/* Card 4: After 10 Days */}
        <button
          type="button"
          onClick={() => onSelectDay(10)}
          className="text-left p-3.5 rounded-xl bg-white border border-slate-200 shadow-card hover:border-agri-400 hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
              <span>After 10 Days</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {formatINR(report.price10Day)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Day 10 (10 Nov)</div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            {getChangeBadge(report.price10Day)}
          </div>
        </button>

        {/* Card 5: Highest Predicted Price */}
        <button
          type="button"
          onClick={() => onSelectDay(report.highestPriceDay)}
          className="text-left p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 shadow-card hover:border-emerald-400 transition-all flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Highest Peak</span>
              <Award className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-900">
              {formatINR(report.highestPrice)}
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">
              Day {report.highestPriceDay} (Peak Window)
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-200/80">
            {getChangeBadge(report.highestPrice)}
          </div>
        </button>

        {/* Card 6: Lowest Predicted Price */}
        <button
          type="button"
          onClick={() => onSelectDay(report.lowestPriceDay)}
          className="text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-card hover:border-slate-400 transition-all flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              <span>Lowest Dip</span>
              <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-800">
              {formatINR(report.lowestPrice)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Day {report.lowestPriceDay} (Trough)
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200">
            {getChangeBadge(report.lowestPrice)}
          </div>
        </button>
      </div>
    </div>
  );
};


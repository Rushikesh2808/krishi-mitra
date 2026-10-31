import React from 'react';
import { DailyForecastPoint } from '../../../services/forecastService';
import { formatINR } from '../../../utils/currency';
import { Calendar, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ForecastDayInspectorProps {
  points: DailyForecastPoint[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  cropName: string;
}

export const ForecastDayInspector: React.FC<ForecastDayInspectorProps> = ({
  points,
  selectedDay,
  onSelectDay,
  cropName,
}) => {
  const activePoint = points.find((p) => p.day === selectedDay) || points[0];
  const referencePoint = points[0];

  const standardLotQuintals = 50;
  const potentialGrossGain = activePoint.changeFromBase * standardLotQuintals;

  // Holding storage expense (₹3/Qtl/day)
  const estimatedHoldingCost = activePoint.day * 3 * standardLotQuintals;
  const potentialNetAdvantage = potentialGrossGain - estimatedHoldingCost;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-agri-700" />
            <span>Interactive Selling Date Inspector</span>
          </h3>
          <p className="text-xs text-slate-500">
            Select any day to simulate gross revenue vs holding cost on a 50 Quintal dispatch
          </p>
        </div>

        <span className="text-xs font-semibold text-agri-800 bg-agri-50 px-3 py-1 rounded-full border border-agri-200 self-start sm:self-auto">
          Active: {activePoint.dateString}
        </span>
      </div>

      {/* Horizontal Day Buttons Strip (Scrollable on mobile) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
        {points.map((p) => {
          const isSelected = p.day === selectedDay;
          return (
            <button
              key={p.day}
              type="button"
              onClick={() => onSelectDay(p.day)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex flex-col items-center ${
                isSelected
                  ? 'bg-agri-800 text-white shadow-md ring-2 ring-agri-600 ring-offset-1'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="text-[10px] opacity-75">
                {p.day === 0 ? 'Today' : `Day ${p.day}`}
              </span>
              <span className="text-xs font-black">{formatINR(p.predictedPrice)}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Deep Dive Box */}
      <div className="bg-gradient-to-r from-earth-50 via-white to-earth-50 rounded-xl p-4 sm:p-5 border border-earth-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {activePoint.day === 0
                ? 'Current Baseline Rate'
                : `Forecasted Dispatch: Day ${activePoint.day} (${activePoint.fullDate})`}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {formatINR(activePoint.predictedPrice)}
              <span className="text-xs font-normal text-slate-500"> / Quintal</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Expected range: <strong className="text-slate-800">{formatINR(activePoint.minPrice)}</strong> to{' '}
              <strong className="text-slate-800">{formatINR(activePoint.maxPrice)}</strong>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 uppercase font-semibold block">
              Difference vs Today
            </span>
            <div
              className={`text-xl sm:text-2xl font-black mt-0.5 flex items-center sm:justify-end space-x-1 ${
                activePoint.changeFromBase >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {activePoint.changeFromBase >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-rose-600" />
              )}
              <span>
                {activePoint.changeFromBase >= 0
                  ? `+${formatINR(activePoint.changeFromBase)}`
                  : formatINR(activePoint.changeFromBase)}{' '}
                ({activePoint.percentChange >= 0 ? `+${activePoint.percentChange}%` : `${activePoint.percentChange}%`})
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Model certainty: {activePoint.confidenceScore}%
            </span>
          </div>
        </div>

        {/* 50 Quintal Batch Simulation Row */}
        {activePoint.day > 0 && (
          <div className="pt-3 border-t border-earth-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Gross Price Gain (50 Qtl)</span>
              <span
                className={`text-sm font-extrabold ${
                  potentialGrossGain >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {potentialGrossGain >= 0 ? `+${formatINR(potentialGrossGain)}` : formatINR(potentialGrossGain)}
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px] block">
                Estimated Holding Cost ({activePoint.day} Days)
              </span>
              <span className="text-sm font-bold text-slate-700">
                - {formatINR(estimatedHoldingCost)}
              </span>
            </div>

            <div className="p-3 bg-agri-50 rounded-lg border border-agri-200">
              <span className="text-agri-800 text-[11px] font-bold block">
                True In-Hand Net Advantage
              </span>
              <span
                className={`text-sm font-black ${
                  potentialNetAdvantage >= 0 ? 'text-agri-900' : 'text-rose-700'
                }`}
              >
                {potentialNetAdvantage >= 0
                  ? `+${formatINR(potentialNetAdvantage)} extra profit`
                  : `${formatINR(potentialNetAdvantage)} net loss`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


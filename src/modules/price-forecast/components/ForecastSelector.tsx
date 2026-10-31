import React from 'react';
import { MOCK_CROPS, MANDI_LIST } from '../../../data/mockData';
import { formatINR } from '../../../utils/currency';
import { Store, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface ForecastSelectorProps {
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
  selectedMandiId: string;
  onSelectMandi: (mandiId: string) => void;
  currentPrice: number;
  overallTrend: 'Increasing' | 'Decreasing' | 'Fluctuating';
  overallChangePercent: number;
}

export const ForecastSelector: React.FC<ForecastSelectorProps> = ({
  selectedCropId,
  onSelectCrop,
  selectedMandiId,
  onSelectMandi,
  currentPrice,
  overallTrend,
  overallChangePercent,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
      {/* Crop Selector Tabs */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          1. Select Crop For Price Forecasting
        </label>
        <div className="flex flex-wrap gap-2">
          {MOCK_CROPS.map((crop) => {
            const isSelected = crop.id === selectedCropId;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => onSelectCrop(crop.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-agri-700 text-white shadow-sm ring-2 ring-agri-600 ring-offset-1'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{crop.icon}</span>
                <span>{crop.name}</span>
                <span className="text-[11px] opacity-80 hidden sm:inline">
                  ({crop.marathiName.split(' ')[0]})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Market Selector & Baseline Price Badge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 items-center">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1 mb-1.5">
            <Store className="w-3.5 h-3.5 text-agri-700" />
            <span>2. Select APMC Market Baseline</span>
          </label>
          <select
            value={selectedMandiId}
            onChange={(e) => onSelectMandi(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600 focus:border-agri-600 text-sm font-semibold text-slate-900 bg-white"
          >
            {MANDI_LIST.map((mandi) => (
              <option key={mandi.id} value={mandi.id}>
                {mandi.name} ({mandi.district} Dist.)
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Forecast trajectory starts from this market's spot rate today.
          </span>
        </div>

        {/* Current Price & 10-Day Trend Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              Today's Reference Price
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {formatINR(currentPrice)}
              <span className="text-xs font-normal text-slate-500"> / Quintal</span>
            </div>
            <span className="text-[10px] text-slate-400">Baseline modal spot rate</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              10-Day Expected Trend
            </span>
            <div
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-extrabold mt-1 ${
                overallTrend === 'Increasing'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  : overallTrend === 'Decreasing'
                  ? 'bg-rose-100 text-rose-900 border border-rose-200'
                  : 'bg-blue-100 text-blue-900 border border-blue-200'
              }`}
            >
              {overallTrend === 'Increasing' ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              ) : overallTrend === 'Decreasing' ? (
                <TrendingDown className="w-3.5 h-3.5 text-rose-700" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 text-blue-700" />
              )}
              <span>
                {overallTrend} ({overallChangePercent > 0 ? `+${overallChangePercent}%` : `${overallChangePercent}%`})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


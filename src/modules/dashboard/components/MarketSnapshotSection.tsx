import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Store,
  Truck,
  ArrowRight,
  ShieldAlert,
  Info,
  Clock
} from 'lucide-react';
import { formatINR, formatPerQuintal } from '../../../utils/currency';

interface MarketSnapshotSectionProps {
  cropName: string;
  marathiName: string;
  samplePricePerQuintal: number;
  priceTrend: 'rising' | 'falling' | 'stable';
  trendPercent: number;
  bestMandiName: string;
  bestMandiDistanceKm: number;
  bestMandiNetPrice: number;
  lowestTransportMandiName: string;
  lowestTransportCostPerQuintal: number;
}

export const MarketSnapshotSection: React.FC<MarketSnapshotSectionProps> = ({
  cropName,
  marathiName,
  samplePricePerQuintal,
  priceTrend,
  trendPercent,
  bestMandiName,
  bestMandiDistanceKm,
  bestMandiNetPrice,
  lowestTransportMandiName,
  lowestTransportCostPerQuintal,
}) => {
  return (
    <div className="space-y-3">
      {/* Section Header with Demo Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>Today's Market Snapshot</span>
            <span className="text-xs font-normal text-slate-500">
              ({cropName} • {marathiName})
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time APMC arrivals & benchmark spot rates in Nashik and surrounding districts
          </p>
        </div>

        {/* Demo Indicator */}
        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-[11px] font-semibold text-amber-800 self-start sm:self-auto">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Demonstration / Sample Data</span>
        </div>
      </div>

      {/* Snapshot Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Sample Market Modal Price */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
              <span>Current Modal APMC Price</span>
              <div
                className={`flex items-center space-x-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                  priceTrend === 'rising'
                    ? 'bg-emerald-50 text-emerald-700'
                    : priceTrend === 'falling'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {priceTrend === 'rising' ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : priceTrend === 'falling' ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : null}
                <span>
                  {trendPercent > 0 ? `+${trendPercent}%` : `${trendPercent}%`}
                </span>
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatINR(samplePricePerQuintal)}
              <span className="text-xs sm:text-sm font-semibold text-slate-500 ml-1">/ Quintal</span>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Modal average across Nashik division</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Price Band Today</span>
            <span className="font-semibold text-slate-800">
              {formatINR(samplePricePerQuintal - 120)} – {formatINR(samplePricePerQuintal + 160)}
            </span>
          </div>
        </div>

        {/* Card 2: Best Available Market */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-agri-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-agri-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
            Best Net Return
          </div>

          <div>
            <div className="flex items-center space-x-1.5 text-agri-700 text-xs font-semibold mb-1.5">
              <Store className="w-4 h-4" />
              <span>Highest Net Realization APMC</span>
            </div>

            <div className="text-lg sm:text-xl font-bold text-slate-900">
              {bestMandiName}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {bestMandiDistanceKm} km from Niphad farmgate
            </div>

            <div className="mt-3 inline-flex items-baseline space-x-1">
              <span className="text-xs font-medium text-slate-500">Est. Net in hand:</span>
              <span className="text-base sm:text-lg font-extrabold text-agri-700">
                {formatPerQuintal(bestMandiNetPrice)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Net vs local mandi</span>
            <span className="font-bold text-agri-700">+₹130/Qtl extra profit</span>
          </div>
        </div>

        {/* Card 3: Lowest Transportation Cost */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-blue-700 text-xs font-semibold mb-1.5">
              <Truck className="w-4 h-4" />
              <span>Lowest Transit Expense Mandi</span>
            </div>

            <div className="text-lg sm:text-xl font-bold text-slate-900">
              {lowestTransportMandiName}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Nearest APMC to your farm location
            </div>

            <div className="mt-3 inline-flex items-baseline space-x-1">
              <span className="text-xs font-medium text-slate-500">Freight cost:</span>
              <span className="text-base sm:text-lg font-bold text-blue-700">
                {formatINR(lowestTransportCostPerQuintal)}
                <span className="text-xs font-normal text-slate-500"> / Qtl</span>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <NavLink
              to="/market-comparison"
              className="text-agri-700 hover:text-agri-800 font-bold inline-flex items-center space-x-1 group"
            >
              <span>Compare all mandis</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </NavLink>
            <span className="text-[10px] text-slate-400">5 APMCs mapped</span>
          </div>
        </div>
      </div>
    </div>
  );
};


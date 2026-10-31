import React from 'react';
import {
  Store,
  MapPin,
  Truck,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  Percent,
  AlertCircle
} from 'lucide-react';
import { MandiComparisonEntry } from '../../../types';
import { formatINR, formatPerQuintal } from '../../../utils/currency';

interface MandiComparisonCardProps {
  entry: MandiComparisonEntry;
  quantityQuintals: number;
  cropName: string;
}

export const MandiComparisonCard: React.FC<MandiComparisonCardProps> = ({
  entry,
  quantityQuintals,
  cropName,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={`rounded-2xl transition-all relative overflow-hidden ${
        entry.isHighestNet
          ? 'bg-white border-2 border-agri-600 shadow-lg ring-2 ring-agri-200/50'
          : 'bg-white border border-slate-200 shadow-card hover:shadow-card-hover'
      }`}
    >
      {/* Top Banner Ribbon for Highlights */}
      {entry.isHighestNet && (
        <div className="bg-gradient-to-r from-agri-700 via-agri-800 to-agri-700 text-white px-4 py-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-amber-300" />
            <span>🏆 Best Net Profit Choice (Recommended)</span>
          </div>
          <span className="text-[11px] bg-amber-400 text-agri-950 px-2 py-0.5 rounded-full font-black">
            Top Earner
          </span>
        </div>
      )}

      {entry.isHighestGrossPrice && !entry.isHighestNet && (
        <div className="bg-amber-100/80 border-b border-amber-200 text-amber-900 px-4 py-1.5 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
            <span>Highest Quoted Gross Price (High transit risk)</span>
          </div>
          <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-bold">
            Gross Mirage
          </span>
        </div>
      )}

      {entry.isLowestTransportCost && !entry.isHighestNet && (
        <div className="bg-blue-50 border-b border-blue-200 text-blue-900 px-4 py-1.5 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1">
            <Truck className="w-3.5 h-3.5 text-blue-700" />
            <span>Lowest Freight Expense / Nearest Mandi</span>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-950 px-2 py-0.5 rounded font-bold">
            Minimal Transit
          </span>
        </div>
      )}

      {/* Main Card Content */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Mandi Title & Location */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  entry.isHighestNet
                    ? 'bg-agri-100 text-agri-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {entry.mandiName}
                </h4>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{entry.district} District</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">{entry.distanceKm} km from farmgate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quoted Price Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-right self-start sm:self-auto shrink-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              Quoted Mandi Price
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900">
              {formatINR(entry.pricePerQuintal)}
              <span className="text-xs font-normal text-slate-500"> / Qtl</span>
            </span>
          </div>
        </div>

        {/* Expected Net Earnings Box */}
        <div
          className={`rounded-xl p-4 border transition-all ${
            entry.isHighestNet
              ? 'bg-gradient-to-r from-agri-50 to-agri-100/70 border-agri-300'
              : 'bg-slate-50/80 border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                Estimated In-Hand Net Earnings ({quantityQuintals} Qtl)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-agri-900 tracking-tight mt-0.5">
                {formatINR(entry.netEarnings)}
              </div>
              <div className="text-xs text-agri-800 font-semibold mt-0.5">
                Net Payout: {formatPerQuintal(entry.netEarningsPerQuintal)}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] text-slate-500 block">Value Retained</span>
              <span
                className={`text-sm sm:text-base font-extrabold px-2 py-0.5 rounded-lg inline-block mt-0.5 ${
                  entry.realizationPercentage >= 95
                    ? 'bg-emerald-100 text-emerald-900'
                    : entry.realizationPercentage >= 90
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-rose-100 text-rose-900'
                }`}
              >
                {entry.realizationPercentage}% in hand
              </span>
            </div>
          </div>
        </div>

        {/* 3 Key Metrics Row */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 block">Gross Revenue</span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              {formatINR(entry.grossRevenue)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
            <span className="text-[10px] text-rose-700 block">Transit Freight</span>
            <span className="font-bold text-rose-700 text-xs sm:text-sm">
              - {formatINR(entry.transportationCost)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 block">Cess & Hamali</span>
            <span className="font-bold text-slate-700 text-xs sm:text-sm">
              - {formatINR(entry.otherExpenses)}
            </span>
          </div>
        </div>

        {/* Expandable Expense Breakdown */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-agri-700 cursor-pointer"
          >
            <span>View Full Expense Deductions</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expanded && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-200/80 animate-in fade-in duration-150">
              <div className="flex justify-between">
                <span>Gross Expected Revenue:</span>
                <span className="font-bold text-slate-800">{formatINR(entry.grossRevenue)}</span>
              </div>
              <div className="flex justify-between text-rose-700">
                <span>Transportation Freight ({entry.distanceKm} km):</span>
                <span className="font-semibold">- {formatINR(entry.transportationCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mandi Cess (1.05% APMC fee):</span>
                <span>- {formatINR(entry.mandiCess)}</span>
              </div>
              <div className="flex justify-between">
                <span>Hamali, Weighing & Gunny Bags:</span>
                <span>- {formatINR(entry.hamaliAndPackaging)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-agri-900">
                <span>Total Net Earnings Realized:</span>
                <span>{formatINR(entry.netEarnings)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


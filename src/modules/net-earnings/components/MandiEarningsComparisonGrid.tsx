import React from 'react';
import { MandiComparisonEntry } from '../../../types';
import { formatINR, formatPerQuintal } from '../../../utils/currency';
import { Store, Award, ArrowRight, TrendingUp, Truck } from 'lucide-react';

interface MandiEarningsComparisonGridProps {
  entries: MandiComparisonEntry[];
  selectedMandiId: string;
  onSelectMandi: (mandiId: string) => void;
  cropName: string;
  quantityQuintals: number;
}

export const MandiEarningsComparisonGrid: React.FC<MandiEarningsComparisonGridProps> = ({
  entries,
  selectedMandiId,
  onSelectMandi,
  cropName,
  quantityQuintals,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center space-x-2">
            <Store className="w-5 h-5 text-agri-700" />
            <span>APMC Net Earnings Comparison Benchmark</span>
          </h3>
          <p className="text-xs text-slate-500">
            Comparing true in-hand realization across 6 markets for {quantityQuintals} Qtl of {cropName}
          </p>
        </div>

        <span className="text-[11px] text-slate-400 self-start sm:self-auto">
          Tap any mandi to import its costs
        </span>
      </div>

      {/* Grid of Mandis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.map((entry) => {
          const isSelected = entry.mandiId === selectedMandiId;
          return (
            <div
              key={entry.mandiId}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                entry.isHighestNet
                  ? 'bg-agri-50/70 border-agri-300 ring-2 ring-agri-200'
                  : isSelected
                  ? 'bg-blue-50/50 border-blue-300'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-sm text-slate-900">{entry.mandiName}</span>
                  </div>
                  {entry.isHighestNet && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-agri-700 text-white flex items-center space-x-0.5">
                      <Award className="w-3 h-3 mr-0.5" />
                      <span>Best Net</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 mb-2">
                  {entry.district} Dist. • {entry.distanceKm} km away
                </div>

                {/* Quoted Rate vs In-hand net */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quoted Rate:</span>
                    <span className="font-semibold text-slate-800">{formatINR(entry.pricePerQuintal)}/Qtl</span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span>Freight Deducted:</span>
                    <span className="font-medium">- {formatINR(entry.transportationCost)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1.5 border-t border-slate-200 text-slate-900 text-sm">
                    <span className="text-agri-900">In-Hand Net:</span>
                    <span className="text-agri-800">{formatINR(entry.netEarnings)}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-2 border-t border-slate-200/70">
                <button
                  type="button"
                  onClick={() => onSelectMandi(entry.mandiId)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                    isSelected
                      ? 'bg-agri-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{isSelected ? 'Loaded into Calculator ✓' : 'Load Rates to Calculator'}</span>
                  {!isSelected && <ArrowRight className="w-3 h-3 ml-0.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


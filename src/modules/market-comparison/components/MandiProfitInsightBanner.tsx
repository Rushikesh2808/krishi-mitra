import React from 'react';
import { Award, AlertTriangle, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { MandiComparisonEntry } from '../../../types';
import { formatINR } from '../../../utils/currency';

interface MandiProfitInsightBannerProps {
  entries: MandiComparisonEntry[];
  cropName: string;
  quantityQuintals: number;
}

export const MandiProfitInsightBanner: React.FC<MandiProfitInsightBannerProps> = ({
  entries,
  cropName,
  quantityQuintals,
}) => {
  const highestNetEntry = entries.find((e) => e.isHighestNet);
  const highestGrossEntry = entries.find((e) => e.isHighestGrossPrice);

  if (!highestNetEntry || !highestGrossEntry) return null;

  const isDifferent = highestNetEntry.mandiId !== highestGrossEntry.mandiId;
  const netAdvantage = highestNetEntry.netEarnings - highestGrossEntry.netEarnings;
  const grossDiffPerQtl = highestGrossEntry.pricePerQuintal - highestNetEntry.pricePerQuintal;

  return (
    <div className="bg-gradient-to-r from-agri-900 via-agri-800 to-agri-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-agri-700/60 space-y-4">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-agri-700/70">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-agri-950 flex items-center justify-center font-bold">
            <Award className="w-5 h-5 text-agri-900" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              Smart Market Advisor Insight
            </h3>
            <p className="text-[11px] sm:text-xs text-agri-300">
              For {quantityQuintals} Quintals of {cropName}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-agri-950/70 text-amber-300 border border-agri-600/40 text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Real Net Gain vs Gross Mirage</span>
        </div>
      </div>

      {/* Insight Body */}
      {isDifferent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="space-y-2">
            <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Don't Be Misled by High Distant Prices:</span>
            </div>

            <p className="text-xs sm:text-sm text-agri-100 leading-relaxed">
              <strong className="text-white underline decoration-amber-400 decoration-2">
                {highestGrossEntry.mandiName}
              </strong>{' '}
              quotes <strong className="text-amber-300">₹{grossDiffPerQtl}/Qtl higher</strong> gross price, but its{' '}
              {highestGrossEntry.distanceKm} km transit freight costs you{' '}
              <strong className="text-rose-300">{formatINR(highestGrossEntry.transportationCost)}</strong>.
            </p>
          </div>

          <div className="bg-agri-950/80 rounded-xl p-4 border border-agri-600/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-agri-300 uppercase tracking-wider font-semibold block">
                Recommended Choice: {highestNetEntry.mandiName}
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
                +{formatINR(netAdvantage)} Extra In-Hand Money
              </div>
              <span className="text-[11px] text-agri-200 block mt-0.5">
                Saved in diesel, driver waiting & transit tolls
              </span>
            </div>

            <div className="text-right pl-3 shrink-0">
              <span className="text-[10px] text-slate-400 block">Net Realization</span>
              <span className="text-base sm:text-lg font-bold text-white">
                {highestNetEntry.realizationPercentage}%
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-agri-950/70 p-4 rounded-xl border border-agri-700/60">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Clear Market Leader
            </span>
            <p className="text-xs sm:text-sm text-agri-100 mt-1">
              <strong className="text-white">{highestNetEntry.mandiName}</strong> provides both the highest quoted price and the highest in-hand net realization ({formatINR(highestNetEntry.netEarnings)}).
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-bold text-white">{formatINR(highestNetEntry.netEarnings)}</span>
            <span className="text-xs text-agri-300 block">Total Net Realization</span>
          </div>
        </div>
      )}
    </div>
  );
};


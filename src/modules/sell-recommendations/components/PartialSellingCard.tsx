import React from 'react';
import { PartialSplitSuggestion } from '../../../services/advisoryService';
import { formatINR } from '../../../utils/currency';
import { Split, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PartialSellingCardProps {
  partialSplit: PartialSplitSuggestion;
  totalQuantity: number;
  cropName: string;
}

export const PartialSellingCard: React.FC<PartialSellingCardProps> = ({
  partialSplit,
  totalQuantity,
  cropName,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-amber-300 shadow-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Split className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-slate-900">
              Staggered Selling Alternative (Risk-Hedging Strategy)
            </h4>
            <p className="text-xs text-slate-500">
              Lock in guaranteed liquidity today while retaining exposure to future market upside
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 self-start sm:self-auto">
          Recommended Risk Hedge
        </span>
      </div>

      {/* Suggested Staggered Split Visualization */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Sell 60% Today */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-1">
            Batch 1: Sell 60% Today
          </div>
          <div className="text-xl font-black text-slate-900">
            {partialSplit.sellNowQuintals} Quintals
          </div>
          <div className="text-xs text-slate-600 mt-1 font-semibold">
            In-Hand Net: {formatINR(partialSplit.sellNowNetEarnings)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Guarantees operating liquidity</p>
        </div>

        {/* Hold 40% for Upside */}
        <div className="p-3.5 rounded-xl bg-agri-50 border border-agri-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-agri-800 mb-1">
            Batch 2: Hold 40%
          </div>
          <div className="text-xl font-black text-agri-900">
            {partialSplit.holdQuintals} Quintals
          </div>
          <div className="text-xs text-agri-800 mt-1 font-semibold">
            Expected Net: {formatINR(partialSplit.holdNetEarnings)}
          </div>
          <p className="text-[10px] text-agri-600 mt-1">Captures forecasted price rise</p>
        </div>

        {/* Blended Realization */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1">
            Blended Net Realization
          </div>
          <div className="text-xl font-black text-slate-900">
            {formatINR(partialSplit.blendedNetEarnings)}
          </div>
          <div className="text-xs text-emerald-700 font-bold mt-1">
            +{formatINR(partialSplit.blendedNetGainVsSellToday)} vs selling all today
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Minimal downside risk</p>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import {
  Wheat,
  Sparkles,
  Store,
  ShieldCheck,
  TrendingUp,
  Warehouse,
  Info,
  Scale
} from 'lucide-react';
import { ProduceInventorySummary } from '../../../data/marketplaceStore';

interface ProduceInventoryOverviewProps {
  summary: ProduceInventorySummary;
  totalAcreage: number;
}

export const ProduceInventoryOverview: React.FC<ProduceInventoryOverviewProps> = ({
  summary,
  totalAcreage,
}) => {
  const { totalHarvested, totalAvailable, totalListed, totalCommitted } = summary;

  // Percentages for stacked progress bar
  const safeTotal = totalHarvested > 0 ? totalHarvested : 1;
  const availablePct = Math.round((totalAvailable / safeTotal) * 100);
  const listedPct = Math.round((totalListed / safeTotal) * 100);
  const committedPct = Math.round((totalCommitted / safeTotal) * 100);

  return (
    <div className="space-y-4">
      {/* 4 Core Inventory KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Harvested */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-agri-400 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Harvested / एकूण उत्पादन
            </span>
            <div className="w-8 h-8 rounded-xl bg-agri-50 text-agri-700 flex items-center justify-center">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalHarvested}</span>
            <span className="text-xs font-semibold text-slate-500">Qtl (क्विंटल)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Across {totalAcreage} acres</span>
            <span className="text-slate-300">•</span>
            <span className="text-agri-700 font-medium">{summary.cropCount} crops</span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-agri-500" />
        </div>

        {/* 2. Available for Sale */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all bg-gradient-to-br from-white via-white to-emerald-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Available for Sale / विक्रीयोग्य
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-800">{totalAvailable}</span>
            <span className="text-xs font-semibold text-emerald-600">Qtl (क्विंटल)</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready for Direct Listing / FPO</span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* 3. Listed in Marketplace */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all bg-gradient-to-br from-white via-white to-amber-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-700">
              Currently Listed / बाजारात नोंदणी
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-800">{totalListed}</span>
            <span className="text-xs font-semibold text-amber-600">Qtl (क्विंटल)</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1 font-medium flex items-center gap-1">
            <span>In active listings & bids</span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </div>

        {/* 4. Committed / Sold */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-200 shadow-sm relative overflow-hidden group hover:border-purple-400 transition-all bg-gradient-to-br from-white via-white to-purple-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-purple-700">
              Committed / Sold / करारबद्ध
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-purple-800">{totalCommitted}</span>
            <span className="text-xs font-semibold text-purple-600">Qtl (क्विंटल)</span>
          </div>
          <p className="text-[11px] text-purple-700 mt-1 font-medium flex items-center gap-1">
            <span>Accepted agreements & FPO lots</span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
        </div>
      </div>

      {/* Farm Inventory Allocation Bar & Validation Equation */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-100">Live Inventory Allocation Ratio</span>
            <span className="text-slate-400">({totalHarvested} Qtl Total Stock)</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="inline-flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Available: {totalAvailable} Qtl ({availablePct}%)</span>
            </span>
            <span className="inline-flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-300">Listed: {totalListed} Qtl ({listedPct}%)</span>
            </span>
            <span className="inline-flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span className="text-slate-300">Committed: {totalCommitted} Qtl ({committedPct}%)</span>
            </span>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5 space-x-1">
          {totalAvailable > 0 && (
            <div
              style={{ width: `${availablePct}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
              title={`Available: ${totalAvailable} Qtl (${availablePct}%)`}
            />
          )}
          {totalListed > 0 && (
            <div
              style={{ width: `${listedPct}%` }}
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              title={`Listed: ${totalListed} Qtl (${listedPct}%)`}
            />
          )}
          {totalCommitted > 0 && (
            <div
              style={{ width: `${committedPct}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
              title={`Committed: ${totalCommitted} Qtl (${committedPct}%)`}
            />
          )}
        </div>

        {/* Stock Management Rule Explanation */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[11px] text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 font-mono font-bold text-[10px] border border-slate-700">
              STOCK EQUATION
            </span>
            <span className="font-mono text-emerald-300">
              Available Quantity ({totalAvailable} Qtl) = Harvested ({totalHarvested} Qtl) - Listed ({totalListed} Qtl) - Committed ({totalCommitted} Qtl)
            </span>
          </div>
          <span className="text-slate-400 text-[10px]">
            *Duplicate allocation is strictly prevented. Quantity is committed only upon contract acceptance.
          </span>
        </div>
      </div>
    </div>
  );
};


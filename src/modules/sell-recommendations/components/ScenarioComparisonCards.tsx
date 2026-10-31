import React from 'react';
import { SellVsWaitAnalysis } from '../../../services/advisoryService';
import { formatINR, formatPerQuintal } from '../../../utils/currency';
import { CheckCircle2, AlertTriangle, ArrowRight, Clock, Truck, Warehouse, Package } from 'lucide-react';

interface ScenarioComparisonCardsProps {
  analysis: SellVsWaitAnalysis;
}

export const ScenarioComparisonCards: React.FC<ScenarioComparisonCardsProps> = ({ analysis }) => {
  const { scenarioToday, scenarioWait, netDifference } = analysis;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base sm:text-lg text-slate-900">
          Scenario Comparison Breakdown
        </h3>
        <span className="text-xs text-slate-500">Transparent side-by-side economics</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Scenario A: Sell Today Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Option A • Immediate Dispatch
              </span>
              <h4 className="font-extrabold text-base text-slate-900 mt-1">
                Sell Today
              </h4>
              <p className="text-xs text-slate-500">Immediate liquidation at current spot rates</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Spot Price</span>
              <span className="text-base font-black text-slate-900">{formatINR(scenarioToday.pricePerQuintal)}/Qtl</span>
            </div>
          </div>

          {/* Net Earnings Highlight */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              Estimated Net In-Hand Earnings
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {formatINR(scenarioToday.netEarnings)}
            </div>
            <span className="text-xs text-slate-600 font-medium">
              Net: {formatPerQuintal(scenarioToday.netPerQuintal)} ({scenarioToday.realizationPercentage}% retained)
            </span>
          </div>

          {/* Deduction Breakdown list */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">Gross Revenue ({scenarioToday.totalQuantityQuintals} Qtl):</span>
              <span className="font-bold text-slate-900">{formatINR(scenarioToday.grossRevenue)}</span>
            </div>
            <div className="flex justify-between text-rose-700">
              <span>Transportation Freight ({analysis.distanceKm} km):</span>
              <span className="font-semibold">- {formatINR(scenarioToday.transportCost)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Storage / Holding Expenses (0 Days):</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Spoilage / Shrinkage Loss (0%):</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Mandi Cess (1.05%) & Handling:</span>
              <span>- {formatINR(scenarioToday.otherExpenses)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
              <span>Total In-Hand Realization:</span>
              <span className="text-agri-800">{formatINR(scenarioToday.netEarnings)}</span>
            </div>
          </div>
        </div>

        {/* Scenario B: Wait and Sell Later Card */}
        <div
          className={`bg-white rounded-2xl p-5 space-y-4 hover:shadow-card-hover transition-all ${
            netDifference > 0
              ? 'border-2 border-agri-600 shadow-md ring-2 ring-agri-100'
              : 'border border-slate-200 shadow-card'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-agri-800 bg-agri-50 px-2 py-0.5 rounded-full border border-agri-200">
                Option B • Stored Holding
              </span>
              <h4 className="font-extrabold text-base text-slate-900 mt-1">
                Wait {analysis.holdingDays} Days
              </h4>
              <p className="text-xs text-slate-500">Sell on {scenarioWait.dateString}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Forecasted Rate</span>
              <span className="text-base font-black text-slate-900">{formatINR(scenarioWait.pricePerQuintal)}/Qtl</span>
            </div>
          </div>

          {/* Net Earnings Highlight */}
          <div
            className={`rounded-xl p-3.5 border ${
              netDifference > 0 ? 'bg-agri-50/80 border-agri-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold block">
                Estimated Net In-Hand Earnings
              </span>
              <span
                className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded ${
                  netDifference > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {netDifference > 0 ? `+${formatINR(netDifference)}` : formatINR(netDifference)}
              </span>
            </div>
            <div className="text-2xl font-black text-agri-900 mt-0.5">
              {formatINR(scenarioWait.netEarnings)}
            </div>
            <span className="text-xs text-agri-800 font-medium">
              Net: {formatPerQuintal(scenarioWait.netPerQuintal)} ({scenarioWait.realizationPercentage}% retained)
            </span>
          </div>

          {/* Deduction Breakdown list */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Gross Revenue ({scenarioWait.effectiveQuantityQuintals} Qtl eff.):
              </span>
              <span className="font-bold text-slate-900">{formatINR(scenarioWait.grossRevenue)}</span>
            </div>
            <div className="flex justify-between text-rose-700">
              <span>Transportation Freight ({analysis.distanceKm} km):</span>
              <span className="font-semibold">- {formatINR(scenarioWait.transportCost)}</span>
            </div>
            <div className="flex justify-between text-amber-800">
              <span>Storage Fees ({analysis.holdingDays}d @ ₹{analysis.storageRatePerDay}/d):</span>
              <span className="font-semibold">- {formatINR(scenarioWait.storageCost)}</span>
            </div>
            {scenarioWait.spoilageLossAmount > 0 && (
              <div className="flex justify-between text-rose-700">
                <span>Spoilage / Shrinkage Loss ({analysis.spoilagePercent}%):</span>
                <span className="font-semibold">- {formatINR(scenarioWait.spoilageLossAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Mandi Cess (1.05%) & Handling:</span>
              <span>- {formatINR(scenarioWait.otherExpenses)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
              <span>Total In-Hand Realization:</span>
              <span className="text-agri-900">{formatINR(scenarioWait.netEarnings)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

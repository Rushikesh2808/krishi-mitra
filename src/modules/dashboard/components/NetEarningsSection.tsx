import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Calculator,
  ArrowRight,
  TrendingDown,
  Info,
  ChevronDown,
  ChevronUp,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { calculateNetEarnings } from '../../../utils/calculations';
import { formatINR, formatPerQuintal } from '../../../utils/currency';

interface NetEarningsSectionProps {
  cropId: string;
  cropName: string;
  quantityQuintals: number;
  expectedPricePerQuintal: number;
  distanceKm: number;
}

export const NetEarningsSection: React.FC<NetEarningsSectionProps> = ({
  cropId,
  cropName,
  quantityQuintals,
  expectedPricePerQuintal,
  distanceKm,
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = React.useState(false);

  // Compute transparent net earnings using standardized utility
  const result = calculateNetEarnings({
    cropId,
    quantityQuintals,
    expectedPricePerQuintal,
    distanceKm,
    transportRatePerKmPerQuintal: 2.5, // Realistic Maharashtra tempo/tractor rate
    holdingDays: 0, // Immediate sale snapshot
    storageCostPerDayPerQuintal: 3.0,
    mandiCessPercentage: 1.05, // APMC standard cess in Maharashtra
    loadingUnloadingCostPerQuintal: 14.0, // Hamali / labor
    packagingCostPerQuintal: 12.0, // Gunny bags / crates
  });

  const realizationRate =
    result.expectedRevenue > 0
      ? ((result.netEarnings / result.expectedRevenue) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="bg-white rounded-2xl border border-earth-200 shadow-card p-5 sm:p-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-agri-100 text-agri-800 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-agri-700" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Net Earnings Overview
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Actual in-hand money after transportation, APMC fees, and packaging deductions
          </p>
        </div>

        {/* Realization Badge */}
        <div className="flex items-center space-x-2 self-start sm:self-auto bg-agri-50 border border-agri-200 px-3 py-1.5 rounded-xl">
          <Percent className="w-4 h-4 text-agri-700" />
          <span className="text-xs text-slate-700">Realization Rate:</span>
          <span className="text-xs font-bold text-agri-800">{realizationRate}% in hand</span>
        </div>
      </div>

      {/* Main Net Earnings Highlight Box */}
      <div className="bg-gradient-to-br from-agri-50 to-agri-100/60 rounded-xl p-5 border border-agri-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-agri-800">
            Estimated In-Hand Net Earnings ({quantityQuintals} Qtl {cropName})
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-agri-900 tracking-tight mt-1">
            {formatINR(result.netEarnings)}
          </div>
          <p className="text-xs text-agri-700 font-medium mt-1">
            Net realization: <strong className="text-agri-900">{formatPerQuintal(result.netEarningsPerQuintal)}</strong> after all expenses
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <NavLink
            to="/net-earnings"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <span>Open Custom Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </div>

      {/* Transparent Calculation Breakdown Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Item 1: Gross Revenue */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Expected Revenue
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            {formatINR(result.expectedRevenue)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {quantityQuintals} Qtl × {formatINR(expectedPricePerQuintal)}
          </div>
        </div>

        {/* Item 2: Transport Cost */}
        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
          <div className="text-[11px] font-medium text-rose-700 uppercase tracking-wider">
            Transportation Cost
          </div>
          <div className="text-base sm:text-lg font-bold text-rose-700 mt-1">
            - {formatINR(result.transportationCost)}
          </div>
          <div className="text-[10px] text-rose-600 mt-0.5">
            {distanceKm} km transit freight
          </div>
        </div>

        {/* Item 3: Storage Cost */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
          <div className="text-[11px] font-medium text-amber-800 uppercase tracking-wider">
            Storage & Holding
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-800 mt-1">
            {result.storageCost === 0 ? '₹0' : `- ${formatINR(result.storageCost)}`}
          </div>
          <div className="text-[10px] text-amber-700 mt-0.5">
            0 Days (Immediate sale)
          </div>
        </div>

        {/* Item 4: Other Expenses */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Cess, Hamali & Bags
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-800 mt-1">
            - {formatINR(result.otherExpenses)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            APMC cess + loading charges
          </div>
        </div>
      </div>

      {/* Formula Explainer Drawer Toggle */}
      <div className="border border-earth-200 rounded-xl overflow-hidden bg-earth-50/60">
        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-agri-800 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-agri-700" />
            <span>How KrishiMitra calculates your net earnings (Transparent Formula)</span>
          </div>
          {showFormulaDetails ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showFormulaDetails && (
          <div className="p-4 pt-1 border-t border-earth-200 text-xs text-slate-700 space-y-2 bg-white">
            <div className="p-3 bg-agri-50 rounded-lg font-mono text-[11px] sm:text-xs text-agri-900 font-semibold border border-agri-200 text-center">
              Net Earnings = Expected Revenue - Transportation Cost - Storage Cost - Other Expenses
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 mt-2">
              <div>
                • <strong>Revenue:</strong> {quantityQuintals} Qtl × {formatINR(expectedPricePerQuintal)} = {formatINR(result.expectedRevenue)}
              </div>
              <div>
                • <strong>Freight:</strong> {distanceKm} km × ₹2.5/km/Qtl × {quantityQuintals} Qtl = {formatINR(result.transportationCost)}
              </div>
              <div>
                • <strong>APMC Cess (1.05%):</strong> {formatINR(result.mandiCessCost)}
              </div>
              <div>
                • <strong>Hamali & Packaging:</strong> {formatINR(result.handlingCost + (quantityQuintals * 12))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              KrishiMitra never hides expenses. Every rupee deducted from your gross price is shown explicitly so you choose the truly profitable APMC.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


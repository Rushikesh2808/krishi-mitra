import React from 'react';
import { DetailedExpenseResult } from '../../../utils/calculations';
import { formatINR, formatPerQuintal } from '../../../utils/currency';
import { Calculator, Percent, TrendingDown, ShieldCheck, ArrowRight } from 'lucide-react';

interface FinancialSummaryCardProps {
  result: DetailedExpenseResult;
  quantityQuintals: number;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  result,
  quantityQuintals,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-card space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-agri-700 bg-agri-50 px-2.5 py-0.5 rounded-full border border-agri-200">
            Realized Financial Summary
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            Calculated Net Earnings & Deductions
          </h2>
        </div>

        {/* Realization Badge */}
        <div className="flex items-center space-x-2 self-start sm:self-auto bg-earth-50 border border-earth-200 px-3 py-1.5 rounded-xl">
          <Percent className="w-4 h-4 text-agri-700" />
          <span className="text-xs text-slate-700 font-medium">Realization Efficiency:</span>
          <span
            className={`text-xs font-black ${
              result.realizationPercentage >= 95
                ? 'text-emerald-700'
                : result.realizationPercentage >= 90
                ? 'text-agri-800'
                : 'text-amber-800'
            }`}
          >
            {result.realizationPercentage}% in hand
          </span>
        </div>
      </div>

      {/* Hero In-Hand Net Earnings Card */}
      <div className="bg-gradient-to-br from-agri-900 via-agri-800 to-agri-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-agri-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-agri-300 block">
            Final Estimated Net Earnings (In-Hand Cash)
          </span>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mt-1">
            {formatINR(result.netEarnings)}
          </div>
          <div className="text-xs text-agri-200 font-semibold mt-1">
            Effective in-hand realization: <strong className="text-white">{formatPerQuintal(result.netEarningsPerQuintal)}</strong>
          </div>
        </div>

        <div className="bg-agri-950/70 border border-agri-700/70 rounded-xl p-3.5 sm:px-5 sm:py-4 text-left shrink-0">
          <span className="text-[10px] uppercase font-semibold text-agri-300 tracking-wider block">
            Total Deductions
          </span>
          <div className="text-lg sm:text-xl font-bold text-rose-300 mt-0.5">
            - {formatINR(result.totalExpenses)}
          </div>
          <span className="text-[11px] text-agri-300 block">
            {formatINR(result.totalExpensesPerQuintal)} / Quintal ({result.expensePercentage}% of revenue)
          </span>
        </div>
      </div>

      {/* 3 Metrics Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Gross Revenue */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Expected Gross Revenue
          </span>
          <div className="text-xl font-black text-slate-900 mt-0.5">
            {formatINR(result.grossRevenue)}
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Before deducting transport & mandi fees
          </span>
        </div>

        {/* Total Expenses */}
        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200">
          <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
            Total Expenses
          </span>
          <div className="text-xl font-black text-rose-700 mt-0.5">
            - {formatINR(result.totalExpenses)}
          </div>
          <span className="text-[10px] text-rose-600 block mt-0.5">
            {result.expensePercentage}% total expense overhead
          </span>
        </div>

        {/* Net Realization Per Quintal */}
        <div className="p-3.5 rounded-xl bg-agri-50 border border-agri-200">
          <span className="text-[11px] font-semibold text-agri-800 uppercase tracking-wider block">
            Net Payout / Quintal
          </span>
          <div className="text-xl font-black text-agri-900 mt-0.5">
            {formatINR(result.netEarningsPerQuintal)}
          </div>
          <span className="text-[10px] text-agri-700 block mt-0.5">
            Actual in-hand money per 100 kg bag
          </span>
        </div>
      </div>

      {/* Formula Transparency Callout */}
      <div className="p-3.5 bg-earth-50 rounded-xl border border-earth-200 flex items-start space-x-2 text-xs text-slate-700">
        <ShieldCheck className="w-4 h-4 text-agri-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 font-bold block mb-0.5">
            Transparent Formula: Net Earnings = Gross Revenue − Total Expenses
          </strong>
          <span>
            {formatINR(result.grossRevenue)} (Gross) − {formatINR(result.totalExpenses)} (Expenses) ={' '}
            <strong className="text-agri-900">{formatINR(result.netEarnings)}</strong> in hand.
          </span>
        </div>
      </div>
    </div>
  );
};


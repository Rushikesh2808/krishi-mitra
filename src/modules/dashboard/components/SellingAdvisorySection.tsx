import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  Calendar,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { SellRecommendation } from '../../../types';
import { formatINR } from '../../../utils/currency';

interface SellingAdvisorySectionProps {
  cropName: string;
  advisory: SellRecommendation;
  minPrice: number;
  maxPrice: number;
}

export const SellingAdvisorySection: React.FC<SellingAdvisorySectionProps> = ({
  cropName,
  advisory,
  minPrice,
  maxPrice,
}) => {
  const isWait = advisory.action.startsWith('WAIT');

  return (
    <div className="bg-white rounded-2xl border border-earth-200 shadow-card p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Compass className="w-4 h-4 text-amber-700" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Sell Now vs Wait Recommendation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic decision based on APMC arrival pressure, seasonal trends, and holding risk
          </p>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Active Produce: {cropName}</span>
        </div>
      </div>

      {/* Main Advisory Recommendation Banner */}
      <div
        className={`rounded-2xl p-5 border transition-all ${
          isWait
            ? 'bg-amber-50/70 border-amber-300 text-amber-950'
            : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isWait
                    ? 'bg-amber-200 text-amber-900 border border-amber-300'
                    : 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                }`}
              >
                {isWait ? 'Holding Recommended' : 'Immediate Dispatch'}
              </span>
              <span className="text-xs text-slate-500 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Updated Today
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {advisory.action === 'WAIT_SHORT_TERM' && 'WAIT 4 TO 6 DAYS BEFORE SELLING'}
              {advisory.action === 'WAIT_HARVEST_PEAK' && 'HOLD UNTIL MID-NOVEMBER PEAK'}
              {advisory.action === 'SELL_NOW' && 'SELL IMMEDIATELY IN CURRENT WINDOW'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Suggested Selling Window:{' '}
              <strong className="text-slate-900 underline decoration-amber-400 decoration-2">
                {advisory.recommendedWindow}
              </strong>
            </p>
          </div>

          {/* Projected Net Gain Badge */}
          <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3.5 border border-slate-200 text-center shrink-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              Projected Net Gain
            </span>
            <span
              className={`text-lg sm:text-xl font-black ${
                advisory.projectedNetGainPerQuintal >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {advisory.projectedNetGainPerQuintal >= 0
                ? `+₹${advisory.projectedNetGainPerQuintal}/Qtl`
                : `-₹${Math.abs(advisory.projectedNetGainPerQuintal)}/Qtl`}
            </span>
            <span className="text-[10px] text-slate-500 block">vs current market rate</span>
          </div>
        </div>
      </div>

      {/* Advisory Metrics: Confidence, Risk & Price Range */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Estimated Price Range */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Expected 10-Day Price Band
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            {formatINR(minPrice)} – {formatINR(maxPrice)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Probabilistic forecast range
          </div>
        </div>

        {/* Confidence Level */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Confidence Level
            </span>
            <span className="text-xs font-bold text-agri-700">
              {advisory.confidenceLevel === 'High' ? '82% (High)' : '68% (Medium)'}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-agri-600 h-full rounded-full transition-all duration-500"
              style={{ width: advisory.confidenceLevel === 'High' ? '82%' : '68%' }}
            />
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Based on historical APMC arrivals
          </div>
        </div>

        {/* Risk Indicator */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Storage & Holding Risk
          </div>
          <div className="flex items-center space-x-1.5 mt-1">
            {advisory.riskFactor === 'Low' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : advisory.riskFactor === 'Moderate' ? (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span
              className={`text-sm font-bold ${
                advisory.riskFactor === 'Low'
                  ? 'text-emerald-700'
                  : advisory.riskFactor === 'Moderate'
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {advisory.riskFactor} Risk
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Crop moisture & spoilage index
          </div>
        </div>
      </div>

      {/* Advisory Rationale & Storage Guidance */}
      <div className="bg-earth-100/50 rounded-xl p-4 border border-earth-200 space-y-2 text-xs text-slate-700">
        <div>
          <strong className="text-slate-900 font-semibold block mb-1">
            Why this recommendation was generated:
          </strong>
          <p className="leading-relaxed">{advisory.rationale}</p>
        </div>

        <div className="pt-2 border-t border-earth-200/80 flex items-start space-x-2 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-agri-700 shrink-0 mt-0.5" />
          <span>
            <strong>Storage Guidance:</strong> {advisory.storageFeasibilityNotice}
          </span>
        </div>
      </div>

      {/* Deep Link to Full Forecast & Advisory Simulator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <NavLink
          to="/price-forecast"
          className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center space-x-1 group"
        >
          <span>Inspect 10-day price forecast charts</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </NavLink>

        <NavLink
          to="/sell-recommendations"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors"
        >
          <Compass className="w-4 h-4 text-amber-700" />
          <span>Detailed Sell vs Wait Simulation</span>
        </NavLink>
      </div>
    </div>
  );
};


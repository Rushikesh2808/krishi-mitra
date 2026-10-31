import React from 'react';
import { CropForecastReport } from '../../../services/forecastService';
import { formatINR } from '../../../utils/currency';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Info
} from 'lucide-react';

interface ForecastRiskAdvisoryProps {
  report: CropForecastReport;
}

export const ForecastRiskAdvisory: React.FC<ForecastRiskAdvisoryProps> = ({ report }) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900">
            Model Confidence & Market Risk Assessment
          </h3>
          <p className="text-xs text-slate-500">
            Transparent probabilistic parameters and primary price drivers
          </p>
        </div>

        {/* Prototype Transparency Tag */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-900 self-start sm:self-auto">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Simulated Demonstration Forecast</span>
        </div>
      </div>

      {/* 3 Metric Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Forecast Confidence Level */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            <span>Forecast Confidence</span>
            <span className="font-bold text-agri-700">{report.confidenceScore}%</span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                report.confidenceLevel === 'High'
                  ? 'bg-agri-600'
                  : report.confidenceLevel === 'Moderate'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${report.confidenceScore}%` }}
            />
          </div>

          <div className="text-xs font-bold text-slate-900 mt-2 flex items-center justify-between">
            <span>Status: {report.confidenceLevel} Confidence</span>
            <span className="text-[10px] font-normal text-slate-500">APMC arrival match</span>
          </div>
        </div>

        {/* Metric 2: Price Uncertainty Band */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Average Uncertainty Band
          </div>
          <div className="text-xl font-black text-slate-900">
            ± {formatINR(report.uncertaintyBand)}
            <span className="text-xs font-normal text-slate-500"> / Qtl</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Price range widens further out in time
          </div>
        </div>

        {/* Metric 3: Risk Indicator */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Holding & Volatility Risk
          </div>
          <div className="flex items-center space-x-2">
            {report.riskIndicator === 'Low' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : report.riskIndicator === 'Moderate' ? (
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div className="text-lg font-black text-slate-900">
              {report.riskIndicator} Risk
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {report.riskIndicator === 'High'
              ? 'High perishable or supply surge risk'
              : 'Favorable storage & steady demand'}
          </div>
        </div>
      </div>

      {/* Rationale & Primary Market Drivers */}
      <div className="p-4 rounded-xl bg-earth-50 border border-earth-200 space-y-2 text-xs text-slate-700">
        <div>
          <strong className="text-slate-900 font-bold block mb-1 text-xs sm:text-sm">
            Primary Drivers Influencing This 10-Day Projection:
          </strong>
          <p className="leading-relaxed text-slate-700">{report.rationale}</p>
        </div>

        <div className="pt-2 border-t border-earth-200/80 text-[11px] text-slate-500 flex items-start space-x-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> Simulated forecasts are probabilistic modeling estimates based on seasonal arrivals and historical mandi spreads. They do not constitute financial guarantees. Always cross-verify physical arrival queues before dispatch.
          </span>
        </div>
      </div>
    </div>
  );
};


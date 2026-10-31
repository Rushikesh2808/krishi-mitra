import React from 'react';
import { SellVsWaitAnalysis } from '../../../services/advisoryService';
import { formatINR } from '../../../utils/currency';
import {
  Compass,
  Calendar,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface AdvisoryHeroCardProps {
  analysis: SellVsWaitAnalysis;
}

export const AdvisoryHeroCard: React.FC<AdvisoryHeroCardProps> = ({ analysis }) => {
  const { recommendation, scenarioToday, scenarioWait, netDifference, netDiffPerQuintal, percentageGain } =
    analysis;

  const isWait = recommendation.action === 'WAIT';
  const isSellNow = recommendation.action === 'SELL_NOW';
  const isPartial = recommendation.action === 'SELL_PARTIALLY';

  return (
    <div
      className={`rounded-2xl p-5 sm:p-7 border shadow-lg transition-all relative overflow-hidden ${
        isWait
          ? 'bg-gradient-to-br from-agri-900 via-agri-800 to-agri-900 text-white border-agri-600'
          : isSellNow
          ? 'bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900 text-white border-rose-600'
          : 'bg-gradient-to-br from-amber-950 via-amber-900 to-slate-900 text-white border-amber-600'
      }`}
    >
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
              isWait ? 'bg-agri-600' : isSellNow ? 'bg-rose-600' : 'bg-amber-600'
            }`}
          >
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider">
              Optimal Selling Window Engine
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {recommendation.headline}
            </h2>
          </div>
        </div>

        {/* Action Badge */}
        <div className="self-start sm:self-auto">
          <span
            className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ring-2 ring-white/30 ${
              isWait
                ? 'bg-emerald-400 text-agri-950'
                : isSellNow
                ? 'bg-rose-400 text-rose-950'
                : 'bg-amber-400 text-amber-950'
            }`}
          >
            {recommendation.badgeLabel}
          </span>
        </div>
      </div>

      {/* Main Advisory Value Pitch */}
      <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white/75 block">
              Suggested Selling Window
            </span>
            <div className="text-lg sm:text-2xl font-black text-amber-300 mt-0.5 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{recommendation.recommendedWindow}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            {recommendation.rationale}
          </p>

          <div className="flex items-center space-x-2 text-[11px] text-white/70 pt-1">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Evaluated for {analysis.quantityQuintals} Quintals at {analysis.mandiName}</span>
          </div>
        </div>

        {/* Advantage Highlight Box */}
        <div className="bg-black/30 backdrop-blur-xs rounded-xl p-4 sm:p-5 border border-white/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/75 uppercase tracking-wider">
              Expected Net Realization
            </span>
            <span className="text-xs font-bold text-white/90">
              {isSellNow ? 'Sell Today' : `Wait ${analysis.holdingDays} Days`}
            </span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {formatINR(isSellNow ? scenarioToday.netEarnings : scenarioWait.netEarnings)}
          </div>

          {/* Difference vs Today */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/80">Net Difference vs Selling Today:</span>
            <span
              className={`text-sm sm:text-base font-black px-2 py-0.5 rounded-lg ${
                netDifference > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : netDifference < 0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  : 'bg-white/10 text-white'
              }`}
            >
              {netDifference > 0 ? `+${formatINR(netDifference)}` : formatINR(netDifference)}{' '}
              ({netDifference > 0 ? `+${percentageGain}%` : `${percentageGain}%`})
            </span>
          </div>

          {/* Confidence and Risk footer tags */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
            <span>Confidence: <strong className="text-white">{recommendation.confidenceScore}% ({recommendation.confidenceLevel})</strong></span>
            <span>Risk Level: <strong className="text-white">{recommendation.riskLevel} Risk</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};


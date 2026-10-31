import React, { useState } from 'react';
import {
  Layers,
  Users,
  Wheat,
  TrendingUp,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check
} from 'lucide-react';
import { BulkAggregationOpportunity } from '../../../data/fpoBuyerMockData';
import { formatINR } from '../../../utils/currency';

interface BulkSellingSectionProps {
  opportunities: BulkAggregationOpportunity[];
  onPledgeProduce: (poolId: string, quantityQuintals: number) => void;
}

export const BulkSellingSection: React.FC<BulkSellingSectionProps> = ({
  opportunities,
  onPledgeProduce,
}) => {
  const [pledgeModalPool, setPledgeModalPool] = useState<BulkAggregationOpportunity | null>(null);
  const [pledgeQuantity, setPledgeQuantity] = useState<string>('20');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeModalPool) return;
    const qty = parseFloat(pledgeQuantity) || 0;
    if (qty <= 0) return;

    onPledgeProduce(pledgeModalPool.id, qty);
    setSuccessToast(`यशस्वी! आपण ${qty} क्विंटल शेतमाल ${pledgeModalPool.cropName} गटामध्ये जोडला.`);
    setPledgeModalPool(null);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center space-x-2 text-xs shadow-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span className="font-bold">{successToast}</span>
        </div>
      )}

      {/* Explainer Guide Banner: Collective Bargaining & Aggregation */}
      <div className="bg-gradient-to-r from-teal-900 via-agri-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-700 text-xs font-semibold text-teal-200">
              <Layers className="w-3.5 h-3.5 text-teal-300" />
              <span>सामूहिक शेतमाल एकत्रीकरण व थेट पुरवठा • Bulk Aggregation Power</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              एकत्रीकरणामुळे लहान शेतकऱ्यांना मोठा नफा (Power of Collective Selling)
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              When smallholder farmers combine individual 10–50 quintal lots through their local FPO, they form 500+ quintal institutional lots. This gives farmers the bargaining power of a major supplier.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-2 flex-shrink-0">
            <span className="font-bold text-amber-300 block text-sm">शेतकऱ्यांचे थेट फायदे (Key Benefits):</span>
            <div className="space-y-1 text-teal-50">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>+₹70 ते +₹160/Qtl संस्थात्मक बल्क प्रीमियम</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>शून्य APMC बाजार फी (1.05% सेस बचत)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>सामायिक वाहतुकीमुळे प्रति क्विंटल ₹40-60 ची बचत</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="pt-3 border-t border-white/10 flex items-start space-x-2 text-[11px] text-teal-200/90">
          <ShieldCheck className="w-4 h-4 text-teal-300 flex-shrink-0 mt-0.5" />
          <span>
            <strong>पारदर्शक नोंद (Notice):</strong> Aggregation pools represent simulated cooperative pooling under Maharashtra FPO models. Pledging produce simulates lot filling and collective volume tracking.
          </span>
        </div>
      </div>

      {/* Bulk Pools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>सध्या चालू असलेल्या एकत्रीकरण संधी (Active Aggregation Lots)</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {opportunities.length} Pools Open in Nashik & Niphad
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {opportunities.map((pool) => {
            const percentage = Math.min(
              100,
              Math.round((pool.currentAggregatedQuintals / pool.targetQuantityQuintals) * 100)
            );
            const remainingQty = Math.max(
              0,
              pool.targetQuantityQuintals - pool.currentAggregatedQuintals
            );

            return (
              <div
                key={pool.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 mb-1">
                        {pool.status}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base">{pool.cropName}</h4>
                      <p className="text-xs text-slate-500">{pool.variety}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {pool.lotCode}
                    </span>
                  </div>

                  {/* Progress Bar & Quantity Counter */}
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-earth-50 border border-earth-200 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-slate-700">एकत्रित प्रमाण (Pooled):</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {pool.currentAggregatedQuintals}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          / {pool.targetQuantityQuintals} Qtl ({percentage}%)
                        </span>
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-agri-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>{pool.participatingFarmersCount} शेतकरी सहभागी (Pooled)</span>
                      <span className="font-bold text-teal-700">
                        {remainingQty > 0 ? `${remainingQty} Qtl शिल्लक (Needed)` : 'Lot Full'}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">अपेक्षित संस्थात्मक दर:</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        ₹{pool.indicativePricePerQuintal.toLocaleString('en-IN')} / Qtl
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>स्थानिक बाजारभाव (APMC):</span>
                      <span>₹{pool.mandiBenchmarkPrice.toLocaleString('en-IN')} / Qtl</span>
                    </div>
                    <div className="pt-1 border-t border-amber-200 flex justify-between font-bold text-emerald-800 text-xs">
                      <span>शेतकऱ्यांना अतिरिक्त फायदा:</span>
                      <span>+₹{pool.priceAdvantagePerQuintal}/Qtl जास्त</span>
                    </div>
                  </div>

                  {/* FPO Organizer & Partner Buyer */}
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">
                        आयोजक FPO: <strong>{pool.fpoOrganizer.name}</strong>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">
                        संस्थात्मक खरेदीदार: <strong>{pool.partnerBuyer.name}</strong>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>अंतिम मुदत: {pool.poolingDeadline}</span>
                    </div>
                  </div>

                  {/* Quality Requirement */}
                  <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                    दर्जा: {pool.qualityGradeRequired}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    {pool.fpoOrganizer.hubLocation}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPledgeModalPool(pool)}
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>गटात सामील व्हा (Join Pool)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Join Pool Modal */}
      {pledgeModalPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    FPO गटामध्ये शेतमाल जोडा (Join Aggregation Pool)
                  </h3>
                  <p className="text-xs text-slate-500">{pledgeModalPool.cropName} • {pledgeModalPool.lotCode}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPledgeModalPool(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePledgeSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-earth-50 border border-earth-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">FPO आयोजक:</span>
                  <span className="font-semibold text-slate-900">{pledgeModalPool.fpoOrganizer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">खरेदीदार कंपनी:</span>
                  <span className="font-semibold text-slate-900">{pledgeModalPool.partnerBuyer.name}</span>
                </div>
                <div className="flex justify-between font-bold text-agri-800">
                  <span>हमी दिलेला दर (Contract Rate):</span>
                  <span>₹{pledgeModalPool.indicativePricePerQuintal} / Qtl</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  आपण देणार असलेले प्रमाण (Your Contribution in Quintals):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={pledgeQuantity}
                    onChange={(e) => setPledgeQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500">Quintals</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-600 block text-[11px]">अपेक्षित एकूण उत्पन्न:</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatINR(
                      (parseFloat(pledgeQuantity) || 0) * pledgeModalPool.indicativePricePerQuintal
                    )}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                  +₹{pledgeModalPool.priceAdvantagePerQuintal}/Qtl जादा नफा
                </span>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPledgeModalPool(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-md cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>गटामध्ये नोंदवा (Confirm Pledge)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


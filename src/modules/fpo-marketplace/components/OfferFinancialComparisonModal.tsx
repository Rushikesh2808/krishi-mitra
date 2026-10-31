import React from 'react';
import {
  X,
  TrendingUp,
  Store,
  Truck,
  Building2,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  IndianRupee,
  ArrowRight
} from 'lucide-react';
import { MarketplaceOffer } from '../../../data/fpoBuyerMockData';
import { formatINR } from '../../../utils/currency';

interface OfferFinancialComparisonModalProps {
  offer: MarketplaceOffer | null;
  onClose: () => void;
}

export const OfferFinancialComparisonModal: React.FC<OfferFinancialComparisonModalProps> = ({
  offer,
  onClose,
}) => {
  if (!offer) return null;

  const f = offer.financials;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-agri-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                आर्थिक विश्लेषण: थेट खरेदीदार विरूद्ध बाजार समिती
              </h2>
              <p className="text-xs text-agri-200">
                Direct Buyer Offer vs Best Mandi Net In-Hand Comparison
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-agri-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Target Produce & Offer Banner */}
          <div className="p-4 rounded-xl bg-earth-50 border border-earth-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-slate-500 block text-[11px]">शेतमाल व प्रमाण (Crop & Quantity):</span>
              <span className="text-sm font-bold text-slate-900">
                {offer.listingCrop} • {offer.quantityQuintals} Quintals
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-slate-500 block text-[11px]">खरेदीदार (Buyer):</span>
              <span className="text-sm font-bold text-agri-800">{offer.buyerName}</span>
              <span className="text-[11px] text-slate-500 block">({offer.deliveryTerms})</span>
            </div>
          </div>

          {/* Key Advantage Callout Box */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            f.isOfferBetterThanMandi
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                f.isOfferBetterThanMandi ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
              }`}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base">
                  {f.isOfferBetterThanMandi
                    ? `+${formatINR(f.netAdvantageTotal)} निव्वळ अतिरिक्त नफा (Extra Net Profit)`
                    : 'बाजार समितीशी तुलनात्मक (Comparable to Mandi)'}
                </p>
                <p className="text-xs text-slate-600">
                  {f.isOfferBetterThanMandi
                    ? `थेट खरेदीदाराला विकल्यास प्रति क्विंटल ₹${f.netAdvantagePerQuintal} जास्त नफा हाती मिळेल!`
                    : 'Difference based on transport and mandi market cess'}
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white">
                +₹{f.netAdvantagePerQuintal}/Qtl
              </span>
            </div>
          </div>

          {/* Side by Side Comparative Financial Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs font-bold border-b border-slate-200">
                  <th className="p-3">तपशील (Item / Expense Component)</th>
                  <th className="p-3 bg-emerald-50/70 text-emerald-900 border-l border-r border-slate-200">
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>थेट खरेदीदार (Buyer Offer)</span>
                    </div>
                  </th>
                  <th className="p-3 text-slate-700">
                    <div className="flex items-center space-x-1">
                      <Store className="w-3.5 h-3.5" />
                      <span>{f.bestMandiName}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="p-3 font-medium text-slate-700">विक्री दर (Offered / Spot Price)</td>
                  <td className="p-3 bg-emerald-50/40 font-bold text-emerald-800 border-l border-r border-slate-200">
                    ₹{offer.offeredPricePerQuintal.toLocaleString('en-IN')} / Qtl
                  </td>
                  <td className="p-3 font-medium text-slate-700">
                    ₹{f.bestMandiGrossPrice.toLocaleString('en-IN')} / Qtl
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-medium text-slate-700">एकूण अपेक्षित उत्पन्न (Gross Revenue)</td>
                  <td className="p-3 bg-emerald-50/40 font-bold text-slate-900 border-l border-r border-slate-200">
                    {formatINR(f.offeredGrossRevenue)}
                  </td>
                  <td className="p-3 text-slate-700">
                    {formatINR(f.bestMandiGrossRevenue)}
                  </td>
                </tr>

                {/* Deductions Header */}
                <tr className="bg-slate-50 font-semibold text-slate-500 text-[11px]">
                  <td colSpan={3} className="px-3 py-1.5 uppercase tracking-wider">
                    कपाती व खर्च (Deductions & Logistics Expenses)
                  </td>
                </tr>

                <tr>
                  <td className="p-3 text-slate-600">
                    वाहतूक खर्च (Transportation Freight):
                    <span className="block text-[10px] text-slate-400">
                      {offer.deliveryTerms === 'Farmgate Pickup' ? 'खरेदीदाराकडून शेतातून मोफत वाहतूक' : 'FPO वाहतूक'}
                    </span>
                  </td>
                  <td className="p-3 bg-emerald-50/40 text-emerald-700 font-bold border-l border-r border-slate-200">
                    ₹{f.offeredTransportCost.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] font-normal text-emerald-600">
                      {offer.deliveryTerms === 'Farmgate Pickup' ? '(₹0 बचत!)' : ''}
                    </span>
                  </td>
                  <td className="p-3 text-rose-700 font-medium">
                    -₹{f.bestMandiTransportCost.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 text-slate-600">
                    बाजार समिती सेस (APMC Market Cess 1.05%):
                    <span className="block text-[10px] text-slate-400">
                      थेट विक्रीवर बाजार समिती सेस लागत नाही
                    </span>
                  </td>
                  <td className="p-3 bg-emerald-50/40 text-emerald-700 font-bold border-l border-r border-slate-200">
                    ₹0 <span className="text-[10px] font-normal text-emerald-600">(100% सेस मुक्त)</span>
                  </td>
                  <td className="p-3 text-rose-700 font-medium">
                    -₹{f.bestMandiCess.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 text-slate-600">हमाली व तोलाई (Hamali, Weighing & Handling):</td>
                  <td className="p-3 bg-emerald-50/40 text-slate-700 font-medium border-l border-r border-slate-200">
                    -₹{f.offeredHandlingCost.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-rose-700 font-medium">
                    -₹{f.bestMandiHandlingCost.toLocaleString('en-IN')}
                  </td>
                </tr>

                {/* Final Net In-Hand Row */}
                <tr className="bg-emerald-100/70 border-t-2 border-emerald-400 font-bold">
                  <td className="p-3.5 text-slate-900 text-sm">
                    हाती येणारा निव्वळ नफा (Net In-Hand Earnings):
                    <span className="block text-[10px] font-normal text-slate-600">
                      खर्च वजा जाता थेट बँक खात्यात मिळणारी रक्कम
                    </span>
                  </td>
                  <td className="p-3.5 bg-emerald-100 text-emerald-950 font-extrabold text-base border-l border-r border-emerald-300">
                    {formatINR(f.offeredNetEarnings)}
                    <span className="block text-xs font-semibold text-emerald-800">
                      (₹{f.offeredNetPerQuintal.toLocaleString('en-IN')} / Qtl)
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-800 font-bold text-sm">
                    {formatINR(f.bestMandiNetEarnings)}
                    <span className="block text-xs font-normal text-slate-600">
                      (₹{f.bestMandiNetPerQuintal.toLocaleString('en-IN')} / Qtl)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Highlights Explainer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>नफ्याचे कारण (Why the direct buyer offer earns you more):</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {f.savingsHighlights.map((hl, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{hl}</span>
                </li>
              ))}
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>मंडईतील रांगेत घालवलेला वेळ आणि वाहनाचा डिझेल खर्च वाचतो.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            समजले, बंद करा (Close Analysis)
          </button>
        </div>
      </div>
    </div>
  );
};


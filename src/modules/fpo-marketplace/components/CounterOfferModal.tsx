import React, { useState } from 'react';
import {
  X,
  IndianRupee,
  FileEdit,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { MarketplaceOffer } from '../../../data/fpoBuyerMockData';
import { formatINR } from '../../../utils/currency';

interface CounterOfferModalProps {
  offer: MarketplaceOffer | null;
  onClose: () => void;
  onSubmitCounter: (offerId: string, counterPrice: number, counterNote: string) => void;
}

export const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  offer,
  onClose,
  onSubmitCounter,
}) => {
  if (!offer) return null;

  const [counterPriceInput, setCounterPriceInput] = useState<string>(
    (offer.offeredPricePerQuintal + 50).toString()
  );
  const [counterNote, setCounterNote] = useState<string>(
    'Moisture level verified optimal (<10%). Machine cleaned bold grade. Requesting counter rate with farmgate loading.'
  );
  const [error, setError] = useState<string | null>(null);

  const proposedPrice = parseFloat(counterPriceInput) || 0;
  const originalOfferedPrice = offer.offeredPricePerQuintal;
  const priceDifferencePerQtl = proposedPrice - originalOfferedPrice;
  const newGrossRevenue = proposedPrice * offer.quantityQuintals;
  const incrementalGain = priceDifferencePerQtl * offer.quantityQuintals;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (proposedPrice <= 0 || isNaN(proposedPrice)) {
      setError('कृपया योग्य प्रति क्विंटल दर टाका (Please enter a valid counter price).');
      return;
    }
    if (proposedPrice <= originalOfferedPrice) {
      setError(
        `प्रति-ऑफर दर खरेदीदाराच्या मूळ दरापेक्षा (₹${originalOfferedPrice}/Qtl) जास्त असावा.`
      );
      return;
    }

    setError(null);
    onSubmitCounter(offer.id, proposedPrice, counterNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <FileEdit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                प्रति-ऑफर सादर करा (Propose Counteroffer)
              </h2>
              <p className="text-xs text-indigo-200">
                Negotiate a higher selling price with {offer.buyerName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Offer Overview */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 block text-[11px]">शेतमाल व प्रमाण:</span>
              <span className="font-bold text-slate-900">{offer.listingCrop}</span>
              <span className="text-slate-600 block text-[11px]">{offer.quantityQuintals} Quintals</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">खरेदीदाराने दिलेला दर:</span>
              <span className="font-extrabold text-slate-900 text-sm">
                ₹{originalOfferedPrice.toLocaleString('en-IN')} / Qtl
              </span>
              <span className="text-slate-500 block text-[11px]">{offer.deliveryTerms}</span>
            </div>
          </div>

          {/* Proposed Counter Price Input */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              आपला प्रस्तावित प्रति क्विंटल दर (Your Proposed Counter Price ₹/Qtl):
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="number"
                min={originalOfferedPrice + 1}
                step="10"
                value={counterPriceInput}
                onChange={(e) => setCounterPriceInput(e.target.value)}
                placeholder="4950"
                className="w-full pl-9 pr-14 py-2.5 text-base font-extrabold text-agri-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                required
              />
              <span className="absolute right-3 top-3 text-xs text-slate-500 font-semibold">/ Qtl</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              मूळ ऑफरपेक्षा ₹{priceDifferencePerQtl > 0 ? `+${priceDifferencePerQtl}` : '0'}/Qtl जास्त
            </p>
          </div>

          {/* Incremental Gain Projection Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-600 block text-[11px]">नवीन अपेक्षित एकूण रक्कम:</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {formatINR(newGrossRevenue)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">अतिरिक्त नफा (Extra Gain):</span>
              <span className="font-extrabold text-emerald-700 text-sm">
                +{formatINR(incrementalGain)}
              </span>
            </div>
          </div>

          {/* Counter Note / Terms */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              खरेदीदारासाठी टिपण्णी / अटी (Note for Buyer / Quality Justification):
            </label>
            <textarea
              rows={2}
              value={counterNote}
              onChange={(e) => setCounterNote(e.target.value)}
              placeholder="Explain quality, moisture check, packaging, or farmgate accessibility..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
            >
              रद्द करा (Cancel)
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <FileEdit className="w-4 h-4" />
              <span>प्रति-ऑफर पाठवा (Send Counter)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


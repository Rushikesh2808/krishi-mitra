import React, { useState } from 'react';
import {
  Handshake,
  Building2,
  Check,
  X,
  FileEdit,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Truck,
  IndianRupee,
  FileText
} from 'lucide-react';
import { MarketplaceOffer } from '../../../data/fpoBuyerMockData';
import { formatINR } from '../../../utils/currency';

interface OfferNegotiationCardProps {
  offer: MarketplaceOffer;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
  onOpenCounterModal: (offer: MarketplaceOffer) => void;
  onOpenFinancialModal: (offer: MarketplaceOffer) => void;
}

export const OfferNegotiationCard: React.FC<OfferNegotiationCardProps> = ({
  offer,
  onAccept,
  onReject,
  onOpenCounterModal,
  onOpenFinancialModal,
}) => {
  const f = offer.financials;

  const getStatusBadge = () => {
    switch (offer.status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>प्रलंबित (Pending Review)</span>
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>स्वीकृत (Accepted)</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            <span>नाकारली (Rejected)</span>
          </span>
        );
      case 'Counteroffer Sent':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            <FileEdit className="w-3.5 h-3.5 text-indigo-700" />
            <span>प्रति-ऑफर पाठवली (Counteroffer Sent)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between ${
      offer.status === 'Accepted'
        ? 'border-emerald-300 ring-2 ring-emerald-500/20'
        : offer.status === 'Counteroffer Sent'
        ? 'border-indigo-300'
        : offer.status === 'Rejected'
        ? 'border-slate-300 opacity-80'
        : 'border-slate-200'
    }`}>
      {/* Top Banner */}
      <div className="p-5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-700 to-agri-900 text-white flex items-center justify-center font-bold shadow-inner">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-slate-900 text-base">{offer.buyerName}</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {offer.buyerType} • {offer.buyerLocation}
              </p>
            </div>
          </div>
          <div className="self-start sm:self-auto">{getStatusBadge()}</div>
        </div>

        {/* Target Crop & Price Comparison Strip */}
        <div className="p-4 rounded-xl bg-earth-50 border border-earth-200/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-slate-500 block text-[11px]">शेतमाल व प्रमाण (Crop & Quantity):</span>
              <span className="text-sm font-bold text-slate-900">
                {offer.listingCrop} — {offer.quantityQuintals} Quintals
              </span>
            </div>

            <div className="text-right">
              <span className="text-slate-500 block text-[11px]">खरेदीदाराने दिलेला दर (Offered Rate):</span>
              <div className="flex items-baseline space-x-1.5 justify-end">
                <span className="text-xl font-black text-agri-900">
                  ₹{offer.offeredPricePerQuintal.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500">/ Qtl</span>
              </div>
            </div>
          </div>

          {/* Rate Comparison Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-earth-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">अपेक्षित दर (Expected):</span>
              <span className="font-semibold text-slate-700">₹{offer.expectedPricePerQuintal}/Qtl</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">{f.bestMandiName} Spot:</span>
              <span className="font-semibold text-slate-700">₹{f.bestMandiGrossPrice}/Qtl</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[10px]">डिलिव्हरी (Delivery):</span>
              <span className="font-semibold text-slate-900 flex items-center space-x-1 truncate">
                <Truck className="w-3 h-3 text-agri-600 flex-shrink-0" />
                <span className="truncate">{offer.deliveryTerms}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Counteroffer State Details (if sent) */}
        {offer.status === 'Counteroffer Sent' && offer.farmerCounterPrice && (
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-indigo-950 font-bold">
              <div className="flex items-center space-x-1.5">
                <FileEdit className="w-4 h-4 text-indigo-700" />
                <span>आपण पाठवलेली प्रति-ऑफर (Your Proposed Counter):</span>
              </div>
              <span className="text-sm font-extrabold text-indigo-900">
                ₹{offer.farmerCounterPrice.toLocaleString('en-IN')} / Qtl
              </span>
            </div>
            {offer.farmerCounterNote && (
              <p className="text-[11px] text-indigo-800 italic bg-white/70 p-2 rounded-lg border border-indigo-100">
                "{offer.farmerCounterNote}"
              </p>
            )}
            <p className="text-[11px] text-indigo-700">
              खरेदीदाराकडून निर्णयाची प्रतीक्षा आहे (Awaiting buyer approval).
            </p>
          </div>
        )}

        {/* Accepted Confirmation Banner (if accepted) */}
        {offer.status === 'Accepted' && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs text-emerald-950">
            <div className="flex items-center space-x-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>ऑफर स्वीकारली गेली आहे (Contract Confirmed)!</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              खरेदीदार {offer.buyerName} प्रतिनिधी शेतात पिकअपसाठी संपर्क साधतील. पेमेंट थेट आरटीजीएसद्वारे (RTGS) होईल.
            </p>
          </div>
        )}

        {/* Financial Transparency Box */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-600 block text-[11px] font-medium">
                हाती येणारा निव्वळ नफा (Net In-Hand Earnings):
              </span>
              <span className="text-base font-extrabold text-emerald-950">
                {formatINR(f.offeredNetEarnings)}{' '}
                <span className="text-xs font-normal text-emerald-800">
                  (₹{f.offeredNetPerQuintal.toLocaleString('en-IN')}/Qtl)
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => onOpenFinancialModal(offer)}
              className="px-2.5 py-1.5 rounded-lg bg-white text-agri-900 border border-emerald-300 hover:bg-emerald-100 font-bold text-[11px] transition-colors cursor-pointer flex items-center space-x-1 shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>हिशोब पहा (Breakdown)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-200/70 text-[11px]">
            <span className="font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
              +{formatINR(f.netAdvantageTotal)} (+₹{f.netAdvantagePerQuintal}/Qtl) मांडईपेक्षा जास्त फायदा!
            </span>
            <span className="text-slate-600">
              (वाहतूक व APMC सेस वाचल्यामुळे)
            </span>
          </div>
        </div>

        {/* Terms and Expiry */}
        <div className="space-y-1 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>पेमेंट अटी: {offer.paymentTerms}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>मुदत: {offer.expiryDate} (मिळाली: {offer.receivedDate})</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Strip */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] text-slate-500">
          एकूण ऑफर मूल्य: <strong>{formatINR(offer.quantityQuintals * offer.offeredPricePerQuintal)}</strong>
        </div>

        {offer.status === 'Pending' && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onReject(offer.id)}
              className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>नाकारा (Reject)</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenCounterModal(offer)}
              className="px-3 py-1.5 rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>प्रति-ऑफर (Counter)</span>
            </button>

            <button
              type="button"
              onClick={() => onAccept(offer.id)}
              className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>स्वीकारा (Accept Offer)</span>
            </button>
          </div>
        )}

        {offer.status === 'Counteroffer Sent' && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onOpenCounterModal(offer)}
              className="px-3 py-1.5 rounded-xl border border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-semibold text-xs cursor-pointer"
            >
              प्रति-ऑफर बदला (Edit Counter)
            </button>
            <button
              type="button"
              onClick={() => onAccept(offer.id)}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer"
            >
              मूळ ऑफर स्वीकारा (Accept Original)
            </button>
          </div>
        )}

        {(offer.status === 'Accepted' || offer.status === 'Rejected') && (
          <div className="text-xs font-semibold text-slate-500">
            {offer.status === 'Accepted' ? 'व्यवहार नोंद पूर्ण (Order Finalized)' : 'ही ऑफर नाकारली गेली आहे'}
          </div>
        )}
      </div>
    </div>
  );
};


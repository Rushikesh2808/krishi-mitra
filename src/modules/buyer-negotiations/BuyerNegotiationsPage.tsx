import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Handshake,
  ArrowLeft,
  Building2,
  Filter,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Store
} from 'lucide-react';
import {
  MOCK_MARKETPLACE_OFFERS,
  MarketplaceOffer
} from '../../data/fpoBuyerMockData';
import { OfferNegotiationCard } from '../fpo-marketplace/components/OfferNegotiationCard';
import { CounterOfferModal } from '../fpo-marketplace/components/CounterOfferModal';
import { OfferFinancialComparisonModal } from '../fpo-marketplace/components/OfferFinancialComparisonModal';

export const BuyerNegotiationsPage: React.FC = () => {
  const [offers, setOffers] = useState<MarketplaceOffer[]>(MOCK_MARKETPLACE_OFFERS);
  const [counterModalOffer, setCounterModalOffer] = useState<MarketplaceOffer | null>(null);
  const [financialModalOffer, setFinancialModalOffer] = useState<MarketplaceOffer | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Accepted' as const } : o))
    );
    showToast('खरेदीदाराची ऑफर स्वीकारली गेली! विक्री करार व पिकअप सूचना नोंदवली आहे.');
  };

  const handleRejectOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Rejected' as const } : o))
    );
    showToast('ऑफर नाकारली गेली आहे.');
  };

  const handleSubmitCounterOffer = (offerId: string, counterPrice: number, counterNote: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: 'Counteroffer Sent' as const,
              farmerCounterPrice: counterPrice,
              farmerCounterNote: counterNote,
            }
          : o
      )
    );
    showToast(`प्रति-ऑफर (₹${counterPrice.toLocaleString('en-IN')}/Qtl) खरेदीदाराकडे सादर केली गेली आहे!`);
  };

  const filteredOffers = offers.filter((o) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Pending') return o.status === 'Pending';
    if (statusFilter === 'Accepted') return o.status === 'Accepted';
    if (statusFilter === 'Rejected') return o.status === 'Rejected';
    if (statusFilter === 'Counter') return o.status === 'Counteroffer Sent';
    return true;
  });

  const pendingCount = offers.filter((o) => o.status === 'Pending').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-emerald-800 text-white shadow-2xl border border-emerald-600 flex items-center space-x-3 text-xs max-w-md animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="font-bold flex-1">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-200 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <Link
              to="/fpo-marketplace"
              className="hover:text-agri-800 font-semibold flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>FPO & Buyer Marketplace</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Negotiations</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <Handshake className="w-6 h-6 text-purple-700" />
            <span>Buyer Offers & Negotiations Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare offered prices, calculate net earnings with zero transport deduction, and submit counteroffers.
          </p>
        </div>

        <Link
          to="/fpo-marketplace"
          className="px-4 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs shadow-sm flex items-center space-x-2 self-start sm:self-auto cursor-pointer"
        >
          <span>मार्केटप्लेसवर परत जा (Back to Marketplace)</span>
        </Link>
      </div>

      {/* Filter and Status Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-slate-500 font-medium">फिल्टर (Filter):</span>
          {['All', 'Pending', 'Counter', 'Accepted', 'Rejected'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-purple-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status === 'All'
                ? `सर्व ऑफर (${offers.length})`
                : status === 'Pending'
                ? `प्रलंबित (${pendingCount})`
                : status === 'Counter'
                ? 'प्रति-ऑफर पाठवली'
                : status === 'Accepted'
                ? 'स्वीकृत'
                : 'नाकारली'}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          {filteredOffers.length} Offers Found
        </span>
      </div>

      {/* Offers List Grid */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <Handshake className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-semibold text-slate-800 text-sm">कोणतीही ऑफर उपलब्ध नाही</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting the filter to view all offers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOffers.map((offer) => (
            <OfferNegotiationCard
              key={offer.id}
              offer={offer}
              onAccept={handleAcceptOffer}
              onReject={handleRejectOffer}
              onOpenCounterModal={(o) => setCounterModalOffer(o)}
              onOpenFinancialModal={(o) => setFinancialModalOffer(o)}
            />
          ))}
        </div>
      )}

      {/* Counter Offer Modal */}
      <CounterOfferModal
        offer={counterModalOffer}
        onClose={() => setCounterModalOffer(null)}
        onSubmitCounter={handleSubmitCounterOffer}
      />

      {/* Financial Comparison Modal */}
      <OfferFinancialComparisonModal
        offer={financialModalOffer}
        onClose={() => setFinancialModalOffer(null)}
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Send,
  Package
} from 'lucide-react';
import { BuyerOrganization } from '../../../data/fpoBuyerMockData';
import { formatINR } from '../../../utils/currency';

interface BuyerDirectorySectionProps {
  buyers: BuyerOrganization[];
  onOpenQuotationModal?: (buyer: BuyerOrganization) => void;
}

const CROP_FILTER_OPTIONS = ['All', 'Soybean', 'Red Onion', 'Wheat', 'Gram / Chana', 'Cotton'];
const BUYER_TYPE_OPTIONS = [
  'All',
  'Agri-Processor',
  'Exporter',
  'Retail Chain / Aggregator',
  'Dal & Oil Miller',
];

export const BuyerDirectorySection: React.FC<BuyerDirectorySectionProps> = ({
  buyers,
  onOpenQuotationModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedBuyerType, setSelectedBuyerType] = useState('All');
  const [quotationModalBuyer, setQuotationModalBuyer] = useState<BuyerOrganization | null>(null);
  const [quoteQuantity, setQuoteQuantity] = useState('50');
  const [quotePrice, setQuotePrice] = useState('4890');
  const [quoteSentToast, setQuoteSentToast] = useState(false);

  const filteredBuyers = useMemo(() => {
    return buyers.filter((buyer) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        buyer.businessName.toLowerCase().includes(q) ||
        buyer.location.toLowerCase().includes(q) ||
        buyer.district.toLowerCase().includes(q) ||
        buyer.buyerType.toLowerCase().includes(q) ||
        buyer.cropsPurchased.some((c) => c.toLowerCase().includes(q));

      const matchesCrop =
        selectedCrop === 'All' ||
        buyer.cropsPurchased.some((c) => c.toLowerCase().includes(selectedCrop.toLowerCase()));

      const matchesType =
        selectedBuyerType === 'All' || buyer.buyerType === selectedBuyerType;

      return matchesSearch && matchesCrop && matchesType;
    });
  }, [buyers, searchQuery, selectedCrop, selectedBuyerType]);

  const handleSendQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSentToast(true);
    setTimeout(() => {
      setQuoteSentToast(false);
      setQuotationModalBuyer(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Controls Container */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-700" />
              <span>संस्थात्मक खरेदीदार निर्देशिका (Agricultural Buyer Directory)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verified food processors, oilseed crushers, exporters, and retail procurement desks sourcing directly from Maharashtra farmers.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold self-start sm:self-auto">
            {filteredBuyers.length} Verified Buyers
          </span>
        </div>

        {/* Search & Buyer Type Select */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company name, location, or crop required..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
            />
          </div>

          <div>
            <select
              value={selectedBuyerType}
              onChange={(e) => setSelectedBuyerType(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
            >
              {BUYER_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'सर्व खरेदीदार प्रकार (All Buyer Types)' : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Crop Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-medium flex items-center space-x-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" />
            <span>पिकानुसार (Crop):</span>
          </span>
          {CROP_FILTER_OPTIONS.map((crop) => (
            <button
              key={crop}
              type="button"
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer ${
                selectedCrop === crop
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {crop === 'All' ? 'सर्व पिके (All Crops)' : crop}
            </button>
          ))}
        </div>
      </div>

      {/* Buyer Cards Grid */}
      {filteredBuyers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800">खरेदीदार सापडला नाही (No Buyers Found)</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBuyers.map((buyer) => (
            <div
              key={buyer.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 mb-1">
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      <span>{buyer.verificationBadge}</span>
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {buyer.businessName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{buyer.buyerType}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{buyer.location}</span>
                </div>

                {/* Crops Purchased */}
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    खरेदी केली जाणारी पिके (Crops Purchased):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {buyer.cropsPurchased.map((crop) => (
                      <span
                        key={crop}
                        className="px-2 py-0.5 rounded-md bg-blue-50/70 text-blue-900 text-xs font-medium border border-blue-200/60"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Procurement Quantity & Indicative Price Grid */}
                <div className="grid grid-cols-2 gap-2 p-3.5 rounded-xl bg-earth-50 border border-earth-200/70 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">आवश्यक प्रमाण (Required Qty):</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {buyer.requiredQuantityQuintals} Quintals
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">अंदाजित दर (Indicative Price):</span>
                    <span className="font-extrabold text-agri-800 text-sm">
                      ₹{buyer.indicativePriceRange.min.toLocaleString('en-IN')} - ₹{buyer.indicativePriceRange.max.toLocaleString('en-IN')}
                      <span className="text-[10px] font-normal text-slate-600"> / Qtl</span>
                    </span>
                  </div>
                </div>

                {/* Active Requirement Description */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-[11px] font-semibold text-slate-700 block">
                    खरेदीची सद्यस्थिती (Procurement Summary):
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {buyer.activeRequirementsSummary}
                  </p>
                </div>

                {/* Delivery & Payment Terms */}
                <div className="space-y-1 text-xs pt-1">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>डिलिव्हरी पद्धत: <strong>{buyer.preferredDeliveryTerms}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>पेमेंट: <strong>{buyer.paymentTerms}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-500 block text-[11px]">खरेदी प्रतिनिधी (Sourcing Lead):</span>
                  <span className="font-bold text-slate-900">{buyer.contactPerson}</span>
                  <span className="font-mono text-slate-600 block text-[11px]">{buyer.contactNumber}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setQuotationModalBuyer(buyer);
                    setQuotePrice(buyer.indicativePriceRange.max.toString());
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>कोटेशन पाठवा (Send Quotation)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send Quotation Modal */}
      {quotationModalBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">शेतमाल कोटेशन पाठवा (Send Quotation)</h3>
                  <p className="text-xs text-slate-500">{quotationModalBuyer.businessName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuotationModalBuyer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {quoteSentToast ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">कोटेशन यशस्वीरित्या पाठवले!</h4>
                <p className="text-xs text-emerald-800">
                  Your quotation has been dispatched to {quotationModalBuyer.businessName}. The procurement officer will respond with an offer within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuoteSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    उपलब्ध प्रमाण (Offered Quantity in Quintals):
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={quoteQuantity}
                    onChange={(e) => setQuoteQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    आपला अपेक्षित दर (Your Proposed Price ₹/Qtl):
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-agri-800"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Buyer price band: ₹{quotationModalBuyer.indicativePriceRange.min} - ₹{quotationModalBuyer.indicativePriceRange.max}/Qtl
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">एकूण अपेक्षित रक्कम (Gross Total):</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {formatINR(Number(quoteQuantity || 0) * Number(quotePrice || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>डिलिव्हरी पद्धत:</span>
                    <span className="font-semibold text-slate-700">{quotationModalBuyer.preferredDeliveryTerms}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuotationModalBuyer(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    रद्द करा (Cancel)
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>कोटेशन सबमिट करा</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


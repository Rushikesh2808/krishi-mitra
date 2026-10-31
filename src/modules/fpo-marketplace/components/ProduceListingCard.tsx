import React from 'react';
import {
  Wheat,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowRight,
  Handshake,
  Clock,
  Layers
} from 'lucide-react';
import { FarmerMarketplaceListing } from '../../../data/fpoBuyerMockData';
import { formatINR } from '../../../utils/currency';

interface ProduceListingCardProps {
  listing: FarmerMarketplaceListing;
  onViewOffers?: (listingId: string) => void;
  onPledgeToPool?: (listing: FarmerMarketplaceListing) => void;
}

export const ProduceListingCard: React.FC<ProduceListingCardProps> = ({
  listing,
  onViewOffers,
  onPledgeToPool,
}) => {
  const totalValue = listing.quantityQuintals * listing.expectedPricePerQuintal;

  const getStatusBadge = (status: FarmerMarketplaceListing['status']) => {
    switch (status) {
      case 'Active / Open for Offers':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>थेट ऑफरसाठी उपलब्ध (Open for Offers)</span>
          </span>
        );
      case 'Aggregated with FPO':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Layers className="w-3 h-3 text-blue-600" />
            <span>FPO गटामध्ये समाविष्ट (Aggregated)</span>
          </span>
        );
      case 'Offer Under Review':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" />
            <span>वाटाघाटी सुरू (Under Review)</span>
          </span>
        );
      case 'Sold':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span>विक्री पूर्ण (Sold Lot)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      {/* Card Header */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-agri-50 border border-agri-200/70 text-agri-700 flex items-center justify-center font-bold text-lg shadow-inner">
              <Wheat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base">{listing.cropName}</h3>
                {listing.isMyListing && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold tracking-wide uppercase border border-amber-300">
                    आपला शेतमाल (My Lot)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{listing.variety}</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {listing.batchCode}
            </span>
          </div>
        </div>

        {/* Status and Grade Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {getStatusBadge(listing.status)}
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {listing.qualityGrade}
          </span>
          {listing.moisturePercentage && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-200">
              ओलावा {listing.moisturePercentage}%
            </span>
          )}
        </div>

        {/* Financial Details Grid */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-earth-50 border border-earth-200/70 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">उपलब्ध प्रमाण (Quantity)</span>
            <span className="text-base font-extrabold text-slate-900">
              {listing.quantityQuintals} <span className="text-xs font-normal text-slate-600">Quintals</span>
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">अपेक्षित दर (Expected Price)</span>
            <span className="text-base font-extrabold text-agri-800">
              ₹{listing.expectedPricePerQuintal.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-600">/ Qtl</span>
            </span>
          </div>

          <div className="col-span-2 pt-2 border-t border-earth-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">एकूण अंदाजित मूल्य (Estimated Total Value):</span>
            <span className="font-extrabold text-slate-900 text-sm">{formatINR(totalValue)}</span>
          </div>
        </div>

        {/* Farmer & Location Metadata */}
        <div className="space-y-1.5 text-xs text-slate-600 pt-1">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">
              {listing.village}, {listing.taluka}, {listing.district}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>काढणी दिनांक (Harvest): {listing.harvestDate}</span>
          </div>
          {listing.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 italic">
              "{listing.description}"
            </p>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="text-[11px] text-slate-500">
          नोंदणी: {listing.createdAt}
        </div>

        <div className="flex items-center space-x-2">
          {onPledgeToPool && listing.status === 'Active / Open for Offers' && (
            <button
              type="button"
              onClick={() => onPledgeToPool(listing)}
              className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1"
              title="FPO गटामध्ये जोडा (Pool with FPO)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>गटात जोडा (Pool)</span>
            </button>
          )}

          {onViewOffers && (
            <button
              type="button"
              onClick={() => onViewOffers(listing.id)}
              className="px-3 py-1.5 rounded-lg bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>ऑफर पहा (Offers)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


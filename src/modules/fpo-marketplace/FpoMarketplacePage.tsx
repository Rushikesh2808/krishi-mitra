import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Building2,
  Package,
  Handshake,
  Layers,
  Plus,
  Filter,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Store,
  Truck,
  Wheat,
  Search,
  Check
} from 'lucide-react';
import {
  MOCK_FPO_ORGANIZATIONS,
  MOCK_BUYER_ORGANIZATIONS,
  MOCK_BULK_OPPORTUNITIES,
  FarmerMarketplaceListing,
  MarketplaceOffer,
  BulkAggregationOpportunity,
  calculateOfferFinancials
} from '../../data/fpoBuyerMockData';
import {
  getProduceListings,
  addProduceListing,
  getBuyerOffers,
  updateBuyerOfferStatus
} from '../../data/marketplaceStore';
import { CURRENT_FARMER } from '../../data/mockData';
import { formatINR } from '../../utils/currency';
import { useLanguage } from '../../context/LanguageContext';
import { MarketplaceHeroSummary } from './components/MarketplaceHeroSummary';
import { ProduceListingFormModal } from './components/ProduceListingFormModal';
import { ProduceListingCard } from './components/ProduceListingCard';
import { FpoDirectorySection } from './components/FpoDirectorySection';
import { BuyerDirectorySection } from './components/BuyerDirectorySection';
import { OfferNegotiationCard } from './components/OfferNegotiationCard';
import { CounterOfferModal } from './components/CounterOfferModal';
import { OfferFinancialComparisonModal } from './components/OfferFinancialComparisonModal';
import { BulkSellingSection } from './components/BulkSellingSection';

type ActiveTab = 'hub' | 'listings' | 'fpos' | 'buyers' | 'negotiations' | 'bulk';

export const FpoMarketplacePage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as ActiveTab) || 'hub';

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [listings, setListings] = useState<FarmerMarketplaceListing[]>([]);
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [bulkOpportunities, setBulkOpportunities] = useState<BulkAggregationOpportunity[]>(MOCK_BULK_OPPORTUNITIES);
  const [fpos] = useState(MOCK_FPO_ORGANIZATIONS);
  const [buyers] = useState(MOCK_BUYER_ORGANIZATIONS);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [counterModalOffer, setCounterModalOffer] = useState<MarketplaceOffer | null>(null);
  const [financialModalOffer, setFinancialModalOffer] = useState<MarketplaceOffer | null>(null);

  // Filters state for Produce Listings tab
  const [listingOwnershipFilter, setListingOwnershipFilter] = useState<'all' | 'my'>('all');
  const [listingCropFilter, setListingCropFilter] = useState<string>('All');

  // Filters state for Negotiations tab
  const [offerStatusFilter, setOfferStatusFilter] = useState<string>('All');

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setListings(getProduceListings());
    setOffers(getBuyerOffers());
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as ActiveTab;
    if (tabParam && ['hub', 'listings', 'fpos', 'buyers', 'negotiations', 'bulk'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1. Create New Produce Listing Handler
  const handleCreateListing = (newListingData: {
    cropName: string;
    cropId: string;
    variety: string;
    quantityQuintals: number;
    expectedPricePerQuintal: number;
    qualityGrade: 'Grade A (Export)' | 'Grade A (Commercial)' | 'Grade B (FAQ)' | 'Fair Average';
    moisturePercentage: number;
    harvestDate: string;
    village: string;
    taluka: string;
    district: string;
    description: string;
  }) => {
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const codePrefix = newListingData.cropName.substring(0, 2).toUpperCase();
    const newListing: FarmerMarketplaceListing = {
      ...newListingData,
      id: `list-${Date.now()}`,
      farmerId: CURRENT_FARMER.id,
      farmerName: `${CURRENT_FARMER.fullName} (You)`,
      farmerMobile: CURRENT_FARMER.mobile,
      batchCode: `LOT-${codePrefix}-NP-${randomSuffix}`,
      createdAt: 'Just now',
      isMyListing: true,
      status: 'Active / Open for Offers',
    };

    const updatedListings = addProduceListing(newListing);
    setListings(updatedListings);
    showToast(`आपला ${newListing.cropName} (${newListing.quantityQuintals} Qtl) शेतमाल यशस्वीरित्या मार्केटप्लेसमध्ये नोंदवला गेला आहे!`);
    handleSelectTab('listings');
  };

  // 2. Offer Accept Handler
  const handleAcceptOffer = (offerId: string) => {
    const updated = updateBuyerOfferStatus(offerId, 'Accepted');
    setOffers(updated);
    setListings(getProduceListings());
    showToast('खरेदीदाराची ऑफर स्वीकारली गेली! विक्री करार व पिकअप सूचना नोंदवली आहे.');
  };

  // 3. Offer Reject Handler
  const handleRejectOffer = (offerId: string) => {
    const updated = updateBuyerOfferStatus(offerId, 'Rejected');
    setOffers(updated);
    showToast('ऑफर नाकारली गेली आहे.');
  };

  // 4. Offer Counter Submit Handler
  const handleSubmitCounterOffer = (offerId: string, counterPrice: number, counterNote: string) => {
    const updated = updateBuyerOfferStatus(offerId, 'Counteroffer Sent', counterPrice, counterNote);
    setOffers(updated);
    showToast(`प्रति-ऑफर (₹${counterPrice.toLocaleString('en-IN')}/Qtl) खरेदीदाराकडे सादर केली गेली आहे!`);
  };

  // 5. Bulk Pool Pledge Handler
  const handlePledgeToPool = (poolId: string, quantityQuintals: number) => {
    setBulkOpportunities((prev) =>
      prev.map((pool) =>
        pool.id === poolId
          ? {
              ...pool,
              currentAggregatedQuintals: Math.min(
                pool.targetQuantityQuintals,
                pool.currentAggregatedQuintals + quantityQuintals
              ),
              participatingFarmersCount: pool.participatingFarmersCount + 1,
            }
          : pool
      )
    );
  };

  // Filtered Produce Listings
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchesOwnership = listingOwnershipFilter === 'all' || l.isMyListing;
      const matchesCrop =
        listingCropFilter === 'All' ||
        l.cropName.toLowerCase().includes(listingCropFilter.toLowerCase());
      return matchesOwnership && matchesCrop;
    });
  }, [listings, listingOwnershipFilter, listingCropFilter]);

  // Filtered Offers
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      if (offerStatusFilter === 'All') return true;
      if (offerStatusFilter === 'Pending') return o.status === 'Pending';
      if (offerStatusFilter === 'Accepted') return o.status === 'Accepted';
      if (offerStatusFilter === 'Rejected') return o.status === 'Rejected';
      if (offerStatusFilter === 'Counter') return o.status === 'Counteroffer Sent';
      return true;
    });
  }, [offers, offerStatusFilter]);

  const pendingOffersCount = offers.filter((o) => o.status === 'Pending').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-emerald-800 text-white shadow-2xl border border-emerald-600 flex items-center space-x-3 text-xs max-w-md animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="font-bold flex-1">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Hero & Metrics Summary */}
      <MarketplaceHeroSummary
        fpoCount={fpos.length}
        buyerCount={buyers.length}
        listingsCount={listings.length}
        pendingOffersCount={pendingOffersCount}
        bulkPoolsCount={bulkOpportunities.length}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onSelectTab={handleSelectTab}
      />

      {/* Responsive Horizontal Pill Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-1 sm:space-x-2 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => handleSelectTab('hub')}
          className={`px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'hub'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{language === 'mr' ? 'मार्केटप्लेस हब' : language === 'hi' ? 'मार्केटप्लेस हब' : 'Marketplace Hub'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('listings')}
          className={`px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'listings'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t('marketplace.produceListings')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'listings' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {listings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('fpos')}
          className={`px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'fpos'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('marketplace.fpoDirectory')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'fpos' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {fpos.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('buyers')}
          className={`px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'buyers'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t('marketplace.buyerDirectory')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'buyers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {buyers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('negotiations')}
          className={`px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'negotiations'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Handshake className="w-4 h-4" />
          <span>{t('marketplace.receivedBids')}</span>
          {pendingOffersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 animate-pulse">
              {pendingOffersCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('bulk')}
          className={`px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'bulk'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-teal-400" />
          <span>{t('marketplace.bulkSelling')}</span>
          <span>एकत्रीकरण विक्री (Bulk Pooling)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'bulk' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {bulkOpportunities.length}
          </span>
        </button>
      </div>

      {/* TAB 1: MARKETPLACE HUB (OVERVIEW DASHBOARD) */}
      {activeTab === 'hub' && (
        <div className="space-y-6">
          {/* Section: Urgent Action - Recent Buyer Offers on Your Produce */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Handshake className="w-5 h-5 text-purple-700" />
                  <span>शेतमालासाठी आलेल्या थेट ऑफर (Recent Received Offers)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review offers from institutional buyers with transparent net earnings and APMC comparisons.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectTab('negotiations')}
                className="text-xs font-bold text-agri-800 hover:text-agri-950 flex items-center space-x-1 cursor-pointer"
              >
                <span>सर्व ऑफर पहा ({offers.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.slice(0, 2).map((offer) => (
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
          </div>

          {/* 2-Column Grid: Featured Bulk Pooling + Urgent Buyer Procurement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Featured Bulk Aggregation Lot */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                    FPO सामूहिक विक्री • Bulk Pool
                  </span>
                  <span className="text-xs font-bold text-teal-800">
                    +₹{bulkOpportunities[0]?.priceAdvantagePerQuintal}/Qtl बोनस
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {bulkOpportunities[0]?.cropName} — {bulkOpportunities[0]?.lotCode}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {bulkOpportunities[0]?.description}
                </p>

                {/* Aggregated Progress */}
                <div className="mt-4 p-3.5 rounded-xl bg-earth-50 border border-earth-200 text-xs space-y-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-600">एकत्रित केलेले प्रमाण:</span>
                    <span className="font-extrabold text-slate-900">
                      {bulkOpportunities[0]?.currentAggregatedQuintals} / {bulkOpportunities[0]?.targetQuantityQuintals} Qtl
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-teal-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.round(
                          ((bulkOpportunities[0]?.currentAggregatedQuintals || 0) /
                            (bulkOpportunities[0]?.targetQuantityQuintals || 1)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{bulkOpportunities[0]?.participatingFarmersCount} शेतकरी एकत्र आले</span>
                    <span>दर: ₹{bulkOpportunities[0]?.indicativePricePerQuintal}/Qtl</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  आयोजक: {bulkOpportunities[0]?.fpoOrganizer.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectTab('bulk')}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>एकत्रीकरण संधी पहा</span>
                </button>
              </div>
            </div>

            {/* Right: Top Buyer Requirements */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                    तात्काळ खरेदीदार मागणी • Direct Sourcing
                  </span>
                  <span className="text-xs font-bold text-blue-800">
                    Farmgate Pickup
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {buyers[0]?.businessName}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {buyers[0]?.activeRequirementsSummary}
                </p>

                <div className="mt-4 p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">आवश्यक प्रमाण:</span>
                    <span className="font-extrabold text-slate-900">{buyers[0]?.requiredQuantityQuintals} Quintals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">अपेक्षित दर श्रेणी:</span>
                    <span className="font-extrabold text-agri-800">
                      ₹{buyers[0]?.indicativePriceRange.min} - ₹{buyers[0]?.indicativePriceRange.max} / Qtl
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>डिलिव्हरी:</span>
                    <span className="font-semibold text-slate-700">{buyers[0]?.preferredDeliveryTerms}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  स्थान: {buyers[0]?.location}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectTab('buyers')}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>खरेदीदार निर्देशिका उघडा</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Produce Listings Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  <span>आपला उपलब्ध शेतमाल साठा (Your Active Produce Lots)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Produce lots currently open for bids and FPO aggregation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>नवीन शेतमाल नोंदवा</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.filter((l) => l.isMyListing).slice(0, 3).map((listing) => (
                <ProduceListingCard
                  key={listing.id}
                  listing={listing}
                  onViewOffers={() => handleSelectTab('negotiations')}
                  onPledgeToPool={() => handleSelectTab('bulk')}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCE LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  <span>शेतमाल मार्केटप्लेस नोंदी (Farmer Produce Listings)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  List your harvested produce or browse active lots available for FPO pooling and buyer procurement.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ शेतमाल विक्रीसाठी नोंदवा (New Listing)</span>
              </button>
            </div>

            {/* Filter Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setListingOwnershipFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    listingOwnershipFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  सर्व शेतमाल नोंदी (All Lots - {listings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setListingOwnershipFilter('my')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    listingOwnershipFilter === 'my'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  फक्त माझा शेतमाल (My Lots - {listings.filter((l) => l.isMyListing).length})
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-500 font-medium">पिक:</span>
                <select
                  value={listingCropFilter}
                  onChange={(e) => setListingCropFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-agri-500 font-semibold"
                >
                  <option value="All">सर्व पिके (All Crops)</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Onion">Red Onion</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Gram">Gram / Chana</option>
                  <option value="Cotton">Cotton</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-semibold text-slate-800 text-sm">कोणतीही नोंद सापडली नाही (No Listings Found)</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No produce listings match the selected filter. Click below to add a new produce lot.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-agri-700 text-white font-bold text-xs"
              >
                + शेतमाल नोंदवा
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredListings.map((listing) => (
                <ProduceListingCard
                  key={listing.id}
                  listing={listing}
                  onViewOffers={() => handleSelectTab('negotiations')}
                  onPledgeToPool={() => handleSelectTab('bulk')}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FPO DIRECTORY */}
      {activeTab === 'fpos' && <FpoDirectorySection fpos={fpos} />}

      {/* TAB 4: BUYER DIRECTORY */}
      {activeTab === 'buyers' && <BuyerDirectorySection buyers={buyers} />}

      {/* TAB 5: BUYER OFFERS & NEGOTIATION */}
      {activeTab === 'negotiations' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Handshake className="w-5 h-5 text-purple-700" />
                  <span>खरेदीदार ऑफर आणि वाटाघाटी केंद्र (Offers & Negotiation Center)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Compare offered prices against expected rates and APMC mandis. Accept bids or propose counteroffers.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 font-bold">
                  {offers.length} Offers Total
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 font-medium whitespace-nowrap">स्थिती (Status):</span>
              {['All', 'Pending', 'Counter', 'Accepted', 'Rejected'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setOfferStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-colors cursor-pointer ${
                    offerStatusFilter === status
                      ? 'bg-purple-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status === 'All'
                    ? 'सर्व ऑफर (All)'
                    : status === 'Pending'
                    ? `प्रलंबित (Pending - ${pendingOffersCount})`
                    : status === 'Counter'
                    ? 'प्रति-ऑफर (Counter Sent)'
                    : status === 'Accepted'
                    ? 'स्वीकृत (Accepted)'
                    : 'नाकारली (Rejected)'}
                </button>
              ))}
            </div>
          </div>

          {/* Offers Grid */}
          {filteredOffers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
              <Handshake className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-semibold text-slate-800 text-sm">कोणतीही ऑफर उपलब्ध नाही</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No offers match the selected status filter.
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
        </div>
      )}

      {/* TAB 6: BULK SELLING & AGGREGATION */}
      {activeTab === 'bulk' && (
        <BulkSellingSection
          opportunities={bulkOpportunities}
          onPledgeProduce={handlePledgeToPool}
        />
      )}

      {/* Create Produce Listing Modal */}
      <ProduceListingFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateListing}
        farmerProfile={{
          fullName: CURRENT_FARMER.fullName,
          village: CURRENT_FARMER.village,
          taluka: CURRENT_FARMER.taluka,
          district: CURRENT_FARMER.district,
        }}
      />

      {/* Counter Offer Modal */}
      <CounterOfferModal
        offer={counterModalOffer}
        onClose={() => setCounterModalOffer(null)}
        onSubmitCounter={handleSubmitCounterOffer}
      />

      {/* Financial Net Earnings Comparison Modal */}
      <OfferFinancialComparisonModal
        offer={financialModalOffer}
        onClose={() => setFinancialModalOffer(null)}
      />
    </div>
  );
};

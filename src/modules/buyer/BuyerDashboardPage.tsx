import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FpoAggregatedLot,
  BuyerRequirement,
  MarketplaceOffer,
  calculateOfferFinancials
} from '../../data/fpoBuyerMockData';
import {
  getProduceListings,
  getFpoLots,
  getBuyerOffers,
  addBuyerOffer,
  updateBuyerOfferStatus,
  getBuyerRequirements,
  addBuyerRequirement,
  FarmerMarketplaceListing
} from '../../data/marketplaceStore';
import { formatINR } from '../../utils/currency';
import {
  Building2,
  Search,
  Plus,
  ShoppingCart,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  ArrowRight,
  Handshake,
  Check,
  X,
  Wheat,
  Package,
  MapPin,
  Truck,
  ShieldCheck,
  Send,
  FileEdit,
  Sparkles,
  Tag
} from 'lucide-react';

export const BuyerDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'requirements' | 'my_offers'>('marketplace');

  // Filter state
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [selectedQtyFilter, setSelectedQtyFilter] = useState<string>('All');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('All');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Store data
  const [farmerListings, setFarmerListings] = useState<FarmerMarketplaceListing[]>([]);
  const [fpoLots, setFpoLots] = useState<FpoAggregatedLot[]>([]);
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);

  // Modals state
  const [showNewReqModal, setShowNewReqModal] = useState(false);
  const [reqCrop, setReqCrop] = useState('Soybean');
  const [reqQty, setReqQty] = useState(500);
  const [reqMaxPrice, setReqMaxPrice] = useState(4920);
  const [reqDelivery, setReqDelivery] = useState<'Farmgate Pickup' | 'FPO Warehouse Delivery' | 'Mandi Delivery'>('Farmgate Pickup');
  const [reqQuality, setReqQuality] = useState('Moisture <10%, Clean Grade A');

  // Bid submission modal
  const [bidModalTarget, setBidModalTarget] = useState<{
    id: string;
    title: string;
    cropName: string;
    cropId: string;
    sellerName: string;
    sellerType: 'Farmer' | 'FPO';
    qty: number;
    basePrice: number;
    location: string;
  } | null>(null);

  const [bidPriceInput, setBidPriceInput] = useState<number>(4900);
  const [bidDeliveryTerms, setBidDeliveryTerms] = useState<'Farmgate Pickup' | 'FPO Warehouse Delivery' | 'Mandi Delivery'>('Farmgate Pickup');
  const [bidPaymentTerms, setBidPaymentTerms] = useState<string>('Immediate RTGS within 24 hours of electronic weighing');

  // Counter response modal
  const [counterResponseOffer, setCounterResponseOffer] = useState<MarketplaceOffer | null>(null);
  const [revisedPriceInput, setRevisedPriceInput] = useState<number>(4920);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setFarmerListings(getProduceListings());
    setFpoLots(getFpoLots());
    setRequirements(getBuyerRequirements());
    setOffers(getBuyerOffers());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Create procurement requirement
  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: BuyerRequirement = {
      id: `req-${Date.now()}`,
      buyerName: currentUser?.businessName || 'Khandesh Agro-Processing',
      buyerType: currentUser?.buyerType || 'Agri-Processor',
      cropName: reqCrop,
      requiredQuantityQuintals: reqQty,
      maxOfferedPricePerQuintal: reqMaxPrice,
      preferredPickupLocation: 'Nashik / Niphad / Lasalgaon Cluster',
      deliveryTerms: reqDelivery,
      qualityCriteria: reqQuality,
      status: 'Open',
      postedDate: 'Today',
    };
    const updated = addBuyerRequirement(newReq);
    setRequirements(updated);
    setShowNewReqModal(false);
    showToast('नवीन खरेदी मागणी (Procurement Requirement) मार्केटप्लेसमध्ये प्रसिद्ध झाली!');
  };

  // Open Offer Submission Modal
  const handleOpenBidModal = (
    id: string,
    title: string,
    cropName: string,
    sellerName: string,
    sellerType: 'Farmer' | 'FPO',
    qty: number,
    basePrice: number,
    location: string
  ) => {
    let cropId = 'crop-soybean';
    if (cropName.toLowerCase().includes('onion')) cropId = 'crop-onion';
    else if (cropName.toLowerCase().includes('cotton')) cropId = 'crop-cotton';
    else if (cropName.toLowerCase().includes('wheat')) cropId = 'crop-wheat';
    else if (cropName.toLowerCase().includes('gram') || cropName.toLowerCase().includes('chana')) cropId = 'crop-gram';

    setBidModalTarget({
      id,
      title,
      cropName,
      cropId,
      sellerName,
      sellerType,
      qty,
      basePrice,
      location,
    });
    setBidPriceInput(basePrice);
    setBidDeliveryTerms(sellerType === 'Farmer' ? 'Farmgate Pickup' : 'FPO Warehouse Delivery');
  };

  // Submit Bid
  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidModalTarget) return;

    const financials = calculateOfferFinancials(
      bidModalTarget.cropId,
      bidModalTarget.qty,
      bidPriceInput,
      bidDeliveryTerms,
      'v-niphad'
    );

    const newOffer: MarketplaceOffer = {
      id: `offer-${Date.now()}`,
      listingId: bidModalTarget.id,
      listingCrop: bidModalTarget.cropName,
      cropId: bidModalTarget.cropId,
      buyerName: currentUser?.businessName || 'Khandesh Agro-Processing Mills',
      buyerType: currentUser?.buyerType || 'Agri-Processor',
      buyerLocation: currentUser?.operatingLocation || 'Nashik & Niphad MIDC',
      offeredPricePerQuintal: bidPriceInput,
      expectedPricePerQuintal: bidModalTarget.basePrice,
      quantityQuintals: bidModalTarget.qty,
      deliveryTerms: bidDeliveryTerms,
      pickupLocation: bidModalTarget.location,
      paymentTerms: bidPaymentTerms,
      expiryDate: '48 hours from dispatch',
      receivedDate: 'Today',
      status: 'Pending',
      financials,
    };

    const updated = addBuyerOffer(newOffer);
    setOffers(updated);
    setBidModalTarget(null);
    showToast(`₹${bidPriceInput}/Qtl ची थेट खरेदी ऑफर ${bidModalTarget.sellerName} कडे पाठवली गेली!`);
  };

  // Accept Farmer Counteroffer
  const handleAcceptCounter = (offerId: string) => {
    const matched = offers.find((o) => o.id === offerId);
    if (!matched) return;
    const finalPrice = matched.farmerCounterPrice || matched.offeredPricePerQuintal;

    const updated = updateBuyerOfferStatus(offerId, 'Accepted');
    setOffers(updated);
    setFarmerListings(getProduceListings());
    setCounterResponseOffer(null);
    showToast(`प्रति-ऑफर दर (₹${finalPrice}/Qtl) मान्य केला! अंतिम खरेदी करार पूर्ण झाला.`);
  };

  // Send Revised Counter
  const handleSendRevisedCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterResponseOffer) return;

    const updated = updateBuyerOfferStatus(
      counterResponseOffer.id,
      'Pending',
      undefined,
      `Buyer revised counter: Proposed ₹${revisedPriceInput}/Qtl with expedited 24hr settlement.`
    );
    setOffers(updated);
    setCounterResponseOffer(null);
    showToast(`सुधारित प्रस्ताव (₹${revisedPriceInput}/Qtl) शेतकऱ्याकडे पाठवला गेला.`);
  };

  // Filtered Produce Listings
  const filteredFarmerListings = useMemo(() => {
    return farmerListings.filter((l) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        l.cropName.toLowerCase().includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        l.village.toLowerCase().includes(q) ||
        l.batchCode.toLowerCase().includes(q);

      // Crop
      const matchesCrop =
        selectedCropFilter === 'All' ||
        l.cropName.toLowerCase().includes(selectedCropFilter.toLowerCase());

      // Quantity
      let matchesQty = true;
      if (selectedQtyFilter === '<50') matchesQty = l.quantityQuintals < 50;
      else if (selectedQtyFilter === '50-100') matchesQty = l.quantityQuintals >= 50 && l.quantityQuintals <= 100;
      else if (selectedQtyFilter === '>100') matchesQty = l.quantityQuintals > 100;

      // Quality Grade
      const matchesGrade =
        selectedGradeFilter === 'All' || l.qualityGrade.includes(selectedGradeFilter);

      // Location
      const matchesLoc =
        selectedLocationFilter === 'All' ||
        l.village.toLowerCase().includes(selectedLocationFilter.toLowerCase()) ||
        l.district.toLowerCase().includes(selectedLocationFilter.toLowerCase());

      return matchesSearch && matchesCrop && matchesQty && matchesGrade && matchesLoc;
    });
  }, [farmerListings, searchQuery, selectedCropFilter, selectedQtyFilter, selectedGradeFilter, selectedLocationFilter]);

  const activeRequirementsCount = requirements.filter((r) => r.status === 'Open').length;
  const pendingNegotiationsCount = offers.filter(
    (o) => o.status === 'Pending' || o.status === 'Counteroffer Sent'
  ).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-blue-950 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-blue-700 flex items-center space-x-2.5 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Buyer Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/60 text-blue-200 text-xs font-semibold border border-blue-700/50">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>संस्थात्मक खरेदीदार व प्रक्रिया केंद्र • Buyer Procurement Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {currentUser?.businessName || 'Khandesh Agro-Processing & Exports Pvt Ltd'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200">
              Procurement Officer: <strong className="text-white">{currentUser?.fullName}</strong> ({currentUser?.buyerType || 'Agri-Processor'}) • Processing Hub: {currentUser?.operatingLocation || 'Jalgaon & Nashik'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewReqModal(true)}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ नवीन खरेदी मागणी नोंदवा (Post Requirement)</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">उपलब्ध शेतमाल नोंदी (Lots)</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{farmerListings.length}</div>
          <span className="text-[10px] text-slate-400">Direct harvest listings</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">FPO बल्क लॉट्स (Aggregated)</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-800">{fpoLots.length}</div>
          <span className="text-[10px] text-slate-400">Institutional truckloads</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">सक्रिय मागण्या (Requirements)</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900">{activeRequirementsCount}</div>
          <span className="text-[10px] text-slate-400">Published to farmers</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">वाटाघाटी / ऑफर्स (Negotiations)</span>
            <Handshake className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-900">{offers.length}</div>
          <span className="text-[10px] text-slate-400">{pendingNegotiationsCount} pending response</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'marketplace'
              ? 'bg-blue-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-amber-300" />
          <span>Available Produce Marketplace ({farmerListings.length + fpoLots.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requirements')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'requirements'
              ? 'bg-blue-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-300" />
          <span>My Purchase Requirements ({requirements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my_offers')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'my_offers'
              ? 'bg-blue-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Handshake className="w-4 h-4 text-purple-300" />
          <span>My Submitted Offers & Negotiations ({offers.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCE MARKETPLACE BROWSER */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          {/* Advanced Multi-Filter Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by crop, farmer name, village, or batch code..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold">
                <span className="text-slate-500">प्रमाण (Qty):</span>
                <select
                  value={selectedQtyFilter}
                  onChange={(e) => setSelectedQtyFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="All">All Quantities</option>
                  <option value="<50">&lt; 50 Qtl</option>
                  <option value="50-100">50 - 100 Qtl</option>
                  <option value=">100">&gt; 100 Qtl</option>
                </select>

                <span className="text-slate-500">स्थान (Location):</span>
                <select
                  value={selectedLocationFilter}
                  onChange={(e) => setSelectedLocationFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="All">All Locations</option>
                  <option value="Niphad">Niphad</option>
                  <option value="Lasalgaon">Lasalgaon</option>
                  <option value="Dindori">Dindori</option>
                  <option value="Sinnar">Sinnar</option>
                </select>
              </div>
            </div>

            {/* Crop Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-semibold pt-1">
              <span className="text-slate-500 mr-1 text-[11px]">Crop:</span>
              {['All', 'Soybean', 'Red Onion', 'Cotton', 'Wheat', 'Gram'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCropFilter(c)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCropFilter === c
                      ? 'bg-blue-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Section: FPO Aggregated Bulk Lots */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-teal-700" />
              <span>FPO Aggregated Bulk Lots (High-Volume Institutional Procurement)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fpoLots
                .filter((l) =>
                  selectedCropFilter === 'All' ? true : l.cropName.includes(selectedCropFilter)
                )
                .map((lot) => (
                  <div
                    key={lot.id}
                    className="bg-white rounded-2xl p-5 border border-teal-200 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {lot.lotCode}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          {lot.qualityGrade}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-slate-900">{lot.cropName}</h4>
                      <p className="text-xs text-slate-500">{lot.variety}</p>

                      <div className="mt-3 p-3 bg-earth-50 rounded-xl space-y-1 text-xs border border-earth-200">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Available Volume:</span>
                          <span className="font-extrabold text-slate-900">{lot.totalQuantityQuintals} Qtl</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">FPO Hub:</span>
                          <span className="font-semibold text-slate-700">{lot.warehouseLocation}</span>
                        </div>
                        <div className="flex justify-between font-bold text-agri-900">
                          <span>Target Asking Price:</span>
                          <span>{formatINR(lot.targetPricePerQuintal)}/Qtl</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenBidModal(
                          lot.id,
                          lot.lotCode,
                          lot.cropName,
                          'Sahyadri Farmers FPO',
                          'FPO',
                          lot.totalQuantityQuintals,
                          lot.targetPricePerQuintal,
                          lot.warehouseLocation
                        )
                      }
                      className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Bulk Purchase Offer</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Section: Individual Farmer Produce Lots */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
              <Package className="w-5 h-5 text-amber-600" />
              <span>थेट शेतकरी शेतमाल नोंदी (Direct Farmer Harvest Lots)</span>
            </h3>

            {filteredFarmerListings.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                No farmer produce lots match your selected filter criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFarmerListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">
                          {listing.batchCode}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            listing.status === 'Sold'
                              ? 'bg-purple-100 text-purple-800'
                              : listing.status === 'Aggregated with FPO'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {listing.status === 'Active / Open for Offers' ? 'Available' : listing.status}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {listing.qualityGrade}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-base text-slate-900">{listing.cropName}</h4>
                      <p className="text-xs text-slate-500">{listing.variety}</p>

                      <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1 text-xs border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Available Stock:</span>
                          <span className="font-bold text-slate-900">{listing.quantityQuintals} Quintals</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Farmer Expected:</span>
                          <span className="font-bold text-agri-800">{formatINR(listing.expectedPricePerQuintal)}/Qtl</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Location:</span>
                          <span className="font-semibold">{listing.village}, {listing.district}</span>
                        </div>
                      </div>
                    </div>

                    {listing.status === 'Active / Open for Offers' ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenBidModal(
                            listing.id,
                            listing.batchCode,
                            listing.cropName,
                            listing.farmerName,
                            'Farmer',
                            listing.quantityQuintals,
                            listing.expectedPricePerQuintal,
                            `${listing.village}, ${listing.district}`
                          )
                        }
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Direct Offer to Farmer</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-not-allowed flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{listing.status === 'Sold' ? 'Produce Sold / Committed' : 'Aggregated with FPO'}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY PURCHASE REQUIREMENTS */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                My Active Procurement Requirements
              </h3>
              <p className="text-xs text-slate-500">
                Requirements published to all FPOs and farmers across Western Maharashtra.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewReqModal(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Requirement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {req.deliveryTerms}
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1">
                      {req.cropName} Procurement
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {req.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-earth-50 border border-earth-200 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Volume Required:</span>
                    <span className="font-extrabold text-slate-900">{req.requiredQuantityQuintals} Qtl</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Max Bid Rate:</span>
                    <span className="font-bold text-agri-900">Up to ₹{req.maxOfferedPricePerQuintal}/Qtl</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Preferred Pickup:</span>
                    <span className="font-semibold">{req.preferredPickupLocation}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 italic">
                  Criteria: {req.qualityCriteria}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MY SUBMITTED OFFERS & NEGOTIATIONS */}
      {activeTab === 'my_offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Submitted Purchase Offers & Status Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Track status across Pending Review, Farmer Counteroffers, and Accepted Agreements.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {offers.length} Offers Tracked
            </span>
          </div>

          <div className="space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-base text-slate-900">{offer.listingCrop}</h4>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                      {offer.quantityQuintals} Qtl
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        offer.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : offer.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : offer.status === 'Counteroffer Sent'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </div>

                  <p className="text-slate-600">
                    Location: <strong>{offer.pickupLocation}</strong> • Delivery: <strong>{offer.deliveryTerms}</strong>
                  </p>
                  <p className="text-slate-500">Terms: {offer.paymentTerms}</p>

                  {/* Farmer Counter Proposal Banner */}
                  {offer.status === 'Counteroffer Sent' && offer.farmerCounterPrice && (
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>शेतकऱ्याने प्रस्तावित केलेला दर (Farmer Counter):</span>
                        <span className="text-sm font-extrabold text-indigo-900">
                          ₹{offer.farmerCounterPrice}/Qtl
                        </span>
                      </div>
                      {offer.farmerCounterNote && (
                        <p className="text-[11px] text-indigo-800 italic">
                          "{offer.farmerCounterNote}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Your Offered Price
                    </span>
                    <span className="text-lg font-black text-blue-900">
                      ₹{offer.offeredPricePerQuintal.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-500">/ Qtl</span>
                    </span>
                  </div>

                  {offer.status === 'Counteroffer Sent' && (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCounterResponseOffer(offer);
                          setRevisedPriceInput(
                            offer.farmerCounterPrice ? offer.farmerCounterPrice - 20 : offer.offeredPricePerQuintal + 20
                          );
                        }}
                        className="px-3 py-2 rounded-xl border border-indigo-300 text-indigo-800 hover:bg-indigo-50 font-bold"
                      >
                        Revise Offer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptCounter(offer.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm"
                      >
                        Accept Counter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMIT BID MODAL */}
      {bidModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Submit Purchase Bid</h3>
                  <p className="text-xs text-slate-500">{bidModalTarget.sellerName} • {bidModalTarget.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBidModalTarget(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-earth-50 border border-earth-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Volume:</span>
                  <span className="font-bold text-slate-900">{bidModalTarget.qty} Quintals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Asking Price:</span>
                  <span className="font-bold text-agri-800">₹{bidModalTarget.basePrice}/Qtl</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Your Offered Price (₹ / Qtl):
                </label>
                <input
                  type="number"
                  min="100"
                  value={bidPriceInput}
                  onChange={(e) => setBidPriceInput(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold text-blue-900 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Delivery Logistics:
                </label>
                <select
                  value={bidDeliveryTerms}
                  onChange={(e) => setBidDeliveryTerms(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Farmgate Pickup">Farmgate Pickup (Buyer arranges truck)</option>
                  <option value="FPO Warehouse Delivery">FPO Warehouse Delivery</option>
                  <option value="Mandi Delivery">APMC Mandi Yard Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Payment Terms:
                </label>
                <input
                  type="text"
                  value={bidPaymentTerms}
                  onChange={(e) => setBidPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBidModalTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Offer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST NEW REQUIREMENT MODAL */}
      {showNewReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Post Procurement Requirement</h3>
                  <p className="text-xs text-slate-500">Broadcast to all FPOs and farmers across Western Maharashtra</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewReqModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">पिक (Crop):</label>
                <select
                  value={reqCrop}
                  onChange={(e) => setReqCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold"
                >
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Red Onion">Red Onion (कांदा)</option>
                  <option value="Cotton">Cotton (कापूस)</option>
                  <option value="Wheat">Wheat (गहू)</option>
                  <option value="Gram / Chana">Gram / Chana (हरभरा)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quantity Needed (Qtl):</label>
                  <input
                    type="number"
                    min="10"
                    value={reqQty}
                    onChange={(e) => setReqQty(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Price (₹ / Qtl):</label>
                  <input
                    type="number"
                    min="100"
                    value={reqMaxPrice}
                    onChange={(e) => setReqMaxPrice(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold text-agri-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">डिलिव्हरी अटी (Delivery Terms):</label>
                <select
                  value={reqDelivery}
                  onChange={(e) => setReqDelivery(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Farmgate Pickup">Farmgate Pickup (Buyer arranges logistics)</option>
                  <option value="FPO Warehouse Delivery">FPO Warehouse Delivery</option>
                  <option value="Mandi Delivery">APMC Mandi Yard Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">गुणवत्ता निकष (Quality Specifications):</label>
                <input
                  type="text"
                  value={reqQuality}
                  onChange={(e) => setReqQuality(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewReqModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md"
                >
                  Publish Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVISED COUNTER PROPOSAL MODAL */}
      {counterResponseOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">
              Revise Proposal for Farmer Counteroffer
            </h3>
            <p className="text-xs text-slate-500">
              Farmer requested ₹{counterResponseOffer.farmerCounterPrice}/Qtl. Propose your revised counter price.
            </p>
            <form onSubmit={handleSendRevisedCounter} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Revised Rate (₹ / Qtl):
                </label>
                <input
                  type="number"
                  min="100"
                  value={revisedPriceInput}
                  onChange={(e) => setRevisedPriceInput(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-base font-bold text-blue-900 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCounterResponseOffer(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md"
                >
                  Send Revised Counter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

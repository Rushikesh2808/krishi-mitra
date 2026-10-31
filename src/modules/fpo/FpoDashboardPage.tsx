import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  MOCK_FPO_MEMBERS,
  FpoAggregatedLot,
  BuyerRequirement,
  MarketplaceOffer
} from '../../data/fpoBuyerMockData';
import {
  getProduceListings,
  getFpoLots,
  addFpoLot,
  getBuyerOffers,
  updateBuyerOfferStatus,
  getBuyerRequirements,
  getCropRecords,
  FarmerMarketplaceListing,
  FarmerCropRecord
} from '../../data/marketplaceStore';
import { formatINR } from '../../utils/currency';
import {
  Users,
  Layers,
  Building2,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Phone,
  Handshake,
  Plus,
  ArrowRight,
  ShieldCheck,
  Search,
  Check,
  X,
  Package,
  Sparkles,
  MapPin,
  FileCheck,
  FileEdit,
  Wheat,
  PieChart,
  Filter,
  Scale,
  Warehouse
} from 'lucide-react';

export const FpoDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'aggregation' | 'intake' | 'member_inventory' | 'negotiations' | 'buyer_reqs' | 'farmers'>('aggregation');

  // Live state synchronized with marketplace store
  const [farmerListings, setFarmerListings] = useState<FarmerMarketplaceListing[]>([]);
  const [lots, setLots] = useState<FpoAggregatedLot[]>([]);
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [buyerRequirements, setBuyerRequirements] = useState<BuyerRequirement[]>([]);
  const [memberCrops, setMemberCrops] = useState<FarmerCropRecord[]>([]);

  // Filters for member inventory & intake
  const [invCropFilter, setInvCropFilter] = useState('All');
  const [invVillageFilter, setInvVillageFilter] = useState('All');
  const [intakeCropFilter, setIntakeCropFilter] = useState('All');

  // Multi-select for farmer produce aggregation
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  const [showCreateLotModal, setShowCreateLotModal] = useState(false);

  // Aggregated lot creation form state
  const [newLotName, setNewLotName] = useState('');
  const [newLotCrop, setNewLotCrop] = useState('');
  const [newLotVariety, setNewLotVariety] = useState('');
  const [newLotTargetPrice, setNewLotTargetPrice] = useState(4950);
  const [newLotGrade, setNewLotGrade] = useState<'Grade A (Export)' | 'Grade A (Commercial)' | 'Grade B'>('Grade A (Export)');
  const [newLotWarehouse, setNewLotWarehouse] = useState('Sahyadri Central Agri Warehouse, Mohadi, Nashik');

  // Counter-offer modal state
  const [counterModalOfferId, setCounterModalOfferId] = useState<string | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState<number>(4950);
  const [counterNoteInput, setCounterNoteInput] = useState<string>(
    'FPO certified Grade A lot. Stored in climate-controlled warehouse with moisture tested <10%.'
  );

  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    setFarmerListings(getProduceListings());
    setLots(getFpoLots());
    setOffers(getBuyerOffers());
    setBuyerRequirements(getBuyerRequirements());
    setMemberCrops(getCropRecords());
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3800);
  };

  // Toggle selection of a farmer produce listing (preventing duplicate stock allocation)
  const handleToggleSelectListing = (id: string) => {
    const item = farmerListings.find((l) => l.id === id);
    if (!item) return;
    if (item.status === 'Aggregated with FPO' || item.status === 'Sold') {
      showToast('हे उत्पादन आधीच एकत्रित किंवा खरेदीदाराशी करारबद्ध असल्याने पुन्हा निवडता येत नाही.');
      return;
    }
    setSelectedListingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate selected listings statistics
  const selectedListings = useMemo(() => {
    return farmerListings.filter((l) => selectedListingIds.includes(l.id));
  }, [farmerListings, selectedListingIds]);

  const selectedTotalQuantity = selectedListings.reduce((sum, l) => sum + l.quantityQuintals, 0);
  const selectedWeightedAvgPrice =
    selectedTotalQuantity > 0
      ? Math.round(
          selectedListings.reduce((sum, l) => sum + l.quantityQuintals * l.expectedPricePerQuintal, 0) /
            selectedTotalQuantity
        )
      : 0;

  // Open lot creation modal with pre-filled details
  const handleOpenCreateLotModal = () => {
    if (selectedListings.length === 0) return;
    const first = selectedListings[0];
    const cropCode = first.cropName.substring(0, 2).toUpperCase();
    const randomSuffix = Math.floor(100 + Math.random() * 900);

    setNewLotCrop(first.cropName);
    setNewLotVariety(first.variety || 'Commercial Grade Standard');
    setNewLotName(`SAHYADRI-BULK-${cropCode}-2026-${randomSuffix}`);
    setNewLotTargetPrice(selectedWeightedAvgPrice + 80); // Default to +₹80 bulk bonus
    setShowCreateLotModal(true);
  };

  // Publish aggregated lot
  const handlePublishAggregatedLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedListings.length === 0) return;

    const newLot: FpoAggregatedLot = {
      id: `agg-${Date.now()}`,
      lotCode: newLotName,
      cropName: newLotCrop,
      variety: newLotVariety,
      totalQuantityQuintals: selectedTotalQuantity,
      contributingFarmersCount: selectedListings.length,
      targetPricePerQuintal: newLotTargetPrice,
      warehouseLocation: newLotWarehouse,
      qualityGrade: newLotGrade,
      status: 'Open for Bids',
      highestBidPrice: newLotTargetPrice - 40,
      activeBiddersCount: 1,
    };

    const updatedLots = addFpoLot(newLot, selectedListingIds);
    setLots(updatedLots);
    setFarmerListings(getProduceListings());
    setMemberCrops(getCropRecords());
    setSelectedListingIds([]);
    setShowCreateLotModal(false);
    showToast(`Bulk lot ${newLot.lotCode} (${newLot.totalQuantityQuintals} Qtl) successfully published to Marketplace!`);
  };

  // Offer Actions
  const handleAcceptOffer = (offerId: string) => {
    const updated = updateBuyerOfferStatus(offerId, 'Accepted');
    setOffers(updated);
    showToast('Buyer offer accepted! Sales contract generated with delivery escrow terms.');
  };

  const handleDeclineOffer = (offerId: string) => {
    const updated = updateBuyerOfferStatus(offerId, 'Rejected');
    setOffers(updated);
    showToast('Buyer offer declined.');
  };

  const handleSendCounter = (offerId: string) => {
    const updated = updateBuyerOfferStatus(offerId, 'Counteroffer Sent', counterPriceInput, counterNoteInput);
    setOffers(updated);
    setCounterModalOfferId(null);
    showToast(`Counteroffer of ₹${counterPriceInput}/Qtl dispatched to buyer.`);
  };

  // Crop-wise Aggregation Volume Statistics
  const cropAggregationStats = useMemo(() => {
    const totals: Record<string, { total: number; pooled: number; ready: number }> = {
      Soybean: { total: 0, pooled: 0, ready: 0 },
      'Red Onion': { total: 0, pooled: 0, ready: 0 },
      Wheat: { total: 0, pooled: 0, ready: 0 },
      'Gram / Chana': { total: 0, pooled: 0, ready: 0 },
      Cotton: { total: 0, pooled: 0, ready: 0 },
    };

    farmerListings.forEach((l) => {
      let key = 'Soybean';
      if (l.cropName.includes('Onion')) key = 'Red Onion';
      else if (l.cropName.includes('Wheat')) key = 'Wheat';
      else if (l.cropName.includes('Gram') || l.cropName.includes('Chana')) key = 'Gram / Chana';
      else if (l.cropName.includes('Cotton')) key = 'Cotton';

      if (!totals[key]) totals[key] = { total: 0, pooled: 0, ready: 0 };
      totals[key].total += l.quantityQuintals;
      if (l.status === 'Aggregated with FPO' || l.status === 'Sold') {
        totals[key].pooled += l.quantityQuintals;
      } else {
        totals[key].ready += l.quantityQuintals;
      }
    });

    // Add lot quantities
    lots.forEach((lot) => {
      let key = 'Soybean';
      if (lot.cropName.includes('Onion')) key = 'Red Onion';
      else if (lot.cropName.includes('Wheat')) key = 'Wheat';
      else if (lot.cropName.includes('Gram') || lot.cropName.includes('Chana')) key = 'Gram / Chana';

      if (!totals[key]) totals[key] = { total: 0, pooled: 0, ready: 0 };
      totals[key].pooled += lot.totalQuantityQuintals;
      totals[key].total += lot.totalQuantityQuintals;
    });

    return totals;
  }, [farmerListings, lots]);

  const totalWarehouseVolume = lots.reduce((sum, l) => sum + l.totalQuantityQuintals, 0);

  // Filtered member crops & volume aggregates
  const filteredMemberCrops = useMemo(() => {
    return memberCrops.filter((crop) => {
      if (invCropFilter !== 'All' && crop.cropName !== invCropFilter) return false;
      if (invVillageFilter !== 'All' && !crop.village.toLowerCase().includes(invVillageFilter.toLowerCase())) return false;
      return true;
    });
  }, [memberCrops, invCropFilter, invVillageFilter]);

  const memberTotalHarvested = memberCrops.reduce((sum, c) => sum + c.actualHarvestedQuantity, 0);
  const memberTotalAvailable = memberCrops.reduce((sum, c) => sum + c.availableQuantity, 0);
  const memberTotalListed = memberCrops.reduce((sum, c) => sum + c.listedQuantity, 0);
  const memberTotalCommitted = memberCrops.reduce((sum, c) => sum + c.committedQuantity, 0);

  const uniqueMemberCrops = useMemo(() => {
    return ['All', ...Array.from(new Set(memberCrops.map((c) => c.cropName)))];
  }, [memberCrops]);

  const uniqueMemberVillages = useMemo(() => {
    return ['All', ...Array.from(new Set(memberCrops.map((c) => c.village)))];
  }, [memberCrops]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-emerald-700 flex items-center space-x-2.5 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{successToast}</span>
        </div>
      )}

      {/* FPO Hero Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-agri-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800/60 text-emerald-200 text-xs font-semibold border border-emerald-600/40">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>शेतकरी उत्पादक कंपनी व्यवस्थापन हब • FPO Hub Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {currentUser?.organizationName || 'Sahyadri Farmers Producer Co. Ltd.'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200">
              Authorized Head: <strong className="text-white">{currentUser?.fullName}</strong> ({currentUser?.designation || 'Managing Director'}) • Hub: {currentUser?.operatingLocation || 'Mohadi, Nashik'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-left sm:text-right border border-white/10 shrink-0 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider block">
              FPO Registration / CIN
            </span>
            <span className="font-mono text-xs font-bold text-white block">
              {currentUser?.registrationNumber || 'CIN-U01403MH2011PTC212345'}
            </span>
            <span className="inline-flex items-center space-x-1 text-[11px] text-amber-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NABARD & SFAC Certified</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Summary Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">सभासद शेतकरी (Members)</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentUser?.activeMembersCount ? currentUser.activeMembersCount.toLocaleString('en-IN') : '142'}
          </div>
          <span className="text-[10px] text-slate-400">Verified shareholder farmers</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">एकत्रित शेतमाल साठा (Stock)</span>
            <Layers className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-black text-teal-900">
            {totalWarehouseVolume.toLocaleString('en-IN')} Qtl
          </div>
          <span className="text-[10px] text-slate-400">Across {lots.length} active bulk lots</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">खरेदीदार बिड्स (Active Bids)</span>
            <Building2 className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-black text-blue-900">
            {offers.length} Bids
          </div>
          <span className="text-[10px] text-slate-400">Institutional processors</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">एकूण गोदाम मूल्यांकन (GMV)</span>
            <TrendingUp className="w-4 h-4 text-agri-700" />
          </div>
          <div className="text-2xl font-black text-agri-900">
            ₹{(totalWarehouseVolume * 0.048).toFixed(1)} L
          </div>
          <span className="text-[10px] text-slate-400">Current warehouse inventory</span>
        </div>
      </div>

      {/* Crop-wise Aggregation Breakdown Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-teal-700" />
            <h3 className="font-extrabold text-base text-slate-900">
              पिकनिहाय शेतमाल एकत्रीकरण (Crop-wise Produce Aggregation)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {farmerListings.length} farmer batches submitted
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {Object.entries(cropAggregationStats).slice(0, 4).map(([crop, data]) => {
            const pooledPercent = data.total > 0 ? Math.round((data.pooled / data.total) * 100) : 0;
            return (
              <div key={crop} className="p-3.5 rounded-xl bg-earth-50 border border-earth-200 text-xs space-y-1.5">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{crop}</span>
                  <span className="text-agri-800">{data.total} Qtl</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${pooledPercent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>{data.pooled} Qtl Pooled</span>
                  <span className="font-bold text-teal-700">{data.ready} Qtl Ready to Pool</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('aggregation')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'aggregation'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-teal-300" />
          <span>Active Bulk Aggregated Lots ({lots.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('intake')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'intake'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4 text-amber-300" />
          <span>Farmer Intake & Pooling ({farmerListings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('member_inventory')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'member_inventory'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Wheat className="w-4 h-4 text-emerald-300" />
          <span>Member Produce Inventory ({memberCrops.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('negotiations')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'negotiations'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Handshake className="w-4 h-4 text-purple-300" />
          <span>Buyer Bids & Negotiations ({offers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('buyer_reqs')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'buyer_reqs'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-300" />
          <span>Buyer Requirements ({buyerRequirements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'farmers'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-300" />
          <span>Registered Farmers Directory</span>
        </button>
      </div>

      {/* TAB 1: BULK AGGREGATION LOTS */}
      {activeTab === 'aggregation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Active Bulk Aggregated Produce Lots
              </h3>
              <p className="text-xs text-slate-500">
                Institutional containerized lots published to corporate buyers with live bidding.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('intake')}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Aggregate New Lot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {lots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded border">
                      {lot.lotCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lot.status === 'Contract Finalized'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {lot.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">
                      {lot.cropName}
                    </h4>
                    <p className="text-xs text-slate-500">{lot.variety}</p>
                    <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {lot.qualityGrade}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-earth-50 border border-earth-200 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pooled Volume:</span>
                      <span className="font-extrabold text-slate-900">{lot.totalQuantityQuintals} Qtl</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contributing Farmers:</span>
                      <span className="font-bold text-teal-800">{lot.contributingFarmersCount} Farmers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Bulk Rate:</span>
                      <span className="font-bold text-agri-900">{formatINR(lot.targetPricePerQuintal)}/Qtl</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-extrabold pt-1 border-t border-earth-200">
                      <span>Top Active Bid:</span>
                      <span>{formatINR(lot.highestBidPrice)}/Qtl</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    {lot.warehouseLocation}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                  <span>{lot.activeBiddersCount} corporate bidders</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('negotiations')}
                    className="text-xs font-bold text-agri-800 hover:text-agri-950 flex items-center space-x-1"
                  >
                    <span>View Bids ➔</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FARMER INTAKE & MULTI-LOT AGGREGATION */}
      {activeTab === 'intake' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <Package className="w-5 h-5 text-amber-600" />
                <span>शेतकरी शेतमाल एकत्रीकरण केंद्र (Farmer Produce Intake & Pooling)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Select individual farmer batches to pool into large institutional lots (500+ Qtl) for buyer procurement.
              </p>
            </div>

            {selectedListingIds.length > 0 && (
              <button
                type="button"
                onClick={handleOpenCreateLotModal}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
              >
                <Layers className="w-4 h-4" />
                <span>एकत्रित लॉट तयार करा ({selectedListingIds.length} Lots)</span>
              </button>
            )}
          </div>

          {/* Sticky Multi-Select Toolbar if listings selected */}
          {selectedListingIds.length > 0 && (
            <div className="sticky top-20 z-30 p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-xl border border-teal-700 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-4">
                <div className="w-9 h-9 rounded-xl bg-teal-800 flex items-center justify-center font-bold text-amber-300">
                  {selectedListingIds.length}
                </div>
                <div>
                  <div className="font-extrabold text-sm">
                    {selectedListingIds.length} शेतकरी नोंदी निवडल्या (Selected)
                  </div>
                  <div className="text-xs text-teal-200">
                    एकूण प्रमाण: <strong>{selectedTotalQuantity} Quintals</strong> • सरासरी अपेक्षित दर: <strong>₹{selectedWeightedAvgPrice}/Qtl</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedListingIds([])}
                  className="px-3 py-1.5 rounded-xl border border-teal-600 text-teal-200 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  onClick={handleOpenCreateLotModal}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Layers className="w-4 h-4" />
                  <span>Create Aggregated Lot ➔</span>
                </button>
              </div>
            </div>
          )}

          {/* Farmer Listings Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-3 px-3 w-10 text-center">Select</th>
                    <th className="py-3 px-3">Batch Code</th>
                    <th className="py-3 px-3">शेतकरी नाव (Farmer)</th>
                    <th className="py-3 px-3">गाव / तालुका (Village)</th>
                    <th className="py-3 px-3">पिक व जात (Crop)</th>
                    <th className="py-3 px-3">प्रमाण (Quantity)</th>
                    <th className="py-3 px-3">अपेक्षित दर (Expected)</th>
                    <th className="py-3 px-3">ओलावा (Moisture)</th>
                    <th className="py-3 px-3">स्थिती (Status)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {farmerListings.map((item) => {
                    const isSelected = selectedListingIds.includes(item.id);
                    const isSelectable = item.status !== 'Aggregated with FPO' && item.status !== 'Sold';
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          if (isSelectable) handleToggleSelectListing(item.id);
                        }}
                        className={`transition-colors ${
                          !isSelectable
                            ? 'opacity-60 bg-slate-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-teal-50/70 font-semibold cursor-pointer'
                            : 'hover:bg-slate-50 cursor-pointer'
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!isSelectable}
                            onChange={() => {
                              if (isSelectable) handleToggleSelectListing(item.id);
                            }}
                            className={`rounded text-teal-600 focus:ring-teal-500 w-4 h-4 ${
                              !isSelectable ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">{item.batchCode}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{item.farmerName}</td>
                        <td className="py-3 px-3 text-slate-600">{item.village}, {item.district}</td>
                        <td className="py-3 px-3 text-slate-800">{item.cropName} ({item.variety})</td>
                        <td className="py-3 px-3 font-bold text-agri-800">{item.quantityQuintals} Qtl</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">₹{item.expectedPricePerQuintal}/Qtl</td>
                        <td className="py-3 px-3 text-slate-600">{item.moisturePercentage}%</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Aggregated with FPO'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'Sold'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.status === 'Aggregated with FPO'
                              ? 'Pooled with FPO'
                              : item.status === 'Sold'
                              ? 'Sold Out'
                              : 'Ready for Pooling'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MEMBER PRODUCE INVENTORY */}
      {activeTab === 'member_inventory' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                  <Wheat className="w-5 h-5 text-emerald-700" />
                  <span>शेतकरी सभासद पीक साठा (Member Farmers Produce Inventory)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Registered member farmers' verified harvest stocks, on-farm/warehouse storage, and uncommitted quantities available for bulk lots.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {memberTotalAvailable} Qtl Available for Pooling
                </span>
              </div>
            </div>

            {/* Inventory KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-500">Total Harvested</span>
                <div className="text-xl font-black text-slate-900">{memberTotalHarvested} Qtl</div>
                <span className="text-[10px] text-slate-400">Across {memberCrops.length} member batches</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Uncommitted Available</span>
                <div className="text-xl font-black text-emerald-800">{memberTotalAvailable} Qtl</div>
                <span className="text-[10px] text-emerald-600 font-semibold">Free for FPO bulk pooling</span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-amber-700">Listed in Marketplace</span>
                <div className="text-xl font-black text-amber-800">{memberTotalListed} Qtl</div>
                <span className="text-[10px] text-amber-600 font-semibold">Individual listings</span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-purple-700">Committed / Sold</span>
                <div className="text-xl font-black text-purple-800">{memberTotalCommitted} Qtl</div>
                <span className="text-[10px] text-purple-600 font-semibold">Contract finalized</span>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-bold uppercase text-[11px] flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Filter Crop:
                </span>
                {uniqueMemberCrops.map((cName) => (
                  <button
                    key={cName}
                    type="button"
                    onClick={() => setInvCropFilter(cName)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      invCropFilter === cName
                        ? 'bg-agri-800 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cName}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-bold uppercase text-[11px]">Village:</span>
                <select
                  value={invVillageFilter}
                  onChange={(e) => setInvVillageFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-medium bg-white"
                >
                  {uniqueMemberVillages.map((v) => (
                    <option key={v} value={v}>
                      {v === 'All' ? 'All Villages' : v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Member Crops Inventory Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-3 px-3">शेतकरी (Member Farmer)</th>
                    <th className="py-3 px-3">गाव (Village)</th>
                    <th className="py-3 px-3">पिक व जात (Crop)</th>
                    <th className="py-3 px-3">क्षेत्र (Acres)</th>
                    <th className="py-3 px-3">उत्पादन (Harvested)</th>
                    <th className="py-3 px-3 text-emerald-800">उपलब्ध (Available)</th>
                    <th className="py-3 px-3">नोंदणी (Listed)</th>
                    <th className="py-3 px-3">करारबद्ध (Committed)</th>
                    <th className="py-3 px-3">प्रत (Grade)</th>
                    <th className="py-3 px-3">साठवणूक (Storage)</th>
                    <th className="py-3 px-3 text-center">कृती (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMemberCrops.map((crop) => (
                    <tr key={crop.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{crop.farmerName}</td>
                      <td className="py-3 px-3 text-slate-600">{crop.village}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {crop.cropName} <span className="text-slate-400">({crop.cropVariety})</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{crop.cultivationAreaAcres} Ac</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{crop.actualHarvestedQuantity} Qtl</td>
                      <td className="py-3 px-3 font-black text-emerald-700">{crop.availableQuantity} Qtl</td>
                      <td className="py-3 px-3 text-amber-700 font-semibold">{crop.listedQuantity} Qtl</td>
                      <td className="py-3 px-3 text-purple-700 font-semibold">{crop.committedQuantity} Qtl</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {crop.cropQuality}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <div className="font-semibold text-slate-800">{crop.storageStatus}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{crop.storageLocation}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveTab('intake')}
                          disabled={crop.availableQuantity <= 0}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            crop.availableQuantity > 0
                              ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {crop.availableQuantity > 0 ? '+ Pool Lot' : 'Allocated'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUYER BIDS & NEGOTIATION TRACKER */}
      {activeTab === 'negotiations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Institutional Buyer Bids & Negotiation Console
              </h3>
              <p className="text-xs text-slate-500">
                Review and negotiate purchase bids submitted by corporate buyers for bulk lots.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              {offers.length} Bids Tracked
            </span>
          </div>

          <div className="space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base text-slate-900">{offer.buyerName}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                      {offer.quantityQuintals} Quintals
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
                    Crop: <strong>{offer.listingCrop}</strong> • Terms: <strong>{offer.deliveryTerms}</strong>
                  </p>
                  <p className="text-slate-500">Payment: {offer.paymentTerms}</p>

                  {offer.farmerCounterPrice && (
                    <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold text-[11px]">
                      Counter Proposed: ₹{offer.farmerCounterPrice}/Qtl • "{offer.farmerCounterNote}"
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Offered Price
                    </span>
                    <span className="text-lg font-black text-agri-800">
                      ₹{offer.offeredPricePerQuintal.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-500">/ Qtl</span>
                    </span>
                  </div>

                  {offer.status === 'Pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDeclineOffer(offer.id)}
                        className="p-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                        title="Decline"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCounterModalOfferId(offer.id);
                          setCounterPriceInput(offer.offeredPricePerQuintal + 50);
                        }}
                        className="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 text-xs font-bold"
                      >
                        Counter
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
                      >
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: POSTED BUYER REQUIREMENTS */}
      {activeTab === 'buyer_reqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Institutional Buyer Procurement Requirements
              </h3>
              <p className="text-xs text-slate-500">
                Large-scale purchase demands posted by edible oil refiners, export consortia, and food brands.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {buyerRequirements.length} Requests
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buyerRequirements.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {req.buyerType}
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1">
                      {req.buyerName}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {req.requiredQuantityQuintals} Qtl Needed
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-earth-50 border border-earth-200 text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Target Crop:</span>
                    <span className="font-bold text-slate-900">{req.cropName}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Max Bid Offered:</span>
                    <span className="font-bold text-agri-900">Up to ₹{req.maxOfferedPricePerQuintal}/Qtl</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Pickup Preference:</span>
                    <span className="text-slate-700">{req.preferredPickupLocation}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Delivery Terms:</span>
                    <span className="text-slate-700">{req.deliveryTerms}</span>
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

      {/* TAB 5: REGISTERED FARMERS DIRECTORY */}
      {activeTab === 'farmers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              Registered FPO Member Farmers ({MOCK_FPO_MEMBERS.length})
            </h3>
            <span className="text-xs text-slate-500">Nashik District Cohort</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_FPO_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {member.village}
                  </span>
                </div>
                <div className="text-slate-600 space-y-0.5">
                  <p>Land: <strong>{member.landAcreage} Acres</strong></p>
                  <p>Mobile: <span className="font-mono">{member.mobile}</span></p>
                  <p>Batches Submitted: <strong>{member.totalBatchesSubmitted} Lots</strong></p>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {member.primaryCrops.map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE AGGREGATED BULK LOT MODAL */}
      {showCreateLotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Create Bulk Aggregated Lot</h3>
                  <p className="text-xs text-slate-500">Pooling {selectedListings.length} farmer produce batches</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateLotModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishAggregatedLot} className="space-y-3.5 text-xs">
              {/* Summary of Combined Lots */}
              <div className="p-3 rounded-xl bg-earth-50 border border-earth-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">एकत्रित एकूण प्रमाण (Total Volume):</span>
                  <span className="text-base font-extrabold text-slate-900">{selectedTotalQuantity} Quintals</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">सरासरी शेतकरी दर (Avg Expected):</span>
                  <span className="text-base font-extrabold text-agri-900">₹{selectedWeightedAvgPrice} / Qtl</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  लॉट कोड / नाव (Bulk Lot Code):
                </label>
                <input
                  type="text"
                  value={newLotName}
                  onChange={(e) => setNewLotName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    पिक (Crop):
                  </label>
                  <input
                    type="text"
                    value={newLotCrop}
                    onChange={(e) => setNewLotCrop(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    लक्ष्यित विक्री दर (Target Bulk Price ₹/Qtl):
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={newLotTargetPrice}
                    onChange={(e) => setNewLotTargetPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-bold text-agri-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    गुणवत्ता दर्जा (Quality Grade):
                  </label>
                  <select
                    value={newLotGrade}
                    onChange={(e) => setNewLotGrade(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  >
                    <option value="Grade A (Export)">Grade A (Export)</option>
                    <option value="Grade A (Commercial)">Grade A (Commercial)</option>
                    <option value="Grade B">Grade B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    गोदाम ठिकाण (Warehouse):
                  </label>
                  <input
                    type="text"
                    value={newLotWarehouse}
                    onChange={(e) => setNewLotWarehouse(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 space-y-1">
                <span className="font-bold flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Marketplace Publishing Guarantee:</span>
                </span>
                <p className="text-[11px] leading-relaxed">
                  Upon publishing, this bulk lot will be displayed immediately to institutional buyers with zero APMC cess.
                </p>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateLotModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Publish to Marketplace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUNTER-OFFER MODAL */}
      {counterModalOfferId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">
              Propose Counter-Offer to Buyer
            </h3>
            <p className="text-xs text-slate-500">
              Enter your FPO's minimum acceptable price per quintal and delivery terms.
            </p>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Counter Price (₹ / Qtl)
              </label>
              <input
                type="number"
                value={counterPriceInput}
                onChange={(e) => setCounterPriceInput(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-xl font-bold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-agri-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Terms / Quality Justification Note
              </label>
              <textarea
                rows={2}
                value={counterNoteInput}
                onChange={(e) => setCounterNoteInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-600"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setCounterModalOfferId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSendCounter(counterModalOfferId)}
                className="px-4 py-2 text-xs font-bold bg-agri-700 hover:bg-agri-800 text-white rounded-xl shadow-md cursor-pointer"
              >
                Submit Counter-Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

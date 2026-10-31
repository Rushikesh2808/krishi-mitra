import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WelcomeSection } from './components/WelcomeSection';
import { MarketSnapshotSection } from './components/MarketSnapshotSection';
import { NetEarningsSection } from './components/NetEarningsSection';
import { SellingAdvisorySection } from './components/SellingAdvisorySection';
import { QuickAccessSection } from './components/QuickAccessSection';
import { NotificationDrawer } from './components/NotificationDrawer';
import { MOCK_CROPS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  getProduceListings,
  getBuyerOffers,
  getNotifications,
  getProduceInventorySummary,
  getLocalizedNotification,
  FarmerMarketplaceListing,
  MarketplaceOffer,
  AppNotification,
  ProduceInventorySummary
} from '../../data/marketplaceStore';
import { formatINR } from '../../utils/currency';
import {
  AlertCircle,
  CheckCircle2,
  Package,
  Handshake,
  Bell,
  ArrowRight,
  Plus,
  Clock,
  Truck,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Wheat,
  Scale,
  Warehouse
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const farmerId = currentUser?.id || 'farmer-mh-001';

  const [selectedCropId, setSelectedCropId] = useState<string>('crop-soybean');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'crop-soybean': 50,
    'crop-onion': 75,
    'crop-cotton': 30,
    'crop-wheat': 40,
    'crop-gram': 45,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

  // Live state from marketplace store
  const [farmerListings, setFarmerListings] = useState<FarmerMarketplaceListing[]>([]);
  const [buyerOffers, setBuyerOffers] = useState<MarketplaceOffer[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<AppNotification[]>([]);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [inventorySummary, setInventorySummary] = useState<ProduceInventorySummary>({
    totalHarvested: 0,
    totalListed: 0,
    totalCommitted: 0,
    totalAvailable: 0,
    cropCount: 0,
    cropBreakdown: [],
  });

  const loadAllData = () => {
    const allListings = getProduceListings();
    setFarmerListings(allListings.filter((l) => l.isMyListing));

    const allOffers = getBuyerOffers();
    setBuyerOffers(allOffers);

    const allNotifs = getNotifications('FARMER');
    setRecentNotifications(allNotifs.slice(0, 3));

    setInventorySummary(getProduceInventorySummary(farmerId));
  };

  useEffect(() => {
    loadAllData();
  }, [farmerId]);

  // Active crop metadata
  const activeCrop = MOCK_CROPS.find((c) => c.id === selectedCropId) || MOCK_CROPS[0];
  const currentQuantity = quantities[selectedCropId] ?? 50;

  const handleQuantityChange = (newQty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [selectedCropId]: newQty,
    }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      loadAllData();
      setRefreshToast('Latest APMC spot rates, inventory & offers refreshed.');
      setTimeout(() => setRefreshToast(null), 3500);
    }, 600);
  };

  const pendingOffers = buyerOffers.filter((o) => o.status === 'Pending' || o.status === 'Counteroffer Sent');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Toast Notification for manual refresh */}
      {refreshToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{refreshToast}</span>
        </div>
      )}

      {/* 1. Welcome Section & Crop Selection */}
      <WelcomeSection
        selectedCropId={selectedCropId}
        onSelectCrop={(id) => setSelectedCropId(id)}
        quantity={currentQuantity}
        onQuantityChange={handleQuantityChange}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* 2. Today's Market Snapshot */}
      <MarketSnapshotSection
        cropName={activeCrop.name}
        marathiName={activeCrop.marathiName}
        samplePricePerQuintal={activeCrop.samplePricePerQuintal}
        priceTrend={activeCrop.priceTrend}
        trendPercent={activeCrop.trendPercent}
        bestMandiName={activeCrop.bestMandiName}
        bestMandiDistanceKm={activeCrop.bestMandiDistanceKm}
        bestMandiNetPrice={activeCrop.bestMandiNetPrice}
        lowestTransportMandiName={activeCrop.lowestTransportMandiName}
        lowestTransportCostPerQuintal={activeCrop.lowestTransportCostPerQuintal}
      />

      {/* 3. Produce Inventory & Stock Health Summary Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-agri-50 text-agri-700 flex items-center justify-center">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                शेतमाल साठा व इन्व्हेंटरी (Produce Stock & Inventory)
              </h3>
              <p className="text-xs text-slate-500">
                कापणी उत्पादन, विक्रीयोग्य साठा आणि बाजारात नोंदवलेला माल
              </p>
            </div>
          </div>

          <Link
            to="/crop-selection"
            className="text-xs font-bold text-agri-800 hover:text-agri-950 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-agri-50 hover:bg-agri-100 transition-colors w-fit"
          >
            <span>साठा व्यवस्थापन (Manage Inventory)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Quick Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Harvested</span>
            <div className="text-xl font-black text-slate-900">
              {inventorySummary.totalHarvested} <span className="text-xs font-medium text-slate-500">Qtl</span>
            </div>
            <span className="text-[10px] text-slate-400">{inventorySummary.cropCount} crops recorded</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-0.5">
            <span className="text-[10px] text-emerald-700 uppercase font-bold">Available to Sell</span>
            <div className="text-xl font-black text-emerald-800">
              {inventorySummary.totalAvailable} <span className="text-xs font-medium text-emerald-600">Qtl</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" /> Free uncommitted
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-0.5">
            <span className="text-[10px] text-amber-700 uppercase font-bold">Listed in Market</span>
            <div className="text-xl font-black text-amber-800">
              {inventorySummary.totalListed} <span className="text-xs font-medium text-amber-600">Qtl</span>
            </div>
            <span className="text-[10px] text-amber-700">In marketplace listings</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-0.5">
            <span className="text-[10px] text-purple-700 uppercase font-bold">Committed / Sold</span>
            <div className="text-xl font-black text-purple-800">
              {inventorySummary.totalCommitted} <span className="text-xs font-medium text-purple-600">Qtl</span>
            </div>
            <span className="text-[10px] text-purple-700">Accepted sales deals</span>
          </div>
        </div>

        {/* Visual Crop Breakdown Chips */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          {inventorySummary.cropBreakdown.map((crop) => (
            <div
              key={crop.cropName}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center space-x-2"
            >
              <span className="font-bold text-slate-800">{crop.cropName}:</span>
              <span className="text-emerald-700 font-semibold">{crop.available} Qtl Free</span>
              {crop.listed > 0 && (
                <span className="text-amber-700 font-semibold">• {crop.listed} Qtl Listed</span>
              )}
              {crop.committed > 0 && (
                <span className="text-purple-700 font-semibold">• {crop.committed} Qtl Sold</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Net Earnings Overview & 5. Selling Advisory in Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Transparent Net Earnings Breakdown */}
        <NetEarningsSection
          cropId={activeCrop.id}
          cropName={activeCrop.name}
          quantityQuintals={currentQuantity}
          expectedPricePerQuintal={activeCrop.samplePricePerQuintal}
          distanceKm={activeCrop.bestMandiDistanceKm}
        />

        {/* Sell Now vs Wait Advisory */}
        <SellingAdvisorySection
          cropName={activeCrop.name}
          advisory={activeCrop.advisory}
          minPrice={activeCrop.forecastSummary.min10DayPrice}
          maxPrice={activeCrop.forecastSummary.max10DayPrice}
        />
      </div>

      {/* 6. Marketplace Integration: Active Produce Listings & Received Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Farmer's Active Produce Listings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  आपला शेतमाल साठा (Active Produce Lots)
                </h3>
                <p className="text-xs text-slate-500">
                  {farmerListings.length} lots active in direct marketplace
                </p>
              </div>
            </div>
            <Link
              to="/crop-selection"
              className="text-xs font-bold text-agri-800 hover:text-agri-950 flex items-center space-x-1"
            >
              <span>+ नवीन नोंदवा (New)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {farmerListings.slice(0, 3).map((listing) => (
              <div
                key={listing.id}
                className="p-3 rounded-xl bg-earth-50 border border-earth-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{listing.cropName}</span>
                    <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {listing.batchCode}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5">
                    {listing.quantityQuintals} Qtl • Expected: ₹{listing.expectedPricePerQuintal}/Qtl
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    listing.status === 'Active / Open for Offers'
                      ? 'bg-emerald-100 text-emerald-800'
                      : listing.status === 'Sold'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {listing.status === 'Active / Open for Offers'
                      ? 'Open for Bids'
                      : listing.status === 'Sold'
                      ? 'Sold'
                      : 'Aggregated'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold mt-1">
                    {formatINR(listing.quantityQuintals * listing.expectedPricePerQuintal)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/crop-selection"
            className="block text-center py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
          >
            सर्व शेतमाल नोंदी व्यवस्थापित करा (Manage All Crops & Stock) ➔
          </Link>
        </div>

        {/* Right: Received Buyer & FPO Offers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Handshake className="w-5 h-5 text-purple-700" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  खरेदीदार थेट ऑफर्स (Received Buyer Offers)
                </h3>
                <p className="text-xs text-slate-500">
                  {pendingOffers.length} pending review • Farmgate pickup rates
                </p>
              </div>
            </div>
            <Link
              to="/fpo-marketplace?tab=negotiations"
              className="text-xs font-bold text-agri-800 hover:text-agri-950 flex items-center space-x-1"
            >
              <span>सर्व पहा ({buyerOffers.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {buyerOffers.slice(0, 2).map((offer) => (
              <div
                key={offer.id}
                className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900">{offer.buyerName}</h4>
                    <span className="text-slate-600 text-[11px]">
                      {offer.quantityQuintals} Qtl {offer.listingCrop} • {offer.deliveryTerms}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    offer.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : offer.status === 'Counteroffer Sent'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {offer.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-purple-200/60">
                  <div>
                    <span className="text-slate-500 block text-[10px]">ऑफर दर (Offered Rate):</span>
                    <span className="text-sm font-extrabold text-agri-900">
                      ₹{offer.offeredPricePerQuintal}/Qtl
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                    +₹{offer.financials.netAdvantagePerQuintal}/Qtl vs Mandi
                  </span>

                  <Link
                    to="/fpo-marketplace?tab=negotiations"
                    className="px-3 py-1 rounded-lg bg-agri-700 hover:bg-agri-800 text-white font-bold text-[11px]"
                  >
                    वाटाघाटी करा (Review)
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/fpo-marketplace?tab=negotiations"
            className="block text-center py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
          >
            वाटाघाटी केंद्र उघडा (Open Negotiation Hub) ➔
          </Link>
        </div>
      </div>

      {/* 7. Recent Notifications Summary Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-agri-700" />
            <h3 className="font-extrabold text-base text-slate-900">
              ताज्या बाजार सूचना व अलर्ट (Recent Market Alerts)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setNotificationDrawerOpen(true)}
            className="text-xs font-bold text-agri-800 hover:text-agri-950 flex items-center space-x-1 cursor-pointer"
          >
            <span>सर्व अलर्ट पहा (View All)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recentNotifications.map((notif) => {
            const loc = getLocalizedNotification(notif, language);
            return (
              <div
                key={notif.id}
                onClick={() => setNotificationDrawerOpen(true)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="truncate pr-2">{loc.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {loc.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. Quick Access to All Modules */}
      <QuickAccessSection />

      {/* Notification Drawer Modal */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
    </div>
  );
};

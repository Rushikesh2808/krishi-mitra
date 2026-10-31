import React, { useState, useEffect, useMemo } from 'react';
import {
  Wheat,
  Plus,
  Filter,
  Search,
  Sparkles,
  Warehouse,
  Scale,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  getCropRecords,
  addCropRecord,
  updateCropRecord,
  deleteCropRecord,
  getProduceInventorySummary,
  FarmerCropRecord,
  ProduceInventorySummary
} from '../../data/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ProduceInventoryOverview } from './components/ProduceInventoryOverview';
import { CropRecordCard } from './components/CropRecordCard';
import { CropFormModal } from './components/CropFormModal';
import { QuickMarketplaceListModal } from './components/QuickMarketplaceListModal';
import { Link } from 'react-router-dom';

export const CropSelectionPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const farmerId = currentUser?.id || 'farmer-mh-001';

  // Crop Records & Inventory Data
  const [crops, setCrops] = useState<FarmerCropRecord[]>([]);
  const [inventorySummary, setInventorySummary] = useState<ProduceInventorySummary>({
    totalHarvested: 0,
    totalListed: 0,
    totalCommitted: 0,
    totalAvailable: 0,
    cropCount: 0,
    cropBreakdown: [],
  });

  // Filter and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [selectedStockFilter, setSelectedStockFilter] = useState<'All' | 'Available' | 'Listed' | 'Committed'>('All');

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<FarmerCropRecord | null>(null);
  const [listingTargetCrop, setListingTargetCrop] = useState<FarmerCropRecord | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load Crops & Inventory Summary
  const refreshData = () => {
    const records = getCropRecords(farmerId);
    setCrops(records);
    setInventorySummary(getProduceInventorySummary(farmerId));
  };

  useEffect(() => {
    refreshData();
  }, [farmerId]);

  // Total acreage across all recorded crops
  const totalAcreage = useMemo(() => {
    return Number(crops.reduce((acc, c) => acc + (c.cultivationAreaAcres || 0), 0).toFixed(1));
  }, [crops]);

  // Unique crop names for filter chips
  const uniqueCropNames = useMemo(() => {
    const set = new Set(crops.map((c) => c.cropName));
    return ['All', ...Array.from(set)];
  }, [crops]);

  // Filtered crops list
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = crop.cropName.toLowerCase().includes(q);
        const matchesVariety = crop.cropVariety.toLowerCase().includes(q);
        const matchesLocation = crop.storageLocation.toLowerCase().includes(q);
        if (!matchesName && !matchesVariety && !matchesLocation) return false;
      }

      // 2. Crop Type Filter
      if (selectedCropFilter !== 'All' && crop.cropName !== selectedCropFilter) {
        return false;
      }

      // 3. Stock Availability Filter
      if (selectedStockFilter === 'Available' && crop.availableQuantity <= 0) {
        return false;
      }
      if (selectedStockFilter === 'Listed' && crop.listedQuantity <= 0) {
        return false;
      }
      if (selectedStockFilter === 'Committed' && crop.committedQuantity <= 0) {
        return false;
      }

      return true;
    });
  }, [crops, searchQuery, selectedCropFilter, selectedStockFilter]);

  // Handlers for Add / Edit
  const handleOpenAddModal = () => {
    setEditingCrop(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (crop: FarmerCropRecord) => {
    setEditingCrop(crop);
    setIsFormModalOpen(true);
  };

  const handleSaveCrop = (cropData: {
    cropName: string;
    cropVariety: string;
    cultivationAreaAcres: number;
    sowingDate: string;
    expectedHarvestDate: string;
    expectedQuantityQuintals: number;
    actualHarvestedQuantity: number;
    cropQuality: 'Grade A (Export)' | 'Grade A (Commercial)' | 'Grade B (FAQ)';
    storageStatus: 'On-Farm Dry Shed' | 'Warehouse Pallets' | 'Kanda Chawl' | 'Awaiting Storage' | 'Sold Out';
    storageLocation: string;
    notes?: string;
  }) => {
    try {
      if (editingCrop) {
        updateCropRecord(editingCrop.id, cropData);
        showToast(`'${cropData.cropName}' पीक नोंदणी यशस्वीरित्या अद्ययावत केली!`);
      } else {
        addCropRecord({
          farmerId,
          farmerName: currentUser?.fullName || 'Ramesh Patil',
          village: currentUser?.village || 'Niphad',
          district: currentUser?.district || 'Nashik',
          ...cropData,
        });
        showToast(`नवीन पीक '${cropData.cropName}' (${cropData.actualHarvestedQuantity} Qtl) साठ्यात जोडले गेले!`);
      }
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Error saving crop record.', 'error');
    }
  };

  // Handler for Delete
  const handleDeleteCrop = (id: string) => {
    const target = crops.find((c) => c.id === id);
    if (!target) return;

    if (window.confirm(`तुम्हाला '${target.cropName} (${target.cropVariety})' पीक नोंदणी साठ्यातून कायमची हटवायची आहे का?`)) {
      try {
        deleteCropRecord(id);
        refreshData();
        showToast(`'${target.cropName}' पीक साठ्यातून हटवले गेले.`);
      } catch (err: any) {
        showToast(err.message || 'Cannot delete crop record.', 'error');
      }
    }
  };

  // Handler for Quick Listing
  const handleOpenListModal = (crop: FarmerCropRecord) => {
    setListingTargetCrop(crop);
  };

  const handleListingSuccess = (message: string) => {
    showToast(message);
    refreshData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 duration-300">
          <div
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold ${
              toastType === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-rose-900 text-white border-rose-700'
            }`}
          >
            {toastType === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Page Title & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-agri-900 via-agri-800 to-agri-700 p-6 rounded-3xl text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase text-agri-100">
              Produce Inventory Engine
            </span>
            <span className="text-white/40">•</span>
            <span className="text-xs text-agri-100">शेतमाल साठा व्यवस्थापन</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('inventory.title')}
          </h1>
          <p className="text-xs sm:text-sm text-agri-100 max-w-2xl">
            {t('inventory.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={refreshData}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center border border-white/10"
            title="Refresh Stock Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            to="/fpo-marketplace"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all"
          >
            <span>Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-900/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('inventory.addCrop')}</span>
          </button>
        </div>
      </div>

      {/* 1. PRODUCE INVENTORY KPI DASHBOARD */}
      <ProduceInventoryOverview summary={inventorySummary} totalAcreage={totalAcreage} />

      {/* 2. CROP RECORDS & FILTER TOOLBAR */}
      <div className="space-y-4">
        {/* Filters Header */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop, variety, or storage location..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium"
              />
            </div>

            {/* Stock Filter Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider pr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Status:
              </span>
              {(['All', 'Available', 'Listed', 'Committed'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedStockFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs ${
                    selectedStockFilter === filter
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'All'
                    ? 'All Batches'
                    : filter === 'Available'
                    ? 'In Stock (>0 Qtl)'
                    : filter === 'Listed'
                    ? 'Listed in Market'
                    : 'Committed / Sold'}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Type Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider pr-1">
              Crops:
            </span>
            {uniqueCropNames.map((cName) => (
              <button
                key={cName}
                type="button"
                onClick={() => setSelectedCropFilter(cName)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedCropFilter === cName
                    ? 'bg-agri-50 border border-agri-600 text-agri-800'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cName}
              </button>
            ))}
          </div>
        </div>

        {/* Crops Cards Grid */}
        {filteredCrops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrops.map((crop) => (
              <CropRecordCard
                key={crop.id}
                crop={crop}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteCrop}
                onListProduce={handleOpenListModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-agri-50 text-agri-700 flex items-center justify-center mx-auto">
              <Wheat className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Matching Crop Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedCropFilter !== 'All' || selectedStockFilter !== 'All'
                ? 'Try adjusting your filters or search query.'
                : 'You have not added any crops yet. Click "Add New Crop" above to record your first harvest.'}
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Crop</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. MAHARASHTRA STORAGE PRACTICES & SCIENTIFIC ADVISORY */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
        <div className="flex items-center space-x-2 text-agri-800">
          <Warehouse className="w-4 h-4 text-agri-700" />
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
            Maharashtra Scientific Storage & Shelf-Life Advisory
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">Red Onion (Garwa/Kharif)</span>
            <p className="text-slate-600 text-[11px]">
              Store in naturally ventilated <strong>Kanda Chawl</strong> at 25-30°C and 65-70% humidity. Avoid plastic tarpaulins. Expect 60-90 days safe storage with regular sorting.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">Soybean (Yellow Bold JS-335)</span>
            <p className="text-slate-600 text-[11px]">
              Sun-dry until grain moisture is &lt;10%. Store in gunny bags on raised wooden pallets 1.5 ft away from walls. Prevents seed oil deterioration and mold.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">Cotton (Bt Cotton II)</span>
            <p className="text-slate-600 text-[11px]">
              Store in moisture-proof ventilated sheds with sand or polythene floor barrier. Guard against spontaneous heat buildup and maintain bright white fiber grade.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CropFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveCrop}
        initialCrop={editingCrop}
      />

      <QuickMarketplaceListModal
        isOpen={Boolean(listingTargetCrop)}
        onClose={() => setListingTargetCrop(null)}
        crop={listingTargetCrop}
        onSuccess={handleListingSuccess}
      />
    </div>
  );
};

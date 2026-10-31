import React from 'react';
import { MOCK_CROPS, FARMER_VILLAGES } from '../../data/mockData';
import { computeMandiComparisons } from '../../utils/calculations';
import { useLanguage } from '../../context/LanguageContext';
import { MandiFilterHeader } from './components/MandiFilterHeader';
import { MandiProfitInsightBanner } from './components/MandiProfitInsightBanner';
import { MandiComparisonChart } from './components/MandiComparisonChart';
import { MandiComparisonCard } from './components/MandiComparisonCard';
import { MandiComparisonTable } from './components/MandiComparisonTable';
import { Store, ShieldAlert, AlertCircle, RefreshCw } from 'lucide-react';

export const MarketComparisonPage: React.FC = () => {
  const { language, t } = useLanguage();
  // 1. Interactive States
  const [selectedCropId, setSelectedCropId] = React.useState<string>('crop-soybean');
  const [quantity, setQuantity] = React.useState<number>(50);
  const [selectedVillageId, setSelectedVillageId] = React.useState<string>('v-niphad');
  const [sortBy, setSortBy] = React.useState<
    'net_earnings' | 'gross_price' | 'distance' | 'transport_cost'
  >('net_earnings');
  const [distanceFilter, setDistanceFilter] = React.useState<
    'all' | 'under50' | 'under150' | 'above150'
  >('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [viewMode, setViewMode] = React.useState<'cards' | 'table'>('cards');

  // Active crop and village details
  const activeCrop = MOCK_CROPS.find((c) => c.id === selectedCropId) || MOCK_CROPS[0];
  const activeVillage = FARMER_VILLAGES.find((v) => v.id === selectedVillageId) || FARMER_VILLAGES[0];

  // 2. Compute dynamic comparison entries
  const allComputedEntries = React.useMemo(() => {
    return computeMandiComparisons(selectedCropId, quantity, selectedVillageId);
  }, [selectedCropId, quantity, selectedVillageId]);

  // 3. Filter and Sort entries
  const filteredAndSortedEntries = React.useMemo(() => {
    let result = [...allComputedEntries];

    // Filter by text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.mandiName.toLowerCase().includes(q) ||
          e.marathiMandiName.toLowerCase().includes(q) ||
          e.district.toLowerCase().includes(q)
      );
    }

    // Filter by distance bracket
    if (distanceFilter === 'under50') {
      result = result.filter((e) => e.distanceKm <= 50);
    } else if (distanceFilter === 'under150') {
      result = result.filter((e) => e.distanceKm <= 150);
    } else if (distanceFilter === 'above150') {
      result = result.filter((e) => e.distanceKm > 150);
    }

    // Sort entries
    result.sort((a, b) => {
      if (sortBy === 'net_earnings') {
        return b.netEarnings - a.netEarnings;
      }
      if (sortBy === 'gross_price') {
        return b.pricePerQuintal - a.pricePerQuintal;
      }
      if (sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === 'transport_cost') {
        return a.transportationCost - b.transportationCost;
      }
      return 0;
    });

    return result;
  }, [allComputedEntries, searchQuery, distanceFilter, sortBy]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center">
              <Store className="w-5 h-5 text-agri-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('mandi.title')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {t('mandi.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Demo Indicator */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-800 self-start sm:self-auto">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Realistic Demonstration Data Active</span>
        </div>
      </div>

      {/* 1. Selection & Filter Controls Header */}
      <MandiFilterHeader
        selectedCropId={selectedCropId}
        onSelectCrop={setSelectedCropId}
        quantity={quantity}
        onQuantityChange={setQuantity}
        selectedVillageId={selectedVillageId}
        onSelectVillage={setSelectedVillageId}
        sortBy={sortBy}
        onSortChange={setSortBy}
        distanceFilter={distanceFilter}
        onDistanceFilterChange={setDistanceFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 2. Educational Profit Advantage Banner */}
      <MandiProfitInsightBanner
        entries={allComputedEntries}
        cropName={activeCrop.name}
        quantityQuintals={quantity}
      />

      {/* 3. Recharts Gross vs Net Bar Chart */}
      <MandiComparisonChart
        entries={allComputedEntries}
        cropName={activeCrop.name}
      />

      {/* 4. Results List / Cards Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              Evaluated Mandi Markets ({filteredAndSortedEntries.length} of {allComputedEntries.length} Available)
            </h3>
            <p className="text-xs text-slate-500">
              Dispatched from {activeVillage.name} ({activeVillage.district}) • Sorted by{' '}
              {sortBy === 'net_earnings'
                ? 'Highest Net In-Hand Earnings'
                : sortBy === 'gross_price'
                ? 'Highest Quoted Price'
                : sortBy === 'distance'
                ? 'Shortest Road Distance'
                : 'Lowest Transit Cost'}
            </p>
          </div>

          {(searchQuery || distanceFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDistanceFilter('all');
              }}
              className="text-xs font-semibold text-agri-700 hover:text-agri-800 self-start sm:self-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Empty state if search returns nothing */}
        {filteredAndSortedEntries.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No APMC Mandis Match Your Filter</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try broadening your distance radius or clearing the search query to compare all 6 major Maharashtra markets.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDistanceFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-agri-700 text-white text-xs font-semibold hover:bg-agri-800"
            >
              Show All Markets
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <MandiComparisonTable
            entries={filteredAndSortedEntries}
            quantityQuintals={quantity}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAndSortedEntries.map((entry) => (
              <MandiComparisonCard
                key={entry.mandiId}
                entry={entry}
                quantityQuintals={quantity}
                cropName={activeCrop.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

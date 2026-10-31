import React from 'react';
import {
  Wheat,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { MOCK_CROPS, FARMER_VILLAGES } from '../../../data/mockData';
import { formatQuintals } from '../../../utils/currency';

interface MandiFilterHeaderProps {
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  selectedVillageId: string;
  onSelectVillage: (villageId: string) => void;
  sortBy: 'net_earnings' | 'gross_price' | 'distance' | 'transport_cost';
  onSortChange: (sort: 'net_earnings' | 'gross_price' | 'distance' | 'transport_cost') => void;
  distanceFilter: 'all' | 'under50' | 'under150' | 'above150';
  onDistanceFilterChange: (f: 'all' | 'under50' | 'under150' | 'above150') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (v: 'cards' | 'table') => void;
}

export const MandiFilterHeader: React.FC<MandiFilterHeaderProps> = ({
  selectedCropId,
  onSelectCrop,
  quantity,
  onQuantityChange,
  selectedVillageId,
  onSelectVillage,
  sortBy,
  onSortChange,
  distanceFilter,
  onDistanceFilterChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-5">
      {/* Row 1: Crop Selection Buttons */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between mb-2">
          <span>1. Select Agricultural Produce</span>
          <span className="text-[11px] font-normal text-slate-500">
            Current: {MOCK_CROPS.find((c) => c.id === selectedCropId)?.name}
          </span>
        </label>

        <div className="flex flex-wrap gap-2">
          {MOCK_CROPS.map((crop) => {
            const isSelected = crop.id === selectedCropId;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => onSelectCrop(crop.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-agri-700 text-white shadow-sm ring-2 ring-agri-600 ring-offset-1'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{crop.icon}</span>
                <span>{crop.name}</span>
                <span className="text-[11px] opacity-80 hidden sm:inline">
                  ({crop.marathiName.split(' ')[0]})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Quantity & Village Origin Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        {/* Quantity available */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            2. Available Quantity for Sale (Quintals)
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full pl-3 pr-12 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600 focus:border-agri-600 text-sm font-bold text-slate-900"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                Qtl
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center space-x-1">
              {[25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onQuantityChange(preset)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    quantity === preset
                      ? 'bg-agri-100 text-agri-900 border border-agri-300 font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Equal to {(quantity * 100).toLocaleString('en-IN')} Kilograms ({(quantity * 0.1).toFixed(1)} Metric Tons)
          </span>
        </div>

        {/* Farmer Village Origin */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-agri-700" />
            <span>3. Farmgate Origin / Dispatch Village</span>
          </label>
          <select
            value={selectedVillageId}
            onChange={(e) => onSelectVillage(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600 focus:border-agri-600 text-sm font-semibold text-slate-900 bg-white"
          >
            {FARMER_VILLAGES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.marathiName}), Taluka {v.taluka}, Dist. {v.district}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Transit distances are dynamically mapped from this location.
          </span>
        </div>
      </div>

      {/* Row 3: Sort, Filters, Search & View Toggle */}
      <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search APMC (e.g. Pune, Lasalgaon)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Distance Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <span className="text-slate-500 px-2 text-[11px] font-semibold">Radius:</span>
            <button
              type="button"
              onClick={() => onDistanceFilterChange('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                distanceFilter === 'all'
                  ? 'bg-white text-agri-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onDistanceFilterChange('under50')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                distanceFilter === 'under50'
                  ? 'bg-white text-agri-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              &lt; 50 km
            </button>
            <button
              type="button"
              onClick={() => onDistanceFilterChange('under150')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                distanceFilter === 'under150'
                  ? 'bg-white text-agri-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              &lt; 150 km
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5">
            <ArrowUpDown className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-agri-600"
            >
              <option value="net_earnings">Sort: Highest Net Earnings 🏆</option>
              <option value="gross_price">Sort: Highest Quoted Price</option>
              <option value="distance">Sort: Shortest Distance</option>
              <option value="transport_cost">Sort: Lowest Transport Cost</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center border border-slate-200 rounded-xl overflow-hidden p-0.5 bg-slate-100">
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-agri-800 shadow-xs' : 'text-slate-500'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-agri-800 shadow-xs' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


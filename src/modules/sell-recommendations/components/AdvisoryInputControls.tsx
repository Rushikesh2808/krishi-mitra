import React from 'react';
import { MOCK_CROPS, MANDI_LIST, FARMER_VILLAGES } from '../../../data/mockData';
import { Store, Sliders, Calendar, Package, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AdvisoryInputControlsProps {
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
  selectedMandiId: string;
  onSelectMandi: (mandiId: string) => void;
  selectedVillageId: string;
  onSelectVillage: (villageId: string) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  holdingDays: number;
  onHoldingDaysChange: (days: number) => void;
  storageRate: number;
  onStorageRateChange: (rate: number) => void;
  spoilagePercent: number;
  onSpoilagePercentChange: (spoilage: number) => void;
}

export const AdvisoryInputControls: React.FC<AdvisoryInputControlsProps> = ({
  selectedCropId,
  onSelectCrop,
  selectedMandiId,
  onSelectMandi,
  selectedVillageId,
  onSelectVillage,
  quantity,
  onQuantityChange,
  holdingDays,
  onHoldingDaysChange,
  storageRate,
  onStorageRateChange,
  spoilagePercent,
  onSpoilagePercentChange,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-5">
      {/* 1. Crop Selector */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          1. Select Crop For Selling Advisory
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

      {/* 2. Primary Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
        {/* Quantity */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Quantity (Quintals)
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-agri-600"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-semibold">Qtl</span>
            </div>
            <div className="flex space-x-1">
              {[25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onQuantityChange(preset)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    quantity === preset
                      ? 'bg-agri-100 text-agri-900 border border-agri-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target APMC Mandi */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1 mb-1.5">
            <Store className="w-3.5 h-3.5 text-agri-700" />
            <span>Target APMC Mandi</span>
          </label>
          <select
            value={selectedMandiId}
            onChange={(e) => onSelectMandi(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-agri-600"
          >
            {MANDI_LIST.map((mandi) => (
              <option key={mandi.id} value={mandi.id}>
                {mandi.name} ({mandi.district} Dist.)
              </option>
            ))}
          </select>
        </div>

        {/* Evaluated Holding Days */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-agri-700" />
              <span>Holding Window</span>
            </label>
            <span className="text-xs font-black text-agri-700 bg-agri-50 px-2 py-0.5 rounded-md border border-agri-200">
              {holdingDays} Days Later
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {[3, 5, 7, 10].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => onHoldingDaysChange(days)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  holdingDays === days
                    ? 'bg-agri-800 text-white shadow-xs ring-1 ring-agri-600'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Storage & Spoilage Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-semibold text-agri-700 hover:text-agri-800 flex items-center space-x-1.5 cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide Advanced Storage & Spoilage Cost Inputs' : 'Adjust Storage Costs & Spoilage Parameters (Advanced)'}</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 bg-earth-50 rounded-xl border border-earth-200 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
            {/* Storage cost slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Daily Storage / Godown Rent</span>
                <span className="font-bold text-agri-800">₹{storageRate} / Qtl / Day</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={storageRate}
                onChange={(e) => onStorageRateChange(parseFloat(e.target.value))}
                className="w-full accent-agri-700 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Standard dry warehouse rate in Maharashtra: ₹2.5 to ₹4.0/Qtl/day
              </span>
            </div>

            {/* Spoilage / Weight loss percentage */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Estimated Spoilage / Moisture Loss</span>
                <span className={`font-bold ${spoilagePercent > 3 ? 'text-rose-700' : 'text-slate-800'}`}>
                  {spoilagePercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={spoilagePercent}
                onChange={(e) => onSpoilagePercentChange(parseFloat(e.target.value))}
                className="w-full accent-agri-700 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Onions can lose 3-5% weight; dry grain & soybean typically lose 0-1%.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


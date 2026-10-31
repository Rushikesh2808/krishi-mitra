import React from 'react';
import { MOCK_CROPS, MANDI_LIST } from '../../../data/mockData';
import { DetailedExpenseInputs } from '../../../utils/calculations';
import {
  RotateCcw,
  Sparkles,
  Store,
  Truck,
  Warehouse,
  Users,
  Coins,
  Package,
  Weight
} from 'lucide-react';

interface CalculatorInputFormProps {
  inputs: DetailedExpenseInputs;
  onInputChange: (field: keyof DetailedExpenseInputs, value: number | string) => void;
  onResetDefaults: () => void;
  onZeroExpenses: () => void;
}

export const CalculatorInputForm: React.FC<CalculatorInputFormProps> = ({
  inputs,
  onInputChange,
  onResetDefaults,
  onZeroExpenses,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-5">
      {/* Top Header with Reset Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">
            Calculator Input Parameters
          </h3>
          <p className="text-xs text-slate-500">
            Pre-filled with realistic APMC averages. Edit any value to match your actual expenses.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onResetDefaults}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-agri-50 hover:bg-agri-100 text-agri-800 text-xs font-semibold border border-agri-200 transition-colors cursor-pointer"
            title="Reload realistic defaults for selected mandi"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset APMC Defaults</span>
          </button>
        </div>
      </div>

      {/* 1. Crop & Market Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Crop Selection */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Select Agricultural Crop
          </label>
          <select
            value={inputs.cropId}
            onChange={(e) => onInputChange('cropId', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-agri-600"
          >
            {MOCK_CROPS.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.icon} {crop.name} ({crop.marathiName})
              </option>
            ))}
          </select>
        </div>

        {/* Mandi Selection */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1 mb-1.5">
            <Store className="w-3.5 h-3.5 text-agri-700" />
            <span>Target APMC Mandi</span>
          </label>
          <select
            value={inputs.mandiId}
            onChange={(e) => onInputChange('mandiId', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-agri-600"
          >
            {MANDI_LIST.map((mandi) => (
              <option key={mandi.id} value={mandi.id}>
                {mandi.name} ({mandi.district} Dist.)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Quantity & Selling Price Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        {/* Quantity (Quintals) */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Quantity Available (Quintals)
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="number"
                min="1"
                max="1000"
                value={inputs.quantityQuintals}
                onChange={(e) =>
                  onInputChange('quantityQuintals', Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-agri-600"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-semibold">Qtl</span>
            </div>
            <div className="flex space-x-1">
              {[25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onInputChange('quantityQuintals', preset)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    inputs.quantityQuintals === preset
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

        {/* Selling Price per Quintal */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Expected Selling Price (₹ / Qtl)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-sm text-slate-500 font-bold">₹</span>
            <input
              type="number"
              min="0"
              step="10"
              value={inputs.pricePerQuintal}
              onChange={(e) =>
                onInputChange('pricePerQuintal', Math.max(0, parseInt(e.target.value) || 0))
              }
              className="w-full pl-7 pr-12 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-agri-600"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400 font-semibold">/ Qtl</span>
          </div>
        </div>
      </div>

      {/* 3. Six Itemized Expense Fields */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Itemized Expense Deductions (₹)
          </label>
          <button
            type="button"
            onClick={onZeroExpenses}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
          >
            Clear all to ₹0
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 1. Transportation */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-blue-700" />
                <span>Transportation Freight</span>
              </span>
              <span className="text-[10px] text-slate-400">वाहतूक भाडे</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1.5 text-xs text-slate-500 font-bold">₹</span>
              <input
                type="number"
                min="0"
                value={inputs.transportCost}
                onChange={(e) =>
                  onInputChange('transportCost', Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full pl-6 pr-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-agri-600"
              />
            </div>
          </div>

          {/* 2. Loading & Unloading / Hamali */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center space-x-1">
                <Weight className="w-3.5 h-3.5 text-emerald-700" />
                <span>Loading & Hamali</span>
              </span>
              <span className="text-[10px] text-slate-400">हमाली / तोलाई</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1.5 text-xs text-slate-500 font-bold">₹</span>
              <input
                type="number"
                min="0"
                value={inputs.loadingUnloadingCost}
                onChange={(e) =>
                  onInputChange('loadingUnloadingCost', Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full pl-6 pr-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-agri-600"
              />
            </div>
          </div>

          {/* 3. Storage Expenses */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center space-x-1">
                <Warehouse className="w-3.5 h-3.5 text-purple-700" />
                <span>Storage / Godown Rent</span>
              </span>
              <span className="text-[10px] text-slate-400">गोदाम खर्च</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1.5 text-xs text-slate-500 font-bold">₹</span>
              <input
                type="number"
                min="0"
                value={inputs.storageCost}
                onChange={(e) =>
                  onInputChange('storageCost', Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full pl-6 pr-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-agri-600"
              />
            </div>
          </div>

          {/* 4. Labour Expenses */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-teal-700" />
                <span>Labour & Grading</span>
              </span>
              <span className="text-[10px] text-slate-400">मजुरी / प्रतवारी</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1.5 text-xs text-slate-500 font-bold">₹</span>
              <input
                type="number"
                min="0"
                value={inputs.labourCost}
                onChange={(e) =>
                  onInputChange('labourCost', Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full pl-6 pr-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-agri-600"
              />
            </div>
          </div>

          {/* 5. Market Fees / APMC Cess */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center space-x-1">
                <Coins className="w-3.5 h-3.5 text-amber-700" />
                <span>APMC Cess / Market Fee</span>
              </span>
              <span className="text-[10px] text-slate-400">सेस (1.05%)</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1.5 text-xs text-slate-500 font-bold">₹</span>
              <input
                type="number"
                min="0"
                value={inputs.marketFees}
                onChange={(e) =>
                  onInputChange('marketFees', Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full pl-6 pr-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-agri-600"
              />
            </div>
          </div>

          {/* 6. Miscellaneous / Bags */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center space-x-1">
                <Package className="w-3.5 h-3.5 text-slate-700" />
                <span>Gunny Bags & Misc</span>
              </span>
              <span className="text-[10px] text-slate-400">बारदान / इतर</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1.5 text-xs text-slate-500 font-bold">₹</span>
              <input
                type="number"
                min="0"
                value={inputs.miscellaneousCost}
                onChange={(e) =>
                  onInputChange('miscellaneousCost', Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full pl-6 pr-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-agri-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


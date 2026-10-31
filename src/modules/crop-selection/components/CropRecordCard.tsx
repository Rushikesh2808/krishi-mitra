import React from 'react';
import {
  Wheat,
  Calendar,
  Warehouse,
  MapPin,
  Sparkles,
  Store,
  ShieldCheck,
  Edit2,
  Trash2,
  PlusCircle,
  Clock,
  Layers,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { FarmerCropRecord } from '../../../types';

interface CropRecordCardProps {
  crop: FarmerCropRecord;
  onEdit: (crop: FarmerCropRecord) => void;
  onDelete: (id: string) => void;
  onListProduce: (crop: FarmerCropRecord) => void;
}

export const CropRecordCard: React.FC<CropRecordCardProps> = ({
  crop,
  onEdit,
  onDelete,
  onListProduce,
}) => {
  const {
    cropName,
    cropVariety,
    cultivationAreaAcres,
    sowingDate,
    expectedHarvestDate,
    expectedQuantityQuintals,
    actualHarvestedQuantity,
    availableQuantity,
    listedQuantity,
    committedQuantity,
    cropQuality,
    storageStatus,
    storageLocation,
    notes,
  } = crop;

  const total = actualHarvestedQuantity > 0 ? actualHarvestedQuantity : 1;
  const availablePct = Math.round((availableQuantity / total) * 100);
  const listedPct = Math.round((listedQuantity / total) * 100);
  const committedPct = Math.round((committedQuantity / total) * 100);

  // Quality badge color
  const getQualityBadge = () => {
    switch (cropQuality) {
      case 'Grade A (Export)':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Grade A (Commercial)':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Storage badge
  const getStorageBadge = () => {
    switch (storageStatus) {
      case 'Kanda Chawl':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Warehouse Pallets':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sold Out':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-agri-400 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-slate-900">{cropName}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getQualityBadge()}`}>
                {cropQuality}
              </span>
            </div>
            <p className="text-xs font-semibold text-agri-700">{cropVariety}</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              {cultivationAreaAcres} Acres
            </span>
          </div>
        </div>

        {/* Harvest & Sowing Timeline */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Sown: </span>
            <span className="font-semibold text-slate-800">{sowingDate || 'Not specified'}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Harvest: </span>
            <span className="font-semibold text-slate-800">{expectedHarvestDate || 'Recorded'}</span>
          </div>
        </div>
      </div>

      {/* Yield & Stock Breakdown */}
      <div className="p-5 space-y-4 flex-1">
        {/* Production Numbers */}
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Harvested Yield</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-900">{actualHarvestedQuantity}</span>
              <span className="text-xs font-medium text-slate-500">Qtl</span>
            </div>
            <span className="text-[10px] text-slate-400">Est: {expectedQuantityQuintals} Qtl</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-600">Available to Sell</span>
            <div className="flex items-baseline space-x-1">
              <span className={`text-2xl font-black ${availableQuantity > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                {availableQuantity}
              </span>
              <span className="text-xs font-medium text-slate-500">Qtl</span>
            </div>
            {availableQuantity === 0 ? (
              <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-500" /> 100% Allocated
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-emerald-600">Uncommitted stock</span>
            )}
          </div>
        </div>

        {/* Visual Multi-color Stock Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-600 font-medium">
            <span>Stock Status</span>
            <span>{actualHarvestedQuantity} Qtl Total</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            {availableQuantity > 0 && (
              <div
                style={{ width: `${availablePct}%` }}
                className="h-full bg-emerald-500 transition-all duration-300"
                title={`Available: ${availableQuantity} Qtl (${availablePct}%)`}
              />
            )}
            {listedQuantity > 0 && (
              <div
                style={{ width: `${listedPct}%` }}
                className="h-full bg-amber-400 transition-all duration-300"
                title={`Listed: ${listedQuantity} Qtl (${listedPct}%)`}
              />
            )}
            {committedQuantity > 0 && (
              <div
                style={{ width: `${committedPct}%` }}
                className="h-full bg-purple-500 transition-all duration-300"
                title={`Committed: ${committedQuantity} Qtl (${committedPct}%)`}
              />
            )}
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {availableQuantity} Qtl Free
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {listedQuantity} Qtl Listed
            </span>
            <span className="flex items-center gap-1 text-purple-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              {committedQuantity} Qtl Sold
            </span>
          </div>
        </div>

        {/* Storage Details */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
              <Warehouse className="w-3.5 h-3.5 text-slate-400" />
              Storage Facility:
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStorageBadge()}`}>
              {storageStatus}
            </span>
          </div>

          <div className="flex items-start gap-1 text-slate-600 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="truncate">{storageLocation}</span>
          </div>

          {notes && (
            <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60 line-clamp-2">
              "{notes}"
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => onEdit(crop)}
            className="p-2 text-slate-600 hover:text-agri-700 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 text-xs font-semibold flex items-center gap-1"
            title="Edit Crop Record"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(crop.id)}
            disabled={committedQuantity > 0}
            className={`p-2 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1 ${
              committedQuantity > 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100'
            }`}
            title={
              committedQuantity > 0
                ? 'Cannot delete: produce is committed to buyer/FPO agreements'
                : 'Delete Crop Record'
            }
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>

        {/* List Produce Button */}
        <button
          type="button"
          onClick={() => onListProduce(crop)}
          disabled={availableQuantity <= 0}
          className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
            availableQuantity <= 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-agri-700 hover:bg-agri-800 text-white shadow-agri-700/20 active:scale-95'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{availableQuantity > 0 ? 'List on Market' : 'Fully Listed'}</span>
        </button>
      </div>
    </div>
  );
};


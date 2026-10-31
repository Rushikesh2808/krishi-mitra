import React, { useState, useEffect } from 'react';
import {
  X,
  Wheat,
  Calendar,
  Warehouse,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Scale
} from 'lucide-react';
import { FarmerCropRecord } from '../../../types';

interface CropFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cropData: {
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
  }) => void;
  initialCrop?: FarmerCropRecord | null;
}

const COMMON_MAHARASHTRA_CROPS = [
  { name: 'Soybean', defaultVariety: 'JS-335 (Yellow Bold)', defaultYield: 15, defaultStorage: 'On-Farm Dry Shed' },
  { name: 'Red Onion', defaultVariety: 'Bhima Super (Garwa)', defaultYield: 32, defaultStorage: 'Kanda Chawl' },
  { name: 'Cotton', defaultVariety: 'BT Cotton II (RCH 659)', defaultYield: 14, defaultStorage: 'On-Farm Dry Shed' },
  { name: 'Wheat', defaultVariety: 'Lokwan Sharbati Bold', defaultYield: 20, defaultStorage: 'Warehouse Pallets' },
  { name: 'Gram / Chana', defaultVariety: 'Vijay Bold Pulses', defaultYield: 16, defaultStorage: 'Warehouse Pallets' },
  { name: 'Maize', defaultVariety: 'Hybrid Yellow Pioneer', defaultYield: 24, defaultStorage: 'On-Farm Dry Shed' },
  { name: 'Tur / Arhar', defaultVariety: 'BDN-711 White Arhar', defaultYield: 12, defaultStorage: 'Warehouse Pallets' },
];

export const CropFormModal: React.FC<CropFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCrop,
}) => {
  const isEditing = Boolean(initialCrop);

  // Form State
  const [cropName, setCropName] = useState('Soybean');
  const [cropVariety, setCropVariety] = useState('JS-335 (Yellow Bold)');
  const [cultivationAreaAcres, setCultivationAreaAcres] = useState<string>('3.0');
  const [sowingDate, setSowingDate] = useState<string>('2026-06-25');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState<string>('2026-10-20');
  const [expectedQuantityQuintals, setExpectedQuantityQuintals] = useState<string>('45');
  const [actualHarvestedQuantity, setActualHarvestedQuantity] = useState<string>('45');
  const [cropQuality, setCropQuality] = useState<'Grade A (Export)' | 'Grade A (Commercial)' | 'Grade B (FAQ)'>('Grade A (Export)');
  const [storageStatus, setStorageStatus] = useState<'On-Farm Dry Shed' | 'Warehouse Pallets' | 'Kanda Chawl' | 'Awaiting Storage' | 'Sold Out'>('On-Farm Dry Shed');
  const [storageLocation, setStorageLocation] = useState('Sukene Farmgate Shed, Niphad, Nashik');
  const [notes, setNotes] = useState('Tested moisture 9.2%, clean winnowed produce ready for pickup.');

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (initialCrop) {
      setCropName(initialCrop.cropName);
      setCropVariety(initialCrop.cropVariety);
      setCultivationAreaAcres(initialCrop.cultivationAreaAcres.toString());
      setSowingDate(initialCrop.sowingDate);
      setExpectedHarvestDate(initialCrop.expectedHarvestDate);
      setExpectedQuantityQuintals(initialCrop.expectedQuantityQuintals.toString());
      setActualHarvestedQuantity(initialCrop.actualHarvestedQuantity.toString());
      setCropQuality(initialCrop.cropQuality);
      setStorageStatus(initialCrop.storageStatus);
      setStorageLocation(initialCrop.storageLocation);
      setNotes(initialCrop.notes || '');
    } else {
      // Reset defaults
      setCropName('Soybean');
      setCropVariety('JS-335 (Yellow Bold)');
      setCultivationAreaAcres('3.0');
      setSowingDate('2026-06-25');
      setExpectedHarvestDate('2026-10-20');
      setExpectedQuantityQuintals('45');
      setActualHarvestedQuantity('45');
      setCropQuality('Grade A (Export)');
      setStorageStatus('On-Farm Dry Shed');
      setStorageLocation('Sukene Farmgate Shed, Niphad, Nashik');
      setNotes('Tested moisture 9.2%, clean winnowed produce ready for pickup.');
    }
    setValidationErrors([]);
  }, [initialCrop, isOpen]);

  if (!isOpen) return null;

  const handleCropPreset = (preset: typeof COMMON_MAHARASHTRA_CROPS[0]) => {
    setCropName(preset.name);
    setCropVariety(preset.defaultVariety);
    setStorageStatus(preset.defaultStorage as any);
    const acreage = parseFloat(cultivationAreaAcres) || 3.0;
    const est = Math.round(acreage * preset.defaultYield);
    setExpectedQuantityQuintals(est.toString());
    setActualHarvestedQuantity(est.toString());
  };

  const parsedHarvested = parseFloat(actualHarvestedQuantity) || 0;
  const parsedAcreage = parseFloat(cultivationAreaAcres) || 0;
  const existingListed = initialCrop?.listedQuantity || 0;
  const existingCommitted = initialCrop?.committedQuantity || 0;

  // Live preview available calculation
  const computedAvailable = Math.max(0, parsedHarvested - existingListed - existingCommitted);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!cropName.trim()) errors.push('Crop Name is required (पिकाचे नाव आवश्यक आहे).');
    if (!cropVariety.trim()) errors.push('Crop Variety is required (पिकाचा वाण आवश्यक आहे).');
    if (parsedAcreage <= 0) errors.push('Cultivation area must be greater than 0 acres (क्षेत्र ० पेक्षा जास्त असावे).');
    if (parsedHarvested < 0) errors.push('Harvested quantity cannot be negative (उत्पादन ऋण असू शकत नाही).');
    
    // Strict stock check when editing: cannot reduce harvested below committed + listed!
    if (isEditing && parsedHarvested < (existingListed + existingCommitted)) {
      errors.push(
        `Harvested quantity cannot be less than already allocated stock (${existingListed + existingCommitted} Qtl: ${existingListed} Qtl listed + ${existingCommitted} Qtl committed).`
      );
    }

    if (!storageLocation.trim()) errors.push('Storage location is required (साठा ठिकाण आवश्यक आहे).');

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    onSubmit({
      cropName: cropName.trim(),
      cropVariety: cropVariety.trim(),
      cultivationAreaAcres: parsedAcreage,
      sowingDate,
      expectedHarvestDate,
      expectedQuantityQuintals: parseFloat(expectedQuantityQuintals) || parsedHarvested,
      actualHarvestedQuantity: parsedHarvested,
      cropQuality,
      storageStatus,
      storageLocation: storageLocation.trim(),
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-agri-900 via-agri-800 to-agri-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isEditing ? 'Edit Crop Record & Inventory' : 'Add New Crop & Produce'}
              </h3>
              <p className="text-xs text-agri-100">
                {isEditing ? 'पीक माहिती आणि साठा अद्ययावत करा' : 'नवीन पीक लागवड व कापणी साठा नोंदणी'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Quick Select Presets (only on add) */}
          {!isEditing && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quick Select Common Maharashtra Cash Crop
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_MAHARASHTRA_CROPS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleCropPreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      cropName === preset.name
                        ? 'bg-agri-50 border-agri-600 text-agri-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Row 1: Crop Name & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Crop Name / पिकाचे नाव *
              </label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Soybean, Red Onion, Cotton"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Crop Variety / पिकाचा वाण *
              </label>
              <input
                type="text"
                value={cropVariety}
                onChange={(e) => setCropVariety(e.target.value)}
                placeholder="e.g. JS-335, Bhima Super, Lokwan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium"
                required
              />
            </div>
          </div>

          {/* Row 2: Cultivation Acreage & Quality Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cultivation Area (Acres) / क्षेत्र (एकर) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={cultivationAreaAcres}
                onChange={(e) => setCultivationAreaAcres(e.target.value)}
                placeholder="e.g. 3.5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Crop Quality / Grade (प्रत / दर्जा) *
              </label>
              <select
                value={cropQuality}
                onChange={(e) => setCropQuality(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium bg-white"
              >
                <option value="Grade A (Export)">Grade A (Export) - Premium Size & Low Moisture</option>
                <option value="Grade A (Commercial)">Grade A (Commercial) - Standard Market Quality</option>
                <option value="Grade B (FAQ)">Grade B (FAQ) - Fair Average Quality</option>
              </select>
            </div>
          </div>

          {/* Row 3: Sowing & Harvest Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Sowing Date / पेरणी तारीख
              </label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Harvest Date / कापणी / काढणी तारीख
              </label>
              <input
                type="date"
                value={expectedHarvestDate}
                onChange={(e) => setExpectedHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium"
              />
            </div>
          </div>

          {/* Row 4: Yield Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Production (Quintals)
              </label>
              <input
                type="number"
                min="0"
                value={expectedQuantityQuintals}
                onChange={(e) => setExpectedQuantityQuintals(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Actual Harvested Quantity (Quintals) *
              </label>
              <input
                type="number"
                min="0"
                value={actualHarvestedQuantity}
                onChange={(e) => setActualHarvestedQuantity(e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-bold text-slate-900"
                required
              />
            </div>
          </div>

          {/* Stock Calculation Preview Alert */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center space-x-2.5">
              <Scale className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Calculated Available Stock for Market: {computedAvailable} Qtl</p>
                <p className="text-[11px] text-emerald-700">
                  Equation: {parsedHarvested} Qtl Harvested - {existingListed} Qtl Listed - {existingCommitted} Qtl Committed
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-sm">
              {computedAvailable} Qtl
            </span>
          </div>

          {/* Row 5: Storage Status & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Storage Facility Status / साठवण प्रकार *
              </label>
              <select
                value={storageStatus}
                onChange={(e) => setStorageStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium bg-white"
              >
                <option value="On-Farm Dry Shed">On-Farm Dry Shed (शेतकऱ्याचे शेड)</option>
                <option value="Warehouse Pallets">Warehouse Pallets (गोदाम / पावती)</option>
                <option value="Kanda Chawl">Kanda Chawl (हवेशीर कांदा चाळ)</option>
                <option value="Awaiting Storage">Awaiting Storage (साठवणुकीच्या प्रतीक्षेत)</option>
                <option value="Sold Out">Sold Out (पूर्ण विक्री झालेली)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Storage Location / पत्ता *
              </label>
              <input
                type="text"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="e.g. Sukene Farmgate Shed, Niphad, Nashik"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium"
                required
              />
            </div>
          </div>

          {/* Row 6: Quality Remarks & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Produce Remarks / Quality Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Clean winnowed bold seed, moisture 9.2%, zero pest infestation..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-normal resize-none"
            />
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-800 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Please fix the following validation errors:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-rose-700 pl-1">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel / रद्द करा
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 active:scale-95 text-white text-xs font-bold shadow-md shadow-agri-700/20 transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Crop Changes' : 'Record Crop & Stock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


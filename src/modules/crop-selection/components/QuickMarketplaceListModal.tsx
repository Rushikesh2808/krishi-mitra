import React, { useState, useEffect } from 'react';
import {
  X,
  PackagePlus,
  Wheat,
  IndianRupee,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { formatINR } from '../../../utils/currency';
import { FarmerCropRecord } from '../../../types';
import { FarmerMarketplaceListing, addProduceListing } from '../../../data/marketplaceStore';
import { CURRENT_FARMER } from '../../../data/mockData';

interface QuickMarketplaceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: FarmerCropRecord | null;
  onSuccess: (message: string) => void;
}

export const QuickMarketplaceListModal: React.FC<QuickMarketplaceListModalProps> = ({
  isOpen,
  onClose,
  crop,
  onSuccess,
}) => {
  const [quantityInput, setQuantityInput] = useState<string>('');
  const [priceInput, setPriceInput] = useState<string>('');
  const [moistureInput, setMoistureInput] = useState<string>('9.5');
  const [description, setDescription] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (crop) {
      setQuantityInput(crop.availableQuantity.toString());
      // Default expected price based on crop
      let defaultPrice = 4850;
      if (crop.cropName.includes('Onion')) defaultPrice = 2450;
      else if (crop.cropName.includes('Cotton')) defaultPrice = 7100;
      else if (crop.cropName.includes('Wheat')) defaultPrice = 2950;
      else if (crop.cropName.includes('Gram') || crop.cropName.includes('Chana')) defaultPrice = 5550;
      setPriceInput(defaultPrice.toString());

      setDescription(
        `Grade A ${crop.cropVariety} stored at ${crop.storageLocation}. Cleaned and ready for pickup.`
      );
      setErrorMessage(null);
    }
  }, [crop, isOpen]);

  if (!isOpen || !crop) return null;

  const availableMax = crop.availableQuantity;
  const parsedQty = parseFloat(quantityInput) || 0;
  const parsedPrice = parseFloat(priceInput) || 0;
  const parsedMoisture = parseFloat(moistureInput) || 10;
  const isOverLimit = parsedQty > availableMax;
  const isInvalid = parsedQty <= 0 || isOverLimit || parsedPrice <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverLimit) {
      setErrorMessage(`Cannot list ${parsedQty} Qtl. Maximum available stock is ${availableMax} Qtl.`);
      return;
    }
    if (parsedQty <= 0) {
      setErrorMessage('Quantity must be greater than 0 Quintals.');
      return;
    }
    if (parsedPrice <= 0) {
      setErrorMessage('Please enter a valid expected price per quintal.');
      return;
    }

    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const codePrefix = crop.cropName.substring(0, 2).toUpperCase();

    const newListing: FarmerMarketplaceListing = {
      id: `list-${Date.now()}`,
      farmerId: crop.farmerId || CURRENT_FARMER.id,
      farmerName: `${CURRENT_FARMER.fullName} (You)`,
      farmerMobile: CURRENT_FARMER.mobile,
      village: crop.village || CURRENT_FARMER.village,
      taluka: CURRENT_FARMER.taluka || 'Niphad',
      district: crop.district || CURRENT_FARMER.district,
      cropName: crop.cropName,
      cropId: `crop-${crop.cropName.toLowerCase().replace(/\s+/g, '-')}`,
      variety: crop.cropVariety,
      quantityQuintals: parsedQty,
      expectedPricePerQuintal: parsedPrice,
      qualityGrade: crop.cropQuality as any,
      moisturePercentage: parsedMoisture,
      harvestDate: crop.expectedHarvestDate || new Date().toISOString().split('T')[0],
      description: description.trim(),
      status: 'Active / Open for Offers',
      batchCode: `LOT-${codePrefix}-NP-${randomSuffix}`,
      createdAt: 'Just now',
      isMyListing: true,
    };

    addProduceListing(newListing);
    onSuccess(
      `आपला ${parsedQty} Qtl ${crop.cropName} माल ₹${parsedPrice}/Qtl भावाने मार्केटप्लेसमध्ये थेट सूचीबद्ध झाला आहे!`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-agri-800 to-agri-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">List Produce on Marketplace</h3>
              <p className="text-xs text-agri-100">
                थेट खरेदीदार आणि FPO कडून सर्वोत्तम दर मिळवण्यासाठी नोंदणी
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

        {/* Selected Crop Meta Pill */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">{crop.cropName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">{crop.cropVariety}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {crop.cropQuality}
            </span>
          </div>
          <span className="font-semibold text-agri-700">
            Available: {availableMax} Qtl
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Stock Enforcement Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isOverLimit
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                {isOverLimit ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <div>
                  <p className="font-bold">
                    {isOverLimit
                      ? `Stock Exceeded! Available: ${availableMax} Qtl`
                      : `Available Unlisted Stock: ${availableMax} Qtl`}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Listing this produce will deduct {parsedQty || 0} Qtl from your available inventory.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuantityInput(availableMax.toString())}
                className="text-[11px] font-bold text-agri-700 underline hover:text-agri-800"
              >
                Max Stock
              </button>
            </div>
          </div>

          {/* Row: Quantity & Expected Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Listing Quantity (Quintals) *
              </label>
              <input
                type="number"
                min="1"
                max={availableMax}
                value={quantityInput}
                onChange={(e) => {
                  setQuantityInput(e.target.value);
                  setErrorMessage(null);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 ${
                  isOverLimit
                    ? 'border-rose-400 text-rose-700 bg-rose-50/50 focus:ring-rose-400'
                    : 'border-slate-300 text-slate-900 focus:ring-agri-500'
                }`}
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Up to {availableMax} Qtl available
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Price (₹/Quintal) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="500"
                  value={priceInput}
                  onChange={(e) => {
                    setPriceInput(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-agri-500"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Approx Total: {formatINR(parsedQty * parsedPrice)}
              </span>
            </div>
          </div>

          {/* Moisture & Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Moisture Content (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="5"
                max="25"
                value={moistureInput}
                onChange={(e) => setMoistureInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Storage Facility
              </label>
              <input
                type="text"
                disabled
                value={`${crop.storageStatus} (${crop.storageLocation})`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Produce Description & Delivery Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-agri-500 resize-none"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isInvalid}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center space-x-1.5 ${
                isInvalid
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-agri-700 hover:bg-agri-800 active:scale-95 shadow-agri-700/25'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Listing to Marketplace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


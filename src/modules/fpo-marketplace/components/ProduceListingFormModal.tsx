import React, { useState } from 'react';
import {
  X,
  PackagePlus,
  Wheat,
  IndianRupee,
  Calendar,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Scale
} from 'lucide-react';
import { formatINR } from '../../../utils/currency';
import { FarmerMarketplaceListing } from '../../../data/fpoBuyerMockData';
import { getCropRecords } from '../../../data/marketplaceStore';

interface ProduceListingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listing: {
    cropName: string;
    cropId: string;
    variety: string;
    quantityQuintals: number;
    expectedPricePerQuintal: number;
    qualityGrade: 'Grade A (Export)' | 'Grade A (Commercial)' | 'Grade B (FAQ)' | 'Fair Average';
    moisturePercentage: number;
    harvestDate: string;
    village: string;
    taluka: string;
    district: string;
    description: string;
  }) => void;
  farmerProfile?: {
    fullName: string;
    village: string;
    taluka: string;
    district: string;
  };
}

const COMMON_CROPS = [
  { id: 'crop-soybean', name: 'Soybean', variety: 'JS-335 (Yellow Bold)', typicalPrice: 4850 },
  { id: 'crop-onion', name: 'Red Onion (Kharif)', variety: 'Garwa Kharif Medium Bold', typicalPrice: 2420 },
  { id: 'crop-cotton', name: 'Cotton (Kapus)', variety: 'Medium Long Staple Bt', typicalPrice: 7080 },
  { id: 'crop-wheat', name: 'Wheat (Lokwan)', variety: 'Lokwan Sharbati Bold', typicalPrice: 2920 },
  { id: 'crop-gram', name: 'Gram / Chana', variety: 'Vijay Bold Pulses', typicalPrice: 5480 },
  { id: 'crop-maize', name: 'Maize (Makka)', variety: 'Hybrid Yellow', typicalPrice: 2200 },
];

export const ProduceListingFormModal: React.FC<ProduceListingFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  farmerProfile = {
    fullName: 'Ramesh Patil',
    village: 'Niphad',
    taluka: 'Niphad',
    district: 'Nashik',
  },
}) => {
  const [selectedCropId, setSelectedCropId] = useState('crop-soybean');
  const [cropName, setCropName] = useState('Soybean');
  const [variety, setVariety] = useState('JS-335 (Yellow Bold)');
  const [quantityInput, setQuantityInput] = useState<string>('50');
  const [priceInput, setPriceInput] = useState<string>('4880');
  const [qualityGrade, setQualityGrade] = useState<'Grade A (Export)' | 'Grade A (Commercial)' | 'Grade B (FAQ)'>('Grade A (Export)');
  const [moistureInput, setMoistureInput] = useState<string>('9.5');
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [village, setVillage] = useState(farmerProfile.village);
  const [taluka, setTaluka] = useState(farmerProfile.taluka);
  const [district, setDistrict] = useState(farmerProfile.district);
  const [description, setDescription] = useState(
    'Machine cleaned and winnowed. Stored in dry shed on wooden pallets. Moisture tested, ready for direct truck loading.'
  );

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSelectCrop = (crop: (typeof COMMON_CROPS)[0]) => {
    setSelectedCropId(crop.id);
    setCropName(crop.name);
    setVariety(crop.variety);
    setPriceInput(crop.typicalPrice.toString());
  };

  const qty = parseFloat(quantityInput) || 0;
  const price = parseFloat(priceInput) || 0;
  const moisture = parseFloat(moistureInput) || 10.0;
  const grossEstimatedValue = qty * price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!cropName.trim()) errors.push('Please enter or select a crop name.');
    if (qty <= 0 || isNaN(qty)) errors.push('Produce quantity must be greater than 0 Quintals.');
    if (price <= 0 || isNaN(price)) errors.push('Expected price must be a valid amount per Quintal.');
    if (!harvestDate) errors.push('Please select harvest date.');
    if (!village.trim() || !district.trim()) errors.push('Please provide your location (Village & District).');

    // Produce Inventory stock validation: Cannot list more than available stock
    const crops = getCropRecords();
    const matchingCrop = crops.find(
      (c) =>
        c.farmerId === 'farmer-mh-001' &&
        (c.cropName.toLowerCase().includes(cropName.toLowerCase()) ||
          cropName.toLowerCase().includes(c.cropName.toLowerCase()))
    );

    if (matchingCrop && qty > matchingCrop.availableQuantity) {
      errors.push(
        `उपलब्ध साठ्यापेक्षा जास्त नोंदणी करता येणार नाही (Cannot list ${qty} Qtl. Available unlisted stock in inventory for ${matchingCrop.cropName} is ${matchingCrop.availableQuantity} Qtl).`
      );
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    onSubmit({
      cropName,
      cropId: selectedCropId,
      variety,
      quantityQuintals: qty,
      expectedPricePerQuintal: price,
      qualityGrade,
      moisturePercentage: moisture,
      harvestDate: new Date(harvestDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      village,
      taluka,
      district,
      description,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-agri-800 to-agri-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <PackagePlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">शेतमाल विक्रीसाठी नोंदवा (Create Produce Listing)</h2>
              <p className="text-xs text-agri-200">
                List your harvest for direct bids from Maharashtra FPOs and verified institutional buyers.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-agri-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Validation Errors Box */}
          {validationErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1 text-xs">
              <div className="flex items-center space-x-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>कृपया खालील त्रुटी तपासा (Please resolve these errors):</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Select Common Crops */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              पिक निवडा (Select Crop)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMON_CROPS.map((crop) => (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => handleSelectCrop(crop)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                    selectedCropId === crop.id
                      ? 'border-agri-600 bg-agri-50 text-agri-950 font-bold ring-2 ring-agri-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{crop.name}</span>
                    {selectedCropId === crop.id && <CheckCircle2 className="w-3.5 h-3.5 text-agri-700" />}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">₹{crop.typicalPrice}/Qtl benchmark</span>
                </button>
              ))}
            </div>
          </div>

          {/* Crop Name & Variety Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                पिकाचे नाव (Crop Name) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Wheat className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g. Soybean, Red Onion"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                वाण / जात (Variety / Seed Type)
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. JS-335, Garwa Kharif, Vijay Bold"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
              />
            </div>
          </div>

          {/* Quantity & Expected Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                उपलब्ध प्रमाण (Available Quantity in Quintals) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value)}
                  placeholder="50"
                  className="w-full pl-3 pr-16 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white font-semibold"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">Quintals</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">1 Quintal = 100 Kilograms</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                अपेक्षित दर (Expected Price per Quintal) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  min="100"
                  step="10"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="4880"
                  className="w-full pl-9 pr-14 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white font-semibold"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">/ Qtl</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Set your desired baseline selling price</p>
            </div>
          </div>

          {/* Quality Grade & Moisture % */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                दर्जा / ग्रेड (Quality Grade)
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
              >
                <option value="Grade A (Export)">Grade A (Export Quality - Clean & Uniform)</option>
                <option value="Grade A (Commercial)">Grade A (Commercial Standard Market Grade)</option>
                <option value="Grade B (FAQ)">Grade B (Fair Average Quality / FAQ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ओलावा प्रमाण (Moisture % - Optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="35"
                  step="0.1"
                  value={moistureInput}
                  onChange={(e) => setMoistureInput(e.target.value)}
                  placeholder="9.2"
                  className="w-full pl-3 pr-8 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">%</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">&lt;10% moisture fetches higher buyer bids</p>
            </div>
          </div>

          {/* Harvest Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                कापणी / काढणी दिनांक (Harvest Date) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                शेतकऱ्याचे ठिकाण (Farmer Location) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={`${village}, ${taluka}, ${district}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    setVillage(parts[0]?.trim() || village);
                    if (parts[1]) setTaluka(parts[1]?.trim());
                    if (parts[2]) setDistrict(parts[2]?.trim());
                  }}
                  placeholder="Village, Taluka, District"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              अतिरिक्त तपशील / शेतातील स्थिती (Description & Storage Condition)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention packaging type (gunny bags/loose), moisture level, shed condition, or vehicle access roads..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
              />
            </div>
          </div>

          {/* Live Revenue Preview Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">अपेक्षित एकूण मूल्य (Expected Gross Value)</p>
                <p className="text-lg font-extrabold text-slate-900">
                  {formatINR(grossEstimatedValue)}
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <span>{qty} Quintals × ₹{price}/Qtl</span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              रद्द करा (Cancel)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-2"
            >
              <PackagePlus className="w-4 h-4" />
              <span>शेतमाल मार्केटप्लेसमध्ये नोंदवा (Publish Listing)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


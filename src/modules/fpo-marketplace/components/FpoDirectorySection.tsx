import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Award,
  ShieldCheck,
  CheckCircle2,
  Wheat,
  Layers,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { FpoOrganization } from '../../../data/fpoBuyerMockData';

interface FpoDirectorySectionProps {
  fpos: FpoOrganization[];
  onSelectFpoToContact?: (fpo: FpoOrganization) => void;
}

const CROP_FILTER_OPTIONS = ['All', 'Soybean', 'Red Onion', 'Wheat', 'Gram / Chana', 'Cotton'];
const LOCATION_FILTER_OPTIONS = ['All', 'Nashik', 'Niphad', 'Dindori', 'Sinnar'];

export const FpoDirectorySection: React.FC<FpoDirectorySectionProps> = ({
  fpos,
  onSelectFpoToContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [contactModalFpo, setContactModalFpo] = useState<FpoOrganization | null>(null);

  const filteredFpos = useMemo(() => {
    return fpos.filter((fpo) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        fpo.name.toLowerCase().includes(q) ||
        fpo.marathiName.toLowerCase().includes(q) ||
        fpo.location.toLowerCase().includes(q) ||
        fpo.district.toLowerCase().includes(q) ||
        fpo.taluka.toLowerCase().includes(q) ||
        fpo.cropsHandled.some((c) => c.toLowerCase().includes(q));

      // Crop
      const matchesCrop =
        selectedCrop === 'All' ||
        fpo.cropsHandled.some((c) => c.toLowerCase().includes(selectedCrop.toLowerCase()));

      // Location
      const matchesLocation =
        selectedLocation === 'All' ||
        fpo.district.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        fpo.taluka.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        fpo.location.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesCrop && matchesLocation;
    });
  }, [fpos, searchQuery, selectedCrop, selectedLocation]);

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <span>शेतकरी उत्पादक कंपन्यांची यादी (FPO Directory)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Discover verified Maharashtra Farmer Producer Companies (FPOs) for aggregation, collective marketing, and zero-APMC cess direct sales.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
            {filteredFpos.length} FPOs Found
          </span>
        </div>

        {/* Search & Location Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FPO name, location (e.g. Niphad, Dindori), or crop..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
            />
          </div>

          {/* District / Location Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
            >
              {LOCATION_FILTER_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'सर्व तालुके/जिल्हे (All Locations)' : `${loc} Region`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Crop Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-medium flex items-center space-x-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" />
            <span>पिकानुसार फिल्टर (Crop):</span>
          </span>
          {CROP_FILTER_OPTIONS.map((crop) => (
            <button
              key={crop}
              type="button"
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer ${
                selectedCrop === crop
                  ? 'bg-agri-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {crop === 'All' ? 'सर्व पिके (All Crops)' : crop}
            </button>
          ))}
        </div>
      </div>

      {/* FPO Cards Grid */}
      {filteredFpos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800">कोणतीही FPO सापडली नाही (No FPOs Found)</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or switching crop and location filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCrop('All');
              setSelectedLocation('All');
            }}
            className="px-4 py-2 rounded-xl bg-agri-700 text-white text-xs font-semibold hover:bg-agri-800 transition-colors"
          >
            सर्व फिल्टर साफ करा (Reset Filters)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFpos.map((fpo) => (
            <div
              key={fpo.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                      {fpo.procurementStatus}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {fpo.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{fpo.marathiName}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                      <span>★ {fpo.rating}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">Est. {fpo.establishedYear}</span>
                  </div>
                </div>

                {/* Location & Registration */}
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{fpo.location}</span>
                </div>

                {/* Crops Handled */}
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    हाताळली जाणारी पिके (Crops Handled):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {fpo.cropsHandled.map((crop) => (
                      <span
                        key={crop}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/70"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Min Quantity & Members Summary Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">किमान खरेदी (Min Acceptance):</span>
                    <span className="font-bold text-slate-900">
                      {fpo.minQuantityQuintals} Quintals
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">सभासद संख्या (Members):</span>
                    <span className="font-bold text-emerald-700">
                      {fpo.activeMemberCount.toLocaleString('en-IN')}+ Farmers
                    </span>
                  </div>
                </div>

                {/* Bulk Opportunity Box */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>सध्या चालू असलेली मोठी खरेदी (Bulk Opportunity):</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {fpo.bulkSellingOpportunities}
                  </p>
                </div>

                {/* Special Benefits Pills */}
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    शेतकऱ्यांसाठी फायदे (FPO Benefits):
                  </span>
                  <ul className="space-y-1">
                    {fpo.specialBenefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer with Contact Information & Action */}
              <div className="p-4 bg-earth-50 border-t border-earth-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-500 block text-[11px]">संपर्क अधिकारी (Contact Person):</span>
                  <span className="font-bold text-slate-900">{fpo.contactPerson}</span>{' '}
                  <span className="text-slate-500 text-[11px]">({fpo.designation})</span>
                  <div className="font-mono text-agri-800 font-semibold">{fpo.contactNumber}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setContactModalFpo(fpo)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>FPO शी संपर्क करा (Inquire)</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulated Contact Modal */}
      {contactModalFpo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">FPO संपर्क केंद्र (FPO Contact)</h3>
                  <p className="text-xs text-slate-500">{contactModalFpo.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContactModalFpo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Procurement Lead:</span>
                  <span className="font-semibold">{contactModalFpo.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile / Helpline:</span>
                  <a
                    href={`tel:${contactModalFpo.contactNumber.replace(/\s+/g, '')}`}
                    className="font-bold text-agri-800 underline font-mono"
                  >
                    {contactModalFpo.contactNumber}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Official Email:</span>
                  <span className="font-mono">{contactModalFpo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hub Location:</span>
                  <span>{contactModalFpo.location}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>प्रमाणित FPO हमी (Verified Assurance):</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Zero commission, transparent e-weighing, and direct RTGS payment guarantee through NABARD/SFAC cooperative framework.
                </p>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setContactModalFpo(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                बंद करा (Close)
              </button>
              <a
                href={`tel:${contactModalFpo.contactNumber.replace(/\s+/g, '')}`}
                className="flex-1 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold text-center flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>कॉल करा (Call Now)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


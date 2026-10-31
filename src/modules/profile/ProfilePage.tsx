import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/types';
import { UserRole } from '../../types';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import {
  User,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Building2,
  Wheat,
  Edit3,
  Check,
  X,
  CheckCircle2,
  Layers,
  Sparkles,
  FileText,
  Calendar,
  CreditCard,
  Briefcase,
  Globe
} from 'lucide-react';

const ALL_CROPS = ['Soybean', 'Red Onion', 'Cotton', 'Wheat', 'Gram / Chana', 'Maize', 'Tomato'];

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile, switchRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Form states initialized from currentUser
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Farmer specific
  const [village, setVillage] = useState(currentUser?.village || '');
  const [taluka, setTaluka] = useState(currentUser?.taluka || '');
  const [district, setDistrict] = useState(currentUser?.district || '');
  const [state, setState] = useState(currentUser?.state || 'Maharashtra');
  const [landAcreage, setLandAcreage] = useState<number>(currentUser?.landAcreage || 6.5);
  const [storageType, setStorageType] = useState(currentUser?.storageType || 'Ventilated Dry Shed');
  const [preferredLanguage, setPreferredLanguage] = useState<'Marathi' | 'English' | 'Hindi'>(
    currentUser?.preferredLanguage || 'Marathi'
  );
  const [preferredCrops, setPreferredCrops] = useState<string[]>(
    currentUser?.preferredCrops || ['Soybean', 'Red Onion', 'Wheat']
  );

  // FPO specific
  const [organizationName, setOrganizationName] = useState(currentUser?.organizationName || '');
  const [authorizedPerson, setAuthorizedPerson] = useState(currentUser?.authorizedPerson || '');
  const [designation, setDesignation] = useState(currentUser?.designation || '');
  const [registrationNumber, setRegistrationNumber] = useState(currentUser?.registrationNumber || '');
  const [operatingLocation, setOperatingLocation] = useState(currentUser?.operatingLocation || '');

  // Buyer specific
  const [businessName, setBusinessName] = useState(currentUser?.businessName || '');
  const [contactPerson, setContactPerson] = useState(currentUser?.contactPerson || '');
  const [buyerType, setBuyerType] = useState(currentUser?.buyerType || 'Agri-Processor');
  const [gstNumber, setGstNumber] = useState(currentUser?.gstNumber || '');
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState(
    currentUser?.defaultPaymentTerms || 'Immediate RTGS within 24 hours of weighbridge receipt'
  );

  // Re-sync whenever currentUser or role changes
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setMobile(currentUser.mobile || '');
      setEmail(currentUser.email || '');

      setVillage(currentUser.village || 'Niphad');
      setTaluka(currentUser.taluka || 'Niphad');
      setDistrict(currentUser.district || 'Nashik');
      setState(currentUser.state || 'Maharashtra');
      setLandAcreage(currentUser.landAcreage || 6.5);
      setStorageType(currentUser.storageType || 'Ventilated Dry Shed');
      setPreferredLanguage(currentUser.preferredLanguage || 'Marathi');
      setPreferredCrops(currentUser.preferredCrops || ['Soybean', 'Red Onion', 'Wheat']);

      setOrganizationName(currentUser.organizationName || 'Sahyadri Farmers Producer Co. Ltd.');
      setAuthorizedPerson(currentUser.authorizedPerson || currentUser.fullName || '');
      setDesignation(currentUser.designation || 'Managing Director');
      setRegistrationNumber(currentUser.registrationNumber || 'CIN-U01403MH2011PTC212345');
      setOperatingLocation(currentUser.operatingLocation || 'Mohadi, Dindori Road, Nashik');

      setBusinessName(currentUser.businessName || 'Khandesh Agro-Processing & Exports Pvt Ltd');
      setContactPerson(currentUser.contactPerson || currentUser.fullName || '');
      setBuyerType(currentUser.buyerType || 'Agri-Processor');
      setGstNumber(currentUser.gstNumber || '27AABCK1234F1Z8');
      setDefaultPaymentTerms(currentUser.defaultPaymentTerms || 'Immediate RTGS within 24 hours of weighbridge receipt');
    }
    setIsEditing(false);
  }, [currentUser?.role, currentUser?.id]);

  const toggleCrop = (crop: string) => {
    setPreferredCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const targetLang: Language =
      preferredLanguage === 'Marathi' ? 'mr' : preferredLanguage === 'Hindi' ? 'hi' : 'en';
    setLanguage(targetLang);

    if (currentUser?.role === 'FARMER') {
      updateProfile({
        fullName,
        mobile,
        email,
        village,
        taluka,
        district,
        state,
        landAcreage,
        storageType,
        preferredLanguage,
        preferredCrops,
      });
    } else if (currentUser?.role === 'FPO') {
      updateProfile({
        fullName,
        organizationName,
        authorizedPerson,
        designation,
        mobile,
        email,
        registrationNumber,
        operatingLocation,
      });
    } else if (currentUser?.role === 'BUYER') {
      updateProfile({
        fullName,
        businessName,
        contactPerson,
        buyerType,
        mobile,
        email,
        operatingLocation,
        gstNumber,
        defaultPaymentTerms,
      });
    }

    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const roleTitle =
    currentUser?.role === 'FPO'
      ? 'FPO संस्था माहिती (Organization Profile)'
      : currentUser?.role === 'BUYER'
      ? 'खरेदीदार कंपनी माहिती (Commercial Buyer Profile)'
      : 'शेतकरी नोंदणी व वैयक्तिक माहिती (Farmer Profile)';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-emerald-700 flex items-center space-x-2 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">प्रोफाइल माहिती यशस्वीरित्या जतन केली (Profile Updated)!</span>
        </div>
      )}

      {/* Header and Role Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-800 mb-1">
            <span>सध्याची भूमिका: {currentUser?.role}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{roleTitle}</h1>
          <p className="text-xs text-slate-500">
            View and manage your registered account details, operational locations, and market preferences.
          </p>
        </div>

        {/* Edit Toggle Button */}
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center space-x-2 transition-all self-start sm:self-auto cursor-pointer ${
            isEditing
              ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              : 'bg-agri-700 hover:bg-agri-800 text-white shadow-md'
          }`}
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
              <span>रद्द करा (Cancel)</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>प्रोफाइल संपादित करा (Edit Profile)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Profile Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Profile Card Header Banner */}
        <div className="bg-gradient-to-r from-agri-800 via-agri-900 to-slate-900 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-agri-800 flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-300 shrink-0">
              {currentUser?.fullName?.substring(0, 2).toUpperCase() || 'KM'}
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {currentUser?.role === 'FPO'
                  ? currentUser?.organizationName || 'Sahyadri Farmers Producer Co.'
                  : currentUser?.role === 'BUYER'
                  ? currentUser?.businessName || 'Khandesh Agro-Processing'
                  : currentUser?.fullName || 'Ramesh Patil'}
              </h2>
              <p className="text-xs text-agri-200 flex items-center space-x-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {currentUser?.role === 'FPO'
                    ? 'Verified FPO (SFAC / NABARD)'
                    : currentUser?.role === 'BUYER'
                    ? 'Verified Commercial Buyer (GST Compliant)'
                    : 'प्रमाणित शेतकरी सभासद (Verified Farmer)'}
                </span>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-agri-200">
            <span className="block font-mono font-bold text-white text-sm">
              +91 {currentUser?.mobile}
            </span>
            <span>{currentUser?.district || currentUser?.operatingLocation || 'Nashik, Maharashtra'}</span>
          </div>
        </div>

        {/* Profile Details & Edit Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* ============================================================ */}
          {/* ROLE 1: FARMER PROFILE FIELDS */}
          {/* ============================================================ */}
          {currentUser?.role === 'FARMER' && (
            <div className="space-y-5">
              <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                <Wheat className="w-4 h-4 text-agri-700" />
                <span>शेतकरी वैयक्तिक व शेतजमीन तपशील (Farmer Personal & Land Details)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">पूर्ण नाव (Full Name):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-sm">{fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">मोबाईल नंबर (Mobile Number):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white font-mono"
                      required
                    />
                  ) : (
                    <p className="font-bold text-slate-900 font-mono text-sm">+91 {mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">गाव (Village):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">{village}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">तालुका व जिल्हा (Taluka & District):</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={taluka}
                        onChange={(e) => setTaluka(e.target.value)}
                        placeholder="Taluka"
                        className="px-3 py-2 border rounded-xl font-semibold bg-white"
                        required
                      />
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="District"
                        className="px-3 py-2 border rounded-xl font-semibold bg-white"
                        required
                      />
                    </div>
                  ) : (
                    <p className="font-semibold text-slate-800">{taluka}, {district}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">राज्य (State):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">{state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">शेतजमीन क्षेत्र (Landholding Acreage):</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.5"
                      value={landAcreage}
                      onChange={(e) => setLandAcreage(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                    />
                  ) : (
                    <p className="font-bold text-slate-900">{landAcreage} Acres</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">साठवणूक व्यवस्था (Storage Facility):</label>
                  {isEditing ? (
                    <select
                      value={storageType}
                      onChange={(e) => setStorageType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                    >
                      <option value="Ventilated Dry Shed">Ventilated Dry Shed (हवेशीर शेड)</option>
                      <option value="Warehouse Pallets">Warehouse with Pallets (गोदाम)</option>
                      <option value="On-Farm Chawl (Kanda Chawl)">On-Farm Chawl (कांदा चाळ)</option>
                      <option value="Moisture Proof Silo">Moisture Proof Silo</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-slate-800">{storageType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">संभाषण भाषा (Language Preference):</label>
                  {isEditing ? (
                    <select
                      value={preferredLanguage}
                      onChange={(e) => {
                        const val = e.target.value as 'Marathi' | 'English' | 'Hindi';
                        setPreferredLanguage(val);
                        const targetLang: Language =
                          val === 'Marathi' ? 'mr' : val === 'Hindi' ? 'hi' : 'en';
                        setLanguage(targetLang);
                      }}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                    >
                      <option value="Marathi">मराठी (Marathi)</option>
                      <option value="English">English</option>
                      <option value="Hindi">हिंदी (Hindi)</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-slate-800">{preferredLanguage}</p>
                  )}
                </div>
              </div>

              {/* Preferred Crops Selector */}
              <div className="pt-2">
                <label className="block text-slate-700 font-bold mb-2 text-xs">
                  प्राधान्य पिके (Preferred Crops for Market Alerts):
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CROPS.map((crop) => {
                    const isSelected = preferredCrops.includes(crop);
                    return isEditing ? (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => toggleCrop(crop)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-agri-800 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {crop} {isSelected && '✓'}
                      </button>
                    ) : (
                      isSelected && (
                        <span
                          key={crop}
                          className="px-3 py-1 rounded-xl bg-agri-50 text-agri-900 border border-agri-300 text-xs font-bold"
                        >
                          {crop}
                        </span>
                      )
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ROLE 2: FPO PROFILE FIELDS */}
          {/* ============================================================ */}
          {currentUser?.role === 'FPO' && (
            <div className="space-y-5">
              <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>शेतकरी उत्पादक संस्था तपशील (FPO Organization Profile)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">संस्थेचे नाव (Organization Name):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-sm">{organizationName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">अधिकृत संपर्क व्यक्ती (Authorized Person):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={authorizedPerson}
                      onChange={(e) => setAuthorizedPerson(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">{authorizedPerson}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">पद / हुद्दा (Designation):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">{designation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">नोंदणी क्रमांक / CIN Number:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white font-mono"
                      required
                    />
                  ) : (
                    <p className="font-mono font-bold text-slate-900">{registrationNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">मोबाईल नंबर (Official Helpline):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white font-mono"
                      required
                    />
                  ) : (
                    <p className="font-mono font-bold text-slate-900">+91 {mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">अधिकृत ईमेल (Official Email):</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white font-mono"
                      required
                    />
                  ) : (
                    <p className="font-mono text-slate-800">{email}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">कार्यक्षेत्र व हब पत्ता (Operating Hub Location):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={operatingLocation}
                      onChange={(e) => setOperatingLocation(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">{operatingLocation}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ROLE 3: BUYER PROFILE FIELDS */}
          {/* ============================================================ */}
          {currentUser?.role === 'BUYER' && (
            <div className="space-y-5">
              <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-blue-700" />
                <span>खरेदीदार कंपनी तपशील (Commercial Buyer & Mill Profile)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">कंपनी / मिल नाव (Business Name):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-sm">{businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">खरेदीदार प्रकार (Buyer Type):</label>
                  {isEditing ? (
                    <select
                      value={buyerType}
                      onChange={(e) => setBuyerType(e.target.value as any)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                    >
                      <option value="Agri-Processor">Agri-Processor (प्रक्रिया उद्योग / ऑइल मिल)</option>
                      <option value="Exporter">Exporter (निर्यातदार)</option>
                      <option value="Retail Chain">Retail Chain / Aggregator</option>
                      <option value="Bulk Wholesaler">Bulk Wholesaler</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-slate-800">{buyerType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">खरेदी प्रतिनिधी (Contact Person):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">{contactPerson}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">जीएसटी नंबर (GSTIN):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white font-mono"
                      required
                    />
                  ) : (
                    <p className="font-mono font-bold text-slate-900">{gstNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">मोबाईल नंबर (Contact Mobile):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white font-mono"
                      required
                    />
                  ) : (
                    <p className="font-mono font-bold text-slate-900">+91 {mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">कंपनी ईमेल (Business Email):</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white font-mono"
                      required
                    />
                  ) : (
                    <p className="font-mono text-slate-800">{email}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">प्रक्रिया युनिट / पत्ता (Facility Location):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={operatingLocation}
                      onChange={(e) => setOperatingLocation(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">{operatingLocation}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">पेमेंट अटी (Default Payment Terms):</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={defaultPaymentTerms}
                      onChange={(e) => setDefaultPaymentTerms(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
                      required
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">{defaultPaymentTerms}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions (when editing) */}
          {isEditing && (
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
              >
                रद्द करा (Cancel)
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>माहिती जतन करा (Save Changes)</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Multilingual Selector Card for all Roles */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('common.language')} / भाषा निवडा (Language Setting)
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'mr'
                ? 'कृषिमित्र इंटरफेससाठी तुमची प्राधान्य भाषा निवडा. ही सेटिंग लगेच लागू होते.'
                : language === 'hi'
                ? 'कृषिमित्र इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें। यह तुरंत लागू होती है।'
                : 'Select your preferred language across KrishiMitra. Changes take effect immediately.'}
            </p>
          </div>
        </div>
        <LanguageSelector variant="cards" />
      </div>

      {/* Evaluator Quick Role Switcher Pill Bar */}
      <div className="p-4 rounded-2xl bg-earth-100 border border-earth-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-900 block">भूमिका बदल चाचणी (Demo Role Switcher):</span>
          <span className="text-slate-600 text-[11px]">
            Switch between Farmer, FPO, and Buyer to test different profile models and permissions.
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {(['FARMER', 'FPO', 'BUYER'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => switchRole(r)}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                currentUser?.role === r
                  ? 'bg-agri-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

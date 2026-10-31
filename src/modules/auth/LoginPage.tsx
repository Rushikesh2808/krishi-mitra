import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole, UserAccount } from '../../types';
import {
  Wheat,
  Users,
  Building2,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Phone,
  MapPin,
  Mail,
  Briefcase
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemo, login, register, isAuthenticated, currentUser } = useAuth();

  const [activeRole, setActiveRole] = useState<UserRole>('FARMER');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Farmer registration fields
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState('Niphad');
  const [district, setDistrict] = useState('Nashik');
  const [state, setState] = useState('Maharashtra');
  const [preferredCrops, setPreferredCrops] = useState<string[]>(['Soybean', 'Red Onion']);

  // FPO registration fields
  const [orgName, setOrgName] = useState('');
  const [authorizedPerson, setAuthorizedPerson] = useState('');
  const [fpoEmail, setFpoEmail] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [fpoLocation, setFpoLocation] = useState('Nashik & Dindori');

  // Buyer registration fields
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerType, setBuyerType] = useState<'Agri-Processor' | 'Bulk Wholesaler' | 'Exporter' | 'Retail Chain'>('Agri-Processor');
  const [buyerLocation, setBuyerLocation] = useState('Jalgaon / Nashik');

  const redirectByRole = (role: UserRole) => {
    if (role === 'FARMER') navigate('/');
    else if (role === 'FPO') navigate('/fpo');
    else if (role === 'BUYER') navigate('/buyer');
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAsDemo(role);
    redirectByRole(role);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = login(mobileNumber, password, activeRole);
    if (res.success) {
      redirectByRole(activeRole);
    } else {
      setErrorMessage(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (activeRole === 'FARMER') {
      if (!farmerName) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      const newFarmer: UserAccount = {
        id: `farmer-${Date.now()}`,
        role: 'FARMER',
        fullName: farmerName,
        mobile: mobileNumber,
        village,
        taluka: village,
        district,
        state,
        preferredCrops,
      };
      register(newFarmer);
      redirectByRole('FARMER');
    } else if (activeRole === 'FPO') {
      if (!orgName || !authorizedPerson) {
        setErrorMessage('Please enter Organization Name and Authorized Person.');
        return;
      }
      const newFpo: UserAccount = {
        id: `fpo-${Date.now()}`,
        role: 'FPO',
        fullName: authorizedPerson,
        organizationName: orgName,
        authorizedPerson,
        mobile: mobileNumber,
        email: fpoEmail,
        registrationNumber: regNumber || 'MH/NSK/FPO/2026/DEMO',
        operatingLocation: fpoLocation,
      };
      register(newFpo);
      redirectByRole('FPO');
    } else if (activeRole === 'BUYER') {
      if (!businessName || !contactPerson) {
        setErrorMessage('Please enter Business Name and Contact Person.');
        return;
      }
      const newBuyer: UserAccount = {
        id: `buyer-${Date.now()}`,
        role: 'BUYER',
        fullName: contactPerson,
        businessName,
        contactPerson,
        mobile: mobileNumber,
        email: buyerEmail,
        buyerType,
        operatingLocation: buyerLocation,
      };
      register(newBuyer);
      redirectByRole('BUYER');
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-agri-700 text-white shadow-md mb-3">
          <Wheat className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          KrishiMitra • कृषीमित्र
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          AI Agricultural Market & Net-Earning Ecosystem • Maharashtra
        </p>

        {/* Challenge pill */}
        <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Seva First Innovation Challenge 2026</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-6 px-4 shadow-xl rounded-2xl border border-slate-200 sm:px-8 space-y-6">
          {/* STEP 1: Account Type Selector (3 Prominent Role Cards) */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 text-center">
              Select Your Role / तुमची भूमिका निवडा
            </label>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Farmer Role */}
              <button
                type="button"
                onClick={() => {
                  setActiveRole('FARMER');
                  setErrorMessage(null);
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  activeRole === 'FARMER'
                    ? 'bg-agri-50 border-agri-600 ring-2 ring-agri-600 shadow-sm text-agri-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                  activeRole === 'FARMER' ? 'bg-agri-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Wheat className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xs sm:text-sm block">Farmer</span>
                <span className="text-[10px] text-slate-400 block">शेतकरी</span>
              </button>

              {/* FPO Role */}
              <button
                type="button"
                onClick={() => {
                  setActiveRole('FPO');
                  setErrorMessage(null);
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  activeRole === 'FPO'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600 shadow-sm text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                  activeRole === 'FPO' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xs sm:text-sm block">FPO</span>
                <span className="text-[10px] text-slate-400 block">उत्पादक संस्था</span>
              </button>

              {/* Buyer Role */}
              <button
                type="button"
                onClick={() => {
                  setActiveRole('BUYER');
                  setErrorMessage(null);
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  activeRole === 'BUYER'
                    ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600 shadow-sm text-blue-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                  activeRole === 'BUYER' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xs sm:text-sm block">Buyer</span>
                <span className="text-[10px] text-slate-400 block">खरेदीदार</span>
              </button>
            </div>
          </div>

          {/* Quick Evaluator 1-Click Demo Login Banner */}
          <div className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center space-x-1">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>Evaluator Instant Demo Access:</span>
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                1-Click No Password
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('FARMER')}
                className="py-1.5 px-2 rounded-lg bg-agri-700 hover:bg-agri-800 text-white font-bold transition-all text-center cursor-pointer shadow-xs"
              >
                Demo Farmer
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('FPO')}
                className="py-1.5 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all text-center cursor-pointer shadow-xs"
              >
                Demo FPO
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('BUYER')}
                className="py-1.5 px-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold transition-all text-center cursor-pointer shadow-xs"
              >
                Demo Buyer
              </button>
            </div>
          </div>

          {/* Toggle Login vs Register */}
          <div className="flex items-center justify-center space-x-4 border-b border-slate-100 pb-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMessage(null);
              }}
              className={`pb-1 border-b-2 cursor-pointer transition-colors ${
                !isRegisterMode
                  ? 'border-agri-700 text-agri-800'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Login to {activeRole} Account
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMessage(null);
              }}
              className={`pb-1 border-b-2 cursor-pointer transition-colors ${
                isRegisterMode
                  ? 'border-agri-700 text-agri-800'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Register New {activeRole}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Content */}
          {!isRegisterMode ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9822045678"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                  <span>Prototype demo accepts any password</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Login as {activeRole}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTRATION FORM (Role Specific Fields) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Common Mobile */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Mobile Number (10 Digits) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9822011223"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600 font-semibold"
                />
              </div>

              {/* FARMER REGISTRATION */}
              {activeRole === 'FARMER' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Full Name (शेतकऱ्याचे पूर्ण नाव) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Santosh Gaikwad"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Village / गाव
                      </label>
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        District / जिल्हा
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Preferred Crops
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Soybean', 'Red Onion', 'Cotton', 'Wheat', 'Gram'].map((c) => {
                        const hasCrop = preferredCrops.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              if (hasCrop) setPreferredCrops(preferredCrops.filter((x) => x !== c));
                              else setPreferredCrops([...preferredCrops, c]);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                              hasCrop
                                ? 'bg-agri-100 text-agri-900 border border-agri-300 font-bold'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {c} {hasCrop && '✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* FPO REGISTRATION */}
              {activeRole === 'FPO' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      FPO Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Godavari Valley Farmers Producer Co. Ltd."
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Authorized Representative / MD *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Deshmukh"
                      value={authorizedPerson}
                      onChange={(e) => setAuthorizedPerson(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="fpo@contact.org"
                        value={fpoEmail}
                        onChange={(e) => setFpoEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Reg. Number (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="MH/NSK/2024"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* BUYER REGISTRATION */}
              {activeRole === 'BUYER' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Business or Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahavira Oil & Foods Processing Ltd."
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pradeep Jain"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Buyer Type
                      </label>
                      <select
                        value={buyerType}
                        onChange={(e) => setBuyerType(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600 bg-white"
                      >
                        <option value="Agri-Processor">Agri-Processor</option>
                        <option value="Bulk Wholesaler">Bulk Wholesaler</option>
                        <option value="Exporter">Exporter</option>
                        <option value="Retail Chain">Retail Chain</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <span>Complete {activeRole} Registration</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import {
  Bell,
  Globe,
  Shield,
  Sliders,
  Smartphone,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Sparkles,
  Volume2,
  FileCheck
} from 'lucide-react';
import { resetToMockData } from '../../data/marketplaceStore';

export const SettingsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();

  // Notification toggles state (persisted locally)
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [buyerOffersAlerts, setBuyerOffersAlerts] = useState(true);
  const [fpoAggregationAlerts, setFpoAggregationAlerts] = useState(true);
  const [smsSummary, setSmsSummary] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [searchRadius, setSearchRadius] = useState<number>(50);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveSettings = () => {
    setToastMessage(
      language === 'mr'
        ? 'सेटिंग्ज यशस्वीरीत्या जतन केल्या!'
        : language === 'hi'
        ? 'सेटिंग्स सफलतापूर्वक सहेजी गईं!'
        : 'Settings saved successfully!'
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        language === 'mr'
          ? 'तुम्हाला सर्व प्रात्यक्षिक डेटा (मार्केटप्लेस, ऑर्डर्स, नोटिफिकेशन्स) पूर्ववत करायचा आहे का?'
          : 'Do you want to reset all prototype marketplace data and notifications to default demo state?'
      )
    ) {
      resetToMockData();
      setToastMessage(
        language === 'mr'
          ? 'डेटा पूर्ववत करण्यात आला आहे!'
          : 'Prototype data successfully reset!'
      );
      setTimeout(() => {
        setToastMessage(null);
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-bounce border border-emerald-500">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-agri-800 to-agri-900 rounded-2xl p-6 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-amber-300" />
            <h1 className="text-xl sm:text-2xl font-black">
              {language === 'mr'
                ? 'ॲप सेटिंग्ज आणि भाषा प्राधान्य'
                : language === 'hi'
                ? 'ऐप सेटिंग्स और भाषा प्राथमिकता'
                : 'App Settings & Language Preferences'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-agri-200 mt-1">
            {language === 'mr'
              ? 'भाषा निवडा, बाजारभाव सूचना नियंत्रित करा आणि कृषिमित्र प्रणाली कॉन्फिगर करा.'
              : language === 'hi'
              ? 'भाषा चुनें, मंडी मूल्य सूचनाएं नियंत्रित करें और कृषिमित्र प्रणाली कॉन्फ़िगर करें।'
              : 'Select application language, manage notification thresholds and tailor your platform experience.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
        >
          {t('common.save')}
        </button>
      </div>

      {/* Section 1: Multilingual Language Selector Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t('common.language')} / भाषा निवडा (Language Selection)
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'संपूर्ण प्रणालीमध्ये त्वरित भाषा बदला. लॉगआउट करण्याची आवश्यकता नाही.'
                  : language === 'hi'
                  ? 'पूरी प्रणाली में तुरंत भाषा बदलें। लॉगआउट करने की आवश्यकता नहीं है।'
                  : 'Instant real-time multilingual switching without logging out.'}
              </p>
            </div>
          </div>
        </div>

        <LanguageSelector variant="cards" />
      </div>

      {/* Section 2: Notification Center & Price Alert Rules */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {language === 'mr'
                ? 'सूचना व अलर्ट प्राधान्ये (Notification Rules)'
                : language === 'hi'
                ? 'सूचना एवं अलर्ट प्राथमिकताएं'
                : 'Notification Center & Alert Preferences'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'mr'
                ? 'कोणत्या बाजार हालचाली व व्यवहारांबद्दल तुम्हाला अलर्ट हवे आहेत ते निवडा.'
                : 'Choose which market events and trading updates trigger alerts.'}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Price Spike Alerts */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900">
                {language === 'mr'
                  ? 'बाजारभाव वाढ/घसरण अलर्ट (APMC Price Spike Alerts)'
                  : 'Mandi Price Spike & Crash Alerts'}
              </p>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'जवळच्या बाजार समितीत पिकाचे भाव ₹१००/क्विंटल पेक्षा जास्त वाढल्यास त्वरित सूचना द्या.'
                  : 'Notify immediately when benchmark APMC rates surge or drop by over ₹100/Qtl.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={priceAlerts}
                onChange={(e) => setPriceAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-agri-700"></div>
            </label>
          </div>

          {/* Buyer Offers Alerts */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900">
                {language === 'mr'
                  ? 'खरेदीदार थेट खरेदी ऑफर्स (Direct Buyer Offers)'
                  : 'Direct Buyer Offers & Counteroffers'}
              </p>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'नोंदणीकृत खरेदीदार किंवा FPO कडून नवीन बोली अथवा ऑफर आल्यास सूचना द्या.'
                  : 'Alert whenever a registered buyer bids on your produce or responds with a counteroffer.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={buyerOffersAlerts}
                onChange={(e) => setBuyerOffersAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-agri-700"></div>
            </label>
          </div>

          {/* FPO Bulk Aggregation */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900">
                {language === 'mr'
                  ? 'FPO एकत्रित विक्री संधी (FPO Bulk Selling Opportunities)'
                  : 'FPO Aggregation & Bulk Selling Alerts'}
              </p>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'FPO संस्था मोठ्या प्रमाणावर एकत्रित खरेदी करत असल्यास सूचना मिळवा.'
                  : 'Receive notifications when local FPOs open bulk procurement lots with premium rates.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={fpoAggregationAlerts}
                onChange={(e) => setFpoAggregationAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-agri-700"></div>
            </label>
          </div>

          {/* Audio Chime */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900">
                {language === 'mr'
                  ? 'ॲपमधील ध्वनी संकेत (In-App Audio Chime)'
                  : 'Audio Alert Chimes'}
              </p>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'नवीन ऑफर प्राप्त झाल्यावर सौम्य ध्वनी संकेत प्ले करा.'
                  : 'Play gentle audible cue upon receiving live bids or high-priority notifications.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-agri-700"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Section 3: Market Discovery Parameters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {language === 'mr'
                ? 'बाजार समिती शोध त्रिज्या (Mandi Discovery Radius)'
                : 'Mandi Discovery Radius'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'mr'
                ? 'नफा गणक आणि बाजारभाव तुलनेसाठी कमाल अंतर मर्यादा सेट करा.'
                : 'Set maximum transit distance for APMC net earnings comparison.'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {language === 'mr' ? 'शोध अंतर:' : 'Discovery Radius:'}
            </span>
            <span className="text-sm font-extrabold text-agri-800 bg-agri-50 px-3 py-1 rounded-lg border border-agri-200">
              {searchRadius} km
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="150"
            step="10"
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
            className="w-full accent-agri-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
            <span>10 km (स्थानिक)</span>
            <span>50 km (तालुका/जिल्हा)</span>
            <span>150 km (विभागीय)</span>
          </div>
        </div>
      </div>

      {/* Section 4: Prototype Maintenance & Reset */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-amber-700" />
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {language === 'mr'
                ? 'सेवा फर्स्ट इनोव्हेशन चॅलेंज प्रात्यक्षिक प्रणाली'
                : 'Seva First Innovation Challenge Sandbox Control'}
            </h2>
            <p className="text-xs text-slate-600">
              {language === 'mr'
                ? 'सध्याचा वापरकर्ता: ' + (currentUser?.fullName || 'शेतकरी') + ' (' + currentUser?.role + ')'
                : 'Current Account: ' + (currentUser?.fullName || 'User') + ' (' + currentUser?.role + ')'}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-amber-200/60">
          <p className="text-xs text-amber-900 leading-relaxed">
            {language === 'mr'
              ? 'चाचणी दरम्यान तयार केलेल्या सर्व नवीन नोंदी (पिके, ऑफर्स, ऑर्डर्स) मूळ प्रात्यक्षिक स्थितीत परत आणण्यासाठी खालील बटण वापरा.'
              : 'Restore demonstration data, fresh sample produce listings, and simulated buyer bids back to default sandbox values.'}
          </p>
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>
              {language === 'mr' ? 'डेमो डेटा पूर्ववत करा' : 'Reset Demo Data'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

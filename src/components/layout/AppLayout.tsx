import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  TrendingUp,
  Store,
  Calculator,
  Users,
  Compass,
  Bell,
  User,
  Wheat,
  ShieldAlert,
  ChevronRight,
  Menu,
  X,
  MapPin,
  LogOut,
  Building2,
  Layers,
  ShoppingCart,
  Settings
} from 'lucide-react';
import { getNotifications } from '../../data/marketplaceStore';
import { NotificationDrawer } from '../../modules/dashboard/components/NotificationDrawer';
import { LanguageSelector } from '../common/LanguageSelector';

interface NavItem {
  to: string;
  label: string;
  marathiLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const AppLayout: React.FC = () => {
  const { currentUser, logout, switchRole } = useAuth();
  const { language, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    if (newRole === 'FARMER') navigate('/');
    else if (newRole === 'FPO') navigate('/fpo');
    else if (newRole === 'BUYER') navigate('/buyer');
  };

  // Farmer Navigation
  const farmerNavItems: NavItem[] = [
    { to: '/', label: t('nav.farmerDashboard'), marathiLabel: 'मुख्य पृष्ठ', icon: LayoutDashboard },
    { to: '/crop-selection', label: t('nav.cropsAndStock'), marathiLabel: 'पिके आणि साठा', icon: Wheat },
    { to: '/market-comparison', label: t('nav.mandiComparison'), marathiLabel: 'बाजारभाव तुलना', icon: Store },
    { to: '/price-forecast', label: t('nav.priceForecast'), marathiLabel: 'किंमत अंदाज', icon: TrendingUp },
    { to: '/sell-recommendations', label: t('nav.sellAdvisor'), marathiLabel: 'विक्री सल्ला', icon: Compass, badge: 'AI' },
    { to: '/net-earnings', label: t('nav.netEarnings'), marathiLabel: 'निव्वळ नफा', icon: Calculator },
    { to: '/fpo-marketplace', label: t('nav.fpoMarketplace'), marathiLabel: 'थेट खरेदीदार', icon: Users, badge: 'Direct' },
    { to: '/notifications', label: t('nav.notifications'), marathiLabel: 'सूचना केंद्र', icon: Bell },
    { to: '/settings', label: t('nav.settings'), marathiLabel: 'सेटिंग्ज', icon: Settings },
    { to: '/profile', label: t('nav.profile'), marathiLabel: 'शेतकरी माहिती', icon: User },
  ];

  // FPO Navigation
  const fpoNavItems: NavItem[] = [
    { to: '/fpo', label: t('nav.fpoDashboard'), marathiLabel: 'FPO मुख्य पृष्ठ', icon: Layers },
    { to: '/crop-selection', label: t('nav.cropsAndStock'), marathiLabel: 'शेतकरी साठा संकलन', icon: Wheat },
    { to: '/market-comparison', label: t('nav.mandiComparison'), marathiLabel: 'बाजारभाव तुलना', icon: Store },
    { to: '/price-forecast', label: t('nav.priceForecast'), marathiLabel: 'किंमत अंदाज', icon: TrendingUp },
    { to: '/net-earnings', label: t('nav.netEarnings'), marathiLabel: 'निव्वळ नफा', icon: Calculator },
    { to: '/fpo-marketplace', label: t('nav.buyerDirectory'), marathiLabel: 'खरेदीदार नेटवर्क', icon: Building2 },
    { to: '/notifications', label: t('nav.notifications'), marathiLabel: 'सूचना केंद्र', icon: Bell },
    { to: '/settings', label: t('nav.settings'), marathiLabel: 'सेटिंग्ज', icon: Settings },
    { to: '/profile', label: t('nav.profile'), marathiLabel: 'संस्था माहिती', icon: User },
  ];

  // Buyer Navigation
  const buyerNavItems: NavItem[] = [
    { to: '/buyer', label: t('nav.buyerDashboard'), marathiLabel: 'खरेदीदार मुख्य पृष्ठ', icon: ShoppingCart },
    { to: '/crop-selection', label: t('nav.cropsAndStock'), marathiLabel: 'शेतमाल शोध', icon: Wheat },
    { to: '/market-comparison', label: t('nav.mandiComparison'), marathiLabel: 'बाजारभाव तुलना', icon: Store },
    { to: '/price-forecast', label: t('nav.priceForecast'), marathiLabel: 'किंमत अंदाज', icon: TrendingUp },
    { to: '/net-earnings', label: t('nav.netEarnings'), marathiLabel: 'खर्च गणक', icon: Calculator },
    { to: '/fpo-marketplace', label: t('nav.fpoMarketplace'), marathiLabel: 'उत्पादक बाजार', icon: Users },
    { to: '/notifications', label: t('nav.notifications'), marathiLabel: 'सूचना केंद्र', icon: Bell },
    { to: '/settings', label: t('nav.settings'), marathiLabel: 'सेटिंग्ज', icon: Settings },
    { to: '/profile', label: t('nav.profile'), marathiLabel: 'कंपनी माहिती', icon: User },
  ];

  const activeNavItems =
    currentUser?.role === 'FPO'
      ? fpoNavItems
      : currentUser?.role === 'BUYER'
      ? buyerNavItems
      : farmerNavItems;

  // Mobile Bottom Nav (5 key items)
  const mobileNavItems: NavItem[] =
    currentUser?.role === 'FPO'
      ? [
          { to: '/fpo', label: t('nav.fpoDashboard').split(' ')[0] || 'FPO', icon: Layers },
          { to: '/crop-selection', label: t('nav.cropsAndStock').split(' ')[0] || 'Produce', icon: Wheat },
          { to: '/fpo-marketplace', label: 'Buyers', icon: Building2 },
          { to: '/notifications', label: 'Alerts', icon: Bell },
          { to: '/profile', label: 'Profile', icon: User },
        ]
      : currentUser?.role === 'BUYER'
      ? [
          { to: '/buyer', label: 'Buyer', icon: ShoppingCart },
          { to: '/crop-selection', label: 'Lots', icon: Wheat },
          { to: '/fpo-marketplace', label: 'Market', icon: Store },
          { to: '/notifications', label: 'Alerts', icon: Bell },
          { to: '/profile', label: 'Profile', icon: User },
        ]
      : [
          { to: '/', label: 'Home', icon: LayoutDashboard },
          { to: '/crop-selection', label: 'Produce', icon: Wheat },
          { to: '/market-comparison', label: 'Mandis', icon: Store },
          { to: '/notifications', label: 'Alerts', icon: Bell },
          { to: '/sell-recommendations', label: 'Advisory', icon: Compass },
        ];

  const homeRoute =
    currentUser?.role === 'FPO' ? '/fpo' : currentUser?.role === 'BUYER' ? '/buyer' : '/';

  const unreadAlertsCount = React.useMemo(() => {
    if (!currentUser?.role) return 0;
    return getNotifications(currentUser.role).filter((n) => !n.read).length;
  }, [currentUser?.role, notificationDrawerOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-earth-50 text-slate-800">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-agri-800 text-white shadow-md border-b border-agri-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile Trigger & Brand */}
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-agri-100 hover:text-white hover:bg-agri-700/80 focus:outline-none cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <NavLink to={homeRoute} className="flex items-center space-x-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center text-agri-700 shadow-sm shrink-0">
                  <Wheat className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg sm:text-xl font-bold tracking-tight text-white">KrishiMitra</span>
                    {/* Role Pill */}
                    <span
                      className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        currentUser?.role === 'FPO'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : currentUser?.role === 'BUYER'
                          ? 'bg-blue-950 text-blue-300 border-blue-500/50'
                          : 'bg-agri-950 text-amber-300 border-agri-600/50'
                      }`}
                    >
                      {currentUser?.role === 'FPO'
                        ? t('roles.fpo')
                        : currentUser?.role === 'BUYER'
                        ? t('roles.buyer')
                        : t('roles.farmer')}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-agri-200 hidden sm:block">
                    {language === 'mr'
                      ? 'शेतकरी बाजारभाव, नफा गणक आणि थेट खरेदीदार परिसंस्था'
                      : language === 'hi'
                      ? 'मंडी भाव, शुद्ध लाभ और प्रत्यक्ष क्रेता-विक्रेता मंच'
                      : 'Market & Net-Earning Advisory Ecosystem'}
                  </p>
                </div>
              </NavLink>
            </div>

            {/* Right: Language Selector, Quick Role Switcher, Profile, Notifications & Logout */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language Selector (Desktop & Tablet) */}
              <div className="hidden sm:block">
                <LanguageSelector variant="compact" />
              </div>

              {/* Evaluator Quick Role Switcher */}
              <div className="hidden xl:flex items-center space-x-1 bg-agri-950/60 p-1 rounded-xl border border-agri-700/60 text-xs">
                <span className="text-[10px] text-agri-300 uppercase font-bold px-2">
                  {t('nav.switchRole')}:
                </span>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('FARMER')}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                    currentUser?.role === 'FARMER' ? 'bg-agri-700 text-white shadow-xs' : 'text-agri-200 hover:text-white'
                  }`}
                >
                  {t('roles.farmer')}
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('FPO')}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                    currentUser?.role === 'FPO' ? 'bg-emerald-700 text-white shadow-xs' : 'text-agri-200 hover:text-white'
                  }`}
                >
                  FPO
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('BUYER')}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                    currentUser?.role === 'BUYER' ? 'bg-blue-700 text-white shadow-xs' : 'text-agri-200 hover:text-white'
                  }`}
                >
                  {language === 'mr' ? 'खरेदीदार' : language === 'hi' ? 'क्रेता' : 'Buyer'}
                </button>
              </div>

              {/* Profile Pill */}
              <NavLink
                to="/profile"
                className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-agri-700/70 hover:bg-agri-700 text-xs text-agri-100 border border-agri-600/40"
              >
                <div className="w-6 h-6 rounded-full bg-agri-600 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/30">
                  {currentUser?.fullName?.substring(0, 2).toUpperCase() || 'KM'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-semibold text-white leading-tight">
                    {currentUser?.fullName || 'User'}
                  </div>
                  <div className="text-[10px] text-agri-300">
                    {currentUser?.district || currentUser?.operatingLocation || 'Nashik'}
                  </div>
                </div>
              </NavLink>

              {/* Notifications Bell */}
              <button
                type="button"
                onClick={() => setNotificationDrawerOpen(true)}
                className="p-2 rounded-xl text-agri-200 hover:text-white hover:bg-agri-700/60 relative cursor-pointer"
                title={t('nav.notifications')}
                aria-label={t('nav.notifications')}
              >
                <Bell className="w-5 h-5" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-xs">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-xl text-agri-200 hover:text-rose-200 hover:bg-rose-900/40 transition-colors cursor-pointer"
                title={t('nav.logout')}
                aria-label={t('nav.logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Prototype Transparency Notice Banner */}
        <div className="bg-amber-500/15 border-t border-amber-400/20 px-4 py-1 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-1.5 text-[10px] sm:text-[11px] text-amber-200 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>
              {language === 'mr'
                ? 'कृषिमित्र - ३-भूमिका प्रणाली (शेतकरी, FPO, खरेदीदार) • बहुभाषिक सहाय्य • तात्काळ भूमिका बदल सक्षम'
                : language === 'hi'
                ? 'कृषिमित्र - ३-भूमिका प्रणाली (किसान, FPO, क्रेता) • बहुभाषी समर्थन • तत्काल भूमिका परिवर्तन सक्रिय'
                : 'Seva First Innovation Challenge Prototype: 3-Role Architecture Active • Multilingual System • Real-Time Role Switching Enabled'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Body Shell */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 py-6 px-4 shrink-0">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-3 flex items-center justify-between">
            <span>
              {currentUser?.role || 'FARMER'} {t('nav.portal')}
            </span>
            <span className="text-[10px] text-agri-700 font-semibold">{t('nav.active')}</span>
          </div>

          <nav className="space-y-1">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/' || item.to === '/fpo' || item.to === '/buyer'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-agri-50 text-agri-900 shadow-xs border border-agri-200 font-bold'
                        : 'text-slate-600 hover:bg-earth-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-agri-700" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-agri-100 text-agri-800">
                      {item.badge}
                    </span>
                  )}
                  {item.to === '/notifications' && unreadAlertsCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                      {unreadAlertsCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
            {/* Quick Role Switcher in Sidebar */}
            <div className="p-3 bg-earth-100/70 rounded-xl border border-earth-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                {t('nav.switchRole')}:
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('FARMER')}
                  className={`py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                    currentUser?.role === 'FARMER' ? 'bg-agri-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('roles.farmer')}
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('FPO')}
                  className={`py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                    currentUser?.role === 'FPO' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  FPO
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('BUYER')}
                  className={`py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                    currentUser?.role === 'BUYER' ? 'bg-blue-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {language === 'mr' ? 'खरेदीदार' : language === 'hi' ? 'क्रेता' : 'Buyer'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </aside>

        {/* Mobile Slide-over Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl z-50">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-agri-800 text-white">
                <div className="flex items-center space-x-2">
                  <Wheat className="w-5 h-5 text-agri-300" />
                  <span className="font-bold text-base">KrishiMitra</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-agri-200 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Selection inside Mobile Drawer */}
              <div className="p-3 bg-earth-50 border-b border-earth-200">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  {t('common.language')} / भाषा निवडा:
                </div>
                <LanguageSelector variant="pills" />
              </div>

              {/* User info banner inside drawer */}
              <div className="p-3.5 bg-earth-100/60 border-b border-earth-200 text-xs">
                <div className="font-bold text-slate-900">{currentUser?.fullName}</div>
                <div className="text-[11px] text-slate-500">
                  Role: <strong className="text-agri-800">{currentUser?.role}</strong> • {currentUser?.district || currentUser?.operatingLocation}
                </div>
              </div>

              {/* Role Switcher in Mobile Drawer */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {t('nav.switchRole')}:
                </span>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('FARMER')}
                    className={`py-1.5 rounded-lg font-bold ${
                      currentUser?.role === 'FARMER' ? 'bg-agri-700 text-white' : 'bg-white text-slate-700 border'
                    }`}
                  >
                    {t('roles.farmer')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('FPO')}
                    className={`py-1.5 rounded-lg font-bold ${
                      currentUser?.role === 'FPO' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border'
                    }`}
                  >
                    FPO
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('BUYER')}
                    className={`py-1.5 rounded-lg font-bold ${
                      currentUser?.role === 'BUYER' ? 'bg-blue-700 text-white' : 'bg-white text-slate-700 border'
                    }`}
                  >
                    {language === 'mr' ? 'खरेदीदार' : language === 'hi' ? 'क्रेता' : 'Buyer'}
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-1 overflow-y-auto flex-1">
                {activeNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/' || item.to === '/fpo' || item.to === '/buyer'}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-agri-50 text-agri-800 font-bold border border-agri-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-agri-700" />
                        <div>
                          <div>{item.label}</div>
                          {item.marathiLabel && language !== 'mr' && (
                            <div className="text-[10px] text-slate-400 font-normal">
                              {item.marathiLabel}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </NavLink>
                  );
                })}
              </div>

              <div className="p-3 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 flex items-center justify-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Central Dynamic Content Area */}
        <main className="flex-1 w-full min-w-0 p-3 sm:p-5 lg:p-7 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />

      {/* Mobile Touch-Friendly Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-xl safe-bottom">
        <div className="grid grid-cols-5 gap-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/' || item.to === '/fpo' || item.to === '/buyer'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                    isActive
                      ? 'text-agri-700 font-bold scale-105'
                      : 'text-slate-500 hover:text-slate-800 font-medium'
                  }`
                }
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5" />
                  {item.to === '/notifications' && unreadAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 font-black text-[8px] flex items-center justify-center">
                      {unreadAlertsCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

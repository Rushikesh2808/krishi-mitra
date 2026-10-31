import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Check,
  TrendingUp,
  Handshake,
  Layers,
  Package,
  FileCheck,
  Sparkles,
  Clock,
  ArrowRight,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Inbox,
  Building2,
  Wheat,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  deleteNotification,
  toggleNotificationRead,
  getLocalizedNotification,
  AppNotification
} from '../../data/marketplaceStore';
import { UserRole } from '../../types';

export const NotificationsPage: React.FC = () => {
  const { currentUser, switchRole } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const currentRole: UserRole = currentUser?.role || 'FARMER';
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'offers' | 'alerts' | 'deals'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadNotifications = () => {
    setNotifications(getNotifications(currentRole));
  };

  useEffect(() => {
    loadNotifications();
  }, [currentRole]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Counts
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const offersCount = useMemo(
    () => notifications.filter((n) => n.type === 'offer_received' || n.type === 'counter_received').length,
    [notifications]
  );
  const alertsCount = useMemo(
    () => notifications.filter((n) => n.type === 'price_alert' || n.type === 'recommendation' || n.type === 'stock_alert').length,
    [notifications]
  );
  const dealsCount = useMemo(
    () => notifications.filter((n) => n.type === 'contract_finalized' || n.type === 'lot_aggregated').length,
    [notifications]
  );

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter((n) => !n.read);
      case 'offers':
        return notifications.filter((n) => n.type === 'offer_received' || n.type === 'counter_received');
      case 'alerts':
        return notifications.filter(
          (n) => n.type === 'price_alert' || n.type === 'recommendation' || n.type === 'stock_alert'
        );
      case 'deals':
        return notifications.filter(
          (n) => n.type === 'contract_finalized' || n.type === 'lot_aggregated'
        );
      case 'all':
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  // Actions
  const handleMarkAllRead = () => {
    const updated = markAllNotificationsAsRead(currentRole);
    setNotifications(updated.filter((n) => n.role === currentRole));
    showToast(t('notifications.markAllRead') + ' ✓');
  };

  const handleClearAll = () => {
    if (window.confirm('तुम्हाला या खात्याच्या सर्व सूचना हटवायच्या आहेत का? (Clear all notifications?)')) {
      const updated = clearNotifications(currentRole);
      setNotifications(updated.filter((n) => n.role === currentRole));
      showToast(t('notifications.clearAll') + ' ✓');
    }
  };

  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleNotificationRead(id);
    setNotifications(updated.filter((n) => n.role === currentRole));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteNotification(id);
    setNotifications(updated.filter((n) => n.role === currentRole));
  };

  const handleItemClick = (item: AppNotification) => {
    if (!item.read) {
      markNotificationAsRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
      );
    }
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setNotifications(getNotifications(role));
    if (role === 'FARMER') showToast('Switched to Farmer Notifications stream');
    else if (role === 'FPO') showToast('Switched to FPO Notifications stream');
    else if (role === 'BUYER') showToast('Switched to Buyer Notifications stream');
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'offer_received':
        return <Handshake className="w-5 h-5 text-purple-700" />;
      case 'counter_received':
        return <Sparkles className="w-5 h-5 text-indigo-700" />;
      case 'lot_aggregated':
      case 'bulk_opportunity':
        return <Layers className="w-5 h-5 text-teal-700" />;
      case 'listing_added':
        return <Package className="w-5 h-5 text-amber-700" />;
      case 'contract_finalized':
        return <FileCheck className="w-5 h-5 text-emerald-700" />;
      case 'recommendation':
        return <Sparkles className="w-5 h-5 text-agri-700" />;
      case 'price_alert':
      default:
        return <TrendingUp className="w-5 h-5 text-blue-700" />;
    }
  };

  const getIconBg = (type: AppNotification['type']) => {
    switch (type) {
      case 'offer_received':
        return 'bg-purple-100 border-purple-200';
      case 'counter_received':
        return 'bg-indigo-100 border-indigo-200';
      case 'lot_aggregated':
      case 'bulk_opportunity':
        return 'bg-teal-100 border-teal-200';
      case 'listing_added':
        return 'bg-amber-100 border-amber-200';
      case 'contract_finalized':
        return 'bg-emerald-100 border-emerald-200';
      case 'recommendation':
        return 'bg-agri-100 border-agri-200';
      case 'price_alert':
      default:
        return 'bg-blue-100 border-blue-200';
    }
  };

  const getCategoryBadge = (type: AppNotification['type']) => {
    switch (type) {
      case 'offer_received':
        return { label: t('notifications.categories.offerReceived'), color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'counter_received':
        return { label: t('notifications.categories.counterReceived'), color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'lot_aggregated':
      case 'bulk_opportunity':
        return { label: t('notifications.categories.lotAggregated'), color: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'listing_added':
        return { label: t('notifications.categories.listingAdded'), color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'contract_finalized':
        return { label: t('notifications.categories.contractFinalized'), color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'recommendation':
        return { label: t('notifications.categories.recommendation'), color: 'bg-agri-50 text-agri-800 border-agri-200' };
      case 'price_alert':
      default:
        return { label: t('notifications.categories.priceAlert'), color: 'bg-blue-50 text-blue-800 border-blue-200' };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 duration-300">
          <div className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-agri-950 via-agri-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-agri-200">
              {currentRole} Notification Center
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px]">
                {unreadCount} {t('common.available')}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('notifications.title')}
          </h1>
          <p className="text-xs sm:text-sm text-agri-200 max-w-xl">
            {t('notifications.subtitle')}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadNotifications}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
            title={t('common.refresh')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              unreadCount === 0
                ? 'bg-white/5 text-white/40 cursor-not-allowed border border-white/5'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20 active:scale-95'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{t('notifications.markAllRead')}</span>
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              notifications.length === 0
                ? 'bg-white/5 text-white/40 cursor-not-allowed border border-white/5'
                : 'bg-rose-500/80 hover:bg-rose-600 text-white border border-rose-400/40 active:scale-95'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('notifications.clearAll')}</span>
          </button>
        </div>
      </div>

      {/* Role Switcher Sandbox Preview Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-agri-700 shrink-0" />
          <span>
            <strong>Role-based Stream:</strong> Viewing live notifications for <strong>{currentRole}</strong>.
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 text-[11px] uppercase font-bold mr-1">Preview Role:</span>
          {(['FARMER', 'FPO', 'BUYER'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleSwitch(r)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                currentRole === r
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {r === 'FARMER' ? 'Farmer' : r === 'FPO' ? 'FPO Hub' : 'Buyer'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'all'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>{t('notifications.all')}</span>
          <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {notifications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('unread')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'unread'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>{t('notifications.unread')}</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-amber-400 text-slate-950 font-black">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'offers'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>{t('notifications.offers')}</span>
          <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${activeTab === 'offers' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {offersCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'alerts'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>{t('notifications.alerts')}</span>
          <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${activeTab === 'alerts' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {alertsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'deals'
              ? 'bg-agri-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>{t('notifications.deals')}</span>
          <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${activeTab === 'deals' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {dealsCount}
          </span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const loc = getLocalizedNotification(notif, language);
            const badge = getCategoryBadge(notif.type);
            return (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4 group hover:shadow-md ${
                  notif.read
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-gradient-to-r from-emerald-50/50 via-white to-white border-emerald-300 shadow-xs'
                }`}
              >
                {/* Left: Icon & Content */}
                <div className="flex items-start space-x-3.5 flex-1">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${getIconBg(notif.type)}`}>
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {notif.time}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Unread" />
                      )}
                    </div>

                    <h3 className={`text-sm sm:text-base font-bold text-slate-900 ${!notif.read ? 'font-black' : ''}`}>
                      {loc.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {loc.message}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={(e) => handleToggleRead(notif.id, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title={notif.read ? t('notifications.markAsUnread') : t('notifications.markAsRead')}
                    >
                      {notif.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(notif.id, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title={t('notifications.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {notif.link && (
                    <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-agri-50 hover:bg-agri-100 text-agri-800 text-xs font-bold border border-agri-200 transition-all">
                      <span>{t('common.view')}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              {activeTab === 'unread' ? t('notifications.noUnread') : t('notifications.noNotifications')}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'unread'
                ? 'All alerts for this role have been marked as read.'
                : 'Prototype activity will post real-time updates here as offers, lots, and rates change.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  Bell,
  TrendingUp,
  Handshake,
  CheckCircle2,
  Package,
  Layers,
  FileCheck,
  Building2,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getLocalizedNotification,
  AppNotification
} from '../../../data/marketplaceStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (currentUser?.role) {
      setNotifications(getNotifications(currentUser.role));
    }
  }, [currentUser?.role, isOpen]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    if (currentUser?.role) {
      const updated = markAllNotificationsAsRead(currentUser.role);
      setNotifications(updated.filter((n) => n.role === currentUser.role));
    }
  };

  const handleNotificationClick = (item: AppNotification) => {
    markNotificationAsRead(item.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.link) {
      onClose();
      navigate(item.link);
    }
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'offer_received':
        return <Handshake className="w-4 h-4 text-purple-700" />;
      case 'counter_received':
        return <Sparkles className="w-4 h-4 text-indigo-700" />;
      case 'lot_aggregated':
      case 'bulk_opportunity':
        return <Layers className="w-4 h-4 text-teal-700" />;
      case 'listing_added':
        return <Package className="w-4 h-4 text-amber-700" />;
      case 'contract_finalized':
        return <FileCheck className="w-4 h-4 text-emerald-700" />;
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-agri-700" />;
      case 'price_alert':
      default:
        return <TrendingUp className="w-4 h-4 text-blue-700" />;
    }
  };

  const getIconBg = (type: AppNotification['type']) => {
    switch (type) {
      case 'offer_received':
        return 'bg-purple-100';
      case 'counter_received':
        return 'bg-indigo-100';
      case 'lot_aggregated':
      case 'bulk_opportunity':
        return 'bg-teal-100';
      case 'listing_added':
        return 'bg-amber-100';
      case 'contract_finalized':
        return 'bg-emerald-100';
      case 'recommendation':
        return 'bg-agri-100';
      case 'price_alert':
      default:
        return 'bg-blue-100';
    }
  };

  const roleLabel =
    currentUser?.role === 'FPO'
      ? `${t('roles.fpo')} ${t('notifications.title')}`
      : currentUser?.role === 'BUYER'
      ? `${t('roles.buyer')} ${t('notifications.title')}`
      : `${t('roles.farmer')} ${t('notifications.title')}`;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-agri-900 bg-agri-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">{roleLabel}</h3>
              <p className="text-[11px] text-agri-200">
                {unreadCount > 0
                  ? `${unreadCount} ${t('notifications.unread').toLowerCase()}`
                  : t('notifications.noUnread')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-agri-200 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>
              {t('notifications.title')} ({notifications.length})
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-agri-700 hover:text-agri-900 font-bold cursor-pointer"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">{t('notifications.noNotifications')}</p>
            </div>
          ) : (
            notifications.map((n) => {
              const loc = getLocalizedNotification(n, language);
              return (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-xs ${
                    n.read
                      ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                      : 'bg-agri-50/50 border-agri-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-xl shrink-0 ${getIconBg(n.type)}`}>
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate pr-2">
                          {loc.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {loc.message}
                      </p>
                      {n.link && (
                        <span className="inline-block mt-1.5 text-[11px] font-bold text-agri-800 hover:underline">
                          {t('common.view')} ➔
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Dedicated page link banner */}
          <Link
            to="/notifications"
            onClick={onClose}
            className="p-3 rounded-xl bg-agri-50 border border-agri-200 text-xs font-bold text-agri-900 flex items-center justify-between hover:bg-agri-100 transition-colors"
          >
            <span>{t('notifications.openFullCenter')}</span>
            <ArrowRight className="w-4 h-4 text-agri-700" />
          </Link>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <Link
            to="/notifications"
            onClick={onClose}
            className="text-xs font-bold text-agri-700 hover:text-agri-900 underline"
          >
            {t('common.viewAll')}
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

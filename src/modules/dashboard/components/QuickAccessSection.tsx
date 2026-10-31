import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Store,
  TrendingUp,
  Compass,
  Calculator,
  Users,
  Wheat,
  ArrowRight
} from 'lucide-react';

interface QuickAccessModule {
  to: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  badge?: string;
}

const modules: QuickAccessModule[] = [
  {
    to: '/market-comparison',
    title: 'Market Comparison',
    subtitle: 'बाजारभाव तुलना',
    description: 'Compare modal rates, freight costs & net payout across Lasalgaon, Pune, and Vashi mandis.',
    icon: Store,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
    badge: '5 APMCs',
  },
  {
    to: '/price-forecast',
    title: '10-Day Forecast',
    subtitle: 'किंमत अंदाज',
    description: 'Probabilistic price trajectory curves with upper/lower confidence bands and arrival trends.',
    icon: TrendingUp,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    badge: 'Trend AI',
  },
  {
    to: '/sell-recommendations',
    title: 'Sell vs Wait Advisor',
    subtitle: 'विक्री सल्लागार',
    description: 'Determine holding economics: calculate if price rise outpaces daily storage and spoilage decay.',
    icon: Compass,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
    badge: 'Advisory',
  },
  {
    to: '/net-earnings',
    title: 'Net Earnings Calculator',
    subtitle: 'निव्वळ नफा गणक',
    description: 'Interactive simulation of diesel freight, distance, storage duration, and APMC cess.',
    icon: Calculator,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-700',
    badge: 'Formula',
  },
  {
    to: '/fpo-marketplace',
    title: 'FPO & Bulk Buyers',
    subtitle: 'थेट खरेदीदार',
    description: 'Connect with Farmer Producer Organizations & agro-processors for direct farmgate pickup bids.',
    icon: Users,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-700',
    badge: 'Direct Bids',
  },
  {
    to: '/crop-selection',
    title: 'Crops and Produce',
    subtitle: 'पिके आणि साठा',
    description: 'Manage harvested crops, record batch moisture levels, and track remaining stock.',
    icon: Wheat,
    iconBg: 'bg-earth-100',
    iconColor: 'text-earth-800',
    badge: 'Portfolio',
  },
];

export const QuickAccessSection: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Quick Access Modules
        </h2>
        <span className="text-xs text-slate-500">All 6 modules active</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <NavLink
              key={m.to}
              to={m.to}
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-agri-300 hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${m.iconBg} ${m.iconColor} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {m.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {m.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline space-x-1.5">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-agri-800 transition-colors">
                    {m.title}
                  </h3>
                </div>
                <div className="text-[11px] font-medium text-slate-400 mb-1">
                  {m.subtitle}
                </div>

                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-agri-700">
                <span>Open module</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};


import React from 'react';
import {
  Users,
  Building2,
  Package,
  Handshake,
  Layers,
  Plus,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface MarketplaceHeroSummaryProps {
  fpoCount: number;
  buyerCount: number;
  listingsCount: number;
  pendingOffersCount: number;
  bulkPoolsCount: number;
  onOpenCreateModal: () => void;
  onSelectTab: (tab: 'hub' | 'listings' | 'fpos' | 'buyers' | 'negotiations' | 'bulk') => void;
}

export const MarketplaceHeroSummary: React.FC<MarketplaceHeroSummaryProps> = ({
  fpoCount,
  buyerCount,
  listingsCount,
  pendingOffersCount,
  bulkPoolsCount,
  onOpenCreateModal,
  onSelectTab,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner with Actions */}
      <div className="bg-gradient-to-r from-agri-800 via-agri-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-agri-700/60 border border-agri-600/50 text-xs font-medium text-agri-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>थेट शेतमाल विक्री व संस्थात्मक खरेदीदार नेटवर्क • Direct Trade Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              FPO & Buyer Marketplace
            </h1>
            <p className="text-sm sm:text-base text-agri-100 leading-relaxed">
              Connect directly with verified Farmer Producer Organizations (FPOs), oilseed crushers, flour mills, and export houses across Maharashtra. Bypass middlemen, skip APMC cess, and negotiate premium prices.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ शेतमाल विक्रीसाठी नोंदवा (List Produce)</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('negotiations')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm transition-all cursor-pointer backdrop-blur-sm"
            >
              <Handshake className="w-4 h-4 text-agri-300" />
              <span>खरेदीदार ऑफर ({pendingOffersCount})</span>
            </button>
          </div>
        </div>

        {/* Prototype Transparency Note */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-start space-x-2 text-xs text-agri-200/90">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>पारदर्शक प्रात्यक्षिक (Demonstration Prototype):</strong> All listed FPOs, corporate mills, and price indications represent real agricultural benchmarks for Nashik, Niphad, and Lasalgaon clusters. Live financial settlements and contract signing are simulated in this interface.
          </span>
        </div>
      </div>

      {/* 5-Metric Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: FPOs */}
        <button
          type="button"
          onClick={() => onSelectTab('fpos')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-agri-400 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">FPO Directory</span>
            <Users className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">{fpoCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">Active FPCs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">Nashik & Niphad Clusters</p>
        </button>

        {/* Metric 2: Buyers */}
        <button
          type="button"
          onClick={() => onSelectTab('buyers')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-agri-400 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Verified Buyers</span>
            <Building2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">{buyerCount}</span>
            <span className="text-xs text-blue-600 font-semibold">Institutional</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">Processors & Exporters</p>
        </button>

        {/* Metric 3: Active Produce Listings */}
        <button
          type="button"
          onClick={() => onSelectTab('listings')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-agri-400 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Produce Listings</span>
            <Package className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">{listingsCount}</span>
            <span className="text-xs text-amber-700 font-semibold">Lots Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">Ready for Procurement</p>
        </button>

        {/* Metric 4: Buyer Offers */}
        <button
          type="button"
          onClick={() => onSelectTab('negotiations')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-agri-400 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Buyer Offers</span>
            <Handshake className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">{pendingOffersCount}</span>
            <span className="text-xs text-purple-600 font-semibold">Action Needed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">Pending Review & Counter</p>
        </button>

        {/* Metric 5: Bulk Pooling Pools */}
        <button
          type="button"
          onClick={() => onSelectTab('bulk')}
          className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-agri-400 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Bulk Pooling</span>
            <Layers className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">{bulkPoolsCount}</span>
            <span className="text-xs text-teal-600 font-semibold">Open Lots</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">+₹70-160/Qtl Bulk Bonus</p>
        </button>
      </div>
    </div>
  );
};


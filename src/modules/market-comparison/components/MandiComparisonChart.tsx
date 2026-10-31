import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MandiComparisonEntry } from '../../../types';
import { formatINR } from '../../../utils/currency';
import { BarChart3, Info } from 'lucide-react';

interface MandiComparisonChartProps {
  entries: MandiComparisonEntry[];
  cropName: string;
}

export const MandiComparisonChart: React.FC<MandiComparisonChartProps> = ({
  entries,
  cropName,
}) => {
  // Prepare chart dataset
  const chartData = entries.map((entry) => ({
    name: entry.mandiName.replace(' APMC', '').replace(' (Navi Mumbai)', '').replace(' (Gultekdi Market Yard)', ''),
    fullName: entry.mandiName,
    grossRevenue: entry.grossRevenue,
    netEarnings: entry.netEarnings,
    deductions: entry.totalDeductions,
    transportCost: entry.transportationCost,
    pricePerQuintal: entry.pricePerQuintal,
    distanceKm: entry.distanceKm,
    realizationPercentage: entry.realizationPercentage,
    isHighestNet: entry.isHighestNet,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 z-50">
          <div className="font-bold text-sm text-amber-300 border-b border-slate-700 pb-1">
            {data.fullName} ({data.distanceKm} km away)
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-slate-400">Quoted Price:</span>
            <span className="font-semibold">{formatINR(data.pricePerQuintal)}/Qtl</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-slate-400">Gross Revenue:</span>
            <span className="font-semibold text-slate-200">{formatINR(data.grossRevenue)}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-rose-400">Freight & Fees:</span>
            <span className="font-semibold text-rose-300">- {formatINR(data.deductions)}</span>
          </div>
          <div className="flex justify-between space-x-4 pt-1 border-t border-slate-700 font-bold">
            <span className="text-emerald-400">In-Hand Net Earnings:</span>
            <span className="text-emerald-300">{formatINR(data.netEarnings)}</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-0.5">
            Retention rate: {data.realizationPercentage}% of quoted value
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-agri-100 text-agri-800 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-agri-700" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              Gross Revenue vs Realized Net Earnings
            </h3>
            <p className="text-xs text-slate-500">
              Visualizing the gap caused by long-distance transit freight & terminal cess
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Tap/Hover bars for itemized deductions</span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
              interval={0}
              angle={-18}
              textAnchor="end"
              height={40}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
            />
            <Bar
              dataKey="grossRevenue"
              name="Gross Revenue (₹)"
              fill="#cbd5e1"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="netEarnings"
              name="Net In-Hand Earnings (₹)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isHighestNet ? '#16a34a' : '#15803d'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 bg-earth-50 rounded-xl border border-earth-200 text-xs text-slate-600 flex items-center justify-between">
        <span>
          💡 <strong>Key Takeaway:</strong> Notice how distant mandis with taller grey bars (Gross) end up with shorter green bars (Net) once fuel and freight are deducted.
        </span>
      </div>
    </div>
  );
};


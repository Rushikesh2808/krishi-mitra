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
import { SellVsWaitAnalysis } from '../../../services/advisoryService';
import { formatINR } from '../../../utils/currency';
import { BarChart3, Info } from 'lucide-react';

interface AdvisoryComparisonChartProps {
  analysis: SellVsWaitAnalysis;
}

export const AdvisoryComparisonChart: React.FC<AdvisoryComparisonChartProps> = ({ analysis }) => {
  const { scenarioToday, scenarioWait, partialSplit } = analysis;

  const chartData = [
    {
      name: 'Sell Today',
      grossRevenue: scenarioToday.grossRevenue,
      totalExpenses: scenarioToday.totalExpenses,
      netEarnings: scenarioToday.netEarnings,
      realization: scenarioToday.realizationPercentage,
    },
    {
      name: `Wait ${analysis.holdingDays}d`,
      grossRevenue: scenarioWait.grossRevenue,
      totalExpenses: scenarioWait.totalExpenses,
      netEarnings: scenarioWait.netEarnings,
      realization: scenarioWait.realizationPercentage,
    },
  ];

  if (partialSplit) {
    chartData.push({
      name: 'Staggered (60/40)',
      grossRevenue: Math.round(scenarioToday.grossRevenue * 0.6 + scenarioWait.grossRevenue * 0.4),
      totalExpenses: Math.round(scenarioToday.totalExpenses * 0.6 + scenarioWait.totalExpenses * 0.4),
      netEarnings: partialSplit.blendedNetEarnings,
      realization: Number(
        (
          (partialSplit.blendedNetEarnings /
            (scenarioToday.grossRevenue * 0.6 + scenarioWait.grossRevenue * 0.4)) *
          100
        ).toFixed(1)
      ),
    });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 z-50">
          <div className="font-bold text-sm text-amber-300 border-b border-slate-700 pb-1">
            {data.name}
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-slate-400">Gross Expected:</span>
            <span className="font-semibold text-slate-200">{formatINR(data.grossRevenue)}</span>
          </div>
          <div className="flex justify-between space-x-4 text-rose-400">
            <span>Deductions (Freight/Storage/Cess):</span>
            <span className="font-semibold">- {formatINR(data.totalExpenses)}</span>
          </div>
          <div className="flex justify-between space-x-4 pt-1 border-t border-slate-700 font-bold text-emerald-400">
            <span>In-Hand Net Realization:</span>
            <span>{formatINR(data.netEarnings)}</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-0.5">
            Retained in pocket: {data.realization}% of gross
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-agri-100 text-agri-800 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-agri-700" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              In-Hand Net Realization Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Visualizing net profit differences after freight, storage charges, and mandi fees
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 self-start sm:self-auto">
          For {analysis.quantityQuintals} Qtl {analysis.cropName} @ {analysis.mandiName}
        </span>
      </div>

      {/* Recharts Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 15, left: 10, bottom: 10 }}
            barGap={6}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />

            <Bar
              dataKey="grossRevenue"
              name="Gross Revenue (₹)"
              fill="#cbd5e1"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            />
            <Bar
              dataKey="netEarnings"
              name="Net In-Hand Earnings (₹)"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 1 && analysis.netDifference > 0
                      ? '#16a34a'
                      : index === 0 && analysis.netDifference <= 0
                      ? '#16a34a'
                      : '#2e7d32'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


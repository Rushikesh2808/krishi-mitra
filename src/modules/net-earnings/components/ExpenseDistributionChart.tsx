import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { DetailedExpenseResult } from '../../../utils/calculations';
import { formatINR } from '../../../utils/currency';
import { PieChart as PieChartIcon } from 'lucide-react';

interface ExpenseDistributionChartProps {
  result: DetailedExpenseResult;
}

const COLORS = [
  '#2563eb', // Transportation (Blue)
  '#16a34a', // Loading/Hamali (Green)
  '#9333ea', // Storage (Purple)
  '#0d9488', // Labour (Teal)
  '#d97706', // APMC Cess (Amber)
  '#64748b', // Misc/Bags (Slate)
];

export const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({ result }) => {
  const data = [
    { name: 'Transportation Freight', value: result.transportCost },
    { name: 'Loading & Hamali', value: result.loadingUnloadingCost },
    { name: 'Storage Rent', value: result.storageCost },
    { name: 'Labour & Grading', value: result.labourCost },
    { name: 'APMC Market Cess', value: result.marketFees },
    { name: 'Gunny Bags & Misc', value: result.miscellaneousCost },
  ].filter((item) => item.value > 0);

  const total = result.totalExpenses;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 z-50">
          <div className="font-bold text-amber-300">{entry.name}</div>
          <div className="text-white font-black text-sm">{formatINR(entry.value)}</div>
          <div className="text-slate-400 text-[10px]">
            {pct}% of total {formatINR(total)} expenses
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
          <PieChartIcon className="w-4 h-4 text-blue-700" />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900">
            Expense Distribution Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Where your crop dispatch money is spent
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          No expenses recorded. All values are set to ₹0.
        </div>
      ) : (
        <div className="h-64 sm:h-72 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};


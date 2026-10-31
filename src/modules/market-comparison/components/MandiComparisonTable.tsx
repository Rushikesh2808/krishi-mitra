import React from 'react';
import { MandiComparisonEntry } from '../../../types';
import { formatINR, formatPerQuintal } from '../../../utils/currency';
import { Award, TrendingUp, Truck } from 'lucide-react';

interface MandiComparisonTableProps {
  entries: MandiComparisonEntry[];
  quantityQuintals: number;
}

export const MandiComparisonTable: React.FC<MandiComparisonTableProps> = ({
  entries,
  quantityQuintals,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">APMC Market</th>
              <th className="py-3 px-3">Distance</th>
              <th className="py-3 px-3">Quoted Rate</th>
              <th className="py-3 px-3">Gross Revenue</th>
              <th className="py-3 px-3">Transit Freight</th>
              <th className="py-3 px-3">Mandi Fees</th>
              <th className="py-3 px-4 text-right">In-Hand Net Earnings</th>
              <th className="py-3 px-3 text-center">Retention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {entries.map((entry) => (
              <tr
                key={entry.mandiId}
                className={`transition-colors ${
                  entry.isHighestNet
                    ? 'bg-agri-50/70 font-semibold'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Mandi & Badges */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-slate-900">{entry.mandiName}</span>
                    {entry.isHighestNet && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-agri-700 text-white">
                        <Award className="w-3 h-3 mr-0.5" /> Best Pick
                      </span>
                    )}
                    {entry.isHighestGrossPrice && !entry.isHighestNet && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                        <TrendingUp className="w-3 h-3 mr-0.5" /> High Price
                      </span>
                    )}
                    {entry.isLowestTransportCost && !entry.isHighestNet && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                        <Truck className="w-3 h-3 mr-0.5" /> Nearest
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{entry.district} District</div>
                </td>

                {/* Distance */}
                <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                  {entry.distanceKm} km
                </td>

                {/* Quoted Rate */}
                <td className="py-3.5 px-3 text-slate-900 font-bold whitespace-nowrap">
                  {formatINR(entry.pricePerQuintal)}
                </td>

                {/* Gross Revenue */}
                <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                  {formatINR(entry.grossRevenue)}
                </td>

                {/* Transportation Freight */}
                <td className="py-3.5 px-3 text-rose-700 font-semibold whitespace-nowrap">
                  - {formatINR(entry.transportationCost)}
                </td>

                {/* Fees & Hamali */}
                <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                  - {formatINR(entry.otherExpenses)}
                </td>

                {/* Net Earnings */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="font-black text-sm text-agri-900">
                    {formatINR(entry.netEarnings)}
                  </div>
                  <div className="text-[10px] text-agri-700 font-semibold">
                    {formatPerQuintal(entry.netEarningsPerQuintal)}
                  </div>
                </td>

                {/* Realization Rate */}
                <td className="py-3.5 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      entry.realizationPercentage >= 95
                        ? 'bg-emerald-100 text-emerald-800'
                        : entry.realizationPercentage >= 90
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {entry.realizationPercentage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


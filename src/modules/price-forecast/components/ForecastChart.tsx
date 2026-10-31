import React from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Legend
} from 'recharts';
import { DailyForecastPoint } from '../../../services/forecastService';
import { formatINR } from '../../../utils/currency';
import { TrendingUp, Info, Calendar } from 'lucide-react';

interface ForecastChartProps {
  points: DailyForecastPoint[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  cropName: string;
  mandiName: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  points,
  selectedDay,
  onSelectDay,
  cropName,
  mandiName,
}) => {
  // Compute Y-axis bounds to make the chart curve readable
  const allPrices = points.flatMap((p) => [p.minPrice, p.maxPrice, p.predictedPrice]);
  const minY = Math.floor((Math.min(...allPrices) - 50) / 50) * 50;
  const maxY = Math.ceil((Math.max(...allPrices) + 50) / 50) * 50;

  const currentPoint = points[0];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DailyForecastPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span className="font-bold text-amber-300 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400 mr-1" />
              <span>{data.fullDate}</span>
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                data.isReference
                  ? 'bg-blue-600 text-white'
                  : 'bg-agri-600 text-white'
              }`}
            >
              {data.isReference ? 'Actual Reference' : `Day ${data.day} Forecast`}
            </span>
          </div>

          <div className="flex justify-between space-x-4 pt-1">
            <span className="text-slate-400">Estimated Price:</span>
            <span className="font-bold text-sm text-white">{formatINR(data.predictedPrice)}/Qtl</span>
          </div>

          {!data.isReference && (
            <>
              <div className="flex justify-between space-x-4">
                <span className="text-slate-400">Expected Band:</span>
                <span className="font-semibold text-slate-300">
                  {formatINR(data.minPrice)} – {formatINR(data.maxPrice)}
                </span>
              </div>
              <div className="flex justify-between space-x-4">
                <span className="text-slate-400">Change vs Today:</span>
                <span
                  className={`font-bold ${
                    data.changeFromBase >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {data.changeFromBase >= 0 ? `+${formatINR(data.changeFromBase)}` : formatINR(data.changeFromBase)} (
                  {data.percentChange >= 0 ? `+${data.percentChange}%` : `${data.percentChange}%`})
                </span>
              </div>
              <div className="flex justify-between space-x-4 text-[10px] text-slate-400 pt-0.5 border-t border-slate-800">
                <span>Model Confidence:</span>
                <span className="text-amber-300 font-semibold">{data.confidenceScore}%</span>
              </div>
            </>
          )}

          <div className="text-[10px] text-slate-400 italic pt-1 text-center">
            Click point to lock Day {data.day}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
      {/* Chart Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              10-Day Predicted Price Trajectory & Confidence Range
            </h3>
            <p className="text-xs text-slate-500">
              {cropName} @ {mandiName} • Green line indicates predicted price, shaded band indicates uncertainty
            </p>
          </div>
        </div>

        {/* Legend pills */}
        <div className="flex items-center space-x-3 text-xs self-start sm:self-auto">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span className="text-slate-600">Actual Today</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-agri-600 inline-block rounded" />
            <span className="text-slate-600">Forecast</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-agri-100 border border-agri-300 inline-block rounded" />
            <span className="text-slate-600">Uncertainty Band</span>
          </div>
        </div>
      </div>

      {/* Main Chart Graphic */}
      <div className="h-72 sm:h-84 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={points}
            margin={{ top: 15, right: 15, left: 10, bottom: 25 }}
            onClick={(state) => {
              if (state && typeof state.activeTooltipIndex === 'number') {
                onSelectDay(state.activeTooltipIndex);
              }
            }}
          >
            <defs>
              <linearGradient id="confidenceArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#86efac" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#dcfce7" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="dateString"
              tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={45}
            />

            <YAxis
              domain={[minY, maxY]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(val) => `₹${val}`}
              width={55}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Confidence Band Shading (Max to Min) */}
            <Area
              type="monotone"
              dataKey="maxPrice"
              stroke="#86efac"
              strokeDasharray="2 2"
              fill="url(#confidenceArea)"
              name="Max Expected Range"
            />
            <Area
              type="monotone"
              dataKey="minPrice"
              stroke="#86efac"
              strokeDasharray="2 2"
              fill="#ffffff"
              name="Min Expected Range"
            />

            {/* Predicted Trajectory Line */}
            <Line
              type="monotone"
              dataKey="predictedPrice"
              stroke="#15803d"
              strokeWidth={3}
              dot={{ r: 4, fill: '#15803d', stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#16a34a', stroke: '#ffffff', strokeWidth: 2 }}
              name="Predicted Modal Price"
            />

            {/* Reference Dot for Today (Day 0) */}
            {currentPoint && (
              <ReferenceDot
                x={currentPoint.dateString}
                y={currentPoint.predictedPrice}
                r={6}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Helpful Chart Guidance Footer */}
      <div className="p-3 bg-earth-50 rounded-xl border border-earth-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>
          💡 <strong>How to read:</strong> Blue dot marks today's actual spot price. Shaded green band widens into Day 7–10 representing growing market uncertainty.
        </span>
        <span className="text-[11px] text-slate-500 shrink-0">
          Click any date to inspect detailed forecast
        </span>
      </div>
    </div>
  );
};

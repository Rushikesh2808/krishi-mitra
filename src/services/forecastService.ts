import { CROP_MANDI_PRICES, MOCK_CROPS, MANDI_LIST } from '../data/mockData';

export interface DailyForecastPoint {
  day: number;
  dateString: string;
  fullDate: string;
  predictedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidenceScore: number;
  changeFromBase: number;
  percentChange: number;
  isReference: boolean;
}

export interface CropForecastReport {
  cropId: string;
  cropName: string;
  marathiName: string;
  mandiId: string;
  mandiName: string;
  currentPrice: number;
  price3Day: number;
  price5Day: number;
  price10Day: number;
  highestPrice: number;
  highestPriceDay: number;
  lowestPrice: number;
  lowestPriceDay: number;
  overallTrend: 'Increasing' | 'Decreasing' | 'Fluctuating';
  overallChangePercent: number;
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  confidenceScore: number;
  uncertaintyBand: number;
  riskIndicator: 'Low' | 'Moderate' | 'High';
  rationale: string;
  points: DailyForecastPoint[];
}

// Seasonal Multiplier Trajectories for 10 Days across crops (Day 0 to Day 10)
const CROP_TREND_PATTERNS: Record<
  string,
  {
    multipliers: number[];
    overallTrend: 'Increasing' | 'Decreasing' | 'Fluctuating';
    confidenceLevel: 'High' | 'Moderate' | 'Low';
    confidenceScore: number;
    riskIndicator: 'Low' | 'Moderate' | 'High';
    rationale: string;
  }
> = {
  'crop-soybean': {
    // Upward trend: +0%, +0.6%, +1.4%, +2.2%, +3.1%, +4.2%, +5.1%, +5.5%, +5.2%, +4.8%, +4.5%
    multipliers: [1.0, 1.006, 1.014, 1.022, 1.031, 1.042, 1.051, 1.055, 1.052, 1.048, 1.045],
    overallTrend: 'Increasing',
    confidenceLevel: 'High',
    confidenceScore: 84,
    riskIndicator: 'Low',
    rationale:
      'Crushing plants in Vidarbha, Khandesh, and Indore are actively restocking before festive closures. Daily APMC arrivals in Lasalgaon and Nashik are tapering by 15-20%, creating upward spot pressure.',
  },
  'crop-onion': {
    // Downward trend: +0%, -0.8%, -1.7%, -2.5%, -3.8%, -4.9%, -6.0%, -6.8%, -7.4%, -8.0%, -8.5%
    multipliers: [1.0, 0.992, 0.983, 0.975, 0.962, 0.951, 0.94, 0.932, 0.926, 0.92, 0.915],
    overallTrend: 'Decreasing',
    confidenceLevel: 'High',
    confidenceScore: 82,
    riskIndicator: 'High',
    rationale:
      'Heavy Kharif fresh red onion arrivals from Ahmednagar, Solapur, and Belagavi (Karnataka) are flooding terminals. High relative humidity increases storage rotting and water loss risk. Early sale recommended.',
  },
  'crop-cotton': {
    // Steady to mild rise: +0%, +0.3%, +0.7%, +1.1%, +1.8%, +2.4%, +3.0%, +3.6%, +4.1%, +4.5%, +4.8%
    multipliers: [1.0, 1.003, 1.007, 1.011, 1.018, 1.024, 1.03, 1.036, 1.041, 1.045, 1.048],
    overallTrend: 'Increasing',
    confidenceLevel: 'Moderate',
    confidenceScore: 74,
    riskIndicator: 'Moderate',
    rationale:
      'Cotton Corporation of India (CCI) minimum support price (MSP ₹7,121) procurement windows are opening next week. Private ginners are lifting bids slightly to secure premium staple lots.',
  },
  'crop-wheat': {
    // Mild fluctuation: +0%, +0.4%, +0.8%, +1.2%, +1.5%, +1.8%, +2.2%, +2.5%, +2.7%, +2.9%, +3.1%
    multipliers: [1.0, 1.004, 1.008, 1.012, 1.015, 1.018, 1.022, 1.025, 1.027, 1.029, 1.031],
    overallTrend: 'Fluctuating',
    confidenceLevel: 'High',
    confidenceScore: 86,
    riskIndicator: 'Low',
    rationale:
      'Urban wheat flour mills in Pune and Mumbai maintain steady rolling procurement. Mandi supplies are well-balanced with minimal price volatility.',
  },
  'crop-gram': {
    // Steady rise: +0%, +0.5%, +1.1%, +1.7%, +2.3%, +2.9%, +3.5%, +3.9%, +4.2%, +4.3%, +4.2%
    multipliers: [1.0, 1.005, 1.011, 1.017, 1.023, 1.029, 1.035, 1.039, 1.042, 1.043, 1.042],
    overallTrend: 'Increasing',
    confidenceLevel: 'High',
    confidenceScore: 80,
    riskIndicator: 'Low',
    rationale:
      'Dal mill utilization across Ahmednagar and Latur is operating near 85% capacity. Festival pulse consumption is pulling spot rates upwards above MSP.',
  },
};

/**
 * Service function to calculate 10-day price forecast for any crop & mandi
 * Architecture prepared for seamless machine learning API integration
 */
export const get10DayCropForecast = (
  cropId: string,
  mandiId: string
): CropForecastReport => {
  const crop = MOCK_CROPS.find((c) => c.id === cropId) || MOCK_CROPS[0];
  const mandi = MANDI_LIST.find((m) => m.id === mandiId) || MANDI_LIST[0];

  const cropPriceTable = CROP_MANDI_PRICES[cropId] || CROP_MANDI_PRICES['crop-soybean'];
  const baselineRate = cropPriceTable[mandiId]?.price ?? 4850;

  const trendData = CROP_TREND_PATTERNS[cropId] || CROP_TREND_PATTERNS['crop-soybean'];

  // Current local time: 31 Oct 2026
  const baseDate = new Date(2026, 9, 31); // Month is 0-indexed: 9 = October

  const points: DailyForecastPoint[] = [];

  let highestPrice = -Infinity;
  let highestPriceDay = 0;
  let lowestPrice = Infinity;
  let lowestPriceDay = 0;

  for (let d = 0; d <= 10; d++) {
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + d);

    const dayName = targetDate.toLocaleDateString('en-IN', { weekday: 'short' });
    const monthName = targetDate.toLocaleDateString('en-IN', { month: 'short' });
    const dayNum = targetDate.getDate();

    const dateString = d === 0 ? 'Today (31 Oct)' : `${dayName}, ${dayNum} ${monthName}`;
    const fullDate = `${dayNum} ${monthName} 2026`;

    const multiplier = trendData.multipliers[d] ?? 1.0;
    const predictedPrice = Math.round(baselineRate * multiplier);

    // Confidence interval widens over time (Day 1: ±1.2%, Day 10: ±3.8%)
    const variancePercent = 0.012 + d * 0.0026;
    const varianceAmount = Math.round(predictedPrice * variancePercent);

    const minPrice = predictedPrice - varianceAmount;
    const maxPrice = predictedPrice + varianceAmount;

    // Confidence score degrades gracefully as prediction horizon extends
    const confidenceScore = Math.max(50, Math.round(96 - d * 2.4));

    const changeFromBase = predictedPrice - baselineRate;
    const percentChange = Number(((changeFromBase / baselineRate) * 100).toFixed(1));

    if (predictedPrice > highestPrice) {
      highestPrice = predictedPrice;
      highestPriceDay = d;
    }
    if (predictedPrice < lowestPrice) {
      lowestPrice = predictedPrice;
      lowestPriceDay = d;
    }

    points.push({
      day: d,
      dateString,
      fullDate,
      predictedPrice,
      minPrice,
      maxPrice,
      confidenceScore,
      changeFromBase,
      percentChange,
      isReference: d === 0,
    });
  }

  const price3Day = points[3]?.predictedPrice ?? baselineRate;
  const price5Day = points[5]?.predictedPrice ?? baselineRate;
  const price10Day = points[10]?.predictedPrice ?? baselineRate;

  const overallChangePercent = Number(
    (((price10Day - baselineRate) / baselineRate) * 100).toFixed(1)
  );

  const averageUncertainty = Math.round(
    points.reduce((acc, p) => acc + (p.maxPrice - p.minPrice) / 2, 0) / points.length
  );

  return {
    cropId: crop.id,
    cropName: crop.name,
    marathiName: crop.marathiName,
    mandiId: mandi.id,
    mandiName: mandi.name,
    currentPrice: baselineRate,
    price3Day,
    price5Day,
    price10Day,
    highestPrice,
    highestPriceDay,
    lowestPrice,
    lowestPriceDay,
    overallTrend: trendData.overallTrend,
    overallChangePercent,
    confidenceLevel: trendData.confidenceLevel,
    confidenceScore: trendData.confidenceScore,
    uncertaintyBand: averageUncertainty,
    riskIndicator: trendData.riskIndicator,
    rationale: trendData.rationale,
    points,
  };
};


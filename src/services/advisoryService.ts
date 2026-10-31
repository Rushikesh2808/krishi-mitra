import { MOCK_CROPS, MANDI_LIST, DISTANCE_MATRIX, CROP_MANDI_PRICES } from '../data/mockData';
import { get10DayCropForecast } from './forecastService';

export interface ScenarioBreakdown {
  label: string;
  dateString: string;
  pricePerQuintal: number;
  totalQuantityQuintals: number;
  effectiveQuantityQuintals: number;
  grossRevenue: number;
  transportCost: number;
  storageCost: number;
  spoilageLossAmount: number;
  mandiCess: number;
  handlingAndPackaging: number;
  otherExpenses: number;
  totalExpenses: number;
  netEarnings: number;
  netPerQuintal: number;
  realizationPercentage: number;
}

export interface PartialSplitSuggestion {
  sellNowQuintals: number;
  sellNowNetEarnings: number;
  holdQuintals: number;
  holdNetEarnings: number;
  blendedNetEarnings: number;
  blendedNetGainVsSellToday: number;
}

export interface SellVsWaitAnalysis {
  cropId: string;
  cropName: string;
  marathiName: string;
  mandiId: string;
  mandiName: string;
  villageId: string;
  distanceKm: number;
  quantityQuintals: number;
  holdingDays: number;
  storageRatePerDay: number;
  spoilagePercent: number;

  scenarioToday: ScenarioBreakdown;
  scenarioWait: ScenarioBreakdown;

  netDifference: number; // scenarioWait.netEarnings - scenarioToday.netEarnings
  netDiffPerQuintal: number;
  percentageGain: number;

  recommendation: {
    action: 'SELL_NOW' | 'WAIT' | 'SELL_PARTIALLY';
    badgeLabel: string;
    headline: string;
    recommendedWindow: string;
    confidenceLevel: 'High' | 'Moderate' | 'Low';
    confidenceScore: number;
    riskLevel: 'Low' | 'Moderate' | 'High';
    rationale: string;
    riskExplanation: string;
  };

  partialSplit?: PartialSplitSuggestion;
}

export const analyzeSellVsWait = (
  cropId: string,
  mandiId: string,
  villageId: string = 'v-niphad',
  quantityQuintals: number = 50,
  holdingDays: number = 5,
  customStorageRate?: number,
  customSpoilagePercent?: number
): SellVsWaitAnalysis => {
  const crop = MOCK_CROPS.find((c) => c.id === cropId) || MOCK_CROPS[0];
  const mandi = MANDI_LIST.find((m) => m.id === mandiId) || MANDI_LIST[0];

  const distances = DISTANCE_MATRIX[villageId] || DISTANCE_MATRIX['v-niphad'];
  const distanceKm = distances[mandi.id] ?? 35;

  // Base storage rates & default spoilage defaults by crop type
  const isPerishable = crop.category === 'Vegetables';
  const defaultStorageRate = isPerishable ? 4.0 : 3.0; // ₹/Qtl/day
  const defaultSpoilagePercent = isPerishable ? 4.5 : 0.0; // % weight decay

  const storageRate = customStorageRate !== undefined ? customStorageRate : defaultStorageRate;
  const spoilagePercent = customSpoilagePercent !== undefined ? customSpoilagePercent : defaultSpoilagePercent;

  // Forecast data for the chosen crop and mandi
  const forecastReport = get10DayCropForecast(cropId, mandiId);
  const todayPoint = forecastReport.points[0];
  const clampedHoldingDays = Math.min(10, Math.max(1, holdingDays));
  const futurePoint = forecastReport.points[clampedHoldingDays] || forecastReport.points[5];

  // Rate brackets for freight
  const ratePerKm = distanceKm > 100 ? 2.4 : distanceKm > 40 ? 2.6 : 2.8;
  const tollCorrridorFee = mandi.id === 'm-vashi' ? 1500 : 0;
  const transportCost = Math.round(distanceKm * ratePerKm * quantityQuintals + tollCorrridorFee);

  // Mandi handling rates
  let hamaliPerQuintal = 14;
  if (mandi.id === 'm-vashi') hamaliPerQuintal = 28;
  else if (mandi.id === 'm-pune') hamaliPerQuintal = 22;
  else if (mandi.id === 'm-nashik') hamaliPerQuintal = 18;
  const packagingPerQuintal = 12;
  const handlingAndPackaging = (hamaliPerQuintal + packagingPerQuintal) * quantityQuintals;

  // ================= SCENARIO A: SELL TODAY =================
  const grossToday = todayPoint.predictedPrice * quantityQuintals;
  const cessToday = Math.round((grossToday * 1.05) / 100);
  const otherExpensesToday = cessToday + handlingAndPackaging;
  const totalExpensesToday = transportCost + otherExpensesToday;
  const netToday = grossToday - totalExpensesToday;
  const netPerQuintalToday = Math.round(netToday / quantityQuintals);
  const realizationToday = Number(((netToday / grossToday) * 100).toFixed(1));

  const scenarioToday: ScenarioBreakdown = {
    label: 'Sell Today',
    dateString: 'Today (Immediate Sale)',
    pricePerQuintal: todayPoint.predictedPrice,
    totalQuantityQuintals: quantityQuintals,
    effectiveQuantityQuintals: quantityQuintals,
    grossRevenue: grossToday,
    transportCost,
    storageCost: 0,
    spoilageLossAmount: 0,
    mandiCess: cessToday,
    handlingAndPackaging,
    otherExpenses: otherExpensesToday,
    totalExpenses: totalExpensesToday,
    netEarnings: netToday,
    netPerQuintal: netPerQuintalToday,
    realizationPercentage: realizationToday,
  };

  // ================= SCENARIO B: WAIT AND SELL LATER =================
  const spoilageLossQty = (quantityQuintals * spoilagePercent) / 100;
  const effectiveFutureQty = Math.max(0, quantityQuintals - spoilageLossQty);

  const grossWait = Math.round(effectiveFutureQty * futurePoint.predictedPrice);
  const storageCostWait = Math.round(clampedHoldingDays * storageRate * quantityQuintals);
  const spoilageLossAmount = Math.round(spoilageLossQty * futurePoint.predictedPrice);

  const cessWait = Math.round((grossWait * 1.05) / 100);
  const handlingAndPackagingWait = Math.round((hamaliPerQuintal + packagingPerQuintal) * effectiveFutureQty);
  const otherExpensesWait = cessWait + handlingAndPackagingWait;

  const totalExpensesWait = transportCost + storageCostWait + otherExpensesWait;
  const netWait = grossWait - totalExpensesWait;
  const netPerQuintalWait = Math.round(netWait / quantityQuintals);
  const realizationWait = grossWait > 0 ? Number(((netWait / grossWait) * 100).toFixed(1)) : 0;

  const scenarioWait: ScenarioBreakdown = {
    label: `Wait ${clampedHoldingDays} Days`,
    dateString: futurePoint.fullDate,
    pricePerQuintal: futurePoint.predictedPrice,
    totalQuantityQuintals: quantityQuintals,
    effectiveQuantityQuintals: Number(effectiveFutureQty.toFixed(1)),
    grossRevenue: grossWait,
    transportCost,
    storageCost: storageCostWait,
    spoilageLossAmount,
    mandiCess: cessWait,
    handlingAndPackaging: handlingAndPackagingWait,
    otherExpenses: otherExpensesWait,
    totalExpenses: totalExpensesWait,
    netEarnings: netWait,
    netPerQuintal: netPerQuintalWait,
    realizationPercentage: realizationWait,
  };

  // ================= COMPARISON METRICS =================
  const netDifference = netWait - netToday;
  const netDiffPerQuintal = netPerQuintalWait - netPerQuintalToday;
  const percentageGain = netToday > 0 ? Number(((netDifference / netToday) * 100).toFixed(1)) : 0;

  // ================= RECOMMENDATION ENGINE =================
  let action: 'SELL_NOW' | 'WAIT' | 'SELL_PARTIALLY' = 'WAIT';
  let badgeLabel = 'WAIT & HOLD';
  let headline = `HOLD AND SELL ON ${futurePoint.fullDate.toUpperCase()}`;
  let recommendedWindow = `Next ${clampedHoldingDays} to ${Math.min(10, clampedHoldingDays + 2)} Days`;
  let rationale = '';
  let riskExplanation = '';

  // Condition 1: High Spoilage or Net Loss -> SELL NOW
  if (netDifference <= 0 || (isPerishable && spoilagePercent >= 4)) {
    action = 'SELL_NOW';
    badgeLabel = 'SELL NOW';
    headline = 'DISPATCH AND SELL IMMEDIATELY';
    recommendedWindow = 'Within 24 to 48 Hours';
    rationale = `Holding for ${clampedHoldingDays} days results in a projected net deficit of ${formatINR(Math.abs(netDifference))} (${formatINR(Math.abs(netDiffPerQuintal))}/Qtl) due to accumulated storage charges and moisture spoilage. Immediate sale protects your in-hand profit.`;
    riskExplanation = `High holding risk. Spoilage erosion (${spoilagePercent}%) and warehouse fees outweigh any modest price fluctuation.`;
  }
  // Condition 2: Marginal Net Gain (< ₹40/Qtl) -> SELL NOW (Risk does not justify waiting)
  else if (netDiffPerQuintal < 40) {
    action = 'SELL_NOW';
    badgeLabel = 'SELL NOW';
    headline = 'RECOMMENDED: SELL TODAY (LOW MARGINAL GAIN)';
    recommendedWindow = 'Within 1 to 2 Days';
    rationale = `Although future quoted price is slightly higher, the expected in-hand net gain is only +${formatINR(netDiffPerQuintal)}/Qtl (+${formatINR(netDifference)} total). This tiny advantage does not compensate for price volatility risk and capital blockage.`;
    riskExplanation = `The projected margin is too slim to offset unexpected APMC arrival spikes or physical weight shrinkage.`;
  }
  // Condition 3: Substantial Gain (>= ₹100/Qtl) with High/Moderate Confidence -> WAIT
  else if (netDiffPerQuintal >= 100 && futurePoint.confidenceScore >= 75 && spoilagePercent <= 2) {
    action = 'WAIT';
    badgeLabel = 'WAIT & HOLD';
    headline = `HOLD PRODUCE FOR ${clampedHoldingDays} DAYS FOR OPTIMAL GAIN`;
    recommendedWindow = `${futurePoint.dateString} Window`;
    rationale = `Strong market demand is projected to add +${formatINR(netDifference)} extra in-hand earnings (+${formatINR(netDiffPerQuintal)}/Qtl net). Total storage cost (${formatINR(storageCostWait)}) is small relative to the expected price surge.`;
    riskExplanation = `Favorable holding conditions. Grain moisture is stable and mandi arrivals are projected to tighten, supporting price appreciation.`;
  }
  // Condition 4: Moderate Gain or Moderate Uncertainty -> SELL PARTIALLY (Staggered Strategy)
  else {
    action = 'SELL_PARTIALLY';
    badgeLabel = 'STAGGERED SALE';
    headline = 'SELL PARTIALLY TODAY & HOLD THE REST';
    recommendedWindow = 'Sell 60% Today, Hold 40% for Upside';
    rationale = `A balanced hedge approach: Selling a portion now locks in immediate working cash flow at stable prices, while holding the remainder captures potential upside (+${formatINR(netDiffPerQuintal)}/Qtl) without full exposure to downside risk.`;
    riskExplanation = `Moderate volatility. Price upside is probable, but hedging protects you against unexpected mid-week arrival surges.`;
  }

  // Partial Split Calculation (60% Now, 40% Hold)
  const sellNowQty = Math.round(quantityQuintals * 0.6);
  const holdQty = quantityQuintals - sellNowQty;

  const sellNowNet = Math.round(sellNowQty * netPerQuintalToday);
  const holdNet = Math.round(holdQty * netPerQuintalWait);
  const blendedNet = sellNowNet + holdNet;
  const blendedGain = blendedNet - netToday;

  const partialSplit: PartialSplitSuggestion = {
    sellNowQuintals: sellNowQty,
    sellNowNetEarnings: sellNowNet,
    holdQuintals: holdQty,
    holdNetEarnings: holdNet,
    blendedNetEarnings: blendedNet,
    blendedNetGainVsSellToday: blendedGain,
  };

  return {
    cropId: crop.id,
    cropName: crop.name,
    marathiName: crop.marathiName,
    mandiId: mandi.id,
    mandiName: mandi.name,
    villageId,
    distanceKm,
    quantityQuintals,
    holdingDays: clampedHoldingDays,
    storageRatePerDay: storageRate,
    spoilagePercent,
    scenarioToday,
    scenarioWait,
    netDifference,
    netDiffPerQuintal,
    percentageGain,
    recommendation: {
      action,
      badgeLabel,
      headline,
      recommendedWindow,
      confidenceLevel: futurePoint.confidenceScore >= 80 ? 'High' : futurePoint.confidenceScore >= 65 ? 'Moderate' : 'Low',
      confidenceScore: futurePoint.confidenceScore,
      riskLevel: isPerishable || spoilagePercent >= 4 ? 'High' : netDiffPerQuintal < 50 ? 'Moderate' : 'Low',
      rationale,
      riskExplanation,
    },
    partialSplit,
  };
};

function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}


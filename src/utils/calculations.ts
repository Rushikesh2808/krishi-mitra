import { NetEarningsInput, NetEarningsResult, MandiComparisonEntry } from '../types';
import { MANDI_LIST, DISTANCE_MATRIX, CROP_MANDI_PRICES } from '../data/mockData';

export interface DetailedExpenseInputs {
  cropId: string;
  mandiId: string;
  quantityQuintals: number;
  pricePerQuintal: number;
  transportCost: number;
  loadingUnloadingCost: number;
  storageCost: number;
  labourCost: number;
  marketFees: number;
  miscellaneousCost: number;
}

export interface DetailedExpenseResult {
  grossRevenue: number;
  transportCost: number;
  loadingUnloadingCost: number;
  storageCost: number;
  labourCost: number;
  marketFees: number;
  miscellaneousCost: number;
  totalExpenses: number;
  netEarnings: number;
  totalExpensesPerQuintal: number;
  netEarningsPerQuintal: number;
  expensePercentage: number;
  realizationPercentage: number;
}

/**
 * Transparent Net Earnings Calculation Formula (Legacy & Dashboard):
 * Net Earnings = Expected Revenue - Transportation Cost - Storage Cost - Other Expenses
 */
export const calculateNetEarnings = (input: NetEarningsInput): NetEarningsResult => {
  const {
    quantityQuintals,
    expectedPricePerQuintal,
    distanceKm,
    transportRatePerKmPerQuintal,
    holdingDays,
    storageCostPerDayPerQuintal,
    mandiCessPercentage,
    loadingUnloadingCostPerQuintal,
    packagingCostPerQuintal,
  } = input;

  const expectedRevenue = quantityQuintals * expectedPricePerQuintal;
  const transportationCost = distanceKm * transportRatePerKmPerQuintal * quantityQuintals;
  const storageCost = holdingDays * storageCostPerDayPerQuintal * quantityQuintals;
  const mandiCessCost = (expectedRevenue * mandiCessPercentage) / 100;
  const handlingCost = loadingUnloadingCostPerQuintal * quantityQuintals;
  const packagingCost = packagingCostPerQuintal * quantityQuintals;
  const otherExpenses = mandiCessCost + handlingCost + packagingCost;
  const totalExpenses = transportationCost + storageCost + otherExpenses;
  const netEarnings = expectedRevenue - totalExpenses;
  const netEarningsPerQuintal = quantityQuintals > 0 ? netEarnings / quantityQuintals : 0;

  return {
    expectedRevenue,
    transportationCost,
    storageCost,
    mandiCessCost,
    handlingCost,
    otherExpenses,
    totalExpenses,
    netEarnings,
    netEarningsPerQuintal,
  };
};

/**
 * Transparent Net Earnings Calculation Formula:
 * Gross Revenue = Quantity * Selling Price
 * Total Expenses = Transport + Loading/Unloading + Storage + Labour + Market Fees + Misc
 * Net Earnings = Gross Revenue - Total Expenses
 */
export const calculateDetailedNetEarnings = (
  inputs: DetailedExpenseInputs
): DetailedExpenseResult => {
  const {
    quantityQuintals,
    pricePerQuintal,
    transportCost,
    loadingUnloadingCost,
    storageCost,
    labourCost,
    marketFees,
    miscellaneousCost,
  } = inputs;

  const validQty = Math.max(1, quantityQuintals);
  const validPrice = Math.max(0, pricePerQuintal);

  // 1. Gross Expected Revenue
  const grossRevenue = Math.round(validQty * validPrice);

  // 2. Total Expenses
  const totalExpenses = Math.max(
    0,
    Math.round(
      transportCost +
        loadingUnloadingCost +
        storageCost +
        labourCost +
        marketFees +
        miscellaneousCost
    )
  );

  // 3. Final In-Hand Net Earnings
  const netEarnings = grossRevenue - totalExpenses;

  // 4. Per Quintal Metrics
  const totalExpensesPerQuintal = validQty > 0 ? Math.round(totalExpenses / validQty) : 0;
  const netEarningsPerQuintal = validQty > 0 ? Math.round(netEarnings / validQty) : 0;

  // 5. Percentages
  const expensePercentage =
    grossRevenue > 0 ? Number(((totalExpenses / grossRevenue) * 100).toFixed(1)) : 0;
  const realizationPercentage =
    grossRevenue > 0 ? Number(((netEarnings / grossRevenue) * 100).toFixed(1)) : 0;

  return {
    grossRevenue,
    transportCost,
    loadingUnloadingCost,
    storageCost,
    labourCost,
    marketFees,
    miscellaneousCost,
    totalExpenses,
    netEarnings,
    totalExpensesPerQuintal,
    netEarningsPerQuintal,
    expensePercentage,
    realizationPercentage,
  };
};

/**
 * Auto-generate realistic APMC default expenses for pre-filling the calculator
 */
export const getDefaultMandiExpenseInputs = (
  cropId: string,
  mandiId: string,
  quantityQuintals: number = 50,
  villageId: string = 'v-niphad'
): DetailedExpenseInputs => {
  const cropPrices = CROP_MANDI_PRICES[cropId] || CROP_MANDI_PRICES['crop-soybean'];
  const villageDistances = DISTANCE_MATRIX[villageId] || DISTANCE_MATRIX['v-niphad'];

  const pricePerQuintal = cropPrices[mandiId]?.price ?? 4850;
  const distanceKm = villageDistances[mandiId] ?? 35;

  // Transport rate
  const ratePerKm = distanceKm > 100 ? 2.4 : distanceKm > 40 ? 2.6 : 2.8;
  const tollFee = mandiId === 'm-vashi' ? 1500 : 0;
  const transportCost = Math.round(distanceKm * ratePerKm * quantityQuintals + tollFee);

  // Loading/Hamali
  let hamaliPerQuintal = 14;
  if (mandiId === 'm-vashi') hamaliPerQuintal = 28;
  else if (mandiId === 'm-pune') hamaliPerQuintal = 22;
  else if (mandiId === 'm-nashik') hamaliPerQuintal = 18;
  const loadingUnloadingCost = Math.round(hamaliPerQuintal * quantityQuintals);

  // Storage cost (default 0 for immediate sale; farmer can edit)
  const storageCost = 0;

  // Labour / grading / weighing at farmgate & truck loading
  const labourCost = Math.round(10 * quantityQuintals);

  // Market Fees: APMC cess 1.05%
  const grossEstimate = pricePerQuintal * quantityQuintals;
  const marketFees = Math.round((grossEstimate * 1.05) / 100);

  // Miscellaneous / Gunny Bags (baradaan)
  const miscellaneousCost = Math.round(12 * quantityQuintals);

  return {
    cropId,
    mandiId,
    quantityQuintals,
    pricePerQuintal,
    transportCost,
    loadingUnloadingCost,
    storageCost,
    labourCost,
    marketFees,
    miscellaneousCost,
  };
};

/**
 * Compute Mandi Comparison Entries across all APMCs for a given crop, quantity & farmer village
 */
export const computeMandiComparisons = (
  cropId: string,
  quantityQuintals: number,
  villageId: string
): MandiComparisonEntry[] => {
  const cropPrices = CROP_MANDI_PRICES[cropId] || CROP_MANDI_PRICES['crop-soybean'];
  const villageDistances = DISTANCE_MATRIX[villageId] || DISTANCE_MATRIX['v-niphad'];

  const rawEntries = MANDI_LIST.map((mandi) => {
    const distanceKm = villageDistances[mandi.id] ?? 50;
    const priceData = cropPrices[mandi.id] ?? { price: 4800, dailyArrivalsTons: 300 };
    const pricePerQuintal = priceData.price;

    const grossRevenue = pricePerQuintal * quantityQuintals;

    let ratePerKmPerQuintal = 2.8;
    let tollCorrridorFee = 0;

    if (distanceKm > 100) {
      ratePerKmPerQuintal = 2.4;
    } else if (distanceKm > 40) {
      ratePerKmPerQuintal = 2.6;
    }

    if (mandi.id === 'm-vashi') {
      tollCorrridorFee = 1500;
    }

    const transportationCost = Math.round(distanceKm * ratePerKmPerQuintal * quantityQuintals + tollCorrridorFee);

    const mandiCess = Math.round((grossRevenue * 1.05) / 100);

    let hamaliPerQuintal = 14;
    if (mandi.id === 'm-vashi') hamaliPerQuintal = 28;
    else if (mandi.id === 'm-pune') hamaliPerQuintal = 22;
    else if (mandi.id === 'm-nashik') hamaliPerQuintal = 18;

    const packagingCost = 12 * quantityQuintals;
    const hamaliAndPackaging = Math.round(hamaliPerQuintal * quantityQuintals + packagingCost);
    const otherExpenses = mandiCess + hamaliAndPackaging;

    const totalDeductions = transportationCost + otherExpenses;
    const netEarnings = grossRevenue - totalDeductions;
    const netEarningsPerQuintal = quantityQuintals > 0 ? Math.round(netEarnings / quantityQuintals) : 0;
    const realizationPercentage = grossRevenue > 0 ? Number(((netEarnings / grossRevenue) * 100).toFixed(1)) : 0;

    return {
      mandiId: mandi.id,
      mandiName: mandi.name,
      marathiMandiName: mandi.marathiName,
      district: mandi.district,
      distanceKm,
      pricePerQuintal,
      grossRevenue,
      transportationCost,
      otherExpenses,
      mandiCess,
      hamaliAndPackaging,
      totalDeductions,
      netEarnings,
      netEarningsPerQuintal,
      realizationPercentage,
      isHighestNet: false,
      isHighestGrossPrice: false,
      isLowestTransportCost: false,
    };
  });

  let maxNet = -Infinity;
  let maxGrossPrice = -Infinity;
  let minTransport = Infinity;

  rawEntries.forEach((entry) => {
    if (entry.netEarnings > maxNet) maxNet = entry.netEarnings;
    if (entry.pricePerQuintal > maxGrossPrice) maxGrossPrice = entry.pricePerQuintal;
    if (entry.transportationCost < minTransport) minTransport = entry.transportationCost;
  });

  return rawEntries.map((entry) => ({
    ...entry,
    isHighestNet: entry.netEarnings === maxNet,
    isHighestGrossPrice: entry.pricePerQuintal === maxGrossPrice,
    isLowestTransportCost: entry.transportationCost === minTransport,
  }));
};

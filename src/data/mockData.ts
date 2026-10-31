import {
  Crop,
  Mandi,
  ForecastPoint,
  SellRecommendation,
  FarmerProfile,
  FarmerVillage
} from '../types';

export const CURRENT_FARMER: FarmerProfile = {
  id: 'farmer-mh-001',
  fullName: 'Ramesh Patil',
  village: 'Niphad',
  taluka: 'Niphad',
  district: 'Nashik',
  state: 'Maharashtra',
  mobile: '+91 98220 45678',
  preferredLanguage: 'Marathi',
  defaultCrops: ['crop-soybean', 'crop-onion', 'crop-cotton', 'crop-wheat', 'crop-gram'],
};

export const FARMER_VILLAGES: FarmerVillage[] = [
  { id: 'v-niphad', name: 'Niphad', marathiName: 'निफाड', taluka: 'Niphad', district: 'Nashik' },
  { id: 'v-dindori', name: 'Dindori', marathiName: 'दिंडोरी', taluka: 'Dindori', district: 'Nashik' },
  { id: 'v-sinnar', name: 'Sinnar', marathiName: 'सिन्नर', taluka: 'Sinnar', district: 'Nashik' },
  { id: 'v-yeola', name: 'Yeola', marathiName: 'येवला', taluka: 'Yeola', district: 'Nashik' },
  { id: 'v-malegaon', name: 'Malegaon', marathiName: 'मालेगाव', taluka: 'Malegaon', district: 'Nashik' },
  { id: 'v-kopargaon', name: 'Kopargaon', marathiName: 'कोपरगाव', taluka: 'Kopargaon', district: 'Ahmednagar' },
];

export const MANDI_LIST: {
  id: string;
  name: string;
  marathiName: string;
  district: string;
  state: string;
  type: 'APMC Major' | 'APMC Division' | 'Terminal APMC';
  description: string;
}[] = [
  {
    id: 'm-lasalgaon',
    name: 'Lasalgaon APMC',
    marathiName: 'लासलगाव कृषी उत्पन्न बाजार समिती',
    district: 'Nashik',
    state: 'Maharashtra',
    type: 'APMC Major',
    description: "Asia's benchmark trading hub for onions, pulses, and oilseeds with high commercial daily liquidity.",
  },
  {
    id: 'm-pimpalgaon',
    name: 'Pimpalgaon Baswant APMC',
    marathiName: 'पिंपळगाव बसवंत बाजार समिती',
    district: 'Nashik',
    state: 'Maharashtra',
    type: 'APMC Division',
    description: 'Closest APMC with low logistics turnaround, ideal for fast farmgate truck movement.',
  },
  {
    id: 'm-nashik',
    name: 'Nashik APMC (Dindori Road)',
    marathiName: 'नाशिक बाजार समिती (दिंडोरी रोड)',
    district: 'Nashik',
    state: 'Maharashtra',
    type: 'APMC Major',
    description: 'District headquarters market with verified electronic e-NAM weighing and multiple institutional buyers.',
  },
  {
    id: 'm-ahmednagar',
    name: 'Ahmednagar APMC',
    marathiName: 'अहमदनगर कृषी उत्पन्न बाजार समिती',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    type: 'APMC Major',
    description: 'High processing presence for pulses, wheat, and oilseed crushers across Western Maharashtra.',
  },
  {
    id: 'm-pune',
    name: 'Pune APMC (Gultekdi Market Yard)',
    marathiName: 'पुणे बाजार समिती (गुलटेकडी मार्केट यार्ड)',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'Terminal APMC',
    description: 'Major regional metropolitan consumption market with premium wholesale rates for quality grades.',
  },
  {
    id: 'm-vashi',
    name: 'Vashi APMC (Navi Mumbai)',
    marathiName: 'वाशी मुंबई कृषी उत्पन्न बाजार समिती',
    district: 'Thane / Mumbai',
    state: 'Maharashtra',
    type: 'Terminal APMC',
    description: 'Export terminal and Mumbai metropolitan market. Highest quoted gross rates, but requires heavy long-haul transit.',
  },
];

// Distance matrix (in km) from farmer village origin to each APMC mandi
export const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  'v-niphad': {
    'm-lasalgaon': 18,
    'm-pimpalgaon': 22,
    'm-nashik': 38,
    'm-ahmednagar': 135,
    'm-vashi': 210,
    'm-pune': 215,
  },
  'v-dindori': {
    'm-lasalgaon': 44,
    'm-pimpalgaon': 24,
    'm-nashik': 25,
    'm-ahmednagar': 162,
    'm-vashi': 205,
    'm-pune': 230,
  },
  'v-sinnar': {
    'm-lasalgaon': 62,
    'm-pimpalgaon': 48,
    'm-nashik': 28,
    'm-ahmednagar': 115,
    'm-vashi': 190,
    'm-pune': 180,
  },
  'v-yeola': {
    'm-lasalgaon': 28,
    'm-pimpalgaon': 55,
    'm-nashik': 82,
    'm-ahmednagar': 110,
    'm-vashi': 245,
    'm-pune': 195,
  },
  'v-malegaon': {
    'm-lasalgaon': 68,
    'm-pimpalgaon': 75,
    'm-nashik': 105,
    'm-ahmednagar': 185,
    'm-vashi': 275,
    'm-pune': 270,
  },
  'v-kopargaon': {
    'm-lasalgaon': 42,
    'm-pimpalgaon': 60,
    'm-nashik': 88,
    'm-ahmednagar': 90,
    'm-vashi': 235,
    'm-pune': 185,
  },
};

// Crop-specific market prices (in ₹/Quintal) across Maharashtra APMCs
export const CROP_MANDI_PRICES: Record<string, Record<string, { price: number; dailyArrivalsTons: number }>> = {
  'crop-soybean': {
    'm-lasalgaon': { price: 4890, dailyArrivalsTons: 620 },
    'm-pimpalgaon': { price: 4820, dailyArrivalsTons: 380 },
    'm-nashik': { price: 4850, dailyArrivalsTons: 510 },
    'm-ahmednagar': { price: 4920, dailyArrivalsTons: 440 },
    'm-pune': { price: 5010, dailyArrivalsTons: 310 },
    'm-vashi': { price: 5080, dailyArrivalsTons: 190 },
  },
  'crop-onion': {
    'm-lasalgaon': { price: 2420, dailyArrivalsTons: 2850 },
    'm-pimpalgaon': { price: 2380, dailyArrivalsTons: 2100 },
    'm-nashik': { price: 2350, dailyArrivalsTons: 1400 },
    'm-ahmednagar': { price: 2280, dailyArrivalsTons: 950 },
    'm-pune': { price: 2520, dailyArrivalsTons: 1100 },
    'm-vashi': { price: 2650, dailyArrivalsTons: 750 },
  },
  'crop-cotton': {
    'm-lasalgaon': { price: 7050, dailyArrivalsTons: 280 },
    'm-pimpalgaon': { price: 6980, dailyArrivalsTons: 140 },
    'm-nashik': { price: 7080, dailyArrivalsTons: 320 },
    'm-ahmednagar': { price: 7280, dailyArrivalsTons: 650 },
    'm-pune': { price: 7150, dailyArrivalsTons: 180 },
    'm-vashi': { price: 7350, dailyArrivalsTons: 90 },
  },
  'crop-wheat': {
    'm-lasalgaon': { price: 2880, dailyArrivalsTons: 410 },
    'm-pimpalgaon': { price: 2840, dailyArrivalsTons: 220 },
    'm-nashik': { price: 2920, dailyArrivalsTons: 580 },
    'm-ahmednagar': { price: 2900, dailyArrivalsTons: 490 },
    'm-pune': { price: 3120, dailyArrivalsTons: 740 },
    'm-vashi': { price: 3180, dailyArrivalsTons: 360 },
  },
  'crop-gram': {
    'm-lasalgaon': { price: 5450, dailyArrivalsTons: 390 },
    'm-pimpalgaon': { price: 5400, dailyArrivalsTons: 210 },
    'm-nashik': { price: 5480, dailyArrivalsTons: 340 },
    'm-ahmednagar': { price: 5620, dailyArrivalsTons: 520 },
    'm-pune': { price: 5680, dailyArrivalsTons: 290 },
    'm-vashi': { price: 5750, dailyArrivalsTons: 180 },
  },
};

export const MOCK_CROPS: (Crop & {
  currentQuantityQuintals: number;
  samplePricePerQuintal: number;
  priceTrend: 'rising' | 'falling' | 'stable';
  trendPercent: number;
  bestMandiName: string;
  bestMandiDistanceKm: number;
  bestMandiNetPrice: number;
  lowestTransportMandiName: string;
  lowestTransportCostPerQuintal: number;
  advisory: SellRecommendation;
  forecastSummary: {
    min10DayPrice: number;
    max10DayPrice: number;
    projectedChangePercent: number;
  };
})[] = [
  {
    id: 'crop-soybean',
    name: 'Soybean',
    marathiName: 'सोयाबीन (JS-335)',
    category: 'Oilseeds',
    standardUnit: 'Quintal',
    icon: '🌱',
    typicalShelfLifeDays: 180,
    currentQuantityQuintals: 50,
    samplePricePerQuintal: 4850,
    priceTrend: 'rising',
    trendPercent: 2.8,
    bestMandiName: 'Lasalgaon APMC',
    bestMandiDistanceKm: 18,
    bestMandiNetPrice: 4762,
    lowestTransportMandiName: 'Lasalgaon APMC',
    lowestTransportCostPerQuintal: 50,
    advisory: {
      cropId: 'crop-soybean',
      action: 'WAIT_SHORT_TERM',
      confidenceLevel: 'High',
      recommendedWindow: 'Nov 4 – Nov 7 (Hold 4-6 Days)',
      projectedNetGainPerQuintal: 230,
      riskFactor: 'Low',
      rationale:
        'Crushing plant demand in Vidarbha and Khandesh is accelerating. Lasalgaon arrivals are down 18%, projecting a ₹200-₹260/Qtl gain that comfortably outpaces storage cost (₹15/Qtl for 5 days).',
      storageFeasibilityNotice: 'Moisture content is optimal (<10%). Dry storage holding risk is minimal.',
    },
    forecastSummary: {
      min10DayPrice: 4850,
      max10DayPrice: 5120,
      projectedChangePercent: 5.5,
    },
  },
  {
    id: 'crop-onion',
    name: 'Red Onion (Kharif)',
    marathiName: 'लाल कांदा (खरीप)',
    category: 'Vegetables',
    standardUnit: 'Quintal',
    icon: '🧅',
    typicalShelfLifeDays: 25,
    currentQuantityQuintals: 75,
    samplePricePerQuintal: 2350,
    priceTrend: 'falling',
    trendPercent: -3.5,
    bestMandiName: 'Lasalgaon APMC',
    bestMandiDistanceKm: 18,
    bestMandiNetPrice: 2315,
    lowestTransportMandiName: 'Lasalgaon APMC',
    lowestTransportCostPerQuintal: 50,
    advisory: {
      cropId: 'crop-onion',
      action: 'SELL_NOW',
      confidenceLevel: 'High',
      recommendedWindow: 'Within next 24-48 hours',
      projectedNetGainPerQuintal: -120,
      riskFactor: 'High',
      rationale:
        'Heavy Kharif fresh arrivals from Ahmednagar and Karnataka markets are starting. High humidity increases weight loss and spoilage risk (3-5% weight loss over 7 days). Immediate sale preserves net profit.',
      storageFeasibilityNotice: 'Kharif onions possess high moisture and do not store well. Sell immediately.',
    },
    forecastSummary: {
      min10DayPrice: 2050,
      max10DayPrice: 2380,
      projectedChangePercent: -8.5,
    },
  },
  {
    id: 'crop-cotton',
    name: 'Cotton (Kapus)',
    marathiName: 'कापूस (मध्यम धागा)',
    category: 'Commercial',
    standardUnit: 'Quintal',
    icon: '☁️',
    typicalShelfLifeDays: 240,
    currentQuantityQuintals: 30,
    samplePricePerQuintal: 7080,
    priceTrend: 'stable',
    trendPercent: 0.4,
    bestMandiName: 'Ahmednagar APMC',
    bestMandiDistanceKm: 135,
    bestMandiNetPrice: 6865,
    lowestTransportMandiName: 'Lasalgaon APMC',
    lowestTransportCostPerQuintal: 50,
    advisory: {
      cropId: 'crop-cotton',
      action: 'WAIT_HARVEST_PEAK',
      confidenceLevel: 'Medium',
      recommendedWindow: 'Mid November (Hold 12-15 Days)',
      projectedNetGainPerQuintal: 380,
      riskFactor: 'Moderate',
      rationale:
        'CCI (Cotton Corporation of India) procurement centers are scheduled to open operations next week at MSP (₹7,121). Private ginners are anticipated to increase bids to secure quality lots.',
      storageFeasibilityNotice: 'Store in moisture-proof sheds to prevent discoloration and weight changes.',
    },
    forecastSummary: {
      min10DayPrice: 7050,
      max10DayPrice: 7520,
      projectedChangePercent: 4.8,
    },
  },
  {
    id: 'crop-wheat',
    name: 'Wheat (Lokwan)',
    marathiName: 'गहू (लोकवन)',
    category: 'Cereals',
    standardUnit: 'Quintal',
    icon: '🌾',
    typicalShelfLifeDays: 365,
    currentQuantityQuintals: 40,
    samplePricePerQuintal: 2920,
    priceTrend: 'rising',
    trendPercent: 1.5,
    bestMandiName: 'Nashik APMC',
    bestMandiDistanceKm: 38,
    bestMandiNetPrice: 2788,
    lowestTransportMandiName: 'Lasalgaon APMC',
    lowestTransportCostPerQuintal: 50,
    advisory: {
      cropId: 'crop-wheat',
      action: 'WAIT_SHORT_TERM',
      confidenceLevel: 'High',
      recommendedWindow: 'Hold 7-10 Days',
      projectedNetGainPerQuintal: 110,
      riskFactor: 'Low',
      rationale: 'Consumer wheat demand is strong in Nashik and Pune flour mills. Flour mills are bidding actively above MSP.',
      storageFeasibilityNotice: 'Grain is dry (<11% moisture). Safe in dry warehouse for up to 12 months.',
    },
    forecastSummary: {
      min10DayPrice: 2880,
      max10DayPrice: 3080,
      projectedChangePercent: 3.2,
    },
  },
  {
    id: 'crop-gram',
    name: 'Gram / Chana',
    marathiName: 'हरभरा (चना)',
    category: 'Pulses',
    standardUnit: 'Quintal',
    icon: '🥣',
    typicalShelfLifeDays: 270,
    currentQuantityQuintals: 45,
    samplePricePerQuintal: 5480,
    priceTrend: 'rising',
    trendPercent: 2.1,
    bestMandiName: 'Ahmednagar APMC',
    bestMandiDistanceKm: 135,
    bestMandiNetPrice: 5210,
    lowestTransportMandiName: 'Lasalgaon APMC',
    lowestTransportCostPerQuintal: 50,
    advisory: {
      cropId: 'crop-gram',
      action: 'WAIT_SHORT_TERM',
      confidenceLevel: 'High',
      recommendedWindow: 'Hold 5-8 Days',
      projectedNetGainPerQuintal: 190,
      riskFactor: 'Low',
      rationale: 'Dal mills in Ahmednagar and Latur are operating at high capacity. Strong festive demand ahead.',
      storageFeasibilityNotice: 'Pulse storage is safe from pest infestation if kept airtight and dry.',
    },
    forecastSummary: {
      min10DayPrice: 5450,
      max10DayPrice: 5750,
      projectedChangePercent: 4.2,
    },
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Lasalgaon Mandi Soybean Rate Alert',
    message: 'Modal price rose by ₹85/Qtl today due to increased oil miller inquiries.',
    time: '2 hours ago',
    type: 'price_up',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Sahyadri Farmers FPO New Buying Bid',
    message: 'Offering ₹4,890/Qtl for 50+ Qtl Soybean with farmgate pickup in Niphad.',
    time: '4 hours ago',
    type: 'fpo_offer',
    read: false,
  },
];

export type CropCategory = 'Cereals' | 'Pulses' | 'Oilseeds' | 'Vegetables' | 'Commercial';

export interface Crop {
  id: string;
  name: string;
  marathiName: string;
  category: CropCategory;
  standardUnit: 'Quintal' | 'Kg' | 'Ton';
  icon: string;
  typicalShelfLifeDays: number;
}

export interface FarmerVillage {
  id: string;
  name: string;
  marathiName: string;
  taluka: string;
  district: string;
}

export interface Mandi {
  id: string;
  name: string;
  marathiName: string;
  district: string;
  state: string;
  distanceKm: number;
  currentModalPrice: number; // ₹ per quintal
  minPrice: number;
  maxPrice: number;
  dailyArrivalsTons: number;
  lastUpdated: string;
}

export interface ForecastPoint {
  day: number;
  date: string;
  estimatedPrice: number;
  confidenceLower: number;
  confidenceUpper: number;
  confidenceScore: number; // 0 to 100%
  expectedTrend: 'rising' | 'falling' | 'stable';
  isSampleData: boolean;
}

export interface NetEarningsInput {
  cropId: string;
  quantityQuintals: number;
  expectedPricePerQuintal: number;
  distanceKm: number;
  transportRatePerKmPerQuintal: number;
  holdingDays: number;
  storageCostPerDayPerQuintal: number;
  mandiCessPercentage: number;
  loadingUnloadingCostPerQuintal: number;
  packagingCostPerQuintal: number;
}

export interface NetEarningsResult {
  expectedRevenue: number;
  transportationCost: number;
  storageCost: number;
  mandiCessCost: number;
  handlingCost: number;
  otherExpenses: number;
  totalExpenses: number;
  netEarnings: number;
  netEarningsPerQuintal: number;
}

export interface MandiComparisonEntry {
  mandiId: string;
  mandiName: string;
  marathiMandiName: string;
  district: string;
  distanceKm: number;
  pricePerQuintal: number;
  grossRevenue: number;
  transportationCost: number;
  otherExpenses: number;
  mandiCess: number;
  hamaliAndPackaging: number;
  totalDeductions: number;
  netEarnings: number;
  netEarningsPerQuintal: number;
  realizationPercentage: number;
  isHighestNet: boolean;
  isHighestGrossPrice: boolean;
  isLowestTransportCost: boolean;
}

export interface SellRecommendation {
  cropId: string;
  action: 'SELL_NOW' | 'WAIT_SHORT_TERM' | 'WAIT_HARVEST_PEAK';
  confidenceLevel: 'High' | 'Medium' | 'Low';
  recommendedWindow: string; // e.g. "Next 2-3 Days"
  projectedNetGainPerQuintal: number;
  riskFactor: 'Low' | 'Moderate' | 'High';
  rationale: string;
  storageFeasibilityNotice: string;
}

export interface BuyerOffer {
  id: string;
  buyerName: string;
  organizationType: 'FPO' | 'Agri-Processor' | 'Bulk Wholesaler' | 'Exporter';
  location: string;
  offeredPricePerQuintal: number;
  minimumQuantityQuintals: number;
  pickupOffered: boolean;
  paymentTerms: string;
  status: 'Open' | 'Negotiating' | 'Accepted' | 'Declined';
}

export interface FarmerProfile {
  id: string;
  fullName: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  mobile: string;
  preferredLanguage: 'English' | 'Marathi' | 'Hindi';
  defaultCrops: string[];
}

export type UserRole = 'FARMER' | 'FPO' | 'BUYER';

export interface UserAccount {
  id: string;
  role: UserRole;
  fullName: string;
  mobile: string;
  email?: string;
  // Farmer fields
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  landAcreage?: number;
  storageType?: string;
  preferredLanguage?: 'English' | 'Marathi' | 'Hindi';
  preferredCrops?: string[];
  
  // FPO fields
  organizationName?: string;
  authorizedPerson?: string;
  designation?: string;
  registrationNumber?: string;
  operatingLocation?: string;
  establishedYear?: number;
  activeMembersCount?: number;
  facilities?: string[];

  // Buyer fields
  businessName?: string;
  contactPerson?: string;
  buyerType?: 'Agri-Processor' | 'Bulk Wholesaler' | 'Exporter' | 'Retail Chain';
  gstNumber?: string;
  defaultPaymentTerms?: string;
}

export interface FarmerCropRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  village: string;
  district: string;
  cropName: string;
  cropVariety: string;
  cultivationAreaAcres: number;
  sowingDate: string;
  expectedHarvestDate: string;
  expectedQuantityQuintals: number;
  actualHarvestedQuantity: number;
  listedQuantity: number;
  committedQuantity: number;
  availableQuantity: number; // actualHarvestedQuantity - listedQuantity - committedQuantity
  cropQuality: 'Grade A (Export)' | 'Grade A (Commercial)' | 'Grade B (FAQ)';
  storageStatus: 'On-Farm Dry Shed' | 'Warehouse Pallets' | 'Kanda Chawl' | 'Awaiting Storage' | 'Sold Out';
  storageLocation: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

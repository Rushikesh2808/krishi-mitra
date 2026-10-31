import { computeMandiComparisons } from '../utils/calculations';
import { MANDI_LIST, CROP_MANDI_PRICES } from './mockData';

export interface FpoMemberFarmer {
  id: string;
  name: string;
  village: string;
  taluka: string;
  mobile: string;
  landAcreage: number;
  primaryCrops: string[];
  totalBatchesSubmitted: number;
  joinDate: string;
}

export interface FpoProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  village: string;
  cropName: string;
  variety: string;
  quantityQuintals: number;
  expectedPricePerQuintal: number;
  moisturePercentage: number;
  harvestDate: string;
  status: 'Ready for Aggregation' | 'Pooled in Bulk Lot' | 'Sold';
  batchCode: string;
}

export interface FpoAggregatedLot {
  id: string;
  lotCode: string;
  cropName: string;
  variety: string;
  totalQuantityQuintals: number;
  contributingFarmersCount: number;
  targetPricePerQuintal: number;
  warehouseLocation: string;
  qualityGrade: 'Grade A (Export)' | 'Grade A (Commercial)' | 'Grade B';
  status: 'Open for Bids' | 'Bidding in Progress' | 'Contract Finalized';
  highestBidPrice: number;
  activeBiddersCount: number;
}

export interface BuyerRequirement {
  id: string;
  buyerName: string;
  buyerType: string;
  cropName: string;
  requiredQuantityQuintals: number;
  maxOfferedPricePerQuintal: number;
  preferredPickupLocation: string;
  deliveryTerms: 'Farmgate Pickup' | 'FPO Warehouse Delivery' | 'Mandi Delivery';
  qualityCriteria: string;
  status: 'Open' | 'Partially Fulfilled' | 'Closed';
  postedDate: string;
}

export interface BuyerSubmittedOffer {
  id: string;
  requirementId?: string;
  lotId?: string;
  sellerType: 'FPO' | 'Individual Farmer';
  sellerName: string;
  cropName: string;
  quantityQuintals: number;
  offeredPricePerQuintal: number;
  sellerCounterPrice?: number;
  paymentTerms: string;
  deliveryDate: string;
  status: 'Pending Review' | 'Counter Offer Received' | 'Accepted' | 'Declined';
}

export const MOCK_FPO_MEMBERS: FpoMemberFarmer[] = [
  {
    id: 'mem-01',
    name: 'Ramesh Patil',
    village: 'Niphad',
    taluka: 'Niphad',
    mobile: '98220 45678',
    landAcreage: 6.5,
    primaryCrops: ['Soybean', 'Red Onion'],
    totalBatchesSubmitted: 8,
    joinDate: 'March 2023',
  },
  {
    id: 'mem-02',
    name: 'Suresh More',
    village: 'Pimpalgaon',
    taluka: 'Niphad',
    mobile: '98501 99234',
    landAcreage: 8.0,
    primaryCrops: ['Soybean', 'Wheat'],
    totalBatchesSubmitted: 12,
    joinDate: 'January 2022',
  },
  {
    id: 'mem-03',
    name: 'Ganesh Jadhav',
    village: 'Dindori',
    taluka: 'Dindori',
    mobile: '94222 77112',
    landAcreage: 12.0,
    primaryCrops: ['Soybean', 'Cotton', 'Gram'],
    totalBatchesSubmitted: 15,
    joinDate: 'July 2021',
  },
  {
    id: 'mem-04',
    name: 'Bhaskar Wagh',
    village: 'Lasalgaon',
    taluka: 'Niphad',
    mobile: '98234 55678',
    landAcreage: 5.0,
    primaryCrops: ['Red Onion', 'Soybean'],
    totalBatchesSubmitted: 6,
    joinDate: 'September 2023',
  },
  {
    id: 'mem-05',
    name: 'Dnyaneshwar Shinde',
    village: 'Sinnar',
    taluka: 'Sinnar',
    mobile: '99210 33455',
    landAcreage: 7.5,
    primaryCrops: ['Wheat', 'Gram'],
    totalBatchesSubmitted: 9,
    joinDate: 'November 2022',
  },
];

export const MOCK_FARMER_LISTINGS: FpoProduceListing[] = [
  {
    id: 'list-01',
    farmerId: 'mem-01',
    farmerName: 'Ramesh Patil',
    village: 'Niphad',
    cropName: 'Soybean',
    variety: 'JS-335 (Yellow)',
    quantityQuintals: 50,
    expectedPricePerQuintal: 4850,
    moisturePercentage: 9.2,
    harvestDate: '24 Oct 2026',
    status: 'Ready for Aggregation',
    batchCode: 'LOT-SB-NP-01',
  },
  {
    id: 'list-02',
    farmerId: 'mem-02',
    farmerName: 'Suresh More',
    village: 'Pimpalgaon',
    cropName: 'Soybean',
    variety: 'JS-335 (Yellow)',
    quantityQuintals: 80,
    expectedPricePerQuintal: 4880,
    moisturePercentage: 9.0,
    harvestDate: '26 Oct 2026',
    status: 'Pooled in Bulk Lot',
    batchCode: 'LOT-SB-PG-02',
  },
  {
    id: 'list-03',
    farmerId: 'mem-03',
    farmerName: 'Ganesh Jadhav',
    village: 'Dindori',
    cropName: 'Soybean',
    variety: 'JS-9305',
    quantityQuintals: 120,
    expectedPricePerQuintal: 4900,
    moisturePercentage: 8.8,
    harvestDate: '28 Oct 2026',
    status: 'Pooled in Bulk Lot',
    batchCode: 'LOT-SB-DN-03',
  },
  {
    id: 'list-04',
    farmerId: 'mem-04',
    farmerName: 'Bhaskar Wagh',
    village: 'Lasalgaon',
    cropName: 'Red Onion',
    variety: 'Garwa / Kharif',
    quantityQuintals: 150,
    expectedPricePerQuintal: 2400,
    moisturePercentage: 12.5,
    harvestDate: '29 Oct 2026',
    status: 'Ready for Aggregation',
    batchCode: 'LOT-ON-LS-04',
  },
  {
    id: 'list-05',
    farmerId: 'mem-05',
    farmerName: 'Dnyaneshwar Shinde',
    village: 'Sinnar',
    cropName: 'Gram / Chana',
    variety: 'Vijay Bold',
    quantityQuintals: 90,
    expectedPricePerQuintal: 5500,
    moisturePercentage: 8.5,
    harvestDate: '22 Oct 2026',
    status: 'Ready for Aggregation',
    batchCode: 'LOT-CH-SN-05',
  },
];

export const MOCK_AGGREGATED_LOTS: FpoAggregatedLot[] = [
  {
    id: 'agg-01',
    lotCode: 'SAHYADRI-BULK-SB-2026-A',
    cropName: 'Soybean',
    variety: 'Yellow JS-335 Grade A',
    totalQuantityQuintals: 500,
    contributingFarmersCount: 8,
    targetPricePerQuintal: 4950,
    warehouseLocation: 'Sahyadri Agri Warehouse, Dindori Road, Nashik',
    qualityGrade: 'Grade A (Export)',
    status: 'Bidding in Progress',
    highestBidPrice: 4910,
    activeBiddersCount: 4,
  },
  {
    id: 'agg-02',
    lotCode: 'SAHYADRI-BULK-ON-2026-B',
    cropName: 'Red Onion',
    variety: 'Nashik Garwa Kharif Medium Bold',
    totalQuantityQuintals: 800,
    contributingFarmersCount: 11,
    targetPricePerQuintal: 2450,
    warehouseLocation: 'Lasalgaon Cold Chain Facility',
    qualityGrade: 'Grade A (Commercial)',
    status: 'Open for Bids',
    highestBidPrice: 2420,
    activeBiddersCount: 3,
  },
  {
    id: 'agg-03',
    lotCode: 'SAHYADRI-BULK-CH-2026-C',
    cropName: 'Gram / Chana',
    variety: 'Vijay Bold Chana',
    totalQuantityQuintals: 350,
    contributingFarmersCount: 6,
    targetPricePerQuintal: 5580,
    warehouseLocation: 'Sahyadri Warehouse #2, Niphad',
    qualityGrade: 'Grade A (Export)',
    status: 'Contract Finalized',
    highestBidPrice: 5550,
    activeBiddersCount: 2,
  },
];

export const MOCK_BUYER_REQUIREMENTS: BuyerRequirement[] = [
  {
    id: 'req-01',
    buyerName: 'Khandesh Agro-Processing Mills',
    buyerType: 'Agri-Processor',
    cropName: 'Soybean',
    requiredQuantityQuintals: 600,
    maxOfferedPricePerQuintal: 4940,
    preferredPickupLocation: 'Nashik / Niphad / Dindori Cluster',
    deliveryTerms: 'FPO Warehouse Delivery',
    qualityCriteria: 'Moisture <10%, Foreign matter <2%, Oil content >18%',
    status: 'Open',
    postedDate: '30 Oct 2026',
  },
  {
    id: 'req-02',
    buyerName: 'Mahindra Agri Solutions Bulk Export',
    buyerType: 'Exporter',
    cropName: 'Red Onion',
    requiredQuantityQuintals: 1000,
    maxOfferedPricePerQuintal: 2480,
    preferredPickupLocation: 'Lasalgaon / Pimpalgaon Region',
    deliveryTerms: 'Farmgate Pickup',
    qualityCriteria: 'Size 45-55mm, Red skin intact, zero sprouting',
    status: 'Open',
    postedDate: '29 Oct 2026',
  },
  {
    id: 'req-03',
    buyerName: 'ITC Choupal Fresh Grains',
    buyerType: 'Retail Chain / Aggregator',
    cropName: 'Wheat',
    requiredQuantityQuintals: 400,
    maxOfferedPricePerQuintal: 2950,
    preferredPickupLocation: 'Nashik District',
    deliveryTerms: 'Mandi Delivery',
    qualityCriteria: 'Lokwan Sharbati Bold, Moisture <11%',
    status: 'Partially Fulfilled',
    postedDate: '27 Oct 2026',
  },
];

export const MOCK_BUYER_OFFERS: BuyerSubmittedOffer[] = [
  {
    id: 'off-01',
    requirementId: 'req-01',
    lotId: 'agg-01',
    sellerType: 'FPO',
    sellerName: 'Sahyadri Farmers Producer Co. Ltd.',
    cropName: 'Soybean',
    quantityQuintals: 500,
    offeredPricePerQuintal: 4920,
    sellerCounterPrice: 4950,
    paymentTerms: '50% on Loading, 50% within 48 hrs of Mill delivery',
    deliveryDate: '5 Nov 2026',
    status: 'Counter Offer Received',
  },
  {
    id: 'off-02',
    sellerType: 'Individual Farmer',
    sellerName: 'Ramesh Patil',
    cropName: 'Soybean',
    quantityQuintals: 50,
    offeredPricePerQuintal: 4890,
    paymentTerms: 'Immediate RTGS on Farmgate Pickup',
    deliveryDate: '3 Nov 2026',
    status: 'Pending Review',
  },
  {
    id: 'off-03',
    lotId: 'agg-03',
    sellerType: 'FPO',
    sellerName: 'Sahyadri Farmers Producer Co. Ltd.',
    cropName: 'Gram / Chana',
    quantityQuintals: 350,
    offeredPricePerQuintal: 5550,
    paymentTerms: '100% Escrow Bank Transfer',
    deliveryDate: '2 Nov 2026',
    status: 'Accepted',
  },
];

// ==========================================
// 1. FPO DIRECTORY INTERFACES & MOCK DATA
// ==========================================

export interface FpoOrganization {
  id: string;
  name: string;
  marathiName: string;
  location: string;
  district: string;
  taluka: string;
  cropsHandled: string[];
  minQuantityQuintals: number;
  contactPerson: string;
  designation: string;
  contactNumber: string;
  email: string;
  establishedYear: number;
  activeMemberCount: number;
  registrationNumber: string;
  rating: number;
  bulkSellingOpportunities: string;
  specialBenefits: string[];
  procurementStatus: 'Actively Buying' | 'Aggregation in Progress' | 'Upcoming Drive';
}

export const MOCK_FPO_ORGANIZATIONS: FpoOrganization[] = [
  {
    id: 'fpo-sahyadri',
    name: 'Sahyadri Farmers Producer Co. Ltd.',
    marathiName: 'सह्याद्री शेतकरी उत्पादक कंपनी लि.',
    location: 'Mohadi, Dindori Road, Nashik',
    district: 'Nashik',
    taluka: 'Dindori',
    cropsHandled: ['Soybean', 'Red Onion', 'Wheat', 'Gram / Chana', 'Tomato'],
    minQuantityQuintals: 15,
    contactPerson: 'Sagar Patil',
    designation: 'Chief Procurement Manager',
    contactNumber: '+91 94222 84521',
    email: 'procurement@sahyadrifarms.com',
    establishedYear: 2011,
    activeMemberCount: 18500,
    registrationNumber: 'CIN-U01403MH2011PTC212345',
    rating: 4.9,
    bulkSellingOpportunities: 'Currently aggregating 500 Qtl Soybean for Khandesh Mills; Red onion export packing for Dubai shipment.',
    specialBenefits: [
      'Zero APMC market cess (direct farmgate collection)',
      'Subsidized cooperative freight & cold storage',
      'Electronic weighbridge with instant SMS slip',
      'Direct RTGS bank settlement within 24 hours'
    ],
    procurementStatus: 'Actively Buying',
  },
  {
    id: 'fpo-godavari',
    name: 'Godavari Valley Agro Producer Co. Ltd.',
    marathiName: 'गोदावरी व्हॅली ॲग्रो प्रोड्युसर कंपनी लि.',
    location: 'Niphad Station Road, Niphad',
    district: 'Nashik',
    taluka: 'Niphad',
    cropsHandled: ['Soybean', 'Wheat', 'Gram / Chana', 'Maize'],
    minQuantityQuintals: 10,
    contactPerson: 'Rameshwar Gite',
    designation: 'General Manager & Agri-Lead',
    contactNumber: '+91 98223 91044',
    email: 'godavari.fpo@gmail.com',
    establishedYear: 2017,
    activeMemberCount: 3200,
    registrationNumber: 'CIN-U01111MH2017PTC294512',
    rating: 4.7,
    bulkSellingOpportunities: '350 Qtl Chana pooling for NAFED pulse procurement; 400 Qtl Sharbati wheat lot.',
    specialBenefits: [
      'Free digital moisture testing on arrival',
      'Government MSP procurement partner agency',
      'Gunny bag packaging support provided'
    ],
    procurementStatus: 'Actively Buying',
  },
  {
    id: 'fpo-lasalgaon',
    name: 'Lasalgaon Onion & Oilseed Farmer Federation',
    marathiName: 'लासलगाव कांदा व गळीतधान्य शेतकरी महासंघ',
    location: 'Near Old APMC Yard, Lasalgaon',
    district: 'Nashik',
    taluka: 'Niphad',
    cropsHandled: ['Red Onion', 'Soybean', 'Cotton'],
    minQuantityQuintals: 20,
    contactPerson: 'Dr. Sunil Boraste',
    designation: 'FPC Managing Director',
    contactNumber: '+91 98500 12890',
    email: 'contact@lasalgaonfederation.in',
    establishedYear: 2015,
    activeMemberCount: 5600,
    registrationNumber: 'CIN-U01400MH2015PTC267890',
    rating: 4.8,
    bulkSellingOpportunities: '800 Qtl Kharif red onion buffer procurement with ventilated storage sheds.',
    specialBenefits: [
      'Ventilated chawl storage at ₹10/month per bag',
      'Direct export consignment packing for Colombo & Gulf',
      'No middleman deduction on weight deduction'
    ],
    procurementStatus: 'Aggregation in Progress',
  },
  {
    id: 'fpo-kadwa',
    name: 'Kadwa Valley Organic & Agro Producer Co.',
    marathiName: 'कडवा व्हॅली ऑरगॅनिक ॲग्रो प्रोड्युसर कंपनी',
    location: 'Rajur, Taluka Dindori',
    district: 'Nashik',
    taluka: 'Dindori',
    cropsHandled: ['Soybean', 'Gram / Chana', 'Jowar', 'Vegetables'],
    minQuantityQuintals: 10,
    contactPerson: 'Pratibha Tai Bhalerao',
    designation: 'Procurement & Quality Head',
    contactNumber: '+91 94215 67320',
    email: 'kadwavalley@agriorganic.org',
    establishedYear: 2019,
    activeMemberCount: 1450,
    registrationNumber: 'CIN-U01122MH2019PTC328901',
    rating: 4.6,
    bulkSellingOpportunities: '200 Qtl Non-GMO yellow soybean procurement for premium plant-protein processor.',
    specialBenefits: [
      '+₹150/Qtl premium for certified low-residue produce',
      'On-farm soil health & moisture check audits',
      'Priority pickup for women farmer SHGs'
    ],
    procurementStatus: 'Upcoming Drive',
  },
  {
    id: 'fpo-sinnar',
    name: 'Sinnar Krishi Vikas Producer Federation',
    marathiName: 'सिन्नर कृषी विकास शेतकरी उत्पादक फेडरेशन',
    location: 'MIDC Phase 2, Sinnar',
    district: 'Nashik',
    taluka: 'Sinnar',
    cropsHandled: ['Gram / Chana', 'Wheat', 'Bajra', 'Soybean'],
    minQuantityQuintals: 15,
    contactPerson: 'Anand Chavan',
    designation: 'Operations Lead',
    contactNumber: '+91 97631 44520',
    email: 'sinnarfpc@agrimaharashtra.in',
    establishedYear: 2018,
    activeMemberCount: 2800,
    registrationNumber: 'CIN-U01100MH2018PTC309123',
    rating: 4.5,
    bulkSellingOpportunities: '450 Qtl Chana pool for Ahmednagar pulse processors.',
    specialBenefits: [
      'Transport reimbursement of ₹30/Qtl for groups',
      'Precision weighing scale calibration guarantee',
      'Direct tie-up with livestock feed and flour mills'
    ],
    procurementStatus: 'Actively Buying',
  },
];

// ==========================================
// 2. BUYER DIRECTORY INTERFACES & MOCK DATA
// ==========================================

export interface BuyerOrganization {
  id: string;
  businessName: string;
  buyerType: 'Agri-Processor' | 'Bulk Wholesaler' | 'Exporter' | 'Retail Chain / Aggregator' | 'Dal & Oil Miller';
  location: string;
  district: string;
  cropsPurchased: string[];
  requiredQuantityQuintals: number;
  indicativePriceRange: {
    min: number;
    max: number;
    unit: string;
  };
  contactPerson: string;
  contactNumber: string;
  preferredDeliveryTerms: 'Farmgate Pickup' | 'FPO Warehouse Delivery' | 'Mandi Delivery';
  paymentTerms: string;
  verificationBadge: 'Verified Corporate Buyer' | 'APEDA Certified Exporter' | 'State Warehousing Partner';
  activeRequirementsSummary: string;
}

export const MOCK_BUYER_ORGANIZATIONS: BuyerOrganization[] = [
  {
    id: 'buyer-khandesh',
    businessName: 'Khandesh Agro-Processing Mills',
    buyerType: 'Agri-Processor',
    location: 'MIDC Jalgaon & Niphad Cluster',
    district: 'Jalgaon / Nashik',
    cropsPurchased: ['Soybean', 'Cotton', 'Gram / Chana'],
    requiredQuantityQuintals: 600,
    indicativePriceRange: {
      min: 4860,
      max: 4960,
      unit: '₹/Quintal',
    },
    contactPerson: 'Mahesh Agrawal',
    contactNumber: '+91 98220 18392',
    preferredDeliveryTerms: 'Farmgate Pickup',
    paymentTerms: 'Immediate RTGS within 24 hours of electronic weighing',
    verificationBadge: 'Verified Corporate Buyer',
    activeRequirementsSummary: 'Urgent procurement: 600 Qtl clean yellow soybean (moisture <10%) for solvent oil extraction.',
  },
  {
    id: 'buyer-mahindra',
    businessName: 'Mahindra Agri Solutions Bulk Export',
    buyerType: 'Exporter',
    location: 'Lasalgaon Logistics Yard & JNPT Terminal',
    district: 'Nashik / Mumbai',
    cropsPurchased: ['Red Onion', 'Grapes', 'Pomegranate'],
    requiredQuantityQuintals: 1000,
    indicativePriceRange: {
      min: 2420,
      max: 2540,
      unit: '₹/Quintal',
    },
    contactPerson: 'Rajesh Kulkarni',
    contactNumber: '+91 98201 44100',
    preferredDeliveryTerms: 'Farmgate Pickup',
    paymentTerms: '50% advance on farm loading, 50% on packhouse clearance',
    verificationBadge: 'APEDA Certified Exporter',
    activeRequirementsSummary: 'Looking for 1,000 Qtl Medium Bold Kharif Red Onion (45-55mm) with intact red skin for export container shipment.',
  },
  {
    id: 'buyer-itc',
    businessName: 'ITC e-Choupal Fresh Grains',
    buyerType: 'Retail Chain / Aggregator',
    location: 'Nashik & Ahmednagar Regional Hub',
    district: 'Nashik / Ahmednagar',
    cropsPurchased: ['Wheat', 'Gram / Chana', 'Soybean'],
    requiredQuantityQuintals: 400,
    indicativePriceRange: {
      min: 2920,
      max: 3080,
      unit: '₹/Quintal',
    },
    contactPerson: 'Amit Verma',
    contactNumber: '+91 94220 98765',
    preferredDeliveryTerms: 'FPO Warehouse Delivery',
    paymentTerms: '100% direct DBT bank credit within 12 hours of delivery receipt',
    verificationBadge: 'Verified Corporate Buyer',
    activeRequirementsSummary: 'Procuring 400 Qtl Lokwan & Sharbati bold wheat for consumer packaged wheat flour brand.',
  },
  {
    id: 'buyer-adm',
    businessName: 'ADM Agro Industries India Ltd.',
    buyerType: 'Agri-Processor',
    location: 'Latur & Khandesh Processing Facilities',
    district: 'Latur / Western MH',
    cropsPurchased: ['Soybean', 'Maize', 'Mustard'],
    requiredQuantityQuintals: 1500,
    indicativePriceRange: {
      min: 4880,
      max: 4980,
      unit: '₹/Quintal',
    },
    contactPerson: 'Sanjay Deshmukh',
    contactNumber: '+91 99224 55301',
    preferredDeliveryTerms: 'FPO Warehouse Delivery',
    paymentTerms: 'Fast-track NEFT transfer against certified e-Warehouse receipt',
    verificationBadge: 'Verified Corporate Buyer',
    activeRequirementsSummary: 'High-volume seasonal procurement: 1,500 Qtl Soybean for industrial protein & defatted meal processing.',
  },
  {
    id: 'buyer-sahyadri-proc',
    businessName: 'Sahyadri Agro Processing Division',
    buyerType: 'Dal & Oil Miller',
    location: 'Mohadi Mega Food Park, Nashik',
    district: 'Nashik',
    cropsPurchased: ['Gram / Chana', 'Red Onion', 'Tomato'],
    requiredQuantityQuintals: 500,
    indicativePriceRange: {
      min: 5500,
      max: 5680,
      unit: '₹/Quintal',
    },
    contactPerson: 'Nilesh Gaikwad',
    contactNumber: '+91 98811 23490',
    preferredDeliveryTerms: 'Farmgate Pickup',
    paymentTerms: 'Same-day digital RTGS transfer to verified Jan Dhan / Agri Account',
    verificationBadge: 'State Warehousing Partner',
    activeRequirementsSummary: 'Sourcing 500 Qtl Vijay Bold Chana (Gram) for mechanized dal sorting & institutional pack supply.',
  },
];

// ==========================================
// 3. FARMER PRODUCE LISTINGS MOCK DATA
// ==========================================

export interface FarmerMarketplaceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  village: string;
  taluka: string;
  district: string;
  cropName: string;
  cropId: string;
  variety: string;
  quantityQuintals: number;
  expectedPricePerQuintal: number;
  qualityGrade: 'Grade A (Export)' | 'Grade A (Commercial)' | 'Grade B (FAQ)' | 'Fair Average';
  moisturePercentage: number;
  harvestDate: string;
  description: string;
  status: 'Active / Open for Offers' | 'Aggregated with FPO' | 'Sold' | 'Offer Under Review';
  batchCode: string;
  createdAt: string;
  isMyListing: boolean;
}

export const MOCK_MARKETPLACE_LISTINGS: FarmerMarketplaceListing[] = [
  {
    id: 'list-001',
    farmerId: 'farmer-mh-001',
    farmerName: 'Ramesh Patil (You)',
    farmerMobile: '+91 98220 45678',
    village: 'Niphad',
    taluka: 'Niphad',
    district: 'Nashik',
    cropName: 'Soybean',
    cropId: 'crop-soybean',
    variety: 'JS-335 (Yellow Bold)',
    quantityQuintals: 50,
    expectedPricePerQuintal: 4880,
    qualityGrade: 'Grade A (Export)',
    moisturePercentage: 9.2,
    harvestDate: '24 Oct 2026',
    description: 'Cleaned and winnowed bold grain harvested 7 days ago. Stored in dry ventilated shed with <10% moisture.',
    status: 'Active / Open for Offers',
    batchCode: 'LOT-SB-NP-01',
    createdAt: '25 Oct 2026',
    isMyListing: true,
  },
  {
    id: 'list-002',
    farmerId: 'farmer-mh-001',
    farmerName: 'Ramesh Patil (You)',
    farmerMobile: '+91 98220 45678',
    village: 'Niphad',
    taluka: 'Niphad',
    district: 'Nashik',
    cropName: 'Red Onion (Kharif)',
    cropId: 'crop-onion',
    variety: 'Garwa Kharif Medium Bold',
    quantityQuintals: 75,
    expectedPricePerQuintal: 2420,
    qualityGrade: 'Grade A (Commercial)',
    moisturePercentage: 12.0,
    harvestDate: '28 Oct 2026',
    description: 'Medium bold size (45-55mm), uniform red color with double skin. Ready for immediate loading.',
    status: 'Active / Open for Offers',
    batchCode: 'LOT-ON-NP-02',
    createdAt: '29 Oct 2026',
    isMyListing: true,
  },
  {
    id: 'list-003',
    farmerId: 'farmer-mh-004',
    farmerName: 'Bhaskar Wagh',
    farmerMobile: '+91 98234 55678',
    village: 'Lasalgaon',
    taluka: 'Niphad',
    district: 'Nashik',
    cropName: 'Gram / Chana',
    cropId: 'crop-gram',
    variety: 'Vijay Bold Pulses',
    quantityQuintals: 45,
    expectedPricePerQuintal: 5520,
    qualityGrade: 'Grade A (Export)',
    moisturePercentage: 8.5,
    harvestDate: '22 Oct 2026',
    description: 'Graded pulse grain, zero weevil damage. Ready for pickup or FPO aggregation.',
    status: 'Active / Open for Offers',
    batchCode: 'LOT-CH-LS-03',
    createdAt: '23 Oct 2026',
    isMyListing: false,
  },
  {
    id: 'list-004',
    farmerId: 'farmer-mh-003',
    farmerName: 'Ganesh Jadhav',
    farmerMobile: '+91 94222 77112',
    village: 'Dindori',
    taluka: 'Dindori',
    district: 'Nashik',
    cropName: 'Wheat (Lokwan)',
    cropId: 'crop-wheat',
    variety: 'Lokwan Sharbati',
    quantityQuintals: 40,
    expectedPricePerQuintal: 2940,
    qualityGrade: 'Grade A (Commercial)',
    moisturePercentage: 9.8,
    harvestDate: '26 Oct 2026',
    description: 'Golden luster bold grain, ideal for domestic flour milling.',
    status: 'Aggregated with FPO',
    batchCode: 'LOT-WH-DN-04',
    createdAt: '27 Oct 2026',
    isMyListing: false,
  },
  {
    id: 'list-005',
    farmerId: 'farmer-mh-005',
    farmerName: 'Dnyaneshwar Shinde',
    farmerMobile: '+91 99210 33455',
    village: 'Sinnar',
    taluka: 'Sinnar',
    district: 'Nashik',
    cropName: 'Cotton (Kapus)',
    cropId: 'crop-cotton',
    variety: 'Medium Long Staple Bt',
    quantityQuintals: 30,
    expectedPricePerQuintal: 7150,
    qualityGrade: 'Grade A (Commercial)',
    moisturePercentage: 7.2,
    harvestDate: '20 Oct 2026',
    description: 'First picking seed cotton with high ginning turnout (>35%). Clean white boll fluff.',
    status: 'Active / Open for Offers',
    batchCode: 'LOT-CT-SN-05',
    createdAt: '21 Oct 2026',
    isMyListing: false,
  },
];

// ==========================================
// 4. BUYER OFFERS & FINANCIAL INTEGRATION
// ==========================================

export interface OfferFinancialBreakdown {
  offeredGrossRevenue: number;
  offeredNetEarnings: number;
  offeredNetPerQuintal: number;
  offeredTransportCost: number;
  offeredMandiCess: number;
  offeredHandlingCost: number;

  bestMandiName: string;
  bestMandiGrossPrice: number;
  bestMandiGrossRevenue: number;
  bestMandiNetEarnings: number;
  bestMandiNetPerQuintal: number;
  bestMandiTransportCost: number;
  bestMandiCess: number;
  bestMandiHandlingCost: number;

  netAdvantageTotal: number;
  netAdvantagePerQuintal: number;
  isOfferBetterThanMandi: boolean;
  savingsHighlights: string[];
}

export interface MarketplaceOffer {
  id: string;
  listingId: string;
  listingCrop: string;
  cropId: string;
  buyerName: string;
  buyerType: string;
  buyerLocation: string;
  offeredPricePerQuintal: number;
  expectedPricePerQuintal: number;
  quantityQuintals: number;
  deliveryTerms: 'Farmgate Pickup' | 'FPO Warehouse Delivery' | 'Mandi Delivery';
  pickupLocation: string;
  paymentTerms: string;
  expiryDate: string;
  receivedDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Counteroffer Sent';
  farmerCounterPrice?: number;
  farmerCounterNote?: string;
  financials: OfferFinancialBreakdown;
}

/**
 * Centrally calculates financial comparison between buyer offer and best available mandi
 */
export const calculateOfferFinancials = (
  cropId: string,
  quantityQuintals: number,
  offeredPricePerQuintal: number,
  deliveryTerms: 'Farmgate Pickup' | 'FPO Warehouse Delivery' | 'Mandi Delivery',
  villageId: string = 'v-niphad'
): OfferFinancialBreakdown => {
  const validQty = Math.max(1, quantityQuintals);
  const offeredGrossRevenue = Math.round(validQty * offeredPricePerQuintal);

  // Direct buyer deductions based on delivery terms
  let offeredTransportCost = 0;
  let offeredMandiCess = 0; // Direct trade outside APMC yard incurs no APMC cess
  let offeredHandlingCost = Math.round(12 * validQty); // Hamali/bag loading

  if (deliveryTerms === 'Farmgate Pickup') {
    offeredTransportCost = 0; // Buyer bears logistics from farmgate!
  } else if (deliveryTerms === 'FPO Warehouse Delivery') {
    offeredTransportCost = Math.round(18 * validQty); // Short 10-15km haulage to nearby FPO hub
  } else {
    offeredTransportCost = Math.round(48 * validQty);
    offeredMandiCess = Math.round((offeredGrossRevenue * 1.05) / 100);
    offeredHandlingCost = Math.round(26 * validQty);
  }

  const offeredTotalDeductions = offeredTransportCost + offeredMandiCess + offeredHandlingCost;
  const offeredNetEarnings = offeredGrossRevenue - offeredTotalDeductions;
  const offeredNetPerQuintal = Math.round(offeredNetEarnings / validQty);

  // Mandi Benchmark Calculation using centralized computeMandiComparisons
  const mandiComparisons = computeMandiComparisons(cropId, validQty, villageId);
  const bestMandi = mandiComparisons.find((m) => m.isHighestNet) || mandiComparisons[0];

  const bestMandiGrossPrice = bestMandi?.pricePerQuintal ?? offeredPricePerQuintal;
  const bestMandiGrossRevenue = bestMandi?.grossRevenue ?? offeredGrossRevenue;
  const bestMandiNetEarnings = bestMandi?.netEarnings ?? offeredGrossRevenue - 5000;
  const bestMandiNetPerQuintal = bestMandi?.netEarningsPerQuintal ?? Math.round(bestMandiNetEarnings / validQty);
  const bestMandiTransportCost = bestMandi?.transportationCost ?? 2500;
  const bestMandiCess = bestMandi?.mandiCess ?? Math.round((bestMandiGrossRevenue * 1.05) / 100);
  const bestMandiHandlingCost = bestMandi?.hamaliAndPackaging ?? 1200;

  const netAdvantageTotal = offeredNetEarnings - bestMandiNetEarnings;
  const netAdvantagePerQuintal = offeredNetPerQuintal - bestMandiNetPerQuintal;
  const isOfferBetterThanMandi = netAdvantageTotal >= 0;

  const savingsHighlights: string[] = [];
  if (deliveryTerms === 'Farmgate Pickup') {
    savingsHighlights.push(`Saved ₹${bestMandiTransportCost.toLocaleString('en-IN')} on freight (buyer provides vehicle)`);
  }
  if (offeredMandiCess === 0) {
    savingsHighlights.push(`Saved ₹${bestMandiCess.toLocaleString('en-IN')} (zero APMC market cess on direct sale)`);
  }
  savingsHighlights.push(`Net In-Hand Realization: ${((offeredNetEarnings / offeredGrossRevenue) * 100).toFixed(1)}% of gross`);

  return {
    offeredGrossRevenue,
    offeredNetEarnings,
    offeredNetPerQuintal,
    offeredTransportCost,
    offeredMandiCess,
    offeredHandlingCost,
    bestMandiName: bestMandi?.mandiName ?? 'Lasalgaon APMC',
    bestMandiGrossPrice,
    bestMandiGrossRevenue,
    bestMandiNetEarnings,
    bestMandiNetPerQuintal,
    bestMandiTransportCost,
    bestMandiCess,
    bestMandiHandlingCost,
    netAdvantageTotal,
    netAdvantagePerQuintal,
    isOfferBetterThanMandi,
    savingsHighlights,
  };
};

export const MOCK_MARKETPLACE_OFFERS: MarketplaceOffer[] = [
  {
    id: 'offer-001',
    listingId: 'list-001',
    listingCrop: 'Soybean (JS-335)',
    cropId: 'crop-soybean',
    buyerName: 'Khandesh Agro-Processing Mills',
    buyerType: 'Agri-Processor',
    buyerLocation: 'Jalgaon / Niphad MIDC',
    offeredPricePerQuintal: 4890,
    expectedPricePerQuintal: 4880,
    quantityQuintals: 50,
    deliveryTerms: 'Farmgate Pickup',
    pickupLocation: 'Farmer Shed, Niphad Village',
    paymentTerms: 'Immediate RTGS transfer upon farmgate weighbridge slip',
    expiryDate: '2 Nov 2026 (48 hrs left)',
    receivedDate: '30 Oct 2026',
    status: 'Pending',
    financials: calculateOfferFinancials('crop-soybean', 50, 4890, 'Farmgate Pickup', 'v-niphad'),
  },
  {
    id: 'offer-002',
    listingId: 'list-002',
    listingCrop: 'Red Onion (Kharif)',
    cropId: 'crop-onion',
    buyerName: 'Mahindra Agri Solutions Bulk Export',
    buyerType: 'Exporter',
    buyerLocation: 'Lasalgaon Logistics Yard',
    offeredPricePerQuintal: 2450,
    expectedPricePerQuintal: 2420,
    quantityQuintals: 75,
    deliveryTerms: 'Farmgate Pickup',
    pickupLocation: 'Farm Storage Shed, Niphad',
    paymentTerms: '50% advance on vehicle loading, 50% post packhouse check',
    expiryDate: '3 Nov 2026',
    receivedDate: '30 Oct 2026',
    status: 'Pending',
    financials: calculateOfferFinancials('crop-onion', 75, 2450, 'Farmgate Pickup', 'v-niphad'),
  },
  {
    id: 'offer-003',
    listingId: 'list-003',
    listingCrop: 'Gram / Chana (Vijay Bold)',
    cropId: 'crop-gram',
    buyerName: 'ITC e-Choupal Fresh Grains',
    buyerType: 'Retail Chain / Aggregator',
    buyerLocation: 'Nashik Regional Hub',
    offeredPricePerQuintal: 5540,
    expectedPricePerQuintal: 5520,
    quantityQuintals: 45,
    deliveryTerms: 'FPO Warehouse Delivery',
    pickupLocation: 'Godavari Valley FPO Hub, Niphad',
    paymentTerms: '100% direct DBT bank credit within 12 hours',
    expiryDate: '4 Nov 2026',
    receivedDate: '29 Oct 2026',
    status: 'Counteroffer Sent',
    farmerCounterPrice: 5580,
    farmerCounterNote: 'Moisture certified at 8.2% with zero insect damage. Requesting ₹5,580/Qtl delivered at Niphad FPO hub.',
    financials: calculateOfferFinancials('crop-gram', 45, 5540, 'FPO Warehouse Delivery', 'v-niphad'),
  },
  {
    id: 'offer-004',
    listingId: 'list-004',
    listingCrop: 'Wheat (Lokwan)',
    cropId: 'crop-wheat',
    buyerName: 'Sahyadri Agro Processing Division',
    buyerType: 'Dal & Oil Miller',
    buyerLocation: 'Mohadi Mega Food Park, Nashik',
    offeredPricePerQuintal: 2950,
    expectedPricePerQuintal: 2940,
    quantityQuintals: 40,
    deliveryTerms: 'Farmgate Pickup',
    pickupLocation: 'Dindori Farm Hub',
    paymentTerms: 'Instant electronic transfer against weight slip',
    expiryDate: '1 Nov 2026',
    receivedDate: '28 Oct 2026',
    status: 'Accepted',
    financials: calculateOfferFinancials('crop-wheat', 40, 2950, 'Farmgate Pickup', 'v-niphad'),
  },
];

// ==========================================
// 5. BULK SELLING & AGGREGATION POOLS
// ==========================================

export interface BulkAggregationOpportunity {
  id: string;
  lotCode: string;
  cropName: string;
  cropId: string;
  variety: string;
  targetQuantityQuintals: number;
  currentAggregatedQuintals: number;
  participatingFarmersCount: number;
  indicativePricePerQuintal: number;
  mandiBenchmarkPrice: number;
  priceAdvantagePerQuintal: number;
  fpoOrganizer: {
    id: string;
    name: string;
    hubLocation: string;
    contactNumber: string;
  };
  partnerBuyer: {
    name: string;
    type: string;
  };
  qualityGradeRequired: string;
  poolingDeadline: string;
  status: 'Open for Aggregation' | 'Near Target' | 'Finalizing Bids';
  description: string;
}

export const MOCK_BULK_OPPORTUNITIES: BulkAggregationOpportunity[] = [
  {
    id: 'pool-001',
    lotCode: 'SAHYADRI-BULK-SB-2026-A',
    cropName: 'Soybean',
    cropId: 'crop-soybean',
    variety: 'Yellow JS-335 Grade A',
    targetQuantityQuintals: 500,
    currentAggregatedQuintals: 380,
    participatingFarmersCount: 8,
    indicativePricePerQuintal: 4960,
    mandiBenchmarkPrice: 4890,
    priceAdvantagePerQuintal: 70,
    fpoOrganizer: {
      id: 'fpo-sahyadri',
      name: 'Sahyadri Farmers Producer Co. Ltd.',
      hubLocation: 'Mohadi Agri Complex, Nashik',
      contactNumber: '+91 94222 84521',
    },
    partnerBuyer: {
      name: 'Khandesh Agro-Processing Mills',
      type: 'Solvent Extraction Plant',
    },
    qualityGradeRequired: 'Grade A (Export/Industrial), Moisture <10%, Foreign matter <2%',
    poolingDeadline: '5 Nov 2026 (5 Days left)',
    status: 'Open for Aggregation',
    description: 'Aggregating 10 truckloads (500 Qtl) directly for Khandesh solvent crushers. By pooling, farmers eliminate 1.05% APMC cess and save ₹45/Qtl in bulk freight.',
  },
  {
    id: 'pool-002',
    lotCode: 'LASALGAON-EXP-ON-2026',
    cropName: 'Red Onion (Kharif)',
    cropId: 'crop-onion',
    variety: 'Garwa Kharif Medium Bold',
    targetQuantityQuintals: 1000,
    currentAggregatedQuintals: 740,
    participatingFarmersCount: 14,
    indicativePricePerQuintal: 2510,
    mandiBenchmarkPrice: 2420,
    priceAdvantagePerQuintal: 90,
    fpoOrganizer: {
      id: 'fpo-lasalgaon',
      name: 'Lasalgaon Onion & Oilseed Farmer Federation',
      hubLocation: 'Old Mandi Road Cold Facility, Lasalgaon',
      contactNumber: '+91 98500 12890',
    },
    partnerBuyer: {
      name: 'Mahindra Agri Solutions Bulk Export',
      type: 'Horticulture Exporter',
    },
    qualityGradeRequired: 'Grade A Export (45-55mm), Cured double skin, zero black mold',
    poolingDeadline: '4 Nov 2026 (4 Days left)',
    status: 'Open for Aggregation',
    description: 'Direct sea-container export pooling for Gulf destinations. Subsidized grading line at Lasalgaon hub with zero commission agents.',
  },
  {
    id: 'pool-003',
    lotCode: 'GODAVARI-PULSE-CH-2026',
    cropName: 'Gram / Chana',
    cropId: 'crop-gram',
    variety: 'Vijay Bold Pulses',
    targetQuantityQuintals: 350,
    currentAggregatedQuintals: 310,
    participatingFarmersCount: 7,
    indicativePricePerQuintal: 5640,
    mandiBenchmarkPrice: 5480,
    priceAdvantagePerQuintal: 160,
    fpoOrganizer: {
      id: 'fpo-godavari',
      name: 'Godavari Valley Agro Producer Co. Ltd.',
      hubLocation: 'Niphad Station Hub',
      contactNumber: '+91 98223 91044',
    },
    partnerBuyer: {
      name: 'Sahyadri Agro Processing Division',
      type: 'Dal Mill Enterprise',
    },
    qualityGradeRequired: 'Vijay Bold, Machine Cleaned, Moisture <9%',
    poolingDeadline: '3 Nov 2026 (3 Days left)',
    status: 'Near Target',
    description: 'Final 40 Quintals needed to close out corporate contract with dal milling unit. Guaranteed escrow bank settlement on weighment.',
  },
];



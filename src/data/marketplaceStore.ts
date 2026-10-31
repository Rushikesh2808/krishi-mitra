import {
  MOCK_MARKETPLACE_LISTINGS,
  MOCK_MARKETPLACE_OFFERS,
  MOCK_AGGREGATED_LOTS,
  MOCK_BUYER_REQUIREMENTS,
  FarmerMarketplaceListing,
  MarketplaceOffer,
  FpoAggregatedLot,
  BuyerRequirement,
  calculateOfferFinancials
} from './fpoBuyerMockData';
import { UserRole, FarmerCropRecord } from '../types';
import { Language } from '../i18n/types';

export type { FarmerMarketplaceListing, MarketplaceOffer, FpoAggregatedLot, BuyerRequirement, FarmerCropRecord };

export interface AppNotification {
  id: string;
  role: UserRole;
  title: string;
  message: string;
  title_mr?: string;
  message_mr?: string;
  title_hi?: string;
  message_hi?: string;
  time: string;
  type:
    | 'offer_received'
    | 'counter_received'
    | 'lot_aggregated'
    | 'price_alert'
    | 'contract_finalized'
    | 'listing_added'
    | 'stock_alert'
    | 'recommendation'
    | 'fpo_interest'
    | 'bulk_opportunity';
  read: boolean;
  link?: string;
}

export interface ProduceInventorySummary {
  totalHarvested: number;
  totalListed: number;
  totalCommitted: number;
  totalAvailable: number;
  cropCount: number;
  cropBreakdown: {
    cropName: string;
    cropVariety: string;
    harvested: number;
    listed: number;
    committed: number;
    available: number;
    quality: string;
    storage: string;
    storageLocation: string;
    shelfLifeDays: number;
  }[];
}

export const getLocalizedNotification = (
  n: AppNotification,
  language: Language = 'mr'
): { title: string; message: string } => {
  if (language === 'mr') {
    return {
      title: n.title_mr || n.title,
      message: n.message_mr || n.message,
    };
  }
  if (language === 'hi') {
    return {
      title: n.title_hi || n.title,
      message: n.message_hi || n.message,
    };
  }
  return {
    title: n.title,
    message: n.message,
  };
};

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  // 1. FARMER NOTIFICATIONS
  {
    id: 'notif-farm-1',
    role: 'FARMER',
    title: 'New Buyer Bid: Khandesh Agro-Processing',
    message: 'Offered ₹4,890/Qtl for 50 Qtl Soybean with free farmgate pickup in Niphad.',
    title_mr: 'नवीन खरेदीदार ऑफर: खान्देश ॲग्रो-प्रोसेसिंग',
    message_mr: '५० क्विंटल सोयाबीनसाठी ₹४,८९०/क्विंटल भावाची थेट बांधावर पिकअप ऑफर प्राप्त झाली.',
    title_hi: 'नई खरीदार बोली: खानदेश एग्रो-प्रोसेसिंग',
    message_hi: '५० क्विंटल सोयाबीन के लिए ₹४,८९०/क्विंटल भाव का खेत से सीधा खरीद प्रस्ताव प्राप्त हुआ।',
    time: '2 hours ago',
    type: 'offer_received',
    read: false,
    link: '/fpo-marketplace?tab=negotiations',
  },
  {
    id: 'notif-farm-2',
    role: 'FARMER',
    title: 'FPO Bulk Aggregation Open: Sahyadri FPC',
    message: 'Join 500 Qtl Yellow Soybean pool for +₹70/Qtl bonus over APMC spot rate.',
    title_mr: 'FPO शेतमाल एकत्रीकरण: सह्याद्री FPC',
    message_mr: '५०० क्विंटल पिवळे सोयाबीन लॉटमध्ये सामील व्हा आणि APMC पेक्षा +₹७०/क्विंटल अधिक नफा मिळवा.',
    title_hi: 'एफपीओ थोक एकत्रीकरण: सह्याद्री एफपीसी',
    message_hi: '५०० क्विंटल सोयाबीन लॉट में शामिल हों और मंडी भाव से +₹७०/क्विंटल अधिक दर पाएं।',
    time: '5 hours ago',
    type: 'lot_aggregated',
    read: false,
    link: '/fpo-marketplace?tab=bulk',
  },
  {
    id: 'notif-farm-3',
    role: 'FARMER',
    title: 'Counteroffer Response: Mahindra Agri Solutions',
    message: 'Buyer proposed revised quote of ₹2,460/Qtl for 75 Qtl Red Onion with next-day payment.',
    title_mr: 'प्रति-ऑफर प्रतिसाद: महिंद्रा ॲग्री सोल्युशन्स',
    message_mr: 'खरेदीदाराने ७५ क्विंटल लाल कांद्यासाठी ₹२,४६०/क्विंटल सुधारीत भाव व २४ तासांत पेमेंट प्रस्तावित केले.',
    title_hi: 'काउंटर ऑफर प्रतिक्रिया: महिंद्रा एग्री सॉल्यूशंस',
    message_hi: 'खरीदार ने ७५ क्विंटल लाल प्याज के लिए ₹२,४६०/क्विंटल संशोधित भाव और २४ घंटे में भुगतान का प्रस्ताव दिया।',
    time: '3 hours ago',
    type: 'counter_received',
    read: false,
    link: '/fpo-marketplace?tab=negotiations',
  },
  {
    id: 'notif-farm-4',
    role: 'FARMER',
    title: 'AI Selling Window Recommendation Update',
    message: 'Sell vs Wait Advisor recommends holding soybean for 5-7 days; projected +₹120/Qtl upside.',
    title_mr: 'AI विक्री सल्ला अपडेट: सोयाबीन',
    message_mr: 'पुढील ५-७ दिवस साठा राखून ठेवण्याचा सल्ला; बाजारात ₹१२०/क्विंटल भाववाढीचा अंदाज.',
    title_hi: 'एआई बिक्री सलाह अपडेट: सोयाबीन',
    message_hi: 'अगले ५-७ दिन स्टॉक रखकर प्रतीक्षा करने की सलाह; मंडी में ₹१२०/क्विंटल की संभावित बढ़त।',
    time: 'Yesterday',
    type: 'recommendation',
    read: true,
    link: '/sell-recommendations',
  },
  {
    id: 'notif-farm-5',
    role: 'FARMER',
    title: 'Produce Listing Status Changed',
    message: 'Your listing LOT-SO-NP-42 (50 Qtl Grade A Soybean) is now Active & Open for Bids.',
    title_mr: 'शेतमाल नोंदणी स्थिती अद्ययावत',
    message_mr: 'आपला शेतमाल लॉट LOT-SO-NP-42 (५० क्विंटल सोयाबीन) बाजारात सक्रिय व खरेदीदारांसाठी खुला झाला.',
    title_hi: 'फसल सूची स्थिति अपडेट',
    message_hi: 'आपकी उपज सूची LOT-SO-NP-42 (५० क्विंटल सोयाबीन) अब सक्रिय व बोलियों के लिए खुली है।',
    time: 'Yesterday',
    type: 'listing_added',
    read: true,
    link: '/crop-selection',
  },
  {
    id: 'notif-farm-6',
    role: 'FARMER',
    title: 'Bulk Selling Opportunity: Lasalgaon Onion Export Pool',
    message: 'Export pool open for 1,000 Qtl Red Onion (45-55mm) with direct Colombo shipment rate.',
    title_mr: 'एकत्रित विक्री संधी: लासलगाव कांदा निर्यात लॉट',
    message_mr: '१,००० क्विंटल निर्यातक्षम लाल कांद्यासाठी एकत्रीकरण सुरू; थेट कंटेनर पॅकिंग व वाढीव दर.',
    title_hi: 'थोक बिक्री अवसर: लासलगांव प्याज निर्यात पूल',
    message_hi: '१,००० क्विंटल लाल प्याज निर्यात पूल खुला; सीधे कोलंबो शिपमेंट हेतु बेहतर दर उपलब्ध।',
    time: '2 days ago',
    type: 'bulk_opportunity',
    read: true,
    link: '/fpo-marketplace?tab=bulk',
  },

  // 2. FPO NOTIFICATIONS
  {
    id: 'notif-fpo-1',
    role: 'FPO',
    title: 'New Member Produce Intake: Ramesh Patil',
    message: 'Ramesh Patil (Niphad) submitted 50 Qtl Soybean (moisture 9.2%) ready for bulk pooling.',
    title_mr: 'नवीन सभासद शेतमाल आवक: रमेश पाटील',
    message_mr: 'रमेश पाटील (निफाड) यांनी ५० क्विंटल सोयाबीन (ओलावा ९.२%) एकत्रीकरणासाठी सादर केले.',
    title_hi: 'नई सदस्य उपज आवक: रमेश पाटिल',
    message_hi: 'रमेश पाटिल (निफाड) ने ५० क्विंटल सोयाबीन (नमी ९.२%) एकत्रीकरण हेतु जमा किया।',
    time: '1 hour ago',
    type: 'listing_added',
    read: false,
    link: '/fpo',
  },
  {
    id: 'notif-fpo-2',
    role: 'FPO',
    title: 'Farmer Joined Bulk Lot: Sunita Deshmukh',
    message: 'Sunita Deshmukh contributed 40 Qtl Red Onion to Lot #SAHYADRI-BULK-ON-2026-B.',
    title_mr: 'शेतकरी एकत्रित लॉटमध्ये सामील: सुनिता देशमुख',
    message_mr: 'सुनिता देशमुख यांनी ४० क्विंटल लाल कांदा लॉट #SAHYADRI-BULK-ON-2026-B मध्ये जोडला.',
    title_hi: 'किसान थोक लॉट में शामिल: सुनीता देशमुख',
    message_hi: 'सुनीता देशमुख ने ४० क्विंटल लाल प्याज लॉट #SAHYADRI-BULK-ON-2026-B में जोड़ा।',
    time: '2 hours ago',
    type: 'lot_aggregated',
    read: false,
    link: '/fpo',
  },
  {
    id: 'notif-fpo-3',
    role: 'FPO',
    title: 'Buyer Bid on Lot #SAHYADRI-BULK-SB-2026-A',
    message: 'Khandesh Agro submitted institutional bid of ₹4,920/Qtl for 500 Qtl bulk lot.',
    title_mr: 'घाऊक लॉटवर खरेदीदार बोली: खान्देश ॲग्रो',
    message_mr: 'खान्देश ॲग्रोने ५०० क्विंटल सोयाबीन लॉटसाठी ₹४,९२०/क्विंटल संस्थात्मक बोली लावली.',
    title_hi: 'थोक लॉट पर खरीदार बोली: खानदेश एग्रो',
    message_hi: 'खानदेश एग्रो ने ५०० क्विंटल सोयाबीन लॉट के लिए ₹४,९२०/क्विंटल की संस्थागत बोली लगाई।',
    time: '3 hours ago',
    type: 'offer_received',
    read: false,
    link: '/fpo',
  },
  {
    id: 'notif-fpo-4',
    role: 'FPO',
    title: 'Counteroffer Response Received: ITC e-Choupal',
    message: 'ITC agreed to target rate ₹2,950/Qtl with 100% digital DBT settlement for Wheat lot.',
    title_mr: 'प्रति-ऑफर प्रतिसाद प्राप्त: आयटीसी ई-चौपाल',
    message_mr: 'आयटीसीने गहू लॉटसाठी ₹२,९५०/क्विंटल लक्ष्य दर आणि १००% थेट बँक हस्तांतरण मान्य केले.',
    title_hi: 'काउंटर ऑफर प्रतिक्रिया प्राप्त: आईटीसी ई-चौपाल',
    message_hi: 'आईटीसी ने गेहूं लॉट के लिए ₹२,९५०/क्विंटल लक्ष्य दर और शत-प्रतिशत डीबीटी भुगतान स्वीकारा।',
    time: '5 hours ago',
    type: 'counter_received',
    read: false,
    link: '/fpo',
  },
  {
    id: 'notif-fpo-5',
    role: 'FPO',
    title: 'Bulk Lot Quantity Updated: Red Onion Export',
    message: 'Export pooling lot reached 740/1,000 Qtl. Final 260 Qtl required by 4 Nov.',
    title_mr: 'एकत्रित लॉट प्रमाण अद्ययावत: लाल कांदा निर्यात',
    message_mr: 'निर्यात लॉट ७४०/१,००० क्विंटलवर पोहोचला. अंतिम २६० क्विंटल ४ नोव्हेंबरपर्यंत आवश्यक.',
    title_hi: 'थोक लॉट मात्रा अपडेट: प्याज निर्यात',
    message_hi: 'निर्यात लॉट ७४०/१,००० क्विंटल तक पहुंचा। अंतिम २६० क्विंटल ४ नवंबर तक आवश्यक।',
    time: 'Yesterday',
    type: 'lot_aggregated',
    read: true,
    link: '/fpo',
  },

  // 3. BUYER NOTIFICATIONS
  {
    id: 'notif-buyer-1',
    role: 'BUYER',
    title: 'New Crop Listing Available: Ramesh Patil',
    message: '50 Qtl Grade A Soybean listed in Niphad at ₹4,880/Qtl (Moisture 9.2%).',
    title_mr: 'नवीन शेतमाल विक्रीसाठी उपलब्ध: रमेश पाटील',
    message_mr: 'निफाड येथे ५० क्विंटल ग्रेड ए सोयाबीन ₹४,८८०/क्विंटल दराने उपलब्ध (ओलावा ९.२%).',
    title_hi: 'नई फसल सूची उपलब्ध: रमेश पाटिल',
    message_hi: 'निफाड में ५० क्विंटल ग्रेड ए सोयाबीन ₹४,८८०/क्विंटल भाव पर उपलब्ध (नमी ९.२%)।',
    time: '30 mins ago',
    type: 'listing_added',
    read: false,
    link: '/buyer',
  },
  {
    id: 'notif-buyer-2',
    role: 'BUYER',
    title: 'New FPO Aggregated Lot: Lasalgaon Federation',
    message: '1,000 Qtl Medium Bold Red Onion (45-55mm) published for export quotation.',
    title_mr: 'नवीन FPO एकत्रित लॉट: लासलगाव फेडरेशन',
    message_mr: '१,००० क्विंटल मध्यम गोल कांदा (४५-५५ मिमी) निर्यातीसाठी बाजारात प्रसिद्ध.',
    title_hi: 'नया एफपीओ थोक लॉट: लासलगांव फेडरेशन',
    message_hi: '१,००० क्विंटल मध्यम गोल प्याज (४५-५५ मिमी) निर्यात कोटेशन हेतु उपलब्ध।',
    time: '4 hours ago',
    type: 'lot_aggregated',
    read: false,
    link: '/buyer',
  },
  {
    id: 'notif-buyer-3',
    role: 'BUYER',
    title: 'Farmer Accepted Offer: Ramesh Patil',
    message: 'Farmer accepted your purchase bid of ₹4,920/Qtl for 50 Qtl Soybean. Escrow contract active.',
    title_mr: 'शेतकऱ्याने खरेदी ऑफर स्वीकारली: रमेश पाटील',
    message_mr: 'रमेश पाटील यांनी ५० क्विंटल सोयाबीनची ₹४,९२०/क्विंटल ऑफर स्वीकारली. करार संपन्न.',
    title_hi: 'किसान ने प्रस्ताव स्वीकारा: रमेश पाटिल',
    message_hi: 'रमेश पाटिल ने ५० क्विंटल सोयाबीन का ₹४,९२०/क्विंटल का खरीद प्रस्ताव स्वीकार किया।',
    time: '1 hour ago',
    type: 'contract_finalized',
    read: false,
    link: '/buyer',
  },
  {
    id: 'notif-buyer-4',
    role: 'BUYER',
    title: 'Counteroffer Received from Farmer: Ramesh Patil',
    message: 'Farmer proposed counter price of ₹4,950/Qtl for 50 Qtl Grade A Yellow Soybean.',
    title_mr: 'शेतकऱ्याकडून प्रति-ऑफर प्राप्त: रमेश पाटील',
    message_mr: 'शेतकऱ्याने ५० क्विंटल पिवळ्या सोयाबीनसाठी ₹४,९५०/क्विंटल प्रति-भाव प्रस्तावित केला.',
    title_hi: 'किसान की ओर से काउंटर ऑफर: रमेश पाटिल',
    message_hi: 'किसान ने ५० क्विंटल सोयाबीन के लिए ₹४,९५०/क्विंटल का संशोधित भाव प्रस्तावित किया।',
    time: '2 hours ago',
    type: 'counter_received',
    read: false,
    link: '/buyer',
  },
  {
    id: 'notif-buyer-5',
    role: 'BUYER',
    title: 'Purchase Requirement Response: Sahyadri FPO',
    message: 'Sahyadri FPO submitted quote matching your requirement for 600 Qtl Yellow Soybean.',
    title_mr: 'खरेदी मागणी प्रतिसाद: सह्याद्री FPO',
    message_mr: 'सह्याद्री FPO ने आपल्या ६०० क्विंटल सोयाबीन मागणीसाठी अनुकूल दर सादर केला.',
    title_hi: 'खरीद आवश्यकता पर प्रतिक्रिया: सह्याद्री एफपीओ',
    message_hi: 'सह्याद्री एफपीओ ने आपके ६०० क्विंटल सोयाबीन की आवश्यकता हेतु कोटेशन जमा किया।',
    time: '1 day ago',
    type: 'offer_received',
    read: true,
    link: '/buyer',
  },
];

export const DEFAULT_CROP_RECORDS: FarmerCropRecord[] = [
  {
    id: 'crop-rec-01',
    farmerId: 'farmer-mh-001',
    farmerName: 'Ramesh Patil',
    village: 'Niphad',
    district: 'Nashik',
    cropName: 'Soybean',
    cropVariety: 'JS-335 (Yellow Bold)',
    cultivationAreaAcres: 3.5,
    sowingDate: '2026-06-25',
    expectedHarvestDate: '2026-10-15',
    expectedQuantityQuintals: 55,
    actualHarvestedQuantity: 50,
    listedQuantity: 50,
    committedQuantity: 0,
    availableQuantity: 0, // 50 - 50 - 0 = 0
    cropQuality: 'Grade A (Export)',
    storageStatus: 'On-Farm Dry Shed',
    storageLocation: 'Sukene Farmgate Shed, Niphad',
    notes: 'Cleaned and winnowed bold grain. Tested moisture 9.2%, zero pest damage.',
    createdAt: '2026-10-16',
    updatedAt: '2026-10-24',
  },
  {
    id: 'crop-rec-02',
    farmerId: 'farmer-mh-001',
    farmerName: 'Ramesh Patil',
    village: 'Niphad',
    district: 'Nashik',
    cropName: 'Red Onion',
    cropVariety: 'Bhima Super (Garwa)',
    cultivationAreaAcres: 2.5,
    sowingDate: '2026-07-10',
    expectedHarvestDate: '2026-10-22',
    expectedQuantityQuintals: 85,
    actualHarvestedQuantity: 75,
    listedQuantity: 0,
    committedQuantity: 0,
    availableQuantity: 75, // 75 - 0 - 0 = 75
    cropQuality: 'Grade A (Export)',
    storageStatus: 'Kanda Chawl',
    storageLocation: 'Ventilated Chawl #1, Sukene, Niphad',
    notes: 'Medium bold size 45-55mm, cured with dry skin, zero sprouting, 60+ days storage viability.',
    createdAt: '2026-10-23',
    updatedAt: '2026-10-23',
  },
  {
    id: 'crop-rec-03',
    farmerId: 'farmer-mh-001',
    farmerName: 'Ramesh Patil',
    village: 'Niphad',
    district: 'Nashik',
    cropName: 'Wheat',
    cropVariety: 'Lokwan Sharbati Bold',
    cultivationAreaAcres: 2.0,
    sowingDate: '2025-11-10',
    expectedHarvestDate: '2026-03-05',
    expectedQuantityQuintals: 45,
    actualHarvestedQuantity: 40,
    listedQuantity: 0,
    committedQuantity: 0,
    availableQuantity: 40, // 40 - 0 - 0 = 40
    cropQuality: 'Grade B (FAQ)',
    storageStatus: 'Warehouse Pallets',
    storageLocation: 'Niphad Taluka Central Godown',
    notes: 'Treated with neem leaf barrier, moisture 10.1%, clean golden grain.',
    createdAt: '2026-03-08',
    updatedAt: '2026-03-08',
  },
  {
    id: 'crop-rec-04',
    farmerId: 'farmer-mh-001',
    farmerName: 'Ramesh Patil',
    village: 'Niphad',
    district: 'Nashik',
    cropName: 'Cotton',
    cropVariety: 'BT Cotton II (RCH 659)',
    cultivationAreaAcres: 2.0,
    sowingDate: '2026-06-15',
    expectedHarvestDate: '2026-10-28',
    expectedQuantityQuintals: 32,
    actualHarvestedQuantity: 30,
    listedQuantity: 0,
    committedQuantity: 0,
    availableQuantity: 30, // 30 - 0 - 0 = 30
    cropQuality: 'Grade A (Commercial)',
    storageStatus: 'On-Farm Dry Shed',
    storageLocation: 'Sukene Farmgate Shed, Niphad',
    notes: 'First picking white lint, staple length 29.5mm, zero leaf trash.',
    createdAt: '2026-10-29',
    updatedAt: '2026-10-29',
  },
  // Contributing Farmers in Network
  {
    id: 'crop-rec-05',
    farmerId: 'farmer-mh-002',
    farmerName: 'Sunita Deshmukh',
    village: 'Pimpalgaon Baswant',
    district: 'Nashik',
    cropName: 'Red Onion',
    cropVariety: 'Garwa Kharif Late',
    cultivationAreaAcres: 4.0,
    sowingDate: '2026-07-15',
    expectedHarvestDate: '2026-10-25',
    expectedQuantityQuintals: 130,
    actualHarvestedQuantity: 120,
    listedQuantity: 80,
    committedQuantity: 0,
    availableQuantity: 40,
    cropQuality: 'Grade A (Export)',
    storageStatus: 'Kanda Chawl',
    storageLocation: 'Pimpalgaon Chawl Cluster',
    notes: 'Export grade bulbs, aerated mesh storage.',
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },
  {
    id: 'crop-rec-06',
    farmerId: 'farmer-mh-002',
    farmerName: 'Sunita Deshmukh',
    village: 'Pimpalgaon Baswant',
    district: 'Nashik',
    cropName: 'Gram / Chana',
    cropVariety: 'Vijay Bold Chana',
    cultivationAreaAcres: 3.0,
    sowingDate: '2026-10-01',
    expectedHarvestDate: '2027-01-15',
    expectedQuantityQuintals: 50,
    actualHarvestedQuantity: 45,
    listedQuantity: 0,
    committedQuantity: 45,
    availableQuantity: 0,
    cropQuality: 'Grade A (Commercial)',
    storageStatus: 'Sold Out',
    storageLocation: 'Sahyadri Warehouse #2, Niphad',
    notes: 'Contract finalized with Sahyadri Agro Processing Division.',
    createdAt: '2026-10-27',
    updatedAt: '2026-10-31',
  },
  {
    id: 'crop-rec-07',
    farmerId: 'farmer-mh-003',
    farmerName: 'Bhausaheb Shinde',
    village: 'Lasalgaon',
    district: 'Nashik',
    cropName: 'Soybean',
    cropVariety: 'MACS 1407 Bold',
    cultivationAreaAcres: 4.0,
    sowingDate: '2026-06-20',
    expectedHarvestDate: '2026-10-10',
    expectedQuantityQuintals: 70,
    actualHarvestedQuantity: 65,
    listedQuantity: 0,
    committedQuantity: 0,
    availableQuantity: 65,
    cropQuality: 'Grade A (Commercial)',
    storageStatus: 'Warehouse Pallets',
    storageLocation: 'Lasalgaon Farmers Warehouse',
    notes: 'Certified clean seed batch.',
    createdAt: '2026-10-12',
    updatedAt: '2026-10-12',
  },
  {
    id: 'crop-rec-08',
    farmerId: 'farmer-mh-003',
    farmerName: 'Bhausaheb Shinde',
    village: 'Lasalgaon',
    district: 'Nashik',
    cropName: 'Red Onion',
    cropVariety: 'Gavran Lal',
    cultivationAreaAcres: 3.5,
    sowingDate: '2026-07-05',
    expectedHarvestDate: '2026-10-18',
    expectedQuantityQuintals: 110,
    actualHarvestedQuantity: 100,
    listedQuantity: 100,
    committedQuantity: 0,
    availableQuantity: 0,
    cropQuality: 'Grade A (Export)',
    storageStatus: 'Kanda Chawl',
    storageLocation: 'Lasalgaon Chawl Yard',
    notes: 'Committed to export buffer pool.',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-25',
  },
];

const KEYS = {
  LISTINGS: 'krishimitra_produce_listings_v2',
  OFFERS: 'krishimitra_buyer_offers_v2',
  LOTS: 'krishimitra_fpo_lots_v2',
  REQUIREMENTS: 'krishimitra_buyer_requirements_v2',
  NOTIFICATIONS: 'krishimitra_app_notifications_v2',
  CROPS: 'krishimitra_crop_records_v2',
};

// Safe JSON Parse Helper
const getStored = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
  }
  return defaultValue;
};

// Safe JSON Save Helper
const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

// Stock equation helper: Available Quantity = Harvested Quantity - Listed Quantity - Committed Quantity
export const computeAvailableQuantity = (
  harvested: number,
  listed: number,
  committed: number
): number => {
  return Math.max(0, harvested - (listed + committed));
};

// ==========================================
// 1. CROP MANAGEMENT & PRODUCE INVENTORY
// ==========================================

export const getCropRecords = (farmerId?: string): FarmerCropRecord[] => {
  const all = getStored<FarmerCropRecord[]>(KEYS.CROPS, DEFAULT_CROP_RECORDS);
  if (!farmerId) return all;
  return all.filter((c) => c.farmerId === farmerId);
};

export const getCropRecordById = (id: string): FarmerCropRecord | undefined => {
  const all = getCropRecords();
  return all.find((c) => c.id === id);
};

export const addCropRecord = (
  recordData: Omit<
    FarmerCropRecord,
    'id' | 'createdAt' | 'updatedAt' | 'listedQuantity' | 'committedQuantity' | 'availableQuantity'
  >
): FarmerCropRecord[] => {
  const all = getCropRecords();
  const harvested = Math.max(0, Number(recordData.actualHarvestedQuantity) || 0);
  const now = new Date().toISOString().split('T')[0];

  const newRecord: FarmerCropRecord = {
    ...recordData,
    id: `crop-rec-${Date.now()}`,
    actualHarvestedQuantity: harvested,
    listedQuantity: 0,
    committedQuantity: 0,
    availableQuantity: harvested,
    storageStatus: harvested > 0 ? (recordData.storageStatus || 'On-Farm Dry Shed') : 'Awaiting Storage',
    createdAt: now,
    updatedAt: now,
  };

  const updated = [newRecord, ...all];
  setStored(KEYS.CROPS, updated);

  addNotification({
    id: `notif-${Date.now()}-farmer`,
    role: 'FARMER',
    title: `New Crop Added: ${newRecord.cropName}`,
    message: `${newRecord.actualHarvestedQuantity} Qtl ${newRecord.cropVariety} recorded in your inventory. Available for sale: ${newRecord.availableQuantity} Qtl.`,
    time: 'Just now',
    type: 'listing_added',
    read: false,
    link: '/crop-selection',
  });

  return updated;
};

export const updateCropRecord = (
  id: string,
  updates: Partial<FarmerCropRecord>
): FarmerCropRecord[] => {
  const all = getCropRecords();
  const now = new Date().toISOString().split('T')[0];

  const updated = all.map((c) => {
    if (c.id !== id) return c;

    const harvested =
      updates.actualHarvestedQuantity !== undefined
        ? Math.max(0, Number(updates.actualHarvestedQuantity))
        : c.actualHarvestedQuantity;

    const listed =
      updates.listedQuantity !== undefined
        ? Math.max(0, Number(updates.listedQuantity))
        : c.listedQuantity;

    const committed =
      updates.committedQuantity !== undefined
        ? Math.max(0, Number(updates.committedQuantity))
        : c.committedQuantity;

    const available = computeAvailableQuantity(harvested, listed, committed);

    // Auto-update storage status if sold out
    let storageStatus = updates.storageStatus || c.storageStatus;
    if (available === 0 && committed >= harvested && harvested > 0) {
      storageStatus = 'Sold Out';
    } else if (storageStatus === 'Sold Out' && available > 0) {
      storageStatus = 'On-Farm Dry Shed';
    }

    return {
      ...c,
      ...updates,
      actualHarvestedQuantity: harvested,
      listedQuantity: listed,
      committedQuantity: committed,
      availableQuantity: available,
      storageStatus,
      updatedAt: now,
    };
  });

  setStored(KEYS.CROPS, updated);
  return updated;
};

export const deleteCropRecord = (id: string): FarmerCropRecord[] => {
  const all = getCropRecords();
  const target = all.find((c) => c.id === id);

  // Validation: prevent deleting crop with committed/active lots
  if (target && target.committedQuantity > 0) {
    throw new Error('हा पीक साठा खरेदीदाराशी किंवा FPO शी करारबद्ध असल्याने हटवता येणार नाही (Cannot delete committed stock).');
  }

  const updated = all.filter((c) => c.id !== id);
  setStored(KEYS.CROPS, updated);
  return updated;
};

export const getProduceInventorySummary = (farmerId: string = 'farmer-mh-001'): ProduceInventorySummary => {
  const farmerCrops = getCropRecords(farmerId);

  const totalHarvested = farmerCrops.reduce((acc, c) => acc + c.actualHarvestedQuantity, 0);
  const totalListed = farmerCrops.reduce((acc, c) => acc + c.listedQuantity, 0);
  const totalCommitted = farmerCrops.reduce((acc, c) => acc + c.committedQuantity, 0);
  const totalAvailable = farmerCrops.reduce((acc, c) => acc + c.availableQuantity, 0);

  const cropBreakdown = farmerCrops.map((c) => {
    // Calculate indicative safe shelf-life days based on crop and storage
    let shelfLifeDays = 30;
    if (c.cropName.includes('Onion')) {
      shelfLifeDays = c.storageStatus === 'Kanda Chawl' ? 75 : 20;
    } else if (c.cropName.includes('Soybean')) {
      shelfLifeDays = c.storageStatus === 'Warehouse Pallets' ? 180 : 90;
    } else if (c.cropName.includes('Cotton')) {
      shelfLifeDays = 120;
    } else if (c.cropName.includes('Wheat')) {
      shelfLifeDays = 240;
    } else if (c.cropName.includes('Gram') || c.cropName.includes('Chana')) {
      shelfLifeDays = 150;
    }

    return {
      cropName: c.cropName,
      cropVariety: c.cropVariety,
      harvested: c.actualHarvestedQuantity,
      listed: c.listedQuantity,
      committed: c.committedQuantity,
      available: c.availableQuantity,
      quality: c.cropQuality,
      storage: c.storageStatus,
      storageLocation: c.storageLocation,
      shelfLifeDays,
    };
  });

  return {
    totalHarvested,
    totalListed,
    totalCommitted,
    totalAvailable,
    cropCount: farmerCrops.length,
    cropBreakdown,
  };
};

// ==========================================
// 2. PRODUCE LISTINGS (WITH STOCK SYNC)
// ==========================================

export const getProduceListings = (): FarmerMarketplaceListing[] => {
  return getStored<FarmerMarketplaceListing[]>(KEYS.LISTINGS, MOCK_MARKETPLACE_LISTINGS);
};

export const addProduceListing = (listing: FarmerMarketplaceListing): FarmerMarketplaceListing[] => {
  const current = getProduceListings();
  const updated = [listing, ...current];
  setStored(KEYS.LISTINGS, updated);

  // Sync with Crop Inventory: update listed quantity and available quantity
  const crops = getCropRecords();
  const matchedCropIndex = crops.findIndex(
    (c) =>
      c.farmerId === listing.farmerId &&
      (c.cropName.toLowerCase() === listing.cropName.toLowerCase() ||
        c.cropName.includes(listing.cropName) ||
        listing.cropName.includes(c.cropName))
  );

  if (matchedCropIndex !== -1) {
    const crop = crops[matchedCropIndex];
    const newListed = crop.listedQuantity + listing.quantityQuintals;
    const newAvailable = computeAvailableQuantity(crop.actualHarvestedQuantity, newListed, crop.committedQuantity);

    crops[matchedCropIndex] = {
      ...crop,
      listedQuantity: newListed,
      availableQuantity: newAvailable,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setStored(KEYS.CROPS, crops);
  }

  // Cross-role notifications: notify FPO & Buyers
  addNotification({
    id: `notif-${Date.now()}-fpo`,
    role: 'FPO',
    title: `New Farmer Listing: ${listing.farmerName}`,
    title_mr: `नवीन शेतकरी नोंद: ${listing.farmerName}`,
    title_hi: `नया किसान उत्पाद: ${listing.farmerName}`,
    message: `${listing.farmerName} in ${listing.village} listed ${listing.quantityQuintals} Qtl ${listing.cropName} (Expected: ₹${listing.expectedPricePerQuintal}/Qtl).`,
    message_mr: `${listing.farmerName} (${listing.village}) यांनी ${listing.quantityQuintals} क्विंटल ${listing.cropName} बाजारात नोंदवले आहे (अपेक्षित: ₹${listing.expectedPricePerQuintal}/क्विंटल).`,
    message_hi: `${listing.farmerName} (${listing.village}) ने ${listing.quantityQuintals} क्विंटल ${listing.cropName} सूचीबद्ध किया है (अपेक्षित: ₹${listing.expectedPricePerQuintal}/क्विंटल)।`,
    time: 'Just now',
    type: 'listing_added',
    read: false,
    link: '/fpo',
  });

  addNotification({
    id: `notif-${Date.now()}-buyer`,
    role: 'BUYER',
    title: `New Harvest Produce: ${listing.cropName}`,
    title_mr: `नवीन शेतमाल विक्रीसाठी उपलब्ध: ${listing.cropName}`,
    title_hi: `नया कृषि उत्पाद उपलब्ध: ${listing.cropName}`,
    message: `${listing.quantityQuintals} Qtl ${listing.cropName} available in ${listing.village} (${listing.qualityGrade}).`,
    message_mr: `${listing.village} येथे ${listing.quantityQuintals} क्विंटल ${listing.cropName} (${listing.qualityGrade}) थेट खरेदीसाठी उपलब्ध.`,
    message_hi: `${listing.village} में ${listing.quantityQuintals} क्विंटल ${listing.cropName} (${listing.qualityGrade}) प्रत्यक्ष खरीद के लिए उपलब्ध।`,
    time: 'Just now',
    type: 'listing_added',
    read: false,
    link: '/buyer',
  });

  return updated;
};

// ==========================================
// 3. FPO BULK LOTS (WITH STOCK COMMITMENT)
// ==========================================

export const getFpoLots = (): FpoAggregatedLot[] => {
  return getStored<FpoAggregatedLot[]>(KEYS.LOTS, MOCK_AGGREGATED_LOTS);
};

export const addFpoLot = (lot: FpoAggregatedLot, pooledListingIds: string[] = []): FpoAggregatedLot[] => {
  const current = getFpoLots();
  const updated = [lot, ...current];
  setStored(KEYS.LOTS, updated);

  // Mark selected farmer listings as pooled & update inventory committed quantity
  if (pooledListingIds.length > 0) {
    const listings = getProduceListings();
    const crops = getCropRecords();

    const updatedListings = listings.map((l) => {
      if (pooledListingIds.includes(l.id)) {
        // Find matching crop record and update committed quantity
        const matchedCrop = crops.find(
          (c) =>
            c.farmerId === l.farmerId &&
            (c.cropName.toLowerCase() === l.cropName.toLowerCase() ||
              c.cropName.includes(l.cropName) ||
              l.cropName.includes(c.cropName))
        );

        if (matchedCrop) {
          const newListed = Math.max(0, matchedCrop.listedQuantity - l.quantityQuintals);
          const newCommitted = matchedCrop.committedQuantity + l.quantityQuintals;
          matchedCrop.listedQuantity = newListed;
          matchedCrop.committedQuantity = newCommitted;
          matchedCrop.availableQuantity = computeAvailableQuantity(
            matchedCrop.actualHarvestedQuantity,
            newListed,
            newCommitted
          );
          if (matchedCrop.availableQuantity === 0 && newCommitted >= matchedCrop.actualHarvestedQuantity) {
            matchedCrop.storageStatus = 'Sold Out';
          }
        }

        return { ...l, status: 'Aggregated with FPO' as const };
      }
      return l;
    });

    setStored(KEYS.LISTINGS, updatedListings);
    setStored(KEYS.CROPS, crops);
  }

  // Cross-role notification: notify Buyers
  addNotification({
    id: `notif-${Date.now()}-buyer`,
    role: 'BUYER',
    title: `New Bulk Aggregated Lot: ${lot.cropName}`,
    title_mr: `नवीन FPO एकत्रित विक्री लॉट: ${lot.cropName}`,
    title_hi: `नया FPO थोक लॉट: ${lot.cropName}`,
    message: `${lot.lotCode} (${lot.totalQuantityQuintals} Qtl ${lot.cropName}) published by FPO at target ₹${lot.targetPricePerQuintal}/Qtl.`,
    message_mr: `${lot.lotCode} (${lot.totalQuantityQuintals} क्विंटल ${lot.cropName}) FPO द्वारे ₹${lot.targetPricePerQuintal}/क्विंटल दराने प्रकाशित करण्यात आला आहे.`,
    message_hi: `${lot.lotCode} (${lot.totalQuantityQuintals} क्विंटल ${lot.cropName}) FPO द्वारा ₹${lot.targetPricePerQuintal}/क्विंटल भाव पर प्रकाशित किया गया है।`,
    time: 'Just now',
    type: 'lot_aggregated',
    read: false,
    link: '/buyer',
  });

  return updated;
};

// ==========================================
// 4. BUYER OFFERS & STOCK DEDUCTION
// ==========================================

export const getBuyerOffers = (): MarketplaceOffer[] => {
  return getStored<MarketplaceOffer[]>(KEYS.OFFERS, MOCK_MARKETPLACE_OFFERS);
};

export const addBuyerOffer = (offer: MarketplaceOffer): MarketplaceOffer[] => {
  const current = getBuyerOffers();
  const updated = [offer, ...current];
  setStored(KEYS.OFFERS, updated);

  // Cross-role notification: notify Farmer
  addNotification({
    id: `notif-${Date.now()}-farmer`,
    role: 'FARMER',
    title: `New Offer from ${offer.buyerName}`,
    title_mr: `${offer.buyerName} कडून थेट खरेदी ऑफर`,
    title_hi: `${offer.buyerName} से सीधी खरीद प्रस्ताव`,
    message: `Received bid of ₹${offer.offeredPricePerQuintal}/Qtl for ${offer.quantityQuintals} Qtl ${offer.listingCrop} (${offer.deliveryTerms}).`,
    message_mr: `${offer.quantityQuintals} क्विंटल ${offer.listingCrop} साठी ₹${offer.offeredPricePerQuintal}/क्विंटल दराने नवीन ऑफर प्राप्त झाली आहे (${offer.deliveryTerms}).`,
    message_hi: `${offer.quantityQuintals} क्विंटल ${offer.listingCrop} के लिए ₹${offer.offeredPricePerQuintal}/क्विंटल दर से नया प्रस्ताव प्राप्त हुआ है (${offer.deliveryTerms})।`,
    time: 'Just now',
    type: 'offer_received',
    read: false,
    link: '/fpo-marketplace?tab=negotiations',
  });

  return updated;
};

export const updateBuyerOfferStatus = (
  offerId: string,
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Counteroffer Sent',
  counterPrice?: number,
  counterNote?: string
): MarketplaceOffer[] => {
  const current = getBuyerOffers();
  const matched = current.find((o) => o.id === offerId);

  const updated = current.map((o) =>
    o.id === offerId
      ? {
          ...o,
          status,
          ...(counterPrice ? { farmerCounterPrice: counterPrice } : {}),
          ...(counterNote ? { farmerCounterNote: counterNote } : {}),
        }
      : o
  );
  setStored(KEYS.OFFERS, updated);

  // Stock commitment rule: update stock when offer is Accepted
  if (matched && status === 'Accepted') {
    // 1. Mark listing as Sold if applicable
    const listings = getProduceListings();
    const updatedListings = listings.map((l) => {
      if (l.id === matched.listingId || (l.farmerId === 'farmer-mh-001' && l.cropName.includes(matched.listingCrop))) {
        return { ...l, status: 'Sold' as const };
      }
      return l;
    });
    setStored(KEYS.LISTINGS, updatedListings);

    // 2. Commit quantity in Farmer Crop Inventory
    const crops = getCropRecords();
    const matchedCropIndex = crops.findIndex(
      (c) =>
        c.cropName.toLowerCase() === matched.listingCrop.toLowerCase() ||
        c.cropName.includes(matched.listingCrop) ||
        matched.listingCrop.includes(c.cropName)
    );

    if (matchedCropIndex !== -1) {
      const crop = crops[matchedCropIndex];
      const newListed = Math.max(0, crop.listedQuantity - matched.quantityQuintals);
      const newCommitted = crop.committedQuantity + matched.quantityQuintals;
      const newAvailable = computeAvailableQuantity(crop.actualHarvestedQuantity, newListed, newCommitted);

      crops[matchedCropIndex] = {
        ...crop,
        listedQuantity: newListed,
        committedQuantity: newCommitted,
        availableQuantity: newAvailable,
        storageStatus: newAvailable === 0 && newCommitted >= crop.actualHarvestedQuantity ? 'Sold Out' : crop.storageStatus,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setStored(KEYS.CROPS, crops);
    }

    // 3. Notify Buyer of Accepted Agreement
    addNotification({
      id: `notif-${Date.now()}-buyer`,
      role: 'BUYER',
      title: `Offer Accepted for ${matched.listingCrop}!`,
      title_mr: `शेतकऱ्याने ${matched.listingCrop} ची ऑफर स्वीकारली!`,
      title_hi: `किसान ने ${matched.listingCrop} का प्रस्ताव स्वीकार किया!`,
      message: `Farmer accepted your offer of ₹${matched.offeredPricePerQuintal}/Qtl for ${matched.quantityQuintals} Qtl. Produce moved to committed stock.`,
      message_mr: `शेतकऱ्याने ₹${matched.offeredPricePerQuintal}/क्विंटल दराने ${matched.quantityQuintals} क्विंटलसाठी ऑफर स्वीकारली. माल वचनबद्ध साठ्यात वर्ग.`,
      message_hi: `किसान ने ₹${matched.offeredPricePerQuintal}/क्विंटल पर ${matched.quantityQuintals} क्विंटल का प्रस्ताव स्वीकार कर लिया।`,
      time: 'Just now',
      type: 'contract_finalized',
      read: false,
      link: '/buyer',
    });

    // 4. Notify Farmer of Stock Commitment
    addNotification({
      id: `notif-${Date.now()}-farmer`,
      role: 'FARMER',
      title: `Produce Sold: ${matched.quantityQuintals} Qtl ${matched.listingCrop}`,
      title_mr: `उत्पादन विक्री निश्चित: ${matched.quantityQuintals} क्विंटल ${matched.listingCrop}`,
      title_hi: `उत्पाद सौदा संपन्न: ${matched.quantityQuintals} क्विंटल ${matched.listingCrop}`,
      message: `Deal finalized at ₹${matched.offeredPricePerQuintal}/Qtl. Quantity successfully updated to Committed/Sold in your inventory.`,
      message_mr: `₹${matched.offeredPricePerQuintal}/क्विंटल दराने सौदा पक्का झाला. इन्व्हेंटरीमध्ये साठा यशस्वीरीत्या विकला गेला.`,
      message_hi: `₹${matched.offeredPricePerQuintal}/क्विंटल पर सौदा संपन्न हुआ। इन्वेंट्री में मात्रा सफलतापूर्वक बेची गई दर्ज हुई।`,
      time: 'Just now',
      type: 'contract_finalized',
      read: false,
      link: '/crop-selection',
    });
  } else if (matched && status === 'Counteroffer Sent' && counterPrice) {
    addNotification({
      id: `notif-${Date.now()}-buyer`,
      role: 'BUYER',
      title: `Counteroffer Proposed by Farmer: ₹${counterPrice}/Qtl`,
      title_mr: `शेतकऱ्याकडून प्रति-ऑफर: ₹${counterPrice}/क्विंटल`,
      title_hi: `किसान की ओर से प्रति-प्रस्ताव: ₹${counterPrice}/क्विंटल`,
      message: `Farmer proposed counter price of ₹${counterPrice}/Qtl for ${matched.quantityQuintals} Qtl ${matched.listingCrop}.`,
      message_mr: `शेतकऱ्याने ${matched.quantityQuintals} क्विंटल ${matched.listingCrop} साठी ₹${counterPrice}/क्विंटल प्रति-ऑफर पाठवली आहे.`,
      message_hi: `किसान ने ${matched.quantityQuintals} क्विंटल ${matched.listingCrop} के लिए ₹${counterPrice}/क्विंटल का प्रति-प्रस्ताव भेजा है।`,
      time: 'Just now',
      type: 'counter_received',
      read: false,
      link: '/buyer',
    });
  }

  return updated;
};

// ==========================================
// 5. BUYER REQUIREMENTS
// ==========================================

export const getBuyerRequirements = (): BuyerRequirement[] => {
  return getStored<BuyerRequirement[]>(KEYS.REQUIREMENTS, MOCK_BUYER_REQUIREMENTS);
};

export const addBuyerRequirement = (requirement: BuyerRequirement): BuyerRequirement[] => {
  const current = getBuyerRequirements();
  const updated = [requirement, ...current];
  setStored(KEYS.REQUIREMENTS, updated);

  addNotification({
    id: `notif-${Date.now()}-fpo`,
    role: 'FPO',
    title: `New Buyer Requirement: ${requirement.buyerName}`,
    title_mr: `नवीन खरेदीदार मागणी: ${requirement.buyerName}`,
    title_hi: `नई क्रेता आवश्यकता: ${requirement.buyerName}`,
    message: `Seeking ${requirement.requiredQuantityQuintals} Qtl ${requirement.cropName} at up to ₹${requirement.maxOfferedPricePerQuintal}/Qtl.`,
    message_mr: `${requirement.requiredQuantityQuintals} क्विंटल ${requirement.cropName} कमाल ₹${requirement.maxOfferedPricePerQuintal}/क्विंटल दराने खरेदी करण्याची मागणी.`,
    message_hi: `${requirement.requiredQuantityQuintals} क्विंटल ${requirement.cropName} अधिकतम ₹${requirement.maxOfferedPricePerQuintal}/क्विंटल दर पर मांग।`,
    time: 'Just now',
    type: 'offer_received',
    read: false,
    link: '/fpo',
  });

  return updated;
};

// ==========================================
// 6. NOTIFICATIONS
// ==========================================

export const getNotifications = (role?: UserRole): AppNotification[] => {
  const all = getStored<AppNotification[]>(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  if (!role) return all;
  return all.filter((n) => n.role === role);
};

export const addNotification = (notification: AppNotification): void => {
  const current = getStored<AppNotification[]>(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  const updated = [notification, ...current];
  setStored(KEYS.NOTIFICATIONS, updated);
};

export const markNotificationAsRead = (id: string): AppNotification[] => {
  const current = getStored<AppNotification[]>(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  setStored(KEYS.NOTIFICATIONS, updated);
  return updated;
};

export const markAllNotificationsAsRead = (role: UserRole): AppNotification[] => {
  const current = getStored<AppNotification[]>(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  const updated = current.map((n) => (n.role === role ? { ...n, read: true } : n));
  setStored(KEYS.NOTIFICATIONS, updated);
  return updated;
};

export const clearNotifications = (role: UserRole): AppNotification[] => {
  const current = getStored<AppNotification[]>(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  const updated = current.filter((n) => n.role !== role);
  setStored(KEYS.NOTIFICATIONS, updated);
  return updated;
};

export const deleteNotification = (id: string): AppNotification[] => {
  const current = getStored<AppNotification[]>(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  const updated = current.filter((n) => n.id !== id);
  setStored(KEYS.NOTIFICATIONS, updated);
  return updated;
};

export const toggleNotificationRead = (id: string): AppNotification[] => {
  const current = getStored<AppNotification[]>(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  const updated = current.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
  setStored(KEYS.NOTIFICATIONS, updated);
  return updated;
};

// ==========================================
// 7. SANDBOX RESTORATION
// ==========================================
export const resetToMockData = (): void => {
  try {
    localStorage.removeItem(KEYS.LISTINGS);
    localStorage.removeItem(KEYS.OFFERS);
    localStorage.removeItem(KEYS.LOTS);
    localStorage.removeItem(KEYS.REQUIREMENTS);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    localStorage.removeItem(KEYS.CROPS);
  } catch (e) {
    console.error('Error clearing localStorage mock keys', e);
  }
};

/**
 * mapService.js
 * Abstraction layer for Investment Map data — geographic zones of Jordan
 * grouped by investment opportunity, with real GPS coordinates.
 *
 * Currently returns mock data; replace `fetchMapZones` internals
 * with real Firestore calls when backend is ready.
 *
 * Expected Firestore collection: "zones"
 * TODO: Replace mock functions with:
 *   const snapshot = await firestore().collection('zones').get();
 *   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
 */

// ---------------------------------------------------------------------------
// Mock Data — mirrors the Firestore document structure
// ---------------------------------------------------------------------------
const MOCK_ZONES = [
  {
    id: 'zone_wadi_araba',
    nameEn: 'Wadi Araba Solar Corridor',
    nameAr: 'ممر وادي عربة الشمسي',
    regionCode: 'south',
    regionEn: 'South Jordan',
    regionAr: 'جنوب الأردن',
    sector: 'Energy',
    description:
      "Jordan's largest sovereign-backed solar corridor. Spanning 220 km² of desert terrain with direct grid access.",
    descriptionAr:
      'أكبر ممر شمسي مدعوم سيادياً في الأردن. يمتد على 220 كم² من التضاريس الصحراوية مع وصول مباشر للشبكة.',
    // GPS: Wadi Araba rift valley, southern Jordan
    lat: 30.05,
    lng: 35.22,
    listingCount: 2,
    totalCapital: 70000000,
    currency: 'JOD',
    isEcoFriendly: true,
    isFeatured: true,
    listings: [
      {
        id: 'listing_001',
        titleEn: 'Wadi Araba Solar Park',
        titleAr: 'حديقة وادي عربة الشمسية',
        targetYieldPct: 14.2,
        isEcoFriendly: true,
        status: 'active',
      },
      {
        id: 'listing_007',
        titleEn: 'Wadi Araba Wind Farm',
        titleAr: 'مزرعة رياح وادي عربة',
        targetYieldPct: 11.8,
        isEcoFriendly: true,
        status: 'active',
      },
    ],
  },
  {
    id: 'zone_amman_central',
    nameEn: 'Amman Heritage District',
    nameAr: 'حي عمان التراثي',
    regionCode: 'central',
    regionEn: 'Central Jordan',
    regionAr: 'وسط الأردن',
    sector: 'Tourism',
    description:
      'Historic Amman estates undergoing heritage revitalization into 5-star boutique experiences.',
    descriptionAr:
      'مبانٍ تاريخية في عمان يجري إحياؤها لتتحول إلى تجارب بوتيك خمس نجوم.',
    // GPS: Jabal Amman / Rainbow Street area
    lat: 31.954,
    lng: 35.929,
    listingCount: 2,
    totalCapital: 20000000,
    currency: 'JOD',
    isEcoFriendly: true,
    isFeatured: false,
    listings: [
      {
        id: 'listing_002',
        titleEn: 'Al-Qasr Heritage Boutique Hotel',
        titleAr: 'فندق القصر التراثي البوتيك',
        targetYieldPct: 9.5,
        isEcoFriendly: true,
        status: 'active',
      },
      {
        id: 'listing_008',
        titleEn: 'Rainbow Street Cultural Hub',
        titleAr: 'مركز شارع الرينبو الثقافي',
        targetYieldPct: 8.2,
        isEcoFriendly: false,
        status: 'active',
      },
    ],
  },
  {
    id: 'zone_jordan_valley',
    nameEn: 'Jordan Valley Agri-Zone',
    nameAr: 'منطقة الزراعة في وادي الأردن',
    regionCode: 'north',
    regionEn: 'North Jordan',
    regionAr: 'شمال الأردن',
    sector: 'Agriculture',
    description:
      'Next-generation sustainable farming utilizing 90% less water for high-yield produce exports.',
    descriptionAr:
      'زراعة مستدامة من الجيل التالي تستخدم 90٪ أقل من المياه لتصدير المنتجات.',
    // GPS: Jordan Valley agricultural heartland near Deir Alla
    lat: 32.195,
    lng: 35.609,
    listingCount: 2,
    totalCapital: 10000000,
    currency: 'JOD',
    isEcoFriendly: true,
    isFeatured: false,
    listings: [
      {
        id: 'listing_003',
        titleEn: 'Jordan Valley Hydroponics',
        titleAr: 'الزراعة المائية في وادي الأردن',
        targetYieldPct: 12.1,
        isEcoFriendly: true,
        status: 'active',
      },
      {
        id: 'listing_009',
        titleEn: 'Al-Ghor Vertical Farms',
        titleAr: 'مزارع الغور العمودية',
        targetYieldPct: 13.4,
        isEcoFriendly: true,
        status: 'active',
      },
    ],
  },
  {
    id: 'zone_aqaba',
    nameEn: 'Aqaba Economic Zone',
    nameAr: 'منطقة العقبة الاقتصادية',
    regionCode: 'aqaba',
    regionEn: 'Aqaba Special Economic Zone',
    regionAr: 'منطقة العقبة الاقتصادية الخاصة',
    sector: 'Technology',
    description:
      'AI-driven maritime and logistics hub in the Aqaba Special Economic Zone. Projected 22% ROI annually.',
    descriptionAr:
      'مركز بحري ولوجستي مدعوم بالذكاء الاصطناعي في منطقة العقبة الاقتصادية الخاصة.',
    // GPS: Aqaba port area, southern tip of Jordan
    lat: 29.528,
    lng: 35.006,
    listingCount: 1,
    totalCapital: 20000000,
    currency: 'JOD',
    isEcoFriendly: false,
    isFeatured: false,
    listings: [
      {
        id: 'listing_004',
        titleEn: 'Aqaba Smart Logistics Hub',
        titleAr: 'مركز العقبة الذكي للخدمات اللوجستية',
        targetYieldPct: 22.0,
        isEcoFriendly: false,
        status: 'active',
      },
    ],
  },
  {
    id: 'zone_petra',
    nameEn: "Petra — Ma'an Heritage",
    nameAr: 'البتراء — التراث',
    regionCode: 'south',
    regionEn: 'South Jordan',
    regionAr: 'جنوب الأردن',
    sector: 'Tourism',
    description:
      'UNESCO-listed Petra site. Immersive AR/VR tourism backed by the Jordan Tourism Board.',
    descriptionAr:
      'موقع البتراء المدرج في اليونسكو. سياحة غامرة بالواقع المعزز بدعم من هيئة السياحة الأردنية.',
    // GPS: Petra archaeological site, Ma'an Governorate
    lat: 30.328,
    lng: 35.444,
    listingCount: 1,
    totalCapital: 8000000,
    currency: 'JOD',
    isEcoFriendly: false,
    isFeatured: false,
    listings: [
      {
        id: 'listing_005',
        titleEn: 'Petra Digital Heritage Center',
        titleAr: 'مركز البتراء للتراث الرقمي',
        targetYieldPct: 10.3,
        isEcoFriendly: false,
        status: 'active',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Service Functions
// ---------------------------------------------------------------------------

/**
 * Fetches all investment map zones.
 * TODO: Replace with:
 *   const snapshot = await firestore().collection('zones').orderBy('totalCapital', 'desc').get();
 *   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
 */
export async function fetchMapZones() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_ZONES;
}

/**
 * Fetches a single zone by ID.
 * TODO: Replace with:
 *   const doc = await firestore().collection('zones').doc(id).get();
 *   return doc.exists ? { id: doc.id, ...doc.data() } : null;
 */
export async function fetchMapZoneById(id) {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return MOCK_ZONES.find((z) => z.id === id) ?? null;
}

/**
 * Fetches zones filtered by sector.
 * TODO: Replace with:
 *   const snapshot = await firestore().collection('zones').where('sector', '==', sector).get();
 */
export async function fetchZonesBySector(sector) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (sector === 'All') return MOCK_ZONES;
  return MOCK_ZONES.filter((z) => z.sector === sector);
}

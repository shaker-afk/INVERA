/**
 * useTranslation.js
 * A lightweight i18n hook for AR/EN support.
 *
 * Language state lives in LanguageContext (app/_layout.tsx) so all screens
 * share the same language selection — toggling on the Dashboard instantly
 * affects the Detail screen, Filters screen, etc.
 *
 * TODO: Replace with a full i18n library (i18next + react-i18next) or
 * Firebase Remote Config for dynamic string updates.
 */

import { useCallback } from 'react';
import { useLanguageContext } from '../contexts/LanguageContext';

// ---------------------------------------------------------------------------
// Translation Dictionary
// ---------------------------------------------------------------------------
const translations = {
  en: {
    // Header
    searchPlaceholder: 'Search opportunities...',
    marketplace: 'Marketplace',
    filter: 'Filter',
    // Sections
    activeOpportunities: 'Active Opportunities',
    viewAll: 'View All',
    featuredProject: 'Featured Project',
    // Badges
    ecoFriendly: 'Eco-Friendly',
    trending: 'Trending',
    // Card Actions
    invest: 'Invest Now',
    details: 'View Details',
    save: 'Save',
    // Capital Range
    capitalRange: 'Capital Range',
    // Empty State
    noListings: 'No listings found.',
    // Greeting
    greeting: 'Good morning',
    tagline: 'Invest in the Future of Jordan',
    taglinePart1: 'Invest in the',
    taglinePart2: 'Future of Jordan',
    // Detail Screen
    back: 'Back',
    overview: 'Overview',
    financials: 'Financials',
    targetCapital: 'Target Capital',
    raised: 'Raised',
    funded: 'Funded',
    location: 'Location',
    status: 'Status',
    active: 'Active',
    trendingInvestors: 'Trending Investors',
    minInvestment: 'Min. Investment',
    maxInvestment: 'Max. Investment',
    aboutProject: 'About This Project',
    ecoStatus: 'Eco-Certified',
    notEco: 'Standard',
    investorCount: 'Interested Investors',
    shareProject: 'Share',
    currency: 'Currency',
    investorsWatching: 'Investors Watching',
    // Filters Screen
    filterTitle: 'Refine Results',
    resetFilters: 'Reset',
    applyFilters: 'Apply Filters',
    sectorFilter: 'Sector',
    capitalFilter: 'Capital Range',
    ecoFilter: 'Eco-Friendly Only',
    ecoFilterDesc: 'Show only environmentally certified projects',
    activeFilters: 'Active Filters',
    noActiveFilters: 'No filters applied',
    // Investment Map Screen
    mapTitle: 'Investment Map',
    mapSubtitle: 'Jordan Opportunity Zones',
    mapSectorLegend: 'Sector Legend',
    mapAllZones: 'All',
    mapTopYield: 'Est. Yield',
    mapTotalCapital: 'Fund Size',
    mapListings: 'Projects',
    mapExploreZone: 'View Listings',
    mapFeaturedZone: 'Featured Zone',
    mapNoZones: 'No zones found for this sector.',
    mapRegionsLabel: 'Investment Regions',
    mapEsg: 'ESG',
    // Manage Screen
    entityDashboard: 'ENTITY DASHBOARD',
    createListing: 'Create Listing',
    engagementTracker: 'Engagement Tracker',
    engagementDesc: 'Monthly reach & inquiry volume',
    engagementGrowth: '+14.3% vs last month',
    totalCapitalRaised: 'Total Capital Raised',
    portfolioValue: 'PORTFOLIO VALUE',
    yourListings: 'Your Listings',
    viewAllListings: 'View All Listings',
    live: 'LIVE',
    pending: 'PENDING',
    edit: 'Edit',
    underComplianceReview: 'Under compliance review',
    newListingTitle: 'New Listing',
    newListingDesc: 'Start a new investment entity',
    documentVault: 'Document Vault',
    officialIncorporation: 'OFFICIAL INCORPORATION',
    legalClearance: 'LEGAL CLEARANCE',
    taxCompliance: 'TAX COMPLIANCE',
    underReview: 'UNDER REVIEW',
    // Profile Screen
    pro: 'PRO',
    wealthManagement: 'Wealth Management\nPortfolio',
    investor: 'Investor',
    company: 'Company',
    sectorInterests: 'Sector Interests',
    addInterest: 'ADD INTEREST',
    greenEnergy: 'Green Energy',
    realEstate: 'Real Estate',
    medTech: 'MedTech',
    finTech: 'FinTech',
    agriTech: 'AgriTech',
    institutionalSecurity: 'Institutional Security',
    securityDesc: 'Your ledger is protected by multi-factor sovereign encryption protocols.',
    manageCredentials: 'MANAGE CREDENTIALS',
    notificationHub: 'Notification Hub',
    newMatchAlert: 'New Match Alert',
    messageFrom: 'Message from Al-Zaman Equity',
    documentStatusUpdate: 'Document Status Update',
    loginDetected: 'Login Detected',
    viewAllActivity: 'VIEW ALL ACTIVITY',
    approved: 'Approved.',
    timeAgo2M: '2M AGO',
    timeAgo1H: '1H AGO',
    timeAgo4H: '4H AGO',
    yesterday: 'YESTERDAY',
    // Create Listing Modal
    assetDetails: 'Asset Details',
    assetName: 'Asset Name',
    description: 'Description',
    targetCapitalJod: 'Target Capital (JOD)',
    assetType: 'Asset Type',
    selectCategory: 'Select category',
    // Manage Credentials Modal
    securityAndCredentials: 'Security & Credentials',
    sovSecurityLevel: 'Sovereign Security Level: High',
    encryptionDesc: 'Your investments are protected by end-to-end encryption.',
    authMethods: 'Authentication Methods',
    twoFactorAuth: 'Two-Factor Authentication',
    biometricLogin: 'Biometric Login',
    changePassword: 'Change Password',
    deviceManagement: 'Device Management',
    currentDevice: 'Current Device',
    activeText: 'Active',
    revokeText: 'Revoke',
    // Add Interest Modal
    safeAddInterests: 'Add Interests',
    searchSectors: 'Search sectors...',
    artificialIntelligence: 'Artificial Intelligence',
    logistics: 'Logistics',
    edTech: 'EdTech',
    cybersecurity: 'Cybersecurity',
    // Activity Modal
    allActivity: 'All Activity',
    profileUpdated: 'Profile Updated',
    profileUpdatedTime: '2 DAYS AGO',
    profileUpdatedDesc: 'You successfully added AgriTech and Logistics to your Sector Interests.',
    newReportAvailable: 'New Report Available',
    newReportAvailableTime: '3 DAYS AGO',
    newReportAvailableDesc: 'Q1 Financial Summary for Petra Holdings Ltd. is now available in your Vault.',
  },
  ar: {
    // Header
    searchPlaceholder: 'ابحث عن الفرص...',
    marketplace: 'السوق',
    filter: 'تصفية',
    // Sections
    activeOpportunities: 'الفرص النشطة',
    viewAll: 'عرض الكل',
    featuredProject: 'المشروع المميز',
    // Badges
    ecoFriendly: 'صديق للبيئة',
    trending: 'رائج',
    // Card Actions
    invest: 'استثمر الآن',
    details: 'عرض التفاصيل',
    save: 'حفظ',
    // Capital Range
    capitalRange: 'نطاق رأس المال',
    // Empty State
    noListings: 'لا توجد قوائم.',
    // Greeting
    greeting: 'صباح الخير',
    tagline: 'استثمر في مستقبل الأردن',
    taglinePart1: 'استثمر في',
    taglinePart2: 'مستقبل الأردن',
    // Detail Screen
    back: 'رجوع',
    overview: 'نظرة عامة',
    financials: 'المالية',
    targetCapital: 'رأس المال المستهدف',
    raised: 'تم جمعه',
    funded: 'ممول',
    location: 'الموقع',
    status: 'الحالة',
    active: 'نشط',
    trendingInvestors: 'المستثمرون الرائجون',
    minInvestment: 'الحد الأدنى للاستثمار',
    maxInvestment: 'الحد الأقصى للاستثمار',
    aboutProject: 'عن هذا المشروع',
    ecoStatus: 'معتمد بيئياً',
    notEco: 'قياسي',
    investorCount: 'المستثمرون المهتمون',
    shareProject: 'مشاركة',
    currency: 'العملة',
    investorsWatching: 'مستثمرون يتابعون',
    // Filters Screen
    filterTitle: 'تحسين النتائج',
    resetFilters: 'إعادة ضبط',
    applyFilters: 'تطبيق الفلاتر',
    sectorFilter: 'القطاع',
    capitalFilter: 'نطاق رأس المال',
    ecoFilter: 'المشاريع الصديقة للبيئة فقط',
    ecoFilterDesc: 'عرض المشاريع المعتمدة بيئياً فقط',
    activeFilters: 'الفلاتر النشطة',
    noActiveFilters: 'لا توجد فلاتر مطبقة',
    // Investment Map Screen
    mapTitle: 'خريطة الاستثمار',
    mapSubtitle: 'مناطق الفرص في الأردن',
    mapSectorLegend: 'دليل القطاعات',
    mapAllZones: 'الكل',
    mapTopYield: 'العائد المتوقع',
    mapTotalCapital: 'رأس المال الكلي',
    mapListings: 'مشاريع',
    mapExploreZone: 'عرض المشاريع',
    mapFeaturedZone: 'المنطقة المميزة',
    mapNoZones: 'لا توجد مناطق لهذا القطاع.',
    mapRegionsLabel: 'مناطق الاستثمار',
    mapEsg: 'ESG',
    // Manage Screen
    entityDashboard: 'لوحة تحكم الكيان',
    createListing: 'إنشاء قائمة',
    engagementTracker: 'متتبع التفاعل',
    engagementDesc: 'الوصول الشهري وحجم الاستفسارات',
    engagementGrowth: '+14.3% مقارنة بالشهر الماضي',
    totalCapitalRaised: 'إجمالي رأس المال المجموع',
    portfolioValue: 'قيمة المحفظة',
    yourListings: 'قوائمك',
    viewAllListings: 'عرض كل القوائم',
    live: 'مباشر',
    pending: 'قيد الانتظار',
    edit: 'تعديل',
    underComplianceReview: 'قيد مراجعة الامتثال',
    newListingTitle: 'قائمة جديدة',
    newListingDesc: 'ابدأ كيان استثماري جديد',
    documentVault: 'خزنة المستندات',
    officialIncorporation: 'التأسيس الرسمي',
    legalClearance: 'التصريح القانوني',
    taxCompliance: 'الامتثال الضريبي',
    underReview: 'قيد المراجعة',
    // Profile Screen
    pro: 'احترافي',
    wealthManagement: 'إدارة الثروات\nمحفظة',
    investor: 'مستثمر',
    company: 'شركة',
    sectorInterests: 'اهتمامات القطاع',
    addInterest: 'إضافة اهتمام',
    greenEnergy: 'الطاقة الخضراء',
    realEstate: 'عقارات',
    medTech: 'تكنولوجيا طبية',
    finTech: 'تكنولوجيا مالية',
    agriTech: 'تكنولوجيا زراعية',
    institutionalSecurity: 'أمن مؤسسي',
    securityDesc: 'سجلك محمي ببروتوكولات تشفير سيادية متعددة العوامل.',
    manageCredentials: 'إدارة بيانات الاعتماد',
    notificationHub: 'مركز الإشعارات',
    newMatchAlert: 'تنبيه تطابق جديد',
    messageFrom: 'رسالة من أملاك الزمان',
    documentStatusUpdate: 'تحديث حالة المستند',
    loginDetected: 'تم اكتشاف تسجيل دخول',
    viewAllActivity: 'عرض كل النشاط',
    approved: 'تمت الموافقة.',
    timeAgo2M: 'منذ دقيقتين',
    timeAgo1H: 'منذ ساعة',
    timeAgo4H: 'منذ ٤ ساعات',
    yesterday: 'أمس',
    // Create Listing Modal
    assetDetails: 'تفاصيل الأصل',
    assetName: 'اسم الأصل',
    description: 'الوصف',
    targetCapitalJod: 'رأس المال المستهدف (دينار)',
    assetType: 'نوع الأصل',
    selectCategory: 'اختر الفئة',
    // Manage Credentials Modal
    securityAndCredentials: 'الأمان وبيانات الاعتماد',
    sovSecurityLevel: 'مستوى الأمان السيادي: عالي',
    encryptionDesc: 'استثماراتك محمية بالتشفير من طرف إلى طرف.',
    authMethods: 'طرق المصادقة',
    twoFactorAuth: 'المصادقة الثنائية',
    biometricLogin: 'تسجيل الدخول الحيوي (البيومتري)',
    changePassword: 'تغيير كلمة المرور',
    deviceManagement: 'إدارة الأجهزة',
    currentDevice: 'الجهاز الحالي',
    activeText: 'نشط',
    revokeText: 'إلغاء',
    // Add Interest Modal
    safeAddInterests: 'إضافة اهتمامات',
    searchSectors: 'البحث عن قطاعات...',
    artificialIntelligence: 'الذكاء الاصطناعي',
    logistics: 'لوجستيات',
    edTech: 'تكنولوجيا التعليم',
    cybersecurity: 'أمن سيبراني',
    // Activity Modal
    allActivity: 'كل النشاط',
    profileUpdated: 'تم تحديث الملف الشخصي',
    profileUpdatedTime: 'منذ يومين',
    profileUpdatedDesc: 'لقد قمت بإضافة التكنولوجيا الزراعية واللوجستيات بنجاح إلى اهتماماتك.',
    newReportAvailable: 'يتوفر تقرير جديد',
    newReportAvailableTime: 'منذ ٣ أيام',
    newReportAvailableDesc: 'ملخص مالي للربع الأول لشركة بترا القابضة متاح الآن في خزنتك.',
  },
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns the translator function `t` and RTL/language helpers.
 * Language state comes from LanguageContext — shared across all screens.
 */
export function useTranslation() {
  // Pull shared language state from the app-level LanguageContext
  const { lang, toggleLanguage } = useLanguageContext();

  const isRTL = lang === 'ar';

  /**
   * Translate a key into the current language.
   * Falls back to the key itself if not found.
   * @param {string} key
   * @returns {string}
   */
  const t = useCallback(
    (key) => translations[lang]?.[key] ?? key,
    [lang]
  );

  return { t, lang, isRTL, toggleLanguage };
}

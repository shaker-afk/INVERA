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

/**
 * sectors.js — Shared Sector Metadata
 *
 * Single source of truth for sector display data.
 * Consumed by: SectorChips (Dashboard), FiltersScreen, SectorBadge.
 *
 * Eliminates the duplicated SECTORS_AR arrays/objects that previously
 * existed independently in DiscoveryDashboard and FiltersScreen.
 */

/** All investable sector keys (English, used as filter values). */
export const SECTOR_KEYS = ['Energy', 'Tourism', 'Technology', 'Agriculture'];

/**
 * Full metadata per sector.
 * `color` / `bg` match the sector chip palette in FiltersScreen.
 * `labelEn` / `labelAr` provide bilingual display labels.
 */
export const SECTOR_META = {
  Energy: {
    labelEn: 'Energy',
    labelAr: 'طاقة',
    icon: 'flash-outline',
    color: '#664d00',
    bg: '#fff3cd',
  },
  Tourism: {
    labelEn: 'Tourism',
    labelAr: 'سياحة',
    icon: 'airplane-outline',
    color: '#155724',
    bg: '#d4edda',
  },
  Technology: {
    labelEn: 'Technology',
    labelAr: 'تكنولوجيا',
    icon: 'hardware-chip-outline',
    color: '#004085',
    bg: '#cce5ff',
  },
  Agriculture: {
    labelEn: 'Agriculture',
    labelAr: 'زراعة',
    icon: 'leaf-outline',
    color: '#0c5460',
    bg: '#d1ecf1',
  },
};

/**
 * Returns the display label for a sector key in the given language.
 * Falls back to the raw key if the sector is unknown.
 */
export function getSectorLabel(key, lang = 'en') {
  const meta = SECTOR_META[key];
  if (!meta) return key;
  return lang === 'ar' ? meta.labelAr : meta.labelEn;
}

/**
 * FiltersScreen.jsx — Screen (Modal)
 *
 * Presented as a bottom-sheet modal from the Discovery Dashboard.
 * Route: /filters  (Stack modal presentation)
 *
 * Writes filter state to FilterContext which the Dashboard reads.
 *
 * Design:
 *  - Drag handle + Deep Navy header
 *  - Sector multi-select chips (Energy / Tourism / Tech / Agriculture)
 *  - Capital range single-select buckets
 *  - Eco-Friendly boolean toggle (React Native Switch)
 *  - "Apply Filters" (Warm Sand) + "Reset" link
 *  - Active filter count badge on apply button
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Context
import {
  useFilters,
  ALL_SECTORS,
  CAPITAL_BUCKETS,
} from '../../src/contexts/FilterContext';

// Hooks
import { useTranslation } from '../../src/hooks/useTranslation';

// Theme
import { Colors, Spacing, Radius, Shadow } from '../../src/constants/theme';

// Shared sector metadata (icon, colours, bilingual labels)
import { SECTOR_META, getSectorLabel } from '../../src/constants/sectors';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionLabel({ label, isRTL }) {
  return (
    <Text style={[labelStyles.text, isRTL && labelStyles.rtl]}>{label}</Text>
  );
}
const labelStyles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  rtl: { textAlign: 'right' },
});

function SectorChip({ sector, active, lang, onToggle }) {
  const meta = SECTOR_META[sector];
  const label = getSectorLabel(sector, lang);

  return (
    <TouchableOpacity
      style={[
        chipStyles.chip,
        active && { backgroundColor: meta.bg, borderColor: meta.color + '55' },
        !active && chipStyles.chipInactive,
      ]}
      onPress={() => onToggle(sector)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: active }}
    >
      <Ionicons
        name={meta.icon}
        size={16}
        color={active ? meta.color : Colors.onSurfaceVariant}
      />
      <Text style={[chipStyles.label, active && { color: meta.color, fontWeight: '700' }]}>
        {label}
      </Text>
      {active && (
        <Ionicons name="checkmark-circle" size={14} color={meta.color} />
      )}
    </TouchableOpacity>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    marginBottom: Spacing.sm,
  },
  chipInactive: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderColor: Colors.outlineVariant,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
});

function CapitalBucketRow({ bucket, active, lang, onSelect }) {
  const label = lang === 'ar' ? bucket.labelAr : bucket.label;

  return (
    <TouchableOpacity
      style={[bucketStyles.row, active && bucketStyles.rowActive]}
      onPress={() => onSelect(bucket)}
      accessibilityRole="radio"
      accessibilityState={{ checked: active }}
    >
      <View style={[bucketStyles.radio, active && bucketStyles.radioActive]}>
        {active && <View style={bucketStyles.radioDot} />}
      </View>
      <Text style={[bucketStyles.label, active && bucketStyles.labelActive]}>
        {label}
      </Text>
      {active && bucket.value && (
        <View style={bucketStyles.badge}>
          <Text style={bucketStyles.badgeText}>Selected</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const bucketStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },
  rowActive: {
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadow.card,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.primaryContainer,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryContainer,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.onSurface,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSecondaryContainer,
  },
});

// ---------------------------------------------------------------------------
// Active Filters Summary
// ---------------------------------------------------------------------------
function ActiveFiltersSummary({ sectors, capitalBucket, ecoOnly, lang, t }) {
  const pills = [];

  if (sectors.length > 0) {
    const labels = sectors.map((s) => getSectorLabel(s, lang));
    pills.push(labels.join(', '));
  }

  if (capitalBucket) {
    pills.push(lang === 'ar' ? capitalBucket.labelAr : capitalBucket.label);
  }

  if (ecoOnly) {
    pills.push(lang === 'ar' ? 'صديق للبيئة' : 'Eco-Friendly');
  }

  if (pills.length === 0) {
    return (
      <View style={summaryStyles.empty}>
        <Ionicons name="funnel-outline" size={14} color={Colors.onSurfaceVariant} />
        <Text style={summaryStyles.emptyText}>{t('noActiveFilters')}</Text>
      </View>
    );
  }

  return (
    <View style={summaryStyles.container}>
      {pills.map((p, i) => (
        <View key={i} style={summaryStyles.pill}>
          <Text style={summaryStyles.pillText}>{p}</Text>
        </View>
      ))}
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  pill: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
  },
  pillText: { fontSize: 11, fontWeight: '600', color: Colors.onPrimary },
  empty: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  emptyText: { fontSize: 12, color: Colors.onSurfaceVariant },
});

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export default function FiltersScreen() {
  const { t, lang, isRTL } = useTranslation();
  const { filters, applyFilters, resetFilters } = useFilters();

  // Local draft state — only committed when user taps "Apply"
  const [draftSectors, setDraftSectors] = useState(filters.sectors);
  const [draftCapital, setDraftCapital] = useState(
    filters.capitalBucket
      ? CAPITAL_BUCKETS.find(
          (b) =>
            b.value?.min === filters.capitalBucket.min &&
            b.value?.max === filters.capitalBucket.max
        ) ?? CAPITAL_BUCKETS[0]
      : CAPITAL_BUCKETS[0]
  );
  const [draftEco, setDraftEco] = useState(filters.ecoOnly);

  // ── Sector toggle ────────────────────────────────────────────────────────
  const toggleSector = useCallback((sector) => {
    setDraftSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  }, []);

  // ── Capital bucket select — passed directly (no wrapper needed) ──────────
  // selectCapital is just setDraftCapital; no useCallback required here

  // ── Count active draft filters ───────────────────────────────────────────
  const activeCount =
    draftSectors.length +
    (draftCapital.value !== null ? 1 : 0) +
    (draftEco ? 1 : 0);

  // ── Apply ────────────────────────────────────────────────────────────────
  const handleApply = useCallback(() => {
    applyFilters({
      sectors: draftSectors,
      capitalBucket: draftCapital.value,
      ecoOnly: draftEco,
    });
    router.back();
  }, [applyFilters, draftSectors, draftCapital, draftEco]);

  // ── Reset ────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setDraftSectors([]);
    setDraftCapital(CAPITAL_BUCKETS[0]);
    setDraftEco(false);
    resetFilters();
  }, [resetFilters]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Drag Handle */}
      <View style={styles.dragHandle} />

      {/* Header */}
      <View style={[styles.header, isRTL && styles.rowRTL]}>
        <View>
          <Text style={styles.headerTitle}>{t('filterTitle')}</Text>
          {activeCount > 0 && (
            <Text style={styles.headerSub}>
              {activeCount} {activeCount === 1 ? 'filter' : 'filters'} selected
            </Text>
          )}
        </View>

        <View style={[styles.headerActions, isRTL && styles.rowRTL]}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            accessibilityRole="button"
          >
            <Text style={styles.resetLabel}>{t('resetFilters')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Filters Summary */}
        <View style={styles.section}>
          <SectionLabel label={t('activeFilters')} isRTL={isRTL} />
          <ActiveFiltersSummary
            sectors={draftSectors}
            capitalBucket={draftCapital.value ? draftCapital : null}
            ecoOnly={draftEco}
            lang={lang}
            t={t}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Sector Section */}
        <View style={styles.section}>
          <SectionLabel label={t('sectorFilter')} isRTL={isRTL} />
          {ALL_SECTORS.map((sector) => (
            <SectorChip
              key={sector}
              sector={sector}
              active={draftSectors.includes(sector)}
              lang={lang}
              onToggle={toggleSector}
            />
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Capital Range Section */}
        <View style={styles.section}>
          <SectionLabel label={t('capitalFilter')} isRTL={isRTL} />
          {CAPITAL_BUCKETS.map((bucket) => {
            const isActive = draftCapital.label === bucket.label;
            return (
              <CapitalBucketRow
                key={bucket.label}
                bucket={bucket}
                active={isActive}
                lang={lang}
                onSelect={setDraftCapital}
              />
            );
          })}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Eco-Friendly Toggle */}
        <View style={styles.section}>
          <SectionLabel label={t('ecoFilter')} isRTL={isRTL} />
          <View style={[styles.ecoRow, isRTL && styles.rowRTL]}>
            <View style={styles.ecoText}>
              <View style={[styles.ecoLabelRow, isRTL && styles.rowRTL]}>
                <Ionicons name="leaf" size={16} color={Colors.eco} />
                <Text style={styles.ecoTitle}>{t('ecoFilter')}</Text>
              </View>
              <Text style={[styles.ecoDesc, isRTL && styles.textRTL]}>
                {t('ecoFilterDesc')}
              </Text>
            </View>
            <Switch
              value={draftEco}
              onValueChange={setDraftEco}
              trackColor={{ false: Colors.outlineVariant, true: Colors.eco }}
              thumbColor={draftEco ? Colors.onPrimary : Colors.surfaceContainerLowest}
              ios_backgroundColor={Colors.outlineVariant}
            />
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* Apply Button */}
      <SafeAreaView style={styles.applyBar} edges={['bottom']}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          accessibilityRole="button"
          accessibilityLabel={t('applyFilters')}
        >
          <Text style={styles.applyLabel}>{t('applyFilters')}</Text>
          {activeCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{activeCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
  },

  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outlineVariant,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primaryContainer,
  },
  rowRTL: { flexDirection: 'row-reverse' },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.onPrimary,
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  resetButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  resetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll body
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md },

  section: { marginBottom: Spacing.lg },

  divider: {
    height: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    marginBottom: Spacing.lg,
  },

  // Eco row
  ecoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  ecoText: { flex: 1, gap: Spacing.xs },
  ecoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ecoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  ecoDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 17,
  },
  textRTL: { textAlign: 'right' },

  // Apply bar
  applyBar: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    ...Shadow.modal,
  },
  applyButton: {
    backgroundColor: Colors.warmSand,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  applyLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
});

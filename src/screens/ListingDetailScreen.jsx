/**
 * ListingDetailScreen.jsx — Screen
 *
 * Displays full details for a single investment listing.
 * Route: /listing/[id]  (Expo Router dynamic segment)
 *
 * Design:
 *  - Full-bleed hero image with glassmorphism back button floating above it
 *  - Gradient scrim for title readability
 *  - Two tab sections: Overview | Financials
 *  - Funding progress (animated width), key-stat grid
 *  - Sticky bottom action bar: "Invest Now" (Warm Sand) + "Save" (outline)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

// Services
import { fetchListingById } from '../../src/services/firebase/listingService';

// Atoms
import SectorBadge from '../../src/components/atoms/SectorBadge';
import CapitalBadge from '../../src/components/atoms/CapitalBadge';

// Hooks
import { useTranslation } from '../../src/hooks/useTranslation';

// Theme
import { Colors, Spacing, Radius, Shadow } from '../../src/constants/theme';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const HERO_HEIGHT = 320;

// ---------------------------------------------------------------------------
// Helper: format currency
// ---------------------------------------------------------------------------
function formatCurrency(amount, currency = 'JOD') {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace('.0', '')}M ${currency}`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}k ${currency}`;
  }
  return `${amount} ${currency}`;
}

// ---------------------------------------------------------------------------
// StatCard atom
// ---------------------------------------------------------------------------
function StatCard({ icon, label, value, highlight }) {
  return (
    <View style={[statStyles.card, highlight && statStyles.cardHighlight]}>
      <View style={[statStyles.iconWrap, highlight && statStyles.iconWrapHighlight]}>
        <Ionicons
          name={icon}
          size={18}
          color={highlight ? Colors.onPrimary : Colors.primaryContainer}
        />
      </View>
      <Text style={[statStyles.value, highlight && statStyles.valueHighlight]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadow.card,
  },
  cardHighlight: {
    backgroundColor: Colors.primaryContainer,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapHighlight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
    textAlign: 'center',
  },
  valueHighlight: {
    color: Colors.onPrimary,
  },
  label: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

// ---------------------------------------------------------------------------
// Tab Pill
// ---------------------------------------------------------------------------
function TabPill({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[tabStyles.tab, active && tabStyles.tabActive]}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
    >
      <Text style={[tabStyles.label, active && tabStyles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const tabStyles = StyleSheet.create({
  tab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: Colors.primaryContainer,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  labelActive: {
    color: Colors.onPrimary,
  },
});

// ---------------------------------------------------------------------------
// Overview Tab
// ---------------------------------------------------------------------------
function OverviewTab({ listing, t, isRTL, lang, progressAnim }) {
  const title = lang === 'ar' ? listing.titleAr : listing.titleEn;
  const description = lang === 'ar' ? listing.descriptionAr : listing.descriptionEn;
  const sectorLabel = lang === 'ar' ? listing.sectorAr : listing.sector;
  const pct = Math.min(Math.round((listing.raisedAmount / listing.targetCapitalization) * 100), 100);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${pct}%`],
  });

  return (
    <View style={overviewStyles.container}>
      {/* Badges */}
      <View style={[overviewStyles.row, isRTL && overviewStyles.rowRTL]}>
        <SectorBadge label={sectorLabel} sector={listing.sector} />
        <CapitalBadge min={listing.capitalMin} max={listing.capitalMax} currency={listing.currency} />
        {listing.isEcoFriendly && (
          <View style={overviewStyles.ecoPill}>
            <Ionicons name="leaf" size={11} color={Colors.eco} />
            <Text style={overviewStyles.ecoText}>{t('ecoStatus')}</Text>
          </View>
        )}
      </View>

      {/* Description */}
      <View style={overviewStyles.section}>
        <Text style={[overviewStyles.sectionTitle, isRTL && overviewStyles.textRTL]}>
          {t('aboutProject')}
        </Text>
        <Text style={[overviewStyles.description, isRTL && overviewStyles.textRTL]}>
          {description}
        </Text>
      </View>

      {/* Funding Progress */}
      <View style={overviewStyles.progressSection}>
        <View style={[overviewStyles.progressHeader, isRTL && overviewStyles.rowRTL]}>
          <Text style={overviewStyles.progressTitle}>{t('funded')}</Text>
          <Text style={overviewStyles.progressPct}>{pct}%</Text>
        </View>
        <View style={overviewStyles.progressTrack}>
          <Animated.View style={[overviewStyles.progressFill, { width: progressWidth }]} />
        </View>
        <View style={[overviewStyles.progressFooter, isRTL && overviewStyles.rowRTL]}>
          <Text style={overviewStyles.progressSub}>
            {formatCurrency(listing.raisedAmount, listing.currency)} {t('raised')}
          </Text>
          <Text style={overviewStyles.progressSub}>
            {t('targetCapital')}: {formatCurrency(listing.targetCapitalization, listing.currency)}
          </Text>
        </View>
      </View>

      {/* Stat Grid */}
      <View style={overviewStyles.statGrid}>
        <StatCard
          icon="location-outline"
          label={t('location')}
          value={listing.location}
        />
        <StatCard
          icon="trending-up-outline"
          label={t('trendingInvestors')}
          value={listing.trendingCount.toLocaleString()}
          highlight
        />
      </View>
      <View style={overviewStyles.statGrid}>
        <StatCard
          icon="checkmark-circle-outline"
          label={t('status')}
          value={t('active')}
        />
        <StatCard
          icon="leaf-outline"
          label="Eco"
          value={listing.isEcoFriendly ? t('ecoStatus') : t('notEco')}
        />
      </View>
    </View>
  );
}

const overviewStyles = StyleSheet.create({
  container: { padding: Spacing.md, gap: Spacing.lg },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  rowRTL: { flexDirection: 'row-reverse' },
  textRTL: { textAlign: 'right' },
  ecoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.ecoLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
  },
  ecoText: { fontSize: 10, fontWeight: '600', color: Colors.eco },

  section: { gap: Spacing.sm },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },

  progressSection: { gap: Spacing.sm },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: { fontSize: 13, fontWeight: '600', color: Colors.onSurface },
  progressPct: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryContainer,
    letterSpacing: -0.5,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.warmSand,
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressSub: { fontSize: 11, color: Colors.onSurfaceVariant, fontWeight: '500' },

  statGrid: { flexDirection: 'row', gap: Spacing.sm },
});

// ---------------------------------------------------------------------------
// Financials Tab
// ---------------------------------------------------------------------------
function FinancialsTab({ listing, t, isRTL }) {
  const rows = [
    { label: t('minInvestment'), value: formatCurrency(listing.capitalMin, listing.currency), icon: 'arrow-down-circle-outline' },
    { label: t('maxInvestment'), value: formatCurrency(listing.capitalMax, listing.currency), icon: 'arrow-up-circle-outline' },
    { label: t('targetCapital'), value: formatCurrency(listing.targetCapitalization, listing.currency), icon: 'flag-outline' },
    { label: t('raised'), value: formatCurrency(listing.raisedAmount, listing.currency), icon: 'wallet-outline' },
    { label: t('currency'),          value: listing.currency,                                        icon: 'cash-outline' },
    { label: t('investorsWatching'), value: listing.trendingCount.toLocaleString(),                   icon: 'eye-outline' },
  ];

  return (
    <View style={finStyles.container}>
      {/* Disclaimer card */}
      <View style={finStyles.disclaimer}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.primaryContainer} />
        <Text style={finStyles.disclaimerText}>
          All figures are indicative. Final terms are subject to regulatory approval and due diligence.
        </Text>
      </View>

      {rows.map((row, i) => (
        <View
          key={row.label}
          style={[
            finStyles.row,
            isRTL && finStyles.rowRTL,
            i % 2 === 0 && finStyles.rowAlt,
          ]}
        >
          <View style={[finStyles.labelGroup, isRTL && finStyles.rowRTL]}>
            <Ionicons name={row.icon} size={16} color={Colors.onSurfaceVariant} />
            <Text style={finStyles.label}>{row.label}</Text>
          </View>
          <Text style={finStyles.value}>{row.value}</Text>
        </View>
      ))}

      {/* Sovereign Ledger quality mark */}
      <View style={finStyles.sealRow}>
        <Text style={finStyles.sealStar}>✦</Text>
        <Text style={finStyles.sealText}>Sovereign Ledger Verified Listing</Text>
      </View>
    </View>
  );
}

const finStyles = StyleSheet.create({
  container: { padding: Spacing.md, gap: Spacing.sm },
  disclaimer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
  },
  rowRTL: { flexDirection: 'row-reverse' },
  rowAlt: { backgroundColor: Colors.surfaceContainerLowest },
  labelGroup: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  label: { fontSize: 13, color: Colors.onSurfaceVariant, fontWeight: '500' },
  value: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  sealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
  },
  sealStar: { fontSize: 14, color: Colors.warmSand },
  sealText: { fontSize: 11, color: Colors.onSurfaceVariant, fontWeight: '500' },
});

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t, lang, isRTL } = useTranslation();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Animated progress bar value
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ── Fetch listing ────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchListingById(id);
        setListing(data);
      } catch (e) {
        setFetchError(e.message ?? 'Failed to load listing.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── Animate progress bar once data loads ────────────────────────────────
  useEffect(() => {
    if (listing) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [listing, progressAnim]);

  // ── Share ────────────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!listing) return;
    await Share.share({ message: `Check out this investment: ${listing.titleEn}` });
  }, [listing]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={Colors.primaryContainer} />
      </View>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={{ color: Colors.onSurface }}>
          {fetchError ?? 'Listing not found.'}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.primaryContainer, marginTop: 12 }}>{t('back')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const title = lang === 'ar' ? listing.titleAr : listing.titleEn;

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* ── Hero Image ── */}
        <View style={styles.heroContainer}>
          <Image
            source={listing.imageSource ?? { uri: listing.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Gradient scrim */}
          <LinearGradient
            colors={['transparent', 'rgba(0,10,30,0.90)']}
            style={styles.heroGradient}
          />

          {/* Back + Share buttons */}
          <SafeAreaView style={styles.heroControls} edges={['top']}>
            <TouchableOpacity
              style={styles.glassButton}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel={t('back')}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.onPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.glassButton}
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel={t('shareProject')}
            >
              <Ionicons name="share-outline" size={20} color={Colors.onPrimary} />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Title overlay */}
          <View style={[styles.heroTitle, isRTL && styles.heroTitleRTL]}>
            <Text style={[styles.titleText, isRTL && styles.textRTL]} numberOfLines={3}>
              {title}
            </Text>
          </View>
        </View>

        {/* ── Tab Bar ── */}
        <View style={styles.tabBar}>
          <TabPill
            label={t('overview')}
            active={activeTab === 'overview'}
            onPress={() => setActiveTab('overview')}
          />
          <TabPill
            label={t('financials')}
            active={activeTab === 'financials'}
            onPress={() => setActiveTab('financials')}
          />
        </View>

        {/* ── Tab Content ── */}
        {activeTab === 'overview' ? (
          <OverviewTab
            listing={listing}
            t={t}
            isRTL={isRTL}
            lang={lang}
            progressAnim={progressAnim}
          />
        ) : (
          <FinancialsTab listing={listing} t={t} isRTL={isRTL} />
        )}

        {/* Bottom spacer for sticky bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky Action Bar ── */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.saveButton}
          accessibilityRole="button"
          accessibilityLabel={t('save')}
        >
          <Ionicons name="bookmark-outline" size={20} color={Colors.primaryContainer} />
          <Text style={styles.saveLabel}>{t('save')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.investButton}
          accessibilityRole="button"
          accessibilityLabel={t('invest')}
        >
          <Text style={styles.investLabel}>{t('invest')}</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },

  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // Hero
  heroContainer: {
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,10,30,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.md,
    right: Spacing.md,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onPrimary,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  textRTL: { textAlign: 'right' },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLowest,
    marginHorizontal: Spacing.md,
    marginTop: -1,
    borderRadius: Radius.xl,
    padding: Spacing.xs,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },

  // Action bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg + Spacing.sm,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    gap: Spacing.sm,
    ...Shadow.modal,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  saveLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryContainer,
  },
  investButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.warmSand,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.sm + 4,
  },
  investLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.2,
  },
});

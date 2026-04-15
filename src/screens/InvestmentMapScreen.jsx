/**
 * InvestmentMapScreen.jsx — Screen
 *
 * Investment Map (Tab 2) — Sovereign Ledger interactive map of Jordan.
 *
 * Architecture:
 *  - Data:    mapService.js (GPS coordinates + zone metadata, Firebase-ready)
 *  - Map:     Leaflet.js (CartoDB Dark tiles) running inside react-native-webview
 *  - Pins:    Leaflet divIcon — sector-color-coded, show yield % + zone name
 *  - Filter:  Sector chips → injectJavaScript → filterBySector() in Leaflet
 *  - Tap:     Pin tap → postMessage({ type:'ZONE_SELECTED', id }) → native bottom sheet
 *  - Dismiss: Bottom sheet close → deselectPin() in Leaflet
 *  - Language: Rebuilds mapHtml when lang changes (pin labels update)
 *  - RTL:     Header + bottom sheet flip; map tiles are direction-agnostic
 *
 * Navigation: "Explore Zone" CTA → router.push('/listing/[id]')
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Services
import { fetchMapZones } from '../services/firebase/mapService';

// Hooks
import { useTranslation } from '../hooks/useTranslation';

// Theme
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { SECTOR_KEYS, SECTOR_META, getSectorLabel } from '../constants/sectors';

const ALL_SECTORS = ['All', ...SECTOR_KEYS];
const SHEET_HEIGHT = 310;

// ---------------------------------------------------------------------------
// Pin color palette — plain CSS hex values for Leaflet divIcon HTML
// These intentionally differ from RN Colors to work inside the WebView
// ---------------------------------------------------------------------------
const PIN_COLORS = {
  Energy:      { bg: '#1a1200', border: '#c9a227', yield: '#f5c542' },
  Tourism:     { bg: '#071a10', border: '#1c7a38', yield: '#52c76e' },
  Technology:  { bg: '#000d26', border: '#0055b8', yield: '#66b2ff' },
  Agriculture: { bg: '#011518', border: '#0d7a8a', yield: '#5bc0de' },
  default:     { bg: '#001430', border: '#C2B280', yield: '#C2B280' },
};

// ---------------------------------------------------------------------------
// HTML Builder — generates the full Leaflet HTML page injected into WebView
// Zones are embedded as JSON at build time; lang controls pin label language.
// Rebuilds when zones or lang changes (useMemo in parent).
// ---------------------------------------------------------------------------
function buildMapHTML(zones, lang) {
  const zonesJson = JSON.stringify(
    zones.map((z) => ({
      id: z.id,
      nameEn: z.nameEn,
      nameAr: z.nameAr,
      lat: z.lat,
      lng: z.lng,
      sector: z.sector,
      isFeatured: z.isFeatured,
      isEcoFriendly: z.isEcoFriendly,
      yieldPct: z.listings?.[0]?.targetYieldPct ?? null,
    }))
  );
  const pinColorsJson = JSON.stringify(PIN_COLORS);

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=3,user-scalable=yes"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#000a1e;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
#map{width:100vw;height:100vh;}
.leaflet-control-attribution,.leaflet-control-zoom{display:none!important;}

/* ── Pin outer wrapper ── */
.sl-pin{display:flex;flex-direction:column;align-items:center;cursor:pointer;position:relative;}

/* ── Bubble (the label box) ── */
.sl-bubble{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:6px 11px;border-radius:12px;min-width:66px;
  border-width:1.5px;border-style:solid;
  box-shadow:0 4px 24px rgba(0,10,30,.55);
  transition:transform .12s ease,box-shadow .12s ease;
}
.sl-bubble.selected{
  box-shadow:0 0 0 3px #C2B280,0 6px 28px rgba(194,178,128,.35)!important;
  transform:scale(1.06);
}

/* ── Yield number ── */
.sl-yield{
  font-size:15px;font-weight:800;color:#C2B280;
  letter-spacing:-.4px;line-height:1.15;
}

/* ── Zone short name ── */
.sl-name{
  font-size:9px;font-weight:600;color:rgba(255,255,255,.65);
  letter-spacing:.25px;margin-top:2px;text-align:center;
  max-width:74px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}

/* ── Pointing tip ── */
.sl-tip{
  width:0;height:0;
  border-left:7px solid transparent;border-right:7px solid transparent;
  border-top-width:9px;border-top-style:solid;margin-top:-1px;
}

/* ── ECO dot ── */
.sl-eco{
  position:absolute;top:-7px;right:-7px;
  width:17px;height:17px;border-radius:50%;
  background:#1d6b45;border:2px solid #fff;
  display:flex;align-items:center;justify-content:center;
  font-size:9px;line-height:1;
}

/* ── Tile CSS filter: subtle warm/sandy tone to match Sovereign Ledger palette ── */
.leaflet-tile{
  filter:sepia(12%) saturate(88%) brightness(97%);
}

/* ── Fade-in tiles smoothly ── */
.leaflet-tile-loaded{
  transition:opacity .25s ease;
}

/* ── Featured pulse ring ── */
.sl-pulse{
  position:absolute;
  width:calc(100% + 16px);height:calc(100% + 10px);
  top:-5px;left:-8px;
  border-radius:14px;
  animation:pulse 2.4s ease-out infinite;
  pointer-events:none;
}
@keyframes pulse{
  0%{transform:scale(1);opacity:.5;}
  70%{transform:scale(1.6);opacity:0;}
  100%{transform:scale(1);opacity:0;}
}
</style>
</head>
<body>
<div id="map"></div>
<script>
(function(){
  var ZONES     = ${zonesJson};
  var COLORS    = ${pinColorsJson};
  var lang      = '${lang}';
  var markers   = {};
  var selectedId = null;

  /* ── Bounds: Jordan + Syria, Iraq, Saudi, Egypt, Israel/Palestine ── */
  var REGION_BOUNDS = L.latLngBounds(
    L.latLng(25.0, 31.0),   // SW — northern Egypt / northern Red Sea
    L.latLng(37.5, 42.5)    // NE — southern Turkey / western Iraq
  );

  /* ── Map ── */
  var map = L.map('map',{
    center:[30.8, 36.3],
    zoom:6.5,
    minZoom:6,
    maxZoom:14,
    zoomControl:false,
    attributionControl:false,
    maxBounds: REGION_BOUNDS,
    maxBoundsViscosity: 0.9
  });

  /* CartoDB Voyager — warm, clean, professional; complements Warm Sand palette */
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    {subdomains:'abcd', maxZoom:18}
  ).addTo(map);

  /* ── Build divIcon for a zone ── */
  function buildIcon(zone, selected){
    var c   = COLORS[zone.sector] || COLORS['default'];
    var name= lang === 'ar' ? zone.nameAr : zone.nameEn;
    var yStr= zone.yieldPct != null ? zone.yieldPct.toFixed(1)+'%' : '';
    var eco = zone.isEcoFriendly
      ? '<div class="sl-eco">&#127807;</div>' : '';
    var pulse = zone.isFeatured
      ? '<div class="sl-pulse" style="border:1.5px solid '+c.border+'55;"></div>' : '';
    var selCls = selected ? ' selected' : '';

    var html =
      '<div class="sl-pin">' +
        pulse +
        '<div class="sl-bubble'+selCls+'" style="background:'+c.bg+';border-color:'+c.border+';">' +
          eco +
          (yStr ? '<span class="sl-yield">'+yStr+'</span>' : '') +
          '<span class="sl-name">'+name+'</span>' +
        '</div>' +
        '<div class="sl-tip" style="border-top-color:'+c.bg+';"></div>' +
      '</div>';

    return L.divIcon({
      html:html,
      className:'',
      iconSize:[92,62],
      iconAnchor:[46,62]
    });
  }

  /* ── Add markers for a list of zones ── */
  function addMarkers(zoneList){
    zoneList.forEach(function(zone){
      if(zone.lat == null || zone.lng == null) return;
      var m = L.marker([zone.lat, zone.lng], {
        icon: buildIcon(zone, false),
        zIndexOffset: zone.isFeatured ? 1000 : 0
      }).addTo(map);

      m.on('click', function(){
        /* Deselect previous */
        if(selectedId && markers[selectedId]){
          var prev = ZONES.find(function(z){ return z.id === selectedId; });
          if(prev) markers[selectedId].setIcon(buildIcon(prev, false));
        }
        /* Select this */
        selectedId = zone.id;
        m.setIcon(buildIcon(zone, true));
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type:'ZONE_SELECTED', id:zone.id })
        );
      });
      markers[zone.id] = m;
    });
  }

  addMarkers(ZONES);

  /* ── filterBySector — called via injectJavaScript from RN ── */
  window.filterBySector = function(sector){
    Object.keys(markers).forEach(function(id){ map.removeLayer(markers[id]); });
    markers = {};
    selectedId = null;
    var list = sector === 'All'
      ? ZONES
      : ZONES.filter(function(z){ return z.sector === sector; });
    addMarkers(list);
  };

  /* ── deselectPin — called when bottom sheet is dismissed ── */
  window.deselectPin = function(){
    if(selectedId && markers[selectedId]){
      var z = ZONES.find(function(z){ return z.id === selectedId; });
      if(z) markers[selectedId].setIcon(buildIcon(z, false));
    }
    selectedId = null;
  };

  /* Signal ready */
  window.ReactNativeWebView.postMessage(JSON.stringify({ type:'MAP_READY' }));
})();
</script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Map Header — native Deep Navy gradient bar
// ---------------------------------------------------------------------------
function MapHeader({ t, lang, isRTL, onToggleLanguage }) {
  return (
    <LinearGradient
      colors={['#000a1e', '#002147']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <SafeAreaView edges={['top']} style={styles.headerInner}>
        <View style={[styles.headerRow, isRTL && styles.rowRTL]}>
          <View>
            <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>
              {t('mapTitle')}
            </Text>
            <View style={[styles.headerSubRow, isRTL && styles.rowRTL]}>
              <View style={styles.subtitleDot} />
              <Text style={styles.headerSubtitle}>{t('mapSubtitle')}</Text>
            </View>
          </View>

          {/* Language toggle */}
          <TouchableOpacity
            style={styles.langToggle}
            onPress={onToggleLanguage}
            accessibilityRole="button"
            accessibilityLabel="Toggle language"
          >
            <Text style={styles.langToggleText}>
              {lang === 'ar' ? 'EN' : 'عر'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ---------------------------------------------------------------------------
// Sector Legend — horizontal scrollable filter chips
// ---------------------------------------------------------------------------
function SectorLegend({ activeSector, onSelect, t, lang, isRTL }) {
  return (
    <View style={styles.legendBar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.legendScroll,
          isRTL && styles.legendScrollRTL,
        ]}
      >
        {ALL_SECTORS.map((key) => {
          const isActive = activeSector === key;
          const meta = SECTOR_META[key];
          const label =
            key === 'All' ? t('mapAllZones') : getSectorLabel(key, lang);

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.legendChip,
                isActive && {
                  backgroundColor: meta ? meta.bg : Colors.surfaceContainerHigh,
                  borderColor: meta ? meta.color + '88' : Colors.warmSand,
                },
                !isActive && styles.legendChipInactive,
              ]}
              onPress={() => onSelect(key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Ionicons
                name={
                  key === 'All' ? 'map-outline' : meta?.icon ?? 'ellipse-outline'
                }
                size={12}
                color={
                  isActive
                    ? meta?.color ?? Colors.primaryContainer
                    : Colors.onSurfaceVariant
                }
              />
              <Text
                style={[
                  styles.legendChipText,
                  isActive && {
                    color: meta?.color ?? Colors.primaryContainer,
                    fontWeight: '700',
                  },
                  key === 'All' && isActive && {
                    color: Colors.primaryContainer,
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Zone Bottom Sheet — slides up from bottom when a map pin is tapped
// ---------------------------------------------------------------------------
function ZoneBottomSheet({ zone, lang, isRTL, t, sheetAnim, onDismiss, onExplore }) {
  if (!zone) return null;

  const meta = SECTOR_META[zone.sector] ?? {};
  const name = lang === 'ar' ? zone.nameAr : zone.nameEn;
  const region = lang === 'ar' ? zone.regionAr : zone.regionEn;
  const description = lang === 'ar' ? zone.descriptionAr : zone.description;
  const topListing = zone.listings?.[0];
  const totalCapFormatted =
    (zone.totalCapital / 1_000_000).toFixed(1) + 'M ' + zone.currency;

  return (
    <Animated.View
      style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}
    >
      {/* Drag handle */}
      <View style={styles.sheetHandle} />

      {/* Header row: zone name + close */}
      <View style={[styles.sheetHeaderRow, isRTL && styles.rowRTL]}>
        <View style={styles.sheetNameBlock}>
          {/* Region */}
          <View style={[styles.regionRow, isRTL && styles.rowRTL]}>
            <Ionicons
              name="location-outline"
              size={12}
              color={Colors.onSurfaceVariant}
            />
            <Text style={styles.regionText}>{region}</Text>
          </View>

          {/* Zone name */}
          <Text
            style={[styles.sheetTitle, isRTL && styles.textRTL]}
            numberOfLines={1}
          >
            {name}
          </Text>

          {/* Sector badge */}
          {meta.bg && (
            <View
              style={[
                styles.sectorBadge,
                { backgroundColor: meta.bg },
                isRTL && styles.selfEnd,
              ]}
            >
              <Ionicons name={meta.icon} size={11} color={meta.color} />
              <Text style={[styles.sectorBadgeText, { color: meta.color }]}>
                {getSectorLabel(zone.sector, lang)}
              </Text>
            </View>
          )}
        </View>

        {/* Close */}
        <TouchableOpacity
          style={styles.sheetClose}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={18} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={[styles.statsRow, isRTL && styles.rowRTL]}>
        {topListing?.targetYieldPct != null && (
          <View style={styles.statPill}>
            <Text style={styles.statValue}>
              {topListing.targetYieldPct.toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>{t('mapTopYield')}</Text>
          </View>
        )}
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{totalCapFormatted}</Text>
          <Text style={styles.statLabel}>{t('mapTotalCapital')}</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{zone.listingCount}</Text>
          <Text style={styles.statLabel}>{t('mapListings')}</Text>
        </View>
        {zone.isEcoFriendly && (
          <View style={[styles.ecoPill, isRTL && styles.rowRTL]}>
            <Ionicons name="leaf" size={13} color={Colors.eco} />
            <Text style={styles.ecoText}>{t('mapEsg')}</Text>
          </View>
        )}
      </View>

      {/* Description */}
      <Text
        style={[styles.sheetDesc, isRTL && styles.textRTL]}
        numberOfLines={2}
      >
        {description}
      </Text>

      {/* Explore CTA */}
      <TouchableOpacity
        style={[styles.ctaButton, isRTL && styles.ctaButtonRTL]}
        onPress={() => onExplore(zone)}
        accessibilityRole="button"
      >
        <Text style={styles.ctaText}>{t('mapExploreZone')}</Text>
        <Ionicons
          name={isRTL ? 'arrow-back' : 'arrow-forward'}
          size={15}
          color={Colors.primary}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export default function InvestmentMapScreen() {
  const { t, lang, isRTL, toggleLanguage } = useTranslation();

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [activeSector, setActiveSector] = useState('All');
  const [selectedZone, setSelectedZone] = useState(null);

  const webViewRef = useRef(null);
  const sheetAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  // ── Build Leaflet HTML (memos so it only rebuilds when zones/lang change) ──
  const mapHtml = useMemo(
    () => buildMapHTML(zones, lang),
    [zones, lang] // lang change → new HTML → pin labels update
  );

  // ── Data fetch ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchMapZones()
      .then((data) => setZones(data))
      .finally(() => setLoading(false));
  }, []);

  // ── Bottom sheet helpers ───────────────────────────────────────────────────
  const showSheet = useCallback(() => {
    Animated.spring(sheetAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 75,
      friction: 11,
    }).start();
  }, [sheetAnim]);

  const hideSheet = useCallback(
    (deselect = true) => {
      if (deselect) {
        webViewRef.current?.injectJavaScript('deselectPin(); true;');
      }
      Animated.timing(sheetAnim, {
        toValue: SHEET_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        if (deselect) setSelectedZone(null);
      });
    },
    [sheetAnim]
  );

  // ── WebView → RN message handler ──────────────────────────────────────────
  const handleMessage = useCallback(
    (event) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);
        if (msg.type === 'MAP_READY') {
          setMapReady(true);
        } else if (msg.type === 'ZONE_SELECTED') {
          const zone = zones.find((z) => z.id === msg.id);
          if (zone) {
            setSelectedZone(zone);
            showSheet();
          }
        }
      } catch (_) {
        // ignore malformed messages
      }
    },
    [zones, showSheet]
  );

  // ── Sector filter chip → injectJavaScript (no full map reload) ────────────
  const handleSectorSelect = useCallback(
    (sector) => {
      setActiveSector(sector);
      hideSheet(true);
      webViewRef.current?.injectJavaScript(
        `filterBySector('${sector}'); true;`
      );
    },
    [hideSheet]
  );

  // ── Navigate to listing detail ─────────────────────────────────────────────
  const handleExplore = useCallback((zone) => {
    const first = zone.listings?.[0];
    if (first) router.push(`/listing/${first.id}`);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Native header */}
      <MapHeader
        t={t}
        lang={lang}
        isRTL={isRTL}
        onToggleLanguage={toggleLanguage}
      />

      {/* Sector legend */}
      <SectorLegend
        activeSector={activeSector}
        onSelect={handleSectorSelect}
        t={t}
        lang={lang}
        isRTL={isRTL}
      />

      {/* Map + overlays */}
      <View style={styles.mapContainer}>
        {/* Initial data loading state */}
        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.warmSand} />
            <Text style={styles.loadingText}>{t('mapSubtitle')}</Text>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ html: mapHtml }}
            style={styles.webView}
            onMessage={handleMessage}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            originWhitelist={['*']}
            mixedContentMode="always"
            startInLoadingState={false}
          />
        )}

        {/* Tile loading spinner (shown after data ready but before map tiles paint) */}
        {!loading && !mapReady && (
          <View style={styles.tileLoadingBadge} pointerEvents="none">
            <ActivityIndicator size="small" color={Colors.warmSand} />
          </View>
        )}

        {/* Bottom sheet — slides up when a pin is tapped */}
        <ZoneBottomSheet
          zone={selectedZone}
          lang={lang}
          isRTL={isRTL}
          t={t}
          sheetAnim={sheetAnim}
          onDismiss={() => hideSheet(true)}
          onExplore={handleExplore}
        />
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
    backgroundColor: Colors.primary,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {},
  headerInner: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  rowRTL: { flexDirection: 'row-reverse' },
  textRTL: { textAlign: 'right' },
  selfEnd:  { alignSelf: 'flex-end' },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.onPrimary,
    letterSpacing: -0.5,
  },
  headerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  subtitleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.warmSand,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },
  langToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  langToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.warmSand,
    letterSpacing: 0.5,
  },

  // ── Sector Legend ──────────────────────────────────────────────────────────
  legendBar: {
    backgroundColor: Colors.surfaceContainerLowest,
    paddingVertical: Spacing.sm,
  },
  legendScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  legendScrollRTL: { flexDirection: 'row-reverse' },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
  },
  legendChipInactive: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderColor: 'transparent',
  },
  legendChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },

  // ── Map Container ──────────────────────────────────────────────────────────
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000a1e',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000a1e',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
  },
  tileLoadingBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0,10,30,0.75)',
    borderRadius: 20,
    padding: 8,
  },

  // ── Bottom Sheet ───────────────────────────────────────────────────────────
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    ...Shadow.modal,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outlineVariant,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sheetNameBlock: { flex: 1 },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 3,
  },
  regionText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: -0.4,
    marginBottom: Spacing.xs,
  },
  sectorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  sectorBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sheetClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  statPill: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryContainer,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  ecoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.ecoLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  ecoText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.eco,
  },

  // Description
  sheetDesc: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 19,
    marginBottom: Spacing.md,
  },

  // CTA
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.warmSand,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
  },
  ctaButtonRTL: { flexDirection: 'row-reverse' },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.2,
  },
});

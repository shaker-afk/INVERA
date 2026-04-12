/**
 * CustomTabBar.jsx — Organism
 *
 * A premium custom bottom navigation bar for Invera.
 *
 * Design language (from the screenshot):
 *  - White background with a soft top shadow
 *  - Active tab: filled Deep Navy circle wrapping the icon (white icon inside)
 *    + bold Deep Navy label underneath
 *  - Inactive tabs: gray outline icon + uppercase gray label
 *  - 4 tabs: DISCOVERY · MAP · MANAGE · PROFILE
 *  - Labels are uppercase, tight tracking
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing, Radius, Shadow } from '../../constants/theme';

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------
const TABS = [
  {
    name: 'index',
    labelEn: 'DISCOVERY',
    labelAr: 'استكشاف',
    iconActive: 'compass',
    iconInactive: 'compass-outline',
  },
  {
    name: 'map',
    labelEn: 'MAP',
    labelAr: 'خريطة',
    iconActive: 'map',
    iconInactive: 'map-outline',
  },
  {
    name: 'manage',
    labelEn: 'MANAGE',
    labelAr: 'إدارة',
    iconActive: 'briefcase',
    iconInactive: 'briefcase-outline',
  },
  {
    name: 'profile',
    labelEn: 'PROFILE',
    labelAr: 'ملفي',
    iconActive: 'person',
    iconInactive: 'person-outline',
  },
];

// ---------------------------------------------------------------------------
// Single Tab Button
// ---------------------------------------------------------------------------
function TabButton({ tab, isFocused, onPress, onLongPress, lang }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const label = lang === 'ar' ? tab.labelAr : tab.labelEn;

  // Micro-bounce on focus change
  useEffect(() => {
    if (isFocused) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.88,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 10,
          stiffness: 200,
        }),
      ]).start();
    }
  }, [isFocused, scaleAnim]);

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.75}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
    >
      {/* Icon container */}
      <Animated.View
        style={[
          styles.iconWrap,
          isFocused && styles.iconWrapActive,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Ionicons
          name={isFocused ? tab.iconActive : tab.iconInactive}
          size={22}
          color={isFocused ? Colors.onPrimary : Colors.onSurfaceVariant}
        />
      </Animated.View>

      {/* Label */}
      <Text
        style={[
          styles.label,
          isFocused && styles.labelActive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

/**
 * @param {object} props  — Injected by Expo Router's Tabs `tabBar` prop
 * @param {object} props.state
 * @param {object} props.descriptors
 * @param {object} props.navigation
 * @param {string} [props.lang]   — Current language from LanguageContext
 */
export default function CustomTabBar({ state, descriptors, navigation, lang = 'en' }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, Spacing.md) },
      ]}
    >
      {/* Separator line */}
      <View style={styles.separator} />

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null; // hide unlisted routes

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <TabButton
              key={route.key}
              tab={tab}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              lang={lang}
            />
          );
        })}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadow.modal,
    // Override the shadow to come from the top
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 16,
    shadowOpacity: 0.06,
    elevation: 10,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  row: {
    flexDirection: 'row',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },

  // Tab button
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs - 1,
    paddingVertical: Spacing.xs,
  },

  // Icon circle
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryContainer, // Deep Navy #002147
  },

  // Label
  label: {
    fontSize: 9.5,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: Colors.primaryContainer,
    fontWeight: '700',
  },
});

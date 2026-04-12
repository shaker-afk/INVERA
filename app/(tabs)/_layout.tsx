/**
 * app/(tabs)/_layout.tsx
 *
 * Configures the bottom tab navigator with the custom Invera tab bar.
 * Screens: Discovery (index) · Map · Manage · Profile
 */
import React, { useCallback } from 'react';
import { Tabs } from 'expo-router';

import CustomTabBar from '../../src/components/organisms/CustomTabBar';
import { useTranslation } from '../../src/hooks/useTranslation';

export default function TabLayout() {
  const { lang } = useTranslation();

  /**
   * Render the custom bottom bar.
   * Props (state, descriptors, navigation) are injected by React Navigation.
   */
  const renderTabBar = useCallback(
    (props: any) => <CustomTabBar {...props} lang={lang} />,
    [lang],
  );

  return (
    <Tabs
      tabBar={renderTabBar}
      screenOptions={{ headerShown: false }}
    >
      {/* 1 — Discovery Dashboard */}
      <Tabs.Screen
        name="index"
        options={{ title: 'Discovery' }}
      />

      {/* 2 — Investment Map */}
      <Tabs.Screen
        name="map"
        options={{ title: 'Map' }}
      />

      {/* 3 — Portfolio Manager */}
      <Tabs.Screen
        name="manage"
        options={{ title: 'Manage' }}
      />

      {/* 4 — User Profile */}
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />

      {/* Hide the legacy explore tab — keep file to avoid bundle errors */}
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
    </Tabs>
  );
}

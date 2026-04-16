import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../atoms/LanguageToggle';

const Colors = {
  navy: '#051930',
  white: '#FFFFFF',
};

export default function CommonHeader({ title = 'Sovereign Ledger', isDark = false, style }) {
  const { lang, isRTL, toggleLanguage } = useTranslation();
  const textColor = isDark ? Colors.white : Colors.navy;

  return (
    <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }, style]}>
      <View style={[styles.headerLeft, isRTL && { flexDirection: 'row-reverse' }]}>
        <Ionicons name="star" size={16} color={textColor} style={{marginTop: -2}} />
        <Text style={[styles.headerBrand, { color: textColor }]}>{title}</Text>
      </View>
      <View style={[styles.headerRight, isRTL && { flexDirection: 'row-reverse' }]}>
        <LanguageToggle lang={lang} onToggle={toggleLanguage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBrand: {
    fontSize: 14,
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});

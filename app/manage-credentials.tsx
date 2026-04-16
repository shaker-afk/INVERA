import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '../src/hooks/useTranslation';

const Colors = {
  background: '#FAFAFC',
  navy: '#051930',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
  gold: '#A0814C',
};

export default function ManageCredentialsModal() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name="x" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('securityAndCredentials')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={32} color={Colors.gold} style={styles.iconCenter} />
          <Text style={[styles.infoTitle, isRTL && { textAlign: 'right' }]}>{t('sovSecurityLevel')}</Text>
          <Text style={[styles.infoDesc, isRTL && { textAlign: 'right' }]}>
            {t('encryptionDesc')}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t('authMethods')}</Text>
        
        <View style={[styles.settingRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.settingRowLeft, isRTL && { flexDirection: 'row-reverse' }]}>
            <Feather name="smartphone" size={20} color={Colors.navy} />
            <Text style={styles.settingText}>{t('twoFactorAuth')}</Text>
          </View>
          <Switch value={true} trackColor={{ true: Colors.gold, false: Colors.border }} />
        </View>

        <View style={[styles.settingRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.settingRowLeft, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="finger-print" size={20} color={Colors.navy} />
            <Text style={styles.settingText}>{t('biometricLogin')}</Text>
          </View>
          <Switch value={true} trackColor={{ true: Colors.gold, false: Colors.border }} />
        </View>

        <View style={[styles.settingRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.settingRowLeft, isRTL && { flexDirection: 'row-reverse' }]}>
            <Feather name="key" size={20} color={Colors.navy} />
            <Text style={styles.settingText}>{t('changePassword')}</Text>
          </View>
          <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={20} color={Colors.textMuted} />
        </View>

        <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t('deviceManagement')}</Text>
        <View style={[styles.settingRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.settingRowLeft, isRTL && { flexDirection: 'row-reverse' }]}>
            <Feather name="monitor" size={20} color={Colors.navy} />
            <View>
              <Text style={[styles.settingText, isRTL && { textAlign: 'right' }]}>{t('currentDevice')}</Text>
              <Text style={[styles.settingSub, isRTL && { textAlign: 'right' }]}>iPhone 14 Pro — Amman, JO</Text>
            </View>
          </View>
          <Text style={styles.activeText}>{t('activeText')}</Text>
        </View>
        <View style={[styles.settingRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.settingRowLeft, isRTL && { flexDirection: 'row-reverse' }]}>
            <Feather name="globe" size={20} color={Colors.navy} />
            <View>
              <Text style={[styles.settingText, isRTL && { textAlign: 'right' }]}>Safari on Mac</Text>
              <Text style={[styles.settingSub, isRTL && { textAlign: 'right' }]}>MacBook Air — Dubai, UAE</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.revokeText}>{t('revokeText')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.navy,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCenter: {
    marginBottom: 12,
  },
  infoTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  infoDesc: {
    color: '#8BA1B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 12,
    marginTop: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.navy,
  },
  settingSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  revokeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444', // Red
  },
});


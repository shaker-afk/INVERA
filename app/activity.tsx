import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '../src/hooks/useTranslation';

const Colors = {
  background: '#FAFAFC',
  navy: '#051930',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  goldBg: '#F8F1E3',
  gold: '#A0814C',
  lightGray: '#F3F4F6',
  greenText: '#10B981',
};

export default function ActivityModal() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  const ACTIVITIES = [
    { id: '1', type: 'alert', title: t('newMatchAlert'), time: t('timeAgo2M'), desc: 'A new Sustainable Energy Sukuk project in Aqaba aligns with your risk profile and sector interests.', action: String(t('details')).toUpperCase() },
    { id: '2', type: 'message', title: t('messageFrom'), time: t('timeAgo1H'), desc: '"Regarding the Series B proposal, we have updated the term sheet with the requested amendments..."' },
    { id: '3', type: 'document', title: t('documentStatusUpdate'), time: t('timeAgo4H'), desc: "Your KYC Verification for the 'Desert Pearl' development has been Approved.", attachment: 'verification_seal_v2.pdf' },
    { id: '4', type: 'login', title: t('loginDetected'), time: t('yesterday'), desc: 'A successful login was recorded from a new Safari browser in Amman, Jordan.' },
    { id: '5', type: 'system', title: t('profileUpdated'), time: t('profileUpdatedTime'), desc: t('profileUpdatedDesc') },
    { id: '6', type: 'document', title: t('newReportAvailable'), time: t('newReportAvailableTime'), desc: t('newReportAvailableDesc'), attachment: 'Q1_Financials.pdf' },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <View style={[styles.iconBox, { backgroundColor: Colors.goldBg }]}><MaterialCommunityIcons name="asterisk" size={18} color={Colors.gold} /></View>;
      case 'message':
        return <View style={[styles.iconBox, { backgroundColor: Colors.lightGray }]}><Feather name="mail" size={16} color={Colors.navy} /></View>;
      case 'document':
        return <View style={[styles.iconBox, { backgroundColor: Colors.goldBg }]}><Ionicons name="document-text" size={16} color={Colors.navy} /></View>;
      case 'login':
        return <View style={[styles.iconBox, { backgroundColor: Colors.goldBg }]}><MaterialCommunityIcons name="shield-check" size={16} color={Colors.navy} /></View>;
      case 'system':
      default:
        return <View style={[styles.iconBox, { backgroundColor: Colors.lightGray }]}><Feather name="settings" size={16} color={Colors.navy} /></View>;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name="x" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('allActivity')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {ACTIVITIES.map((item) => (
          <View key={item.id} style={[styles.notifRow, isRTL && { flexDirection: 'row-reverse' }]}>
            {renderIcon(item.type)}
            <View style={[styles.notifContent, isRTL ? { paddingRight: 16 } : { paddingLeft: 0 }]}>
              <View style={[styles.notifTitleRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.notifTitle, isRTL && { textAlign: 'right', paddingRight: 0, paddingLeft: 10 }]}>{item.title}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              {item.type === 'document' && item.desc.includes('Approved.') ? (
                <Text style={[styles.notifText, isRTL && { textAlign: 'right' }]}>
                  Your KYC Verification for the 'Desert Pearl' development has been <Text style={{color: Colors.greenText, fontWeight: '700'}}>{t('approved')}</Text>
                </Text>
              ) : (
                <Text style={[styles.notifText, item.type === 'message' && { fontStyle: 'italic' }, isRTL && { textAlign: 'right' }]}>
                  {item.desc}
                </Text>
              )}

              {item.action && (
                <TouchableOpacity style={[styles.viewDetailsBtn, isRTL && { alignSelf: 'flex-end' }]}>
                  <Text style={styles.viewDetailsText}>{item.action}</Text>
                </TouchableOpacity>
              )}

              {item.attachment && (
                <View style={[styles.attachmentChip, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="document-text" size={14} color={Colors.textMuted} />
                  <Text style={styles.attachmentName}>{item.attachment}</Text>
                  <Feather name="download" size={14} color={Colors.textMuted} style={isRTL ? {marginRight: 'auto'} : {marginLeft: 'auto'}} />
                </View>
              )}
            </View>
          </View>
        ))}
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
  list: {
    padding: 20,
  },
  notifRow: {
    flexDirection: 'row',
    marginBottom: 26,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  notifContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 24,
  },
  notifTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
    flex: 1,
    paddingRight: 10,
  },
  notifTime: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textLight,
  },
  notifText: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  viewDetailsBtn: {
    backgroundColor: Colors.goldBg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A6D3B',
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  attachmentName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.navy,
  },
});


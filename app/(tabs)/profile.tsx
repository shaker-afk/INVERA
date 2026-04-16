import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../src/hooks/useTranslation';
import CommonHeader from '../../src/components/organisms/CommonHeader';

const LocalColors = {
  background: '#FAFAFC', 
  navy: '#051930',
  navyLight: '#0d2a4a',
  gold: '#A0814C', // Darker gold for text
  goldLight: '#E3C88D', // Lighter gold
  goldBg: '#F8F1E3',
  white: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  greenBg: '#ECFDF5',
  greenText: '#10B981',
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'Investor' | 'Company'>('Investor');
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CommonHeader style={{marginBottom: 0}}/>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[styles.profileHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.avatarContainer, isRTL ? { marginLeft: 20, marginRight: 0 } : { marginRight: 20 }]}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={LocalColors.white} />
              </View>
              {/* PRO Badge */}
              <View style={[styles.proBadge, isRTL ? { left: -10, right: 'auto' } : { right: -10, left: 'auto' }]}>
                <Text style={styles.proBadgeText}>{t('pro')}</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, isRTL && { textAlign: 'right' }]}>Ahmad Al-{'\n'}Fahad</Text>
              <Text style={[styles.profileRole, isRTL && { textAlign: 'right' }]}>{t('wealthManagement')}</Text>
            </View>
          </View>

          {/* Toggle Switch */}
          <View style={[styles.toggleContainer, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'Investor' && styles.toggleActive]}
              onPress={() => setActiveTab('Investor')}
            >
              <Text style={[styles.toggleBtnText, activeTab === 'Investor' && styles.toggleActiveText]}>
                {t('investor')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'Company' && styles.toggleActive]}
              onPress={() => setActiveTab('Company')}
            >
              <Text style={[styles.toggleBtnText, activeTab === 'Company' && styles.toggleActiveText]}>
                {t('company')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sector Interests */}
        <View style={styles.sectorsContainer}>
          <View style={[styles.sectorsHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.sectorsTitle}>{t('sectorInterests')}</Text>
          </View>
          <View style={[styles.chipsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            {/* Chips */}
            <View style={[styles.chip, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="leaf-outline" size={14} color="#556B2F" />
              <Text style={styles.chipText}>{t('greenEnergy')}</Text>
            </View>
            <View style={[styles.chip, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="business-outline" size={14} color="#8D6E63" />
              <Text style={styles.chipText}>{t('realEstate')}</Text>
            </View>
            <View style={[styles.chip, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#D4AF37" />
              <Text style={styles.chipText}>{t('medTech')}</Text>
            </View>
            <View style={[styles.chip, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="card-outline" size={14} color="#8D6E63" />
              <Text style={styles.chipText}>{t('finTech')}</Text>
            </View>
            <View style={[styles.chip, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="flower-outline" size={14} color="#556B2F" />
              <Text style={styles.chipText}>{t('agriTech')}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={[styles.addInterestBtn, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => router.push('/add-interest')}>
            <Feather name="plus" size={16} color={LocalColors.textMuted} />
            <Text style={styles.addInterestText}>{t('addInterest')}</Text>
          </TouchableOpacity>
        </View>

        {/* Institutional Security */}
        <View style={[styles.securityCard, isRTL && { alignItems: 'flex-end' }]}>
          <View style={styles.securityIconBg}>
            <MaterialCommunityIcons name="shield-check" size={20} color={LocalColors.goldLight} />
          </View>
          <Text style={[styles.securityTitle, isRTL && { textAlign: 'right' }]}>{t('institutionalSecurity')}</Text>
          <Text style={[styles.securityDesc, isRTL && { textAlign: 'right' }]}>
            {t('securityDesc')}
          </Text>
          <TouchableOpacity style={[styles.securityLinkBtn, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => router.push('/manage-credentials')}>
            <Text style={styles.securityLink}>{t('manageCredentials')}</Text>
            <Feather name={isRTL ? "arrow-left" : "arrow-right"} size={14} color={LocalColors.goldLight} />
          </TouchableOpacity>
          <Feather name="star" size={120} color="rgba(255,255,255,0.03)" style={[styles.securityBgStar, isRTL ? { left: -20, right: 'auto' } : { right: -20, left: 'auto' }]} />
        </View>

        {/* Notification Hub */}
        <View style={styles.hubContainer}>
          <View style={[styles.hubHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.hubTitle}>{t('notificationHub')}</Text>
          </View>

          {/* Notif 1 */}
          <View style={[styles.notifRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.notifIcon, { backgroundColor: LocalColors.goldBg }, isRTL ? { marginLeft: 16, marginRight: 0 } : { marginRight: 16 }]}>
              <MaterialCommunityIcons name="asterisk" size={18} color={LocalColors.gold} />
            </View>
            <View style={styles.notifContent}>
              <View style={[styles.notifTitleRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.notifTitle, isRTL ? { paddingLeft: 10, paddingRight: 0, textAlign: 'right' } : { paddingRight: 10 }]}>{t('newMatchAlert')}</Text>
                <Text style={styles.notifTime}>{t('timeAgo2M')}</Text>
              </View>
              <Text style={[styles.notifText, isRTL && { textAlign: 'right' }]}>
                A new Sustainable Energy Sukuk project in Aqaba aligns with your risk profile and sector interests.
              </Text>
            </View>
          </View>

          {/* Notif 2 */}
          <View style={[styles.notifRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.notifIcon, { backgroundColor: LocalColors.lightGray }, isRTL ? { marginLeft: 16, marginRight: 0 } : { marginRight: 16 }]}>
              <Feather name="mail" size={16} color={LocalColors.navy} />
            </View>
            <View style={styles.notifContent}>
              <View style={[styles.notifTitleRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.notifTitle, isRTL ? { paddingLeft: 10, paddingRight: 0, textAlign: 'right' } : { paddingRight: 10 }]}>{t('messageFrom')}</Text>
                <View style={[styles.timeBadgeContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.notifTime}>{t('timeAgo1H')}</Text>
                  <View style={styles.unreadDot} />
                </View>
              </View>
              <Text style={[styles.notifText, { fontStyle: 'italic' }, isRTL && { textAlign: 'right' }]}>
                "Regarding the Series B proposal, we have updated the term sheet with the requested amendments..."
              </Text>
            </View>
          </View>

          {/* Notif 3 */}
          <View style={[styles.notifRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.notifIcon, { backgroundColor: LocalColors.goldBg }, isRTL ? { marginLeft: 16, marginRight: 0 } : { marginRight: 16 }]}>
              <Ionicons name="document-text" size={16} color={LocalColors.navy} />
            </View>
            <View style={styles.notifContent}>
              <View style={[styles.notifTitleRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.notifTitle, isRTL ? { paddingLeft: 10, paddingRight: 0, textAlign: 'right' } : { paddingRight: 10 }]}>{t('documentStatusUpdate')}</Text>
                <Text style={styles.notifTime}>{t('timeAgo4H')}</Text>
              </View>
              <Text style={[styles.notifText, isRTL && { textAlign: 'right' }]}>
                Your KYC Verification for the 'Desert Pearl' development has been <Text style={styles.approvedText}>{t('approved')}</Text>
              </Text>
              <View style={[styles.attachmentChip, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="document-text" size={14} color={LocalColors.textMuted} />
                <Text style={styles.attachmentName}>verification_seal_v2.pdf</Text>
                <Feather name="download" size={14} color={LocalColors.textMuted} style={isRTL ? {marginRight: 'auto'} : {marginLeft: 'auto'}} />
              </View>
            </View>
          </View>

          {/* Notif 4 */}
          <View style={[styles.notifRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.notifIcon, { backgroundColor: LocalColors.goldBg }, isRTL ? { marginLeft: 16, marginRight: 0 } : { marginRight: 16 }]}>
              <MaterialCommunityIcons name="shield-check" size={16} color={LocalColors.navy} />
            </View>
            <View style={styles.notifContent}>
              <View style={[styles.notifTitleRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.notifTitle, isRTL ? { paddingLeft: 10, paddingRight: 0, textAlign: 'right' } : { paddingRight: 10 }]}>{t('loginDetected')}</Text>
                <Text style={styles.notifTime}>{t('yesterday')}</Text>
              </View>
              <Text style={[styles.notifText, isRTL && { textAlign: 'right' }]}>
                A successful login was recorded from a new Safari browser in Amman, Jordan.
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewAllActivity} onPress={() => router.push('/activity')}>
            <Text style={styles.viewAllActivityText}>{t('viewAllActivity')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LocalColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBrand: {
    fontSize: 14,
    fontWeight: '800',
    color: LocalColors.navy,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileCard: {
    backgroundColor: LocalColors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 24, // Squircle look
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: LocalColors.goldLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: LocalColors.white,
  },
  proBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6A4D1A', // dark gold text
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: LocalColors.navy,
    marginBottom: 4,
    lineHeight: 24,
  },
  profileRole: {
    fontSize: 12,
    color: LocalColors.textMuted,
    lineHeight: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: LocalColors.lightGray,
    borderRadius: 16,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleActive: {
    backgroundColor: LocalColors.navy,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: LocalColors.textMuted,
  },
  toggleActiveText: {
    color: LocalColors.white,
  },
  sectorsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  sectorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectorsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: LocalColors.navy,
  },
  sectorsEdit: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0814C',
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LocalColors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: LocalColors.navy,
  },
  addInterestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LocalColors.white,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addInterestText: {
    fontSize: 12,
    fontWeight: '700',
    color: LocalColors.textMuted,
    letterSpacing: 0.5,
  },
  securityCard: {
    backgroundColor: LocalColors.navy,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  securityIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(227, 200, 141, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: LocalColors.white,
    marginBottom: 8,
    zIndex: 1,
  },
  securityDesc: {
    fontSize: 13,
    color: '#8BA1B8',
    lineHeight: 20,
    marginBottom: 24,
    zIndex: 1,
  },
  securityLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 1,
  },
  securityLink: {
    fontSize: 10,
    fontWeight: '800',
    color: LocalColors.goldLight,
    letterSpacing: 1,
  },
  securityBgStar: {
    position: 'absolute',
    top: -10,
    zIndex: 0,
    transform: [{ rotate: '15deg' }],
  },
  hubContainer: {
    backgroundColor: LocalColors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  hubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  hubTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: LocalColors.navy,
  },
  hubFilterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: LocalColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: LocalColors.navy,
    flex: 1,
  },
  timeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notifTime: {
    fontSize: 9,
    fontWeight: '700',
    color: LocalColors.textLight,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A0814C', // Dark gold dot
  },
  notifText: {
    fontSize: 12,
    color: LocalColors.textMuted,
    lineHeight: 18,
    marginBottom: 10,
  },
  viewDetailsBtn: {
    backgroundColor: LocalColors.goldBg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewDetailsText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A6D3B', // Brown/Gold text
  },
  approvedText: {
    color: LocalColors.greenText,
    fontWeight: '700',
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LocalColors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  attachmentName: {
    fontSize: 11,
    fontWeight: '600',
    color: LocalColors.navy,
  },
  viewAllActivity: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  viewAllActivityText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A0814C',
    letterSpacing: 1,
  },
});


import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../src/hooks/useTranslation';

const LocalColors = {
  background: '#FAFAFC', 
  navy: '#051930',
  navyLight: '#0d2a4a',
  gold: '#E3C88D',
  goldLight: '#F3E5C8',
  white: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  greenBg: '#ECFDF5',
  greenText: '#059669',
  yellowBg: '#FEF3C7',
  yellowText: '#D97706',
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ManageScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.headerLeft, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="star" size={16} color={LocalColors.navy} style={{marginTop: -2}} />
            <Text style={styles.headerBrand}>Sovereign Ledger</Text>
          </View>
          <View style={[styles.headerRight, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={14} color={LocalColors.yellowText} />
            </View>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text" size={14} color={LocalColors.white} />
            </View>
          </View>
        </View>

        {/* Titles */}
        <View style={styles.pageTitles}>
          <Text style={[styles.entityDash, isRTL && { textAlign: 'right' }]}>{t('entityDashboard')}</Text>
          <Text style={[styles.companyName, isRTL && { textAlign: 'right' }]}>Petra Holdings Ltd.</Text>
          <TouchableOpacity 
            style={[styles.createBtn, isRTL && { flexDirection: 'row-reverse', alignSelf: 'flex-end' }]} 
            onPress={() => router.push('/create-listing')}
          >
            <Feather name="plus" size={16} color={LocalColors.white} />
            <Text style={styles.createBtnText}>{t('createListing')}</Text>
          </TouchableOpacity>
        </View>

        {/* Engagement Tracker Card */}
        <View style={styles.engagementCard}>
          <View style={[styles.engagementHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[{ flex: 1 }, isRTL ? { paddingLeft: 10 } : { paddingRight: 10 }]}>
              <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t('engagementTracker')}</Text>
              <Text style={[styles.cardSub, isRTL && { textAlign: 'right' }]}>{t('engagementDesc')}</Text>
            </View>
            <View style={isRTL ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }}>
              <Text style={styles.engagementNumber}>12,482</Text>
              <Text style={styles.engagementGrowth}>{t('engagementGrowth')}</Text>
            </View>
          </View>
          <View style={[styles.chartContainer, isRTL && { flexDirection: 'row-reverse' }]}>
            {[1, 2.5, 2, 4, 7, 3, 4, 5, 3.5].map((heightMulti, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.bar, 
                  idx === 4 && styles.activeBar, 
                  { height: heightMulti * 12 }
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Total Capital Raised Card */}
        <View style={[styles.capitalCard, isRTL && { alignItems: 'flex-end' }]}>
          <View style={styles.capitalIcon}>
            <Ionicons name="wallet-outline" size={20} color={LocalColors.gold} />
          </View>
          <Text style={[styles.capitalTitle, isRTL && { textAlign: 'right' }]}>{t('totalCapitalRaised')}</Text>
          <Text style={[styles.capitalSub, isRTL && { textAlign: 'right' }]}>{t('portfolioValue')}</Text>
          <Text style={[styles.capitalAmount, isRTL && { textAlign: 'right' }]}>JOD 2.45M</Text>
        </View>

        {/* Your Listings Section */}
        <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.sectionTitle}>{t('yourListings')}</Text>
          <View style={[styles.sectionHeaderRight, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.viewAll}>{t('viewAllListings')}</Text>
            <Feather name={isRTL ? "arrow-left" : "arrow-right"} size={16} color={LocalColors.textMuted} />
          </View>
        </View>

        {/* Listing Card: Live */}
        <View style={styles.listingCard}>
          <View style={[styles.listingHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>{t('live')}</Text>
            </View>
            <Feather name="more-horizontal" size={20} color={LocalColors.textMuted} />
          </View>
          <Text style={[styles.listingTitle, isRTL && { textAlign: 'right' }]}>Al-Zarqa Industrial Hub Phase II</Text>
          <Text style={[styles.listingDesc, isRTL && { textAlign: 'right' }]}>
            Strategic logistics and warehousing expansive project located in the heart of th...
          </Text>
          <View style={[styles.listingFooter, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.avatars, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.avatarStack, { zIndex: 2, backgroundColor: '#374151' }]} />
              <View style={[styles.avatarStack, { zIndex: 1, marginLeft: -10, backgroundColor: '#4B5563' }]} />
              <View style={[styles.avatarStack, { zIndex: 0, marginLeft: -10, backgroundColor: LocalColors.lightGray, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ fontSize: 10, color: LocalColors.textMuted }}>+12</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/create-listing')}>
              <Text style={styles.editBtnText}>{t('edit')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Listing Card: Pending */}
        <View style={styles.listingCard}>
          <View style={[styles.listingHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{t('pending')}</Text>
            </View>
            <Feather name="more-horizontal" size={20} color={LocalColors.textMuted} />
          </View>
          <Text style={[styles.listingTitle, isRTL && { textAlign: 'right' }]}>Aqaba Coastal Hospitality Bond</Text>
          <Text style={[styles.listingDesc, isRTL && { textAlign: 'right' }]}>
            Fixed-income sovereign instrument for the redevelopment of the Aqaba waterfront...
          </Text>
          <View style={[styles.listingFooter, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.complianceText}>{t('underComplianceReview')}</Text>
            <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/create-listing')}>
              <Text style={styles.editBtnText}>{t('edit')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* New Listing Card */}
        <TouchableOpacity style={styles.newListingCard} onPress={() => router.push('/create-listing')}>
          <View style={styles.newListingIcon}>
            <Feather name="plus" size={16} color={LocalColors.white} />
          </View>
          <Text style={styles.newListingTitle}>{t('newListingTitle')}</Text>
          <Text style={styles.newListingSub}>{t('newListingDesc')}</Text>
        </TouchableOpacity>

        {/* Document Vault Section */}
        <View style={styles.vaultSection}>
          <View style={[styles.vaultHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.vaultIconContainer}>
              <Ionicons name="folder" size={14} color={LocalColors.navy} />
            </View>
            <Text style={styles.vaultTitle}>{t('documentVault')}</Text>
          </View>

          {/* Doc 1 */}
          <View style={[styles.docCard, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.docIconWrapper, isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }]}>
              <Ionicons name="document-text" size={16} color={LocalColors.navy} />
            </View>
            <View style={[styles.docTextWrapper, isRTL ? { paddingLeft: 10, paddingRight: 0 } : { paddingRight: 10 }]}>
              <Text style={[styles.docName, isRTL && { textAlign: 'right' }]} numberOfLines={1}>Business_Registration_2024.pdf</Text>
              <Text style={[styles.docType, isRTL && { textAlign: 'right' }]}>{t('officialIncorporation')}</Text>
            </View>
          </View>
          
          {/* Doc 2 */}
          <View style={[styles.docCard, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.docIconWrapper, isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }]}>
              <Ionicons name="document-text" size={16} color={LocalColors.navy} />
            </View>
            <View style={[styles.docTextWrapper, isRTL ? { paddingLeft: 10, paddingRight: 0 } : { paddingRight: 10 }]}>
              <Text style={[styles.docName, isRTL && { textAlign: 'right' }]} numberOfLines={1}>Compliance_Audit_Q3.pdf</Text>
              <Text style={[styles.docType, isRTL && { textAlign: 'right' }]}>{t('legalClearance')}</Text>
            </View>
            <View style={styles.docBadge}>
              <Text style={styles.docBadgeText}>{t('underReview')}</Text>
            </View>
          </View>

          {/* Doc 3 */}
          <View style={[styles.docCard, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.docIconWrapper, isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }]}>
              <Ionicons name="document-text" size={16} color={LocalColors.navy} />
            </View>
            <View style={[styles.docTextWrapper, isRTL ? { paddingLeft: 10, paddingRight: 0 } : { paddingRight: 10 }]}>
              <Text style={[styles.docName, isRTL && { textAlign: 'right' }]} numberOfLines={1}>Tax_Certificate_ID_882.pdf</Text>
              <Text style={[styles.docType, isRTL && { textAlign: 'right' }]}>{t('taxCompliance')}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color={LocalColors.gold} />
          </View>
        </View>

        {/* Extra spacing at bottom for tab bar padding */}
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
    gap: 10,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: LocalColors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: LocalColors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitles: {
    marginBottom: 24,
  },
  entityDash: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0814C', /* Gold/brown text */
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  companyName: {
    fontSize: 28,
    fontWeight: '900',
    color: LocalColors.navy,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  createBtn: {
    backgroundColor: LocalColors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  createBtnText: {
    color: LocalColors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  engagementCard: {
    backgroundColor: LocalColors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  engagementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: LocalColors.navy,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: LocalColors.textMuted,
    lineHeight: 16,
  },
  engagementNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: LocalColors.navy,
    marginBottom: 4,
  },
  engagementGrowth: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A0814C', 
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
  },
  bar: {
    width: 18,
    backgroundColor: LocalColors.lightGray,
    borderRadius: 6,
  },
  activeBar: {
    backgroundColor: LocalColors.navy,
  },
  capitalCard: {
    backgroundColor: LocalColors.navy,
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  capitalIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(227, 200, 141, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  capitalTitle: {
    color: LocalColors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  capitalSub: {
    color: '#8BA1B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  capitalAmount: {
    color: LocalColors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: LocalColors.navy,
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '600',
    color: LocalColors.navy,
  },
  listingCard: {
    backgroundColor: LocalColors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    backgroundColor: LocalColors.greenBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveBadgeText: {
    color: LocalColors.greenText,
    fontSize: 10,
    fontWeight: '700',
  },
  pendingBadge: {
    backgroundColor: LocalColors.yellowBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadgeText: {
    color: LocalColors.yellowText,
    fontSize: 10,
    fontWeight: '700',
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: LocalColors.navy,
    marginBottom: 8,
  },
  listingDesc: {
    fontSize: 13,
    color: LocalColors.textMuted,
    lineHeight: 18,
    marginBottom: 16,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: LocalColors.white,
  },
  editBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editBtnText: {
    color: LocalColors.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  complianceText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: LocalColors.textLight,
  },
  newListingCard: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  newListingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LocalColors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  newListingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: LocalColors.navy,
    marginBottom: 4,
  },
  newListingSub: {
    fontSize: 12,
    color: LocalColors.textMuted,
  },
  vaultSection: {
    backgroundColor: LocalColors.lightGray,
    borderRadius: 24,
    padding: 20,
  },
  vaultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  vaultIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E6D3A0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: LocalColors.navy,
  },
  docCard: {
    backgroundColor: LocalColors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  docIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: LocalColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docTextWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  docName: {
    fontSize: 13,
    fontWeight: '700',
    color: LocalColors.navy,
    marginBottom: 4,
    maxWidth: '95%',
  },
  docType: {
    fontSize: 10,
    fontWeight: '600',
    color: LocalColors.textMuted,
    letterSpacing: 0.5,
  },
  docBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  docBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: LocalColors.textMuted,
  },
});


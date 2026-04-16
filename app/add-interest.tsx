import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
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
  goldBg: '#F8F1E3',
  gold: '#A0814C',
  greenBg: '#ECFDF5',
  greenText: '#10B981',
};

export default function AddInterestModal() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  
  const ALL_INTERESTS = [
    { id: '1', name: t('greenEnergy'), icon: 'leaf-outline', selected: true },
    { id: '2', name: t('realEstate'), icon: 'business-outline', selected: true },
    { id: '3', name: t('medTech'), icon: 'shield-checkmark-outline', selected: true },
    { id: '4', name: t('finTech'), icon: 'card-outline', selected: true },
    { id: '5', name: t('agriTech'), icon: 'flower-outline', selected: true },
    { id: '6', name: t('artificialIntelligence'), icon: 'hardware-chip-outline', selected: false },
    { id: '7', name: t('logistics'), icon: 'boat-outline', selected: false },
    { id: '8', name: t('edTech'), icon: 'book-outline', selected: false },
    { id: '9', name: t('cybersecurity'), icon: 'lock-closed-outline', selected: false },
  ];

  const [search, setSearch] = useState('');
  const [mappedInterests, setMappedInterests] = useState(ALL_INTERESTS);

  const toggleInterest = (id: string) => {
    setMappedInterests(mappedInterests.map(i => 
      i.id === id ? { ...i, selected: !i.selected } : i
    ));
  };

  const filteredInterests = mappedInterests.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name="x" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('safeAddInterests')}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.saveText}>{t('save')}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, isRTL && { flexDirection: 'row-reverse' }]}>
        <Feather name="search" size={18} color={Colors.textMuted} style={isRTL ? {marginLeft: 8} : {marginRight: 8}} />
        <TextInput 
          style={[styles.searchInput, isRTL && { textAlign: 'right' }]}
          placeholder={t('searchSectors')}
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filteredInterests.map((interest) => (
          <TouchableOpacity 
            key={interest.id} 
            style={[styles.interestRow, interest.selected && styles.interestRowSelected, isRTL && { flexDirection: 'row-reverse' }]}
            onPress={() => toggleInterest(interest.id)}
          >
            <View style={[styles.interestLeft, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.iconBox, interest.selected && styles.iconBoxSelected]}>
                <Ionicons name={interest.icon as any} size={18} color={interest.selected ? Colors.gold : Colors.textMuted} />
              </View>
              <Text style={[styles.interestName, interest.selected && styles.interestNameSelected]}>
                {interest.name}
              </Text>
            </View>
            <View style={[styles.checkbox, interest.selected && styles.checkboxSelected]}>
              {interest.selected && <Feather name="check" size={14} color={Colors.white} />}
            </View>
          </TouchableOpacity>
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
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.navy,
  },
  list: {
    padding: 20,
  },
  interestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  interestRowSelected: {
    backgroundColor: Colors.goldBg,
    borderColor: 'rgba(160, 129, 76, 0.2)',
  },
  interestLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBoxSelected: {
    borderColor: 'rgba(160, 129, 76, 0.3)',
  },
  interestName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.navy,
  },
  interestNameSelected: {
    color: '#6A4D1A',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxSelected: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
});


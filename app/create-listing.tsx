import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
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
  primaryBtn: '#051930',
};

export default function CreateListingModal() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name="x" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('newListingTitle')}</Text>
        <View style={{ width: 24 }} /> {/* Balance for center title */}
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t('assetDetails')}</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('assetName')}</Text>
          <TextInput 
            style={[styles.input, isRTL && { textAlign: 'right' }]} 
            placeholder="e.g. Al-Zarqa Industrial Hub"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('description')}</Text>
          <TextInput 
            style={[styles.input, styles.textArea, isRTL && { textAlign: 'right' }]} 
            placeholder="Describe the investment opportunity..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('targetCapitalJod')}</Text>
          <TextInput 
            style={[styles.input, isRTL && { textAlign: 'right' }]} 
            placeholder="e.g. 2,000,000"
            keyboardType="numeric"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('assetType')}</Text>
          <TouchableOpacity style={[styles.selector, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.selectorText}>{t('selectCategory')}</Text>
            <Feather name="chevron-down" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.submitBtnText}>{t('createListing')}</Text>
        </TouchableOpacity>
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
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.navy,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: Colors.navy,
    backgroundColor: Colors.background,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.background,
  },
  selectorText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  submitBtn: {
    backgroundColor: Colors.primaryBtn,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});


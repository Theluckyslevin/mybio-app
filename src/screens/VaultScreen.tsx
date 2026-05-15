import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export default function VaultScreen() {
  const { theme } = useApp();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'passwords' | 'cards' | 'notes' | 'licenses'>('passwords');

  const mockEntries = {
    passwords: [
      { id: '1', name: 'Gmail', username: 'ali@gmail.com', strength: 'strong' as const },
      { id: '2', name: 'Instagram', username: 'aliyilmaz', strength: 'medium' as const },
      { id: '3', name: 'Akbank', username: 'ali.yilmaz', strength: 'weak' as const },
    ],
    cards: [{ id: '4', name: 'Kredi Kartım', cardNumber: '**** 3456' }],
    notes: [{ id: '5', name: 'Önemli Not', note: 'Toplantı notları...' }],
    licenses: [{ id: '6', name: 'Windows 11', licenseKey: 'XXXXX-XXXXX' }],
  };

  const handleUnlock = () => {
    if (password === '1234' || !password) {
      setIsUnlocked(true);
    } else {
      Alert.alert('Hata', 'Yanlış şifre! (İpucu: 1234)');
    }
  };

  if (!isUnlocked) {
    return (
      <View style={[styles.lockContainer, { backgroundColor: '#0D1117' }]}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.lockTitle}>Şifre Kasası</Text>
        <Text style={styles.lockDesc}>AES-256 ile şifrelenmiştir</Text>
        <TextInput style={styles.lockInput} placeholder="Ana şifre (1234)" placeholderTextColor="#666" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.lockButton} onPress={handleUnlock}><Text style={styles.lockButtonText}>Kasayı Aç</Text></TouchableOpacity>
        <TouchableOpacity style={styles.lockButtonOutline} onPress={() => { setIsUnlocked(true); setPassword(''); }}><Text style={styles.lockButtonOutlineText}>👆 Biyometrik (Demo)</Text></TouchableOpacity>
      </View>
    );
  }

  const entries = mockEntries[activeTab];

  return (
    <View style={[styles.container, { backgroundColor: '#0D1117' }]}>
      <View style={styles.vaultHeader}>
        <Text style={styles.vaultTitle}>🔒 Şifre Kasası</Text>
        <TouchableOpacity onPress={() => setIsUnlocked(false)}><Text style={{ color: '#58A6FF', fontSize: 14 }}>Kitle</Text></TouchableOpacity>
      </View>
      <View style={styles.vaultTabs}>
        {(['passwords', 'cards', 'notes', 'licenses'] as const).map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.vaultTab, activeTab === tab && { backgroundColor: '#58A6FF' }]}>
            <Text style={[styles.vaultTabText, activeTab === tab && { color: '#000' }]}>
              {tab === 'passwords' ? '🔑 Şifreler' : tab === 'cards' ? '💳 Kartlar' : tab === 'notes' ? '📝 Notlar' : '🔐 Lisanslar'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        {entries.map((entry: any) => (
          <View key={entry.id} style={styles.vaultEntry}>
            <View style={styles.vaultEntryHeader}>
              <Text style={styles.vaultEntryName}>{activeTab === 'passwords' ? '🔑' : activeTab === 'cards' ? '💳' : activeTab === 'notes' ? '📝' : '🔐'} {entry.name}</Text>
            </View>
            {entry.username && <Text style={styles.vaultEntryDetail}>👤 {entry.username}</Text>}
            {entry.strength && (
              <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                <Text style={styles.vaultEntryDetail}>Güç: </Text>
                <Text style={{ color: entry.strength === 'strong' ? '#3FB950' : entry.strength === 'medium' ? '#D29922' : '#F85149', fontWeight: '600', fontSize: 12 }}>
                  {entry.strength === 'strong' ? '🟢 Güçlü' : entry.strength === 'medium' ? '🟡 Orta' : '🔴 Zayıf'}
                </Text>
              </View>
            )}
            {entry.cardNumber && <Text style={styles.vaultEntryDetail}>💳 {entry.cardNumber}</Text>}
            {entry.note && <Text style={styles.vaultEntryDetail}>📝 {entry.note}</Text>}
            {entry.licenseKey && <Text style={styles.vaultEntryDetail}>🔐 {entry.licenseKey}</Text>}
          </View>
        ))}
        <View style={{ padding: 16 }}>
          <TouchableOpacity style={[styles.addEntryButton, { backgroundColor: '#58A6FF' }]}><Text style={styles.addEntryText}>➕ Yeni Ekle</Text></TouchableOpacity>
          <TouchableOpacity style={styles.passwordGeneratorButton}><Text style={{ color: '#58A6FF', fontWeight: '600', fontSize: 14, textAlign: 'center' }}>🔐 Şifre Oluşturucu</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lockContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  lockIcon: { fontSize: 64, marginBottom: 16 },
  lockTitle: { fontSize: 22, fontWeight: 'bold', color: '#C9D1D9', marginBottom: 6 },
  lockDesc: { fontSize: 13, color: '#8B949E', textAlign: 'center', marginBottom: 24 },
  lockInput: { width: '100%', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#30363D', backgroundColor: '#161B22', color: '#C9D1D9', fontSize: 14, marginBottom: 12 },
  lockButton: { width: '100%', padding: 14, borderRadius: 10, backgroundColor: '#58A6FF', alignItems: 'center', marginBottom: 8 },
  lockButtonText: { color: '#000', fontWeight: '700', fontSize: 15 },
  lockButtonOutline: { width: '100%', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#30363D', alignItems: 'center' },
  lockButtonOutlineText: { color: '#58A6FF', fontWeight: '600', fontSize: 14 },
  vaultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  vaultTitle: { fontSize: 18, fontWeight: 'bold', color: '#C9D1D9' },
  vaultTabs: { flexDirection: 'row', gap: 6, paddingHorizontal: 12, marginBottom: 8 },
  vaultTab: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: '#161B22' },
  vaultTabText: { color: '#C9D1D9', fontSize: 11, fontWeight: '600' },
  vaultEntry: { backgroundColor: '#161B22', borderWidth: 1, borderColor: '#30363D', borderRadius: 10, padding: 14, marginHorizontal: 12, marginBottom: 6 },
  vaultEntryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  vaultEntryName: { color: '#C9D1D9', fontWeight: '600', fontSize: 14 },
  vaultEntryDetail: { color: '#8B949E', fontSize: 12, marginTop: 2 },
  addEntryButton: { width: '100%', padding: 14, borderRadius: 10, alignItems: 'center' },
  addEntryText: { color: '#000', fontWeight: '700', fontSize: 14 },
  passwordGeneratorButton: { width: '100%', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#30363D', marginTop: 8 },
});

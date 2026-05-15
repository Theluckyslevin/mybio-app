import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useApp } from '../context/AppContext';

export default function SettingsScreen() {
  const { theme, colorScheme, toggleTheme, settings } = useApp();

  const settingsItems = [
    { icon: '🎨', title: 'Tema', value: colorScheme === 'dark' ? 'Koyu' : 'Açık', action: toggleTheme },
    { icon: '🌐', title: 'Dil', value: 'Türkçe' },
    { icon: '🔒', title: 'Ana Şifre Değiştir', value: 'Şifre Kasası' },
    { icon: '🔐', title: 'Biyometrik Kilit', value: settings.biometricEnabled ? 'Açık' : 'Kapalı', isSwitch: true },
    { icon: '⏱️', title: 'Otomatik Kilit Süresi', value: `${settings.autoLockMinutes} dakika` },
    { icon: '📤', title: 'Verileri Dışa Aktar', value: 'JSON' },
    { icon: '💾', title: 'Yedekleme', value: 'Yedek al / geri yükle' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.profileSummaryCard, { backgroundColor: theme.card }]}>
        <Text style={styles.summaryIcon}>👤</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>Profili Düzenle</Text>
          <Text style={[styles.summaryDesc, { color: theme.textSecondary }]}>Fotoğraf, isim, bio, kartvizit</Text>
        </View>
        <Text style={[styles.summaryArrow, { color: theme.textSecondary }]}>→</Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
        {settingsItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={item.action}
            style={[styles.settingsItem, idx < settingsItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}
          >
            <Text style={styles.settingsIcon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingsTitle, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.settingsValue, { color: theme.textSecondary }]}>{item.value}</Text>
            </View>
            {item.isSwitch ? (
              <Switch value={settings.biometricEnabled} trackColor={{ false: theme.border, true: theme.primaryLight }} thumbColor={theme.primary} />
            ) : (
              <Text style={[styles.settingsArrow, { color: theme.textSecondary }]}>›</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ alignItems: 'center', padding: 20 }}>
        <Text style={[styles.appVersion, { color: theme.text }]}>myBio v1.0.0</Text>
        <Text style={[styles.appDesc, { color: theme.textSecondary }]}>Linktree + Dijital Cüzdan + Şifre Kasası</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileSummaryCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginTop: 12, padding: 16, borderRadius: 12 },
  summaryIcon: { fontSize: 28, marginRight: 12 },
  summaryTitle: { fontSize: 15, fontWeight: '600' },
  summaryDesc: { fontSize: 12, marginTop: 2 },
  summaryArrow: { fontSize: 20 },
  settingsCard: { marginHorizontal: 12, marginTop: 8, borderRadius: 12, overflow: 'hidden' },
  settingsItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  settingsIcon: { fontSize: 20, marginRight: 12 },
  settingsTitle: { fontSize: 14, fontWeight: '500' },
  settingsValue: { fontSize: 12, marginTop: 1 },
  settingsArrow: { fontSize: 22, fontWeight: '300' },
  appVersion: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  appDesc: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});

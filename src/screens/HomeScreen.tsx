import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Switch, Alert, RefreshControl } from 'react-native';
import { useApp } from '../context/AppContext';

const ICONS = ['🔗', '📸', '💼', '🎵', '▶️', '🐦', '🌐', '📧', '🎨', '🚀'];
const COLORS = ['#6C63FF', '#E1306C', '#0A66C2', '#1DB954', '#FF0000', '#1DA1F2', '#6C63FF', '#EA4335', '#FF5733', '#8B5CF6'];

export default function HomeScreen({ navigation }: any) {
  const { theme, links, profile, setLinks, refreshAllData } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAllData();
    setRefreshing(false);
  }, [refreshAllData]);

  const handleToggleActive = async (linkId: string) => {
    const updated = links.map(l => l.id === linkId ? { ...l, isActive: !l.isActive, updatedAt: new Date().toISOString() } : l);
    await setLinks(updated);
  };

  const activeLinks = links.filter(l => l.isActive);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={activeLinks}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            <View style={[styles.profileCard, { backgroundColor: theme.primary }]}>
              <View style={styles.profileRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{profile?.displayName?.charAt(0)?.toUpperCase() || '👤'}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{profile?.displayName || 'İsminizi Ekleyin'}</Text>
                  <Text style={styles.profileBio}>{profile?.bio || 'Bio eklenmemiş'}</Text>
                  <TouchableOpacity>
                    <Text style={styles.editProfile}>Profili Düzenle →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>🔗 Bağlantılar ({activeLinks.length})</Text>
              <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]}>
                <Text style={styles.addButtonText}>+ Yeni Link</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item: link }) => (
          <View style={[styles.linkItem, { borderLeftColor: link.color || theme.primary }, link.isSpotlight && styles.spotlight]}>
            <Text style={styles.linkIcon}>{link.icon || '🔗'}</Text>
            <View style={styles.linkInfo}>
              <Text style={[styles.linkTitle, { color: theme.text }]}>{link.title}</Text>
              <Text style={[styles.linkUrl, { color: theme.textSecondary }]}>{link.url}</Text>
            </View>
            {link.isSpotlight && <View style={styles.spotlightBadge}><Text style={styles.spotlightText}>⭐</Text></View>}
            <Switch
              value={link.isActive}
              onValueChange={() => handleToggleActive(link.id)}
              trackColor={{ false: theme.border, true: theme.primaryLight }}
              thumbColor={link.isActive ? theme.primary : theme.textTertiary}
            />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.quickActions}>
            {[{ icon: '🎨', label: 'Tasarım' }, { icon: '💳', label: 'Kartvizit' }, { icon: '🔌', label: 'Entegrasyon' }, { icon: '💾', label: 'Yedekle' }].map((item, idx) => (
              <TouchableOpacity key={idx} style={[styles.qaButton, { backgroundColor: theme.card }]}>
                <Text style={styles.qaIcon}>{item.icon}</Text>
                <Text style={[styles.qaLabel, { color: theme.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileCard: { margin: 12, borderRadius: 16, padding: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { fontSize: 26, color: '#FFF' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  profileBio: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  editProfile: { fontSize: 13, color: '#FFD700', marginTop: 6, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginVertical: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  addButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  addButtonText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  linkItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    marginHorizontal: 12, marginVertical: 3, padding: 12, borderRadius: 12,
    borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  spotlight: { borderWidth: 2, borderColor: '#FFD700', borderLeftWidth: 4 },
  linkIcon: { fontSize: 20, marginRight: 10 },
  linkInfo: { flex: 1 },
  linkTitle: { fontSize: 14, fontWeight: '600' },
  linkUrl: { fontSize: 11, marginTop: 2 },
  spotlightBadge: { backgroundColor: '#FFD700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  spotlightText: { fontSize: 11 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', margin: 12, gap: 6 },
  qaButton: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  qaIcon: { fontSize: 22 },
  qaLabel: { fontSize: 11, marginTop: 4, fontWeight: '500' },
});

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function AnalyticsScreen() {
  const { theme } = useApp();

  const stats = [
    { icon: '👁️', number: '1,247', label: 'Görüntülenme' },
    { icon: '👆', number: '892', label: 'Tıklanma' },
    { icon: '👤', number: '534', label: 'Ziyaretçi' },
  ];

  const chartData = [20, 45, 30, 65, 50, 80, 55];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.statsRow}>
        {stats.map((stat, idx) => (
          <View key={idx} style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={[styles.statNumber, { color: theme.text }]}>{stat.number}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.chartBox, { backgroundColor: theme.card }]}>
        <Text style={[styles.chartTitle, { color: theme.text }]}>📈 Günlük Tıklanma</Text>
        <View style={styles.chartBars}>
          {chartData.map((val, idx) => (
            <View key={idx} style={styles.chartBarContainer}>
              <View style={[styles.chartBar, { height: `${val}%`, backgroundColor: theme.primary }]} />
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.chatBox, { backgroundColor: theme.card }]}>
        <Text style={[styles.chatTitle, { color: theme.text }]}>🤖 AI Insights</Text>
        <View style={styles.chatBubble}>
          <Text style={styles.chatMessage}>
            📊 En popüler linkiniz <Text style={{ fontWeight: 'bold' }}>Instagram</Text> (245 tıklama). LinkedIn (189) ve Web Siteniz (156) takip ediyor. 🚀
          </Text>
        </View>
        <View style={styles.chatInputRow}>
          <View style={[styles.chatInput, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.textTertiary, fontSize: 13 }}>Analiz hakkında soru sor...</Text>
          </View>
          <View style={[styles.chatSendButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.chatSendText}>Gönder</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statsRow: { flexDirection: 'row', gap: 8, marginHorizontal: 12, marginVertical: 12 },
  statCard: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 12 },
  statIcon: { fontSize: 22 },
  statNumber: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  statLabel: { fontSize: 10, marginTop: 2 },
  chartBox: { marginHorizontal: 12, padding: 16, borderRadius: 12, marginBottom: 8 },
  chartTitle: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 4 },
  chartBarContainer: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  chartBar: { width: '80%', borderRadius: 4, minHeight: 4 },
  chatBox: { marginHorizontal: 12, padding: 16, borderRadius: 12, marginBottom: 8 },
  chatTitle: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  chatBubble: { backgroundColor: '#F0EEFF', padding: 12, borderRadius: 12, marginBottom: 8 },
  chatMessage: { fontSize: 13, color: '#333', lineHeight: 18 },
  chatInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  chatInput: { flex: 1, padding: 12, borderRadius: 20 },
  chatSendButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  chatSendText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
});

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

const CARD_ICONS: Record<string, string> = {
  phone: '📞', email: '📧', instagram: '📸', youtube: '▶️', x: '🐦', tiktok: '🎵',
  linkedin: '💼', github: '💻', snapchat: '👻', whatsapp: '💬', telegram: '✈️',
  signal: '🔵', iban: '🏦', papara: '💳', paypal: '🅿️', cashapp: '💰',
  website: '🌐', blog: '📝', linktree: '🔗', tckimlik: '🆔', ehliyet: '🚗', pasaport: '🛂',
};

export default function DigitalWalletScreen() {
  const { theme, sharingCards, setSharingCards } = useApp();

  const handleToggleVisibility = async (cardId: string) => {
    const updated = sharingCards.map(c => c.id === cardId ? { ...c, isVisible: !c.isVisible } : c);
    await setSharingCards(updated);
  };

  const visibleCards = sharingCards.filter(c => c.isVisible);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>👛 Dijital Cüzdan</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Paylaşım kartların ({visibleCards.length})</Text>
        </View>

        {visibleCards.map(card => (
          <View key={card.id} style={[styles.cardItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.cardIcon}>{CARD_ICONS[card.type] || '📱'}</Text>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>{card.label}</Text>
              <Text style={[styles.cardValue, { color: theme.textSecondary }]}>{card.value}</Text>
            </View>
            <Switch
              value={card.isVisible}
              onValueChange={() => handleToggleVisibility(card.id)}
              trackColor={{ false: theme.border, true: theme.primaryLight }}
              thumbColor={card.isVisible ? theme.primary : theme.textTertiary}
            />
          </View>
        ))}

        <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 13, marginTop: 2 },
  cardItem: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginVertical: 3,
    padding: 14, borderRadius: 12, borderWidth: 1,
  },
  cardIcon: { fontSize: 24, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardLabel: { fontSize: 14, fontWeight: '600' },
  cardValue: { fontSize: 12, marginTop: 1 },
  fab: { position: 'absolute', bottom: 80, right: 16, width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  fabText: { fontSize: 28, color: '#FFF', fontWeight: '300' },
});

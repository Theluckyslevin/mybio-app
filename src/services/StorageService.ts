import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, BioLink, LinkCategory, AppSettings, VaultEntry, SharingCard, BusinessCard, AnalyticsData, IntegrationConfig } from '../types';

const KEYS = {
  PROFILE: '@mybio_profile',
  LINKS: '@mybio_links',
  CATEGORIES: '@mybio_categories',
  SETTINGS: '@mybio_settings',
  SHARING_CARDS: '@mybio_sharing_cards',
  BUSINESS_CARD: '@mybio_business_card',
  ANALYTICS: '@mybio_analytics',
  INTEGRATIONS: '@mybio_integrations',
  VAULT_MASTER_HASH: '@mybio_vault_master_hash',
  VAULT_LOCK_STATE: '@mybio_vault_lock_state',
};

class StorageService {
  async getProfile(): Promise<UserProfile | null> {
    const data = await AsyncStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  }

  async getLinks(): Promise<BioLink[]> {
    const data = await AsyncStorage.getItem(KEYS.LINKS);
    return data ? JSON.parse(data) : [];
  }

  async saveLinks(links: BioLink[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.LINKS, JSON.stringify(links));
  }

  async updateLink(linkId: string, updates: Partial<BioLink>): Promise<void> {
    const links = await this.getLinks();
    const index = links.findIndex(l => l.id === linkId);
    if (index !== -1) {
      links[index] = { ...links[index], ...updates, updatedAt: new Date().toISOString() };
      await this.saveLinks(links);
    }
  }

  async deleteLink(linkId: string): Promise<void> {
    const links = await this.getLinks();
    await this.saveLinks(links.filter(l => l.id !== linkId));
  }

  async getSettings(): Promise<AppSettings> {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (data) return JSON.parse(data);
    return { theme: 'light', language: 'tr', autoLockMinutes: 3, biometricEnabled: false, autoBackupEnabled: false, lastBackupAt: null };
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }

  async getSharingCards(): Promise<SharingCard[]> {
    const data = await AsyncStorage.getItem(KEYS.SHARING_CARDS);
    if (data) return JSON.parse(data);
    return [
      { id: '1', type: 'phone', label: 'Telefon', value: '', isVisible: true, sortOrder: 0 },
      { id: '2', type: 'email', label: 'E-posta', value: '', isVisible: true, sortOrder: 1 },
      { id: '3', type: 'instagram', label: 'Instagram', value: '', isVisible: true, sortOrder: 2 },
    ];
  }

  async saveSharingCards(cards: SharingCard[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.SHARING_CARDS, JSON.stringify(cards));
  }

  async getBusinessCard(): Promise<BusinessCard | null> {
    const data = await AsyncStorage.getItem(KEYS.BUSINESS_CARD);
    return data ? JSON.parse(data) : null;
  }

  async saveBusinessCard(card: BusinessCard): Promise<void> {
    await AsyncStorage.setItem(KEYS.BUSINESS_CARD, JSON.stringify(card));
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const data = await AsyncStorage.getItem(KEYS.ANALYTICS);
    if (data) return JSON.parse(data);
    return { totalClicks: 0, totalViews: 0, uniqueVisitors: 0, topLinks: [], referrers: [], locations: [], hourlyData: [], dailyData: [], weeklyData: [] };
  }

  async saveAnalytics(analytics: AnalyticsData): Promise<void> {
    await AsyncStorage.setItem(KEYS.ANALYTICS, JSON.stringify(analytics));
  }

  async getIntegrations(): Promise<IntegrationConfig> {
    const data = await AsyncStorage.getItem(KEYS.INTEGRATIONS);
    return data ? JSON.parse(data) : {};
  }

  async saveIntegrations(config: IntegrationConfig): Promise<void> {
    await AsyncStorage.setItem(KEYS.INTEGRATIONS, JSON.stringify(config));
  }

  async createEncryptedBackup(masterPassword: string): Promise<string> {
    const allData = {
      profile: await this.getProfile(),
      links: await this.getLinks(),
      settings: await this.getSettings(),
      sharingCards: await this.getSharingCards(),
      businessCard: await this.getBusinessCard(),
      analytics: await this.getAnalytics(),
      integrations: await this.getIntegrations(),
    };
    const CryptoJS = require('crypto-js');
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(allData), masterPassword).toString();
    return encrypted;
  }

  async restoreFromBackup(encryptedData: string, masterPassword: string): Promise<boolean> {
    try {
      const CryptoJS = require('crypto-js');
      const decrypted = CryptoJS.AES.decrypt(encryptedData, masterPassword).toString(CryptoJS.enc.Utf8);
      const data = JSON.parse(decrypted);
      if (data.profile) await this.saveProfile(data.profile);
      if (data.links) await this.saveLinks(data.links);
      if (data.settings) await this.saveSettings(data.settings);
      if (data.sharingCards) await this.saveSharingCards(data.sharingCards);
      if (data.businessCard) await this.saveBusinessCard(data.businessCard);
      if (data.analytics) await this.saveAnalytics(data.analytics);
      if (data.integrations) await this.saveIntegrations(data.integrations);
      return true;
    } catch { return false; }
  }
}

export const storageService = new StorageService();

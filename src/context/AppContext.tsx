import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Appearance } from 'react-native';
import { UserProfile, BioLink, LinkCategory, AppSettings, SharingCard, BusinessCard, AnalyticsData, IntegrationConfig } from '../types';
import { storageService } from '../services/StorageService';
import { getTheme, Theme } from '../theme';

interface AppContextType {
  theme: Theme;
  colorScheme: 'light' | 'dark';
  toggleTheme: () => void;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => Promise<void>;
  links: BioLink[];
  setLinks: (links: BioLink[]) => Promise<void>;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => Promise<void>;
  sharingCards: SharingCard[];
  setSharingCards: (cards: SharingCard[]) => Promise<void>;
  businessCard: BusinessCard | null;
  setBusinessCard: (card: BusinessCard) => Promise<void>;
  analytics: AnalyticsData;
  setAnalytics: (data: AnalyticsData) => Promise<void>;
  integrations: IntegrationConfig;
  setIntegrations: (config: IntegrationConfig) => Promise<void>;
  isLoading: boolean;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [links, setLinksState] = useState<BioLink[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>({ theme: 'light', language: 'tr', autoLockMinutes: 3, biometricEnabled: false, autoBackupEnabled: false, lastBackupAt: null });
  const [sharingCards, setSharingCardsState] = useState<SharingCard[]>([]);
  const [businessCard, setBusinessCardState] = useState<BusinessCard | null>(null);
  const [analytics, setAnalyticsState] = useState<AnalyticsData>({ totalClicks: 0, totalViews: 0, uniqueVisitors: 0, topLinks: [], referrers: [], locations: [], hourlyData: [], dailyData: [], weeklyData: [] });
  const [integrations, setIntegrationsState] = useState<IntegrationConfig>({});
  const [isLoading, setIsLoading] = useState(true);

  const theme = getTheme(colorScheme);

  useEffect(() => {
    const systemScheme = Appearance.getColorScheme() || 'light';
    setColorScheme(settings.theme === 'system' ? systemScheme : settings.theme as 'light' | 'dark');
  }, [settings.theme]);

  const loadProfile = useCallback(async () => { setProfileState(await storageService.getProfile()); }, []);
  const loadLinks = useCallback(async () => { setLinksState(await storageService.getLinks()); }, []);
  const loadSettings = useCallback(async () => { setSettingsState(await storageService.getSettings()); }, []);
  const loadSharingCards = useCallback(async () => { setSharingCardsState(await storageService.getSharingCards()); }, []);
  const loadBusinessCard = useCallback(async () => { setBusinessCardState(await storageService.getBusinessCard()); }, []);
  const loadAnalytics = useCallback(async () => { setAnalyticsState(await storageService.getAnalytics()); }, []);
  const loadIntegrations = useCallback(async () => { setIntegrationsState(await storageService.getIntegrations()); }, []);

  const refreshAllData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([loadProfile(), loadLinks(), loadSettings(), loadSharingCards(), loadBusinessCard(), loadAnalytics(), loadIntegrations()]);
    setIsLoading(false);
  }, [loadProfile, loadLinks, loadSettings, loadSharingCards, loadBusinessCard, loadAnalytics, loadIntegrations]);

  useEffect(() => { refreshAllData(); }, [refreshAllData]);

  const toggleTheme = useCallback(() => {
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);
    const newSettings = { ...settings, theme: newScheme };
    setSettingsState(newSettings);
    storageService.saveSettings(newSettings);
  }, [colorScheme, settings]);

  const setProfile = useCallback(async (p: UserProfile) => { setProfileState(p); await storageService.saveProfile(p); }, []);
  const setLinks = useCallback(async (l: BioLink[]) => { setLinksState(l); await storageService.saveLinks(l); }, []);
  const setSettings = useCallback(async (s: AppSettings) => { setSettingsState(s); await storageService.saveSettings(s); }, []);
  const setSharingCards = useCallback(async (c: SharingCard[]) => { setSharingCardsState(c); await storageService.saveSharingCards(c); }, []);
  const setBusinessCard = useCallback(async (c: BusinessCard) => { setBusinessCardState(c); await storageService.saveBusinessCard(c); }, []);
  const setAnalytics = useCallback(async (a: AnalyticsData) => { setAnalyticsState(a); await storageService.saveAnalytics(a); }, []);
  const setIntegrations = useCallback(async (i: IntegrationConfig) => { setIntegrationsState(i); await storageService.saveIntegrations(i); }, []);

  const value: AppContextType = {
    theme, colorScheme, toggleTheme, profile, setProfile, links, setLinks,
    settings, setSettings, sharingCards, setSharingCards, businessCard, setBusinessCard,
    analytics, setAnalytics, integrations, setIntegrations, isLoading, refreshAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

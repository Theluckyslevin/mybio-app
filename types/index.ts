export type LinkIconName = string;

export interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: LinkIconName;
  color: string;
  categoryId: string | null;
  sortOrder: number;
  isSpotlight: boolean;
  isActive: boolean;
  scheduledPublishDate: string | null;
  scheduledEndDate: string | null;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface LinkCategory {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
}

export interface UserProfile {
  displayName: string;
  bio: string;
  avatarUri: string | null;
  avatarType: 'image' | 'video' | null;
  backgroundUri: string | null;
  backgroundType: 'image' | 'video' | 'color' | null;
  backgroundColor: string;
  themeId: string;
  layoutTemplateId: string;
  email: string;
  phone: string;
  username: string;
}

export interface VaultEntry {
  id: string;
  type: 'password' | 'credit_card' | 'secure_note' | 'license_key';
  name: string;
  username?: string;
  password?: string;
  website?: string;
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  cvv?: string;
  noteContent?: string;
  licenseKey?: string;
  productName?: string;
  category?: string;
  strength?: 'weak' | 'medium' | 'strong';
  passwordHistory?: string[];
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
}

export interface SharingCard {
  id: string;
  type: SharingCardType;
  label: string;
  value: string;
  isVisible: boolean;
  sortOrder: number;
}

export type SharingCardType =
  | 'phone' | 'email' | 'instagram' | 'youtube' | 'x' | 'tiktok'
  | 'linkedin' | 'github' | 'snapchat' | 'whatsapp' | 'telegram'
  | 'signal' | 'iban' | 'papara' | 'paypal' | 'cashapp' | 'website'
  | 'blog' | 'linktree' | 'tckimlik' | 'ehliyet' | 'pasaport';

export interface BusinessCard {
  fullName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  socialLinks: { platform: string; url: string }[];
  qrColor: string;
  qrLogo: string | null;
}

export interface AnalyticsData {
  totalClicks: number;
  totalViews: number;
  uniqueVisitors: number;
  topLinks: { linkId: string; title: string; clicks: number }[];
  referrers: { source: string; count: number }[];
  locations: { country: string; city: string; count: number }[];
  hourlyData: { hour: number; clicks: number }[];
  dailyData: { date: string; clicks: number }[];
  weeklyData: { week: string; clicks: number }[];
}

export interface IntegrationConfig {
  mailchimp?: { apiKey: string; listId: string; isConnected: boolean };
  shopify?: { apiKey: string; storeUrl: string; isConnected: boolean };
  metaPixel?: { pixelId: string; isConnected: boolean };
  googleAnalytics?: { measurementId: string; isConnected: boolean };
  zapier?: { webhookUrl: string; isConnected: boolean };
  stripe?: { publishableKey: string; secretKey: string; isConnected: boolean };
  paypal?: { clientId: string; isConnected: boolean };
  gofundme?: { campaignUrl: string; isConnected: boolean };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en';
  autoLockMinutes: number;
  biometricEnabled: boolean;
  autoBackupEnabled: boolean;
  lastBackupAt: string | null;
}

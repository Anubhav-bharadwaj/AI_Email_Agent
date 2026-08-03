import type { Customer, Draft, CampaignHistoryLog, AppSettings } from '@/types';
// Simulate an async request
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockUploadCsv = async (_file: File): Promise<{ customers: Customer[] }> => {
  await delay(1000);
  return {
    customers: [
      { id: '1', name: 'Alice Smith', email: 'alice@example.com', interest: 'AI Marketing' },
      { id: '2', name: 'Bob Jones', email: 'bob@example.com', interest: 'Sales Automation' },
      { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', interest: 'Data Analytics' },
    ],
  };
};

export const mockGenerateDrafts = async (customers: Customer[]): Promise<{ drafts: Draft[] }> => {
  await delay(2000);
  const drafts = customers.map((c) => ({
    id: `draft_${c.id}`,
    customerId: c.id,
    subject: `Boost your ${c.interest} with MailForge AI`,
    bodyPlain: `Hi ${c.name},\n\nWe noticed your interest in ${c.interest}. MailForge AI can help you scale.\n\nBest,\nMailForge Team`,
    bodyHtml: `<html><body><p>Hi ${c.name},</p><p>We noticed your interest in <strong>${c.interest}</strong>. MailForge AI can help you scale.</p><p>Best,<br/>MailForge Team</p></body></html>`,
  }));
  return { drafts };
};

export const mockSendCampaign = async (drafts: Draft[], _isDryRun: boolean): Promise<{ success: boolean; sent: number; failed: number }> => {
  await delay(3000);
  return { success: true, sent: drafts.length - (drafts.length > 1 ? 1 : 0), failed: drafts.length > 1 ? 1 : 0 };
};

export const mockGetHistory = async (): Promise<{ logs: CampaignHistoryLog[] }> => {
  await delay(500);
  return {
    logs: [
      { id: '101', name: 'David Lee', email: 'david@test.com', interest: 'SEO', status: 'Sent', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: '102', name: 'Emma Watson', email: 'emma@test.com', interest: 'Ads', status: 'Failed', timestamp: new Date(Date.now() - 80000000).toISOString() },
      { id: '103', name: 'Frank Ocean', email: 'frank@test.com', interest: 'Music', status: 'Skipped', timestamp: new Date(Date.now() - 70000000).toISOString() },
    ],
  };
};

export const mockClearHistory = async (): Promise<{ success: boolean }> => {
  await delay(800);
  return { success: true };
};

const defaultSettings: AppSettings = {
  smtpHost: 'smtp.mailtrap.io',
  smtpPort: 2525,
  smtpUser: 'user123',
  smtpPass: 'pass123',
  apiProvider: 'Groq',
  groqApiKey: 'gsk_xxxxxx',
  rateLimit: 10,
  defaultDryRun: true,
  theme: 'dark',
  companyName: 'Acme Corp',
  companyEmail: 'hello@acme.com',
};

export const mockGetSettings = async (): Promise<AppSettings> => {
  await delay(500);
  return { ...defaultSettings };
};

export const mockUpdateSettings = async (_settings: Partial<AppSettings>): Promise<{ success: boolean }> => {
  await delay(1000);
  return { success: true };
};

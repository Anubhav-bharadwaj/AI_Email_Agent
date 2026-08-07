import api from '@/lib/axios';

// Simulate an async request
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const uploadCsv = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/customers/upload', formData, {
    headers: { 'Content-Type': undefined }
  });
  return response.data;
};

export const startGenerate = async (customers) => {
  const response = await api.post('/campaigns/generate', { customers });
  return response.data;
};

export const getGenerateStatus = async (jobId) => {
  const response = await api.get(`/campaigns/generate/status/${jobId}`);
  return response.data;
};

export const startSend = async (customers, drafts, isDryRun) => {
  const response = await api.post('/campaigns/send', { customers, drafts, isDryRun });
  return response.data;
};

export const getSendStatus = async (jobId) => {
  const response = await api.get(`/campaigns/send/status/${jobId}`);
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history');
  return { logs: response.data };
};

export const clearHistory = async () => {
  await api.delete('/history');
  return { success: true };
};

export const getDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

export const getAnalyticsVolume = async () => {
  const response = await api.get('/analytics/volume');
  return response.data;
};

const defaultSettings = {
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
  companyEmail: 'hello@acme.com'
};

export const mockGetSettings = async () => {
  await delay(500);
  return { ...defaultSettings };
};

export const mockUpdateSettings = async (_settings) => {
  await delay(1000);
  return { success: true };
};
export interface Customer {
  id: string;
  name: string;
  email: string;
  interest: string;
}

export interface Draft {
  id: string;
  customerId: string;
  subject: string;
  bodyPlain: string;
  bodyHtml: string;
}

export interface CampaignSummary {
  totalCustomers: number;
  generated: number;
  sent: number;
  failed: number;
  skipped: number;
  duration?: string;
}

export interface CampaignHistoryLog {
  id: string;
  name: string;
  email: string;
  interest: string;
  status: 'Sent' | 'Failed' | 'Skipped';
  timestamp: string;
}

export interface AppSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  apiProvider: 'Groq' | 'OpenAI' | 'Anthropic';
  groqApiKey: string;
  rateLimit: number;
  defaultDryRun: boolean;
  theme: 'light' | 'dark' | 'system';
  companyName: string;
  companyEmail: string;
}

export interface ChartData {
  name: string;
  successRate?: number;
  sent?: number;
  failed?: number;
  value?: number;
}

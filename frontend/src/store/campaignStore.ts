import { create } from 'zustand';
import type { Customer, Draft, CampaignSummary } from '@/types';

interface CampaignState {
  step: number;
  customers: Customer[];
  drafts: Draft[];
  isGenerating: boolean;
  isSending: boolean;
  summary: CampaignSummary | null;
  setStep: (step: number) => void;
  setCustomers: (customers: Customer[]) => void;
  setDrafts: (drafts: Draft[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setIsSending: (isSending: boolean) => void;
  setSummary: (summary: CampaignSummary | null) => void;
  resetCampaign: () => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  step: 1,
  customers: [],
  drafts: [],
  isGenerating: false,
  isSending: false,
  summary: null,
  setStep: (step) => set({ step }),
  setCustomers: (customers) => set({ customers }),
  setDrafts: (drafts) => set({ drafts }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setIsSending: (isSending) => set({ isSending }),
  setSummary: (summary) => set({ summary }),
  resetCampaign: () => set({ step: 1, customers: [], drafts: [], isGenerating: false, isSending: false, summary: null }),
}));

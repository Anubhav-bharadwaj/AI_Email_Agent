import { create } from 'zustand';

export const useCampaignStore = create((set) => ({
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
  resetCampaign: () => set({ step: 1, customers: [], drafts: [], isGenerating: false, isSending: false, summary: null })
}));
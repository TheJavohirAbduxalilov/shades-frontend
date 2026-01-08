import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DraftData, WizardState } from './wizardStore';

export interface DraftState {
  drafts: Record<string, DraftData | WizardState['data']>;
  saveDraft: (key: string, entry: DraftData) => void;
  loadDraft: (key: string) => DraftData | null;
  deleteDraft: (key: string) => void;
}

const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      saveDraft: (key, entry) =>
        set((state) => ({
          drafts: { ...state.drafts, [key]: entry },
        })),
      loadDraft: (key) => {
        const stored = get().drafts[key];
        if (!stored) {
          return null;
        }
        if (typeof stored === 'object' && 'currentStep' in stored) {
          return stored as DraftData;
        }
        return { ...(stored as WizardState['data']), currentStep: 1 };
      },
      deleteDraft: (key) =>
        set((state) => {
          const next = { ...state.drafts };
          delete next[key];
          return { drafts: next };
        }),
    }),
    {
      name: 'draft-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useDraftStore;

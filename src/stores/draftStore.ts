import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { WizardState } from './wizardStore';

export interface DraftState {
  drafts: Record<string, WizardState['data']>;
  saveDraft: (key: string, data: WizardState['data']) => void;
  loadDraft: (key: string) => WizardState['data'] | null;
  deleteDraft: (key: string) => void;
}

const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      saveDraft: (key, data) =>
        set((state) => ({
          drafts: { ...state.drafts, [key]: data },
        })),
      loadDraft: (key) => get().drafts[key] ?? null,
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

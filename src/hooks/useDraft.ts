import { useEffect } from 'react';
import useDraftStore from '../stores/draftStore';
import { WizardState } from '../stores/wizardStore';

export const useDraft = (key: string, data: WizardState['data'], enabled = true) => {
  const saveDraft = useDraftStore((state) => state.saveDraft);
  const deleteDraft = useDraftStore((state) => state.deleteDraft);
  const draft = useDraftStore((state) => state.drafts[key] ?? null);
  const serialized = JSON.stringify(data);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    saveDraft(key, data);
  }, [key, serialized, enabled, saveDraft, data]);

  return {
    draft,
    clearDraft: () => deleteDraft(key),
  };
};

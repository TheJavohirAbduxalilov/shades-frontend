import { useEffect } from 'react';
import useDraftStore from '../stores/draftStore';
import { DraftData, WizardState } from '../stores/wizardStore';

const normalizeDraft = (draft: DraftData | WizardState['data'] | null): DraftData | null => {
  if (!draft) {
    return null;
  }
  if (typeof draft === 'object' && 'currentStep' in draft) {
    return draft as DraftData;
  }
  return { ...(draft as WizardState['data']), currentStep: 1 };
};

export const useDraft = (
  key: string,
  data: WizardState['data'],
  currentStep: number,
  enabled = true
) => {
  const saveDraft = useDraftStore((state) => state.saveDraft);
  const deleteDraft = useDraftStore((state) => state.deleteDraft);
  const draft = useDraftStore((state) => normalizeDraft(state.drafts[key] ?? null));
  const serialized = JSON.stringify(data);
  const hasWindowName = Boolean(data.windowName && data.windowName.trim());

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (!hasWindowName) {
      return;
    }
    saveDraft(key, { ...data, currentStep });
  }, [key, serialized, currentStep, enabled, hasWindowName, saveDraft, data]);

  useEffect(() => {
    return () => {
      if (!enabled) {
        return;
      }
      if (!hasWindowName) {
        return;
      }
      saveDraft(key, { ...data, currentStep });
    };
  }, [key, serialized, currentStep, enabled, hasWindowName, saveDraft, data]);

  return {
    draft,
    clearDraft: () => deleteDraft(key),
  };
};

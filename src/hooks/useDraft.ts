import { useEffect, useRef } from 'react';
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
  const latestRef = useRef({ key, data, currentStep, hasWindowName });
  const activeRef = useRef(enabled);

  useEffect(() => {
    latestRef.current = { key, data, currentStep, hasWindowName };
  }, [key, data, currentStep, hasWindowName]);

  useEffect(() => {
    activeRef.current = enabled;
  }, [enabled]);

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
      const latest = latestRef.current;
      if (!activeRef.current || !latest.hasWindowName) {
        return;
      }
      saveDraft(latest.key, { ...latest.data, currentStep: latest.currentStep });
    };
  }, [saveDraft]);

  return {
    draft,
    clearDraft: () => {
      activeRef.current = false;
      if (import.meta.env.DEV) {
        console.log('Deleting draft with key:', key);
      }
      deleteDraft(key);
    },
  };
};

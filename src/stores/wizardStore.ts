import { create } from 'zustand';
import { Shade } from '../types';

export interface DraftData {
  windowName: string;
  shadeTypeId: number | null;
  options: { optionTypeId: number; optionValueId: number }[];
  width: number | null;
  height: number | null;
  materialId: number | null;
  materialVariantId: number | null;
  installationIncluded: boolean;
  removalIncluded: boolean;
  currentStep: number;
}

export type PartialDraftData = Partial<Omit<DraftData, 'currentStep'>>;

export interface WizardState {
  currentStep: number;
  data: DraftData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: PartialDraftData) => void;
  reset: () => void;
  loadFromDraft: (draft: DraftData) => void;
  copyFromPrevious: (previousShade: Shade) => void;
}

const initialData: DraftData = {
  windowName: '',
  shadeTypeId: null,
  options: [],
  width: null,
  height: null,
  materialId: null,
  materialVariantId: null,
  installationIncluded: false,
  removalIncluded: false,
  currentStep: 1,
};

const useWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  data: initialData,
  setStep: (step) =>
    set((state) => ({
      currentStep: step,
      data: { ...state.data, currentStep: step },
    })),
  nextStep: () =>
    set((state) => {
      const nextStep = state.currentStep + 1;
      return {
        currentStep: nextStep,
        data: { ...state.data, currentStep: nextStep },
      };
    }),
  prevStep: () =>
    set((state) => {
      const prevStep = Math.max(1, state.currentStep - 1);
      return {
        currentStep: prevStep,
        data: { ...state.data, currentStep: prevStep },
      };
    }),
  updateData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),
  reset: () =>
    set({
      currentStep: 1,
      data: { ...initialData, currentStep: 1 },
    }),
  loadFromDraft: (draft) => {
    const nextStep = Math.max(1, draft.currentStep || 1);
    set({
      currentStep: nextStep,
      data: { ...initialData, ...draft, currentStep: nextStep },
    });
  },
  copyFromPrevious: (previousShade) => {
    set((state) => ({
      data: {
        ...state.data,
        shadeTypeId: previousShade.shadeTypeId,
        options: previousShade.options.map((option) => ({
          optionTypeId: option.optionTypeId,
          optionValueId: option.optionValueId,
        })),
        materialVariantId: previousShade.materialVariantId,
        installationIncluded: previousShade.installationIncluded,
        removalIncluded: previousShade.removalIncluded,
      },
    }));
  },
}));

export default useWizardStore;

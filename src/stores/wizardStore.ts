import { create } from 'zustand';
import { Shade } from '../types';

export interface WizardState {
  currentStep: number;
  data: {
    windowName: string;
    shadeTypeId: number | null;
    options: { optionTypeId: number; optionValueId: number }[];
    width: number | null;
    height: number | null;
    materialId: number | null;
    materialVariantId: number | null;
    installationIncluded: boolean;
    removalIncluded: boolean;
  };
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<WizardState['data']>) => void;
  reset: () => void;
  loadFromDraft: (draft: DraftData) => void;
  copyFromPrevious: (previousShade: Shade) => void;
}

export interface DraftData extends WizardState['data'] {
  currentStep: number;
}

const initialData: WizardState['data'] = {
  windowName: '',
  shadeTypeId: null,
  options: [],
  width: null,
  height: null,
  materialId: null,
  materialVariantId: null,
  installationIncluded: false,
  removalIncluded: false,
};

const useWizardStore = create<WizardState>((set, get) => ({
  currentStep: 1,
  data: initialData,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set({ currentStep: get().currentStep + 1 }),
  prevStep: () => set({ currentStep: Math.max(1, get().currentStep - 1) }),
  updateData: (data) => set({ data: { ...get().data, ...data } }),
  reset: () => set({ currentStep: 1, data: initialData }),
  loadFromDraft: (draft) => {
    const { currentStep, ...rest } = draft;
    set({
      currentStep: Math.max(1, currentStep || 1),
      data: { ...initialData, ...rest },
    });
  },
  copyFromPrevious: (previousShade) => {
    set({
      data: {
        ...get().data,
        shadeTypeId: previousShade.shadeTypeId,
        options: previousShade.options.map((option) => ({
          optionTypeId: option.optionTypeId,
          optionValueId: option.optionValueId,
        })),
        materialVariantId: previousShade.materialVariantId,
        installationIncluded: previousShade.installationIncluded,
        removalIncluded: previousShade.removalIncluded,
      },
    });
  },
}));

export default useWizardStore;

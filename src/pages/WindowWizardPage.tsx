import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import WizardLayout from '../components/wizard/WizardLayout';
import StepWindowName from '../components/wizard/steps/StepWindowName';
import StepShadeType from '../components/wizard/steps/StepShadeType';
import StepInstallation from '../components/wizard/steps/StepInstallation';
import StepControl from '../components/wizard/steps/StepControl';
import StepDimensions from '../components/wizard/steps/StepDimensions';
import StepMaterial from '../components/wizard/steps/StepMaterial';
import StepColor from '../components/wizard/steps/StepColor';
import StepServices from '../components/wizard/steps/StepServices';
import StepConfirmation from '../components/wizard/steps/StepConfirmation';
import CopyPreviousModal from '../components/wizard/CopyPreviousModal';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { toast } from '../components/ui/Toast';
import { useCatalog } from '../hooks/useCatalog';
import { useOrder } from '../hooks/useOrders';
import { useDraft } from '../hooks/useDraft';
import { useCreateShade, useUpdateShade } from '../hooks/useShades';
import { useCreateWindow, useUpdateWindow } from '../hooks/useWindows';
import useWizardStore from '../stores/wizardStore';
import { Catalog, Shade, Window } from '../types';

interface WizardErrors {
  windowName?: string;
  shadeTypeId?: string;
  installation?: string;
  control?: string;
  width?: string;
  height?: string;
  materialId?: string;
  materialVariantId?: string;
}

const TOTAL_STEPS = 9;

const getOptionType = (catalog: Catalog | undefined, shadeTypeId: number | null, index: number) => {
  if (!catalog || !shadeTypeId) {
    return null;
  }

  const shadeType = catalog.shadeTypes.find((item) => item.id === shadeTypeId);
  if (!shadeType) {
    return null;
  }

  const sorted = [...shadeType.optionTypes].sort((a, b) => a.displayOrder - b.displayOrder);
  return sorted[index] || null;
};

const findMaterialIdFromShade = (catalog: Catalog | undefined, shade: Shade | null) => {
  if (!catalog || !shade) {
    return null;
  }

  const matchByVariant = catalog.materials.find((material) =>
    material.variants.some((variant) => variant.id === shade.materialVariantId)
  );
  if (matchByVariant) {
    return matchByVariant.id;
  }

  const matchByName = catalog.materials.find((material) => material.name === shade.materialName);
  return matchByName ? matchByName.id : null;
};

const WindowWizardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.orderId || '';
  const windowId = params.windowId;
  const isEditing = Boolean(windowId);

  const { data: order, isLoading: orderLoading, isError: orderError } = useOrder(orderId);
  const { data: catalog, isLoading: catalogLoading, isError: catalogError } = useCatalog();

  const wizard = useWizardStore();
  const draftKey = orderId + '-' + (windowId || 'new');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(isEditing);
  const { draft, clearDraft } = useDraft(draftKey, wizard.data, wizard.currentStep, autoSaveEnabled);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [errors, setErrors] = useState<WizardErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const copyOfferShown = useRef(false);
  const initialized = useRef(false);
  const initializedNew = useRef(false);

  const createWindow = useCreateWindow();
  const updateWindow = useUpdateWindow();
  const createShade = useCreateShade();
  const updateShade = useUpdateShade();

  const windowItem: Window | null = useMemo(() => {
    if (!order) {
      return null;
    }
    return order.windows.find((item) => String(item.id) === String(windowId)) || null;
  }, [order, windowId]);

  const isVertical = useMemo(() => {
    if (!catalog || !wizard.data.shadeTypeId) {
      return false;
    }
    const shadeType = catalog.shadeTypes.find((item) => item.id === wizard.data.shadeTypeId);
    const name = shadeType ? shadeType.name.toLowerCase() : '';
    return name.includes('\u0432\u0435\u0440\u0442\u0438\u043a') || name.includes('vertical');
  }, [catalog, wizard.data.shadeTypeId]);

  useEffect(() => {
    if (isEditing || initializedNew.current) {
      return;
    }
    wizard.reset();
    wizard.setStep(1);
    initializedNew.current = true;
  }, [isEditing, wizard]);

  useEffect(() => {
    if (!isEditing || !order || !catalog || initialized.current) {
      return;
    }

    if (windowItem) {
      const shade = windowItem.shade;
      const materialId = findMaterialIdFromShade(catalog, shade);

      wizard.reset();
      wizard.updateData({
        windowName: windowItem.name,
        shadeTypeId: shade ? shade.shadeTypeId : null,
        options: shade
          ? shade.options.map((option) => ({
              optionTypeId: option.optionTypeId,
              optionValueId: option.optionValueId,
            }))
          : [],
        width: shade ? shade.width : null,
        height: shade ? shade.height : null,
        materialId,
        materialVariantId: shade ? shade.materialVariantId : null,
        installationIncluded: shade ? shade.installationIncluded : false,
        removalIncluded: shade ? shade.removalIncluded : false,
      });
    }

    wizard.setStep(1);
    setAutoSaveEnabled(true);
    initialized.current = true;
  }, [catalog, isEditing, order, windowItem, wizard]);

  useEffect(() => {
    if (isEditing || autoSaveEnabled) {
      return;
    }

    if (draft) {
      setShowResumeModal(true);
      return;
    }

    setAutoSaveEnabled(true);
  }, [autoSaveEnabled, draft, isEditing]);

  useEffect(() => {
    if (isEditing || !order || copyOfferShown.current || !autoSaveEnabled) {
      return;
    }

    if (wizard.data.shadeTypeId || wizard.data.materialVariantId) {
      return;
    }

    const previousShade = order.windows
      .map((item) => item.shade)
      .filter(Boolean)
      .slice(-1)[0] as Shade | undefined;

    if (previousShade) {
      setShowCopyModal(true);
      copyOfferShown.current = true;
    }
  }, [autoSaveEnabled, isEditing, order, wizard.data.materialVariantId, wizard.data.shadeTypeId]);

  useEffect(() => {
    setErrors({});
  }, [wizard.currentStep]);

  const handleResumeDraft = () => {
    if (draft) {
      const safeStep = Math.min(Math.max(1, draft.currentStep), TOTAL_STEPS);
      wizard.loadFromDraft({ ...draft, currentStep: safeStep });
    }
    setAutoSaveEnabled(true);
    setShowResumeModal(false);
  };

  const handleStartNew = () => {
    clearDraft();
    wizard.reset();
    wizard.setStep(1);
    setAutoSaveEnabled(true);
    setShowResumeModal(false);
  };

  const handleCloseResumeModal = () => {
    setShowResumeModal(false);
    setAutoSaveEnabled(true);
  };

  const handleCopyPrevious = () => {
    if (!order) {
      return;
    }
    const previousShade = order.windows
      .map((item) => item.shade)
      .filter(Boolean)
      .slice(-1)[0] as Shade | undefined;

    if (!previousShade) {
      setShowCopyModal(false);
      return;
    }

    wizard.copyFromPrevious(previousShade);
    const materialId = findMaterialIdFromShade(catalog, previousShade);
    wizard.updateData({ windowName: '', width: null, height: null, materialId });
    setShowCopyModal(false);
  };

  const validateStep = () => {
    const nextErrors: WizardErrors = {};

    if (wizard.currentStep === 1 && !wizard.data.windowName.trim()) {
      nextErrors.windowName = t('errors.required');
    }

    if (wizard.currentStep === 2 && !wizard.data.shadeTypeId) {
      nextErrors.shadeTypeId = t('errors.required');
    }

    if (wizard.currentStep === 3) {
      const optionType = getOptionType(catalog, wizard.data.shadeTypeId, 0);
      const selected = optionType
        ? wizard.data.options.find((option) => option.optionTypeId === optionType.id)
        : null;
      if (!selected) {
        nextErrors.installation = t('errors.required');
      }
    }

    if (wizard.currentStep === 4) {
      const optionType = getOptionType(catalog, wizard.data.shadeTypeId, 1);
      const selected = optionType
        ? wizard.data.options.find((option) => option.optionTypeId === optionType.id)
        : null;
      if (!selected) {
        nextErrors.control = t('errors.required');
      }
    }

    if (wizard.currentStep === 5) {
      if (!wizard.data.width || wizard.data.width <= 0) {
        nextErrors.width = t('errors.invalidNumber');
      }
      if (!wizard.data.height || wizard.data.height <= 0) {
        nextErrors.height = t('errors.invalidNumber');
      }
    }

    if (wizard.currentStep === 6 && !wizard.data.materialId) {
      nextErrors.materialId = t('errors.required');
    }

    if (wizard.currentStep === 7 && !wizard.data.materialVariantId) {
      nextErrors.materialVariantId = t('errors.required');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      return;
    }

    if (wizard.currentStep < TOTAL_STEPS) {
      wizard.nextStep();
      return;
    }

    if (!orderId) {
      return;
    }

    const payload = {
      shadeTypeId: wizard.data.shadeTypeId,
      options: wizard.data.options,
      width: wizard.data.width,
      height: wizard.data.height,
      materialVariantId: wizard.data.materialVariantId,
      installationIncluded: wizard.data.installationIncluded,
      removalIncluded: wizard.data.removalIncluded,
    };

    try {
      setIsSaving(true);
      let targetWindowId = windowId || '';

      if (isEditing && windowId) {
        await updateWindow.mutateAsync({
          windowId,
          payload: { name: wizard.data.windowName },
        });
      } else {
        const created = await createWindow.mutateAsync({
          orderId,
          payload: { name: wizard.data.windowName },
        });
        targetWindowId = String(created.id);
      }

      const existingShade = windowItem?.shade || null;
      if (existingShade) {
        await updateShade.mutateAsync({
          shadeId: String(existingShade.id),
          payload,
        });
      } else if (targetWindowId) {
        await createShade.mutateAsync({
          windowId: targetWindowId,
          payload,
        });
      }

      setAutoSaveEnabled(false);
      clearDraft();
      wizard.reset();
      toast.success(t('common.saved'));
      navigate('/orders/' + orderId);
    } catch {
      toast.error(t('errors.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrev = () => {
    if (wizard.currentStep === 1) {
      navigate('/orders/' + orderId);
      return;
    }
    wizard.prevStep();
  };

  const stepTitles = [
    t('wizard.windowName'),
    t('wizard.shadeType'),
    isVertical ? t('wizard.mounting') : t('wizard.installation'),
    isVertical ? t('wizard.slideType') : t('wizard.controlSide'),
    t('wizard.dimensions'),
    t('wizard.material'),
    t('wizard.color'),
    t('wizard.services'),
    t('wizard.confirmation'),
  ];

  const steps = [
    <StepWindowName key="step-1" error={errors.windowName} />,
    <StepShadeType key="step-2" catalog={catalog} error={errors.shadeTypeId} />,
    <StepInstallation key="step-3" catalog={catalog} error={errors.installation} />,
    <StepControl key="step-4" catalog={catalog} error={errors.control} />,
    <StepDimensions key="step-5" widthError={errors.width} heightError={errors.height} />,
    <StepMaterial key="step-6" catalog={catalog} error={errors.materialId} />,
    <StepColor key="step-7" catalog={catalog} error={errors.materialVariantId} />,
    <StepServices key="step-8" catalog={catalog} />,
    <StepConfirmation key="step-9" catalog={catalog} />,
  ];

  if (orderLoading) {
    return (
      <div className="mx-auto flex max-w-xl items-center gap-2 px-4 pb-28 pt-6 text-sm text-slate-500">
        <Spinner size="sm" />
        {t('common.loading')}
      </div>
    );
  }

  if (orderError || !order) {
    return <p className="mx-auto max-w-xl px-4 pb-28 pt-6 text-sm text-error">{t('errors.network')}</p>;
  }

  if (isEditing && !windowItem) {
    return <p className="mx-auto max-w-xl px-4 pb-28 pt-6 text-sm text-error">{t('errors.unknown')}</p>;
  }

  return (
    <>
      <WizardLayout
        title={stepTitles[wizard.currentStep - 1]}
        currentStep={wizard.currentStep}
        totalSteps={TOTAL_STEPS}
        onNext={handleNext}
        onPrev={handlePrev}
        nextLabel={wizard.currentStep === TOTAL_STEPS ? t('common.save') : undefined}
        isNextLoading={isSaving}
        isNextDisabled={catalogLoading && wizard.currentStep > 1}
      >
        <div key={wizard.currentStep} className="animate-fade-in">
          {catalogError ? <p className="mb-3 text-sm text-error">{t('errors.network')}</p> : null}
          {steps[wizard.currentStep - 1]}
        </div>
      </WizardLayout>

      <Modal
        isOpen={showResumeModal}
        title={t('wizard.resumeTitle')}
        onClose={handleCloseResumeModal}
        actions={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={handleStartNew}>
              {t('common.startOver')}
            </Button>
            <Button onClick={handleResumeDraft}>{t('common.continue')}</Button>
          </div>
        }
      >
        {t('wizard.resumeMessage')}
      </Modal>

      <CopyPreviousModal isOpen={showCopyModal} onConfirm={handleCopyPrevious} onClose={() => setShowCopyModal(false)} />
    </>
  );
};

export default WindowWizardPage;

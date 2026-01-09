import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { getOrderByTrackingCode } from '../api/orders.api';
import PageTransition from '../components/ui/PageTransition';
import LoadingScreen from '../components/ui/LoadingScreen';
import { formatDate } from '../utils/formatDate';
import { formatPrice } from '../utils/formatPrice';

const statusSteps = ['new', 'in_progress', 'measured', 'completed'];

const TrackingPage = () => {
  const { trackingCode } = useParams();
  const { t, i18n } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tracking', trackingCode, i18n.language],
    queryFn: () => getOrderByTrackingCode(trackingCode || '', i18n.language),
    enabled: Boolean(trackingCode),
  });

  if (isLoading) {
    return (
      <PageTransition>
        <LoadingScreen />
      </PageTransition>
    );
  }

  if (isError || !data) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">{t('tracking.notFound')}</h1>
            <p className="mt-2 text-sm text-slate-600">{t('tracking.notFoundDescription')}</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { order, companyInfo } = data;
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 px-4 py-6">
        <div className="mx-auto max-w-lg space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">{t('tracking.title')}</h1>
            <p className="mt-1 text-sm text-slate-500">#{order.trackingCode}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">{t('tracking.status')}</h2>
            <div className="mt-4 space-y-4">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={[
                          'flex h-8 w-8 items-center justify-center rounded-full text-white',
                          isCompleted ? 'bg-emerald-500' : 'bg-slate-200 text-slate-400',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {isCompleted ? (
                          <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                          <ClockIcon className="h-5 w-5" />
                        )}
                      </div>
                      {index < statusSteps.length - 1 ? (
                        <div
                          className={[
                            'h-8 w-0.5',
                            index < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-200',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        />
                      ) : null}
                    </div>
                    <div className={['flex-1 pb-2', isCurrent ? 'font-medium text-slate-900' : 'text-slate-500']
                      .filter(Boolean)
                      .join(' ')}>
                      {t(`status.${step}`)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">{t('tracking.visitDate')}</h2>
            <p className="mt-2 text-sm text-slate-600">{formatDate(order.visitDate, i18n.language)}</p>
          </div>

          {order.windows.length ? (
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">{t('tracking.orderDetails')}</h2>
              <div className="mt-4 space-y-3">
                {order.windows.map((windowItem) => {
                  const price =
                    windowItem.shade?.calculatedPrice ?? windowItem.shade?.totalPrice ?? null;
                  return (
                    <div
                      key={windowItem.id}
                      className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{windowItem.name}</p>
                        {windowItem.shade ? (
                          <>
                            <p className="text-xs text-slate-500">{windowItem.shade.shadeTypeName}</p>
                            <p className="text-xs text-slate-500">
                              {windowItem.shade.width} x {windowItem.shade.height} мм
                            </p>
                          </>
                        ) : null}
                      </div>
                      {typeof price === 'number' ? (
                        <p className="text-sm font-semibold text-slate-900">
                          {formatPrice(price)} {t('price.currency')}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">{t('price.notCalculated')}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-slate-900">{t('tracking.total')}</span>
                <span className="text-base font-semibold text-slate-900">
                  {formatPrice(order.totalPrice)} {t('price.currency')}
                </span>
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">{t('tracking.contactUs')}</h2>
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold text-slate-900">{companyInfo.name}</p>
              <a
                href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600"
              >
                <PhoneIcon className="h-5 w-5" />
                {companyInfo.phone}
              </a>
              <p className="text-xs text-slate-500">{companyInfo.workingHours}</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default TrackingPage;

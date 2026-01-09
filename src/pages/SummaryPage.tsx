import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryList from '../components/summary/SummaryList';
import SummaryTotal from '../components/summary/SummaryTotal';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import LoadingScreen from '../components/ui/LoadingScreen';
import PageTransition from '../components/ui/PageTransition';
import { toast } from '../components/ui/Toast';
import { useOrder } from '../hooks/useOrders';

const SummaryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.orderId || '';
  const { data: order, isLoading, isError } = useOrder(orderId);

  if (isLoading) {
    return (
      <PageTransition>
        <LoadingScreen />
      </PageTransition>
    );
  }

  if (isError || !order) {
    return (
      <PageTransition>
        <p className="mx-auto max-w-xl px-4 pb-28 pt-6 text-sm text-error">{t('errors.network')}</p>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-6">
        <PageHeader title={t('summary.title')} onBack={() => navigate('/orders/' + orderId)} />
        <SummaryList windows={order.windows} />
        <SummaryTotal windows={order.windows} totalPrice={order.totalPrice} />
        <Button variant="secondary" onClick={() => navigate('/orders/' + orderId)}>
          {t('summary.backToWindows')}
        </Button>
        <Button
          onClick={() => {
            toast.success(t('summary.orderConfirmed'));
          }}
        >
          {t('summary.confirmOrder')}
        </Button>
      </div>
    </PageTransition>
  );
};

export default SummaryPage;
